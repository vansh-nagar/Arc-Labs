"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCompletion } from "@ai-sdk/react";
import {
  generateResumeDataStore,
  useHTMLEditorStore,
} from "@/stores/generate_resume_p1";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import CodeEditor from "@/components/pages/dashboard/generate-reusme/page2/editor";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  const data = generateResumeDataStore();
  const [loading, setIsLoading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [showCode, setShowCode] = useState(false);
  const {
    personalInfo,
    skillArr,
    educationArr,
    workExperienceArr,
    projectsArr,
    certificationsArr,
    jobTitle,
  } = data;

  const { htmlContent, setHtmlContent } = useHTMLEditorStore();

  const { completion, error, complete, isLoading } = useCompletion({
    api: "/api/generate-html/manual",
  });

  useEffect(() => {
    if (loading) return;
    setIsLoading(true);

    const prompt = {
      personalInfo,
      skillArr,
      educationArr,
      workExperienceArr,
      projectsArr,
      certificationsArr,
      jobTitle,
    };

    complete(JSON.stringify(prompt)).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setHtmlContent(completion || "");
  }, [completion]);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    const html = `
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    ${resumeRef.current.innerHTML}
  </body>
</html>`;

    console.log(html);

    const resp = await fetch("/api/generate-html/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, filename: "resume.pdf" }),
    });

    if (!resp.ok) throw new Error("PDF generation failed");

    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={` h-[calc(100vh-64px)] ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }`}
    >
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel
          defaultSize={25}
          className="h-full rounded-md border  mr-3"
        >
          One
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="h-full ">
          <div className="ml-4 justify-between flex">
            <Button
              onClick={() => {
                setShowCode(!showCode);
              }}
              size="icon"
              variant={`${showCode ? "default" : "outline"}`}
            >
              <Code />
            </Button>
            <Button onClick={downloadPDF} className="mb-3">
              Download PDF
            </Button>
          </div>
          {showCode ? (
            <div className=" overflow-y-auto border ml-3 rounded-md p-4">
              {" "}
              <CodeEditor code={htmlContent} onChange={setHtmlContent} />
            </div>
          ) : (
            <>
              {" "}
              {error && (
                <div className=" overflow-y-auto border ml-3 rounded-md p-4">
                  Error: {error.message}
                </div>
              )}
              {completion && (
                <div className="ml-4 h-full border rounded-md  overflow-y-auto">
                  <div
                    ref={resumeRef}
                    className="h-full overflow-auto rounded-md "
                    dangerouslySetInnerHTML={{ __html:  htmlContent|| completion }}
                  ></div>
                </div>
              )}
              {!completion && (
                <div className="ml-3 h-full border rounded-md p-6">
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-8"></div>

                    <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-6"></div>

                    <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-6"></div>

                    <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-4/5 mb-2"></div>
                  </div>
                </div>
              )}
            </>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
