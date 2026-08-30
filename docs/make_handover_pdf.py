"""
협회 납품용 「산출물 정리」 PDF 생성 스크립트.

내용을 고친 뒤 다시 실행하면 PDF 가 갱신됩니다.
    python docs/make_handover_pdf.py

⚠️ 이 문서에는 관리자 비밀번호가 들어 있습니다.
   관리자 화면에 비밀번호 변경 기능이 없어, 협회가 스스로 바꿀 수 없기 때문에
   문서로 전달합니다. 그래서 이 파일은 아무에게나 전달하면 안 됩니다.
   담당자가 바뀌거나 유출이 의심되면 제작사가 재발급해야 합니다.
"""

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
    KeepTogether,
)

pdfmetrics.registerFont(TTFont("KR", "C:/Windows/Fonts/malgun.ttf"))
pdfmetrics.registerFont(TTFont("KR-Bd", "C:/Windows/Fonts/malgunbd.ttf"))

NAVY = colors.HexColor("#12161c")
BRAND = colors.HexColor("#1b54d6")
INK = colors.HexColor("#333b47")
MUTED = colors.HexColor("#5b6675")
LINE = colors.HexColor("#d8dee8")
SURFACE = colors.HexColor("#f5f7fa")

OUT = "docs/한국온라인해외직판협회_홈페이지_산출물.pdf"

# ── 스타일 ──────────────────────────────────────────────────────────
def S(name, **kw):
    base = dict(fontName="KR", fontSize=9.5, leading=15.5, textColor=INK)
    base.update(kw)
    return ParagraphStyle(name, **base)

st_title   = S("t",  fontName="KR-Bd", fontSize=21, leading=29, textColor=NAVY)
st_sub     = S("s",  fontSize=10.5, leading=17, textColor=MUTED)
st_h1      = S("h1", fontName="KR-Bd", fontSize=13, leading=19, textColor=NAVY,
               spaceBefore=15, spaceAfter=7)
st_body    = S("b",  spaceAfter=4)
st_note    = S("n",  fontSize=8.8, leading=14.5, textColor=MUTED)
st_cell    = S("c",  fontSize=9, leading=14)
st_cell_b  = S("cb", fontName="KR-Bd", fontSize=9, leading=14, textColor=NAVY)
st_foot    = S("f",  fontSize=8, leading=12, textColor=MUTED, alignment=TA_CENTER)

P  = lambda t, s=st_body: Paragraph(t, s)
C  = lambda t: Paragraph(t, st_cell)
CB = lambda t: Paragraph(t, st_cell_b)


def table(rows, widths, head=False):
    t = Table(rows, colWidths=widths, hAlign="LEFT")
    style = [
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    if head:
        style += [("BACKGROUND", (0, 0), (-1, 0), SURFACE)]
    else:
        style += [("BACKGROUND", (0, 0), (0, -1), SURFACE)]
    t.setStyle(TableStyle(style))
    return t


def rule(color=LINE, h=0.8, before=4, after=8):
    t = Table([[""]], colWidths=[165 * mm], rowHeights=[h])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), color)]))
    return [Spacer(1, before), t, Spacer(1, after)]


