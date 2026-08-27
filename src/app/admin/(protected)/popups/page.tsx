import Link from "next/link";
import { listPopups } from "@/lib/db/queries";
import { formatDate } from "@/lib/format";
import {
  DeletePopupButton,
  TogglePopupButton,
} from "@/components/admin/PopupRowActions";

/**
 * 팝업 관리 목록.
 *
 * "사용 중" 이라고 해서 반드시 화면에 뜨는 것은 아닙니다. 노출 기간이 아직
 * 시작 전이거나 이미 끝났을 수 있어, 지금 실제로 보이는지를 따로 표시합니다.
 * 협회가 "켜 놨는데 왜 안 보이지?" 하고 헤매지 않게 하려는 것입니다.
 */
function describeVisibility(popup: {
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
}): { label: string; tone: "live" | "waiting" | "ended" | "off" } {
  if (!popup.isActive) return { label: "사용 안 함", tone: "off" };

  const now = new Date();
  if (popup.startsAt && popup.startsAt > now) {
    return { label: `${formatDate(popup.startsAt)} 부터`, tone: "waiting" };
  }
  if (popup.endsAt && popup.endsAt < now) {
    return { label: "기간 종료됨", tone: "ended" };
  }
  return { label: "지금 노출 중", tone: "live" };
}

const toneClass = {
  live: "bg-brand-900 text-white",
  waiting: "bg-amber-100 text-amber-800",
  ended: "bg-surface text-ink-400",
  off: "bg-surface text-ink-400",
} as const;

export default async function AdminPopupsPage() {
  const popups = await listPopups();

  return (
    <div className="container-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display-md text-brand-900">팝업 관리</h1>
          <p className="mt-1 text-[13px] text-ink-400">
            첫 화면에 뜨는 안내 팝업입니다. 총 {popups.length}건
          </p>
        </div>
        <Link
          href="/admin/popups/new"
          className="rounded-btn bg-brand-900 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-800"
        >
          + 새 팝업 만들기
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-card border border-line bg-page">
        {popups.length === 0 ? (
          <p className="px-6 py-20 text-center text-[14px] text-ink-400">
            등록된 팝업이 없습니다. 행사나 공지가 있을 때 만들어 보세요.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {popups.map((popup) => {
              const visibility = describeVisibility(popup);
              return (
                <li
                  key={popup.id}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={popup.imageUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-btn border border-line object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/popups/${popup.id}/edit`}
                      className="block truncate text-[15px] font-medium text-ink-900 hover:text-brand-700"
                    >
                      {popup.title}
                    </Link>
                    <p className="mt-1 text-[13px] text-ink-400">
                      {popup.linkUrl ? "클릭 시 이동함" : "연결 주소 없음"}
                      {" · "}
                      {popup.startsAt || popup.endsAt
                        ? `${popup.startsAt ? formatDate(popup.startsAt) : "제한 없음"} ~ ${popup.endsAt ? formatDate(popup.endsAt) : "제한 없음"}`
                        : "기간 제한 없음"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-btn px-2.5 py-1 text-[12px] font-bold ${toneClass[visibility.tone]}`}
                  >
                    {visibility.label}
                  </span>

                  <span className="flex shrink-0 items-center gap-1">
                    <TogglePopupButton
                      id={popup.id}
                      isActive={popup.isActive}
                    />
                    <Link
                      href={`/admin/popups/${popup.id}/edit`}
                      className="rounded-btn px-3 py-1.5 text-[13px] font-bold text-brand-600 transition-colors hover:bg-brand-50"
                    >
                      수정
                    </Link>
                    <DeletePopupButton id={popup.id} title={popup.title} />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-5 text-[13px] leading-[1.8] text-ink-400">
        팝업은 한 번에 하나만 보입니다. 사용 중인 팝업이 여럿이면 가장 최근에
        수정한 것이 나타납니다.
        <br />
        방문자가 <b>[다시 보지 않기]</b> 를 누르면 그 팝업은 더 이상 보이지
        않습니다. 다만 <b>팝업을 수정하면 다시 보입니다.</b>
      </p>
    </div>
  );
}
