import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { DAILY_CREDITS, XiaobeiStore, dayKey, digest, usageCost } from "../lib/xiaobei/store.ts";
import { callModel, normalizeUsage } from "../lib/xiaobei/model.ts";
import { applyEvent, finishActivities, partitionTranscript } from "../lib/xiaobei/events.ts";

test("小北鉴权、并发、精确积分和跨日账本", () => {
  const store = new XiaobeiStore(":memory:");
  try {
    assert.equal(usageCost({ input: 10_000, cached: 8_000, output: 2_000 }), 96_000);
    assert.equal(normalizeUsage({ prompt_tokens: 10_000, completion_tokens: 2_000, prompt_tokens_details: { cached_tokens: 8_000 }, completion_tokens_details: { reasoning_tokens: 1500 } }).output, 2_000);
    assert.equal(normalizeUsage({ prompt_tokens: 1, completion_tokens: 1, prompt_tokens_details: { cached_tokens: 2 } }), null);
    const invite = store.createInvite("test");
    const beforeMidnight = Date.parse("2026-09-29T15:59:59Z"), afterMidnight = beforeMidnight + 2000;
    const a = store.activate(invite.code, digest("a"), beforeMidnight), b = store.activate(invite.code, digest("b"), beforeMidnight);
    const ia = store.identity(a.token, beforeMidnight), ib = store.identity(b.token, beforeMidnight);
    assert.notEqual(ia.session, ib.session); assert.equal(ia.invite, ib.invite);
    assert.throws(() => store.identity("invalid", beforeMidnight), /失效/);
    const run = randomUUID(); store.startRun(ia, run, beforeMidnight);
    assert.throws(() => store.startRun(ib, randomUUID(), beforeMidnight), /正在回答/);
    const reserved = store.reserve(ia, run, 10000, 2000, beforeMidnight);
    assert.equal(store.balance(invite.id, dayKey(beforeMidnight)), DAILY_CREDITS - 160_000);
    store.settle(reserved.id, { input: 10000, cached: 8000, output: 2000 });
    store.settle(reserved.id, { input: 10000, cached: 0, output: 9999 });
    assert.equal(store.balance(invite.id, dayKey(beforeMidnight)), DAILY_CREDITS - 96_000);
    assert.equal(store.balance(invite.id, dayKey(afterMidnight)), DAILY_CREDITS);
    const next = store.reserve(ia, run, 5000, 2000, afterMidnight);
    assert.equal(store.balance(invite.id, dayKey(afterMidnight)), DAILY_CREDITS - 110_000);
    store.release(next.id);
    assert.throws(() => store.reserve(ia, run, 10_000_000, 2000, afterMidnight), /积分不足/);
    store.finishRun(run); assert.throws(() => store.startRun(ia, run, afterMidnight), /重复/);
    store.disableInvite(invite.id); assert.throws(() => store.identity(a.token, afterMidnight), /失效/);
    assert.throws(() => store.activate(invite.code, digest("c"), afterMidnight), /失效/);
  } finally { store.close(); }
});

