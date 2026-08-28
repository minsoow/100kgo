import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BOARD_LABEL } from "@/content/association";
import { listPosts } from "@/lib/db/queries";
import { POST_CATEGORIES, type PostCategory } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { Pagination } from "@/components/board/Pagination";

export const metadata: Metadata = {
  // 레이아웃의 canonical("/")을 자기 경로로 덮어씁니다
  alternates: { canonical: "/board" },
  title: BOARD_LABEL,
  description:
    "한국온라인해외직판협회의 지원사업 정보, 공지사항, 재무고시 자료를 확인하실 수 있습니다.",
};

// 탭은 스키마의 카테고리 정의에서 생성합니다 (문구·순서 이중 관리 방지)
const TABS = [
  { value: "", label: "전체" },
  ...Object.entries(POST_CATEGORIES).map(([value, label]) => ({ value, label })),
];

function parseCategory(value: string | undefined): PostCategory | undefined {
  return value && value in POST_CATEGORIES ? (value as PostCategory) : undefined;
}

export default async function BoardPage({ searchParams }: PageProps<"/board">) {
  const params = await searchParams;

  const rawCategory = typeof params.category === "string" ? params.category : undefined;
  const category = parseCategory(rawCategory);
  const query = typeof params.q === "string" ? params.q : "";
  const page = Number(typeof params.page === "string" ? params.page : "1") || 1;

  const { items, total, totalPages } = await listPosts({ category, page, query });

  const buildHref = (next: { category?: string; page?: number }) => {
    const sp = new URLSearchParams();

    const nextCategory = next.category ?? category ?? "";
    if (nextCategory) sp.set("category", nextCategory);
    if (query) sp.set("q", query);

    // 1페이지는 기본값이므로 쿼리에서 생략
    const nextPage = next.page ?? page;
    if (nextPage > 1) sp.set("page", String(nextPage));

    const qs = sp.toString();
    return qs ? `/board?${qs}` : "/board";
  };

  return (
    <>
      {/*
        제목 영역. 회색 배경만 두니 허전해서 사진을 깔았습니다.

        사진은 화면 끝까지 채우고 글자는 본문과 같은 폭(container-board)에
        맞춥니다. 목록으로 스크롤할 때 제목과 글 제목의 시작점이 어긋나면
        눈에 걸립니다.

        스크림(어두운 겹판)은 왼쪽이 더 짙은 가로 그라디언트입니다. 글자가
        왼쪽에 몰려 있어 그쪽만 확실히 눌러 주면 사진의 밝은 부분을 덜
        죽이면서 대비를 확보할 수 있습니다.
      */}
      <section className="relative isolate overflow-hidden bg-brand-950">
        <Image
          src="/images/board-header.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950/92 via-brand-950/80 to-brand-950/55"
        />

        <div className="container-board py-16 md:py-24">
          <h1 className="display-lg text-white">{BOARD_LABEL}</h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-[1.85] text-white/75">
            해외직판 지원사업 정보와 협회 공지사항, 법령에 따른 재무고시 자료를
            한곳에서 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      <div className="container-board py-12 md:py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/*
            홈의 분류 탭과 같은 방식으로 좁은 화면에서 옆으로 넘겨 봅니다.
            min-w-0 이 없으면 flex 부모가 이 칸을 콘텐츠 폭(364px) 밑으로
            줄여주지 않아 페이지 전체에 가로 스크롤이 생깁니다.
          */}
          <nav
            className="scrollbar-none flex min-w-0 gap-1.5 overflow-x-auto"
            aria-label="게시판 분류"
          >
            {TABS.map((tab) => {
              const active = (category ?? "") === tab.value;
              return (
                <Link
                  key={tab.value || "all"}
                  href={buildHref({ category: tab.value, page: 1 })}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 rounded-btn px-4 py-2.5 text-[14px] font-bold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-brand-900 text-white"
                      : "bg-surface text-ink-500 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <form action="/board" method="get" className="flex gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="제목·내용 검색"
              aria-label="게시글 검색"
              className="w-full rounded-btn border border-line px-4 py-2.5 text-[14px] outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400 sm:w-56"
            />
            <button
              type="submit"
              className="shrink-0 rounded-btn border border-line px-4 py-2.5 text-[14px] font-bold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              검색
            </button>
          </form>
        </div>

        <p className="mt-6 text-[13px] text-ink-400">
          총 <strong className="font-bold text-ink-700">{total}</strong>건
          {query && (
            <>
              {" "}
              · &lsquo;{query}&rsquo; 검색 결과
            </>
          )}
        </p>

        {items.length === 0 ? (
          <p className="mt-6 rounded-card border border-dashed border-line bg-surface px-6 py-20 text-center text-[14px] text-ink-400">
            {query
              ? "검색 결과가 없습니다."
              : "등록된 게시글이 없습니다."}
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {items.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/board/${post.id}`}
                  className="flex flex-col gap-2 px-1 py-5 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:gap-5 sm:px-2"
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
                  <span className="flex-1 truncate text-[15px] font-medium text-ink-900">
                    {post.title}
                  </span>
                  <time
                    dateTime={post.createdAt.toISOString()}
                    className="shrink-0 text-[13px] text-ink-400"
                  >
                    {formatDate(post.createdAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            buildHref={(target) => buildHref({ page: target })}
          />
        )}
      </div>
    </>
  );
}
