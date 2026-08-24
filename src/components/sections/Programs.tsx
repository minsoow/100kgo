import { programs } from "@/content/association";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * 6대 사업 — 균일 카드 그리드.
 *
 * 이전에는 셀 너비를 행마다 다르게 주고 일부 셀에만 사진을 깔았는데,
 * 변주가 과해 화면이 어수선했습니다. 레퍼런스(NHN Cloud · 신한퓨처스랩)는
 * 모두 같은 크기·같은 처리의 카드를 반복합니다. 여기서도 6장을 동일하게
 * 맞추고 번호와 제목·설명만으로 구성했습니다. 그림자는 쓰지 않습니다.
 */
export function Programs() {
  return (
    <Section id="programs" tone="page">
      <SectionHeading
        title="6대 사업"
        description="국내의 우수한 상품과 세계 소비자를 직접 연결하는 여섯 가지 사업입니다."
      />

      {/*
        3열 전환을 xl(1280px)로 늦춥니다. lg(1024px)에서 3열이면 카드 폭이
        228px까지 좁아져 설명문이 두 줄로 접힙니다.
      */}
      <ul className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {programs.map((program, index) => (
          <li key={program.id} className="reveal">
            <div className="flex h-full flex-col rounded-card border border-line bg-page p-8">
              <span className="text-[13px] font-bold tabular-nums text-brand-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display-md mt-5 text-brand-900">{program.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-ink-500">
                {program.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
