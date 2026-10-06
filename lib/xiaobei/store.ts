import { createHash, randomBytes, randomUUID } from "node:crypto";
import { chmodSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { finishActivities } from "./events.ts";
import { pairInterruptedTools, type ConversationState, type ConversationSummary, type ConversationDetail } from "./history.ts";

export const DAILY_CREDITS = 100_000_000; // Integer millionths of one credit.
export const SESSION_COOKIE = "vp-xiaobei";
export const BROWSER_COOKIE = "vp-xiaobei-browser";
export const SESSION_SECONDS = 30 * 24 * 60 * 60;
export class XiaobeiError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
export type Identity = { session: string; invite: string };
export type HistoryIdentity = Identity & { browser: string };
type ConversationRow = { id: string; title: string; updated: number; active_run: string | null; data: string; running: number };
export type Usage = { input: number; cached: number; output: number };
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export const dayKey = (now = Date.now()) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
}).format(now);
export function usageCost(usage: Usage) {
  if (![usage.input, usage.cached, usage.output].every(n => Number.isSafeInteger(n) && n >= 0) || usage.cached > usage.input) {
    throw new XiaobeiError("模型未返回有效用量，本次额度暂待结算。", 502);
  }
  return (usage.input - usage.cached) * 10 + usage.cached * 2 + usage.output * 30;
}

