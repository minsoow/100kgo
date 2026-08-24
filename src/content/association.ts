/**
 * 협회 기본 정보 및 랜딩페이지 원고.
 *
 * 원고 출처: 협회 제공 「홈페이지 구성안_0731」
 * 연락처·법인 정보 출처: 협회 회신 「자료요청서_답변_0819」
 */

export const association = {
  nameShort: "한국온라인해외직판협회",
  nameFull: "사단법인 한국온라인해외직판협회",
  /** 협회 CI에 표기된 공식 영문명 */
  nameEn: "KOREA ONLINE OVERSEAS DIRECT SALES ASSOCIATION",
  chairman: "권대욱",

  contact: {
    representative: "권대욱",
    address: "(04553) 서울특별시 중구 수표로10길 5-5, 601호",
    tel: "010-5062-8574",
    email: "subarru@kakao.com",
    /** 발급 진행 중 (2026-08-19 회신). 번호 수령 시 교체 */
    businessNumber: "TODO_사업자등록번호",
  },

  /** 가입·제휴 문의 창구 (협회 지정) */
  inquiryEmail: "subarru@kakao.com",

  /** 외부 채널 (협회 제공) */
  channels: {
    academy: "https://cafe.naver.com/kbbsacademy",
    forum: "https://cafe.naver.com/f-e/cafes/30902180/menus/62",
  },
} as const;

/**
 * 게시판 명칭.
 *
 * 게시판은 1개이고 카테고리(지원사업정보센터/공지사항/재무고시)로만 나뉩니다.
 * 메뉴·홈 섹션·게시판 페이지가 모두 이 문구 하나를 참조합니다.
 */
export const BOARD_LABEL = "해외직판정보센터";

/**
 * GNB — 원페이지 앵커.
 *
 * 게시판은 별도 버튼으로 노출하므로 여기에 넣지 않습니다.
 * (같은 곳으로 가는 항목이 메뉴에 두 번 나오지 않게)
 */
export const navItems = [
  { label: "협회소개", href: "/#about" },
  { label: "해외직판아카데미", href: "/#academy" },
  { label: "해외직판포럼", href: "/#forum" },
] as const;

export const hero = {
  eyebrow: "KODSA · 사단법인 한국온라인해외직판협회",
  headline: "대한민국의 다음 수출은\n해외직판입니다.",
  description:
    "국내를 넘어 세계의 소비자에게 직접 판매하는 시대.\n중소기업·소상공인의 새로운 수출길을 만듭니다.",
  primaryCta: { label: "협회 소개 보기", href: "#about" },
  /** 협회 지정 가입·제휴 문의 창구 */
  secondaryCta: { label: "가입 · 제휴 문의", href: "mailto:subarru@kakao.com" },
} as const;

/**
 * 히어로 배경 미디어 (풀스크린).
 *
 * 영상이 준비되면 videoSrc 에 경로만 넣으면 자동으로 영상이 재생됩니다.
 *   예) videoSrc: "/media/hero.mp4"
 * muted·loop·autoplay·playsInline 로 재생되며, 로딩 전과 미지원 환경에서는
 * poster 이미지가 그대로 보입니다.
 */
export const heroMedia = {
  videoSrc: null as string | null,
  /**
   * 빛의 점과 선이 연결된 네트워크 이미지 (Unsplash License).
   * 원본은 메시가 화면 하단에 몰려 헤드라인과 겹치므로, 상하를 뒤집어
   * 문구 자리를 비운 상태로 저장했습니다.
   */
  image: "/images/hero.jpg",
  alt: "세계 시장과 연결되는 네트워크를 상징하는 이미지",
} as const;

export const about = {
  title: "협회소개",
  headline:
    "교육 · 성공모델 확산 · 정책협력 · 네트워크를 통해\n대한민국 10만 해외직판상 시대를 만들어갑니다.",
  paragraphs: [
    "국내시장은 빠르게 변화하고 있습니다. 치열한 경쟁과 소비 둔화 속에서 많은 소상공인과 중소기업은 새로운 성장의 길을 찾고 있습니다.",
    "한국온라인해외직판협회는 이러한 변화 속에서 해외 소비자에게 직접 판매하는 해외직판을 대한민국의 새로운 성장 전략으로 제시합니다.",
    "우리는 단순히 상품을 해외에 판매하는 방법을 교육하는 단체가 아닙니다. 국내의 우수한 상품이 세계 소비자와 직접 연결될 수 있도록 여섯 가지 사업을 통해 실질적인 성과를 만드는 실행형 협회입니다.",
  ],
  /**
   * 협회 활동 사진 3장 (협회 제공, 파일명 기준으로 설명을 붙였습니다).
   * 원본 비율이 제각각이라 모두 4:3 가로로 통일해 다시 잘랐습니다.
   */
  photos: [
    {
      src: "/images/about-1.jpg",
      caption: "국내 서칭투어 · 회원사 상품 발굴 현장",
    },
    {
      src: "/images/about-2.jpg",
      caption: "해외직판아카데미 2기 수료식",
    },
    {
      src: "/images/about-3.jpg",
      caption: "회원사 자사몰 판매 상품",
    },
  ],
  closing:
    "특히 일본 시장을 시작으로 세계 시장까지 이어지는 현지화 자사몰 해외직판 모델을 확산하여, 대한민국 기업의 지속 가능한 글로벌 경쟁력을 만들어가고 있습니다.",
} as const;

