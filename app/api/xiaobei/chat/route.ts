import { NextRequest } from "next/server";
import { z } from "zod";
import { runAgent } from "@/lib/xiaobei/agent";
import { errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { getStore, SESSION_COOKIE, XiaobeiError } from "@/lib/xiaobei/store";
import { modelConfig, type AgentEvent } from "@/lib/xiaobei/model";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const store = getStore(); const identity = store.identity(request.cookies.get(SESSION_COOKIE)?.value);
    const parsed = z.object({ requestId: z.uuid(), conversationId: z.uuid(), continuing: z.boolean(), message: z.string().trim().min(1), page: z.string().max(1000).startsWith("/") }).strict().safeParse(await readBody(request));
    if (!parsed.success) throw new XiaobeiError("请求内容不完整，请重新提问。");
    modelConfig();
    const { requestId, conversationId, continuing, message, page } = parsed.data;
    store.startRun(identity, requestId);
    const abort = new AbortController();
    const signal = AbortSignal.any([request.signal, abort.signal]);
    let closed = false;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (event: AgentEvent) => { if (!closed && !signal.aborted) controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)); };
        const heartbeat = setInterval(() => {
          try { store.checkIdentity(identity); if (!store.renewRun(requestId)) abort.abort(); }
          catch { abort.abort(); }
        }, 30_000);
        try { await runAgent({ store, identity, run: requestId, conversation: conversationId, continuing, text: message, page, signal, emit }); }
        catch (error) { emit({ type: "error", text: error instanceof XiaobeiError ? error.message : "回答中断，请重新提问。", status: error instanceof XiaobeiError ? error.status : 500 }); }
        finally {
          clearInterval(heartbeat); store.finishRun(requestId);
          emit({ type: "balance", credits: store.balance(identity.invite) / 1e6 });
          emit({ type: "done" });
          if (!closed) { closed = true; controller.close(); }
        }
      },
      cancel() { closed = true; abort.abort(); },
    });
    return new Response(stream, { headers: { ...privateHeaders, "Content-Type": "application/x-ndjson; charset=utf-8", "X-Accel-Buffering": "no" } });
  } catch (error) { return errorResponse(error); }
}
