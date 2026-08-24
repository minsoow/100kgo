import Image from "next/image";
import { greeting } from "@/content/association";

/**
 * 협회장 인사말 탭 패널.
 *
 * 레이아웃 레퍼런스: 우리은행 은행장 인사말
 *   좌측에 라운드 처리한 환경 인물사진, 우측에 "안녕하십니까," 로 시작하는
 *   굵은 2행 헤드라인 + 본문, 하단에 직함·성명 서명 블록.
 *
 * ⚠️ 현재 인물 사진은 협회장 사진이 아닙니다. 레이아웃 확인용 임시
 *    스톡 이미지(Unsplash License)이며, 협회 사진 수령 시 교체합니다.
 *    협회에 공유할 때 반드시 임시 이미지임을 함께 안내해야 합니다.
 */
export function GreetingPanel() {
  const [firstLine, ...rest] = greeting.paragraphs;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <figure className="lg:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-surface">
          <Image
            src={greeting.signature.photo ?? "/images/chairman.jpg"}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 text-[12px] text-ink-400">
          인물 사진은 레이아웃 확인용 임시 이미지입니다.
        </figcaption>
      </figure>

      <div className="lg:col-span-7">
        <h3 className="reveal display-lg text-brand-900">
          안녕하십니까,
          <br />
          {greeting.signature.role} {greeting.signature.name}입니다.
        </h3>

        <div className="mt-10 space-y-5 text-[16px] leading-[1.9] text-ink-700 md:text-[17px]">
          {/* 첫 문단은 헤드라인과 중복되는 인사 문장이라 본문에서 제외 */}
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-[14px] text-ink-500">{greeting.signature.role}</p>
          <p className="mt-1 text-[20px] font-bold tracking-tight text-brand-900">
            {greeting.signature.name} 올림
          </p>
        </div>
      </div>
      <span className="sr-only">{firstLine}</span>
    </div>
  );
}
