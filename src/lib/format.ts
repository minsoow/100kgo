/**
 * 날짜·시각은 전부 한국 시간(Asia/Seoul) 기준입니다.
 *
 * 서버(Vercel)의 시간대는 UTC 입니다. getHours() 나 `new Date("2026-10-22T14:04")`
 * 처럼 "서버 로컬 시간"에 기대면 내 PC(한국)에서는 맞고 배포 환경에서만 9시간
 * 어긋납니다. 2026-10-22 에 이 때문에 협회가 설정한 팝업이 9시간 늦게
 * 시작되도록 저장돼 "팝업이 안 뜬다"는 신고가 들어왔습니다.
 * 날짜를 다루는 코드는 이 파일의 함수만 쓰고, 로컬 시간 메서드를 직접 쓰지 마세요.
 */
const TIME_ZONE = "Asia/Seoul";

const partsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function kstParts(date: Date) {
  const map: Record<string, string> = {};
  for (const part of partsFormatter.formatToParts(date)) {
    map[part.type] = part.value;
  }
  return map as Record<
    "year" | "month" | "day" | "hour" | "minute",
    string
  >;
}

/** 2026. 08. 07. 형태로 표기 */
export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const { year, month, day } = kstParts(date);
  return `${year}. ${month}. ${day}.`;
}

/** datetime-local 입력칸에 넣을 "YYYY-MM-DDTHH:mm" (한국 시각) */
export function toKstInputValue(value: Date | null): string {
  if (!value) return "";
  const { year, month, day, hour, minute } = kstParts(value);
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * datetime-local 입력값("2026-10-22T14:04")을 한국 시각으로 해석해 Date 로 바꿉니다.
 * 비어 있거나 형식이 틀리면 null.
 */
export function parseKstInput(raw: string): Date | null {
  const value = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) return null;
  const date = new Date(`${value}+09:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 첨부파일 용량 표기 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
