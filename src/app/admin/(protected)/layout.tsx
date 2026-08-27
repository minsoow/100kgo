import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-line bg-page">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/posts" className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-btn bg-brand-900 text-[12px] font-bold text-white"
              >
                KO
              </span>
              <span className="text-[15px] font-bold text-brand-900">
                협회 홈페이지 관리
              </span>
            </Link>

            <nav className="ml-3 flex items-center gap-1">
              <Link
                href="/admin/posts"
                className="rounded-btn px-3 py-2 text-[14px] font-bold text-ink-500 transition-colors hover:bg-surface hover:text-brand-700"
              >
                게시판
              </Link>
              <Link
                href="/admin/popups"
                className="rounded-btn px-3 py-2 text-[14px] font-bold text-ink-500 transition-colors hover:bg-surface hover:text-brand-700"
              >
                팝업
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-[13px] text-ink-400 sm:inline">
              {session.displayName}님
            </span>
            <Link
              href="/"
              target="_blank"
              className="rounded-btn border border-line px-3.5 py-2 text-[13px] font-bold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              홈페이지 보기 ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-btn px-3.5 py-2 text-[13px] font-bold text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">{children}</main>
    </div>
  );
}
