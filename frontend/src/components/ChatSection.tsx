"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatSection() {
  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001",
    []
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "안녕하세요. 포트폴리오 기반 QA입니다. 무엇이든 질문해 주세요.",
    },
  ]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", text: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          message: trimmed,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const applyAssistantDelta = (delta: string) => {
        setMessages((prev) => {
          const next = [...prev];
          for (let i = next.length - 1; i >= 0; i -= 1) {
            if (next[i].role === "assistant") {
              next[i] = { ...next[i], text: next[i].text + delta };
              return next;
            }
          }
          next.push({ role: "assistant", text: delta });
          return next;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const eventBlock of events) {
          if (!eventBlock.trim()) continue;
          const lines = eventBlock.split("\n");
          const eventLine = lines.find((line) => line.startsWith("event:"));
          const dataLine = lines.find((line) => line.startsWith("data:"));
          if (!eventLine || !dataLine) continue;

          const eventName = eventLine.replace("event:", "").trim();
          const dataRaw = dataLine.replace("data:", "").trim();

          if (eventName === "token") {
            applyAssistantDelta(dataRaw);
            continue;
          }

          if (eventName === "done") {
            try {
              const payload = JSON.parse(dataRaw) as { thread_id?: string };
              if (payload.thread_id) setThreadId(payload.thread_id);
            } catch {
              // ignore malformed done payload
            }
            continue;
          }

          if (eventName === "error") {
            let errorText = "요청 처리 중 오류가 발생했습니다.";
            try {
              const payload = JSON.parse(dataRaw) as { message?: string };
              if (payload.message) errorText = payload.message;
            } catch {
              // keep default error text
            }
            applyAssistantDelta(`\n\n[오류] ${errorText}`);
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        for (let i = next.length - 1; i >= 0; i -= 1) {
          if (next[i].role === "assistant" && next[i].text === "") {
            next[i] = {
              ...next[i],
              text: "네트워크 오류가 발생했습니다. 서버 상태를 확인해 주세요.",
            };
            return next;
          }
        }
        next.push({
          role: "assistant",
          text: "네트워크 오류가 발생했습니다. 서버 상태를 확인해 주세요.",
        });
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="chat" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Portfolio Q&A</h2>

        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-700"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="border-t border-gray-200 p-4 flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="질문을 입력하세요..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              {isLoading ? "생성 중..." : "전송"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
