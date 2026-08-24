/**
 * 관리자 계정 생성/비밀번호 재설정 스크립트.
 *
 * 사용법 (비밀번호가 셸 기록에 남지 않도록 환경변수 사용을 권장):
 *   ADMIN_PASSWORD=원하는비밀번호 npm run admin:create -- --username admin --name "홍길동"
 *
 * 같은 아이디가 이미 있으면 비밀번호와 이름을 갱신합니다.
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { adminUsers } from "../src/lib/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const username = getArg("username") ?? "admin";
  const displayName = getArg("name") ?? "협회 담당자";
  const password = process.env.ADMIN_PASSWORD ?? getArg("password");

  if (!password) {
    throw new Error(
      "비밀번호가 필요합니다. ADMIN_PASSWORD 환경변수 또는 --password 옵션을 사용하세요.",
    );
  }
  if (password.length < 10) {
    throw new Error("비밀번호는 10자 이상으로 설정해 주세요.");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
      ? undefined
      : { rejectUnauthorized: false },
  });
  const db = drizzle(pool);

  const passwordHash = await bcrypt.hash(password, 12);

  const [existing] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  if (existing) {
    await db
      .update(adminUsers)
      .set({ passwordHash, displayName })
      .where(eq(adminUsers.id, existing.id));
    console.log(`✔ 기존 관리자 계정을 갱신했습니다: ${username}`);
  } else {
    await db.insert(adminUsers).values({ username, passwordHash, displayName });
    console.log(`✔ 관리자 계정을 생성했습니다: ${username}`);
  }

  await pool.end();
}

main().catch((error) => {
  console.error("✖ 관리자 계정 처리 실패:", error.message);
  process.exit(1);
});