/** 6대 사업 */
export const programs = [
  {
    id: "talent",
    title: "해외직판 전문인재 양성",
    description:
      "현장에서 바로 쓰는 실무 역량을 길러냅니다.",
  },
  {
    id: "mall",
    title: "자사몰 구축 및 운영 지원",
    description:
      "현지화 자사몰의 구축과 운영을 지원합니다.",
  },
  {
    id: "ai",
    title: "AI 기반 글로벌 마케팅",
    description:
      "AI를 활용해 글로벌 마케팅을 실행합니다.",
  },
  {
    id: "insight",
    title: "해외시장 정보 제공",
    description:
      "주요 시장의 소비 트렌드와 규제를 전합니다.",
  },
  {
    id: "policy",
    title: "정부·지자체 정책 협력",
    description:
      "수출 지원 정책과 회원사를 연결합니다.",
  },
  {
    id: "network",
    title: "회원사 네트워크 구축",
    description:
      "회원사 간 협력 네트워크를 만들어갑니다.",
  },
] as const;

export const vision = {
  label: "VISION",
  figure: "10만",
  headline: "10만 해외직판상 양성",
  description:
    "한국온라인해외직판협회는 ‘10만 해외직판상 양성’이라는 비전을 바탕으로 대한민국을 해외직판 강국으로 만드는 새로운 길을 만들어 가겠습니다.",
} as const;

export const greeting = {
  title: "협회장 인사말",
  headline: "세계를 시장으로.\n함께 시작합시다.",
  paragraphs: [
    "안녕하십니까. 한국온라인해외직판협회 회장 권대욱입니다.",
    "대한민국에는 세계 어디에 내놓아도 경쟁력 있는 제품과 기술이 많습니다. 그러나 아직도 많은 기업과 소상공인은 국내시장이라는 좁은 울타리 안에서 치열한 경쟁을 이어가고 있습니다.",
    "이제 시선을 세계로 돌려야 합니다. 인터넷과 AI의 발전은 국경의 의미를 바꾸고 있습니다. 이제 세계시장은 일부 대기업만의 무대가 아닙니다. 누구나 자신의 브랜드와 상품으로 세계 소비자를 만날 수 있는 시대가 열렸습니다.",
    "해외직판은 선택이 아니라 새로운 기회이며, 대한민국 경제의 새로운 성장동력이 될 것입니다.",
    "물론 혼자서는 쉽지 않습니다. 시장조사, 자사몰 구축, 현지화, 마케팅, 물류, 고객서비스까지 준비해야 할 일이 많습니다. 그래서 경험과 협력이 필요합니다.",
    "한국온라인해외직판협회는 단순히 교육하는 단체가 아닙니다. 회원들과 함께 배우고, 함께 실행하고, 함께 성장하는 실행 공동체가 되겠습니다. 교육에서 끝나지 않고 실제 판매가 이루어지고, 성공 사례가 이어지고, 세계시장에 도전하는 기업이 계속 탄생하도록 최선을 다하겠습니다.",
    "우리의 꿈은 분명합니다. 대한민국 10만 해외직판상을 양성하여 세계를 시장으로 만드는 것. 그 길이 대한민국 경제를 살리고, 소상공인과 중소기업의 미래를 여는 길이라고 믿습니다.",
    "그 길에 여러분과 함께하겠습니다. 감사합니다.",
  ],
  signature: {
    role: "한국온라인해외직판협회 회장",
    name: "권대욱",
    /**
     * 협회 제공 사진.
     * 원본은 세바시(SEBASI) 강연자 프로필 카드라 타 기관 로고·직함이 함께
     * 들어 있어, 인물 영역만 분리해 4:5로 재구성했습니다.
     */
    photo: "/images/chairman.jpg" as string | null,
  },
} as const;


export const channels = [
  {
    id: "academy",
    label: "해외직판아카데미",
    description:
      "해외직판 실무를 처음부터 배우는 교육 과정입니다. 네이버 카페에서 커리큘럼과 모집 일정을 확인하실 수 있습니다.",
    href: association.channels.academy,
    linkLabel: "아카데미 카페 바로가기",
  },
  {
    id: "forum",
    label: "해외직판포럼",
    description:
      "회원사와 전문가가 시장 정보와 실행 경험을 나누는 포럼입니다. 논의와 자료는 네이버 카페에서 이어집니다.",
    href: association.channels.forum,
    linkLabel: "포럼 바로가기",
  },
] as const;

/**
 * 운영위원회 조직도 (협회 제공 「100KGO 운영위원회 조직도」 2026-05-09 기준).
 * 협회 요청에 따라 담당자명은 표기하지 않고 조직명만 사용합니다.
 */
export const organization = {
  title: "조직도",
  description:
    "협회는 총회와 이사회를 중심으로, 아홉 개 실행 조직이 해외직판 사업을 나누어 맡고 있습니다.",
  /** 의결·감사 계층 */
  governance: [
    { name: "총회", note: "최고 의결기구" },
    { name: "감사", note: "회계 · 업무 감사" },
    { name: "이사회", note: "주요 사항 심의 · 의결" },
  ],
  chair: "이사장",
  office: "사무국",
  /** 이사장 산하 실행 조직 */
  divisions: [
    "아카데미원",
    "해외직판 연구원",
    "커뮤니케이션본부",
    "정책자금개발본부",
    "미디어홍보본부",
    "대외협력본부",
    "글로벌사업본부",
    "포럼운영위원회",
    "컨설팅본부",
  ],
} as const;
