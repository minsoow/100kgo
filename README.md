# 한국온라인해외직판협회 홈페이지 (KODSA)

원페이지 랜딩페이지 + CMS 게시판 1개.
제작: 이이공이(2202) / 견적번호 2202-2026-07-01

- 제작 계획 및 범위: [docs/PLAN.md](docs/PLAN.md)
- 개발·배포 가이드: [docs/개발_가이드.md](docs/개발_가이드.md)
- 협회 담당자용 CMS 사용법: [docs/CMS_사용법.md](docs/CMS_사용법.md)

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, Turbopack) / React 19 / TypeScript |
| 스타일 | Tailwind CSS v4 |
| DB | PostgreSQL + Drizzle ORM |
| 파일 저장 | Vercel Blob |
| 인증 | jose(JWT) + bcryptjs, httpOnly 세션 쿠키 |
| 에디터 | Tiptap 3 |

## 빠른 시작

```bash
npm install
```

`.env.example` 을 `.env.local` 로 복사해 값을 채운 뒤:

```bash
npm run db:migrate
```

관리자 계정을 만들고 (비밀번호는 셸 기록에 남지 않도록 환경변수 사용):

```bash
ADMIN_PASSWORD='설정할비밀번호' npm run admin:create -- --username admin --name "협회 담당자"
```

```bash
npm run dev
```

- 홈페이지: http://localhost:3000
- 게시판: http://localhost:3000/board
- 관리자: http://localhost:3000/admin

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` / `npm start` | 프로덕션 빌드 / 실행 |
| `npm run typecheck` | 라우트 타입 생성 + 타입 검사 |
| `npm run lint` | ESLint |
| `npm run db:generate` | 스키마 변경 → 마이그레이션 SQL 생성 |
| `npm run db:migrate` | 마이그레이션 적용 |
| `npm run db:studio` | Drizzle Studio (DB GUI) |
| `npm run admin:create` | 관리자 계정 생성 / 비밀번호 재설정 |

## 디렉터리 구조

```
src/
├── app/
│   ├── page.tsx                  원페이지 랜딩
│   ├── board/                    공개 게시판 (목록 · 상세)
│   ├── admin/                    관리자 CMS
│   │   ├── login/                로그인
│   │   ├── (protected)/          인증 필요 영역
│   │   └── actions.ts            Server Actions (로그인 · 글 CRUD)
│   ├── api/upload/               Blob 업로드 토큰 발급
│   ├── robots.ts, sitemap.ts
│   └── privacy/
├── components/
│   ├── layout/                   Header · Footer
│   ├── sections/                 랜딩 섹션
│   ├── board/                    게시판 공용 UI
│   ├── admin/                    에디터 · 업로더 · 폼
│   └── ui/
├── content/                      ★ 협회 원고 · 회원사 데이터 (여기만 고치면 내용 변경)
├── lib/
│   ├── db/                       스키마 · 커넥션 · 쿼리
│   ├── auth.ts, rate-limit.ts, sanitize.ts, blob.ts
│   └── format.ts, attachments.ts
└── proxy.ts                      /admin 1차 접근 차단
```

## 콘텐츠 수정 위치

| 수정 대상 | 파일 |
|---|---|
| 협회 소개·인사말·6대 사업·비전 원고 | `src/content/association.ts` |
| 협회 주소·연락처·사업자번호 | `src/content/association.ts` 의 `contact` |
| 회원사(성공사례) 10개사 | `src/content/members.ts` |
| 공지사항·재무고시 | 코드 수정 불필요 — 관리자 CMS에서 등록 |

`TODO_` 로 시작하는 값은 협회 자료 수령 전 자리표시자이며, 화면에는 "준비 중"으로 표시됩니다.
