import type { Metadata } from "next";
import "./pretendard.css";
import "./globals.css";
import { association } from "@/content/association";
import { NOINDEX } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${association.nameShort} | 대한민국의 다음 수출은 해외직판입니다`,
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
    title: `${association.nameShort} | 대한민국의 다음 수출은 해외직판입니다`,
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
