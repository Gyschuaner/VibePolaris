const DB_NAME = 'vibepolaris-notes-prototype-v1';
let connection;
function database() {
  if (!connection) connection = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('notes', { keyPath: 'id' });
      request.result.createObjectStore('meta');
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => { request.result.close(); connection = undefined; };
      resolve(request.result);
    };
    request.onerror = () => { connection = undefined; reject(request.error); };
    request.onblocked = () => { connection = undefined; reject(new Error('请关闭其他原型窗口后重试')); };
  });
  return connection;
}
async function transaction(stores, mode, run) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    let value;
    tx.oncomplete = () => resolve(value);
    tx.onerror = tx.onabort = () => reject(tx.error ?? new Error('本地保存失败'));
    run(tx, result => { value = result; });
  });
}
export const putNote = note => transaction(['notes'], 'readwrite', tx => tx.objectStore('notes').put(note));
export const deleteNote = id => transaction(['notes'], 'readwrite', tx => tx.objectStore('notes').delete(id));
export async function loadNotes(examples) {
  await transaction(['notes', 'meta'], 'readwrite', tx => {
    const meta = tx.objectStore('meta');
    meta.get('initialized').onsuccess = event => {
      if (event.target.result) return;
      examples.forEach(note => tx.objectStore('notes').put(note));
      meta.put(true, 'initialized');
    };
  });
  return transaction(['notes'], 'readonly', (tx, result) => {
    tx.objectStore('notes').getAll().onsuccess = event => result(event.target.result);
  });
}
export function parseBackup(text) {
  const data = JSON.parse(text);
  if (data.version !== 1 || !Array.isArray(data.notes) || data.notes.length > 10000) throw new Error('不支持的备份格式');
  return data.notes.map(note => {
    if (!note || typeof note.id !== 'string' || note.id.length > 200 || typeof note.body !== 'string' || note.body.length > 20000 || note.source !== 'agent-harness' || !Number.isFinite(Date.parse(note.createdAt)) || !Number.isFinite(Date.parse(note.updatedAt))) throw new Error('备份中的笔记格式不正确');
    let anchor = null;
    if (note.anchor != null) {
      const a = note.anchor;
      if (typeof a.block !== 'string' || a.block.length > 200 || typeof a.exact !== 'string' || !a.exact.length || a.exact.length > 5000 || typeof a.prefix !== 'string' || a.prefix.length > 48 || typeof a.suffix !== 'string' || a.suffix.length > 48 || !Number.isInteger(a.start) || a.start < 0) throw new Error('备份中的原文位置不正确');
      anchor = { block: a.block, exact: a.exact, prefix: a.prefix, suffix: a.suffix, start: a.start };
    }
    return { id: note.id, body: note.body, source: note.source, anchor, createdAt: note.createdAt, updatedAt: note.updatedAt, example: false };
  });
}
export async function importNotes(incoming) {
  return transaction(['notes'], 'readwrite', (tx, result) => {
    const store = tx.objectStore('notes');
    store.getAll().onsuccess = event => {
      const existing = event.target.result;
      const ids = new Set(existing.map(note => note.id));
      for (const note of incoming) {
        if (existing.some(old => old.body === note.body && JSON.stringify(old.anchor) === JSON.stringify(note.anchor))) continue;
        const copy = { ...note, id: ids.has(note.id) ? crypto.randomUUID() : note.id };
        ids.add(copy.id); store.put(copy); existing.push(copy);
      }
      result(existing);
    };
  });
}
