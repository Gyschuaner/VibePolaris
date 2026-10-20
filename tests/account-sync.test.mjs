import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { AccountStore } from "../lib/account/store.ts";
import { CloudCanvasStore } from "../lib/account/canvas-store.ts";
import { XiaobeiStore, digest } from "../lib/xiaobei/store.ts";
import { emptyCanvas } from "../lib/canvas.ts";
import { mergeCanvas, sameCanvas } from "../lib/canvas-sync.ts";

const password = "test-6";
const node = (id = randomUUID(), markdown = "测试正文") => ({ id, markdown, fileName: "", kind: "note", title: "测试节点", summary: "摘要", x: 10, y: 20, createdAt: "2026-10-20T00:00:00Z", updatedAt: "2026-10-20T00:00:00Z" });

test("头像跨会话保存、账号隔离、恢复默认与上传校验", async () => {
  const store = new XiaobeiStore(":memory:"), accounts = new AccountStore(store);
  const avatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABMElEQVR4nO3SMREAIBDAsPeHA2zg/0AGQzNk79DZZ1265ncABsAAGAADYAAMgAEwAAbAABgAA2AADIABMAAGwAAYAANgAAyAATAABsAAGAADYAAMgAEwAAbAABgAA2AADIABMAAGwAAYIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNAnAHiDBBngDgDxBkgzgBxBogzQJwB4gwQZ4A4A8QZIM4AcQaIM0CcAeIMEGeAOAPEGSDOAHEGiDNA3ANtq8fMOqoH/wAAAABJRU5ErkJggg==";
  try {
    const first = await accounts.authenticate("avatar_owner", password, true), second = await accounts.authenticate("avatar_owner", password, false), other = await accounts.authenticate("avatar_other", password, true);
    const owner = accounts.identity(first.token);
    assert.equal(accounts.profile(owner).avatar, null);
    accounts.setAvatar(owner, avatar);
    assert.equal(accounts.profile(accounts.identity(second.token)).avatar, avatar);
    assert.equal(accounts.profile(accounts.identity(other.token)).avatar, null);
    assert.throws(() => accounts.setAvatar(owner, "data:image/svg+xml;base64,PHN2Zy8+"), /有效/);
    assert.throws(() => accounts.setAvatar(owner, "data:image/png;base64," + "A".repeat(132_000)), /有效/);
    assert.throws(() => accounts.setAvatar(owner, "data:image/png;base64,iVBORw0KGgo="), /无法识别/);
    assert.equal(accounts.profile(owner).avatar, avatar);
    accounts.setAvatar(owner, null);
    assert.equal(accounts.profile(accounts.identity(second.token)).avatar, null);
    accounts.logout(owner);
    assert.throws(() => accounts.setAvatar(owner, avatar), error => error.status === 401);
  } finally { store.close(); }
});

test("账号会话、云端隔离、迁移重试与旧版本覆盖保护", async () => {
  const store = new XiaobeiStore(":memory:"), accounts = new AccountStore(store), cloud = new CloudCanvasStore(accounts);
  try {
    await assert.rejects(accounts.authenticate("short_password", "12345", true), /密码需为6–128位/);
    const login = await accounts.authenticate("Owner_A", password, true), other = await accounts.authenticate("owner_b", password, true);
    assert.equal(login.account.username, "owner_a");
    await assert.rejects(accounts.authenticate("owner_a", "incorrect-password-101", false), /不正确/);
    const a = accounts.identity(login.token), b = accounts.identity(other.token);
    assert.notEqual(store.db.prepare("SELECT password FROM accounts WHERE id=?").get(a.id).password, password);
    assert.equal(store.db.prepare("SELECT 1 FROM account_sessions WHERE hash=?").get(login.token), undefined);
    const data = { ...emptyCanvas(), nodes: [node()] };
    const first = cloud.create(a, "browser-a:1", "画布A", data);
    assert.equal(cloud.create(a, "browser-a:1", "重试", data).id, first.id);
    const second = cloud.create(a, "browser-b:1", "画布B", data);
    assert.notEqual(first.id, second.id);
    assert.equal(cloud.list(a).length, 2); assert.equal(cloud.list(b).length, 0);
    assert.throws(() => cloud.read(b, first.id), error => error.status === 404);
    assert.throws(() => cloud.write(b, first.id, 1, data), error => error.status === 404);
    const own = cloud.create(b, "browser-a:1", "不同账号", data);
    assert.notEqual(own.id, first.id);
    const updated = cloud.write(a, first.id, 1, { ...first.data, nodes: [] });
    assert.equal(updated.data.revision, 2);
    assert.throws(() => cloud.write(a, first.id, 1, first.data), error => error.status === 409);
    assert.equal(cloud.read(a, first.id).data.nodes.length, 0);
    accounts.logout(a);
    assert.throws(() => accounts.identity(login.token), error => error.status === 401);
    assert.throws(() => cloud.read(a, first.id), error => error.status === 401);
  } finally { store.close(); }
});

