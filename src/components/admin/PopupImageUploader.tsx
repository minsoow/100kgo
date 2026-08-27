"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_BYTES = 5 * 1024 * 1024;

/** 정사각형에서 이만큼 벗어나면 경고합니다 (10%) */
const SQUARE_TOLERANCE = 0.1;

type PopupImageUploaderProps = {
  name: string;
  defaultValue?: string;
};

/**
 * 팝업 이미지 업로더.
 *
 * 게시판 첨부와 같은 경로(/api/upload)를 써서 세션 검증이 그대로 걸립니다.
 * 정사각형이 아니어도 막지는 않고 경고만 합니다. 협회가 급할 때 일단
 * 올릴 수 있어야 하고, 화면에서는 어차피 비율을 유지한 채 맞춰 넣습니다.
 */
export function PopupImageUploader({
  name,
  defaultValue = "",
}: PopupImageUploaderProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shapeWarning, setShapeWarning] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setShapeWarning(null);

    if (file.size > MAX_BYTES) {
      setError("이미지 용량이 5MB를 초과합니다.");
      return;
    }

    // 정사각형인지 미리 재서 알려줍니다.
    const shape = await new Promise<string | null>((resolve) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const ratio = image.width / image.height;
        resolve(
          Math.abs(ratio - 1) > SQUARE_TOLERANCE
            ? `정사각형 이미지를 권장합니다. 지금 올린 이미지는 ${image.width} × ${image.height} 입니다.`
            : null,
        );
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      image.src = objectUrl;
    });
    setShapeWarning(shape);

    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setUrl(blob.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? `업로드 실패: ${uploadError.message}`
          : "업로드에 실패했습니다.",
      );
    } finally {
      setUploading(false);
    }
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
          {uploading ? "업로드 중…" : url ? "이미지 변경" : "이미지 선택"}
        </button>
        <p className="text-[13px] text-ink-400">
          JPG · PNG · WEBP · GIF / 최대 5MB / <b>정사각형 권장</b>
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
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

      {shapeWarning && (
        <p className="mt-3 rounded-btn bg-amber-50 px-4 py-2.5 text-[13px] font-medium text-amber-800">
          {shapeWarning}
        </p>
      )}

      {url && (
        <div className="mt-4">
          <p className="mb-2 text-[13px] text-ink-400">미리보기</p>
          {/*
            next/image 를 쓰지 않는 이유: Blob 도메인은 실행 시점에 정해지고
            협회가 저장소를 바꾸면 next.config 의 허용 도메인도 함께 고쳐야
            합니다. 관리 화면 미리보기 한 장이라 최적화 이득도 없습니다.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="팝업 이미지 미리보기"
            className="h-48 w-48 rounded-card border border-line object-cover"
          />
        </div>
      )}

      <input type="hidden" name={name} value={url} />
    </div>
  );
}
