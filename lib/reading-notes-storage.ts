import { mergeNotes, type ReadingNote } from "./reading-notes";

let connection: Promise<IDBDatabase> | undefined;
function database(): Promise<IDBDatabase> {
  if (!connection) connection = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("vibepolaris-reading-notes", 1);
    let blocked = false;
    request.onupgradeneeded = () => { request.result.createObjectStore("notes", { keyPath: "id" }); };
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      request.result.onversionchange = () => { request.result.close(); connection = undefined; };
      resolve(request.result);
    };
    request.onerror = () => { connection = undefined; reject(new Error("本地存储暂不可用")); };
    request.onblocked = () => { blocked = true; connection = undefined; reject(new Error("请关闭其他本站窗口后重试")); };
  }).catch(error => { connection = undefined; throw error; });
  return connection;
}
async function transaction<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore, result: (value: T) => void) => void): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("notes", mode);
    let value: T;
    tx.oncomplete = () => resolve(value);
    tx.onerror = tx.onabort = () => reject(new Error("本地保存失败"));
    run(tx.objectStore("notes"), result => { value = result; });
  });
}
export const readNotes = () => transaction<ReadingNote[]>("readonly", (store, result) => { store.getAll().onsuccess = event => result((event.target as IDBRequest<ReadingNote[]>).result); });
export const writeNote = (note: ReadingNote) => transaction<void>("readwrite", store => { store.put(note); });
export const deleteNote = (id: string) => transaction<void>("readwrite", store => { store.delete(id); });
export const importNotes = (incoming: ReadingNote[]) => transaction<ReadingNote[]>("readwrite", (store, result) => {
  store.getAll().onsuccess = event => {
    const existing = (event.target as IDBRequest<ReadingNote[]>).result;
    const merged = mergeNotes(existing, incoming, () => crypto.randomUUID());
    merged.slice(existing.length).forEach(note => store.put(note));
    result(merged);
  };
});