test("小北绑定覆盖账号所有会话，历史只迁移已证明的浏览器，额度与撤销一致", async () => {
  const store = new XiaobeiStore(":memory:"), accounts = new AccountStore(store);
  try {
    const first = await accounts.authenticate("account_a", password, true), second = await accounts.authenticate("account_a", password, false);
    const other = await accounts.authenticate("account_b", password, true);
    const account = accounts.identity(first.token), invite = store.createInvite("synthetic");
    const guest = store.activate(invite.code, digest("activation")), legacy = store.identity(guest.token);
    const browserA = digest("browser-a"), browserB = digest("browser-b");
    function conversation(browser) {
      const run = randomUUID(), id = randomUUID();
      store.startRun(legacy, run); const identity = { ...legacy, browser };
      const state = store.beginConversation(identity, id, run, "合成历史", "/canvas", false);
      store.saveConversation(identity, id, run, state, true); store.finishRun(run); return id;
    }
    const a = conversation(browserA), b = conversation(browserB);
    accounts.bind(account, invite.id, browserA);
    assert.equal(store.identity(guest.token).invite, invite.id); // Existing guest grants keep their original expiry and ledger.
    assert.throws(() => store.activate(invite.code, digest("new-guest")), /已绑定账号/);
    const one = store.identity(first.token), two = store.identity(second.token);
    assert.equal(one.invite, two.invite); assert.notEqual(one.session, two.session);
    assert.equal(store.balance(one.invite), store.balance(two.invite));
    const history = { ...two, browser: `account:${account.id}` };
    assert.equal(store.getConversation(history, a).id, a);
    assert.throws(() => store.getConversation(history, b), error => error.status === 404);
    assert.throws(() => accounts.bind(accounts.identity(other.token), invite.id), /其他账号/);
    const third = await accounts.authenticate("account_a", password, false);
    assert.equal(store.identity(third.token).invite, invite.id);
    store.disableInvite(invite.id);
    assert.throws(() => store.checkIdentity(two), error => error.status === 401);
    assert.ok(accounts.identity(third.token)); // Canvas login survives entitlement revocation.
  } finally { store.close(); }
});

test("三方合并保留独立编辑、节点删除与连线；同处修改保留冲突", () => {
  const a = node(), b = node(), base = { ...emptyCanvas(), nodes: [a, b] };
  const local = structuredClone(base), remote = structuredClone(base);
  local.nodes[0].markdown = "本地修改"; remote.nodes[1].markdown = "另一浏览器修改";
  const merged = mergeCanvas(base, local, remote);
  assert.equal(merged.nodes[0].markdown, "本地修改"); assert.equal(merged.nodes[1].markdown, "另一浏览器修改");
  remote.nodes[0].markdown = "同一段另一版本"; assert.equal(mergeCanvas(base, local, remote), null);
  const removed = { ...base, nodes: [a] };
  assert.equal(mergeCanvas(base, base, removed).nodes.length, 1);
  assert.equal(mergeCanvas(base, { ...base, nodes: [a, { ...b, markdown: "离线修改" }] }, removed), null);
  const edge = { id: randomUUID(), from: a.id, to: b.id };
  const edges = mergeCanvas(base, { ...base, edges: [edge] }, { ...base, edges: [{ ...edge, id: randomUUID() }] });
  assert.equal(edges.edges.length, 1);
  assert.equal(sameCanvas(base, { ...base, revision: 100, view: { x: 200, y: 0, scale: 2 } }), true);
  const move = { ...base, nodes: [{ ...a, x: 90, y: 60 }, b] }, text = { ...base, nodes: [{ ...a, markdown: "文字" }, b] };
  const both = mergeCanvas(base, move, text); assert.equal(both.nodes[0].x, 90); assert.equal(both.nodes[0].markdown, "文字");
});
