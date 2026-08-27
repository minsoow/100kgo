import Link from "next/link";
import { PopupForm } from "@/components/admin/PopupForm";

export default function NewPopupPage() {
  return (
    <div className="container-page max-w-4xl">
      <Link
        href="/admin/popups"
        className="text-[13px] font-bold text-ink-400 transition-colors hover:text-brand-700"
      >
        ← 목록으로
      </Link>
      <h1 className="display-md mt-3 mb-7 text-brand-900">새 팝업 만들기</h1>
      <PopupForm />
    </div>
  );
}
