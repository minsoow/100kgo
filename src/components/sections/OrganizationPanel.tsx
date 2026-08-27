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

        {/*
          사무국은 하부 조직의 상급 부서가 아니라 이사장을 지원하는 조직입니다.
          이사장에서 하부 부서로 내려가는 선의 옆으로 갈라져 나오게 그립니다
          (「홈피 요청」 2번). 좁은 화면에서는 옆으로 뺄 자리가 없어
          세로로 이어 붙입니다.
        */}
        <div className="relative mx-auto flex flex-col items-center">
          <div aria-hidden className="h-8 w-px bg-line md:h-24" />

          {/* 데스크톱에서 선 중간에서 오른쪽으로 뻗는 가지 */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 hidden h-px w-24 bg-line md:block lg:w-32"
          />

          {/*
            사무국 노드는 하나만 둡니다. 데스크톱에서는 가지 끝으로 띄우고
            모바일에서는 그냥 선 아래에 놓습니다. 화면별로 두 벌을 두면
            스크린리더가 "사무국" 을 두 번 읽습니다.
          */}
          <div className="w-full max-w-sm md:absolute md:top-1/2 md:left-[calc(50%+6rem)] md:w-56 md:max-w-none md:-translate-y-1/2 lg:left-[calc(50%+8rem)]">
            <Node name={organization.office} tone="muted" />
          </div>

          <div aria-hidden className="h-8 w-px bg-line md:hidden" />
        </div>

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