export class XiaobeiStore {
  db: DatabaseSync;
  constructor(file: string) {
    if (file !== ":memory:") mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(file);
    if (file !== ":memory:") chmodSync(file, 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS invites (id TEXT PRIMARY KEY, hash TEXT UNIQUE NOT NULL, label TEXT NOT NULL, expires INTEGER, disabled INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, invite TEXT NOT NULL REFERENCES invites(id), expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS runs (id TEXT PRIMARY KEY, invite TEXT NOT NULL REFERENCES invites(id), session TEXT NOT NULL, lease INTEGER NOT NULL, done INTEGER NOT NULL DEFAULT 0);
      CREATE INDEX IF NOT EXISTS active_runs ON runs(invite, done, lease);
      CREATE TABLE IF NOT EXISTS usage (id TEXT PRIMARY KEY, invite TEXT NOT NULL REFERENCES invites(id), day TEXT NOT NULL, reserved INTEGER NOT NULL, cost INTEGER, input INTEGER, cached INTEGER, output INTEGER);
      CREATE INDEX IF NOT EXISTS daily_usage ON usage(invite, day);
      CREATE TABLE IF NOT EXISTS activation_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, invite TEXT NOT NULL REFERENCES invites(id), browser TEXT NOT NULL,
        title TEXT NOT NULL, updated INTEGER NOT NULL, active_run TEXT, data TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS conversation_history ON conversations(invite,browser,updated DESC,id DESC);`);
  }
  transaction<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try { const value = fn(); this.db.exec("COMMIT"); return value; }
    catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }
  createInvite(label: string, expires: number | null = null) {
    const id = randomUUID();
    const code = `xb_${randomBytes(24).toString("base64url")}`;
    this.db.prepare("INSERT INTO invites(id,hash,label,expires) VALUES(?,?,?,?)").run(id, digest(code), label, expires);
    return { id, code, expires };
  }
  disableInvite(id: string) { return this.db.prepare("UPDATE invites SET disabled=1 WHERE id=?").run(id).changes > 0; }
  listInvites() { return this.db.prepare("SELECT id,label,expires,disabled FROM invites ORDER BY rowid DESC").all(); }
  activate(code: string, attemptKey: string, now = Date.now()) {
    // Even valid attempts are bounded; keys are hashed and expire, never raw IPs/codes.
    this.transaction(() => {
      this.db.prepare("DELETE FROM activation_attempts WHERE until<=?").run(now);
      this.db.prepare("INSERT INTO activation_attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1").run(attemptKey, now + 600_000);
      const row = this.db.prepare("SELECT count FROM activation_attempts WHERE key=?").get(attemptKey) as { count: number };
      if (row.count > 20) throw new XiaobeiError("尝试较多，请十分钟后再试。", 429);
    });
    const invite = this.db.prepare("SELECT id,expires,disabled FROM invites WHERE hash=?").get(digest(code)) as { id: string; expires: number | null; disabled: number } | undefined;
    if (!invite || invite.disabled || (invite.expires !== null && invite.expires <= now)) throw new XiaobeiError("邀请码无效或已失效，请联系邀请人。", 401);
    const token = randomBytes(32).toString("base64url");
    const expires = Math.min(now + SESSION_SECONDS * 1000, invite.expires ?? Infinity);
    this.db.prepare("DELETE FROM sessions WHERE expires<=?").run(now);
    this.db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(digest(token), invite.id, expires);
    return { token, expires };
  }
  identity(token: string | undefined, now = Date.now()): Identity {
    if (!token) throw new XiaobeiError("请先使用邀请码激活小北。", 401);
    const session = digest(token);
    const row = this.db.prepare(`SELECT s.invite FROM sessions s JOIN invites i ON i.id=s.invite
      WHERE s.hash=? AND s.expires>? AND i.disabled=0 AND (i.expires IS NULL OR i.expires>?)`).get(session, now, now) as { invite: string } | undefined;
    if (!row) throw new XiaobeiError("授权已失效，请重新激活小北。", 401);
    return { session, invite: row.invite };
  }
  logout(identity: Identity) { this.db.prepare("DELETE FROM sessions WHERE hash=?").run(identity.session); }
  checkIdentity(identity: Identity, now = Date.now()) {
    const row = this.db.prepare(`SELECT 1 FROM sessions s JOIN invites i ON i.id=s.invite
      WHERE s.hash=? AND s.invite=? AND s.expires>? AND i.disabled=0 AND (i.expires IS NULL OR i.expires>?)`).get(identity.session, identity.invite, now, now);
    if (!row) throw new XiaobeiError("授权已失效。", 401);
  }
  balance(invite: string, day = dayKey()) {
    const row = this.db.prepare("SELECT COALESCE(SUM(COALESCE(cost,reserved)),0) AS used FROM usage WHERE invite=? AND day=?").get(invite, day) as { used: number };
    return Math.max(0, DAILY_CREDITS - row.used);
  }
  startRun(identity: Identity, id: string, now = Date.now()) {
    this.transaction(() => {
      this.checkIdentity(identity, now);
      if (this.db.prepare("SELECT 1 FROM runs WHERE id=?").get(id)) throw new XiaobeiError("该请求已处理，请勿重复发送。", 409);
      if (this.db.prepare("SELECT 1 FROM runs WHERE invite=? AND done=0 AND lease>?").get(identity.invite, now)) throw new XiaobeiError("这个邀请码已有问题正在回答，请稍后再试。", 409);
      this.db.prepare("INSERT INTO runs VALUES(?,?,?,?,0)").run(id, identity.invite, identity.session, now + 120_000);
    });
  }
  renewRun(id: string, now = Date.now()) {
    return this.db.prepare("UPDATE runs SET lease=? WHERE id=? AND done=0 AND lease>?").run(now + 120_000, id, now).changes > 0;
  }
  finishRun(id: string) { this.db.prepare("UPDATE runs SET done=1 WHERE id=?").run(id); }
  reserve(identity: Identity, run: string, inputBound: number, wantedOutput: number, now = Date.now()) {
    return this.transaction(() => {
      this.checkIdentity(identity, now);
      if (!this.db.prepare("SELECT 1 FROM runs WHERE id=? AND session=? AND done=0 AND lease>?").get(run, identity.session, now)) throw new XiaobeiError("本次请求已结束，请重新提问。", 409);
      const day = dayKey(now);
      const available = this.balance(identity.invite, day);
      const maxOutput = Math.min(wantedOutput, Math.floor((available - inputBound * 10) / 30));
      if (maxOutput < 256) throw new XiaobeiError("今日积分不足，明日恢复。", 429);
      const id = randomUUID();
      this.db.prepare("INSERT INTO usage(id,invite,day,reserved) VALUES(?,?,?,?)").run(id, identity.invite, day, inputBound * 10 + maxOutput * 30);
      return { id, maxOutput };
    });
  }
  settle(id: string, usage: Usage) {
    const cost = usageCost(usage);
    this.db.prepare("UPDATE usage SET cost=?,input=?,cached=?,output=? WHERE id=? AND cost IS NULL").run(cost, usage.input, usage.cached, usage.output, id);
  }
  release(id: string) { this.settle(id, { input: 0, cached: 0, output: 0 }); }
  listConversations(identity: HistoryIdentity, offset = 0, now = Date.now()) {
    this.checkIdentity(identity, now);
    const rows = this.db.prepare(`SELECT c.id,c.title,c.updated, EXISTS(SELECT 1 FROM runs r WHERE r.id=c.active_run AND r.done=0 AND r.lease>?) AS running
      FROM conversations c WHERE c.invite=? AND c.browser=? ORDER BY c.updated DESC,c.id DESC LIMIT 31 OFFSET ?`).all(now, identity.invite, identity.browser, offset) as unknown as ConversationRow[];
    return { items: rows.slice(0, 30).map(row => this.conversationSummary(row)), nextOffset: rows.length > 30 ? offset + 30 : null };
  }
  private conversationSummary(row: ConversationRow): ConversationSummary {
    return { id: row.id, title: row.title, updatedAt: row.updated, running: !!row.running };
  }
  private conversationRow(identity: HistoryIdentity, id: string, now: number) {
    return this.db.prepare(`SELECT c.*, EXISTS(SELECT 1 FROM runs r WHERE r.id=c.active_run AND r.done=0 AND r.lease>?) AS running
      FROM conversations c WHERE c.id=? AND c.invite=? AND c.browser=?`).get(now, id, identity.invite, identity.browser) as ConversationRow | undefined;
  }
  private recoverConversation(row: ConversationRow) {
    const state = JSON.parse(row.data) as ConversationState;
    if (row.active_run && !row.running) {
      state.model.messages = pairInterruptedTools(state.model.messages);
      if (state.pendingText) state.model.messages.push({ role: "assistant", content: state.pendingText });
      state.pendingText = "";
      const last = state.messages.at(-1);
      if (last?.role === "assistant") {
        last.blocks = finishActivities(last.blocks, "stopped");
        last.error = "上次回答已中断，已保存的内容保留在这里，可以继续提问。";
      }
      this.db.prepare("UPDATE conversations SET data=?,active_run=NULL WHERE id=? AND active_run=?").run(JSON.stringify(state), row.id, row.active_run);
    }
    return state;
  }
  getConversation(identity: HistoryIdentity, id: string, now = Date.now()): ConversationDetail {
    // History reads are frequent while a remote run is streaming. A write
    // transaction here makes every poll compete with the agent's checkpoints;
    // recovery itself performs one conditional update only when a lease expired.
    this.checkIdentity(identity, now);
    const row = this.conversationRow(identity, id, now);
    if (!row) throw new XiaobeiError("找不到这段对话。", 404);
    const state = this.recoverConversation(row);
    return { ...this.conversationSummary(row), messages: state.messages, context: state.context };
  }
  beginConversation(identity: HistoryIdentity, id: string, run: string, text: string, page: string, continuing: boolean, now = Date.now()): ConversationState {
    return this.transaction(() => {
      this.checkIdentity(identity, now);
      if (!this.db.prepare("SELECT 1 FROM runs WHERE id=? AND invite=? AND session=? AND done=0 AND lease>?").get(run, identity.invite, identity.session, now)) throw new XiaobeiError("本次请求已结束，请重新提问。", 409);
      const row = this.conversationRow(identity, id, now);
      if (!row && (continuing || this.db.prepare("SELECT 1 FROM conversations WHERE id=?").get(id))) throw new XiaobeiError("找不到这段对话。", 404);
      if (row?.running) throw new XiaobeiError("这段对话还在回答，请稍后再试。", 409);
      const state = row ? this.recoverConversation(row) : { model: { messages: [] }, messages: [], context: null };
      state.messages.push({ id: `${run}-user`, role: "user", text, page, blocks: [] }, { id: `${run}-assistant`, role: "assistant", text: "", blocks: [] });
      if (row) this.db.prepare("UPDATE conversations SET data=?,active_run=?,updated=? WHERE id=?").run(JSON.stringify(state), run, now, id);
      else this.db.prepare("INSERT INTO conversations VALUES(?,?,?,?,?,?,?)").run(id, identity.invite, identity.browser, Array.from(text.replace(/\s+/g, " ")).slice(0, 40).join(""), now, run, JSON.stringify(state));
      return state;
    });
  }
  saveConversation(identity: HistoryIdentity, id: string, run: string, state: ConversationState, finish = false, now = Date.now()) {
    // Fence old writers after a lease expires; they cannot overwrite a newer turn.
    const result = this.db.prepare(`UPDATE conversations SET data=?,updated=?,active_run=? WHERE id=? AND invite=? AND browser=? AND active_run=?
      AND EXISTS(SELECT 1 FROM runs WHERE id=? AND session=? AND done=0 AND lease>?)`).run(JSON.stringify(state), now, finish ? null : run, id, identity.invite, identity.browser, run, run, identity.session, now);
    if (!result.changes) throw new XiaobeiError("本次回答已结束，请重新打开对话。", 409);
  }
  close() { this.db.close(); }
}

const stores = globalThis as typeof globalThis & { xiaobeiStore?: XiaobeiStore };
export function getStore() {
  return stores.xiaobeiStore ??= new XiaobeiStore(resolve(/* turbopackIgnore: true */ process.env.XIAOBEI_DB_PATH || ".xiaobei/xiaobei.sqlite"));
}
