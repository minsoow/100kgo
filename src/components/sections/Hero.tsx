import Image from "next/image";
import { hero, heroMedia } from "@/content/association";

/**
 * 풀스크린 미디어 히어로 (레퍼런스: radiatinghope.org)
 *
 * - 배경은 화면 전체를 덮는 영상 또는 사진 (object-cover)
 * - 헤드라인은 초대형 라이트 웨이트. 좌하단 정렬
 *
 * 내비는 흰 바(Header variant="plain")로 위에 놓입니다. 협회가 로고를
 * 원래 색으로 보고 싶어 해서 투명 오버레이를 걷어냈습니다(「홈피 요청」 7번).
 * 그래서 높이도 100svh 가 아니라 헤더(5rem)를 뺀 값이라야 첫 화면이
 * 정확히 한 화면으로 떨어집니다.
 *
 * 텍스트 대비: 배경 위에 하단이 짙은 그라디언트 스크림을 깔아
 * 사진이 어떤 밝기여도 흰 텍스트가 WCAG AA 를 유지하도록 했습니다.
 */
export function Hero() {
  const posterSrc = heroMedia.image;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col justify-end overflow-hidden bg-brand-950">
      {heroMedia.videoSrc ? (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src={heroMedia.videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-label={heroMedia.alt}
        />
      ) : (
        <Image
          src={posterSrc}
          alt={heroMedia.alt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}

      {/* 텍스트 가독성 확보용 스크림 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/92 via-brand-950/45 to-brand-950/35"
      />

      <div className="container-page pb-16 pt-24 md:pb-24">
        <p className="enter text-[12px] tracking-[0.2em] text-white/70 md:text-[13px]">
          {hero.eyebrow}
        </p>

        <h1 className="enter enter-delay-1 display-xl mt-6 max-w-[24ch] whitespace-pre-line text-white">
          {hero.headline}
        </h1>

        {/* 하단 버튼 2개는 협회 요청으로 제거했습니다 (「홈피 요청」 8번) */}
        <p className="enter enter-delay-2 mt-10 max-w-3xl whitespace-pre-line text-[16px] leading-[1.8] text-white/80 md:text-[18px]">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
