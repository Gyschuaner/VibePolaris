import { XiaobeiError, type Identity, type Usage, type XiaobeiStore } from "./store.ts";

export type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };
export type Message = { role: "system" | "user" | "assistant" | "tool"; content: string | null; reasoning_content?: string; tool_calls?: ToolCall[]; tool_call_id?: string };
export type AgentEvent = { type: "status" | "delta" | "context" | "balance" | "error" | "done"; text?: string; tokens?: number; estimated?: boolean; credits?: number; status?: number };
export const CONTEXT_WINDOW = 256_000;
export const CONTEXT_WARNING = 175_000;
export function estimateTokens(value: unknown) {
  const text = JSON.stringify(value);
  const wide = text.match(/[^\x00-\x7f]/g)?.length || 0;
  return Math.ceil(wide + (text.length - wide) / 3) + 32;
}
export function normalizeUsage(value: unknown): Usage | null {
  if (!value || typeof value !== "object") return null;
  const u = value as Record<string, unknown>;
  const details = u.prompt_tokens_details as { cached_tokens?: number } | undefined;
  const input = u.prompt_tokens;
  const output = u.completion_tokens;
  // Bailian reports cache hits in prompt_tokens_details; no hit may omit the detail.
  const cached = u.prompt_cache_hit_tokens ?? details?.cached_tokens ?? 0;
  if (![input, output, cached].every(n => typeof n === "number" && Number.isSafeInteger(n) && n >= 0)) return null;
  if (Number(cached) > Number(input)) return null;
  return { input: Number(input), output: Number(output), cached: Number(cached) };
}
export function modelConfig() {
  const key = process.env.DASHSCOPE_API_KEY;
  if (!key || !process.env.DASHSCOPE_BASE_URL) throw new XiaobeiError("小北的模型尚未配置，请联系邀请人。", 503);
  const base = new URL(process.env.DASHSCOPE_BASE_URL);
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(base.hostname))) throw new XiaobeiError("模型服务地址配置错误。", 503);
  return { key, url: `${base.href.replace(/\/$/, "")}/chat/completions`, model: process.env.XIAOBEI_MODEL || "deepseek-v4.1-flash" };
}

export async function callModel(options: {
  store: XiaobeiStore; identity: Identity; run: string; messages: Message[]; signal: AbortSignal;
  tools?: unknown[]; json?: boolean; projectedTokens?: number; onDelta?: (text: string) => void;
}) {
  const { store, identity, run, messages, signal } = options;
  const config = modelConfig();
  signal.throwIfAborted();
  const input = options.projectedTokens ?? estimateTokens({ messages, tools: options.tools });
  const wantedOutput = CONTEXT_WINDOW - input;
  if (wantedOutput < 256) throw new XiaobeiError("本次上下文已接近 256K，无法容纳回答。会话已保留，可减少内容或新建对话。", 413);
  // UTF-8 bytes conservatively reserve billable input; cache discounts settle afterwards.
  const inputBound = Buffer.byteLength(JSON.stringify({ messages, tools: options.tools }), "utf8") + messages.length * 32 + 1024;
  const reservation = store.reserve(identity, run, inputBound, wantedOutput);
  let dispatched = false;
  let usage: Usage | null = null;
  let complete = false;
  let finishReason = "";
  const message: Message = { role: "assistant", content: "", reasoning_content: "" };
  const calls = new Map<number, ToolCall>();
  const timeout = new AbortController();
  let timer = setTimeout(() => timeout.abort(), 90_000);
  const combined = AbortSignal.any([signal, timeout.signal]);
  try {
    combined.throwIfAborted();
    dispatched = true;
    const response = await fetch(config.url, {
      method: "POST", signal: combined, headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.key}` },
      body: JSON.stringify({ model: config.model, messages, stream: true, stream_options: { include_usage: true }, enable_thinking: true, reasoning_effort: "high", max_tokens: reservation.maxOutput,
        ...(options.tools ? { tools: options.tools } : {}), ...(options.json ? { response_format: { type: "json_object" } } : {}) }),
    });
    if (!response.ok || !response.body) {
      // Rejected HTTP requests did not produce model output. Never relay raw provider errors/secrets.
      if (response.status >= 400 && response.status < 500) store.release(reservation.id);
      throw new XiaobeiError(response.status === 429 ? "模型服务繁忙，请稍后重试。" : "模型服务暂不可用，请稍后重试。", 502);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        clearTimeout(timer); timer = setTimeout(() => timeout.abort(), 90_000);
        buffer += decoder.decode(chunk.value, { stream: true });
        let newline: number;
        while ((newline = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newline).trim(); buffer = buffer.slice(newline + 1);
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") { complete = true; continue; }
          const item = JSON.parse(data);
          if (item.error) throw new XiaobeiError("模型生成中断，请重新提问。", 502);
          if (item.usage) usage = normalizeUsage(item.usage);
          const choice = item.choices?.[0];
          if (choice?.finish_reason) finishReason = choice.finish_reason;
          const delta = choice?.delta;
          if (typeof delta?.content === "string") { message.content += delta.content; options.onDelta?.(delta.content); }
          if (typeof delta?.reasoning_content === "string") message.reasoning_content += delta.reasoning_content;
          for (const call of delta?.tool_calls ?? []) {
            const current = calls.get(call.index) ?? { id: "", type: "function", function: { name: "", arguments: "" } };
            if (call.id) current.id = call.id;
            if (call.function?.name) current.function.name += call.function.name;
            if (call.function?.arguments) current.function.arguments += call.function.arguments;
            calls.set(call.index, current);
          }
        }
      }
    } finally { await reader.cancel().catch(() => {}); }
    if (!complete || !usage) throw new XiaobeiError("模型响应未完整结束，用量暂待结算，请重新提问。", 502);
    if (finishReason === "length") throw new XiaobeiError("本次回答达到可用输出容量，已收到的内容已保留。", 422);
    if (calls.size) message.tool_calls = [...calls.values()];
    if (!message.content && !message.tool_calls?.length) throw new XiaobeiError("模型未返回回答，请重试。", 502);
    return { message, usage };
  } catch (error) {
    if (signal.aborted) throw new XiaobeiError("已停止生成。", 499);
    if (timeout.signal.aborted) throw new XiaobeiError("模型长时间未响应，请稍后重试。", 504);
    if (error instanceof XiaobeiError) throw error;
    throw new XiaobeiError("模型连接中断，请稍后重试。", 502);
  } finally {
    clearTimeout(timer);
    if (usage) store.settle(reservation.id, usage);
    else if (!dispatched) store.release(reservation.id);
    // Unknown dispatched usage intentionally keeps its reservation after disconnect/restart.
  }
}
