import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { AccountStore } from "../lib/account/store.ts";
import { AccountNotesStore } from "../lib/account/notes-store.ts";
import { XiaobeiStore } from "../lib/xiaobei/store.ts";
import { mergeReadingNotes } from "../lib/reading-notes-sync.ts";
import { emptyCanvas, parseCanvas } from "../lib/canvas.ts";
import { mergeCanvas } from "../lib/canvas-sync.ts";
import { mergeNotes, parseNotesBackup } from "../lib/reading-notes.ts";

const note = (id, body) => ({ id, body, source: { path: "/terms/http", title: "HTTP" }, anchor: null, createdAt: "2026-10-22T00:00:00Z", updatedAt: "2026-10-22T00:00:00Z" });

test("阅读笔记跨会话可见，账号隔离，过期会话和旧版本不能覆盖云端", async () => {
  const db = new XiaobeiStore(":memory:"), accounts = new AccountStore(db), store = new AccountNotesStore(accounts);
  try {
    const a = accounts.identity((await accounts.authenticate("notes_owner", "test-6", true)).token);
    const otherSession = accounts.identity((await accounts.authenticate("notes_owner", "test-6", false)).token);
    const b = accounts.identity((await accounts.authenticate("notes_other", "test-6", true)).token);
    const content = [note("one", "自己的笔记")];
    assert.deepEqual(store.read(a), { revision: 0, notes: [] });
    assert.deepEqual(store.write(a, 0, content), { revision: 1, notes: content });
    assert.deepEqual(store.read(otherSession).notes, content);
    assert.deepEqual(store.read(b).notes, []);
    assert.throws(() => store.read({ ...a, id: b.id }), error => error.status === 401);
    assert.throws(() => store.write(otherSession, 0, []), error => error.status === 409);
    assert.deepEqual(store.read(a).notes, content);
    accounts.logout(a);
    assert.throws(() => store.write(a, 1, []), error => error.status === 401);
    assert.equal(store.read(otherSession).revision, 1);
  } finally { db.close(); }
});

test("笔记三方合并保留独立编辑和删除；冲突及请求期间的编辑不丢失；重复导入幂等", () => {
  const first = note("one", "原文一"), second = note("two", "原文二"), base = [first, second];
  const local = [{ ...first, body: "本地一" }, second], remote = [first, { ...second, body: "云端二" }];
  assert.deepEqual(mergeReadingNotes(base, local, remote, randomUUID).notes.map(n => n.body), ["本地一", "云端二"]);
  assert.deepEqual(mergeReadingNotes(base, [first], base, randomUUID).notes, [first]);
  const conflict = mergeReadingNotes([first], [{ ...first, body: "本地版本" }], [{ ...first, body: "云端版本" }], randomUUID);
  assert.equal(conflict.conflicts, 1);
  assert.equal(new Set(conflict.notes.map(n => n.id)).size, 2);
  assert.deepEqual(new Set(conflict.notes.map(n => n.body)), new Set(["本地版本", "云端版本"]));
  assert.equal(mergeReadingNotes([first], [], [{ ...first, body: "删除期间另一端修改" }], randomUUID).notes[0].body, "删除期间另一端修改");
  const duringRequest = [{ ...local[0], body: "请求期间继续写" }, second];
  const accepted = mergeReadingNotes(base, local, remote, randomUUID).notes;
  assert.deepEqual(mergeReadingNotes(local, duringRequest, accepted, randomUUID).notes.map(n => n.body), ["请求期间继续写", "云端二"]);
  const incoming = [note("guest", "原文一"), note("one", "相同编号但不同内容")];
  const once = mergeNotes(base, incoming, randomUUID);
  assert.equal(once.length, 3);
  assert.deepEqual(mergeNotes(once, incoming, randomUUID), once);
});

test("画布草稿与文章批注往返保留，独立正文编辑可合并，批注冲突交给画布副本处理", () => {
  const annotation = { ...note("quote", "这句话的理解"), source: { path: "/canvas?canvas=canvas-one&note=node-one&version=article", title: "HTTP · 文章" }, anchor: { block: "article:0", exact: "请求方法", start: 0, prefix: "", suffix: "" } };
  const node = { id: "node-one", markdown: "草稿", fileName: "", x: 0, y: 0, createdAt: annotation.createdAt, updatedAt: annotation.updatedAt, annotations: { draft: [], article: [annotation] } };
  const base = { ...emptyCanvas(), nodes: [node] };
  assert.deepEqual(parseCanvas(JSON.parse(JSON.stringify(base))), base);
  assert.deepEqual(parseNotesBackup(JSON.stringify({ version: 1, notes: [annotation] })), [annotation]);
  assert.throws(() => parseNotesBackup(JSON.stringify({ version: 1, notes: [{ ...annotation, source: { path: "javascript:alert(1)", title: "非法" } }] })));
  const local = structuredClone(base), remote = structuredClone(base);
  local.nodes[0].annotations.article[0].body = "本地旁注";
  remote.nodes[0].markdown = "另一端编辑正文";
  const merged = mergeCanvas(base, local, remote);
  assert.equal(merged.nodes[0].annotations.article[0].body, "本地旁注");
  assert.equal(merged.nodes[0].markdown, "另一端编辑正文");
  remote.nodes[0].annotations.article[0].body = "另一端旁注";
  assert.equal(mergeCanvas(base, local, remote), null);
});
