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
    /*
      og:url 은 일부러 넣지 않습니다.

      여기 값은 하위 페이지로 그대로 상속되는데, 페이지에서 openGraph 를
      다시 선언하면 부모 openGraph 가 통째로 갈아치워져 아래 images 까지
      같이 날아갑니다. 그래서 페이지별로 덮어쓸 수가 없습니다.
      og:url 을 "/" 로 고정해 두면 게시글을 공유해도 미리보기가 홈 주소를
      가리키게 됩니다.

      비워 두면 카카오·페이스북이 실제로 읽어 간 주소를 씁니다. 그게 맞습니다.
      중복 주소(100kgo.vercel.app) 정리는 canonical 이 따로 맡습니다.
    */
    siteName: association.nameShort,
    /*
      og:title 과 og:description 도 일부러 넣지 않습니다.

      여기에 값을 적으면 그게 모든 페이지의 미리보기 제목이 됩니다.
      공지사항 글을 카카오톡에 공유해도 글 제목 대신 협회 이름이 떴습니다.
      (위 og:url 과 같은 이유로 페이지에서 덮어쓸 수도 없습니다.)

      비워 두면 Next 가 각 페이지의 title·description 에서 알아서 채웁니다.
      홈은 어차피 같은 문구가 들어가고, 게시글은 글 제목과 본문 앞부분이
      들어갑니다.
    */
    /*
      링크 미리보기 대표 이미지.

      이걸 비워 두면 카카오톡이 페이지에서 이미지를 알아서 하나 골라
      자기 카드 비율(약 2:1)에 맞춰 잘라 씁니다. 실제로 로고(2.65:1)가
      뽑혀 "(사) 한"의 왼쪽과 화살표 끝이 잘린 채 공유된다는 지적이
      있었습니다(2026-09-02).

      public/og.png 는 1200x630(1.90:1)이라 카카오 카드와 비율이 거의 같아
      잘리지 않습니다. 만드는 스크립트는 scripts/make_og_image.py 입니다.

      ⚠️ 카카오는 미리보기를 서버에 오래 캐시합니다. 배포만으로는 옛 이미지가
      계속 보일 수 있어, 카카오 개발자센터의 "공유 디버거"에서 캐시를 지워야
      합니다. 급하면 주소 뒤에 ?v=2 를 붙여 공유하면 새로 읽어 갑니다.
    */
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${association.nameFull} 로고`,
      },
    ],
  },
  // 카카오톡은 og 만 읽지만, X·슬랙 등은 twitter 태그를 우선합니다.
  // 제목·설명은 og 와 같은 이유로 비워 둡니다.
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
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
