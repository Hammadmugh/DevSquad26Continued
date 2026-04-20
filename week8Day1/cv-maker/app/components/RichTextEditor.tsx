"use client";

import { useRef, useEffect, useCallback } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Type here...",
  minHeight = 120,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const skipUpdate = useRef(false);

  useEffect(() => {
    if (editorRef.current && !skipUpdate.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      skipUpdate.current = true;
      onChange(editorRef.current.innerHTML);
      requestAnimationFrame(() => {
        skipUpdate.current = false;
      });
    }
  }, [onChange]);

  const execCmd = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    handleInput();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
        <ToolBtn title="Bold" onClick={() => execCmd("bold")}>
          <b>B</b>
        </ToolBtn>
        <ToolBtn title="Italic" onClick={() => execCmd("italic")}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title="Underline" onClick={() => execCmd("underline")}>
          <u>U</u>
        </ToolBtn>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolBtn title="Bullet list" onClick={() => execCmd("insertUnorderedList")}>
          •≡
        </ToolBtn>
        <ToolBtn title="Numbered list" onClick={() => execCmd("insertOrderedList")}>
          1≡
        </ToolBtn>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolBtn title="Remove formatting" onClick={() => execCmd("removeFormat")}>
          Tx
        </ToolBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="p-3 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 outline-none
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
          [&_li]:my-0.5
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 dark:empty:before:text-gray-500 empty:before:pointer-events-none"
        style={{ minHeight }}
      />
    </div>
  );
}

function ToolBtn({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="w-8 h-7 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600 rounded transition-colors font-medium flex items-center justify-center"
    >
      {children}
    </button>
  );
}
