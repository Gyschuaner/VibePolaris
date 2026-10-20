import { emptyCanvas, parseCanvas, type CanvasData } from "./canvas";

let connection: Promise<IDBDatabase> | undefined;
function database() {
  if (!connection) connection = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("vibepolaris-free-canvas", 1);
    let blocked = false;
    request.onupgradeneeded = () => { request.result.createObjectStore("canvas"); };
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      request.result.onversionchange = () => { request.result.close(); connection = undefined; };
      resolve(request.result);
    };
    request.onerror = () => { connection = undefined; reject(new Error("浏览器本地存储暂不可用，请重试。")); };
    request.onblocked = () => { blocked = true; connection = undefined; reject(new Error("请关闭其他本站窗口后重试。")); };
  }).catch(error => { connection = undefined; throw error; });
  return connection;
}

export class CanvasConflict extends Error {
  constructor() { super("另一窗口已修改画布。当前草稿已保留，请先导出需要的笔记，再重新载入。"); }
}

export async function guestCanvasSource(): Promise<string> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("canvas", "readwrite"), store = tx.objectStore("canvas");
    let source: string;
    const previous = store.get("guest-source");
    previous.onsuccess = () => { source = previous.result ?? crypto.randomUUID(); store.put(source, "guest-source"); };
    tx.oncomplete = () => resolve(source);
    tx.onerror = tx.onabort = () => reject(new Error("本地画布迁移标记保存失败，请重试。"));
  });
}

export async function readCanvas(key = "main"): Promise<CanvasData> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("canvas", "readonly");
    const request = tx.objectStore("canvas").get(key);
    request.onsuccess = () => {
      try { resolve(request.result === undefined ? emptyCanvas() : parseCanvas(request.result)); }
      catch { reject(new Error("本地画布暂时无法读取，原数据未改动。请重试。")); }
    };
    tx.onerror = tx.onabort = () => reject(new Error("读取本地画布失败，请重试。"));
  });
}

export async function writeCanvas(data: CanvasData, expectedRevision: number, key = "main"): Promise<number> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("canvas", "readwrite"), store = tx.objectStore("canvas");
    let failure: Error | undefined;
    const request = store.get(key);
    request.onsuccess = () => {
      if ((request.result?.revision ?? 0) !== expectedRevision) {
        failure = new CanvasConflict(); tx.abort(); return;
      }
      store.put({ ...data, revision: expectedRevision + 1 }, key);
    };
    tx.oncomplete = () => resolve(expectedRevision + 1);
    tx.onerror = tx.onabort = () => reject(failure ?? new Error("本地保存失败，草稿仍在当前页。请导出或重试。"));
  });
}

export async function readCloudCache(key: string): Promise<{ data?: CanvasData; base?: CanvasData }> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("canvas", "readonly"), store = tx.objectStore("canvas");
    const data = store.get(key), base = store.get(`base:${key}`);
    tx.oncomplete = () => {
      try { resolve({ data: data.result === undefined ? undefined : parseCanvas(data.result), base: base.result === undefined ? undefined : parseCanvas(base.result) }); }
      catch { reject(new Error("本地同步缓存无法读取，原数据未改动。")); }
    };
    tx.onerror = tx.onabort = () => reject(new Error("读取同步缓存失败。"));
  });
}

export async function writeCloudCache(key: string, data: CanvasData, base: CanvasData, expectedRevision: number): Promise<number> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("canvas", "readwrite"), store = tx.objectStore("canvas");
    let conflict = false;
    const previous = store.get(key);
    previous.onsuccess = () => {
      if ((previous.result?.revision ?? 0) !== expectedRevision) { conflict = true; tx.abort(); return; }
      store.put({ ...data, revision: expectedRevision + 1 }, key); store.put(base, `base:${key}`);
    };
    tx.oncomplete = () => resolve(expectedRevision + 1);
    tx.onerror = tx.onabort = () => reject(conflict ? new CanvasConflict() : new Error("同步缓存保存失败，当前草稿已保留。"));
  });
}

export async function forkCloudCache(key: string, forkKey: string, local: CanvasData, remote: CanvasData, fork: CanvasData, expected: number, forkExpected: number) {
  const db = await database();
  return new Promise<{ revision: number; forkRevision: number }>((resolve, reject) => {
    const tx = db.transaction("canvas", "readwrite"), store = tx.objectStore("canvas");
    const original = store.get(key), copy = store.get(forkKey);
    let count = 0, conflict = false;
    function write() {
      if (++count !== 2) return;
      if ((original.result?.revision ?? 0) !== expected || (copy.result?.revision ?? 0) !== forkExpected) { conflict = true; tx.abort(); return; }
      // Moving a conflict draft and acknowledging the original must commit together.
      store.put({ ...remote, revision: expected + 1 }, key); store.put(remote, `base:${key}`);
      store.put({ ...local, revision: forkExpected + 1 }, forkKey); store.put(fork, `base:${forkKey}`);
    }
    original.onsuccess = write; copy.onsuccess = write;
    tx.oncomplete = () => resolve({ revision: expected + 1, forkRevision: forkExpected + 1 });
    tx.onerror = tx.onabort = () => reject(conflict ? new CanvasConflict() : new Error("冲突副本缓存未保存，当前草稿仍保留。"));
  });
}
