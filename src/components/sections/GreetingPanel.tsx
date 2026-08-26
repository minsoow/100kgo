import Image from "next/image";
import { greeting } from "@/content/association";

/**
 * 협회장 인사말 탭 패널.
 *
 * 레이아웃 레퍼런스: 우리은행 은행장 인사말
 *   좌측에 라운드 처리한 환경 인물사진, 우측에 "안녕하십니까," 로 시작하는
 *   굵은 2행 헤드라인 + 본문, 하단에 직함·성명 서명 블록.
 *
 * 사진 높이를 본문에 맞추는 방법.
 *
 * 사진에 aspect-[2/3] 을 걸면 사진이 행 높이를 끌고 갑니다. 1800px 화면에서
 * 실측하면 본문 콘텐츠는 782px 인데 사진이 행을 970px 로 밀어 올려 본문 아래에
 * 188px 짜리 빈 공간이 생겼습니다.
 *
 * 그래서 lg 이상에서는 사진의 고정 비율을 풀고(lg:aspect-auto lg:h-full)
 * 본문이 행 높이를 정하게 했습니다. 사진 칸(646px)보다 인물 사진의 폭(521px)이
 * 좁아 좌우에 125px 이 남는데, 이 자리를 같은 사진을 확대·블러 처리해 채웁니다.
 * 배경이 스튜디오 커튼이라 확대해도 인물이 드러나지 않고 배경이 이어져 보입니다.
 *
 * 인물은 object-contain 이라 어떤 화면 폭에서도 잘리거나 늘어나지 않습니다.
 * 원본(620 × 930)은 인물이 y 92~877 을 차지해 잘라낼 여유 자체가 없습니다.
 */
export function GreetingPanel() {
  const [firstLine, ...rest] = greeting.paragraphs;
  const photo = greeting.signature.photo ?? "/images/chairman.jpg";

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <figure className="lg:col-span-5">
        <div className="relative isolate aspect-[2/3] overflow-hidden rounded-card bg-brand-950 lg:aspect-auto lg:h-full">
          {/*
            남는 좌우 공간을 메우는 배경.
            object-fit 을 기본값(늘리기)으로 두는 이유: cover 로 잘라 넣으면 세로
            위치가 어긋나 이음매에서 밝기가 30 가까이 튑니다. 늘리면 같은 y 의
            커튼이 그대로 이어져 단차가 13 으로 줄고, 어차피 blur 로 뭉개져
            비율이 어긋난 것은 보이지 않습니다.
            scale-[1.15] 는 CSS blur 가 요소 경계 밖을 투명으로 보고 번지면서
            생기는 어두운 테두리를 밀어내기 위한 값입니다(단차 18 → 3).
          */}
          <Image
            src={photo}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="-z-10 scale-[1.15] blur-2xl brightness-90"
          />
          <Image
            src={photo}
            alt={`${greeting.signature.role} ${greeting.signature.name}`}
            fill
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-contain object-bottom"
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
