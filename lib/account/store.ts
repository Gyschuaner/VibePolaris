import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { digest, getStore, SESSION_SECONDS, XiaobeiError, type XiaobeiStore } from "../xiaobei/store.ts";

export const ACCOUNT_COOKIE = "vp-account";
export type Account = { id: string; username: string; avatar?: string | null };
export type AccountIdentity = Account & { session: string };
let hashing = 0;
async function passwordHash(password: string, salt: string) {
  if (hashing >= 2) throw new XiaobeiError("登录请求较多，请稍后重试。", 429);
  hashing++;
  try { return await new Promise<Buffer>((resolve, reject) => scrypt(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }, (error, value) => error ? reject(error) : resolve(value))); }
  finally { hashing--; }
}
export const normalizeUsername = (value: string) => value.normalize("NFKC").trim().toLowerCase();
export function validCredentials(username: string, password: string) {
  return /^[\p{L}\p{N}_-]{3,32}$/u.test(username) && password.length >= 15 && password.length <= 128;
}

export class AccountStore {
  store: XiaobeiStore;
  constructor(store: XiaobeiStore) {
    this.store = store;
    store.db.exec(`
      CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, salt TEXT NOT NULL, password TEXT NOT NULL, created INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS account_sessions(hash TEXT PRIMARY KEY, account TEXT NOT NULL REFERENCES accounts(id), expires INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS account_sessions_owner ON account_sessions(account);
      CREATE TABLE IF NOT EXISTS account_invites(account TEXT PRIMARY KEY REFERENCES accounts(id), invite TEXT UNIQUE NOT NULL REFERENCES invites(id));
      CREATE TABLE IF NOT EXISTS account_attempts(key TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS account_profiles(account TEXT PRIMARY KEY REFERENCES accounts(id), avatar TEXT);
    `);
  }
  limit(key: string, maximum: number, period: number, now = Date.now()) {
    this.store.transaction(() => {
      this.store.db.prepare("DELETE FROM account_attempts WHERE until<=?").run(now);
      this.store.db.prepare("INSERT INTO account_attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1").run(digest(key), now + period);
      const row = this.store.db.prepare("SELECT count FROM account_attempts WHERE key=?").get(digest(key)) as { count: number };
      if (row.count > maximum) throw new XiaobeiError("尝试较多，请稍后再试。", 429);
    });
  }
  async authenticate(username: string, password: string, register: boolean) {
    username = normalizeUsername(username);
    if (!validCredentials(username, password)) throw new XiaobeiError("用户名需为3–32位文字、数字、下划线或短横线，密码需为15–128位。");
    this.limit("credentials", 100, 600_000);
    this.limit(`login:${username}`, 10, 600_000);
    if (register) this.limit("registration", 20, 3_600_000);
    const db = this.store.db;
    const existing = db.prepare("SELECT id,username,salt,password FROM accounts WHERE username=?").get(username) as (Account & { salt: string; password: string }) | undefined;
    const salt = existing?.salt ?? randomBytes(24).toString("hex");
    const hash = await passwordHash(password, salt);
    let account: Account;
    if (register) {
      if (existing) throw new XiaobeiError("这个用户名已被使用。", 409);
      account = { id: randomUUID(), username };
      try { db.prepare("INSERT INTO accounts VALUES(?,?,?,?,?)").run(account.id, username, salt, hash.toString("hex"), Date.now()); }
      catch (error) {
        if (db.prepare("SELECT 1 FROM accounts WHERE username=?").get(username)) throw new XiaobeiError("这个用户名已被使用。", 409);
        throw error;
      }
    } else {
      if (!existing || !timingSafeEqual(hash, Buffer.from(existing.password, "hex"))) throw new XiaobeiError("用户名或密码不正确。", 401);
      account = { id: existing.id, username: existing.username };
    }
    return this.createSession(account);
  }
  private createSession(account: Account) {
    const token = randomBytes(32).toString("base64url"), session = digest(token), now = Date.now(), expires = now + SESSION_SECONDS * 1000;
    this.store.transaction(() => {
      this.store.db.prepare("DELETE FROM account_sessions WHERE expires<=?").run(now);
      this.store.db.prepare("INSERT INTO account_sessions VALUES(?,?,?)").run(session, account.id, expires);
      const grant = this.store.db.prepare("SELECT invite FROM account_invites WHERE account=?").get(account.id) as { invite: string } | undefined;
      if (grant) this.store.db.prepare("INSERT OR REPLACE INTO sessions VALUES(?,?,?)").run(session, grant.invite, expires);
    });
    return { token, expires, account };
  }
  identity(token: string | undefined, now = Date.now()): AccountIdentity {
    if (!token || !/^[\w-]{43}$/.test(token)) throw new XiaobeiError("请先登录账号。", 401);
    const session = digest(token);
    const row = this.store.db.prepare("SELECT a.id,a.username FROM accounts a JOIN account_sessions s ON s.account=a.id WHERE s.hash=? AND s.expires>?").get(session, now) as Account | undefined;
    if (!row) throw new XiaobeiError("登录已过期，请重新登录。", 401);
    return { ...row, session };
  }
  logout(identity: AccountIdentity) {
    this.store.transaction(() => {
      this.store.db.prepare("DELETE FROM account_sessions WHERE hash=? AND account=?").run(identity.session, identity.id);
      this.store.db.prepare("DELETE FROM sessions WHERE hash=?").run(identity.session);
    });
  }
  profile(identity: AccountIdentity): Account {
    const row = this.store.db.prepare("SELECT avatar FROM account_profiles WHERE account=?").get(identity.id) as { avatar: string | null } | undefined;
    return { id: identity.id, username: identity.username, avatar: row?.avatar ?? null };
  }
  setAvatar(identity: AccountIdentity, avatar: string | null) {
    if (!this.store.db.prepare("SELECT 1 FROM account_sessions WHERE hash=? AND account=? AND expires>?").get(identity.session, identity.id, Date.now())) throw new XiaobeiError("请重新登录。", 401);
    if (avatar !== null) {
      if (avatar.length > 132_000 || !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(avatar)) throw new XiaobeiError("请上传有效的头像图片。");
      const png = Buffer.from(avatar.slice(22), "base64");
      if (png.length < 45 || png.length > 96 * 1024 || png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || png.toString("ascii", 12, 16) !== "IHDR" || png.readUInt32BE(16) !== 128 || png.readUInt32BE(20) !== 128 || png.toString("hex", png.length - 12) !== "0000000049454e44ae426082") throw new XiaobeiError("头像图片无法识别，请重新选择。");
    }
    this.store.db.prepare("INSERT INTO account_profiles VALUES(?,?) ON CONFLICT(account) DO UPDATE SET avatar=excluded.avatar").run(identity.id, avatar);
    return this.profile(identity);
  }
  grant(account: string) {
    return this.store.db.prepare("SELECT i.id,i.disabled,i.expires FROM account_invites a JOIN invites i ON i.id=a.invite WHERE a.account=?").get(account) as { id: string; disabled: number; expires: number | null } | undefined;
  }
  bind(identity: AccountIdentity, invite: string, browser?: string) {
    this.store.transaction(() => {
      const db = this.store.db;
      if (!db.prepare("SELECT 1 FROM account_sessions WHERE hash=? AND account=? AND expires>?").get(identity.session, identity.id, Date.now())) throw new XiaobeiError("请重新登录。", 401);
      const source = db.prepare("SELECT id FROM invites WHERE id=? AND disabled=0 AND (expires IS NULL OR expires>?)").get(invite, Date.now());
      if (!source) throw new XiaobeiError("邀请码已失效。", 401);
      const old = this.grant(identity.id);
      if (old && old.id !== invite) throw new XiaobeiError("该账号已经绑定小北邀请码。", 409);
      const owner = db.prepare("SELECT account FROM account_invites WHERE invite=?").get(invite) as { account: string } | undefined;
      if (owner && owner.account !== identity.id) throw new XiaobeiError("这个邀请码已绑定其他账号，请使用自己的邀请码。", 409);
      if (db.prepare("SELECT 1 FROM runs WHERE invite=? AND done=0 AND lease>?").get(invite, Date.now())) throw new XiaobeiError("小北仍在回答，请结束后再绑定。", 409);
      db.prepare("INSERT OR IGNORE INTO account_invites VALUES(?,?)").run(identity.id, invite);
      db.prepare("INSERT OR REPLACE INTO sessions(hash,invite,expires) SELECT hash,?,expires FROM account_sessions WHERE account=?").run(invite, identity.id);
      // Only a proven browser scope is moved; a shared invite never grants other browsers' history.
      if (browser) db.prepare("UPDATE conversations SET browser=? WHERE invite=? AND browser=?").run(`account:${identity.id}`, invite, browser);
    });
  }
}

const globals = globalThis as typeof globalThis & { accountStore?: AccountStore };
export const getAccountStore = () => globals.accountStore ??= new AccountStore(getStore());
