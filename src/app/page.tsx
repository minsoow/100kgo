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

function NewsSkeleton() {
  return (
    <div className="container-page py-24 md:py-32">
      <div className="h-72 animate-pulse bg-surface" />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* 히어로 위에 얹히는 투명 내비 */}
      <Header variant="overlay" />
      <main>
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
