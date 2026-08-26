"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createSession,
  destroySession,
  requireAdmin,
  verifyCredentials,
} from "@/lib/auth";
import { checkLoginRateLimit, resetLoginRateLimit } from "@/lib/rate-limit";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { attachments, posts } from "@/lib/db/schema";
import { sanitizePostContent } from "@/lib/sanitize";
import { extractBlobImageUrls, parseAttachmentsField } from "@/lib/attachments";
import { deleteBlobs } from "@/lib/blob";
import type { ActionState } from "@/lib/action-state";

/* ---------------------------------- 로그인 --------------------------------- */

const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력해 주세요.").max(100),
  password: z.string().min(1, "비밀번호를 입력해 주세요.").max(200),
});

async function getClientKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isDatabaseConfigured()) {
    return { error: "데이터베이스가 설정되지 않았습니다. 관리자에게 문의해 주세요." };
  }

  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요." };
  }

  const clientKey = await getClientKey();
  const limit = checkLoginRateLimit(clientKey);
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return {
      error: `로그인 시도가 너무 많습니다. 약 ${minutes}분 후 다시 시도해 주세요.`,
    };
  }

  const session = await verifyCredentials(
    parsed.data.username,
    parsed.data.password,
  );

  if (!session) {
    // 아이디/비밀번호 중 무엇이 틀렸는지 알리지 않음
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  resetLoginRateLimit(clientKey);
  await createSession(session);
  redirect("/admin/posts");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

/* --------------------------------- 게시글 CRUD -------------------------------- */

const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(300, "제목은 300자 이내로 입력해 주세요."),
  category: z.enum(["support", "notice", "finance"]),
  content: z.string().max(200_000),
  isPinned: z.boolean(),
});

function parsePostForm(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content") ?? "",
    isPinned: formData.get("isPinned") === "on",
  });
}

export async function savePostAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요." };
  }

  const rawId = formData.get("id");
  const postId = rawId ? Number(rawId) : null;
  const files = parseAttachmentsField(formData.get("attachments") as string | null);

  const values = {
    title: parsed.data.title,
    category: parsed.data.category,
    content: sanitizePostContent(parsed.data.content),
    isPinned: parsed.data.isPinned,
  };

  const db = getDb();
  let savedId: number;

  if (postId && Number.isInteger(postId)) {
    // 본문에서 빠진 이미지도 스토리지에서 지웁니다. 본문 이미지는 attachments
    // 테이블에 없으므로 수정 전후 HTML 을 비교하는 것 말고는 알 방법이 없습니다.
    const [before] = await db
      .select({ content: posts.content })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    await db
      .update(posts)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(posts.id, postId));

    if (before) {
      const stillUsed = new Set(extractBlobImageUrls(values.content));
      const droppedImages = extractBlobImageUrls(before.content).filter(
        (url) => !stillUsed.has(url),
      );
      await deleteBlobs(droppedImages);
    }

    // 첨부파일은 폼 상태를 정본으로 삼아 전체 교체하고,
    // 목록에서 빠진 파일은 스토리지에서도 제거해 고아 파일을 남기지 않습니다.
    const existing = await db
      .select({ fileUrl: attachments.fileUrl })
      .from(attachments)
      .where(eq(attachments.postId, postId));

    const keptUrls = new Set(files.map((file) => file.fileUrl));
    const removedUrls = existing
      .map((row) => row.fileUrl)
      .filter((url) => !keptUrls.has(url));

    await db.delete(attachments).where(eq(attachments.postId, postId));
    await deleteBlobs(removedUrls);
    savedId = postId;
  } else {
    const [created] = await db.insert(posts).values(values).returning({
      id: posts.id,
    });
    savedId = created.id;
  }

  if (files.length > 0) {
    await db
      .insert(attachments)
      .values(files.map((file) => ({ ...file, postId: savedId })));
  }

  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath(`/board/${savedId}`);
  revalidatePath("/admin/posts");

  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const postId = Number(formData.get("id"));
  if (!Number.isInteger(postId) || postId <= 0) {
    return;
  }

  const db = getDb();

  const files = await db
    .select({ fileUrl: attachments.fileUrl })
    .from(attachments)
    .where(eq(attachments.postId, postId));

  // 본문에 삽입된 이미지는 attachments 에 없으므로 HTML 에서 직접 찾아냅니다.
  const [post] = await db
    .select({ content: posts.content })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);
  const inlineImages = post ? extractBlobImageUrls(post.content) : [];

  // attachments 행은 FK ON DELETE CASCADE 로 함께 삭제되지만,
  // 스토리지 파일은 명시적으로 지워야 합니다.
  await db.delete(posts).where(eq(posts.id, postId));
  await deleteBlobs([...files.map((file) => file.fileUrl), ...inlineImages]);

  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath("/admin/posts");
}
