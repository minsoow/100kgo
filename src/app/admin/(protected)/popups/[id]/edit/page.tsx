import Link from "next/link";
import { notFound } from "next/navigation";
import { getPopup } from "@/lib/db/queries";
import { PopupForm } from "@/components/admin/PopupForm";

/**
 * datetime-local 입력은 "YYYY-MM-DDTHH:mm" 형식만 받습니다.
 * toISOString() 은 UTC 로 바꿔 버려 한국 시각과 9시간 어긋나므로,
 * 로컬 시각 그대로 조립합니다.
 */
function toDateTimeLocal(value: Date | null): string {
  if (!value) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` +
    `T${pad(value.getHours())}:${pad(value.getMinutes())}`
  );
}

export default async function EditPopupPage({
  params,
}: PageProps<"/admin/popups/[id]/edit">) {
  const { id } = await params;
  const popupId = Number(id);
  if (!Number.isInteger(popupId) || popupId <= 0) notFound();

  const popup = await getPopup(popupId);
  if (!popup) notFound();

  return (
    <div className="container-page max-w-4xl">
      <Link
        href="/admin/popups"
        className="text-[13px] font-bold text-ink-400 transition-colors hover:text-brand-700"
      >
        ← 목록으로
      </Link>
      <h1 className="display-md mt-3 mb-7 text-brand-900">팝업 수정</h1>

      <PopupForm
        initial={{
          id: popup.id,
          title: popup.title,
          imageUrl: popup.imageUrl,
          imageAlt: popup.imageAlt ?? "",
          linkUrl: popup.linkUrl ?? "",
          isActive: popup.isActive,
          startsAt: toDateTimeLocal(popup.startsAt),
          endsAt: toDateTimeLocal(popup.endsAt),
        }}
      />
    </div>
  );
}
