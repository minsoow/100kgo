import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BoardLayout({ children }: LayoutProps<"/board">) {
  return (
    <>
      {/* 내비가 fixed 이므로 본문에 헤더 높이만큼 여백을 둡니다 */}
      <Header variant="plain" />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </>
  );
}
