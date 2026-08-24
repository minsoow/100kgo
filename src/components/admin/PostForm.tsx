"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { savePostAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";
import { RichTextEditor } from "./RichTextEditor";
import { AttachmentUploader } from "./AttachmentUploader";
import type { AttachmentInput } from "@/lib/attachments";
import { POST_CATEGORIES, type PostCategory } from "@/lib/db/schema";

export type PostFormValues = {
  id?: number;
  title: string;
  category: PostCategory;
  content: string;
  isPinned: boolean;
  attachments: AttachmentInput[];
};

const EMPTY: PostFormValues = {
  title: "",
  category: "notice",
  content: "",
  isPinned: false,
  attachments: [],
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-btn bg-brand-900 px-7 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "저장 중…" : isEdit ? "수정 완료" : "등록"}
    </button>
  );
}

export function PostForm({ initial = EMPTY }: { initial?: PostFormValues }) {
  const [state, formAction] = useActionState(savePostAction, initialActionState);
  const isEdit = Boolean(initial.id);

  return (
    <form action={formAction} className="space-y-7">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="rounded-card border border-line bg-page p-6">
        <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <div>
            <label
              htmlFor="category"
              className="block text-[13px] font-bold text-ink-700"
            >
              분류
            </label>
            <select
              id="category"
              name="category"
              defaultValue={initial.category}
              className="mt-2 w-full rounded-btn border border-line bg-page px-4 py-3 text-[15px] outline-none transition-colors focus:border-brand-400"
            >
              {Object.entries(POST_CATEGORIES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-[13px] font-bold text-ink-700"
            >
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={300}
              defaultValue={initial.title}
              placeholder="예) 2025년도 재무제표 공고"
              className="mt-2 w-full rounded-btn border border-line px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400"
            />
          </div>
        </div>

        <label className="mt-5 flex w-fit items-center gap-2.5 text-[14px] font-medium text-ink-700">
          <input
            type="checkbox"
            name="isPinned"
            defaultChecked={initial.isPinned}
            className="h-4 w-4 accent-brand-900"
          />
          목록 상단에 고정 (중요 공지)
        </label>
      </div>

      <div className="rounded-card border border-line bg-page p-6">
        <p className="mb-3 text-[13px] font-bold text-ink-700">내용</p>
        <RichTextEditor name="content" defaultValue={initial.content} />
      </div>

      <div className="rounded-card border border-line bg-page p-6">
        <p className="mb-3 text-[13px] font-bold text-ink-700">첨부파일</p>
        <AttachmentUploader name="attachments" defaultValue={initial.attachments} />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-btn bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Link
          href="/admin/posts"
          className="rounded-btn border border-line bg-page px-7 py-3.5 text-[15px] font-bold text-ink-700 transition-colors hover:bg-surface"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
