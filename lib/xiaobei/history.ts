import type { ChatBlock } from "./events.ts";
import type { Message } from "./model.ts";

export type ChatMessage = { id: string; role: "user" | "assistant"; text: string; page?: string; blocks: ChatBlock[]; error?: string };
export type ContextUsage = { tokens: number; inputTokens?: number };
export type ConversationSummary = { id: string; title: string; updatedAt: number; running: boolean };
export type ConversationDetail = ConversationSummary & { messages: ChatMessage[]; context: ContextUsage | null };
// This state stays on the server. The history API returns only ConversationDetail.
export type ConversationState = {
  model: { messages: Message[]; measured?: { input: number; estimate: number } };
  messages: ChatMessage[];
  context: ContextUsage | null;
  pendingText?: string;
};

export function pairInterruptedTools(messages: Message[]): Message[] {
  const result: Message[] = [];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    result.push(message);
    if (!message.tool_calls?.length) continue;
    const replies = new Set<string>();
    while (messages[i + 1]?.role === "tool") {
      const reply = messages[++i];
      result.push(reply); replies.add(reply.tool_call_id!);
    }
    for (const call of message.tool_calls) if (!replies.has(call.id)) {
      result.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify({ error: "这次工具执行已中断，未取得结果。需要时请重新读取。" }) });
    }
  }
  return result;
}
