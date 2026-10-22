import { emptyNotesSnapshot, notesSnapshotSchema, type NotesSnapshot } from "../reading-notes-sync.ts";
import { XiaobeiError } from "../xiaobei/store.ts";
import type { AccountIdentity, AccountStore } from "./store.ts";

export class AccountNotesStore {
  private accounts: AccountStore;
  constructor(accounts: AccountStore) {
    this.accounts = accounts;
    accounts.store.db.exec("CREATE TABLE IF NOT EXISTS account_reading_notes(account TEXT PRIMARY KEY REFERENCES accounts(id), data TEXT NOT NULL, revision INTEGER NOT NULL)");
  }
  private authorize(identity: AccountIdentity) {
    if (!this.accounts.store.db.prepare("SELECT 1 FROM account_sessions WHERE hash=? AND account=? AND expires>?").get(identity.session, identity.id, Date.now())) throw new XiaobeiError("请重新登录。", 401);
  }
  read(identity: AccountIdentity): NotesSnapshot {
    this.authorize(identity);
    const row = this.accounts.store.db.prepare("SELECT data,revision FROM account_reading_notes WHERE account=?").get(identity.id) as { data: string; revision: number } | undefined;
    return row ? notesSnapshotSchema.parse({ revision: row.revision, notes: JSON.parse(row.data) }) : emptyNotesSnapshot();
  }
  write(identity: AccountIdentity, expected: number, notes: NotesSnapshot["notes"]): NotesSnapshot {
    return this.accounts.store.transaction(() => {
      const current = this.read(identity);
      if (current.revision !== expected) throw new XiaobeiError("云端笔记刚有更新，请再次同步。", 409);
      const value = notesSnapshotSchema.parse({ revision: expected + 1, notes }), data = JSON.stringify(value.notes);
      if (Buffer.byteLength(data) > 25 * 1024 * 1024) throw new XiaobeiError("笔记超出云端容量，请先导出备份并整理。当前本地内容保留。", 413);
      this.accounts.store.db.prepare("INSERT INTO account_reading_notes(account,data,revision) VALUES(?,?,?) ON CONFLICT(account) DO UPDATE SET data=excluded.data,revision=excluded.revision").run(identity.id, data, value.revision);
      return value;
    });
  }
}
