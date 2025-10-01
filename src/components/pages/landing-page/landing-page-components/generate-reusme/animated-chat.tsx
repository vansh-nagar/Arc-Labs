import React, { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageSquare } from "lucide-react";
import { Message, MessageContent } from "@/components/ai-elements/message";
const fullConversation = [
  {
    id: 1,
    from: "user",
    content: "Hi AI! Can you help me update my resume?",
  },
  {
    id: 2,
    from: "assistant",
    content: "Of course! What changes would you like to make?",
  },
  {
    id: 3,
    from: "user",
    content: "Add my recent internship at Google and update my skills section.",
  },
  {
    id: 4,
    from: "assistant",
    content:
      "Got it! I've added your internship at Google and updated your skills section.",
  },
  {
    id: 5,
    from: "user",
    content: "Can you also highlight my leadership experience?",
  },
  {
    id: 6,
    from: "assistant",
    content:
      "Done! Your leadership experience is now highlighted in the resume.",
  },
  {
    id: 7,
    from: "user",
    content: "Great, also format it neatly for PDF export.",
  },
  {
    id: 8,
    from: "assistant",
    content:
      "All set! Your resume is now neatly formatted and ready for PDF export.",
  },
  { id: 9, from: "user", content: "Thanks! Anything else I should add?" },
  {
    id: 10,
    from: "assistant",
    content:
      "Everything looks solid. I’d recommend adding a personal projects section if you have any.",
  },
];
const AnimatedChat = () => {
  const [messages, setMessages] = useState<typeof fullConversation>([]);
  const [index, setIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index >= fullConversation.length) return;

    const timeout = setTimeout(() => {
      setMessages((prev) => [...prev, fullConversation[index]]);
      setIndex((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [index]);

  // Auto-scroll when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Conversation className="relative h-[600px] mask-b-from-70%">
      <ConversationContent className="p-3 h-full overflow-y-auto">
        {messages.length === 0 ? (
          <ConversationEmptyState
            icon={<MessageSquare className="size-12" />}
            title="No messages yet"
            description="Start a conversation to see messages here"
          />
        ) : (
          <>
            {messages.map((message) => (
              <Message
                from={message.from as "user" | "assistant" | "system"}
                key={message.id}
              >
                <MessageContent>{message.content}</MessageContent>
              </Message>
            ))}
            <div ref={chatEndRef} /> {/* Auto scroll target */}
          </>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

export default AnimatedChat;
