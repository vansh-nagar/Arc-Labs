"use client";

import React, { useRef, useState } from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { useProjectData } from "@/stores/gnerate-reusme/project-data-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Minus, PanelRight, Plus, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { useEditorManager } from "@/hooks/generate-reusme/editor-manager";

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
  const { setHtmlContent, htmlContent } = useProjectData();
  const { theme } = useTheme();
  const [size, setSize] = useState<number>(
    JSON.parse(localStorage.getItem("size") || "14")
  );
  const [isMiniMapOpen, setisMiniMapOpen] = useState(
    JSON.parse(localStorage.getItem("isMiniMapOpen") || "false")
  );

  const { handleOnEditorDidMount } = useEditorManager(editorRef);

  const settingButtons = [
    {
      icon: <Plus />,
      title: "Increase Font Size",
      onClick: () => {
        if (size + 2 > 18) {
          toast.error("max size reached");
          return;
        }
        localStorage.setItem("size", JSON.stringify(size + 2));
        setSize(size + 2);
      },
    },
    {
      icon: <Minus />,
      title: "Decrease Font Size",
      onClick: () => {
        if (size - 2 < 8) {
          toast.error("min size reached");
          return;
        }
        localStorage.setItem("size", JSON.stringify(size - 2));
        setSize(size - 2);
      },
    },
    {
      icon: <RotateCw />,
      title: "Reset to defaults",
      onClick: () => {
        localStorage.setItem("isMiniMapOpen", "false");
        localStorage.setItem("size", "14");
        setSize(14);
        setisMiniMapOpen(false);
      },
    },
  ];

  const handleChange: OnChange = (value) => {
    if (onChange) onChange(value || "");
    setHtmlContent(value || "");
  };

  return (
    <div className="h-full flex flex-row gap-3 ">
      <Editor
        className=" border"
        value={htmlContent}
        height="100%"
        defaultLanguage={language}
        defaultValue={code}
        theme={theme === "dark" ? "vs-dark" : "light"} // looks like VS Code
        onMount={handleOnEditorDidMount}
        onChange={handleChange}
        options={{
          fontSize: size,
          minimap: { enabled: isMiniMapOpen },
          automaticLayout: true,
          lineNumbers: "on",
          scrollBeyondLastLine: true,
          fontFamily:
            "ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace",
          scrollbar: {
            horizontal: "auto",
          },
        }}
      />
      <div className="   z-50 flex flex-col gap-3">
        <Button
          variant={isMiniMapOpen ? "default" : "outline"}
          onClick={() => {
            localStorage.setItem(
              "isMiniMapOpen",
              JSON.stringify(!isMiniMapOpen)
            );
            setisMiniMapOpen(!isMiniMapOpen);
          }}
          size={"icon"}
        >
          <PanelRight />{" "}
        </Button>

        {settingButtons.map((button, index) => (
          <Button
            key={index}
            title={button.title}
            variant="outline"
            onClick={button.onClick}
            size={"icon"}
          >
            {button.icon}
          </Button>
        ))}
      </div>
    </div>
  );
}
