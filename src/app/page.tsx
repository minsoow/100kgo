import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AboutTabs } from "@/components/sections/AboutTabs";
import { AboutPanel } from "@/components/sections/AboutPanel";
import { GreetingPanel } from "@/components/sections/GreetingPanel";
import { OrganizationPanel } from "@/components/sections/OrganizationPanel";
import { Vision } from "@/components/sections/Vision";
import { Programs } from "@/components/sections/Programs";
import { Channels } from "@/components/sections/Channels";
import { NewsPreview } from "@/components/sections/NewsPreview";
import { SitePopup } from "@/components/sections/SitePopup";
import { getActivePopup } from "@/lib/db/queries";

function NewsSkeleton() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="h-72 animate-pulse bg-surface" />
    </div>
  );
}

export default async function HomePage() {
  const popup = await getActivePopup();

  return (
    <>
      {/*
        협회 요청(「홈피 요청」 7번)으로 투명 내비를 걷어냈습니다.
        히어로 사진 위에 얹으면 로고를 흰색으로 반전할 수밖에 없는데,
        협회는 보내준 로고가 원래 색으로 선명하게 보이길 원했습니다.
        overlay 방식이 필요해지면 variant 만 되돌리면 됩니다.
      */}
      {/*
        안내 팝업. 띄울 팝업이 없으면 아무것도 내려가지 않습니다.

        Suspense 로 감싸지 않는 이유: 스트리밍 자리표시자(<div hidden>) 안에
        경계가 남아, 클라이언트에서 팝업을 열어도 화면에 나타나지 않았습니다.
        조회가 가벼운 쿼리 한 번이라 서버에서 바로 받아 넘깁니다.
      */}
      {popup && (
        <SitePopup
          popup={{
            id: popup.id,
            imageUrl: popup.imageUrl,
            imageAlt: popup.imageAlt ?? popup.title,
            linkUrl: popup.linkUrl,
            version: `${popup.id}:${popup.updatedAt.getTime()}`,
          }}
        />
      )}

      <Header variant="plain" />
      <main className="pt-20">
        <Hero />
        {/*
          협회소개 · 인사말 · 조직도는 텍스트 위주라 세로로 나열하면
          페이지가 성기게 보입니다. 한 섹션에 탭으로 묶었습니다.
        */}
        <AboutTabs
          tabs={[
            { id: "intro", label: "협회소개", panel: <AboutPanel /> },
            { id: "greeting", label: "협회장 인사말", panel: <GreetingPanel /> },
            { id: "org", label: "조직도", panel: <OrganizationPanel /> },
          ]}
        />
        <Vision />
        <Programs />
        <Channels />
        <Suspense fallback={<NewsSkeleton />}>
          <NewsPreview />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
