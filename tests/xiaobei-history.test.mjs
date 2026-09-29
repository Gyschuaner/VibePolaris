import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { XiaobeiStore, digest } from "../lib/xiaobei/store.ts";

test("历史持久化、浏览器/邀请码隔离、续聊与失效写入保护", () => {
  const dir = mkdtempSync(join(tmpdir(), "xiaobei-history-")), file = join(dir, "history.sqlite");
  let store = new XiaobeiStore(file);
  const now = Date.now(), later = now + 121_000;
  try {
    const invite = store.createInvite("history-test"), otherInvite = store.createInvite("other-test");
    const first = store.activate(invite.code, digest("first"), now);
    const second = store.activate(invite.code, digest("second"), now);
    const other = store.activate(otherInvite.code, digest("other"), now);
    const a = { ...store.identity(first.token, now), browser: digest("browser-a") };
    const b = { ...store.identity(second.token, now), browser: digest("browser-b") };
    const c = { ...store.identity(other.token, now), browser: a.browser };
    const id = randomUUID(), run = randomUUID();
    store.startRun(a, run, now);
    const state = store.beginConversation(a, id, run, "解释上下文", "上下文", false, now);
    state.model.messages = [{ role: "system", content: "server-only-instructions" }, { role: "user", content: "学习代号北极松" },
      { role: "assistant", content: "先读取词条", reasoning_content: "provider-think", tool_calls: [
        { id: "one", type: "function", function: { name: "read_term", arguments: '{"slug":"context"}' } },
        { id: "two", type: "function", function: { name: "read_term", arguments: '{"slug":"tools"}' } },
      ] }, { role: "tool", tool_call_id: "one", content: "actual-tool-result" }];
    state.messages.at(-1).blocks = [{ kind: "tool", id: "tool-two", text: "", summary: "工具调用", state: "running", startedAt: now }];
    state.context = { tokens: 1234, inputTokens: 1000 };
    state.pendingText = "已收到的部分回答";
    store.saveConversation(a, id, run, state, false, now);
    assert.equal(store.getConversation(a, id, now).running, true);
    assert.equal(store.listConversations(b, 0, now).items.length, 0);
    assert.throws(() => store.getConversation(b, id, now), e => e.status === 404);
    assert.throws(() => store.getConversation(c, id, now), e => e.status === 404);

    store.close(); store = new XiaobeiStore(file);
    const restored = store.getConversation(a, id, later);
    assert.equal(restored.running, false);
    assert.equal(restored.messages[0].text, "解释上下文");
    assert.equal(restored.messages[1].blocks[0].state, "stopped");
    assert.match(restored.messages[1].error, /中断/);
    assert.deepEqual(restored.context, state.context);
    assert.ok(!JSON.stringify(restored).includes("server-only-instructions"));
    assert.ok(!JSON.stringify(restored).includes("actual-tool-result"));

    const nextRun = randomUUID(); store.startRun(a, nextRun, later);
    const next = store.beginConversation(a, id, nextRun, "继续", "上下文", true, later);
    assert.equal(next.model.messages[1].content, "学习代号北极松");
    assert.equal(next.model.messages.filter(m => m.tool_call_id === "two").length, 1);
    assert.equal(next.model.messages.at(-1).content, "已收到的部分回答");
    assert.throws(() => store.saveConversation(a, id, run, state, true, later), e => e.status === 409);
    store.saveConversation(a, id, nextRun, next, true, later); store.finishRun(nextRun);
    assert.equal(store.getConversation(a, id, later).messages.length, 4);

    const foreignRun = randomUUID(); store.startRun(b, foreignRun, later);
    assert.throws(() => store.beginConversation(b, id, foreignRun, "overwrite", "", false, later), e => e.status === 404);
    store.finishRun(foreignRun);
    const reactivated = { ...store.identity(store.activate(invite.code, digest("again"), later).token, later), browser: a.browser };
    assert.equal(store.listConversations(reactivated, 0, later).items[0].id, id);
    for (let n = 0; n < 30; n++) {
      const cid = randomUUID(), rid = randomUUID(); store.startRun(a, rid, later + n);
      const data = store.beginConversation(a, cid, rid, `问题${n}`, "", false, later + n);
      store.saveConversation(a, cid, rid, data, true, later + n); store.finishRun(rid);
    }
    assert.equal(store.listConversations(a, 0, later + 50).items.length, 30);
    assert.equal(store.listConversations(a, 0, later + 50).nextOffset, 30);
    assert.equal(store.listConversations(a, 30, later + 50).items.length, 1);
    store.disableInvite(invite.id);
    assert.throws(() => store.listConversations(a, 0, later), e => e.status === 401);
    assert.throws(() => store.getConversation(a, id, later), e => e.status === 401);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});
