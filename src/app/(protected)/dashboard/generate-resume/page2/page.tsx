"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCompletion } from "@ai-sdk/react";
import { generateResumeDataStore } from "@/stores/generate_resume_p1";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  const data = generateResumeDataStore();
  const [loading, setIsLoading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const {
    personalInfo,
    skillArr,
    educationArr,
    workExperienceArr,
    projectsArr,
    certificationsArr,
    jobTitle,
  } = data;

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

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    const htmlContent = resumeRef.current.innerHTML;

    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: htmlContent }),
    });

    if (!res.ok) {
      alert("Failed to generate PDF");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.pdf";
    link.click();
  };

  const { completion, error, complete, isLoading } = useCompletion({
    api: "/api/generate-latex/manual",
  });
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
          className="h-full rounded-2xl border  mr-4"
        >
          One
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="h-full">
          <div className=" ml-4 ">
            <Button onClick={downloadPDF} className="mb-4">
              Download PDF
            </Button>
          </div>
          {error && <div>Error: {error.message}</div>}
          {completion && (
            <ScrollArea className=" ml-4 border rounded-2xl ">
              <div
                ref={resumeRef}
                dangerouslySetInnerHTML={{ __html: completion }}
              />
            </ScrollArea>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
