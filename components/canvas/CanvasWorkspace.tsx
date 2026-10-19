"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckSquare, Circle, Copy, DotsThree, DownloadSimple, ImageSquare, Info, LinkSimple, Minus, NotePencil, Plus, Trash, UploadSimple, X } from "@phosphor-icons/react";
import { SiteHeader } from "@/components/SiteHeader";
import { availablePosition, connectNodes, exportNodeMarkdown, importNodeMarkdown, markdownFileName, moveView, nodeKinds, nodePreview, nodeResource, nodeTasks, safeNodeUrl, type CanvasEdge, type CanvasNode, type CanvasView, type NodeKind } from "@/lib/canvas";
import { connectionPath } from "@/lib/canvas-routing";
import { MarkdownDocument } from "./MarkdownDocument";
import { MarkdownEditor } from "./MarkdownEditor";
import { NodeCard } from "./NodeCard";
import { useCanvas } from "./useCanvas";
import { useCanvasMotion } from "./useCanvasMotion";
import styles from "./CanvasWorkspace.module.css";

type Point = { x: number; y: number };
type Gesture = { pointerId: number; start: Point; moved: boolean } & (
  { kind: "pan"; view: CanvasView } | { kind: "node"; node: CanvasNode; scale: number } | { kind: "link"; from: string }
);
type Removed = { nodes: CanvasNode[]; edges: CanvasEdge[] };
const anchor = (node: CanvasNode): Point => ({ x: node.x + 12, y: node.y + 17 });
const fullDate = (value: string) => new Date(value).toLocaleString("zh-CN", { hourCycle: "h23" });
const kindIcons = { note: NotePencil, link: LinkSimple, image: ImageSquare, todo: CheckSquare };
type ContextMenu = { x: number; y: number } & ({ kind: "create"; at?: Point } | { kind: "node"; id: string });

