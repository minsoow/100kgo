import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/db/queries";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: PageProps<"/admin/posts/[id]/edit">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) notFound();

  const post = await getPost(postId);
  if (!post) notFound();

  return (
    <div className="container-page max-w-4xl">
      <Link
        href="/admin/posts"
        className="text-[13px] font-bold text-ink-400 transition-colors hover:text-brand-700"
      >
        ← 목록으로
      </Link>
      <h1 className="display-md mt-3 mb-7 text-brand-900">
        글 수정
      </h1>

      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          category: post.category,
          content: post.content,
          isPinned: post.isPinned,
          attachments: post.attachments.map((file) => ({
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
          })),
        }}
      />
    </div>
  );
}
