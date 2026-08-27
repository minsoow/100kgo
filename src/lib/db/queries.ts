import "server-only";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNull,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "./index";
import {
  attachments,
  popups,
  posts,
  type Attachment,
  type Popup,
  type Post,
  type PostCategory,
} from "./schema";

export const POSTS_PER_PAGE = 10;

type ListParams = {
  category?: PostCategory;
  page?: number;
  query?: string;
};

export type PostListResult = {
  items: Post[];
  total: number;
  totalPages: number;
  page: number;
};

const EMPTY_LIST: PostListResult = {
  items: [],
  total: 0,
  totalPages: 1,
  page: 1,
};

function buildFilters({ category, query }: ListParams): SQL | undefined {
  const filters: SQL[] = [];

  if (category) {
    filters.push(eq(posts.category, category));
  }

  const keyword = query?.trim();
  if (keyword) {
    const pattern = `%${keyword}%`;
    const match = or(ilike(posts.title, pattern), ilike(posts.content, pattern));
    if (match) filters.push(match);
  }

  if (filters.length === 0) return undefined;
  return filters.length === 1 ? filters[0] : and(...filters);
}

export async function listPosts(params: ListParams = {}): Promise<PostListResult> {
  if (!isDatabaseConfigured()) return EMPTY_LIST;

  const page = Math.max(1, params.page ?? 1);
  const where = buildFilters(params);
  const db = getDb();

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.isPinned), desc(posts.createdAt), desc(posts.id))
      .limit(POSTS_PER_PAGE)
      .offset((page - 1) * POSTS_PER_PAGE),
    db.select({ value: count() }).from(posts).where(where),
  ]);

  const total = totalRow[0]?.value ?? 0;

  return {
    items: rows,
    total,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
    page,
  };
}

/**
 * 랜딩페이지 게시판 미리보기용.
 * 카테고리 구분 없이(공지사항 + 재무고시) 최신 글을 함께 가져옵니다.
 * DB 미설정 시 빈 배열로 안전하게 처리합니다.
 */
export async function getRecentPosts(limit = 5): Promise<Post[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    return await getDb()
      .select()
      .from(posts)
      .orderBy(desc(posts.isPinned), desc(posts.createdAt), desc(posts.id))
      .limit(limit);
  } catch (error) {
    // 랜딩페이지 전체가 DB 장애로 내려가지 않도록 방어
    console.error("[getRecentPosts] 게시글 조회 실패:", error);
    return [];
  }
}

export type PostWithAttachments = Post & { attachments: Attachment[] };

export async function getPost(id: number): Promise<PostWithAttachments | null> {
  if (!isDatabaseConfigured()) return null;

  const db = getDb();
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) return null;

  const files = await db
    .select()
    .from(attachments)
    .where(eq(attachments.postId, id))
    .orderBy(attachments.id);

  return { ...post, attachments: files };
}

export async function incrementViewCount(id: number): Promise<void> {
  if (!isDatabaseConfigured()) return;

  try {
    await getDb()
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, id));
  } catch (error) {
    // 조회수 집계 실패가 본문 열람을 막지 않도록 처리
    console.error("[incrementViewCount] 조회수 증가 실패:", error);
  }
}

/** 이전 글 / 다음 글 (같은 카테고리 기준) */
export async function getAdjacentPosts(post: Post) {
  if (!isDatabaseConfigured()) return { prev: null, next: null };

  const db = getDb();

  const [prev] = await db
    .select({ id: posts.id, title: posts.title })
    .from(posts)
    .where(and(eq(posts.category, post.category), sql`${posts.id} < ${post.id}`))
    .orderBy(desc(posts.id))
    .limit(1);

  const [next] = await db
    .select({ id: posts.id, title: posts.title })
    .from(posts)
    .where(and(eq(posts.category, post.category), sql`${posts.id} > ${post.id}`))
    .orderBy(posts.id)
    .limit(1);

  return { prev: prev ?? null, next: next ?? null };
}

/* ── 팝업 ────────────────────────────────────────────────────────── */

/**
 * 첫 화면에 띄울 팝업 1건.
 *
 * 조건을 만족하는 게 여럿이면 가장 최근에 수정한 것을 씁니다.
 * 팝업을 여러 개 동시에 띄우면 화면을 가리므로 한 번에 하나만 내보냅니다.
 *
 * 기간 비교는 DB 시각(now())으로 합니다. 서버와 DB 시계가 어긋나도
 * 같은 기준으로 판정되게 하려는 것입니다.
 */
export async function getActivePopup(): Promise<Popup | null> {
  if (!isDatabaseConfigured()) return null;

  const [row] = await getDb()
    .select()
    .from(popups)
    .where(
      and(
        eq(popups.isActive, true),
        or(isNull(popups.startsAt), lte(popups.startsAt, sql`now()`)),
        or(isNull(popups.endsAt), gte(popups.endsAt, sql`now()`)),
      ),
    )
    .orderBy(desc(popups.updatedAt))
    .limit(1);

  return row ?? null;
}

/** 관리 화면 목록. 노출 여부와 무관하게 전부 보여줍니다. */
export async function listPopups(): Promise<Popup[]> {
  if (!isDatabaseConfigured()) return [];
  return getDb().select().from(popups).orderBy(desc(popups.updatedAt));
}

export async function getPopup(id: number): Promise<Popup | null> {
  if (!isDatabaseConfigured()) return null;
  const [row] = await getDb()
    .select()
    .from(popups)
    .where(eq(popups.id, id))
    .limit(1);
  return row ?? null;
}
