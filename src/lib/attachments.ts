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
