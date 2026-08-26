"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * 협회소개 · 협회장 인사말 · 조직도를 한 섹션에 탭으로 묶습니다.
 *
 * 세 개를 세로로 나열하면 텍스트 위주 섹션이 연달아 이어져 페이지가
 * 성기게 보였습니다. 탭으로 묶으면 세로 길이가 1/3로 줄고 정보 계층도
 * 분명해집니다.
 *
 * 스크롤로 탭을 넘기는 방식은 채택하지 않았습니다. 화면을 고정한 채
 * 스크롤을 가로채면 모바일에서 페이지를 벗어나기 어렵고, 키보드·스크린리더
 * 이동이 끊깁니다. 관객에 정부 담당자와 연배 있는 사업주가 포함되는 사이트라
 * 위험이 이득보다 큽니다. 대신 패널 최소 높이를 맞춰 탭을 눌러도 화면이
 * 튀지 않게 했습니다.
 */
export type AboutTab = {
  id: string;
  label: string;
  panel: ReactNode;
};

export function AboutTabs({ tabs }: { tabs: AboutTab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();

  return (
    <section id="about" className="bg-page py-24 md:py-32">
      <div className="container-page">
        {/*
          좁은 화면(320px)에서 탭이 두 줄로 접히던 것을 가로 스크롤로 바꿉니다.
          NewsTabs 와 같은 구조입니다. 밑줄을 바깥 div 가 갖고 스크롤러를
          -mb-px 로 내려, 선택된 탭의 2px 밑줄이 회색 선을 덮게 합니다.
          스크롤러 안쪽 자식에 음수 마진을 두면 세로로 1px 넘칩니다.
        */}
        <div className="border-b border-line">
          <div
            role="tablist"
            aria-label="협회 소개"
            className="scrollbar-none -mb-px flex gap-2 overflow-x-auto"
          >
            {tabs.map((tab, index) => {
              const selected = index === active;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`${base}-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`${base}-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowRight" ||
                      event.key === "ArrowLeft"
                    ) {
                      event.preventDefault();
                      const next =
                        event.key === "ArrowRight"
                          ? (active + 1) % tabs.length
                          : (active - 1 + tabs.length) % tabs.length;
                      setActive(next);
                      const el = document.getElementById(
                        `${base}-tab-${tabs[next].id}`,
                      );
                      el?.focus();
                      /*
                        좁은 화면에서는 탭 줄이 가로로 스크롤되므로 옮겨간 탭이
                        화면 밖일 수 있습니다. focus() 만으로는 스크롤이 따라오지
                        않는 것을 확인해 명시적으로 끌어옵니다.
                        nearest 라서 이미 보이는 탭에는 아무 일도 하지 않고,
                        페이지 세로 위치도 건드리지 않습니다.
                      */
                      el?.scrollIntoView({ block: "nearest", inline: "nearest" });
                    }
                  }}
                  className={`shrink-0 border-b-2 px-5 py-4 text-[15px] whitespace-nowrap transition-colors md:px-7 md:text-[17px] ${
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

        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${base}-panel-${tab.id}`}
            aria-labelledby={`${base}-tab-${tab.id}`}
            hidden={index !== active}
            className="pt-12 md:min-h-[56rem] md:pt-16"
          >
            {index === active && tab.panel}
          </div>
        ))}
      </div>
    </section>
  );
}
