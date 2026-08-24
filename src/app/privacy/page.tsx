import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { association } from "@/content/association";
import { resolveContent } from "@/lib/content-utils";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  robots: { index: false, follow: true },
};

/**
 * 개인정보처리방침.
 *
 * 법적 효력이 있는 문서이므로 협회가 문안을 확정하기 전까지는
 * 임의의 조문을 게시하지 않고 안내 문구만 노출합니다.
 * 검토용 초안은 docs/개인정보처리방침_초안.md 를 참고하세요.
 */
export default function PrivacyPage() {
  return (
    <>
      <Header variant="plain" />
      <main className="flex-1 pt-20">
        <div className="container-page max-w-3xl py-16 md:py-24">
          <h1 className="display-lg text-brand-900">개인정보처리방침</h1>

          <div className="mt-8 rounded-card border border-line bg-surface px-6 py-8">
            <p className="text-[15px] leading-[1.8] text-ink-700">
              본 방침은 현재 준비 중입니다. 확정되는 대로 이 페이지에
              게시하겠습니다.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-ink-700">
              개인정보 처리와 관련한 문의는 아래로 연락해 주시기 바랍니다.
            </p>
            <dl className="mt-6 space-y-2 text-[14px]">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-ink-400">단체명</dt>
                <dd className="text-ink-700">{association.nameFull}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-ink-400">이메일</dt>
                <dd className="text-ink-700">
                  {resolveContent(association.contact.email)}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-ink-400">대표전화</dt>
                <dd className="text-ink-700">
                  {resolveContent(association.contact.tel)}
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-10">
            <Link
              href="/"
              className="text-[14px] font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              ← 홈으로 돌아가기
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
