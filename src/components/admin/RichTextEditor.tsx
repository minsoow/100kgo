"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { upload } from "@vercel/blob/client";
import { useCallback, useEffect, useRef, useState } from "react";

/** 본문 삽입용 이미지 제한. 첨부파일(20MB)보다 작게 잡습니다. */
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const IMAGE_MAX_BYTES = 8 * 1024 * 1024;

type ToolbarButtonProps = {
  label: string;
  title: string;
  active?: boolean;
  onClick: () => void;
};

function ToolbarButton({ label, title, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`h-9 min-w-9 rounded-btn px-2.5 text-[13px] font-bold transition-colors ${
        active
          ? "bg-brand-900 text-white"
          : "text-ink-700 hover:bg-page hover:text-brand-700"
      }`}
    >
      {label}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  // 에디터 상태 변화에 맞춰 버튼 활성 표시를 갱신
  const [, forceRender] = useState(0);
  useEffect(() => {
    const update = () => forceRender((v) => v + 1);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const setLink = useCallback(() => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 주소를 입력하세요", previous ?? "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 이미지를 Blob 에 올리고 커서 위치에 삽입합니다.
   * 첨부파일과 같은 경로(/api/upload)를 씁니다. 세션 검증과 형식·용량 제한이
   * 서버에서 한 번 더 걸리므로 여기 검사는 사용자에게 빨리 알려주는 용도입니다.
   */
  const insertImage = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setError(null);
      if (file.size > IMAGE_MAX_BYTES) {
        setError("이미지는 8MB 이하만 넣을 수 있습니다.");
        return;
      }

      setUploading(true);
      try {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        editor
          .chain()
          .focus()
          .setImage({ src: blob.url, alt: file.name })
          .run();
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? `업로드 실패: ${uploadError.message}`
            : "이미지 업로드에 실패했습니다.",
        );
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-btn border border-line bg-surface p-1.5">
      <ToolbarButton
        label="B"
        title="굵게"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="I"
        title="기울임"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="U"
        title="밑줄"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="S"
        title="취소선"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <span aria-hidden className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label="제목"
        title="제목 (큰 제목)"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      />
      <ToolbarButton
        label="소제목"
        title="소제목"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      />

      <span aria-hidden className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label="• 목록"
        title="글머리 기호 목록"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="1. 목록"
        title="번호 매기기 목록"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="인용"
        title="인용문"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <span aria-hidden className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label="좌"
        title="왼쪽 정렬"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />
      <ToolbarButton
        label="중"
        title="가운데 정렬"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />
      <ToolbarButton
        label="우"
        title="오른쪽 정렬"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      />

      <span aria-hidden className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label="링크"
        title="링크 삽입/수정"
        active={editor.isActive("link")}
        onClick={setLink}
      />
      <ToolbarButton
        label="구분선"
        title="가로 구분선"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />

      <span aria-hidden className="mx-1 h-5 w-px bg-line" />

      <ToolbarButton
        label={uploading ? "올리는 중…" : "🖼 이미지"}
        title="본문에 이미지 넣기"
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={insertImage}
        className="hidden"
      />

      {error && (
        <p role="alert" className="ml-2 text-[13px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type RichTextEditorProps = {
  /** 서버 액션으로 전달되는 hidden input 이름 */
  name: string;
  defaultValue?: string;
};

export function RichTextEditor({ name, defaultValue = "" }: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    // SSR 하이드레이션 불일치 방지
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          protocols: ["http", "https", "mailto"],
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      // 본문 삽입 이미지. sanitize 는 img 의 src·alt·width·height 만 통과시킵니다.
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          "prose-board min-h-80 rounded-b-btn border border-t-0 border-line px-5 py-4 outline-none focus:border-brand-400",
      },
    },
    onUpdate: ({ editor: instance }) => setHtml(instance.getHTML()),
  });

  return (
    <div>
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
