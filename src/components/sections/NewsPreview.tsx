import Link from "next/link";
import { BOARD_LABEL } from "@/content/association";
import { getRecentPosts } from "@/lib/db/queries";
import { Section, SectionHeading } from "@/components/ui/Section";
import { NewsTabs, type NewsItem } from "./NewsTabs";

/** 게시판 미리보기. 분류 탭은 클라이언트에서 전환합니다. */
export async function NewsPreview() {
  // 분류별로 채워지도록 넉넉히 가져온 뒤 탭에서 걸러 냅니다.
  const recent = await getRecentPosts(20);

  const items: NewsItem[] = recent.map((post) => ({
    id: post.id,
    title: post.title,
    category: post.category,
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <Section id="news" tone="page">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading title={BOARD_LABEL} />
        <Link
          href="/board"
          className="border-b border-ink-400/50 pb-1.5 text-[15px] font-medium whitespace-nowrap text-ink-700 transition-colors hover:border-brand-600 hover:text-brand-700"
        >
          전체보기
        </Link>
      </div>

      <NewsTabs items={items} />
    </Section>
  );
}
