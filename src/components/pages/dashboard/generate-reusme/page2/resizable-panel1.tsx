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
import { MessageSquare, SmileIcon } from "lucide-react";
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

const ResizablePanel1 = () => {
  const [chatPrompt, setChatPrompt] = useState("");

  const { htmlContent, setHtmlContent } = useHTMLEditorStore();

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/generate-html/look-up-calls",
    }),
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
              description="Start a conversation to see messages here"
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
        className=" rounded-md"
        onSubmit={(e) => {
          axios
            .post("/api/generate-html/look-up-calls", {
              htmlContent,
              chatPrompt,
            })
            .then((res) => {
              console.log("Response from API:", res.data);
              setHtmlContent(res.data.finalHtml);
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
          <PromptInputSubmit disabled={false} status={"ready"} />
        </PromptInputToolbar>
      </PromptInput>
    </ResizablePanel>
  );
};

export default ResizablePanel1;
