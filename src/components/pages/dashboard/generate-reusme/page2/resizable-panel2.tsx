import React from "react";
import { ResizablePanel } from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import { Code, Download, Eye, Loader2 } from "lucide-react";
import CodeEditor from "@/components/pages/dashboard/generate-reusme/page2/editor";
import UILoading from "@/components/ui/uiloading";

import { useProjectManager } from "@/hooks/generate-reusme/resizable-panel2-manager";
import Lock from "@/components/ui/lock";
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

  const { urlPermission, isOwner } = useProjectData();

  return (
    <ResizablePanel defaultSize={75} className="h-full ">
      {urlPermission === "LOCKED" && !isOwner && <Lock />}
      <div className="ml-3 justify-between gap-2 flex  mb-3 overflow-x-auto hide-scrollbar">
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
        <div className=" h-full ml-3 rounded-md  overflow-hidden  ">
          <CodeEditor code={htmlContent} onChange={setHtmlContent} />
        </div>
      ) : (
        <>
          {error && (
            <div className=" overflow-y-auto border ml-3 rounded-md p-4">
              Error: {error.message}
            </div>
          )}
          {htmlContent || completion ? (
            <div className="ml-3 h-full border rounded-md  overflow-y-auto">
              <div
                ref={resumeRef}
                className="h-full overflow-auto  "
                dangerouslySetInnerHTML={{
                  __html: htmlContent || completion,
                }}
              ></div>
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
