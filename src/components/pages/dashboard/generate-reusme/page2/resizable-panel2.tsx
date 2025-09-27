import React from "react";
import { ResizablePanel } from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import {
  Code,
  Eye,
  Link,
  Loader2,
  LockIcon,
  Redo,
  Undo,
  UnlockIcon,
} from "lucide-react";
import CodeEditor from "@/components/pages/dashboard/generate-reusme/page2/editor";
import UILoading from "@/components/ui/uiloading";
import { toast } from "sonner";

import { useProjectManager } from "@/hooks/resizable-panel2-manager";
import Lock from "@/components/ui/lock";
import { useHistoryStore } from "@/stores/editor-history";

const ResizablePanel2 = ({ originalProjectId, resolvedParams }: any) => {
  const {
    count,
    error,
    showCode,
    completion,
    setShowCode,
    isSavingToDb,
    isDownloading,
    isAuthenticated,
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

  return (
    <ResizablePanel defaultSize={75} className="h-full ">
      {isLocked && !isAuthenticated && <Lock />}
      <div className="ml-3 justify-between gap-2 flex  mb-3 overflow-x-auto hide-scrollbar">
        <div className=" flex gap-2">
          <Button
            onClick={() => {
              if (!isAuthenticated) {
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
            onClick={() => {
              if (isDownloading) return;
              handleDownloadPDF();
            }}
          >
            {isDownloading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Download PDF"
            )}
          </Button>
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                toast.error(
                  "You are not authorized to lock/unlock this project."
                );
                return;
              }
              setIsLocked(!isLocked);
              handleToggleLockProject(!isLocked);
            }}
            variant={`${isLocked ? "default" : "outline"}`}
            size="icon"
          >
            {isToggleLock ? (
              <Loader2 className="animate-spin" />
            ) : isLocked ? (
              <LockIcon />
            ) : (
              <UnlockIcon />
            )}
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard");
            }}
            variant="outline"
            size="icon"
          >
            <Link />
          </Button>
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
