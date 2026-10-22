import Link from "next/link";
import { notFound } from "next/navigation";
import { getPopup } from "@/lib/db/queries";
import { toKstInputValue } from "@/lib/format";
import { PopupForm } from "@/components/admin/PopupForm";

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
          startsAt: toKstInputValue(popup.startsAt),
          endsAt: toKstInputValue(popup.endsAt),
        }}
      />
    </div>
  );
}
