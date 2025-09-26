"use client";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, SmileIcon } from "lucide-react";
import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ResizablePanel } from "@/components/ui/resizable";

const AIChat = () => {
  const [updateCallLoading, setupdateCallLoading] = useState(false);
  const { messages } = useChat();

  return (
    <ResizablePanel defaultSize={25} className="pl-4 flex  flex-col">
      <Conversation className=" w-full h-full">
        <ConversationContent className="p-0">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="No messages yet"
              description="Let's get started with your interview!"
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
      <PromptInput className=" rounded-md border" onSubmit={(e) => {}}>
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {}}
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

export default AIChat;
