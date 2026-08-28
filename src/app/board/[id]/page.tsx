import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdjacentPosts, getPost, incrementViewCount } from "@/lib/db/queries";
import { POST_CATEGORIES } from "@/lib/db/schema";
import { formatDate, formatFileSize } from "@/lib/format";
import { toPlainTextExcerpt } from "@/lib/sanitize";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/board/[id]">): Promise<Metadata> {
  const { id } = await params;
  const postId = parseId(id);
  if (postId === null) return { title: "게시글" };

  const post = await getPost(postId);
  if (!post) return { title: "게시글을 찾을 수 없습니다" };

  return {
    title: post.title,
    description: toPlainTextExcerpt(post.content, 150),
  };
}

export default async function PostDetailPage({
  params,
}: PageProps<"/board/[id]">) {
  const { id } = await params;
  const postId = parseId(id);
  if (postId === null) notFound();

  const post = await getPost(postId);
  if (!post) notFound();

  await incrementViewCount(postId);
  const { prev, next } = await getAdjacentPosts(post);

  return (
    <article className="container-board py-12 md:py-16">
      <Link
        href="/board"
        className="inline-flex items-center gap-1.5 text-[14px] font-bold text-ink-500 transition-colors hover:text-brand-700"
      >
        ← 목록으로
      </Link>

      <header className="mt-6 border-b border-line pb-7">
        <div className="flex items-center gap-2">
          {post.isPinned && (
            <span className="rounded-btn bg-accent-500 px-2 py-1 text-[11px] font-bold text-white">
              중요
            </span>
          )}
          <span className="rounded-btn bg-brand-50 px-2.5 py-1 text-[12px] font-bold text-brand-700">
            {POST_CATEGORIES[post.category]}
          </span>
        </div>

        <h1 className="display-lg mt-4 text-brand-900">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-400">
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
          <span>조회 {post.viewCount.toLocaleString("ko-KR")}</span>
        </div>
      </header>

      {post.attachments.length > 0 && (
        <section
          aria-label="첨부파일"
          className="mt-7 rounded-card border border-line bg-surface p-5"
        >
          <h2 className="text-[13px] font-bold text-ink-700">첨부파일</h2>
          <ul className="mt-3 space-y-2">
            {post.attachments.map((file) => (
              <li key={file.id}>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.fileName}
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-brand-600 underline underline-offset-4 hover:text-brand-700"
                >
                  <span aria-hidden>📎</span>
                  {file.fileName}
                  <span className="text-[12px] font-normal text-ink-400">
                    ({formatFileSize(file.fileSize)})
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 저장 시 서버에서 sanitize된 HTML만 들어옵니다 (src/lib/sanitize.ts) */}
      <div
        className="prose-board mt-9 min-h-40"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <nav
        aria-label="이전 다음 글"
        className="mt-14 divide-y divide-line border-y border-line"
      >
        {prev && (
          <Link
            href={`/board/${prev.id}`}
            className="flex items-center gap-4 py-4 transition-colors hover:bg-surface"
          >
            <span className="w-14 shrink-0 text-[13px] font-bold text-ink-400">
              이전 글
            </span>
            <span className="truncate text-[14px] text-ink-700">
              {prev.title}
            </span>
          </Link>
        )}
        {next && (
          <Link
            href={`/board/${next.id}`}
            className="flex items-center gap-4 py-4 transition-colors hover:bg-surface"
          >
            <span className="w-14 shrink-0 text-[13px] font-bold text-ink-400">
              다음 글
            </span>
            <span className="truncate text-[14px] text-ink-700">
              {next.title}
            </span>
          </Link>
        )}
      </nav>

      <div className="mt-10 text-center">
        <Link
          href="/board"
          className="inline-block rounded-btn bg-brand-900 px-7 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-800"
        >
          목록으로
        </Link>
      </div>
    </article>
  );
}
