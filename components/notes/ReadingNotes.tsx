"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowSquareOut, Highlighter, NotePencil, Plus, Trash, X } from "@phosphor-icons/react";
import type { NoteAnchor, NoteSource, ReadingNote } from "@/lib/reading-notes";
import { captureNoteSelection, prepareBlocks, rangeForAnchor } from "@/lib/reading-note-anchors";
import { NoteEditor, NoteTime, useNotes } from "./NotesProvider";
import styles from "./ReadingNotes.module.css";

type ReaderContextValue = {
  notes: ReadingNote[]; selected: string | null; missing: string[]; tab: "toc" | "notes"; panel: boolean;
  setTab: (tab: "toc" | "notes") => void; setPanel: (open: boolean) => void;
  activate: (note: ReadingNote) => void; goTo: (note: ReadingNote) => void; quickNote: () => void;
};
const ReaderContext = createContext<ReaderContextValue | null>(null);
const desktop = "(min-width: 1101px)";

export function ReadingNotes({ path, title, layout = "concept", children }: { path: string; title: string; layout?: "concept" | "course" | "standalone"; children: ReactNode }) {
  const store = useNotes(), root = useRef<HTMLDivElement>(null);
  const source: NoteSource = useMemo(() => ({ path, title }), [path, title]);
  const notes = useMemo(() => store.notes.filter(note => note.source?.path === path && note.anchor), [store.notes, path]);
  const revealed = useRef("");
  const [selected, setSelected] = useState<string | null>(null), [missing, setMissing] = useState<string[]>([]);
  const [tab, setTab] = useState<"toc" | "notes">("toc"), [panel, setPanel] = useState(false);
  const [selection, setSelection] = useState<{ anchor: NoteAnchor; rect: DOMRect } | null>(null);
  const activate = useCallback((note: ReadingNote) => { setSelected(note.id); setTab("notes"); setPanel(true); }, []);
  const goTo = useCallback((note: ReadingNote) => {
    if (!root.current || !note.anchor) return;
    const range = rangeForAnchor(root.current, note.anchor);
    if (!range) { store.open(note.id); store.notify("原文位置已变化，摘录和笔记仍保留。"); return; }
    let ancestor = range.startContainer.parentElement;
    while (ancestor && root.current.contains(ancestor)) { if (ancestor instanceof HTMLDetailsElement) ancestor.open = true; ancestor = ancestor.parentElement; }
    activate(note);
    requestAnimationFrame(() => {
      const rect = range.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - window.innerHeight * .34, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
  }, [activate, store.open, store.notify]);
  const quickNote = useCallback(() => { const note = store.add(source); if (note) store.open(note.id); }, [store.add, store.open, source]);
  const add = useCallback((anchor: NoteAnchor, write = true) => {
    const note = store.add(source, anchor);
    if (note) { if (write) activate(note); else { setTab("notes"); store.notify("已添加划线"); } }
    setSelection(null); window.getSelection()?.removeAllRanges();
  }, [activate, source, store.add, store.notify]);

  useEffect(() => {
    const reveal = (force = false) => {
      if (!location.hash.startsWith("#note-") || (!force && revealed.current === location.hash)) return;
      let id: string;
      try { id = decodeURIComponent(location.hash.slice(6)); } catch { return; }
      const note = notes.find(note => note.id === id);
      if (note) { revealed.current = location.hash; goTo(note); }
    };
    const changed = () => reveal(true);
    reveal(); window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, [notes, goTo]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const read = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!root.current) return;
        const captured = captureNoteSelection(root.current);
        if (captured && "error" in captured) { store.notify(captured.error); setSelection(null); }
        else if (captured) setSelection(captured);
        else if (!document.activeElement?.closest('[data-selection-toolbar]')) setSelection(null);
      }, 80);
    };
    const hide = () => setSelection(null);
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelection(null); setPanel(false); }
      if (event.altKey && event.key.toLowerCase() === "n" && !event.repeat && !document.querySelector("dialog[open]")) {
        event.preventDefault(); const captured = root.current && captureNoteSelection(root.current);
        if (captured && "anchor" in captured) add(captured.anchor); else quickNote();
      }
    };
    document.addEventListener("selectionchange", read); window.addEventListener("scroll", hide, { passive: true }); window.addEventListener("resize", hide); window.addEventListener("keydown", keydown);
    return () => { clearTimeout(timer); document.removeEventListener("selectionchange", read); window.removeEventListener("scroll", hide); window.removeEventListener("resize", hide); window.removeEventListener("keydown", keydown); };
  }, [add, quickNote, store.notify]);

  useLayoutEffect(() => {
    const article = root.current;
    if (!article) return;
    let frame = 0, disposed = false;
    const update = () => {
      if (disposed) return;
      prepareBlocks(article);
      const ranges = new Map<string, Range>(), absent: string[] = [];
      notes.forEach(note => { const range = rangeForAnchor(article, note.anchor!); if (range) ranges.set(note.id, range); else absent.push(note.id); });
      setMissing(old => old.join("|") === absent.join("|") ? old : absent);
      if ("highlights" in CSS && typeof Highlight !== "undefined") {
        CSS.highlights.set("vp-reading-notes", new Highlight(...ranges.values()));
        CSS.highlights.set("vp-reading-active", new Highlight(...(selected && ranges.has(selected) ? [ranges.get(selected)!] : [])));
      }
      const links = article.querySelector<SVGSVGElement>("[data-note-links]");
      links?.querySelectorAll<SVGGElement>("g").forEach(link => { link.style.display = "none"; });
      const canvas = article.querySelector<HTMLElement>("[data-note-canvas]");
      if (!canvas) return;
      const cards = [...canvas.querySelectorAll<HTMLElement>("[data-note-id]")];
      if (!matchMedia(desktop).matches) { canvas.style.minHeight = ""; cards.forEach(card => {card.style.top = "";card.hidden = absent.includes(card.dataset.noteId!);}); return; }
      const base = canvas.getBoundingClientRect().top;
      const placed = cards.flatMap(card => {
        const range = ranges.get(card.dataset.noteId!), target = range && [...range.getClientRects()].find(rect => rect.width > 0 && rect.height > 0);
        card.hidden = !target;
        const body = card.querySelector<HTMLElement>("[data-note-body]");
        if (!target || !body) return [];
        let inset: number;
        if (body instanceof HTMLTextAreaElement) { const css = getComputedStyle(body); inset = body.getBoundingClientRect().top - card.getBoundingClientRect().top + Math.max(0, (parseFloat(css.lineHeight) - parseFloat(css.fontSize) * 1.2) / 2); }
        else { const text = document.createRange();text.selectNodeContents(body);inset=(text.getClientRects()[0]?.top ?? body.getBoundingClientRect().top)-card.getBoundingClientRect().top; }
        return [{card, range: range!, body, inset, y: target.top - base, desired: target.top - base - inset, x: target.left}];
      }).sort((a,b) => a.y-b.y || a.x-b.x);
      let bottom = -44;
      const origin = article.getBoundingClientRect();
      for (const {card,range,body,inset,desired} of placed) {
        const top = Math.max(36, desired, bottom + 44);
        card.style.top = `${top}px`;
        bottom = top + card.offsetHeight;
        const link = [...(links?.querySelectorAll<SVGGElement>("g") ?? [])].find(item => item.dataset.connectorId === card.dataset.noteId);
        if (!link) continue;
        const rects = [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0), first = rects[0];
        const line = rects.filter(rect => Math.abs(rect.top-first.top) < Math.max(4,first.height/4));
        const right = Math.max(...line.map(rect => rect.right)), lineBottom = Math.max(...line.map(rect => rect.bottom));
        const block = range.startContainer.parentElement?.closest<HTMLElement>("[data-note-block]");
        const blockRight = block?.getBoundingClientRect().right ?? right;
        const x1 = right + 4 - origin.left;
        // Leave a partial line through its lower edge so the dash does not cross the following words.
        const y1 = (blockRight-right > 32 ? lineBottom+5 : (first.top+lineBottom)/2) - origin.top;
        const x2 = body.getBoundingClientRect().left - 10 - origin.left;
        const textHeight = body instanceof HTMLTextAreaElement ? parseFloat(getComputedStyle(body).fontSize)*1.2 : first.height;
        const y2 = card.getBoundingClientRect().top + inset + textHeight/2 - origin.top;
        const bend = Math.max(x1, Math.min(blockRight+18-origin.left,x2-28));
        link.querySelector("path")?.setAttribute("d", `M ${x1} ${y1} H ${bend} C ${bend+18} ${y1}, ${x2-22} ${y2}, ${x2} ${y2}`);
        link.querySelectorAll("circle").forEach((dot,index) => {dot.setAttribute("cx",String(index ? x2 : x1));dot.setAttribute("cy",String(index ? y2 : y1));});
        link.style.display = "";
      }
      canvas.style.minHeight = `${Math.max(bottom+20, 100)}px`;
    };
    const schedule = () => { cancelAnimationFrame(frame); frame=requestAnimationFrame(update); };
    update();
    const resize = new ResizeObserver(schedule); resize.observe(article);
    article.querySelectorAll<HTMLElement>("[data-note-id]").forEach(card => resize.observe(card));
    const changes = new MutationObserver(records => { if (records.some(record => !(record.target instanceof Element ? record.target : record.target.parentElement)?.closest("[data-note-ui]"))) schedule(); });
    changes.observe(article, {subtree:true,childList:true,characterData:true});
    article.addEventListener("toggle",schedule,true); window.addEventListener("resize",schedule); void document.fonts.ready.then(schedule);
    return () => { disposed=true;cancelAnimationFrame(frame);resize.disconnect();changes.disconnect();article.removeEventListener("toggle",schedule,true);window.removeEventListener("resize",schedule);if("highlights" in CSS){CSS.highlights.delete("vp-reading-notes");CSS.highlights.delete("vp-reading-active");} };
  }, [notes, selected, tab, panel]);

  function clickHighlight(event: React.MouseEvent) {
    if (!root.current || window.getSelection()?.toString() || (event.target as Element).closest("[data-note-ui]")) return;
    const found = notes.find(note => { const range=rangeForAnchor(root.current!,note.anchor!);return range && [...range.getClientRects()].some(rect=>event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom); });
    if (found) activate(found);
  }
  return <ReaderContext.Provider value={{notes,selected,missing,tab,panel,setTab,setPanel,activate,goTo,quickNote}}><div ref={root} className={`${styles.scope} ${layout === "standalone" ? styles.standalone : ""}`} data-reader-layout={layout} onClick={clickHighlight}>
    <style>{`::highlight(vp-reading-notes){background:color-mix(in srgb,var(--accent) 23%,var(--bg));color:var(--ink)}::highlight(vp-reading-active){background:color-mix(in srgb,var(--accent) 34%,var(--bg));color:var(--ink)}`}</style>
    {children}{layout === "standalone" && <ArticleNotesRail/>}
    <svg className={styles.connectors} data-note-links data-note-ui aria-hidden="true">{notes.map(note=><g key={note.id} data-connector-id={note.id} data-active={selected === note.id}><path/><circle r="2"/><circle r="2"/></g>)}</svg>
    <button data-note-ui className={styles.mobileToggle} onClick={()=>{setPanel(true);setTab("notes");}} aria-keyshortcuts="Alt+N"><NotePencil size={20}/>笔记{notes.length ? ` ${notes.length}` : ""}</button>
    {selection && <div className={styles.selection} data-note-ui data-selection-toolbar role="toolbar" aria-label="选中文字操作" style={{left:Math.max(12,Math.min(window.innerWidth-230,selection.rect.right-220)),top:Math.max(78,selection.rect.top-58)}} onPointerDown={event=>event.preventDefault()}><button disabled={!store.ready} onClick={()=>add(selection.anchor,false)}><Highlighter size={18}/>划线</button><button disabled={!store.ready} onClick={()=>add(selection.anchor)} title="写笔记（Alt+N）"><NotePencil size={18}/>写笔记</button></div>}
  </div></ReaderContext.Provider>;
}

