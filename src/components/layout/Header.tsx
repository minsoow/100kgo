"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { association, navItems, BOARD_LABEL } from "@/content/association";

/**
 * 투명 상태에서의 내비 높이(px). 전환 임계값 계산에 씁니다.
 *
 * 이 값을 바꾸면 함께 맞춰야 하는 곳:
 *   globals.css 의 scroll-padding-top, board/privacy 레이아웃의 pt-*,
 *   Channels.tsx 의 scroll-mt-*. 전부 고정 헤더에 콘텐츠가 가리지 않게 하는 값입니다.
 */
const HEADER_HEIGHT = 96;

type HeaderProps = {
  /**
   * overlay: 풀스크린 히어로 위에서는 투명, 히어로를 벗어나면 솔리드 바로 전환 (랜딩)
   * plain  : 히어로가 없는 페이지. 항상 솔리드 바
   */
  variant?: "overlay" | "plain";
};

export function Header({ variant = "overlay" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  // 히어로를 벗어났는지. plain 은 항상 솔리드.
  const [solid, setSolid] = useState(variant === "plain");

  /**
   * 히어로(100svh)를 지나면 투명 → 솔리드 바로 전환합니다.
   *
   * IntersectionObserver 를 먼저 썼지만, 실패했을 때 내비가 영구히 투명해져
   * 글자가 배경에 묻히는 치명적인 폴백을 갖습니다. 여기서는 확실하게 동작하는
   * 스크롤 리스너를 씁니다. passive 이고, `scrollY` 읽기는 레이아웃을 유발하지
   * 않으며, 상태 변경도 경계를 넘는 순간에만 일어나 프레임 비용이 없습니다.
   */
  useEffect(() => {
    if (variant !== "overlay") return;

    let previous: boolean | null = null;

    const onScroll = () => {
      const next = window.scrollY > window.innerHeight - HEADER_HEIGHT;
      if (next === previous) return;
      previous = next;
      setSolid(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [variant]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 투명 상태(히어로 위)이거나 모바일 메뉴가 열린 경우에만 흰 글자
  const onDark = open || !solid;
  const textColor = onDark ? "text-white" : "text-ink-900";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        solid && !open
          ? "border-line bg-page shadow-[0_1px_16px_rgba(18,22,28,0.06)]"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`container-page flex items-center justify-between gap-8 transition-[height] duration-300 ${
          solid && !open ? "h-20" : "h-24"
        }`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${association.nameFull} 홈으로`}
          onClick={() => setOpen(false)}
        >
          {/*
            로고 원본은 남색+초록 컬러라 어두운 배경(투명 상태) 위에서 대비가
            떨어집니다. 투명 상태에서는 흰색 단색으로 반전해 가독성을 확보하고,
            솔리드 바에서는 원래 컬러를 그대로 씁니다.

            로고가 3단 조합형(심볼 / 국문 / 영문)이라 높이를 키우지 않으면
            맨 아래 영문 줄이 뭉개집니다. 헤더 높이의 약 58% 를 차지하도록
            잡았습니다.
          */}
          <Image
            src="/images/logo.png"
            alt={association.nameFull}
            width={900}
            height={340}
            priority
            className={`w-auto transition-[height,filter] duration-300 ${
              solid && !open ? "h-11" : "h-14"
            } ${onDark ? "brightness-0 invert" : ""}`}
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[14px] transition-colors duration-300 hover:opacity-60 ${textColor}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/board"
            className={`rounded-btn border px-5 py-2.5 text-[14px] whitespace-nowrap transition-colors duration-300 ${
              onDark
                ? "border-white/40 text-white hover:bg-white hover:text-ink-900"
                : "border-ink-900/25 text-ink-900 hover:bg-ink-900 hover:text-white"
            }`}
          >
            {BOARD_LABEL}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className={`-mr-2 grid h-11 w-11 place-items-center transition-colors duration-300 lg:hidden ${textColor}`}
        >
          <span className="relative block h-3.5 w-7">
            <span
              className={`absolute left-0 block h-px w-7 bg-current transition-transform duration-300 ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-7 bg-current transition-transform duration-300 ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 -z-10 bg-brand-950 pt-28 lg:hidden"
        >
          <nav className="container-page flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/12 py-5 text-[22px] font-medium text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/board"
              onClick={() => setOpen(false)}
              className="border-b border-white/12 py-5 text-[22px] font-medium text-white"
            >
              {BOARD_LABEL}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
