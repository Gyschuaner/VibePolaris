import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { completionContext, completionFence, shortCompletion } from "../lib/canvas-completion.ts";
import { DAILY_CREDITS, XiaobeiStore, digest, usageCost } from "../lib/xiaobei/store.ts";
import { callModel } from "../lib/xiaobei/model.ts";

test("补全只取光标前文并限制上下文，保留完整输出和Unicode", () => {
  const before = "# 标题\n## 当前小节\n" + "前文".repeat(4000), markdown = before + "不能发送的后文";
  const context = completionContext(markdown, before.length, "笔记标题");
  assert.equal(context.title, "笔记标题"); assert.equal(context.prefix.length, 6000);
  assert.equal(context.outline, "# 标题\n## 当前小节"); assert.ok(!context.prefix.includes("不能发送"));
  const imageNote = "# 图片笔记\n\n已有的正文\n\n![截图](<data:image/png;base64," + "a".repeat(7000) + ">)\n\n接着写";
  const imageContext = completionContext(imageNote, imageNote.length, "图片笔记");
  assert.ok(imageContext.prefix.includes("已有的正文")); assert.ok(imageContext.prefix.includes("[内嵌图片]")); assert.ok(!imageContext.prefix.includes("aaaa"));
  assert.ok(!completionContext(imageNote, imageNote.indexOf("aaaa") + 200, "图片笔记").prefix.includes("aaaa"));
  assert.equal(completionFence("```mermaid\nflowchart LR\n A-->B"), "```mermaid");
  assert.equal(completionFence("````md\n```js\n片段\n```\n````\n正文"), "");
  assert.equal(completionFence("~~~python\npass\n~~~"), "");
  const longBlock = "```mermaid\nflowchart LR\n" + "  A --> B\n".repeat(800);
  assert.equal(completionContext(longBlock, longBlock.length, "图表").fence, "```mermaid");
  assert.equal(shortCompletion("\n- 保留列表\r\n"), "\n- 保留列表");
  assert.equal(Array.from(shortCompletion("🌱".repeat(101))).length, 101);
  const complete = "先把问题拆成可以观察的一小步，记录自己已经知道的事实和仍然不确定的地方。".repeat(3) + "**把最后这句话说完整，再继续下一步。**";
  assert.ok(Array.from(complete).length > 100);
  assert.equal(shortCompletion(complete), complete);
  assert.equal(shortCompletion("今天我想试着把那些零散的念头固定下来。", "前文。\n\n今天我想试着"), "把那些零散的念头固定下来。");
  assert.equal(shortCompletion("I want to keep writing.", "Today I want to"), " keep writing.");
  assert.equal(shortCompletion("哈哈接着写", "哈哈"), "哈哈接着写");
  assert.equal(shortCompletion("\n- 保留列表", "前文\n\n\n\n"), "\n- 保留列表");
  assert.equal(shortCompletion("🌱🌱🌱🌱" + "新".repeat(101), "前文🌱🌱🌱🌱"), "新".repeat(101));
});

test("免费请求不预占或扣分，余额零仍计量；收费沿用原价且策略按请求固定", () => {
  const store = new XiaobeiStore(":memory:");
  try {
    const invite = store.createInvite("completion"), session = store.activate(invite.code, digest("fixture")), identity = store.identity(session.token);
    const run = randomUUID(); store.startRun(identity, run);
    const usage = { input: 1000, cached: 800, output: 80 };
    const free = store.reserve(identity, run, 2000, 384, Date.now(), { feature: "canvas_completion", charge: false });
    assert.equal(store.balance(invite.id), DAILY_CREDITS);
    store.settle(free.id, usage); store.settle(free.id, { input: 99999, cached: 0, output: 9999 });
    const row = store.db.prepare("SELECT * FROM usage WHERE id=?").get(free.id);
    assert.equal(row.cost, 0); assert.equal(row.reserved, 0); assert.equal(row.calculated_cost, usageCost(usage)); assert.equal(row.feature, "canvas_completion"); assert.equal(row.input, 1000);
    const paid = store.reserve(identity, run, 2000, 384, Date.now(), { feature: "canvas_completion", charge: true });
    store.settle(paid.id, usage); assert.equal(store.balance(invite.id), DAILY_CREDITS - usageCost(usage));
    const fill = store.reserve(identity, run, 1000, 384); store.settle(fill.id, { input: 10_000_000, cached: 0, output: 0 });
    assert.equal(store.balance(invite.id), 0);
    const pending = store.reserve(identity, run, 2000, 384, Date.now(), { feature: "canvas_completion", charge: false });
    assert.equal(store.balance(invite.id), 0); assert.equal(store.db.prepare("SELECT cost FROM usage WHERE id=?").get(pending.id).cost, null);
    assert.throws(() => store.reserve(identity, run, 2000, 384), /积分不足/);
    store.finishRun(run);
    const next = randomUUID(), now = Date.now(); store.startRun(identity, next, now, 2000); store.finishRun(next);
    assert.throws(() => store.startRun(identity, randomUUID(), now + 1000, 2000), /较快/);
    store.startRun(identity, randomUUID(), now + 2001, 2000);
    store.disableInvite(invite.id); assert.throws(() => store.reserve(identity, next, 1, 384, Date.now(), { feature: "canvas_completion", charge: false }), /失效/);
  } finally { store.close(); }
});

