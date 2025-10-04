import React, { useEffect, useRef, useState } from "react";
import { ResizablePanel } from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import { Code, Download, Eye, Loader2, Lock } from "lucide-react";
import CodeEditor from "@/components/pages/dashboard/generate-reusme/page2/editor";
import UILoading from "@/components/ui/uiloading";

import { useProjectManager } from "@/hooks/generate-reusme/resizable-panel2-manager";
import { useHistoryStore } from "@/stores/gnerate-reusme/editor-history";
import ShareProject from "./sub-components/share-project";
import { useProjectData } from "@/stores/gnerate-reusme/project-data-store";

const ResizablePanel2 = ({ originalProjectId, resolvedParams }: any) => {
  const {
    count,
    error,
    showCode,
    completion,
    setShowCode,
    isSavingToDb,
    isDownloading,
    setHtmlContent,
    htmlContent,
    resumeRef,
    handleSaveProgress,
    handleDownloadPDF,
  } = useProjectManager(resolvedParams, originalProjectId);

  const { addVersion } = useHistoryStore();

  const { urlPermission, isOwner, lookUpDivId } = useProjectData();

  useEffect(() => {
    if (!resumeRef) return;
    const page = resumeRef.current?.querySelector(`#${lookUpDivId}`);

    page?.scrollIntoView({ behavior: "smooth" });
  }, [lookUpDivId]);

  return (
    <ResizablePanel defaultSize={75} className="h-full flex flex-col gap-3 ">
      <div className="ml-3 justify-between gap-2 flex   ">
        <div className=" flex gap-2">
          <Button
            disabled={!isOwner && urlPermission !== "EDIT"}
            onClick={() => {
              setShowCode(!showCode);
            }}
            size="icon"
            variant={`${showCode ? "default" : "outline"}`}
          >
            <Code />
          </Button>
        </div>

        <div className=" flex gap-2 ">
          <Button
            disabled={!isOwner && urlPermission !== "EDIT"}
            variant="outline"
            onClick={() => {
              if (isSavingToDb) return;
              addVersion(htmlContent);
              handleSaveProgress();
            }}
          >
            {isSavingToDb ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save your Progress"
            )}
          </Button>
          <Button
            disabled={!isOwner && urlPermission !== "EDIT"}
            variant="outline"
            size={"icon"}
            onClick={() => {
              if (isDownloading) return;
              handleDownloadPDF();
            }}
          >
            {isDownloading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Download />
            )}
          </Button>

          <ShareProject />
          <Button variant="outline">
            <Eye /> <div>{count}</div>
          </Button>
        </div>
      </div>
      {showCode ? (
        <div className="h-full ml-3 rounded-md overflow-hidden">
          <CodeEditor  onChange={setHtmlContent} />
        </div>
      ) : urlPermission === "LOCKED" && !isOwner ? (
        <div className="flex flex-col items-center justify-center h-full ml-3 border rounded-md p-4 text-center">
          <Lock size={50} className="text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You don't have permission to view this content. <br /> Please
            contact the owner for access.
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="overflow-y-auto border ml-3 rounded-md p-4">
              Error: {error.message}
            </div>
          )}

          {htmlContent || completion ? (
            <div className="ml-3 h-full border rounded-md overflow-y-auto">
              <div
                ref={resumeRef}
                className="h-full overflow-auto"
                dangerouslySetInnerHTML={{
                  __html: htmlContent || completion,
                }}
              />
            </div>
          ) : (
            <UILoading />
          )}
        </>
      )}
    </ResizablePanel>
  );
};

export default ResizablePanel2;
