import { organization } from "@/content/association";

/**
 * 조직도 탭 패널.
 *
 * 가로 흐름으로 눕혔던 버전은 되돌리고, 위에서 아래로 내려오는 원래
 * 세로 계층 구조로 복원했습니다. 조직도는 상하 관계를 읽는 그림이라
 * 세로 배치가 더 자연스럽습니다.
 *
 * 협회 요청에 따라 담당자명은 표기하지 않고 조직명만 사용합니다.
 */

function Connector() {
  return <div aria-hidden className="mx-auto h-8 w-px bg-line md:h-10" />;
}

function Node({
  name,
  note,
  tone = "default",
}: {
  name: string;
  note?: string;
  tone?: "default" | "primary" | "muted";
}) {
  const styles = {
    default: "border-line bg-page text-brand-900",
    primary: "border-transparent bg-brand-900 text-white",
    muted: "border-line bg-surface text-ink-700",
  }[tone];

  return (
    <div className={`rounded-card border px-5 py-4 text-center ${styles}`}>
      <p className="text-[15px] font-bold md:text-[16px]">{name}</p>
      {note && (
        <p
          className={`mt-1 text-[12px] font-normal ${
            tone === "primary" ? "text-white/60" : "text-ink-400"
          }`}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export function OrganizationPanel() {
  const [general, audit, board] = organization.governance;

  return (
    <div>
      <p className="reveal max-w-2xl text-[16px] leading-[1.85] text-ink-500">
        {organization.description}
      </p>

      <div className="mt-12 md:mt-16">
        {/* 총회 + 감사 (감사는 총회에서 옆으로 갈라짐) */}
        <div className="mx-auto grid max-w-3xl items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="md:col-start-1">
            <Node name={general.name} note={general.note} />
          </div>
          <div
            aria-hidden
            className="mx-auto hidden h-px w-12 bg-line md:col-start-2 md:block"
          />
          <div className="md:col-start-3">
            <Node name={audit.name} note={audit.note} tone="muted" />
          </div>
        </div>

        <Connector />
        <div className="mx-auto max-w-sm">
          <Node name={board.name} note={board.note} />
        </div>

        <Connector />
        <div className="mx-auto max-w-sm">
          <Node name={organization.chair} tone="primary" />
        </div>

        <Connector />
        <div className="mx-auto max-w-sm">
          <Node name={organization.office} tone="muted" />
        </div>

        <Connector />
        <div aria-hidden className="mx-auto h-px w-full max-w-5xl bg-line" />

        <ul className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {organization.divisions.map((division) => (
            <li key={division}>
              <div className="rounded-card border border-line bg-page px-5 py-4 text-center text-[15px] font-bold text-brand-900">
                {division}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
