import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js는 .env.local 을 자동으로 읽지만 drizzle-kit 은 그렇지 않습니다.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
