import { z } from "zod";

/** 클라이언트에서 Blob 업로드를 마친 뒤 폼으로 전달되는 첨부파일 메타데이터 */
export const attachmentInputSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url().max(2048),
  fileSize: z.number().int().nonnegative(),
  mimeType: z.string().min(1).max(120),
});

export const attachmentInputListSchema = z.array(attachmentInputSchema).max(10);

export type AttachmentInput = z.infer<typeof attachmentInputSchema>;

export function parseAttachmentsField(raw: string | null): AttachmentInput[] {
  if (!raw) return [];
  try {
    return attachmentInputListSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

/**
 * 본문 HTML 안에 삽입된 이미지의 Blob 주소를 뽑아냅니다.
 *
 * 본문 이미지는 attachments 테이블에 기록되지 않으므로, 글을 지우거나 이미지를
 * 뺐을 때 이 목록을 근거로 스토리지에서도 지워야 고아 파일이 남지 않습니다.
 *
 * 우리 스토리지 주소만 대상으로 합니다. 외부에서 붙여넣은 이미지 주소까지
 * 지우려 들면 남의 자원에 삭제를 시도하게 됩니다.
 */
export function extractBlobImageUrls(html: string): string[] {
  const found = new Set<string>();
  const pattern = /<img[^>]+src="([^"]+)"/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const url = match[1];
    if (/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//i.test(url)) {
      found.add(url);
    }
  }

  return [...found];
}
