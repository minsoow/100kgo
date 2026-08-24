import Link from "next/link";
import { BOARD_LABEL } from "@/content/association";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-24">
      <div className="text-center">
        <p className="text-[13px] font-bold tracking-[0.16em] text-brand-500">
          404 NOT FOUND
        </p>
        <h1 className="display-lg mt-4 text-brand-900">
          요청하신 페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-4 text-[15px] text-ink-500">
          주소가 변경되었거나 삭제된 페이지일 수 있습니다.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-btn bg-brand-900 px-7 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-800"
          >
            홈으로 가기
          </Link>
          <Link
            href="/board"
            className="rounded-btn border border-line px-7 py-3.5 text-[15px] font-bold text-ink-700 transition-colors hover:bg-surface"
          >
            {BOARD_LABEL}
          </Link>
        </div>
      </div>
    </main>
  );
}
