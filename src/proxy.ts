import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * 관리자 영역 1차 게이트.
 *
 * 세션 쿠키의 존재만 확인해 불필요한 렌더링을 줄입니다.
 * 실제 서명 검증과 접근 제어는 `src/app/admin/(protected)/layout.tsx` 와
 * 각 Server Action의 `requireAdmin()` 에서 수행합니다.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