test("百炼思考协议、SSE 用量、失败预留和取消", async () => {
  const store = new XiaobeiStore(":memory:");
  const fetchOriginal = globalThis.fetch;
  const keyOriginal = process.env.DASHSCOPE_API_KEY, urlOriginal = process.env.DASHSCOPE_BASE_URL;
  process.env.DASHSCOPE_API_KEY = "fixture-not-a-key"; process.env.DASHSCOPE_BASE_URL = "http://127.0.0.1:1/v1";
  try {
    const invite = store.createInvite("test"), session = store.activate(invite.code, digest("test"));
    const identity = store.identity(session.token), run = randomUUID(); store.startRun(identity, run);
    const encoder = new TextEncoder();
    const sse = items => new Response(items.map(item => `data: ${typeof item === "string" ? item : JSON.stringify(item)}\n\n`).join(""));
    let mode = "success", calls = 0;
    globalThis.fetch = async (_url, options) => {
      calls++; const body = JSON.parse(options.body);
      assert.equal(body.model, "deepseek-v4.1-flash"); assert.equal(body.enable_thinking, true);
      assert.equal(body.stream_options.include_usage, true);
      if (mode === "reject") return new Response("do not expose provider secrets", { status: 401 });
      if (mode === "missing") return sse([{ choices: [{ delta: { content: "partial" } }] }]);
      if (mode === "abort") return new Response(new ReadableStream({ start(controller) { controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n')); options.signal.addEventListener("abort", () => controller.error(new DOMException("aborted", "AbortError"))); } }));
      return sse([{ choices: [{ delta: { reasoning_content: "private thought" } }] }, { choices: [{ delta: { content: "公开回答" }, finish_reason: "stop" }] }, { choices: [], usage: { prompt_tokens: 10000, completion_tokens: 2000, prompt_tokens_details: { cached_tokens: 8000 } } }, "[DONE]"]);
    };
    const options = { store, identity, run, messages: [{ role: "user", content: "解释 API" }], signal: new AbortController().signal };
    let visible = "", thinking = "";
    const result = await callModel({ ...options, onDelta: text => { visible += text; }, onReasoning: text => { thinking += text; } });
    assert.equal(visible, "公开回答"); assert.equal(result.message.reasoning_content, "private thought"); assert.equal(thinking, "private thought");
    assert.equal(store.balance(invite.id), DAILY_CREDITS - 96_000);
    mode = "reject"; await assert.rejects(callModel(options), /暂不可用/); assert.equal(store.balance(invite.id), DAILY_CREDITS - 96_000);
    mode = "missing"; await assert.rejects(callModel(options), /待结算/); const afterMissing = store.balance(invite.id); assert.ok(afterMissing < DAILY_CREDITS - 96_000);
    mode = "abort"; const abort = new AbortController(); const request = callModel({ ...options, signal: abort.signal, onDelta: () => abort.abort() });
    await assert.rejects(request, /已停止/); assert.ok(store.balance(invite.id) < afterMissing);
    const count = calls; await assert.rejects(callModel({ ...options, projectedTokens: 256_000 }), /256K/); assert.equal(calls, count);
  } finally {
    globalThis.fetch = fetchOriginal;
    if (keyOriginal === undefined) delete process.env.DASHSCOPE_API_KEY; else process.env.DASHSCOPE_API_KEY = keyOriginal;
    if (urlOriginal === undefined) delete process.env.DASHSCOPE_BASE_URL; else process.env.DASHSCOPE_BASE_URL = urlOriginal;
    store.close();
  }
});

test("思考、外显文字、工具与最终答案保持顺序，中断仅结束未完成活动", () => {
  let blocks = [];
  const events = [
    { type: "think", id: "think1", text: "先查资料", state: "running", timestamp: 10 },
    { type: "think", id: "think1", text: "再比较", state: "running", timestamp: 20 },
    { type: "think", id: "think1", state: "complete", timestamp: 30 },
    { type: "delta", id: "text1", text: "我先看两个词条。" },
    { type: "text_end", id: "text1", phase: "commentary" },
    { type: "tool", id: "tool1", name: "read_term", summary: "harness", state: "running", timestamp: 40 },
    { type: "tool", id: "tool1", name: "read_term", summary: "运行框架", state: "complete", timestamp: 50 },
    { type: "think", id: "think2", text: "已获得资料", state: "running", timestamp: 60 },
    { type: "think", id: "think2", state: "complete", timestamp: 70 },
    { type: "delta", id: "text2", text: "答案" },
    { type: "delta", id: "text2", text: "与链接" },
    { type: "text_end", id: "text2", phase: "answer" },
    { type: "tool", id: "tool2", name: "read_term", summary: "tools", state: "running", timestamp: 80 },
  ];
  for (const event of events) {
    blocks = applyEvent(blocks, event);
    const { process, answer } = partitionTranscript(blocks);
    if (event.type === "delta") {
      assert.equal(answer.id, event.id); // Collapse at the first text token, before text_end.
      assert.equal(process.length, blocks.length - 1);
    }
    if (event.type === "tool" || event.phase === "commentary") assert.equal(answer, undefined);
  }
  assert.deepEqual(blocks.map(b => b.kind), ["think", "text", "tool", "think", "text", "tool"]);
  assert.equal(blocks[0].text, "先查资料再比较"); assert.equal(blocks[0].startedAt, 10); assert.equal(blocks[0].finishedAt, 30);
  assert.equal(blocks[1].phase, "commentary"); assert.equal(blocks[2].summary, "运行框架");
  assert.equal(blocks[4].text, "答案与链接"); assert.equal(blocks[4].phase, "answer");
  const stopped = finishActivities(blocks, "stopped", 90);
  assert.equal(stopped[2].state, "complete"); assert.equal(stopped[5].state, "stopped"); assert.equal(stopped[5].finishedAt, 90);
  assert.equal(finishActivities(blocks, "error", 90)[5].state, "error");
});
