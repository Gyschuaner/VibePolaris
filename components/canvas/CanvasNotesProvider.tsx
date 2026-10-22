import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { NotesProvider, type NotesStorage } from "@/components/notes/NotesProvider";
import { mergeNotes, type NoteSource, type ReadingNote } from "@/lib/reading-notes";
import type { CanvasData } from "@/lib/canvas";
import type { DocumentVariant } from "@/lib/canvas-ai";

export function CanvasNotesProvider({ children, data, nodeId, variant, source, storageKey, update, flush, hasPending, description }: {
  children: ReactNode; data: CanvasData; nodeId: string; variant: DocumentVariant; source: NoteSource; storageKey: string;
  update: (change: (data: CanvasData) => CanvasData) => void; flush: () => Promise<void>; hasPending: () => boolean; description: string;
}) {
  const current = useRef({ data, source, hasPending });
  useLayoutEffect(() => { current.current = { data, source, hasPending }; });
  const storage = useMemo<NotesStorage>(() => {
    const localize = (notes: ReadingNote[]) => notes.map(note => ({ ...note, source: current.current.source }));
    const read = async () => localize(current.current.data.nodes.find(node => node.id === nodeId)?.annotations?.[variant] ?? []);
    async function change(apply: (notes: ReadingNote[]) => ReadingNote[]) {
      let found = false, saved: ReadingNote[] = [];
      update(value => ({ ...value, nodes: value.nodes.map(node => {
        if (node.id !== nodeId) return node;
        found = true; saved = apply(localize(node.annotations?.[variant] ?? []));
        return { ...node, annotations: { ...node.annotations, [variant]: saved }, updatedAt: new Date().toISOString() };
      }) }));
      if (!found) throw new Error("这份正文已不在当前画布中。");
      await flush();
      if (current.current.hasPending()) throw new Error("批注尚未保存，请重试。");
      return saved;
    }
    return {
      read,
      write: async note => { await change(notes => [...notes.filter(item => item.id !== note.id), { ...note, source: current.current.source }]); },
      remove: async id => { await change(notes => notes.filter(note => note.id !== id)); },
      import: incoming => change(notes => mergeNotes(notes, localize(incoming), () => crypto.randomUUID())),
    };
  }, [nodeId, variant, update, flush]);
  return <NotesProvider storage={storage} revision={data.revision} id={`canvas-notes:${storageKey}:${nodeId}:${variant}`} title="本文笔记" description={description}>{children}</NotesProvider>;
}
