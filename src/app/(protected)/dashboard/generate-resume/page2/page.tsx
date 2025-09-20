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
import { Code, Loader2, MessageSquare } from "lucide-react";
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

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  const apiIsCalled = useRef(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [showCode, setShowCode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [chatPrompt, setChatPrompt] = useState("");
  const data = generateResumeDataStore();
  const { data: session, status } = useSession();

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-html/look-up-calls",
    }),
  });

  const { htmlContent, setHtmlContent } = useHTMLEditorStore();

  const { completion, error, complete, isLoading } = useCompletion({
    api: "/api/generate-html/manual",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (apiIsCalled.current) return;
    console.log("Generating resume with data:", data);
    apiIsCalled.current = true;

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
            toast.success(res.data.message || "Resume saved successfully.");
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.error || "Failed to save resume.");
        });
    });
  }, [status]);

  useEffect(() => {
    setHtmlContent(completion || "");
  }, [completion]);

  const downloadPDF = async () => {
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
          className="h-full rounded-md   flex justify-between flex-col  mr-3 p-4 "
        >
          <Conversation className=" w-full" style={{ height: "100%" }}>
            <ConversationContent>
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
                onChange={(e) => {
                  setChatPrompt(e.target.value);
                }}
                value={chatPrompt}
              />
            </PromptInputBody>
            <PromptInputToolbar className=" flex items-end justify-end">
              <PromptInputSubmit disabled={false} status={"ready"} />
            </PromptInputToolbar>
          </PromptInput>
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
            <Button
              onClick={() => {
                if (isDownloading) return;
                downloadPDF();
              }}
              className="mb-3"
            >
              {isDownloading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Download PDF"
              )}
            </Button>
          </div>
          {showCode ? (
            <div className=" h-full border ml-3 rounded-md p-4  ">
              <CodeEditor code={htmlContent} onChange={setHtmlContent} />
            </div>
          ) : (
            <>
              {error && (
                <div className=" overflow-y-auto border ml-3 rounded-md p-4">
                  Error: {error.message}
                </div>
              )}
              {completion ? (
                <div className="ml-4 h-full border rounded-md  overflow-y-auto">
                  <div
                    ref={resumeRef}
                    className="h-full overflow-auto rounded-md "
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
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
