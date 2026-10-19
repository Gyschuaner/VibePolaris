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

export async function readCanvas(): Promise<CanvasData> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("canvas", "readonly");
    const request = tx.objectStore("canvas").get("main");
    request.onsuccess = () => {
      try { resolve(request.result === undefined ? emptyCanvas() : parseCanvas(request.result)); }
      catch { reject(new Error("本地画布暂时无法读取，原数据未改动。请重试。")); }
    };
    tx.onerror = tx.onabort = () => reject(new Error("读取本地画布失败，请重试。"));
  });
}

export async function writeCanvas(data: CanvasData, expectedRevision: number): Promise<number> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("canvas", "readwrite"), store = tx.objectStore("canvas");
    let failure: Error | undefined;
    const request = store.get("main");
    request.onsuccess = () => {
      if ((request.result?.revision ?? 0) !== expectedRevision) {
        failure = new CanvasConflict(); tx.abort(); return;
      }
      store.put({ ...data, revision: expectedRevision + 1 }, "main");
    };
    tx.oncomplete = () => resolve(expectedRevision + 1);
    tx.onerror = tx.onabort = () => reject(failure ?? new Error("本地保存失败，草稿仍在当前页。请导出或重试。"));
  });
}
