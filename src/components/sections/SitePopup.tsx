"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PopupData = {
  id: number;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string | null;
  /** "다시 보지 않기" 판정 키에 씁니다 (수정하면 다시 보이게 하려고) */
  version: string;
};

const STORAGE_KEY = "kodsa_popup_dismissed";

/**
 * 첫 화면 안내 팝업.
 *
 * "다시 보지 않기" 는 브라우저에 팝업 id + 수정시각을 저장해 판정합니다.
 * id 만 저장하면 협회가 이미지를 갈아끼워도 한 번 닫은 사람에게는 영영 안
 * 보입니다. 수정시각을 함께 넣어 두면 내용이 바뀔 때 다시 나타납니다.
 *
 * localStorage 는 브라우저별로 따로 저장되므로 휴대폰에서 닫아도 PC 에서는
 * 다시 보입니다. 서버에 방문자 기록을 남기지 않으려고 택한 방식입니다.
 * 사생활 보호 모드나 저장소 차단 설정에서는 읽기·쓰기가 예외를 던지므로
 * 전부 try/catch 로 감싸고, 실패하면 "닫은 적 없음" 으로 봅니다.
 */
export function SitePopup({ popup }: { popup: PopupData }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(STORAGE_KEY) === popup.version;
    } catch {
      dismissed = false;
    }
    /*
      localStorage 는 서버에 없으므로 렌더 중에는 읽을 수 없습니다. 마운트 후
      한 번 읽어 여는 것 말고는 방법이 없어, 이 줄만 규칙에서 제외합니다.
      처음에 닫힌 상태로 시작하는 덕분에 "잠깐 떴다가 사라지는" 깜빡임도 없습니다.
    */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!dismissed) setOpen(true);
  }, [popup.version]);

  /*
    close 가 매 렌더마다 새로 만들어지면 아래 effect 가 다시 돌면서 포커스가
    튑니다. version 을 ref 로 들고 있으면 close 를 고정할 수 있습니다.
  */
  const versionRef = useRef(popup.version);
  useEffect(() => {
    versionRef.current = popup.version;
  }, [popup.version]);

  const close = useCallback((forever: boolean) => {
    if (forever) {
      try {
        window.localStorage.setItem(STORAGE_KEY, versionRef.current);
      } catch {
        // 저장소를 못 쓰는 환경에서는 이번 방문에만 닫힙니다.
      }
    }
    setOpen(false);
  }, []);

  // 열려 있는 동안 배경 스크롤을 막고, Esc 로 닫히게 하고, 포커스를 안으로 넣습니다.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={popup.imageUrl}
      alt={popup.imageAlt}
      className="block h-auto w-full"
    />
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="안내 팝업"
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
    >
      {/* 배경을 눌러도 닫힙니다 */}
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={() => close(false)}
        className="absolute inset-0 -z-10 h-full w-full cursor-default bg-brand-950/70"
      />

      <div className="relative w-full max-w-sm overflow-hidden rounded-card bg-page shadow-[0_24px_60px_rgba(10,13,18,0.35)]">
        <button
          ref={closeRef}
          type="button"
          onClick={() => close(false)}
          aria-label="팝업 닫기"
          className="absolute top-2.5 right-2.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-brand-950/55 text-[18px] leading-none text-white transition-colors hover:bg-brand-950/80"
        >
          <span aria-hidden>×</span>
        </button>

        {popup.linkUrl ? (
          <a
            href={popup.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => close(false)}
          >
            {image}
          </a>
        ) : (
          image
        )}

        <div className="flex items-center justify-end gap-1 border-t border-line px-2 py-2">
          <button
            type="button"
            onClick={() => close(true)}
            className="rounded-btn px-3.5 py-2 text-[13px] font-bold text-ink-500 transition-colors hover:bg-surface hover:text-ink-900"
          >
            다시 보지 않기
          </button>
          <button
            type="button"
            onClick={() => close(false)}
            className="rounded-btn px-3.5 py-2 text-[13px] font-bold text-ink-900 transition-colors hover:bg-surface"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
