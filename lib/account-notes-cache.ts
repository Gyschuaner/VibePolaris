import { emptyNotesSnapshot, notesSnapshotSchema, type NotesSnapshot } from "./reading-notes-sync";
import type { ReadingNote } from "./reading-notes";

export type AccountNotesCache = { revision: number; notes: ReadingNote[]; base: NotesSnapshot };
let connection: Promise<IDBDatabase> | undefined;
function database() {
  if (!connection) connection = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("vibepolaris-account-notes", 1);
    let blocked = false;
    request.onupgradeneeded = () => request.result.createObjectStore("accounts");
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      request.result.onversionchange = () => { request.result.close(); connection = undefined; };
      resolve(request.result);
    };
    request.onerror = () => reject(new Error("账号笔记本地存储暂不可用。"));
    request.onblocked = () => { blocked = true; reject(new Error("请关闭其他本站窗口后重试。")); };
  }).catch(error => { connection = undefined; throw error; });
  return connection;
}
export async function accountNotesCache(owner: string, change?: (current: AccountNotesCache) => AccountNotesCache): Promise<AccountNotesCache> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("accounts", change ? "readwrite" : "readonly"), store = tx.objectStore("accounts");
    let result: AccountNotesCache, failure: unknown;
    const request = store.get(owner);
    request.onsuccess = () => {
      try {
        const raw = request.result;
        result = raw === undefined ? { ...emptyNotesSnapshot(), base: emptyNotesSnapshot() } : { ...notesSnapshotSchema.parse(raw), base: notesSnapshotSchema.parse(raw.base) };
        if (change) { result = change(result); result = { ...notesSnapshotSchema.parse({ ...result, revision: result.revision + 1 }), base: notesSnapshotSchema.parse(result.base) }; store.put(result, owner); }
      } catch (error) { failure = error; tx.abort(); }
    };
    tx.oncomplete = () => resolve(result);
    tx.onerror = tx.onabort = () => reject(failure ?? new Error("账号笔记本地保存失败，当前内容已保留。"));
  });
}
