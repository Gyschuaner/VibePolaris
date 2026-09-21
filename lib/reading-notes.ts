import { z } from "zod";

const sourceSchema = z.object({ path: z.string().regex(/^\/(terms|guides)\/[a-z0-9-]+$/), title: z.string().min(1).max(200) });
const anchorSchema = z.object({ block: z.string().min(1).max(300), exact: z.string().min(1).max(5000), start: z.number().int().min(0), prefix: z.string().max(48), suffix: z.string().max(48) });
const noteSchema = z.object({ id: z.string().min(1).max(200), source: sourceSchema.nullable(), body: z.string().max(20000), anchor: anchorSchema.nullable(), createdAt: z.iso.datetime({ offset: true }), updatedAt: z.iso.datetime({ offset: true }) }).refine(note => !note.anchor || !!note.source);
export type NoteSource = z.infer<typeof sourceSchema>;
export type NoteAnchor = z.infer<typeof anchorSchema>;
export type ReadingNote = z.infer<typeof noteSchema>;

export function parseNotesBackup(text: string): ReadingNote[] {
  const data = JSON.parse(text);
  // Import the confirmed prototype's backups without importing its demo flag.
  if (data && Array.isArray(data.notes)) data.notes = data.notes.map((note: Record<string, unknown>) => {
    if (note && typeof note.source === "string" && /^[a-z0-9-]+$/.test(note.source)) return { ...note, source: { path: `/terms/${note.source}`, title: note.source === "agent-harness" ? "Harness" : note.source } };
    return note;
  });
  const result = z.object({ version: z.literal(1), notes: z.array(noteSchema).max(10000) }).safeParse(data);
  if (!result.success) throw new Error("备份格式不正确，已有笔记未改动。");
  return result.data.notes;
}

export function mergeNotes(existing: ReadingNote[], incoming: ReadingNote[], uuid: () => string): ReadingNote[] {
  const result = [...existing], ids = new Set(existing.map(note => note.id));
  const fingerprint = (note: ReadingNote) => JSON.stringify([note.source?.path, note.body, note.anchor]);
  const known = new Set(existing.map(fingerprint));
  for (const note of incoming) {
    const key = fingerprint(note);
    if (known.has(key)) continue;
    const copy = { ...note, id: ids.has(note.id) ? uuid() : note.id };
    ids.add(copy.id); known.add(key); result.push(copy);
  }
  return result;
}

export function locateQuote(text: string, anchor: NoteAnchor): number {
  const positions: number[] = [];
  let from = 0;
  while (from <= text.length) {
    const index = text.indexOf(anchor.exact, from);
    if (index < 0) break;
    positions.push(index); from = index + 1;
  }
  if (positions.length === 1) return positions[0];
  const contextual = positions.filter(index => text.slice(Math.max(0, index - anchor.prefix.length), index) === anchor.prefix && text.slice(index + anchor.exact.length, index + anchor.exact.length + anchor.suffix.length) === anchor.suffix);
  return contextual.length === 1 ? contextual[0] : -1;
}
