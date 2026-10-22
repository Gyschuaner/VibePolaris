import { z } from "zod";
import { mergeNotes, noteSchema, type ReadingNote } from "./reading-notes.ts";
import { sameValue } from "./canvas-sync.ts";

export const notesSnapshotSchema = z.object({ revision: z.number().int().nonnegative(), notes: z.array(noteSchema).max(10000) })
  .refine(value => new Set(value.notes.map(note => note.id)).size === value.notes.length);
export type NotesSnapshot = z.infer<typeof notesSnapshotSchema>;
export const emptyNotesSnapshot = (): NotesSnapshot => ({ revision: 0, notes: [] });

export function mergeReadingNotes(base: ReadingNote[], local: ReadingNote[], remote: ReadingNote[], uuid: () => string) {
  const before = new Map(base.map(note => [note.id, note])), here = new Map(local.map(note => [note.id, note])), there = new Map(remote.map(note => [note.id, note]));
  let conflicts = 0;
  const notes = [...new Set([...there.keys(), ...here.keys(), ...before.keys()])].flatMap(id => {
    const b = before.get(id), l = here.get(id), r = there.get(id);
    if (sameValue(l, b)) return r ? [r] : [];
    if (sameValue(r, b) || sameValue(l, r)) return l ? [l] : [];
    conflicts++;
    // Deleting on one device must not erase a concurrent edit on another.
    return l && r ? [r, { ...l, id: uuid() }] : l ? [l] : r ? [r] : [];
  });
  return { notes: mergeNotes([], notes, uuid), conflicts };
}
