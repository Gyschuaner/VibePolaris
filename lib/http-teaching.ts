export type Note = { id: number; title: string };
export type NoteMethod = "GET" | "PUT" | "POST" | "DELETE";

// A local teaching resource, not an HTTP server or a general REST implementation.
export function applyNoteMethod(notes: Note[], nextId: number, method: NoteMethod) {
  const existing = notes.find(note => note.id === 42);
  if (method === "GET") return { notes, nextId, status: existing ? 200 : 404, body: existing ?? { error: "找不到 42" } };
  if (method === "POST") {
    const note = { id: nextId, title: "已校对" };
    return { notes: [...notes, note], nextId: nextId + 1, status: 201, body: note };
  }
  if (method === "PUT") {
    const note = { id: 42, title: "已校对" };
    return { notes: [...notes.filter(item => item.id !== 42), note].sort((a, b) => a.id - b.id), nextId, status: existing ? 200 : 201, body: note };
  }
  return { notes: notes.filter(note => note.id !== 42), nextId, status: existing ? 204 : 404, body: existing ? null : { error: "找不到 42" } };
}

export function exportStatus(count: number, available: boolean): 202 | 422 | 503 {
  if (!available) return 503;
  return Number.isInteger(count) && count >= 1 && count <= 5 ? 202 : 422;
}

// Deliberately supports exact media types only; no wildcard or q-value parser.
export function negotiateBook(accept: string) {
  if (accept === "application/json") return { status: 200, type: accept, body: '{"title":"海边的书店"}' };
  if (accept === "text/plain") return { status: 200, type: "text/plain; charset=utf-8", body: "海边的书店" };
  return { status: 406, type: "text/plain; charset=utf-8", body: "没有可接受的表示" };
}
