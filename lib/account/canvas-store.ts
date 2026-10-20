import { randomUUID } from "node:crypto";
import { parseCanvas, type CanvasData } from "../canvas.ts";
import { XiaobeiError } from "../xiaobei/store.ts";
import type { AccountStore, AccountIdentity } from "./store.ts";

export type CloudCanvas = { id: string; name: string; data: CanvasData; updatedAt: number };
export type CanvasSummary = Omit<CloudCanvas, "data">;
type Row = { id: string; name: string; data: string; updated: number };
export class CloudCanvasStore {
  private accounts: AccountStore;
  constructor(accounts: AccountStore) {
    this.accounts = accounts;
    accounts.store.db.exec(`CREATE TABLE IF NOT EXISTS account_canvases(
      id TEXT PRIMARY KEY, account TEXT NOT NULL REFERENCES accounts(id), source TEXT NOT NULL,
      name TEXT NOT NULL, data TEXT NOT NULL, revision INTEGER NOT NULL, updated INTEGER NOT NULL,
      UNIQUE(account,source));
      CREATE INDEX IF NOT EXISTS account_canvases_owner ON account_canvases(account,updated DESC);`);
  }
  private authorize(identity: AccountIdentity) {
    if (!this.accounts.store.db.prepare("SELECT 1 FROM account_sessions WHERE hash=? AND account=? AND expires>?").get(identity.session, identity.id, Date.now())) throw new XiaobeiError("请重新登录。", 401);
  }
  private decode(row: Row): CloudCanvas { return { id: row.id, name: row.name, data: parseCanvas(JSON.parse(row.data)), updatedAt: row.updated }; }
  list(identity: AccountIdentity): CanvasSummary[] {
    this.authorize(identity);
    return (this.accounts.store.db.prepare("SELECT id,name,updated FROM account_canvases WHERE account=? ORDER BY updated DESC,id").all(identity.id) as unknown as Row[])
      .map(row => ({ id: row.id, name: row.name, updatedAt: row.updated }));
  }
  read(identity: AccountIdentity, id: string): CloudCanvas {
    this.authorize(identity);
    const row = this.accounts.store.db.prepare("SELECT id,name,data,updated FROM account_canvases WHERE account=? AND id=?").get(identity.id, id) as Row | undefined;
    if (!row) throw new XiaobeiError("找不到这张画布。", 404);
    return this.decode(row);
  }
  private serialized(data: CanvasData) {
    const valid = parseCanvas(data), value = JSON.stringify(valid);
    if (valid.nodes.length > 2000 || valid.edges.length > 6000 || Buffer.byteLength(value) > 25 * 1024 * 1024) throw new XiaobeiError("这张画布超出云端容量，请减少图片或拆分画布。", 413);
    return value;
  }
  private quota(account: string, bytes: number, except = "") {
    const row = this.accounts.store.db.prepare("SELECT COUNT(*) AS count,COALESCE(SUM(length(CAST(data AS BLOB))),0) AS bytes FROM account_canvases WHERE account=? AND id<>?").get(account, except) as { count: number; bytes: number };
    if (row.count >= 20 || row.bytes + bytes > 100 * 1024 * 1024) throw new XiaobeiError("账号云端容量已满，当前内容仍保存在本地，请先导出备份。", 413);
  }
  create(identity: AccountIdentity, source: string, name: string, data: CanvasData): CloudCanvas {
    return this.accounts.store.transaction(() => {
      this.authorize(identity);
      const db = this.accounts.store.db;
      const old = db.prepare("SELECT id,name,data,updated FROM account_canvases WHERE account=? AND source=?").get(identity.id, source) as Row | undefined;
      if (old) return this.decode(old);
      const content = this.serialized({ ...data, revision: 1 });
      this.quota(identity.id, Buffer.byteLength(content));
      const id = randomUUID(), now = Date.now();
      db.prepare("INSERT INTO account_canvases VALUES(?,?,?,?,?,?,?)").run(id, identity.id, source, name, content, 1, now);
      return { id, name, data: parseCanvas(JSON.parse(content)), updatedAt: now };
    });
  }
  write(identity: AccountIdentity, id: string, expected: number, data: CanvasData): CloudCanvas {
    return this.accounts.store.transaction(() => {
      this.authorize(identity);
      const current = this.read(identity, id);
      if (current.data.revision !== expected) throw new XiaobeiError("云端画布已更新，请重新同步。", 409);
      const content = this.serialized({ ...data, revision: expected + 1 });
      this.quota(identity.id, Buffer.byteLength(content), id);
      const now = Date.now();
      this.accounts.store.db.prepare("UPDATE account_canvases SET data=?,revision=?,updated=? WHERE id=? AND account=? AND revision=?").run(content, expected + 1, now, id, identity.id, expected);
      return { ...current, data: parseCanvas(JSON.parse(content)), updatedAt: now };
    });
  }
}
