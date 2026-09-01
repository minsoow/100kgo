import { Extension } from "@tiptap/react";

/**
 * 문단 들여쓰기.
 *
 * 협회가 공백을 여러 번 눌러 들여쓰기를 시도했지만, HTML 은 연속 공백을
 * 하나로 합쳐 버려 저장은 되는데 화면에는 반영되지 않았습니다(2026-08-31).
 * 공백 대신 문단에 왼쪽 여백을 주는 정식 들여쓰기를 넣습니다.
 *
 * 저장 형식은 `style="margin-left: 1.5rem"` 입니다. sanitize 는 허용 목록
 * 방식이라 이 속성을 따로 열어 줘야 하며(src/lib/sanitize.ts), 값 형식도
 * 정규식으로 제한해 임의의 CSS 가 들어오지 못하게 막았습니다.
 */

const MAX_LEVEL = 6;
const STEP_REM = 1.5;

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create({
  name: "indent",

  addOptions() {
    return { types: ["paragraph", "heading"] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              // 저장된 글을 다시 열 때 여백에서 단계를 역산합니다
              const raw = element.style.marginLeft;
              if (!raw) return 0;
              const rem = parseFloat(raw);
              if (Number.isNaN(rem)) return 0;
              return Math.min(MAX_LEVEL, Math.round(rem / STEP_REM));
            },
            renderHTML: (attributes) => {
              const level = Number(attributes.indent) || 0;
              if (level <= 0) return {};
              return { style: `margin-left: ${level * STEP_REM}rem` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ state, tr, dispatch }) => {
          const { from, to } = state.selection;
          let changed = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (!this.options.types.includes(node.type.name)) return;
            const next = Math.min(MAX_LEVEL, (node.attrs.indent ?? 0) + 1);
            if (next === node.attrs.indent) return;
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
            changed = true;
          });

          if (changed && dispatch) dispatch(tr);
          return changed;
        },

      outdent:
        () =>
        ({ state, tr, dispatch }) => {
          const { from, to } = state.selection;
          let changed = false;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (!this.options.types.includes(node.type.name)) return;
            const next = Math.max(0, (node.attrs.indent ?? 0) - 1);
            if (next === node.attrs.indent) return;
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
            changed = true;
          });

          if (changed && dispatch) dispatch(tr);
          return changed;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      // 워드·한글에서 쓰던 습관 그대로 Tab / Shift+Tab 으로 동작합니다.
      // 표 안에서는 Tab 이 다음 칸 이동이어야 하므로 그때는 넘깁니다.
      Tab: ({ editor }) =>
        editor.isActive("table") ? false : editor.commands.indent(),
      "Shift-Tab": ({ editor }) =>
        editor.isActive("table") ? false : editor.commands.outdent(),
    };
  },
});
