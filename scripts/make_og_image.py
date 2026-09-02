"""
카카오톡·네이버·페이스북 링크 미리보기용 대표 이미지(og:image) 생성.

    python scripts/make_og_image.py   →   public/og.png (1200x630)

왜 만들었나
-----------
og:image 를 지정하지 않으면 카카오톡이 페이지에서 이미지를 아무거나 골라
자기 비율(약 2:1)에 맞춰 잘라 씁니다. 실제로 로고(900x340, 2.65:1)가 뽑혀
좌우가 잘린 채 표시된다는 지적이 있었습니다(2026-09-02). "(사) 한"의 왼쪽과
화살표 끝이 날아갔습니다.

그래서 1200x630(=1.90:1) 로 미리 만들어 둡니다. 카카오 카드 비율과 거의
같아 잘림이 없습니다.

정사각형으로 잘리는 자리도 있어(대화목록 썸네일 등) 로고를 가운데 600px
안에 넣었습니다. 630x630 으로 중앙 크롭하면 x 285~915 가 남는데, 로고는
x 300~900 이라 그 안에 들어옵니다. 로고를 더 키우면 이 여유가 사라집니다.

폰트
----
Pretendard 는 public/fonts 에 92개 서브셋 woff2 로만 들어 있어 PIL 이 읽지
못합니다. npm 패키지에 정적 ttf 가 같이 들어 있어 그걸 씁니다. 빌드 산출물이
아니라 이 스크립트를 돌릴 때만 필요합니다.
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BRAND_500 = (27, 84, 214)
INK_500 = (91, 102, 117)
GLOW = (76, 123, 216)

LOGO = "public/images/logo.png"
FONT = "node_modules/pretendard/dist/public/static/alternative/Pretendard-SemiBold.ttf"
OUT = "public/og.png"

TAGLINE = "대한민국 10만 해외직판상 시대를 엽니다"

canvas = Image.new("RGB", (W, H), (255, 255, 255))

# 오른쪽 아래 은은한 브랜드 광원. 사이트의 --p-glow 와 같은 색 계열입니다.
# 작게 그려 크게 늘리는 방식이라 자연스럽게 번집니다.
s = 60
glow = Image.new("L", (s, s), 0)
gd = ImageDraw.Draw(glow)
for i in range(24, 0, -1):
    r = i * 1.6
    gd.ellipse(
        [s * 0.72 - r, s * 0.92 - r, s * 0.72 + r, s * 0.92 + r],
        fill=int(3 + (24 - i) * 1.1),
    )
mask = glow.resize((W, H), Image.LANCZOS)
canvas.paste(Image.new("RGB", (W, H), GLOW), (0, 0), mask)

# 위쪽 브랜드 바
ImageDraw.Draw(canvas).rectangle([0, 0, W, 9], fill=BRAND_500)

# 로고
logo = Image.open(LOGO).convert("RGBA")
lw = 600
lh = round(logo.height * lw / logo.width)
logo = logo.resize((lw, lh), Image.LANCZOS)

font = ImageFont.truetype(FONT, 33)
draw = ImageDraw.Draw(canvas)
_, top, _, bottom = draw.textbbox((0, 0), TAGLINE, font=font)
th = bottom - top

# 로고 + 여백 + 한 줄을 하나의 덩어리로 보고 세로 가운데에 놓습니다.
GAP = 44
block_top = (H - (lh + GAP + th)) // 2
canvas.paste(logo, ((W - lw) // 2, block_top), logo)

draw.text(
    (W / 2, block_top + lh + GAP - top),
    TAGLINE,
    font=font,
    fill=INK_500,
    anchor="ma",
)

canvas.save(OUT, optimize=True)
print(f"생성 완료: {OUT} ({W}x{H})")
