import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * 첨부파일 업로드 토큰 발급 라우트.
 *
 * Server Action은 요청 본문이 기본 1MB로 제한되므로, 파일은 브라우저에서
 * Vercel Blob으로 직접 업로드하고 이 라우트는 권한 검증 + 토큰 발급만 담당합니다.
 */

export const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  // 한글(HWP) — 환경에 따라 여러 MIME으로 전송됨
  "application/haansofthwp",
  "application/x-hwp",
  "application/vnd.hancom.hwp",
  "application/vnd.hancom.hwpx",
];

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "파일 저장소가 설정되지 않았습니다. BLOB_READ_WRITE_TOKEN 환경변수를 확인해 주세요.",
      },
      { status: 503 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // 로그인한 협회 담당자만 업로드 가능
        const session = await getSession();
        if (!session) {
          throw new Error("로그인이 필요합니다.");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: session.userId }),
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "업로드에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
