import React, { useState } from "react";
import { ResizablePanel } from "@/components/ui/resizable";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import { Message, MessageContent } from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, MessageSquare, SmileIcon } from "lucide-react";
import { useHTMLEditorStore } from "@/stores/generate_resume_p1";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/stores/editor-history";

const ResizablePanel1 = () => {
  const [chatPrompt, setChatPrompt] = useState("");

  const { htmlContent, setHtmlContent } = useHTMLEditorStore();
  const [updateCallLoading, setUpdateCallLoading] = useState(false);

  const { history, addVersion } = useHistoryStore();

  const { messages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/dummy" }),
  });

  return (
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
              description="Start a conversation to refine and improve your resume"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  <Response>
                    {message.parts.find((part) => part.type === "text")?.text ||
                      ""}
                  </Response>
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput
        aria-placeholder="Ask me to improve your resume"
        className=" rounded-md"
        onSubmit={(e) => {
          if (updateCallLoading) return;
          setUpdateCallLoading(true);
          messages.push({
            id: Date.now().toString(),
            role: "user",
            parts: [{ type: "text", text: chatPrompt }],
          });
          setChatPrompt("");
          axios
            .post("/api/generate-html/look-up-calls", {
              htmlContent,
              chatPrompt,
            })
            .then((res) => {
              messages.push({
                id: Date.now().toString(),
                role: "assistant",
                parts: [{ type: "text", text: res.data.reply }],
              });
              setHtmlContent(res.data.finalHtml);
              addVersion(res.data.finalHtml);
            })
            .catch((err) => {
              toast.error(err.response?.data?.error);
            })
            .finally(() => {
              setUpdateCallLoading(false);
            });
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
          {updateCallLoading ? (
            <Button size="icon">
              <Loader2 className=" animate-spin" />
            </Button>
          ) : (
            <PromptInputSubmit disabled={false} status={"ready"} />
          )}
        </PromptInputToolbar>
      </PromptInput>
    </ResizablePanel>
  );
};

export default ResizablePanel1;
