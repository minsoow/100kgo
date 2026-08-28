"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { savePopupAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";
import { PopupImageUploader } from "./PopupImageUploader";

export type PopupFormValues = {
  id?: number;
  title: string;
  imageUrl: string;
  imageAlt: string;
  linkUrl: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

const EMPTY: PopupFormValues = {
  title: "",
  imageUrl: "",
  imageAlt: "",
  linkUrl: "",
  isActive: false,
  startsAt: "",
  endsAt: "",
};

const fieldClass =
  "mt-2 w-full rounded-btn border border-line px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400";
const labelClass = "block text-[13px] font-bold text-ink-700";

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

export function PopupForm({ initial = EMPTY }: { initial?: PopupFormValues }) {
  const [state, formAction] = useActionState(
    savePopupAction,
    initialActionState,
  );
  const isEdit = Boolean(initial.id);

  return (
    <form action={formAction} className="space-y-7">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="rounded-card border border-line bg-page p-6">
        <label htmlFor="title" className={labelClass}>
          팝업 이름
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={initial.title}
          placeholder="예) 2026 해외직판 포럼 안내"
          className={fieldClass}
        />
        <p className="mt-2 text-[13px] text-ink-400">
          관리 목록에서 구분하기 위한 이름입니다. 방문자에게는 보이지 않습니다.
        </p>
      </div>

      <div className="rounded-card border border-line bg-page p-6">
        <p className="mb-3 text-[13px] font-bold text-ink-700">팝업 이미지</p>
        <PopupImageUploader name="imageUrl" defaultValue={initial.imageUrl} />

        <div className="mt-6">
          <label htmlFor="imageAlt" className={labelClass}>
            이미지 설명 <span className="font-normal text-ink-400">(선택)</span>
          </label>
          <input
            id="imageAlt"
            name="imageAlt"
            type="text"
            maxLength={300}
            defaultValue={initial.imageAlt}
            placeholder="예) 2026 해외직판 포럼 참가 신청 안내"
            className={fieldClass}
          />
          <p className="mt-2 text-[13px] text-ink-400">
            눈이 불편한 분이 쓰는 화면 읽기 프로그램이 이 문장을 읽어 줍니다.
            비워 두면 팝업 이름을 대신 읽습니다.
          </p>
        </div>
      </div>

      <div className="rounded-card border border-line bg-page p-6">
        <label htmlFor="linkUrl" className={labelClass}>
          연결 주소 <span className="font-normal text-ink-400">(선택)</span>
        </label>
        <input
          id="linkUrl"
          name="linkUrl"
          type="text"
          maxLength={2048}
          defaultValue={initial.linkUrl}
          placeholder="/board/10  또는  https://cafe.naver.com/..."
          className={fieldClass}
        />
        <p className="mt-2 text-[13px] leading-[1.8] text-ink-400">
          방문자가 팝업 이미지를 클릭하면 이 주소로 이동합니다(새 창). 비워 두면
          클릭해도 아무 일이 일어나지 않습니다.
          <br />
          <b>협회 홈페이지 안의 게시글로 연결할 때</b>는 주소 전체가 아니라{" "}
          <b>/board/10</b> 처럼 <b>/</b> 부터 적어 주세요. 나중에 홈페이지 주소가
          바뀌어도 링크가 깨지지 않습니다.
        </p>
      </div>

      <div className="rounded-card border border-line bg-page p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startsAt" className={labelClass}>
              노출 시작 <span className="font-normal text-ink-400">(선택)</span>
            </label>
            <input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              defaultValue={initial.startsAt}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="endsAt" className={labelClass}>
              노출 종료 <span className="font-normal text-ink-400">(선택)</span>
            </label>
            <input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              defaultValue={initial.endsAt}
              className={fieldClass}
            />
          </div>
        </div>
        <p className="mt-3 text-[13px] text-ink-400">
          비워 두면 기간 제한 없이 계속 노출됩니다. 행사 안내처럼 끝나는 날이
          정해져 있으면 <b>종료 일시를 넣어 두시는 편이 안전합니다.</b> 나중에
          내리는 것을 잊어도 자동으로 사라집니다.
        </p>

        <label className="mt-5 flex w-fit items-center gap-2.5 text-[14px] font-medium text-ink-700">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initial.isActive}
            className="h-4 w-4 accent-brand-900"
          />
          지금 사용 (체크해야 방문자에게 보입니다)
        </label>
        <p className="mt-2 text-[13px] text-ink-400">
          사용 중인 팝업이 여러 개면 <b>가장 최근에 수정한 것 하나만</b>{" "}
          나타납니다.
        </p>
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
          href="/admin/popups"
          className="rounded-btn px-5 py-3.5 text-[15px] font-bold text-ink-500 transition-colors hover:bg-surface"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
