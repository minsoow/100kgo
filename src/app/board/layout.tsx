import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BoardLayout({ children }: LayoutProps<"/board">) {
  return (
    <>
      {/* 내비가 fixed 이므로 본문에 헤더 높이만큼 여백을 둡니다 */}
      <Header variant="plain" />
      {/*
        pt-20 = 고정 헤더(h-20)의 높이. 예전에 투명 내비(h-24)를 쓰던 값이
        남아 pt-24 로 되어 있었고, 그 차이 16px 이 헤더 아래 흰 띠로 보였습니다.
        헤더의 1px 아래 테두리는 이 자리를 덮어 경계선 역할을 합니다.
      */}
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </>
  );
}
