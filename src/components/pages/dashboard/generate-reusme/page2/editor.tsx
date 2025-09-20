"use client";

import React, { useRef } from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { useHTMLEditorStore } from "@/stores/generate_resume_p1";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (value: string) => void;
}

export default function CodeEditor({
  code,
  language = "html",
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const { setHtmlContent } = useHTMLEditorStore();
  const { theme } = useTheme();

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  const handleChange: OnChange = (value) => {
    if (onChange) onChange(value || "");
    setHtmlContent(value || "");
  };

  return (
    <div
      style={{ border: "1px solid #ddd", borderRadius: "8px", height: "500px" }}
    >
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={code}
        theme={theme === "dark" ? "vs-dark" : "light"} // looks like VS Code
        onMount={handleEditorDidMount}
        onChange={handleChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: "hidden",
            horizontal: "auto",
          },
        }}
      />
    </div>
  );
}
