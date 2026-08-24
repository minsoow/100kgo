import "server-only";
import { del } from "@vercel/blob";

/**
 * Blob 스토리지에서 파일을 삭제합니다.
 * 스토리지 오류가 DB 작업(글 수정·삭제)을 막지 않도록 실패는 로깅만 합니다.
 */
export async function deleteBlobs(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  try {
    await del(urls);
  } catch (error) {
    console.error("[deleteBlobs] 첨부파일 삭제 실패:", urls, error);
  }
}
