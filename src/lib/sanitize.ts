import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * 에디터로 작성된 HTML을 저장하기 전에 정제합니다.
 * 관리자만 글을 쓰더라도, 붙여넣기로 유입되는 스크립트·이벤트 핸들러를 차단합니다.
 */
export function sanitizePostContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "hr",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        /*
          문단 들여쓰기(IndentExtension). 값을 자유롭게 두면 임의의 CSS 가
          들어올 수 있으므로 rem 단위 숫자만 통과시킵니다.
          에디터는 1.5rem 단위로 6단계까지만 만듭니다.
        */
        "margin-left": [/^\d+(\.\d+)?rem$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    // 외부 링크는 항상 새 창 + noopener
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}

/** 목록에 노출할 요약문 생성 (HTML 제거 후 잘라내기) */
export function toPlainTextExcerpt(html: string, length = 120): string {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