test("旧账本增量迁移保留余额，免费待结算跨重启不追扣，旧运行插入仍兼容", () => {
  const folder = mkdtempSync(join(tmpdir(), "vbp100-")), file = join(folder, "ledger.sqlite");
  let store;
  try {
    const old = new DatabaseSync(file);
    old.exec("CREATE TABLE usage(id TEXT PRIMARY KEY,invite TEXT NOT NULL,day TEXT NOT NULL,reserved INTEGER NOT NULL,cost INTEGER,input INTEGER,cached INTEGER,output INTEGER)"); old.close();
    store = new XiaobeiStore(file);
    const invite = store.createInvite("migration"), session = store.activate(invite.code, digest("fixture")), identity = store.identity(session.token);
    const run = randomUUID(); store.startRun(identity, run);
    const free = store.reserve(identity, run, 1000, 384, Date.now(), { feature: "canvas_completion", charge: false });
    store.close(); store = new XiaobeiStore(file); store.settle(free.id, { input: 300, cached: 0, output: 50 });
    assert.equal(store.balance(invite.id), DAILY_CREDITS);
    store.db.prepare("INSERT INTO runs VALUES(?,?,?,?,0)").run(randomUUID(), invite.id, identity.session, 0);
  } finally { store?.close(); rmSync(folder, { recursive: true, force: true }); }
});

test("补全复用百炼传输与计量，关闭思考、短输出预算，未知用量不伪造为0", async () => {
  const store = new XiaobeiStore(":memory:"), originalFetch = globalThis.fetch;
  const oldKey = process.env.DASHSCOPE_API_KEY, oldUrl = process.env.DASHSCOPE_BASE_URL;
  process.env.DASHSCOPE_API_KEY = "fixture"; process.env.DASHSCOPE_BASE_URL = "http://127.0.0.1:1/v1";
  try {
    const invite = store.createInvite("protocol"), session = store.activate(invite.code, digest("fixture")), identity = store.identity(session.token), run = randomUUID(); store.startRun(identity, run);
    let missing = false;
    globalThis.fetch = async (_url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.enable_thinking, false); assert.ok(!("reasoning_effort" in body)); assert.equal(body.max_tokens, 1024); assert.ok(!body.tools);
      const data = [{ choices: [{ delta: { content: "接着写下这句话，让想法慢慢变得清楚。" }, finish_reason: "stop" }] }];
      if (!missing) data.push({ choices: [], usage: { prompt_tokens: 500, completion_tokens: 30 } });
      return new Response(data.map(x => `data: ${JSON.stringify(x)}\n\n`).join("") + "data: [DONE]\n\n");
    };
    const options = { store, identity, run, messages: [{ role: "user", content: "前文" }], signal: new AbortController().signal, completion: { charge: false } };
    const result = await callModel(options); assert.equal(result.usage.output, 30); assert.equal(store.balance(invite.id), DAILY_CREDITS);
    missing = true; await assert.rejects(callModel(options), /待结算/);
    const pending = store.db.prepare("SELECT * FROM usage WHERE cost IS NULL").get(); assert.equal(pending.reserved, 0); assert.equal(pending.input, null); assert.equal(pending.calculated_cost, null);
  } finally {
    globalThis.fetch = originalFetch; store.close();
    if (oldKey === undefined) delete process.env.DASHSCOPE_API_KEY; else process.env.DASHSCOPE_API_KEY = oldKey;
    if (oldUrl === undefined) delete process.env.DASHSCOPE_BASE_URL; else process.env.DASHSCOPE_BASE_URL = oldUrl;
  }
});
