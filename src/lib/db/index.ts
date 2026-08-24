import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * DATABASE_URL 이 아직 설정되지 않아도 랜딩페이지는 정상 동작해야 하므로
 * 연결은 지연 생성하고, 미설정 상태는 `isDatabaseConfigured()` 로 판별합니다.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

// 개발 중 HMR로 커넥션 풀이 중복 생성되는 것을 방지
const globalForDb = globalThis as unknown as {
  __kodsaPool?: Pool;
};

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL 환경변수가 설정되지 않았습니다. .env.local 을 확인하세요.",
    );
  }

  if (!globalForDb.__kodsaPool) {
    globalForDb.__kodsaPool = new Pool({
      connectionString,
      // Neon 등 관리형 Postgres는 SSL 필수. 로컬(localhost)은 예외.
      ssl: /localhost|127\.0\.0\.1/.test(connectionString)
        ? undefined
        : { rejectUnauthorized: false },
      max: 5,
    });
  }

  return globalForDb.__kodsaPool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

export { schema };
