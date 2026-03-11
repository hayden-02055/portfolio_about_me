"use client";

import { useMemo, useRef, useState } from "react";
import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useExternalStoreRuntime,
  type AppendMessage,
} from "@assistant-ui/react";
import type { ThreadMessageLike } from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";

// assistant-ui의 Text 컴포넌트 타입 — 컨텍스트에서 텍스트를 읽어 마크다운으로 렌더링
const MarkdownText = () => (
  <MarkdownTextPrimitive
    remarkPlugins={[remarkGfm]}
    smooth
    className="prose prose-sm max-w-none
      prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1
      prose-li:my-0 prose-code:text-xs prose-pre:text-xs"
  />
);

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end mb-3">
      <div className="max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed bg-gray-900 text-white">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-start mb-3">
      <div className="max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed bg-white border border-gray-200 text-gray-700">
        <MessagePrimitive.Parts components={{ Text: MarkdownText }} />
      </div>
    </MessagePrimitive.Root>
  );
}

export default function ChatSection({ fullPage = false }: { fullPage?: boolean }) {
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001",
    []
  );

  const [messages, setMessages] = useState<ThreadMessageLike[]>([
    {
      id: "initial",
      role: "assistant",
      content: "안녕하세요. 포트폴리오 기반 QA입니다. 무엇이든 질문해 주세요.",
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const threadIdRef = useRef<string | null>(null);

  const onNew = async (message: AppendMessage) => {
    const userText = message.content
      .filter((c): c is { type: "text"; text: string } => c.type === "text")
      .map((c) => c.text)
      .join("");

    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: userText },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setIsRunning(true);

    try {
      const response = await fetch(`${apiBaseUrl}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadIdRef.current, message: userText }),
      });

      if (!response.ok || !response.body)
        throw new Error(`request failed: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const eventBlock of events) {
          if (!eventBlock.trim()) continue;
          const lines = eventBlock.split("\n");
          const eventLine = lines.find((l) => l.startsWith("event:"));
          const dataLine = lines.find((l) => l.startsWith("data:"));
          if (!eventLine || !dataLine) continue;

          const eventName = eventLine.replace("event:", "").trim();
          const dataRaw = dataLine.replace("data:", "").trim();

          let parsed: unknown;
          try {
            parsed = JSON.parse(dataRaw);
          } catch {
            continue;
          }

          if (eventName === "token") {
            const token = typeof parsed === "string" ? parsed : "";
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id !== assistantId
                  ? msg
                  : { ...msg, content: (typeof msg.content === "string" ? msg.content : "") + token }
              )
            );
          } else if (eventName === "done") {
            const payload = parsed as { thread_id?: string };
            if (payload.thread_id) threadIdRef.current = payload.thread_id;
          } else if (eventName === "error") {
            const payload = parsed as { message?: string };
            const errorText = payload.message ?? "요청 처리 중 오류가 발생했습니다.";
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id !== assistantId
                  ? msg
                  : { ...msg, content: `[오류] ${errorText}` }
              )
            );
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id !== assistantId
            ? msg
            : { ...msg, content: "네트워크 오류가 발생했습니다. 서버 상태를 확인해 주세요." }
        )
      );
    } finally {
      setIsRunning(false);
    }
  };

  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages,
    isRunning,
    onNew,
    convertMessage: (msg) => msg,
  });

  if (fullPage) {
    return (
      <div className="flex flex-col h-full px-6 py-4 max-w-4xl mx-auto w-full">
        <AssistantRuntimeProvider runtime={runtime}>
          <div className="flex flex-col flex-1 border border-gray-200 rounded-xl bg-white overflow-hidden">
            <ThreadPrimitive.Root className="flex flex-col flex-1 overflow-hidden">
              <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <ThreadPrimitive.Messages
                  components={{
                    UserMessage,
                    AssistantMessage,
                  }}
                />
              </ThreadPrimitive.Viewport>

              <ComposerPrimitive.Root className="border-t border-gray-200 p-4 flex gap-3">
                <ComposerPrimitive.Input
                  placeholder="질문을 입력하세요..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                />
                <ComposerPrimitive.Send
                  disabled={isRunning}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50 self-end"
                >
                  {isRunning ? "생성 중..." : "전송"}
                </ComposerPrimitive.Send>
              </ComposerPrimitive.Root>
            </ThreadPrimitive.Root>
          </div>
        </AssistantRuntimeProvider>
      </div>
    );
  }

  return (
    <section id="chat" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Portfolio Q&A</h2>

        <AssistantRuntimeProvider runtime={runtime}>
          <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
            <ThreadPrimitive.Root>
              <ThreadPrimitive.Viewport className="h-96 overflow-y-auto p-4 bg-gray-50">
                <ThreadPrimitive.Messages
                  components={{
                    UserMessage,
                    AssistantMessage,
                  }}
                />
              </ThreadPrimitive.Viewport>

              <ComposerPrimitive.Root className="border-t border-gray-200 p-4 flex gap-3">
                <ComposerPrimitive.Input
                  placeholder="질문을 입력하세요..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                />
                <ComposerPrimitive.Send
                  disabled={isRunning}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50 self-end"
                >
                  {isRunning ? "생성 중..." : "전송"}
                </ComposerPrimitive.Send>
              </ComposerPrimitive.Root>
            </ThreadPrimitive.Root>
          </div>
        </AssistantRuntimeProvider>
      </div>
    </section>
  );
}
