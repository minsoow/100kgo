"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { AttachmentInput } from "@/lib/attachments";
import { formatFileSize } from "@/lib/format";

const MAX_FILES = 10;
const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.gif,.hwp,.hwpx,.doc,.docx";

type AttachmentUploaderProps = {
  name: string;
  defaultValue?: AttachmentInput[];
};

export function AttachmentUploader({
  name,
  defaultValue = [],
}: AttachmentUploaderProps) {
  const [files, setFiles] = useState<AttachmentInput[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;

    setError(null);

    if (files.length + selected.length > MAX_FILES) {
      setError(`첨부파일은 최대 ${MAX_FILES}개까지 등록할 수 있습니다.`);
      event.target.value = "";
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_BYTES);
    if (oversized) {
      setError(
        `‘${oversized.name}’의 용량이 20MB를 초과합니다. 파일을 나누거나 압축해 주세요.`,
      );
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploaded: AttachmentInput[] = [];
      for (const file of selected) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploaded.push({
          fileName: file.name,
          fileUrl: blob.url,
          fileSize: file.size,
          mimeType: file.type || "application/octet-stream",
        });
      }
      setFiles((prev) => [...prev, ...uploaded]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? `업로드 실패: ${uploadError.message}`
          : "업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-btn border border-line bg-page px-5 py-2.5 text-[14px] font-bold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "업로드 중…" : "파일 선택"}
        </button>
        <p className="text-[13px] text-ink-400">
          PDF · 워드 · 한글 · 이미지 / 파일당 최대 20MB / 최대 {MAX_FILES}개
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        onChange={handleSelect}
        className="hidden"
      />

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-btn bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700"
        >
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={file.fileUrl}
              className="flex items-center justify-between gap-3 rounded-btn border border-line bg-surface px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden>📎</span>
                <span className="truncate text-[14px] text-ink-700">
                  {file.fileName}
                </span>
                <span className="shrink-0 text-[12px] text-ink-400">
                  {formatFileSize(file.fileSize)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="shrink-0 rounded-btn px-2.5 py-1.5 text-[13px] font-bold text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      <input type="hidden" name={name} value={JSON.stringify(files)} />
    </div>
  );
}
