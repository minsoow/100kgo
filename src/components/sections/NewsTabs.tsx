"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { POST_CATEGORIES, type PostCategory } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";

export type NewsItem = {
  id: number;
  title: string;
  category: PostCategory;
  createdAt: string;
};

const TABS = [
  { value: "", label: "전체" },
  ...Object.entries(POST_CATEGORIES).map(([value, label]) => ({ value, label })),
];

/** 홈 게시판 미리보기의 분류 탭. 게시판 페이지의 탭 구성과 동일하게 맞춥니다. */
export function NewsTabs({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState("");
  const base = useId();

  const filtered = (active ? items.filter((i) => i.category === active) : items).slice(
    0,
    5,
  );

  return (
    <>
      {/*
        좁은 화면에서 탭이 두 줄로 접히던 것을 가로 스크롤로 바꿉니다.
        375px 기준 탭 4개의 합이 346px 로 컨테이너(327px)를 넘습니다.

        밑줄(border-b)을 바깥 div 가 갖고, 스크롤러를 -mb-px 로 1px 끌어내려
        선택된 탭의 2px 밑줄이 회색 선을 덮게 했습니다. 스크롤러 안쪽에
        음수 마진을 두면 세로로 1px 넘쳐 세로 스크롤바가 생깁니다.
      */}
      <div className="mt-10 border-b border-line">
        <div
          role="tablist"
          aria-label="게시판 분류"
          className="scrollbar-none -mb-px flex gap-2 overflow-x-auto"
        >
          {TABS.map((tab) => {
            const selected = tab.value === active;
            return (
              <button
                key={tab.value || "all"}
                role="tab"
                id={`${base}-${tab.value || "all"}`}
                aria-selected={selected}
                onClick={() => setActive(tab.value)}
                className={`shrink-0 border-b-2 px-4 py-3 text-[14px] whitespace-nowrap transition-colors md:px-5 md:text-[15px] ${
                  selected
                    ? "border-brand-500 font-bold text-brand-900"
                    : "border-transparent font-medium text-ink-400 hover:text-ink-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-[15px] text-ink-400">
          등록된 게시글이 없습니다.
        </p>
      ) : (
        <ul>
          {filtered.map((post) => (
            <li key={post.id} className="border-b border-line">
              <Link
                href={`/board/${post.id}`}
                className="flex flex-col gap-2 py-6 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:gap-8"
              >
                <span className="w-32 shrink-0 text-[13px] font-bold text-brand-600">
                  {POST_CATEGORIES[post.category]}
                </span>
                <span className="flex-1 truncate text-[16px] text-ink-900 md:text-[17px]">
                  {post.title}
                </span>
                <time
                  dateTime={post.createdAt}
                  className="shrink-0 text-[13px] tabular-nums text-ink-400"
                >
                  {formatDate(post.createdAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
