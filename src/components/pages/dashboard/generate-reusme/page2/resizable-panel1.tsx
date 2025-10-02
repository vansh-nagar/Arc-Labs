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
import { Loader2, MessageSquare, Redo, SmileIcon, Undo } from "lucide-react";
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
import { useHistoryStore } from "@/stores/gnerate-reusme/editor-history";
import { useProjectData } from "@/stores/gnerate-reusme/project-data-store";

const ResizablePanel1 = () => {
  const [chatPrompt, setChatPrompt] = useState("");

  const { htmlContent, setHtmlContent, urlPermission, isOwner } =
    useProjectData();
  const { currentIndex, setIndex } = useHistoryStore();
  const [updateCallLoading, setUpdateCallLoading] = useState(false);

  const { history, addVersion } = useHistoryStore();

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { messages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/dummy" }),
  });

  return (
    <ResizablePanel
      defaultSize={25}
      className="h-full rounded-md   flex justify-between flex-col  mr-3  "
    >
      <Conversation
        className=" w-full mask-b-from-90% hide-scrollbar"
        style={{ height: "100%" }}
      >
        <ConversationContent className="p-0">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="No messages yet"
              description={
                !isOwner && urlPermission !== "EDIT"
                  ? "You do not have permission to edit this resume."
                  : "Start a conversation to refine and improve your resume. I am broke so please be kind :)"
              }
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
      <div className=" flex gap-2 justify-end mb-2">
        <Button
          disabled={currentIndex - 1 < 0}
          onClick={() => {
            const newIndex = currentIndex - 1;
            setHtmlContent(history[newIndex]?.code || "");
            setIndex(newIndex);
          }}
          variant={currentIndex - 1 < 0 ? "outline" : "default"}
          size={"icon"}
        >
          <Undo />
        </Button>
        <Button
          disabled={currentIndex + 1 >= history.length}
          onClick={() => {
            const newIndex = currentIndex + 1;
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
      <PromptInput
        className=" rounded-md"
        onSubmit={(e) => {
          if (!isOwner && urlPermission !== "EDIT") {
            return toast.error(
              "Only the owner can make changes to the resume."
            );
          }
          if (updateCallLoading) return;
          setUpdateCallLoading(true);
          messages.push({
            id: Date.now().toString(),
            role: "user",
            parts: [{ type: "text", text: chatPrompt }],
          });
          setChatPrompt("");
          setSuggestions([]);
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
              console.log("SUGGESTIONS", res.data.suggestions);
              setSuggestions(res.data.suggestions || []);
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
            placeholder={
              suggestions.length > 0
                ? suggestions[0]
                : "Make changes to a section and see AI suggestions to improve it here."
            }
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setChatPrompt(e.target.value);
            }}
            value={chatPrompt}
          />
        </PromptInputBody>
        <PromptInputToolbar className=" flex items-center justify-end">
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
