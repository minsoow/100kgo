/**
 * 시안 확인용 임시 배포 플래그.
 *
 * NEXT_PUBLIC_NOINDEX=1 이면 robots.txt 와 메타태그로 검색엔진 색인을 막습니다.
 * 자리표시자 콘텐츠(임시 사진, "회원사 01", 미확정 연락처)가 협회 이름으로
 * 검색에 노출되지 않도록 하기 위한 안전장치입니다.
 *
 * 정식 오픈 시에는 이 환경변수를 제거하세요.
 */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

