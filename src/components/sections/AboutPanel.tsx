import Image from "next/image";
import { about } from "@/content/association";

/**
 * 협회소개 탭 패널.
 *
 * 헤드라인 → 본문 2단 → 협회 활동 사진 3장 그리드.
 *
 * 이전에는 4:3 가로 원본을 3:4 세로로 강제로 잘라 우측에 세워 뒀는데,
 * 탭 패널 높이를 맞추려는 이유였을 뿐 구성상 근거가 없어 균형이 깨졌습니다.
 * 사진을 원본 비율(4:3) 그대로 아래에 균일 그리드로 놓으면 크롭 손실이
 * 없고, 6대 사업 카드와 같은 리듬이라 페이지 전체 통일감도 이어집니다.
 */
export function AboutPanel() {
  return (
    <div>
      <h3 className="reveal display-lg max-w-5xl whitespace-pre-line text-brand-900">
        {about.headline}
      </h3>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-5 text-[16px] leading-[1.9] text-ink-700 lg:col-span-7 md:text-[17px]">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>

        <p className="border-l-2 border-brand-500 pl-6 text-[16px] leading-[1.9] text-brand-700 lg:col-span-4 lg:col-start-9">
          {about.closing}
        </p>
      </div>

      <ul className="reveal mt-14 grid gap-5 sm:grid-cols-3">
        {about.photos.map((photo) => (
          <li key={photo.src}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(min-width: 640px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-400">
                {photo.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
