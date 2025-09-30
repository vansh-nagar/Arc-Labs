import React from "react";
import { ResizablePanel } from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import {
  Code,
  Download,
  Eye,
  Loader2,
  LockIcon,
  Redo,
  Undo,
  UnlockIcon,
} from "lucide-react";
import CodeEditor from "@/components/pages/dashboard/generate-reusme/page2/editor";
import UILoading from "@/components/ui/uiloading";
import { toast } from "sonner";

import { useProjectManager } from "@/hooks/generate-reusme/resizable-panel2-manager";
import Lock from "@/components/ui/lock";
import { useHistoryStore } from "@/stores/gnerate-reusme/editor-history";
import ShareProject from "./sub-components/share-project";
import { useProjectData } from "@/stores/gnerate-reusme/generate-resume-p1";

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
    isToggleLock,
    setIsLocked,
    htmlContent,
    resumeRef,
    isLocked,

    handleSaveProgress,
    handleToggleLockProject,
    handleDownloadPDF,
  } = useProjectManager(resolvedParams, originalProjectId);

  const { history, currentIndex, setIndex } = useHistoryStore();

  const { permissionType } = useProjectData();

  return (
    <ResizablePanel defaultSize={75} className="h-full ">
      {isLocked && permissionType !== "EDIT" && permissionType !== "VIEW" && (
        <Lock />
      )}
      <div className="ml-3 justify-between gap-2 flex  mb-3 overflow-x-auto hide-scrollbar">
        <div className=" flex gap-2">
          <Button
            onClick={() => {
              if (permissionType !== "EDIT") {
                toast.error("You are not authorized to open code editor.");
                return;
              }
              setShowCode(!showCode);
            }}
            size="icon"
            variant={`${showCode ? "default" : "outline"}`}
          >
            <Code />
          </Button>
          <Button
            onClick={() => {
              const newIndex = currentIndex - 1;
              console.log({ history });
              console.log({ newIndex, currentIndex });
              if (newIndex < 0) {
                toast.error("No undo available");
                return;
              }
              setHtmlContent(history[newIndex]?.code || "");
              setIndex(newIndex);
            }}
            variant={currentIndex - 1 < 0 ? "outline" : "default"}
            size={"icon"}
          >
            <Undo />
          </Button>
          <Button
            onClick={() => {
              const newIndex = currentIndex + 1;
              console.log({ newIndex, currentIndex });
              if (newIndex >= history.length) {
                toast.error("No redo available");
                return;
              }
              setHtmlContent(history[newIndex]?.code || "");
              if (newIndex < history.length) {
                setIndex(newIndex);
              }
            }}
            variant={currentIndex + 1 >= history.length ? "outline" : "default"}
            size={"icon"}
          >
            <Redo />
          </Button>
        </div>

        <div className=" flex gap-2 ">
          <Button
            variant="outline"
            onClick={() => {
              if (isSavingToDb) return;
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
