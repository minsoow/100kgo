/**
 * 협회 자료 수령 전 자리표시자 값 처리.
 * `TODO_` 접두사가 붙은 값은 아직 확정되지 않은 정보로 간주하고
 * 화면에는 대체 문구를 노출합니다.
 */
export function isPending(value: string): boolean {
  return value.startsWith("TODO_");
}

export function resolveContent(value: string, fallback = "준비 중"): string {
  return isPending(value) ? fallback : value;
}
