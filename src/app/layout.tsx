import type { Metadata } from "next";
import "./pretendard.css";
import "./globals.css";
import { association } from "@/content/association";
import { NOINDEX } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  /*
    정본 주소를 못 박습니다.

    같은 사이트가 운영 도메인(www.100kgo.kr)과 Vercel 기본 주소
    (100kgo.vercel.app) 두 곳에서 똑같이 열립니다. vercel.app 은 Preview 가
    아니라 프로덕션 배포에 자동으로 붙는 주소라 끄기도 어렵습니다.

    그대로 두면 검색엔진이 같은 내용을 두 주소에서 발견해 어느 쪽이 정본인지
    헷갈립니다(중복 콘텐츠). canonical 을 걸어 두면 vercel.app 이 크롤링되어도
    www.100kgo.kr 을 정본으로 인정합니다.

    ⚠️ 여기 값은 홈(/) 기준입니다. 레이아웃 메타데이터는 하위 페이지로
    상속되므로, 새 페이지를 만들면 그 페이지에서 자기 경로로 반드시
    덮어써야 합니다. 안 그러면 모든 페이지가 홈을 정본이라고 주장합니다.
  */
  alternates: { canonical: "/" },
  title: {
    default: `${association.nameShort} | 대한민국 10만 해외직판상 시대를 엽니다`,
    template: `%s | ${association.nameShort}`,
  },
  description:
    "한국온라인해외직판협회는 해외 소비자에게 직접 판매하는 해외직판을 대한민국의 새로운 성장 전략으로 제시합니다. 전문인재 양성, 현지화 자사몰 구축, AI 글로벌 마케팅을 지원하는 실행형 협회입니다.",
  keywords: [
    "해외직판",
    "한국온라인해외직판협회",
    "현지화 자사몰",
    "일본 직판",
    "크로스보더 이커머스",
    "수출 지원",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: association.nameShort,
    title: `${association.nameShort} | 대한민국 10만 해외직판상 시대를 엽니다`,
    description:
      "국내의 우수한 상품이 세계 소비자와 직접 연결되도록, 교육에서 끝나지 않고 실제 판매까지 함께 만드는 실행형 협회입니다.",
  },
  // 시안 확인용 임시 배포에서는 색인을 막습니다 (src/lib/site.ts)
  robots: NOINDEX
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
