import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * 게시판은 1개이며, 카테고리로 구분합니다 (해외직판정보센터).
 * 견적 범위의 "CMS 게시판 1개"를 유지한 채 탭으로만 나눕니다.
 *
 * enum 값 순서 = 게시판 탭 노출 순서.
 */
export const postCategoryEnum = pgEnum("post_category", [
  "support",
  "notice",
  "finance",
]);

export const POST_CATEGORIES = {
  support: "지원사업정보센터",
  notice: "공지사항",
  finance: "재무고시",
} as const;

export type PostCategory = keyof typeof POST_CATEGORIES;

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    category: postCategoryEnum("category").notNull().default("notice"),
    title: varchar("title", { length: 300 }).notNull(),
    /** 에디터로 작성된 HTML (저장 전 서버에서 sanitize) */
    content: text("content").notNull().default(""),
    /** 목록 상단 고정 */
    isPinned: boolean("is_pinned").notNull().default(false),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("posts_category_idx").on(table.category),
    index("posts_created_at_idx").on(table.createdAt),
  ],
);

export const attachments = pgTable(
  "attachments",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    /** Vercel Blob 공개 URL */
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type", { length: 120 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("attachments_post_id_idx").on(table.postId)],
);

/** 협회 담당자 계정. 단일 관리자 운용을 전제로 하되 다계정도 가능. */
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Attachment = typeof attachments.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
