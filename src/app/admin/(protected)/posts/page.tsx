import Link from "next/link";
import { listPosts } from "@/lib/db/queries";
import { POST_CATEGORIES } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { Pagination } from "@/components/board/Pagination";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export default async function AdminPostsPage({
  searchParams,
}: PageProps<"/admin/posts">) {
  const params = await searchParams;
  const page = Number(typeof params.page === "string" ? params.page : "1") || 1;

  const { items, total, totalPages } = await listPosts({ page });

  return (
    <div className="container-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display-md text-brand-900">게시글 관리</h1>
          <p className="mt-1 text-[13px] text-ink-400">총 {total}건</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-btn bg-brand-900 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-800"
        >
          + 새 글 작성
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-card border border-line bg-page">
        {items.length === 0 ? (
          <p className="px-6 py-20 text-center text-[14px] text-ink-400">
            등록된 게시글이 없습니다. 첫 글을 작성해 보세요.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="flex shrink-0 items-center gap-2">
                  {post.isPinned && (
                    <span className="rounded-btn bg-accent-500 px-2 py-1 text-[11px] font-bold text-white">
                      중요
                    </span>
                  )}
                  <span className="rounded-btn bg-brand-50 px-2.5 py-1 text-[12px] font-bold text-brand-700">
                    {POST_CATEGORIES[post.category]}
                  </span>
                </span>

                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="flex-1 truncate text-[15px] font-medium text-ink-900 hover:text-brand-700"
                >
                  {post.title}
                </Link>

                <span className="shrink-0 text-[13px] text-ink-400">
                  {formatDate(post.createdAt)} · 조회 {post.viewCount}
                </span>

                <span className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/board/${post.id}`}
                    target="_blank"
                    className="rounded-btn px-3 py-1.5 text-[13px] font-bold text-ink-500 transition-colors hover:bg-surface"
                  >
                    보기
                  </Link>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded-btn px-3 py-1.5 text-[13px] font-bold text-brand-600 transition-colors hover:bg-brand-50"
                  >
                    수정
                  </Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(target) =>
            target === 1 ? "/admin/posts" : `/admin/posts?page=${target}`
          }
        />
      )}
    </div>
  );
}
