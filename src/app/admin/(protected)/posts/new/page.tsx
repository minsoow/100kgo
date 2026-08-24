import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="container-page max-w-4xl">
      <Link
        href="/admin/posts"
        className="text-[13px] font-bold text-ink-400 transition-colors hover:text-brand-700"
      >
        ← 목록으로
      </Link>
      <h1 className="display-md mt-3 mb-7 text-brand-900">
        새 글 작성
      </h1>
      <PostForm />
    </div>
  );
}
