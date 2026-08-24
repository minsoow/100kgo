import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/db/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// 게시글이 추가되어도 하루 안에 sitemap에 반영되도록 재생성
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/board`, changeFrequency: "weekly", priority: 0.8 },
  ];

  // 게시글은 최근 100건까지만 포함 (DB 미설정 시 빈 배열)
  const pages = await Promise.all(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => listPosts({ page })),
  );

  const postRoutes: MetadataRoute.Sitemap = pages
    .flatMap((result) => result.items)
    .map((post) => ({
      url: `${siteUrl}/board/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...postRoutes];
}
