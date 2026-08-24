import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

/** 현재 페이지 주변 최대 5개 번호를 노출 */
function pageWindow(page: number, totalPages: number): number[] {
  const size = Math.min(5, totalPages);
  let start = Math.max(1, page - Math.floor(size / 2));
  if (start + size - 1 > totalPages) {
    start = totalPages - size + 1;
  }
  return Array.from({ length: size }, (_, i) => start + i);
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  const pages = pageWindow(page, totalPages);

  return (
    <nav
      aria-label="페이지 이동"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          rel="prev"
          aria-label="이전 페이지"
          className="grid h-10 w-10 place-items-center rounded-btn border border-line text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50"
        >
          ‹
        </Link>
      )}

      {pages.map((target) => {
        const active = target === page;
        return (
          <Link
            key={target}
            href={buildHref(target)}
            aria-current={active ? "page" : undefined}
            className={`grid h-10 w-10 place-items-center rounded-btn text-[14px] font-bold transition-colors ${
              active
                ? "bg-brand-900 text-white"
                : "border border-line text-ink-500 hover:border-brand-300 hover:bg-brand-50"
            }`}
          >
            {target}
          </Link>
        );
      })}

      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          rel="next"
          aria-label="다음 페이지"
          className="grid h-10 w-10 place-items-center rounded-btn border border-line text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50"
        >
          ›
        </Link>
      )}
    </nav>
  );
}