export function CanvasWorkspace() {
  const router = useRouter(), search = useSearchParams();
  const { data, ready, status, error, update, flush, reload, hasPending, isConflict } = useCanvas();
  const documentId = search.get("note"), editing = search.get("edit") === "1";
  const [selected, setSelected] = useState<string | null>(null), [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ from: string; point: Point } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 }), [importing, setImporting] = useState(false);
  const [labelSizes, setLabelSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [toast, setToast] = useState<{ message: string; undo?: Removed } | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [previewHeight, setPreviewHeight] = useState(265);
  const surface = useRef<HTMLElement>(null), input = useRef<HTMLInputElement>(null), info = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null), menuAnchor = useRef<HTMLElement | null>(null);
  const gesture = useRef<Gesture | null>(null), skipClick = useRef(false);
  const active = data.nodes.find(node => node.id === documentId), picked = data.nodes.find(node => node.id === selected);
  const current = documentId ? active : picked;
  const navigate = useCanvasMotion(documentId, active && nodePreview(active).title, previewRef, documentRef);
  const edge = data.edges.find(item => item.id === selectedEdge);
  const nodeIds = data.nodes.map(node => node.id).join("\0");
  const labels = useMemo(() => data.nodes.map(node => ({ x: node.x + 24, y: node.y, ...(labelSizes[node.id] ?? { width: 275, height: 82 }) })), [data.nodes, labelSizes]);
  const paths = useMemo(() => new Map(data.edges.map(item => {
    const from = data.nodes.find(node => node.id === item.from), to = data.nodes.find(node => node.id === item.to);
    return [item.id, from && to ? connectionPath(anchor(from), anchor(to), labels) : ""];
  })), [data.edges, data.nodes, labels]);

  useLayoutEffect(() => {
    if (!surface.current || documentId) return;
    const observer = new ResizeObserver(entries => setLabelSizes(previous => {
      const next = { ...previous };
      let changed = false;
      for (const entry of entries) {
        const element = entry.target as HTMLElement, id = element.dataset.canvasLabel!;
        const width = element.offsetWidth, height = element.offsetHeight;
        if (previous[id]?.width !== width || previous[id]?.height !== height) { next[id] = { width, height }; changed = true; }
      }
      return changed ? next : previous;
    }));
    surface.current.querySelectorAll("[data-canvas-label]").forEach(element => observer.observe(element, { box: "border-box" }));
    return () => observer.disconnect();
  }, [documentId, ready, nodeIds]);

  useEffect(() => {
    if (!surface.current || documentId) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(surface.current);
    return () => observer.disconnect();
  }, [documentId, ready]);
  useEffect(() => {
    const element = surface.current;
    if (!element || documentId) return;
    const preventPageZoom = (event: WheelEvent) => { if (!(event.target as Element).closest("[data-canvas-ui]")) event.preventDefault(); };
    element.addEventListener("wheel", preventPageZoom, { passive: false });
    return () => element.removeEventListener("wheel", preventPageZoom);
  }, [documentId]);
  useEffect(() => {
    if (!toast || toast.undo) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (contextMenu) { setContextMenu(null); (menuAnchor.current ?? surface.current)?.focus({ preventScroll: true }); return; }
      if (!documentId) { setConnecting(null); setSelected(null); setSelectedEdge(null); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [documentId, contextMenu]);
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!contextMenu || !menu) return;
    const bounds = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(8, Math.min(contextMenu.x, window.innerWidth - bounds.width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(contextMenu.y, window.innerHeight - bounds.height - 8))}px`;
    menu.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  }, [contextMenu]);
  useLayoutEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    const measure = () => setPreviewHeight(element.offsetHeight);
    const observer = new ResizeObserver(measure);
    measure(); observer.observe(element);
    return () => observer.disconnect();
  }, [picked?.id, documentId]);

  function localPoint(clientX: number, clientY: number) {
    const bounds = surface.current?.getBoundingClientRect();
    return { x: clientX - (bounds?.left ?? 0), y: clientY - (bounds?.top ?? 0) };
  }
  function worldPoint(point: Point) { return { x: (point.x - data.view.x) / data.view.scale, y: (point.y - data.view.y) / data.view.scale }; }
  function openNote(node: CanvasNode, edit = false) {
    void flush(); setSelected(node.id); setConnecting(null);
    navigate(node.id, () => router.push(`/canvas?note=${encodeURIComponent(node.id)}${edit ? "&edit=1" : ""}`, { scroll: false }));
  }
  function returnToCanvas(animate = true) {
    void flush();
    if (active && animate) setSelected(active.id);
    navigate(null, () => router.push("/canvas", { scroll: false }), !!active && animate);
  }
  function toggleEditing() {
    if (!active) return;
    void flush(); router.replace(`/canvas?note=${encodeURIComponent(active.id)}${editing ? "" : "&edit=1"}`, { scroll: false });
  }
  function createNode(kind: NodeKind = "note", at?: Point) {
    if (!ready) return;
    const point = at ?? availablePosition(data.nodes, worldPoint({ x: size.width * .45, y: size.height * .4 }), 3, kind === "image" ? 260 : 150);
    const now = new Date().toISOString();
    const node: CanvasNode = { id: crypto.randomUUID(), kind, markdown: "", fileName: "", x: point.x, y: point.y, createdAt: now, updatedAt: now };
    update(value => ({ ...value, nodes: [...value.nodes, node] }), true);
    setContextMenu(null); setConnecting(null); setSelectedEdge(null); setSelected(node.id);
  }
  function changeNode(node: CanvasNode, patch: Partial<CanvasNode>) {
    update(value => ({ ...value, nodes: value.nodes.map(item => item.id === node.id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item) }));
  }
  function showContext(event: React.MouseEvent<HTMLElement>) {
    if (!ready || (event.target as Element).closest("[data-canvas-ui]")) return;
    event.preventDefault(); menuAnchor.current = (event.target as HTMLElement).closest("button") ?? surface.current; setConnecting(null); setSelectedEdge(null);
    const id = (event.target as Element).closest<HTMLElement>("[data-canvas-node]")?.dataset.canvasNode;
    const bounds = (event.target as Element).getBoundingClientRect();
    const x = event.clientX || bounds.left + 20, y = event.clientY || bounds.top + 20;
    if (id) { setSelected(id); setContextMenu({ kind: "node", id, x, y }); }
    else { setSelected(null); setContextMenu({ kind: "create", at: worldPoint(localPoint(x, y)), x, y }); }
  }
  function linkNodes(from: string, to: string) {
    update(value => connectNodes(value, from, to), true);
    setConnecting(null); setSelectedEdge(null);
  }
  function selectNode(node: CanvasNode) {
    if (skipClick.current) { skipClick.current = false; return; }
    if (connecting) { if (connecting.from !== node.id) linkNodes(connecting.from, node.id); return; }
    setSelected(node.id); setSelectedEdge(null);
  }
  function beginNode(event: ReactPointerEvent, node: CanvasNode) {
    if (event.button !== 0 || connecting) return;
    event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { kind: "node", node, scale: data.view.scale, pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, moved: false };
  }
  function beginLink(event: ReactPointerEvent, node: CanvasNode) {
    if (event.button !== 0) return;
    event.stopPropagation(); event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { kind: "link", from: node.id, pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, moved: false };
    setSelected(null); setSelectedEdge(null); setConnecting({ from: node.id, point: anchor(node) });
  }
  function beginPan(event: ReactPointerEvent) {
    if (event.button !== 0 || !ready || (event.target as Element).closest("button, a, [data-canvas-edge], [data-canvas-ui]")) return;
    setContextMenu(null);
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { kind: "pan", pointerId: event.pointerId, view: data.view, start: { x: event.clientX, y: event.clientY }, moved: false };
  }
  function movePointer(event: ReactPointerEvent) {
    const moving = gesture.current;
    if (connecting && (!moving || moving.kind === "link")) setConnecting({ from: connecting.from, point: worldPoint(localPoint(event.clientX, event.clientY)) });
    if (!moving || moving.pointerId !== event.pointerId) return;
    const dx = event.clientX - moving.start.x, dy = event.clientY - moving.start.y;
    if (Math.hypot(dx, dy) > 4) moving.moved = true;
    if (!moving.moved) return;
    if (moving.kind === "pan") update(value => ({ ...value, view: { ...moving.view, x: moving.view.x + dx, y: moving.view.y + dy } }));
    if (moving.kind === "node") update(value => ({ ...value, nodes: value.nodes.map(node => node.id === moving.node.id ? { ...node, x: moving.node.x + dx / moving.scale, y: moving.node.y + dy / moving.scale } : node) }));
  }
  function finishPointer(event: ReactPointerEvent) {
    const moving = gesture.current;
    if (!moving || moving.pointerId !== event.pointerId) return;
    gesture.current = null;
    if (moving.kind === "link" && moving.moved) {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-canvas-node]")?.dataset.canvasNode;
      if (target && target !== moving.from) linkNodes(moving.from, target); else setConnecting(null);
    }
    if (moving.kind === "node") skipClick.current = moving.moved;
    if (moving.kind === "pan" && !moving.moved) { setSelected(null); setSelectedEdge(null); setConnecting(null); }
    void flush();
  }
  function zoom(scale: number, point = { x: size.width / 2, y: size.height / 2 }) {
    update(value => ({ ...value, view: moveView(value.view, scale, point.x, point.y) }));
  }
  function fit() {
    if (!data.nodes.length) { update(value => ({ ...value, view: { x: 0, y: 0, scale: 1 } })); return; }
    const minX = Math.min(...data.nodes.map(node => node.x)), maxX = Math.max(...data.nodes.map(node => node.x + 24 + (labelSizes[node.id]?.width ?? 280)));
    const minY = Math.min(...data.nodes.map(node => node.y)), maxY = Math.max(...data.nodes.map(node => node.y + (labelSizes[node.id]?.height ?? (node.kind === "image" ? 260 : 95))));
    const scale = Math.max(.3, Math.min(1, (size.width - 96) / (maxX - minX), (size.height - 96) / (maxY - minY)));
    update(value => ({ ...value, view: { scale, x: (size.width - (maxX - minX) * scale) / 2 - minX * scale, y: (size.height - (maxY - minY) * scale) / 2 - minY * scale } }));
  }
  function removeNode(node: CanvasNode) {
    const related = data.edges.filter(item => item.from === node.id || item.to === node.id);
    update(value => ({ ...value, nodes: value.nodes.filter(item => item.id !== node.id), edges: value.edges.filter(item => item.from !== node.id && item.to !== node.id) }), true);
    setSelected(null); info.current?.close();
    setToast({ message: "节点已删除", undo: { nodes: [node], edges: related } });
    if (documentId) returnToCanvas(false);
  }
  function removeEdge(item: CanvasEdge) {
    update(value => ({ ...value, edges: value.edges.filter(current => current.id !== item.id) }), true);
    setSelectedEdge(null); setToast({ message: "连线已删除", undo: { nodes: [], edges: [item] } });
  }
  function undo() {
    const removed = toast?.undo;
    if (!removed) return;
    update(value => {
      const nodes = [...value.nodes, ...removed.nodes.filter(node => !value.nodes.some(item => item.id === node.id))];
      const ids = new Set(nodes.map(node => node.id));
      return { ...value, nodes, edges: [...value.edges, ...removed.edges.filter(item => !value.edges.some(edge => edge.id === item.id || (edge.from === item.from && edge.to === item.to) || (edge.from === item.to && edge.to === item.from)) && ids.has(item.from) && ids.has(item.to))] };
    }, true);
    setToast({ message: "已恢复" });
  }
  function exportNote(node: CanvasNode) {
    const url = URL.createObjectURL(new Blob([exportNodeMarkdown(node)], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = markdownFileName(node);
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast({ message: "已导出 .md" });
  }
  async function copyNote(node: CanvasNode) {
    try {
      try { await navigator.clipboard.writeText(exportNodeMarkdown(node)); }
      catch {
        const field = document.createElement("textarea"); field.value = exportNodeMarkdown(node); field.style.cssText = "position:fixed;left:-9999px";
        document.body.append(field); field.select(); const copied = document.execCommand("copy"); field.remove();
        if (!copied) throw new Error("copy");
      }
      setToast({ message: "已复制 Markdown" });
    } catch { setToast({ message: "复制未成功，请在编辑页选中正文后复制。" }); }
  }
  async function importFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []); event.target.value = "";
    if (!files.length || !ready) return;
    setImporting(true);
    try {
      const nodes: CanvasNode[] = [], now = new Date().toISOString();
      const center = worldPoint({ x: size.width * .35, y: size.height * .3 });
      for (const file of files) {
        if (!/\.(md|markdown)$/i.test(file.name)) throw new Error("请选择 .md 或 .markdown 文件，已有节点未改动。");
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} 超过 10 MB，已有节点未改动。`);
        let markdown: string;
        try { markdown = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer()); }
        catch { throw new Error(`${file.name} 不是 UTF-8 文本，请转换编码后重试。`); }
        const content = importNodeMarkdown(markdown);
        const point = availablePosition([...data.nodes, ...nodes], center, Math.max(1, Math.min(3, Math.floor(size.width / (330 * data.view.scale)))), content.kind === "image" ? 260 : 150);
        nodes.push({ id: crypto.randomUUID(), ...content, fileName: file.name, ...point, createdAt: now, updatedAt: now });
      }
      update(value => ({ ...value, nodes: [...value.nodes, ...nodes] }), true);
      setSelected(nodes[0].id); setToast({ message: `已导入 ${nodes.length} 份 Markdown，已有节点已保留。` });
    } catch (cause) { setToast({ message: cause instanceof Error ? cause.message : "导入失败，已有节点未改动。" }); }
    finally { setImporting(false); }
  }
  function actionItems(node: CanvasNode) {
    const close = (event: React.MouseEvent) => { event.currentTarget.closest("details")?.removeAttribute("open"); setContextMenu(null); };
    return <>
        {!documentId && <button role="menuitem" onClick={event => { close(event); openNote(node); }}><NotePencil size={17} />打开 Markdown</button>}
        {!documentId && <button role="menuitem" onClick={event => { close(event); setSelected(node.id); requestAnimationFrame(() => surface.current?.querySelector<HTMLInputElement>("input[aria-label='节点标题']")?.focus()); }}><NotePencil size={17} />编辑标题与摘要</button>}
        <button role="menuitem" onClick={event => { close(event); void copyNote(node); }}><Copy size={17} />复制 Markdown</button>
        <button role="menuitem" onClick={event => { close(event); exportNote(node); }}><DownloadSimple size={17} />导出 .md</button>
        {!documentId && <button role="menuitem" onClick={event => { close(event); setConnecting({ from: node.id, point: anchor(node) }); setSelected(null); }}><LinkSimple size={17} />连接节点</button>}
        <button role="menuitem" onClick={event => { close(event); info.current?.showModal(); }}><Info size={17} />节点信息</button>
        <button role="menuitem" onClick={event => { close(event); removeNode(node); }}><Trash size={17} />删除节点</button>
    </>;
  }
  function actions(node: CanvasNode) {
    return <button className={styles.icon} aria-label="节点操作" aria-haspopup="menu" data-canvas-ui onClick={event => { menuAnchor.current = event.currentTarget; const bounds = event.currentTarget.getBoundingClientRect(); setContextMenu({ kind: "node", id: node.id, x: bounds.right - 210, y: bounds.bottom + 6 }); }}><DotsThree size={23} /></button>;
  }

  const previewPosition = picked && {
    left: Math.max(12, Math.min(size.width - Math.min(320, size.width - 24) - 12, data.view.x + picked.x * data.view.scale + 22)),
    top: Math.max(12, Math.min(size.height - previewHeight - 12, data.view.y + picked.y * data.view.scale + 48)),
  };
  const source = connecting && data.nodes.find(node => node.id === connecting.from);
  const edgeFrom = edge && data.nodes.find(node => node.id === edge.from), edgeTo = edge && data.nodes.find(node => node.id === edge.to);

  return <div className={styles.workspace} data-pointer-native onPointerDownCapture={event => {
    event.currentTarget.querySelectorAll("details[open]").forEach(item => { if (!item.contains(event.target as Node)) item.removeAttribute("open"); });
    if (contextMenu && !menuRef.current?.contains(event.target as Node)) setContextMenu(null);
  }}>
    {!documentId && <SiteHeader wide active="canvas" />}
    {error && <div className={styles.error} role="alert"><span>{error}</span>{isConflict() || !ready ? <button onClick={() => { if (!hasPending() || window.confirm("重新载入会放弃当前未保存的修改。请确认需要的 Markdown 已经导出。")) void reload(true); }}>重新载入</button> : <button onClick={() => void flush()}>重试保存</button>}</div>}
    {documentId ? <div ref={documentRef} className={styles.documentPage} data-canvas-paper>
      <header className={styles.documentBar} data-canvas-bar>
        <button className={styles.back} onClick={() => returnToCanvas()}><ArrowLeft size={18} /><span>返回画布</span></button>
        <span className={styles.fileName}>{active ? markdownFileName(active) : "Markdown"}</span>
        <div className={styles.documentActions}>{active && <>{editing && <span className={styles.saveStatus} role="status">{status === "saved" ? "已保存" : status === "saving" ? "保存中…" : "未保存"}</span>}<button className={styles.mode} onClick={toggleEditing}>{editing ? "阅读" : "编辑"}</button>{actions(active)}</>}</div>
      </header>
      {!ready ? <p className={styles.loading}>正在读取本地笔记…</p> : !active ? <div className={styles.missing}><h1>这份笔记不在当前浏览器</h1><p>返回画布查看已有内容，或导入一份 Markdown。</p><button onClick={() => returnToCanvas()}>返回画布</button></div> : editing ?
        <MarkdownEditor key={active.id} markdown={active.markdown}
          onChange={markdown => changeNode(active, { markdown })}
          onSave={() => void flush()} />
        : <main className={styles.readingPage} data-canvas-content><article className={styles.markdown}>{active.markdown.trim() ? <MarkdownDocument markdown={active.markdown} /> : <p className={styles.blankNote}>还没有正文。<button onClick={toggleEditing}>开始编辑</button></p>}</article></main>}
    </div> : <>
      <header className={styles.toolbar}><h1>我的画布</h1><div><button className={styles.import} disabled={!ready || importing} onClick={() => input.current?.click()}><UploadSimple size={16} />{importing ? "导入中…" : "导入 .md"}</button><button className={styles.primary} disabled={!ready} aria-haspopup="menu" aria-expanded={contextMenu?.kind === "create"} onClick={event => { menuAnchor.current = event.currentTarget; const bounds = event.currentTarget.getBoundingClientRect(); setContextMenu({ kind: "create", x: bounds.right - 200, y: bounds.bottom + 8 }); }}><Plus size={17} />新建节点</button></div></header>
      <main ref={surface} className={`${styles.surface} ${connecting ? styles.connecting : ""}`} tabIndex={0} aria-label="自由画布" aria-description="拖动节点或空白处移动。点按节点圆点后选择另一节点，或拖动圆点创建连线。" onPointerDown={beginPan} onPointerMove={movePointer} onPointerUp={finishPointer}
        onPointerCancel={() => { gesture.current = null; setConnecting(null); void flush(); }}
        onContextMenu={showContext}
        onDoubleClick={event => { if (!(event.target as Element).closest("button, a, [data-canvas-ui], [data-canvas-node], [data-canvas-edge]")) createNode("note", worldPoint(localPoint(event.clientX, event.clientY))); }}
        onWheel={event => {
          if (gesture.current || (event.target as Element).closest("[data-canvas-ui]")) return;
          setContextMenu(null);
          if (event.ctrlKey || event.metaKey) zoom(data.view.scale * Math.exp(-event.deltaY * .008), localPoint(event.clientX, event.clientY));
          else update(value => ({ ...value, view: { ...value.view, x: value.view.x - event.deltaX, y: value.view.y - event.deltaY } }));
        }}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          const delta: Record<string, Point> = { ArrowLeft: { x: 40, y: 0 }, ArrowRight: { x: -40, y: 0 }, ArrowUp: { x: 0, y: 40 }, ArrowDown: { x: 0, y: -40 } };
          if (delta[event.key]) { event.preventDefault(); const offset = delta[event.key]; update(value => ({ ...value, view: { ...value.view, x: value.view.x + offset.x, y: value.view.y + offset.y } })); }
          if (event.key === "Home") { event.preventDefault(); fit(); }
        }}>
        <div className={styles.world} style={{ transform: `translate(${data.view.x}px, ${data.view.y}px) scale(${data.view.scale})` }}>
          <svg className={styles.connections} aria-label="节点连线"><g>
            {data.edges.map(item => {
              const from = data.nodes.find(node => node.id === item.from), to = data.nodes.find(node => node.id === item.to);
              if (!from || !to) return null;
              const path = paths.get(item.id);
              return <g key={item.id} data-canvas-edge={item.id} className={item.id === selectedEdge ? styles.selectedEdge : ""} role="button" tabIndex={0} aria-label={`${nodePreview(from).title}与${nodePreview(to).title}的连线`} onClick={event => { event.stopPropagation(); setSelected(null); setSelectedEdge(item.id); }} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedEdge(item.id); setSelected(null); } if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); removeEdge(item); } }}><path d={path} className={styles.edgeLine} /><path d={path} className={styles.edgeHit} /></g>;
            })}
            {source && connecting && <path d={connectionPath(anchor(source), connecting.point, labels)} className={styles.draftLine} />}
          </g></svg>
          {data.nodes.map(node => {
            const preview = nodePreview(node);
            const kind = node.kind ?? "note", KindIcon = kindIcons[kind];
            const image = kind === "image" ? safeNodeUrl(nodeResource(node), true) : undefined;
            const tasks = kind === "todo" ? nodeTasks(node.markdown) : [];
            return <div key={node.id} className={styles.node} style={{ left: node.x, top: node.y }} data-canvas-node={node.id}>
              <button className={styles.port} aria-label={`从${preview.title}开始连线`} title="拖动连线，或点按后选择另一节点" onPointerDown={event => beginLink(event, node)} onClick={event => { if (event.detail === 0) { setSelected(null); setConnecting({ from: node.id, point: anchor(node) }); } }}><Circle size={8} weight="fill" /></button>
              <button data-canvas-label={node.id} className={`${styles.note} ${selected === node.id ? styles.selected : ""} ${!node.fileName && node.markdown.trim() === preview.title ? styles.fragment : ""}`} onPointerDown={event => beginNode(event, node)} onClick={() => selectNode(node)} aria-pressed={selected === node.id} onKeyDown={event => {
                const moves: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
                if (moves[event.key]) { event.preventDefault(); const offset = moves[event.key], step = event.shiftKey ? 50 : 10; update(value => ({ ...value, nodes: value.nodes.map(item => item.id === node.id ? { ...item, x: item.x + offset.x * step, y: item.y + offset.y * step } : item) })); }
              }}><strong>{kind !== "note" && <KindIcon className={styles.nodeKindIcon} size={16} aria-label={nodeKinds[kind]} />}{preview.title}</strong>{preview.summary && <span>{preview.summary}</span>}{image && selected !== node.id && <img className={styles.nodeImage} src={image} alt="" draggable={false} />}{kind === "todo" && tasks.length > 0 && selected !== node.id && <span>{tasks.filter(task => task.checked).length} / {tasks.length} 已完成</span>}</button>
            </div>;
          })}
        </div>
        {!ready && !error && <p className={styles.empty}>正在读取本地画布…</p>}
        {ready && !data.nodes.length && <p className={styles.empty}>右键新建节点，或双击写下一点什么。</p>}
        {picked && !connecting && <section ref={previewRef} className={styles.preview} style={previewPosition || undefined} data-canvas-ui data-canvas-paper aria-label="节点简述">
          <NodeCard key={picked.id} node={picked} actions={actions(picked)} onChange={patch => changeNode(picked, patch)} onSave={() => void flush()} onOpen={() => openNote(picked)} onClose={() => { void flush(); setSelected(null); }} onMessage={message => setToast({ message })} />
        </section>}
        {connecting && <div className={styles.linkHint} data-canvas-ui>选择另一个节点<button onClick={() => setConnecting(null)} aria-label="取消连线"><X size={16} /></button></div>}
        {edge && edgeFrom && edgeTo && <button className={styles.removeEdge} data-canvas-ui style={{ left: data.view.x + (edgeFrom.x + edgeTo.x) / 2 * data.view.scale, top: data.view.y + ((edgeFrom.y + edgeTo.y) / 2 + 17) * data.view.scale }} onClick={() => removeEdge(edge)}><Trash size={15} />删除连线</button>}
        <div className={styles.zoom} data-canvas-ui><button aria-label="缩小画布" disabled={!ready || data.view.scale <= .3} onClick={() => zoom(data.view.scale / 1.2)}><Minus size={16} /></button><button aria-label="显示全部节点" title="显示全部节点" disabled={!ready} onClick={fit}>{Math.round(data.view.scale * 100)}%</button><button aria-label="放大画布" disabled={!ready || data.view.scale >= 2} onClick={() => zoom(data.view.scale * 1.2)}><Plus size={16} /></button></div>
      </main>
    </>}
    {contextMenu && <div ref={menuRef} className={`${styles.menuItems} ${styles.contextMenu}`} style={{ left: contextMenu.x, top: contextMenu.y }} role="menu" aria-label={contextMenu.kind === "create" ? "新建节点类型" : "节点右键菜单"} data-canvas-ui onKeyDown={event => {
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); buttons[event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + buttons.length) % buttons.length]?.focus(); }
      if (event.key === "Tab") setContextMenu(null);
    }}>
      {contextMenu.kind === "create" ? (Object.keys(nodeKinds) as NodeKind[]).map(kind => { const Icon = kindIcons[kind]; return <button key={kind} role="menuitem" onClick={() => createNode(kind, contextMenu.at)}><Icon size={17} />新建{nodeKinds[kind]}</button>; }) : (() => { const node = data.nodes.find(item => item.id === contextMenu.id); return node ? actionItems(node) : null; })()}
    </div>}
    <input ref={input} hidden type="file" accept=".md,.markdown,text/markdown" multiple aria-label="导入 Markdown 文件" onChange={importFiles} />
    <dialog ref={info} className={styles.info} onClick={event => { if (event.target === event.currentTarget) info.current?.close(); }}><div><header><h2>节点信息</h2><button className={styles.icon} aria-label="关闭节点信息" onClick={() => info.current?.close()}><X size={20} /></button></header>{current && <><p>{nodePreview(current).title}</p><dl><dt>创建</dt><dd>{fullDate(current.createdAt)}</dd><dt>修改</dt><dd>{fullDate(current.updatedAt)}</dd></dl></>}</div></dialog>
    {toast && <div className={styles.toast} role="status"><span>{toast.message}</span>{toast.undo && <button onClick={undo}>撤销</button>}<button className={styles.icon} onClick={() => setToast(null)} aria-label="关闭提示"><X size={16} /></button></div>}
  </div>;
}