export function ArticleNotesRail({ children }: { children?: ReactNode }) {
  const reader = useContext(ReaderContext), store = useNotes();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = matchMedia(desktop), update = () => setMobile(!media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  if (!reader) return children;
  const {notes, selected, missing, tab, panel, setTab, setPanel, activate, goTo, quickNote} = reader;
  const rail = <aside data-note-ui className={`${styles.rail} ${panel && tab === "notes" ? styles.panelOpen : ""}`} aria-label="阅读侧栏">
    <div className={styles.railHead}><div role="tablist" aria-label="阅读侧栏">{children && <button role="tab" aria-selected={tab === "toc"} onClick={()=>setTab("toc")}>目录</button>}<button role="tab" aria-selected={tab === "notes" || !children} onClick={()=>{setTab("notes");setPanel(true);}}>批注</button></div><button onClick={quickNote} disabled={!store.ready}><Plus size={17}/>记一条</button><button className={styles.closePanel} aria-label="收起笔记" onClick={()=>setPanel(false)}><X size={21}/></button></div>
    {store.storageError && <p className={styles.error}>本地存储暂不可用。<button onClick={store.reload}>重试</button></p>}
    {tab === "toc" && children ? <div className={styles.directory}>{children}</div> : <><div data-note-canvas className={styles.canvas} role="tabpanel" aria-label="批注">{notes.map(note=><section className={`${styles.note} ${selected === note.id ? styles.active : ""}`} data-note-id={note.id} key={note.id} hidden={missing.includes(note.id)}>
      <div className={styles.noteHead}><button onClick={()=>activate(note)} aria-label={`编辑笔记：${note.body.slice(0,18)||"划线摘录"}`} title="编辑笔记"><NotePencil size={21}/></button><div className={styles.noteActions}><button onClick={()=>goTo(note)} aria-label="回到这条笔记的原文" title="回到原文"><ArrowSquareOut size={17}/></button><button onClick={()=>store.remove(note)} aria-label="删除这条笔记" title="删除笔记"><Trash size={17}/></button></div></div>
      {selected === note.id ? <NoteEditor note={note} autoFocus/> : <button className={styles.noteText} onClick={()=>goTo(note)}><span data-note-body>{note.body || note.anchor!.exact}</span></button>}
      <footer><NoteTime value={note.updatedAt}/></footer>
    </section>)}{!notes.length && <p className={styles.empty}>{store.ready ? "选中一句话，留下你的想法。" : "正在读取本地笔记…"}</p>}</div>{missing.length>0&&<button className={styles.missing} onClick={()=>store.open(missing[0])}>有 {missing.length} 条原文位置已变化，查看保留的摘录</button>}</>}
    <div className={styles.railFoot}><span>仅保存在此浏览器</span><button onClick={()=>store.open()}>全部笔记 ↗</button></div>
  </aside>;
  // Keep the mobile sheet outside article animations that create fixed-position containing blocks.
  return mobile && panel && tab === "notes" ? createPortal(rail, document.body) : rail;
}
