import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** 밝은 회색 배경으로 섹션 구분 */
  tone?: "page" | "surface";
};

export function Section({
  id,
  children,
  className = "",
  tone = "page",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${tone === "surface" ? "bg-surface" : "bg-page"} py-20 md:py-28 ${className}`}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  title: ReactNode;
  description?: string;
  /**
   * 아이브로우는 페이지 전체 3개까지만 허용됩니다
   * (docs/디자인_핸드오프.md §4). 기본은 없음.
   */
  eyebrow?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  description,
  eyebrow,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="mb-3 text-[13px] font-bold tracking-[0.14em] text-brand-500">
          {eyebrow}
        </p>
      )}
      {/* 섹션 제목은 단일 스케일(display-lg)만 사용합니다 */}
      <h2 className="display-lg text-brand-900">{title}</h2>
      {description && (
        <p
          className={`mt-5 max-w-4xl text-[16px] leading-[1.85] text-ink-500 ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
