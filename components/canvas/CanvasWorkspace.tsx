"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowUpRight, Circle, Copy, DotsThree, DownloadSimple, Info, LinkSimple, Minus, Plus, Trash, UploadSimple, X } from "@phosphor-icons/react";
import { SiteHeader } from "@/components/SiteHeader";
import { availablePosition, connectNodes, curve, markdownFileName, moveView, nodePreview, type CanvasEdge, type CanvasNode, type CanvasView } from "@/lib/canvas";
import { useCanvas } from "./useCanvas";
import styles from "./CanvasWorkspace.module.css";

type Point = { x: number; y: number };
type Gesture = { pointerId: number; start: Point; moved: boolean } & (
  { kind: "pan"; view: CanvasView } | { kind: "node"; node: CanvasNode; scale: number } | { kind: "link"; from: string }
);
type Removed = { nodes: CanvasNode[]; edges: CanvasEdge[] };
const anchor = (node: CanvasNode): Point => ({ x: node.x + 12, y: node.y + 17 });
const dateLabel = (value: string) => new Date(value).toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
const fullDate = (value: string) => new Date(value).toLocaleString("zh-CN", { hourCycle: "h23" });

export function CanvasWorkspace() {
  const router = useRouter(), search = useSearchParams();
  const { data, ready, status, error, update, flush, reload, hasPending, isConflict } = useCanvas();
  const documentId = search.get("note"), editing = search.get("edit") === "1";
  const [selected, setSelected] = useState<string | null>(null), [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ from: string; point: Point } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 }), [importing, setImporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; undo?: Removed } | null>(null);
  const surface = useRef<HTMLElement>(null), input = useRef<HTMLInputElement>(null), info = useRef<HTMLDialogElement>(null);
  const gesture = useRef<Gesture | null>(null), skipClick = useRef(false);
  const active = data.nodes.find(node => node.id === documentId), picked = data.nodes.find(node => node.id === selected);
  const current = documentId ? active : picked;
  const pickedPreview = picked ? nodePreview(picked) : null;
  const edge = data.edges.find(item => item.id === selectedEdge);

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
      if (event.key !== "Escape" || documentId) return;
      setConnecting(null); setSelected(null); setSelectedEdge(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [documentId]);

  function localPoint(clientX: number, clientY: number) {
    const bounds = surface.current?.getBoundingClientRect();
    return { x: clientX - (bounds?.left ?? 0), y: clientY - (bounds?.top ?? 0) };
  }
  function worldPoint(point: Point) { return { x: (point.x - data.view.x) / data.view.scale, y: (point.y - data.view.y) / data.view.scale }; }
  function openNote(node: CanvasNode, edit = false) {
    void flush(); setSelected(node.id); setConnecting(null);
    router.push(`/canvas?note=${encodeURIComponent(node.id)}${edit ? "&edit=1" : ""}`, { scroll: false });
  }
  function returnToCanvas() { void flush(); router.push("/canvas", { scroll: false }); }
  function toggleEditing() {
    if (!active) return;
    void flush(); router.replace(`/canvas?note=${encodeURIComponent(active.id)}${editing ? "" : "&edit=1"}`, { scroll: false });
  }
  function createNode(at?: Point) {
    if (!ready) return;
    const point = at ?? availablePosition(data.nodes, worldPoint({ x: size.width * .45, y: size.height * .4 }));
    const now = new Date().toISOString();
    const node: CanvasNode = { id: crypto.randomUUID(), markdown: "", fileName: "", x: point.x, y: point.y, createdAt: now, updatedAt: now };
    update(value => ({ ...value, nodes: [...value.nodes, node] }), true); openNote(node, true);
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
    const minX = Math.min(...data.nodes.map(node => node.x)), maxX = Math.max(...data.nodes.map(node => node.x + 280));
    const minY = Math.min(...data.nodes.map(node => node.y)), maxY = Math.max(...data.nodes.map(node => node.y + 95));
    const scale = Math.max(.3, Math.min(1, (size.width - 96) / (maxX - minX), (size.height - 96) / (maxY - minY)));
    update(value => ({ ...value, view: { scale, x: (size.width - (maxX - minX) * scale) / 2 - minX * scale, y: (size.height - (maxY - minY) * scale) / 2 - minY * scale } }));
  }
  function removeNode(node: CanvasNode) {
    const related = data.edges.filter(item => item.from === node.id || item.to === node.id);
    update(value => ({ ...value, nodes: value.nodes.filter(item => item.id !== node.id), edges: value.edges.filter(item => item.from !== node.id && item.to !== node.id) }), true);
    setSelected(null); info.current?.close();
    setToast({ message: "节点已删除", undo: { nodes: [node], edges: related } });
    if (documentId) returnToCanvas();
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
    const url = URL.createObjectURL(new Blob([node.markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = markdownFileName(node);
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast({ message: "已导出 .md" });
  }
  async function copyNote(node: CanvasNode) {
    try {
      try { await navigator.clipboard.writeText(node.markdown); }
      catch {
        const field = document.createElement("textarea"); field.value = node.markdown; field.style.cssText = "position:fixed;left:-9999px";
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
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} 超过 5 MB，已有节点未改动。`);
        let markdown: string;
        try { markdown = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer()); }
        catch { throw new Error(`${file.name} 不是 UTF-8 文本，请转换编码后重试。`); }
        const point = availablePosition([...data.nodes, ...nodes], center, Math.max(1, Math.min(3, Math.floor(size.width / (330 * data.view.scale)))));
        nodes.push({ id: crypto.randomUUID(), markdown, fileName: file.name, ...point, createdAt: now, updatedAt: now });
      }
      update(value => ({ ...value, nodes: [...value.nodes, ...nodes] }), true);
      setSelected(nodes[0].id); setToast({ message: `已导入 ${nodes.length} 份 Markdown，已有节点已保留。` });
    } catch (cause) { setToast({ message: cause instanceof Error ? cause.message : "导入失败，已有节点未改动。" }); }
    finally { setImporting(false); }
  }
  function actions(node: CanvasNode) {
    const close = (event: React.MouseEvent) => event.currentTarget.closest("details")?.removeAttribute("open");
    return <details className={styles.menu} data-canvas-ui>
      <summary aria-label="笔记操作"><DotsThree size={23} /></summary>
      <div className={styles.menuItems}>
        <button onClick={event => { close(event); void copyNote(node); }}><Copy size={17} />复制 Markdown</button>
        <button onClick={event => { close(event); exportNote(node); }}><DownloadSimple size={17} />导出 .md</button>
        {!documentId && <button onClick={event => { close(event); setConnecting({ from: node.id, point: anchor(node) }); setSelected(null); }}><LinkSimple size={17} />连接节点</button>}
        <button onClick={event => { close(event); info.current?.showModal(); }}><Info size={17} />节点信息</button>
        <button onClick={event => { close(event); removeNode(node); }}><Trash size={17} />删除节点</button>
      </div>
    </details>;
  }

  const previewPosition = picked && {
    left: Math.max(12, Math.min(size.width - Math.min(300, size.width - 24) - 12, data.view.x + picked.x * data.view.scale + 22)),
    top: Math.max(12, Math.min(size.height - 265, data.view.y + picked.y * data.view.scale + 48)),
  };
  const source = connecting && data.nodes.find(node => node.id === connecting.from);
  const edgeFrom = edge && data.nodes.find(node => node.id === edge.from), edgeTo = edge && data.nodes.find(node => node.id === edge.to);

  return <div className={styles.workspace} data-pointer-native onPointerDownCapture={event => {
    event.currentTarget.querySelectorAll("details[open]").forEach(item => { if (!item.contains(event.target as Node)) item.removeAttribute("open"); });
  }}>
    {!documentId && <SiteHeader wide active="canvas" />}
    {error && <div className={styles.error} role="alert"><span>{error}</span>{isConflict() || !ready ? <button onClick={() => { if (!hasPending() || window.confirm("重新载入会放弃当前未保存的修改。请确认需要的 Markdown 已经导出。")) void reload(true); }}>重新载入</button> : <button onClick={() => void flush()}>重试保存</button>}</div>}
    {documentId ? <>
      <header className={styles.documentBar}>
        <button className={styles.back} onClick={returnToCanvas}><ArrowLeft size={18} /><span>返回画布</span></button>
        <span className={styles.fileName}>{active ? markdownFileName(active) : "Markdown"}</span>
        <div className={styles.documentActions}>{active && <>{editing && <span className={styles.saveStatus} role="status">{status === "saved" ? "已保存" : status === "saving" ? "保存中…" : "未保存"}</span>}<button className={styles.mode} onClick={toggleEditing}>{editing ? "阅读" : "编辑"}</button>{actions(active)}</>}</div>
      </header>
      {!ready ? <p className={styles.loading}>正在读取本地笔记…</p> : !active ? <div className={styles.missing}><h1>这份笔记不在当前浏览器</h1><p>返回画布查看已有内容，或导入一份 Markdown。</p><button onClick={returnToCanvas}>返回画布</button></div> : editing ?
        <main className={styles.editorPage}><textarea key={active.id} className={styles.editor} autoFocus aria-label="Markdown 正文" placeholder="直接写下想法，支持 Markdown…" spellCheck={false} value={active.markdown}
          onChange={event => { const markdown = event.target.value; update(value => ({ ...value, nodes: value.nodes.map(node => node.id === active.id ? { ...node, markdown, updatedAt: new Date().toISOString() } : node) })); }}
          onBlur={() => void flush()} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); void flush(); } }} /></main>
        : <main className={styles.readingPage}><article className={styles.markdown}>{active.markdown.trim() ? <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
          a: ({ href, children }) => <a href={href} target={href?.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer">{children}</a>,
          table: ({ children }) => <div className={styles.table}><table>{children}</table></div>,
        }}>{active.markdown}</Markdown> : <p className={styles.blankNote}>还没有正文。<button onClick={toggleEditing}>开始编辑</button></p>}</article></main>}
    </> : <>
      <header className={styles.toolbar}><h1>我的画布</h1><div><button className={styles.import} disabled={!ready || importing} onClick={() => input.current?.click()}><UploadSimple size={16} />{importing ? "导入中…" : "导入 .md"}</button><button className={styles.primary} disabled={!ready} onClick={() => createNode()}><Plus size={17} />新建节点</button></div></header>
      <main ref={surface} className={`${styles.surface} ${connecting ? styles.connecting : ""}`} tabIndex={0} aria-label="自由画布" aria-description="拖动节点或空白处移动。点按节点圆点后选择另一节点，或拖动圆点创建连线。" onPointerDown={beginPan} onPointerMove={movePointer} onPointerUp={finishPointer}
        onPointerCancel={() => { gesture.current = null; setConnecting(null); void flush(); }}
        onDoubleClick={event => { if (!(event.target as Element).closest("button, a, [data-canvas-ui], [data-canvas-node], [data-canvas-edge]")) createNode(worldPoint(localPoint(event.clientX, event.clientY))); }}
        onWheel={event => {
          if (gesture.current || (event.target as Element).closest("[data-canvas-ui]")) return;
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
              const path = curve(anchor(from), anchor(to));
              return <g key={item.id} data-canvas-edge={item.id} className={item.id === selectedEdge ? styles.selectedEdge : ""} role="button" tabIndex={0} aria-label={`${nodePreview(from).title}与${nodePreview(to).title}的连线`} onClick={event => { event.stopPropagation(); setSelected(null); setSelectedEdge(item.id); }} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedEdge(item.id); setSelected(null); } if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); removeEdge(item); } }}><path d={path} className={styles.edgeLine} /><path d={path} className={styles.edgeHit} /></g>;
            })}
            {source && connecting && <path d={curve(anchor(source), connecting.point)} className={styles.draftLine} />}
          </g></svg>
          {data.nodes.map(node => {
            const preview = nodePreview(node);
            return <div key={node.id} className={styles.node} style={{ left: node.x, top: node.y }} data-canvas-node={node.id}>
              <button className={styles.port} aria-label={`从${preview.title}开始连线`} title="拖动连线，或点按后选择另一节点" onPointerDown={event => beginLink(event, node)} onClick={event => { if (event.detail === 0) { setSelected(null); setConnecting({ from: node.id, point: anchor(node) }); } }}><Circle size={8} weight="fill" /></button>
              <button className={`${styles.note} ${selected === node.id ? styles.selected : ""} ${!node.fileName && node.markdown.trim() === preview.title ? styles.fragment : ""}`} onPointerDown={event => beginNode(event, node)} onClick={() => selectNode(node)} aria-pressed={selected === node.id} onKeyDown={event => {
                const moves: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
                if (moves[event.key]) { event.preventDefault(); const offset = moves[event.key], step = event.shiftKey ? 50 : 10; update(value => ({ ...value, nodes: value.nodes.map(item => item.id === node.id ? { ...item, x: item.x + offset.x * step, y: item.y + offset.y * step } : item) })); }
              }}><strong>{preview.title}</strong>{preview.summary && <span>{preview.summary}</span>}</button>
            </div>;
          })}
        </div>
        {!ready && !error && <p className={styles.empty}>正在读取本地画布…</p>}
        {ready && !data.nodes.length && <p className={styles.empty}>双击空白处，写下一点什么。</p>}
        {picked && !connecting && <section className={styles.preview} style={previewPosition || undefined} data-canvas-ui aria-label="节点简述">
          <header><h2>{pickedPreview?.title}</h2><div>{actions(picked)}<button className={styles.icon} aria-label="关闭简述" onClick={() => setSelected(null)}><X size={18} /></button></div></header>
          {pickedPreview?.summary ? <p>{pickedPreview.summary}</p> : !picked.markdown.trim() && <p>直接打开，写下你的想法。</p>}
          <footer><button className={styles.open} onClick={() => openNote(picked)}>打开全文<ArrowUpRight size={16} /></button><time dateTime={picked.updatedAt} title={`创建：${fullDate(picked.createdAt)}\n修改：${fullDate(picked.updatedAt)}`}>{dateLabel(picked.updatedAt)}更新</time></footer>
        </section>}
        {connecting && <div className={styles.linkHint} data-canvas-ui>选择另一个节点<button onClick={() => setConnecting(null)} aria-label="取消连线"><X size={16} /></button></div>}
        {edge && edgeFrom && edgeTo && <button className={styles.removeEdge} data-canvas-ui style={{ left: data.view.x + (edgeFrom.x + edgeTo.x) / 2 * data.view.scale, top: data.view.y + ((edgeFrom.y + edgeTo.y) / 2 + 17) * data.view.scale }} onClick={() => removeEdge(edge)}><Trash size={15} />删除连线</button>}
        <div className={styles.zoom} data-canvas-ui><button aria-label="缩小画布" disabled={!ready || data.view.scale <= .3} onClick={() => zoom(data.view.scale / 1.2)}><Minus size={16} /></button><button aria-label="显示全部节点" title="显示全部节点" disabled={!ready} onClick={fit}>{Math.round(data.view.scale * 100)}%</button><button aria-label="放大画布" disabled={!ready || data.view.scale >= 2} onClick={() => zoom(data.view.scale * 1.2)}><Plus size={16} /></button></div>
      </main>
    </>}
    <input ref={input} hidden type="file" accept=".md,.markdown,text/markdown" multiple aria-label="导入 Markdown 文件" onChange={importFiles} />
    <dialog ref={info} className={styles.info} onClick={event => { if (event.target === event.currentTarget) info.current?.close(); }}><div><header><h2>节点信息</h2><button className={styles.icon} aria-label="关闭节点信息" onClick={() => info.current?.close()}><X size={20} /></button></header>{current && <><p>{nodePreview(current).title}</p><dl><dt>创建</dt><dd>{fullDate(current.createdAt)}</dd><dt>修改</dt><dd>{fullDate(current.updatedAt)}</dd></dl></>}</div></dialog>
    {toast && <div className={styles.toast} role="status"><span>{toast.message}</span>{toast.undo && <button onClick={undo}>撤销</button>}<button className={styles.icon} onClick={() => setToast(null)} aria-label="关闭提示"><X size={16} /></button></div>}
  </div>;
}
