"use client";

import { useFormStatus } from "react-dom";
import { deletePostAction } from "@/app/admin/actions";

function Button({ title }: { title: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (
          !window.confirm(
            `‘${title}’ 글을 삭제할까요?\n삭제한 글과 첨부파일은 되돌릴 수 없습니다.`,
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

export function DeletePostButton({ id, title }: { id: number; title: string }) {
  return (
    <form action={deletePostAction}>
      <input type="hidden" name="id" value={id} />
      <Button title={title} />
    </form>
  );
}
