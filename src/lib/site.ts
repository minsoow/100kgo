/**
 * 검색엔진 색인 허용 플래그.
 *
 * **기본값은 "차단"입니다.** `NEXT_PUBLIC_ALLOW_INDEXING=1` 을 명시적으로
 * 넣은 배포에서만 색인이 열립니다.
 *
 * 예전에는 반대였습니다(`NEXT_PUBLIC_NOINDEX=1` 이면 차단). 그래서 환경변수를
 * 넣기 전에 Git 을 먼저 연결했더니 연결 즉시 자동 빌드가 돌면서 차단이 빠진
 * 채로 배포됐습니다(2026-08-25). robots.txt 가 `Allow: /` 로, sitemap 이
 * localhost 로 나갔습니다.
 *
 * 변수를 "깜빡한" 배포가 곧 "공개" 배포가 되는 구조라 사고가 났습니다.
 * 지금은 깜빡하면 차단되므로, 실수의 결과가 안전한 쪽으로 떨어집니다.
 *
 * 정식 오픈 시: Vercel 에 `NEXT_PUBLIC_ALLOW_INDEXING=1` 을 추가하고 재배포.
 */
export const NOINDEX = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "1";
