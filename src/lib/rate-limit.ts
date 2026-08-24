import "server-only";

/**
 * 로그인 시도 제한 (인메모리).
 *
 * 서버리스 환경에서는 인스턴스별로 카운터가 분리되므로 완전한 방어는 아닙니다.
 * 단일 관리자 계정 + 소규모 트래픽 기준의 1차 방어선이며,
 * 더 강한 제어가 필요해지면 Upstash Redis 등 외부 저장소로 교체하면 됩니다.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10분
const MAX_ATTEMPTS = 8;

type Entry = { count: number; firstAttemptAt: number };

const globalForLimiter = globalThis as unknown as {
  __kodsaLoginAttempts?: Map<string, Entry>;
};

const attempts =
  globalForLimiter.__kodsaLoginAttempts ??
  (globalForLimiter.__kodsaLoginAttempts = new Map<string, Entry>());

export function checkLoginRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil(
      (entry.firstAttemptAt + WINDOW_MS - now) / 1000,
    );
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetLoginRateLimit(key: string): void {
  attempts.delete(key);
}
