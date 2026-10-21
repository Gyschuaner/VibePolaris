import { NextRequest } from "next/server";
import { z } from "zod";
import { publishedTerms } from "@/lib/content";
import { EXPAND_PROMPT, ORGANIZE_PROMPT, expansionContextSchema, resolveSuggestions, sourceResources, type CanvasAiFeature } from "../canvas-ai.ts";
import { assistantIdentity } from "../account/http.ts";
import { errorResponse, privateHeaders, readBody, sameOrigin } from "./http.ts";
import { getStore, XiaobeiError } from "./store.ts";
import { callModel, modelConfig } from "./model.ts";
import { requireFeature } from "./preferences.ts";

const inputSchema = z.object({ requestId: z.uuid(), title: z.string().max(160), markdown: z.string().trim().min(1).max(200_000), existing: z.array(z.string().max(140)).max(2000).default([]), context: expansionContextSchema.optional() }).strict();

export async function generateCanvas(request: NextRequest, feature: CanvasAiFeature) {
  try {
    sameOrigin(request);
    const identity = assistantIdentity(request);
    requireFeature(request, feature);
    const parsed = inputSchema.safeParse(await readBody(request, 1_500_000));
    if (!parsed.success) throw new XiaobeiError("请选择有正文的笔记；每次最多整理 20 万字。");
    modelConfig();
    const { requestId, title, markdown, existing, context } = parsed.data;
    const resources = sourceResources(markdown);
    if (feature === "expand") {
      const text = `${title} ${markdown}`.toLowerCase();
      for (const term of publishedTerms.filter(term => [term.zh, term.en, term.slug, ...term.aliases].some(name => name.length > 2 && text.includes(name.toLowerCase()))).slice(0, 20)) {
        resources.push({ id: `term-${term.slug}`, kind: "link", title: term.zh, url: `/terms/${term.slug}` });
      }
    }
    const store = getStore(), policy = { feature: `canvas_${feature}` as const, charge: false };
    store.startRun(identity, requestId, Date.now(), 0, policy.feature);
    const controller = new AbortController(), signal = AbortSignal.any([controller.signal, request.signal, AbortSignal.timeout(300_000)]);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(output) {
        let closed = false, characters = 0;
        const send = (event: object) => { if (!closed && !signal.aborted) output.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)); };
        const heartbeat = setInterval(() => {
          try { store.checkIdentity(identity); requireFeature(request, feature); if (!store.renewRun(requestId)) throw new Error("Ended"); send({ type: "heartbeat" }); }
          catch { controller.abort(); }
        }, 15_000);
        try {
          send({ type: "stage", text: feature === "organize" ? "正在梳理草稿…" : "正在寻找可延伸的主题…" });
          const result = await callModel({ store, identity, run: requestId, signal, canvas: policy, json: feature === "expand",
            messages: [{ role: "system", content: feature === "organize" ? ORGANIZE_PROMPT : EXPAND_PROMPT },
              { role: "user", content: JSON.stringify({ title, markdown, ...(feature === "expand" ? { resources, existing, context } : {}) }) }],
            onDelta(text) { characters += text.length; send(feature === "organize" ? { type: "delta", text } : { type: "progress", characters }); },
          });
          store.checkIdentity(identity); requireFeature(request, feature);
          if (feature === "expand") {
            let suggestions;
            try { suggestions = resolveSuggestions(JSON.parse(result.message.content || ""), resources); } catch { throw new XiaobeiError("这次扩展结果格式不完整，请重试。", 502); }
            if (!suggestions.length) throw new XiaobeiError("这次没有可用的新节点，请重试。", 502);
            send({ type: "suggestions", nodes: suggestions });
          }
          send({ type: "done" });
        } catch (error) {
          if (!signal.aborted) send({ type: "error", message: error instanceof XiaobeiError ? error.message : "生成中断，请重试。" });
        } finally {
          clearInterval(heartbeat); store.finishRun(requestId); closed = true;
          try { output.close(); } catch { /* The browser may already have cancelled the stream. */ }
        }
      },
      cancel() { controller.abort(); },
    });
    return new Response(stream, { headers: { ...privateHeaders, "Content-Type": "application/x-ndjson; charset=utf-8", "X-Accel-Buffering": "no" } });
  } catch (error) { return errorResponse(error); }
}
