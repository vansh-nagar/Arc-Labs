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
import {
  Code,
  Eye,
  Link,
  Loader2,
  LockIcon,
  MessageSquare,
  SmileIcon,
  UnlockIcon,
} from "lucide-react";
import CodeEditor from "@/components/pages/dashboard/generate-reusme/page2/editor";
import UILoading from "@/components/ui/uiloading";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Lock from "@/components/ui/lock";

interface PageProps {
  params: {
    "project-id": string;
  };
}

const page = ({ params }: PageProps) => {
  const { isSideBarOpen } = useSidebarStore();
  const { data, type } = generateResumeDataStore();
  const { htmlContent, setHtmlContent } = useHTMLEditorStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const [showCode, setShowCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [chatPrompt, setChatPrompt] = useState("");
  const { data: session, status } = useSession();
  const [isSavingToDb, setIsSavingToDb] = useState(false);
  const [Count, setCount] = useState(0);
  const [projectId, setProjectId] = useState("");
  const [isToggleLock, setIsToggleLock] = useState(false);

  const updateFunctionCalled = useRef(false);
  const apiIsCalled = useRef(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-html/look-up-calls",
    }),
  });

  const { completion, error, complete } = useCompletion({
    api: "/api/generate-html/manual",
  });

  const resolvedParams: { "project-id": string } = React.use(params as any);
  const originalProjectId = useRef(resolvedParams["project-id"]);

  // Set projectId from route params
  useEffect(() => {
    setProjectId(resolvedParams["project-id"]);
  }, [resolvedParams]);

  // Sync completion to htmlContent state
  useEffect(() => {
    setHtmlContent(completion || "");
  }, [completion]);

  // Increment view count and fetch project data
  useEffect(() => {
    if (
      !projectId ||
      projectId === "new" ||
      updateFunctionCalled.current ||
      status !== "authenticated"
    )
      return;

    updateFunctionCalled.current = true;

    axios
      .post("/api/generate-html/update-project-view", { projectId })
      .then((res) => {
        setCount(res.data.data);
      });

    axios
      .post("/api/generate-html/get-project-data", { projectId })
      .then((res) => {
        setHtmlContent(JSON.parse(res.data.project.html) || "");
        setIsLocked(res.data.project.locked);
        if (res.data.project.user.email === session?.user?.email) {
          setIsAuthenticated(true);
        }
        toast.success(res.data.message || "Project data loaded.");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.error || "Failed to fetch project dataaaaaaaa."
        );
      })
      .finally(() => {
        updateFunctionCalled.current = false;
      });
  }, [projectId, status]);

  // Auto-generate resume if "new"
  useEffect(() => {
    if (
      originalProjectId.current !== "new" ||
      status === "loading" ||
      apiIsCalled.current
    )
      return;

    console.log("Generating resume with data:", data);
    console.log("Type:", type);
    apiIsCalled.current = true;

    if (type === "template" && data.template !== "") {
      setHtmlContent(data.template);
      toast.success("Template applied successfully!");
      axios
        .post("/api/generate-html/save-to-db", {
          htmlContent: data.template,
          email: session?.user?.email,
        })
        .then((res) => {
          if (res.status === 200) {
            setProjectId(res.data.projectId);
            router.replace(
              `/dashboard/generate-resume/page2/${res.data.projectId}`
            );

            toast.success(res.data.message || "Resume saved successfully.");
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error || "Failed to save resume.");
        })
        .finally(() => {
          apiIsCalled.current = false;
        });
      return;
    }

    //resume streaming
    complete(JSON.stringify(data)).then(() => {
      apiIsCalled.current = false;
      console.log("Resume generation completed", resumeRef.current?.innerHTML);
      axios
        .post("/api/generate-html/save-to-db", {
          htmlContent: resumeRef.current?.innerHTML,
          email: session?.user?.email,
        })
        .then((res) => {
          if (res.status === 200) {
            setProjectId(res.data.projectId);
            router.replace(
              `/dashboard/generate-resume/page2/${res.data.projectId}`
            );

            toast.success(res.data.message || "Resume saved successfully.");
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error || "Failed to save resume.");
        });
    });
  }, [status]);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      toast.error("Resume content is not available to download.");
      return;
    }
    setIsDownloading(true);

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
    setIsDownloading(false);
  };

  const handleSaveProgress = async () => {
    if (!isAuthenticated) {
      toast.error("You are not authorized to save this project.");
      return;
    }
    if (isSavingToDb) return;
    setIsSavingToDb(true);

    axios
      .post("/api/generate-html/update-project-html", {
        htmlContent,
        projectId,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message || "Project updated successfully.");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error || "Failed to update project.");
      })
      .finally(() => {
        setIsSavingToDb(false);
      });
  };

  const handleToggleLockProject = async (lockState: boolean) => {
    if (isToggleLock) return;
    if (!isAuthenticated) {
      toast.error("You are not authorized to lock/unlock this project.");
      return;
    }
    setIsToggleLock(true);

    axios
      .post("/api/generate-html/toggle-lock-project", {
        projectId,
        lockState,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message || "Project lock state updated.");
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.error || "Failed to update lock state."
        );
      })
      .finally(() => {
        setIsToggleLock(false);
      });
  };

  return (
    <div
      className={` h-[calc(100vh-64px)] ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }`}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full relative"
      >
        <ResizablePanel
          defaultSize={25}
          className="h-full rounded-md   flex justify-between flex-col  mr-3  "
        >
          <Conversation className=" w-full" style={{ height: "100%" }}>
            <ConversationContent className="p-0">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<MessageSquare className="size-12" />}
                  title="No messages yet"
                  description="Start a conversation to see messages here"
                />
              ) : (
                messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent>
                      {" "}
                      {message.parts.find((part) => part.type === "text")
                        ?.text || ""}
                    </MessageContent>
                  </Message>
                ))
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <PromptInput
            className=" rounded-md"
            onSubmit={(e) => {
              if (chatPrompt.trim()) {
                sendMessage({
                  text: chatPrompt,
                });
                setChatPrompt("");
              }
            }}
          >
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setChatPrompt(e.target.value);
                }}
                value={chatPrompt}
              />
            </PromptInputBody>
            <PromptInputToolbar className=" flex items-center justify-between">
              <SmileIcon className="ml-1" />
              <PromptInputSubmit disabled={false} status={"ready"} />
            </PromptInputToolbar>
          </PromptInput>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="h-full ">
          <div className="ml-3 justify-between gap-2 flex  mb-3">
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("You are not authorized to see the code editor.");
                  return;
                }
                setShowCode(!showCode);
              }}
              size="icon"
              variant={`${showCode ? "default" : "outline"}`}
            >
              <Code />
            </Button>
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
                <Eye /> <div>{Count}</div>
              </Button>
            </div>
          </div>
          {showCode ? (
            <div className=" h-full border ml-3 rounded-md  overflow-hidden  ">
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
        {isLocked && !isAuthenticated && <Lock />}
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
