"use client";

import { useFormStatus } from "react-dom";
import { deletePopupAction, togglePopupAction } from "@/app/admin/actions";

function DeleteButton({ title }: { title: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (
          !window.confirm(
            `‘${title}’ 팝업을 삭제할까요?\n삭제한 팝업과 이미지는 되돌릴 수 없습니다.`,
          )
        ) {
          event.preventDefault();
        }
      }}
      className="rounded-btn px-3 py-1.5 text-[13px] font-bold text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}

export function DeletePopupButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  return (
    <form action={deletePopupAction}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton title={title} />
    </form>
  );
}

function ToggleButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-btn px-3 py-1.5 text-[13px] font-bold transition-colors disabled:opacity-50 ${
        isActive
          ? "bg-brand-900 text-white hover:bg-brand-800"
          : "border border-line text-ink-500 hover:bg-surface"
      }`}
    >
      {pending ? "…" : isActive ? "사용 중" : "사용 안 함"}
    </button>
  );
}

/** 목록에서 바로 켜고 끄는 버튼. 누르면 상태가 뒤집힙니다. */
export function TogglePopupButton({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) {
  return (
    <form action={togglePopupAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="next" value={isActive ? "off" : "on"} />
      <ToggleButton isActive={isActive} />
    </form>
  );
}
