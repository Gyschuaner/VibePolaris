import { NextRequest } from "next/server";
import { z } from "zod";
import { runAgent } from "@/lib/xiaobei/agent";
import { errorResponse, historyIdentity, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { getStore, XiaobeiError } from "@/lib/xiaobei/store";
import { modelConfig, type AgentEvent } from "@/lib/xiaobei/model";
import { applyEvent, finishActivities } from "@/lib/xiaobei/events";
import { pairInterruptedTools, type ConversationState } from "@/lib/xiaobei/history";
import { pageContext } from "@/lib/xiaobei/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const store = getStore(); const identity = historyIdentity(request);
    const parsed = z.object({ requestId: z.uuid(), conversationId: z.uuid(), continuing: z.boolean(), message: z.string().trim().min(1), page: z.string().max(1000).startsWith("/") }).strict().safeParse(await readBody(request));
    if (!parsed.success) throw new XiaobeiError("请求内容不完整，请重新提问。");
    modelConfig();
    const { requestId, conversationId, continuing, message, page } = parsed.data;
    store.startRun(identity, requestId);
    let state: ConversationState;
    try { state = store.beginConversation(identity, conversationId, requestId, message, pageContext(page).title, continuing); }
    catch (error) { store.finishRun(requestId); throw error; }
    const abort = new AbortController();
    const signal = AbortSignal.any([request.signal, abort.signal]);
    let closed = false;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const assistant = state.messages.at(-1)!;
        let dirty = false;
        const checkpoint = () => { store.saveConversation(identity, conversationId, requestId, state); dirty = false; };
        const send = (event: AgentEvent) => {
          if (!closed && !signal.aborted) {
            try { controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)); }
            catch { closed = true; abort.abort(); }
          }
        };
        const emit = (event: AgentEvent) => {
          if (["delta", "text_end", "think", "tool"].includes(event.type)) { assistant.blocks = applyEvent(assistant.blocks, event); dirty = true; }
          if (event.type === "context") { state.context = { tokens: event.tokens, inputTokens: event.inputTokens }; dirty = true; }
          if (event.type === "error") { assistant.error = event.text; dirty = true; }
          if (event.type === "text_end" || (event.type === "tool" && event.state !== "running")) checkpoint();
          send(event);
        };
        // Bound partial-output loss on a hard crash without rewriting a 256K context per token.
        const persistence = setInterval(() => { if (dirty) { try { checkpoint(); } catch { abort.abort(); } } }, 500);
        const heartbeat = setInterval(() => {
          try { store.checkIdentity(identity); if (!store.renewRun(requestId)) abort.abort(); }
          catch { abort.abort(); }
        }, 30_000);
        try { await runAgent({ store, identity, run: requestId, state, checkpoint, text: message, page, signal, emit }); }
        catch (error) {
          emit({ type: "error", text: signal.aborted ? "已停止生成，已收到的内容已保留。" : error instanceof XiaobeiError ? error.message : "回答中断，已保存的内容保留在这里，可以继续提问。", status: error instanceof XiaobeiError ? error.status : 500 });
        }
        finally {
          clearInterval(heartbeat); clearInterval(persistence);
          assistant.blocks = finishActivities(assistant.blocks, signal.aborted ? "stopped" : "error");
          state.model.messages = pairInterruptedTools(state.model.messages);
          if (state.pendingText) state.model.messages.push({ role: "assistant", content: state.pendingText });
          state.pendingText = "";
          try { store.saveConversation(identity, conversationId, requestId, state, true); }
          catch { send({ type: "error", text: "最新片段未能保存，请重新打开历史对话确认。", status: 500 }); }
          store.finishRun(requestId);
          send({ type: "balance", credits: store.balance(identity.invite) / 1e6 });
          send({ type: "done" });
          if (!closed) { closed = true; controller.close(); }
        }
      },
      cancel() { closed = true; abort.abort(); },
    });
    return new Response(stream, { headers: { ...privateHeaders, "Content-Type": "application/x-ndjson; charset=utf-8", "X-Accel-Buffering": "no" } });
  } catch (error) { return errorResponse(error); }
}
