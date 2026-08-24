import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "./db";
import { adminUsers } from "./db/schema";
import { SESSION_COOKIE } from "./session-cookie";

export { SESSION_COOKIE };
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8시간

export type SessionPayload = {
  userId: number;
  username: string;
  displayName: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET 환경변수가 없거나 32자 미만입니다. `openssl rand -base64 32` 로 생성해 .env.local 에 설정하세요.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return {
      userId: Number(payload.userId),
      username: String(payload.username),
      displayName: String(payload.displayName),
    };
  } catch {
    // 만료·위조 토큰은 비로그인으로 처리
    return null;
  }
}

/**
 * 모든 관리자 Server Action의 첫 줄에서 호출합니다.
 * 화면 렌더 단계의 접근 제어만으로는 Server Action 직접 호출을 막을 수 없습니다.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<SessionPayload | null> {
  if (!isDatabaseConfigured()) return null;

  const db = getDb();
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  if (!user) {
    // 사용자 존재 여부가 응답 시간으로 드러나지 않도록 더미 비교 수행
    await bcrypt.compare(password, "$2a$10$invalidsaltinvalidsaltinvalidsaltuO");
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return null;

  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, user.id));

  return {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
  };
}
