import Image from "next/image";
import { hero, heroMedia } from "@/content/association";

/**
 * 풀스크린 미디어 히어로 (레퍼런스: radiatinghope.org)
 *
 * - 배경은 화면 전체를 덮는 영상 또는 사진 (object-cover)
 * - 내비게이션은 배경 위에 투명하게 얹힘 (Header variant="overlay")
 * - 헤드라인은 초대형 라이트 웨이트. 좌하단 정렬
 *
 * 텍스트 대비: 배경 위에 하단이 짙은 그라디언트 스크림을 깔아
 * 사진이 어떤 밝기여도 흰 텍스트가 WCAG AA 를 유지하도록 했습니다.
 */
export function Hero() {
  const posterSrc = heroMedia.image;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-brand-950">
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

      <div className="container-page pb-16 pt-32 md:pb-24">
        <p className="enter text-[12px] tracking-[0.2em] text-white/70 md:text-[13px]">
          {hero.eyebrow}
        </p>

        <h1 className="enter enter-delay-1 display-xl mt-6 max-w-[18ch] whitespace-pre-line text-white">
          {hero.headline}
        </h1>

        <div className="enter enter-delay-2 mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-xl whitespace-pre-line text-[16px] leading-[1.8] text-white/80 md:text-[18px]">
            {hero.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <a
              href={hero.primaryCta.href}
              className="rounded-btn bg-white px-8 py-4 text-center text-[15px] font-semibold whitespace-nowrap text-ink-900 transition-colors hover:bg-white/85"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="rounded-btn border border-white/45 px-8 py-4 text-center text-[15px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-white/12"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
