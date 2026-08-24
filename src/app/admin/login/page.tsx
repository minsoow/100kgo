import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { association } from "@/content/association";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // 이미 로그인한 상태면 관리 화면으로 이동
  if (await getSession()) {
    redirect("/admin/posts");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span
            aria-hidden
            className="mx-auto grid h-11 w-11 place-items-center rounded-card bg-brand-900 text-[14px] font-bold text-white"
          >
            KO
          </span>
          <h1 className="display-md mt-5 text-brand-900">
            관리자 로그인
          </h1>
          <p className="mt-1.5 text-[13px] text-ink-400">
            {association.nameShort} 게시판 관리
          </p>
        </div>

        <div className="mt-8 rounded-card border border-line bg-page p-7">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-[13px]">
          <Link
            href="/"
            className="text-ink-400 transition-colors hover:text-brand-700"
          >
            ← 홈페이지로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  );
}
