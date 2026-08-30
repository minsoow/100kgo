"""
협회 담당자용 「게시판·팝업 사용법」 PDF 생성 스크립트.

docs/CMS_사용법.md 를 읽어 산출물 안내와 같은 서식의 PDF 로 만듭니다.
마크다운을 고친 뒤 다시 실행하면 PDF 가 갱신됩니다.
    python docs/make_manual_pdf.py

마크다운 전체 문법을 지원하는 변환기가 아니라, 이 문서가 실제로 쓰는
문법(제목·표·목록·인용·굵게·구분선)만 처리합니다. 새 문법을 쓰면
여기에 규칙을 추가해야 합니다.
"""

import html
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepTogether, PageTemplate, Paragraph, Spacer,
    Table, TableStyle,
)

pdfmetrics.registerFont(TTFont("KR", "C:/Windows/Fonts/malgun.ttf"))
pdfmetrics.registerFont(TTFont("KR-Bd", "C:/Windows/Fonts/malgunbd.ttf"))

NAVY = colors.HexColor("#12161c")
BRAND = colors.HexColor("#1b54d6")
INK = colors.HexColor("#333b47")
MUTED = colors.HexColor("#5b6675")
LINE = colors.HexColor("#d8dee8")
SURFACE = colors.HexColor("#f5f7fa")
NOTE_BG = colors.HexColor("#eef3fc")

SRC = "docs/CMS_사용법.md"
OUT = "docs/한국온라인해외직판협회_홈페이지_사용법.pdf"
CONTENT_W = 165 * mm


def S(name, **kw):
    base = dict(fontName="KR", fontSize=9.5, leading=15.5, textColor=INK)
    base.update(kw)
    return ParagraphStyle(name, **base)


st_title = S("t", fontName="KR-Bd", fontSize=21, leading=29, textColor=NAVY)
st_sub = S("s", fontSize=10.5, leading=17, textColor=MUTED)
st_h1 = S("h1", fontName="KR-Bd", fontSize=14, leading=20, textColor=NAVY,
          spaceBefore=16, spaceAfter=7)
st_h2 = S("h2", fontName="KR-Bd", fontSize=11, leading=17, textColor=NAVY,
          spaceBefore=10, spaceAfter=4)
st_body = S("b", spaceAfter=3)
st_li = S("li", leftIndent=10, bulletIndent=2, spaceAfter=2)
st_note = S("n", fontSize=9, leading=14.5, textColor=INK)
st_cell = S("c", fontSize=9, leading=14)
st_cell_b = S("cb", fontName="KR-Bd", fontSize=9, leading=14, textColor=NAVY)
st_foot = S("f", fontSize=8, leading=12, textColor=MUTED, alignment=TA_CENTER)


def inline(text: str) -> str:
    """마크다운 인라인 서식을 reportlab 태그로."""
    t = html.escape(text)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<i>\1</i>", t)
    t = re.sub(r"`([^`]+?)`", r'<font face="KR-Bd" color="#1544ae">\1</font>', t)
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)   # 링크는 글자만 남김
    return t


def make_table(rows):
    ncol = max(len(r) for r in rows)
    body = []
    for i, r in enumerate(rows):
        r = r + [""] * (ncol - len(r))
        style = st_cell_b if i == 0 else st_cell
        body.append([Paragraph(inline(c), style) for c in r])

    first = 34 * mm if ncol > 1 else CONTENT_W
    widths = [first] + [(CONTENT_W - first) / (ncol - 1)] * (ncol - 1) if ncol > 1 else [CONTENT_W]

    t = Table(body, colWidths=widths, hAlign="LEFT", repeatRows=1)
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("BACKGROUND", (0, 0), (-1, 0), SURFACE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def make_note(lines):
    """> 인용 블록 → 옅은 배경의 강조 상자."""
    paras = [Paragraph(inline(l), st_note) for l in lines if l.strip()]
    t = Table([[p] for p in paras], colWidths=[CONTENT_W], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NOTE_BG),
        ("LINEBEFORE", (0, 0), (0, -1), 2.5, BRAND),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t


def parse(md: str):
    story, i = [], 0
    lines = md.split("\n")
    # 문서 제목(# ...)과 그 아래 안내문은 표지에서 따로 그리므로 건너뜁니다
    while i < len(lines) and not lines[i].startswith("## "):
        i += 1

    while i < len(lines):
        ln = lines[i]

        if ln.startswith("## "):
            story.append(Paragraph(inline(ln[3:]), st_h1)); i += 1

        elif ln.startswith("### "):
            story.append(Paragraph(inline(ln[4:]), st_h2)); i += 1

        elif ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(set(c) <= set("-: ") for c in cells):   # 구분행 제외
                    rows.append(cells)
                i += 1
            story += [Spacer(1, 2), make_table(rows), Spacer(1, 4)]

        elif ln.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].startswith(">"):
                buf.append(lines[i].lstrip(">").strip()); i += 1
            story += [Spacer(1, 3), make_note(buf), Spacer(1, 5)]

        elif re.match(r"^[-*] ", ln):
            items = []
            while i < len(lines) and re.match(r"^[-*] ", lines[i]):
                items.append(lines[i][2:]); i += 1
            for it in items:
                story.append(Paragraph(inline(it), st_li, bulletText="•"))
            story.append(Spacer(1, 4))

        elif ln.strip() == "---":
            i += 1   # 구분선은 제목 여백으로 충분

        elif ln.strip():
            story.append(Paragraph(inline(ln), st_body)); i += 1

        else:
            i += 1

    return story


def page_deco(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BRAND)
    canvas.rect(0, A4[1] - 5 * mm, A4[0], 5 * mm, stroke=0, fill=1)
    canvas.setFont("KR", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(22 * mm, 12 * mm, "협회 홈페이지 게시판·팝업 사용법")
    canvas.drawRightString(A4[0] - 22 * mm, 12 * mm, f"{doc.page}")
    canvas.restoreState()


md = open(SRC, encoding="utf-8").read()

story = [
    Spacer(1, 6 * mm),
    Paragraph("담당자용 안내서", st_sub),
    Spacer(1, 2 * mm),
    Paragraph("협회 홈페이지<br/>게시판 · 팝업 사용법", st_title),
    Spacer(1, 4 * mm),
    Paragraph("사단법인 한국온라인해외직판협회 · www.100kgo.kr",
              S("u", fontSize=10, textColor=MUTED)),
    Spacer(1, 5 * mm),
]
story += parse(md)
story += [
    Spacer(1, 8 * mm),
    Paragraph("사단법인 한국온라인해외직판협회 · 고유번호 830-82-00824<br/>"
              "제작 · 운영 문의: 이이공이(2202) · 010-9956-9545 · kookacola@naver.com",
              st_foot),
]

doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=22 * mm, rightMargin=22 * mm,
    topMargin=20 * mm, bottomMargin=20 * mm,
    title="협회 홈페이지 게시판·팝업 사용법",
    author="이이공이(2202)",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")
doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=page_deco)])
doc.build(story)
print("생성 완료:", OUT)
