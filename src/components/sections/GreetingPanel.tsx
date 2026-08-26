import Image from "next/image";
import { greeting } from "@/content/association";

/**
 * 협회장 인사말 탭 패널.
 *
 * 레이아웃 레퍼런스: 우리은행 은행장 인사말
 *   좌측에 라운드 처리한 환경 인물사진, 우측에 "안녕하십니까," 로 시작하는
 *   굵은 2행 헤드라인 + 본문, 하단에 직함·성명 서명 블록.
 *
 * 사진 슬롯이 2:3 인 이유: 협회에서 받은 원본(620 × 930)에서 인물이 y 92~877 을
 * 차지해 4:5 로 자르면 머리 위 여백이 사라지거나 팔짱 낀 손이 잘립니다.
 * 좌우로 배경을 늘리는 방법도 인물의 팔꿈치가 원본 프레임에 닿아 있어 쓸 수
 * 없습니다. 원본 비율을 그대로 두고 슬롯을 맞췄습니다.
 */
export function GreetingPanel() {
  const [firstLine, ...rest] = greeting.paragraphs;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <figure className="lg:col-span-5">
        <div className="relative aspect-[2/3] overflow-hidden rounded-card bg-surface">
          <Image
            src={greeting.signature.photo ?? "/images/chairman.jpg"}
            alt={`${greeting.signature.role} ${greeting.signature.name}`}
            fill
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
        </div>
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