def page_deco(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BRAND)
    canvas.rect(0, A4[1] - 5 * mm, A4[0], 5 * mm, stroke=0, fill=1)
    canvas.setFont("KR", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(22 * mm, 12 * mm, "사단법인 한국온라인해외직판협회 홈페이지 구축")
    canvas.drawRightString(A4[0] - 22 * mm, 12 * mm, f"{doc.page}")
    canvas.restoreState()


story = []
a = story.append

# ── 표지 영역 ───────────────────────────────────────────────────────
a(Spacer(1, 6 * mm))
a(P("납품 산출물 안내", st_sub))
a(Spacer(1, 2 * mm))
a(P("사단법인 한국온라인해외직판협회<br/>홈페이지 구축", st_title))
a(Spacer(1, 4 * mm))
a(P("www.100kgo.kr", S("u", fontName="KR-Bd", fontSize=11, textColor=BRAND)))
a(Spacer(1, 3 * mm))
a(table([
    [CB("문서 작성일"), C("2026년 8월 29일"), CB("견적번호"), C("2202-2026-07-01")],
    [CB("수 행 사"), C("이이공이 (2202)"), CB("발 주 처"), C("사단법인 한국온라인해외직판협회")],
], [26 * mm, 45 * mm, 24 * mm, 70 * mm]))

# ── 1. 개요 ────────────────────────────────────────────────────────
a(P("1. 계약 범위 및 수행 결과", st_h1))
a(table([
    [CB("구분"), CB("계약 내용"), CB("수행 결과")],
    [C("홈페이지"), C("원페이지형 반응형 홈페이지"), C("완료")],
    [C("게시판"), C("CMS 게시판 1개"), C("완료 (3개 분류로 운영)")],
    [C("도메인"), C("도메인 연결 지원"), C("완료 (HTTPS 인증서 포함)")],
    [C("사용 안내"), C("CMS 사용법 문서"), C("완료 (별도 문서 전달)")],
    [C("하자보수"), C("납품 후 1개월"), C("적용")],
], [24 * mm, 66 * mm, 75 * mm], head=True))
a(Spacer(1, 3 * mm))
a(P("계약 금액 1,100,000원 (VAT 포함) · 견적번호 2202-2026-07-01", st_note))
a(P("추가 개발 100,000원 (VAT 별도) — 팝업 관리 기능 (아래 5항 참고)", st_note))

# ── 2. 접속 주소 ───────────────────────────────────────────────────
a(P("2. 접속 주소", st_h1))
a(table([
    [CB("홈페이지"), C("https://www.100kgo.kr")],
    [CB("관리자 화면"), C("https://www.100kgo.kr/admin")],
    [CB("관리자 아이디"), C("100kgo")],
    [CB("관리자 비밀번호"), C("100kgo100k")],
], [30 * mm, 135 * mm]))
a(Spacer(1, 2 * mm))
a(P("• 관리자 화면 주소는 홈페이지 어디에도 링크되어 있지 않으며 검색에도 노출되지 않습니다. "
    "즐겨찾기에 등록해 두시기 바랍니다.", st_note))
a(P("• <b>비밀번호가 적혀 있는 문서입니다.</b> 담당자 외에는 공유하지 마시고, 메신저 단체방 등에 "
    "올리지 않도록 주의해 주세요.", st_note))
a(P("• 담당자가 바뀌거나 비밀번호 유출이 의심될 때는 제작사로 연락 주시면 새 비밀번호를 "
    "발급해 드립니다. (관리자 화면에서 직접 변경하는 기능은 제공되지 않습니다)", st_note))

# ── 3. 화면 구성 ───────────────────────────────────────────────────
a(P("3. 구축 화면", st_h1))
LBL = 34 * mm   # "해외직판정보센터" 가 한 줄에 들어가는 최소 폭
a(table([
    [CB("첫 화면"), C("비전 문구 · 협회소개 / 협회장 인사말 / 조직도(탭) · 협회 비전 · "
                     "협회 주요 사업 5종 · 해외직판 아카데미 · 해외직판포럼 · 정보센터 최신글")],
    [CB("해외직판정보센터"), C("게시판 목록 · 분류 탭(전체 / 지원사업정보센터 / 공지사항 / 재무고시) · "
                            "제목·내용 검색 · 페이지 넘김")],
    [CB("게시글 상세"), C("본문 · 첨부파일 내려받기 · 이전글/다음글 이동")],
    [CB("개인정보처리방침"), C("12개 조항 (2026년 8월 31일 시행)")],
    [CB("관리자 화면"), C("게시판 관리 · 팝업 관리")],
], [LBL, 165 * mm - LBL]))
a(Spacer(1, 2 * mm))
a(P("PC · 태블릿 · 휴대폰 화면에 모두 대응합니다.", st_note))

# ── 4. 협회가 직접 관리하는 기능 ────────────────────────────────────
a(P("4. 협회에서 직접 관리하실 수 있는 기능", st_h1))
a(table([
    [CB("기능"), CB("내용")],
    [C("게시글"), C("등록 · 수정 · 삭제, 분류 지정, 목록 상단 고정")],
    [C("본문 편집"), C("굵게 · 제목 · 목록 · 인용 · 링크 · 표, 본문 중간에 사진 삽입")],
    [C("첨부파일"), C("PDF · 워드 · 한글 · 이미지 / 파일당 20MB, 글당 10개")],
    [C("팝업"), C("이미지 등록, 클릭 시 이동할 주소 지정, 노출 기간 예약, 켜고 끄기")],
], [LBL, 165 * mm - LBL], head=True))
a(Spacer(1, 2 * mm))
a(P("사용법은 함께 전달드리는 「협회 홈페이지 게시판 사용법」 문서에 화면별로 정리되어 있습니다. 보시다가 막히는 부분이 있으면 언제든 연락 주세요.", st_note))

# ── 5. 추가 개발 ───────────────────────────────────────────────────
a(P("5. 추가 개발 내역 (유상)", st_h1))
a(P("당초 견적 범위 밖의 항목으로, 협의에 따라 별도 진행했습니다.", st_body))
a(Spacer(1, 1 * mm))
a(table([
    [CB("항목"), CB("내용"), CB("금액")],
    [C("팝업 관리 기능"),
     C("첫 화면 안내 팝업. 협회가 직접 이미지를 등록하고 노출 기간을 정할 수 있습니다. "
       "방문자에게는 [닫기] · [다시 보지 않기] 버튼이 제공됩니다."),
     C("100,000원<br/>(VAT 별도)")],
], [30 * mm, 105 * mm, 30 * mm], head=True))

# ── 6. 인프라 ──────────────────────────────────────────────────────
# 제목과 표만 묶습니다. 아래 설명까지 묶으면 앞 쪽에 큰 여백이 생깁니다.
a(KeepTogether([
    P("6. 인프라 및 계정 현황", st_h1),
    table([
        [CB("구분"), CB("서비스"), CB("소유 계정"), CB("비용")],
        [C("도메인"), C("예스닉"), C("협회"), C("연 단위 갱신")],
        [C("웹 서버"), C("Vercel"), C("협회 Gmail"), C("무료 요금제")],
        [C("데이터베이스"), C("Neon (서울 리전)"), C("협회 Gmail"), C("무료 요금제")],
        [C("파일 저장소"), C("Vercel Blob"), C("협회 Gmail"), C("무료 요금제")],
    ], [24 * mm, 40 * mm, 40 * mm, 61 * mm], head=True),
]))
a(Spacer(1, 2 * mm))
a(P("• <b>모든 인프라 계정은 협회 명의로 개설되어 있습니다.</b> 제작사가 계정을 보유하지 않으므로 "
    "업체 종속 없이 협회가 직접 통제하실 수 있습니다.", st_note))
a(P("• 현재 트래픽 기준으로 무료 요금제 한도 내에서 운영됩니다. 방문자가 크게 늘면 "
    "유료 전환이 필요할 수 있으며, 그 시점에 별도로 안내드립니다.", st_note))
a(P("• 도메인은 <b>매년 갱신</b>이 필요합니다. 갱신하지 않으면 홈페이지 접속이 중단됩니다.", st_note))

# ── 7. 하자보수 ────────────────────────────────────────────────────
a(P("7. 하자보수 안내", st_h1))
a(table([
    [CB("기간"), C("납품일로부터 1개월")],
    [CB("범위"), C("정상적으로 사용했음에도 발생하는 시스템 오류의 수정")],
    [CB("범위 외"), C("콘텐츠 입력 실수, 신규 기능 추가, 디자인 변경, 협회 자료의 추가 반영")],
], [24 * mm, 141 * mm]))
a(Spacer(1, 2 * mm))
a(P("범위 외 요청은 사안에 따라 별도 견적으로 안내드립니다.", st_note))

# ── 8. 협회 관리 사항 ──────────────────────────────────────────────
a(P("8. 협회에서 관리하실 사항", st_h1))
a(table([
    [CB("항목"), CB("내용")],
    [C("관리자 비밀번호"), C("담당자가 바뀌면 제작사에 재발급을 요청해 주세요. 문서에 적힌 비밀번호가 외부로 나가지 않도록 관리가 필요합니다.")],
    [C("도메인 갱신"), C("예스닉에서 매년 갱신. 만료되면 홈페이지가 열리지 않습니다.")],
    [C("개인정보처리방침"), C("2026년 8월 31일 시행. 개인정보 보호책임자 성명이 정해지면 "
                          "알려 주시면 반영해 드립니다.")],
    [C("사진 저작권"), C("현재 협회소개·아카데미·포럼 사진은 저작권 문제가 없는 무료 이미지입니다. "
                     "인물이 드러나지 않는 실제 협회 사진을 주시면 교체해 드립니다.")],
], [LBL, 165 * mm - LBL], head=True))

# ── 9. 참고 ────────────────────────────────────────────────────────
a(P("9. 함께 전달드리는 문서", st_h1))
a(table([
    [CB("문서"), CB("용도")],
    [C("협회 홈페이지 게시판 사용법"), C("게시글·팝업 등록 방법 (담당자용)")],
    [C("본 산출물 안내"), C("납품 내역 및 관리 사항")],
], [55 * mm, 110 * mm], head=True))

a(Spacer(1, 8 * mm))
a(P("제작 · 운영 문의<br/>"
    "<b>이이공이 (2202)</b> · 010-9956-9545 · kookacola@naver.com", st_note))

a(Spacer(1, 6 * mm))
a(P("사단법인 한국온라인해외직판협회 · 고유번호 830-82-00824<br/>"
    "(04553) 서울특별시 중구 수표로10길 5-5, 601호", st_foot))

doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=22 * mm, rightMargin=22 * mm,
    topMargin=20 * mm, bottomMargin=20 * mm,
    title="한국온라인해외직판협회 홈페이지 산출물 안내",
    author="이이공이(2202)",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")
doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=page_deco)])
doc.build(story)
print("생성 완료:", OUT)
