import Image from "next/image";
import { vision } from "@/content/association";

/**
 * 레이아웃: 풀블리드 이미지 밴드 + 초대형 스테이트먼트
 *
 * 배경은 지구 야경 사진(Unsplash License).
 * 후보 중 문구 자리 밝기 8.6 / 복잡도 3.0 으로 가장 어둡고 깨끗해
 * 흰 글씨 가독성이 가장 좋습니다.
 */
export function Vision() {
  return (
    <section
      id="vision"
      className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-brand-950"
    >
      <Image
        src="/images/vision.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/92 via-brand-950/55 to-brand-950/35"
      />

      <div className="container-page py-20 md:py-28">
        <p className="reveal text-[12px] tracking-[0.2em] text-white/70 md:text-[13px]">
          {vision.label}
        </p>

        <div className="reveal mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <h2 className="display-xl text-white lg:col-span-6">
            {vision.figure}
            <span className="ml-4 align-middle text-[clamp(1.25rem,2vw,1.75rem)] font-medium text-white/75">
              해외직판상 양성
            </span>
          </h2>

          <p className="max-w-xl text-[16px] leading-[1.9] text-white/80 lg:col-span-5 lg:col-start-8 md:text-[17px]">
            {vision.description}
          </p>
        </div>
      </div>
    </section>
  );
}
