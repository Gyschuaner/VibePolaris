"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight, CornersOut, MagnifyingGlass, Minus, Plus, X } from "@phosphor-icons/react";
import { useRouteMeteor } from "@/components/RouteMeteorProvider";
import { createGraphSimulation, graphNeighbors, nudgeGraph, type GraphNode, type GraphEdge } from "@/lib/term-graph";
import styles from "./ConceptGraph.module.css";

type Point = { x: number; y: number };
type View = Point & { scale: number };

export function ConceptGraph({ nodes: initialNodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const nodes = initialNodes;
  const [selected, setSelected] = useState("");
  const [hovered, setHovered] = useState("");
  const [query, setQuery] = useState("");
  const [showLines, setShowLines] = useState(false);
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: .5 });
  const [ready, setReady] = useState(false);
  const [reframing, setReframing] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const searchPanel = useRef<HTMLDivElement>(null);
  const nodeElements = useRef(new Map<string, HTMLButtonElement>());
  const lineElements = useRef(new Map<string, { element: SVGLineElement; source: string; target: string }>());
  const size = useRef({ width: 1000, height: 700 });
  const gesture = useRef<{ start: Point; view: View; slug?: string; point?: Point } | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ distance: number; center: Point; view: View } | null>(null);
  const dragged = useRef(false);
  const simulation = useRef<ReturnType<typeof createGraphSimulation> | null>(null);
  const reducedMotion = useRef(false);
  const lastNudge = useRef(0);
  const labelOpacity = Math.max(0, Math.min(1, (view.scale - 1.05) / .45));
  const { beginRouteFlight } = useRouteMeteor();
  const bySlug = useMemo(() => new Map(nodes.map(node => [node.slug, node])), [nodes]);
  const selectedNeighbors = useMemo(() => graphNeighbors(selected, edges), [selected, edges]);
  const current = bySlug.get(selected);
  const needle = query.trim().toLocaleLowerCase();
  const matches = needle ? initialNodes.filter(node => [node.zh, node.en, node.slug, ...node.aliases].some(text => text.toLocaleLowerCase().includes(needle))).slice(0, 12) : [];

  // Physics owns coordinates; React owns content and interaction state.
  // Updating transforms avoids 301 React renders and layout work on every tick.
  const paintPositions = useCallback(() => {
    const moving = simulation.current?.nodes();
    if (!moving) return;
    const positions = new Map(moving.map(node => [node.slug, node]));
    for (const node of moving) {
      const element = nodeElements.current.get(node.slug);
      if (element) element.style.transform = `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`;
    }
    for (const { element, source, target } of lineElements.current.values()) {
      const from = positions.get(source)!;
      const to = positions.get(target)!;
      element.setAttribute("x1", String(from.x)); element.setAttribute("y1", String(from.y));
      element.setAttribute("x2", String(to.x)); element.setAttribute("y2", String(to.y));
    }
  }, []);

  // Newly revealed lines must use the live coordinates before the next paint,
  // even when the simulation has already settled.
  useLayoutEffect(paintPositions, [paintPositions, selected, showLines]);

  function positions() { return simulation.current?.nodes() || initialNodes; }

  useEffect(() => {
    const engine = createGraphSimulation(initialNodes, edges);
    simulation.current = engine;
    engine.on("tick", paintPositions);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches || document.hidden) engine.stop();
      else if (engine.alpha() >= engine.alphaMin()) engine.restart();
    };
    engine.alpha(.18);
    syncMotion();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      engine.stop();
      simulation.current = null;
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, [initialNodes, edges, paintPositions]);

  function releaseNode() {
    const engine = simulation.current;
    if (!engine) return;
    const node = engine.nodes().find(item => item.slug === gesture.current?.slug);
    if (!node || node.fx == null && node.fy == null) return;
    node.fx = null; node.fy = null;
    engine.alphaTarget(0);
    if (!reducedMotion.current && !document.hidden) engine.restart();
  }

  const frame = useCallback((items: GraphNode[], detail = false) => {
    if (!items.length) return;
    const { width, height } = size.current;
    const availableWidth = width - (detail && width > 760 ? 350 : 0);
    const availableHeight = height - (detail && width <= 760 ? Math.min(290, height * .43) : 0);
    const minX = Math.min(...items.map(node => node.x));
    const maxX = Math.max(...items.map(node => node.x));
    const minY = Math.min(...items.map(node => node.y));
    const maxY = Math.max(...items.map(node => node.y));
    const scale = Math.max(.12, Math.min(detail ? 1.5 : 1, (availableWidth - 100) / (maxX - minX + 160), (availableHeight - 100) / (maxY - minY + 160)));
    setView({ x: availableWidth / 2 - (minX + maxX) / 2 * scale, y: availableHeight / 2 - (minY + maxY) / 2 * scale, scale });
    setReframing(true);
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const restore = () => {
      const slug = new URL(window.location.href).searchParams.get("term") || "";
      const positions = simulation.current?.nodes() || initialNodes;
      const node = positions.find(item => item.slug === slug);
      setSelected(node?.slug || "");
      const linked = graphNeighbors(slug, edges);
      frame(node ? positions.filter(item => item.slug === slug || linked.has(item.slug)) : positions, Boolean(node));
    };
    const observer = new ResizeObserver(([entry]) => {
      const previous = size.current;
      const next = { width: entry.contentRect.width, height: entry.contentRect.height };
      size.current = next;
      if (!element.dataset.ready) {
        element.dataset.ready = "true";
        restore();
        setReady(true);
      } else {
        setReframing(false);
        if ((previous.width > 760) !== (next.width > 760)) restore();
        else setView(value => ({ ...value, x: value.x + (next.width - previous.width) / 2, y: value.y + (next.height - previous.height) / 2 }));
      }
    });
    observer.observe(element);
    window.addEventListener("popstate", restore);
    return () => { observer.disconnect(); window.removeEventListener("popstate", restore); };
  }, [edges, frame, initialNodes]);

  function selectNode(slug: string) {
    setSelected(slug); setHovered(""); setQuery("");
    searchPanel.current?.hidePopover();
    const linked = graphNeighbors(slug, edges);
    frame(positions().filter(node => node.slug === slug || linked.has(node.slug)), true);
    const url = new URL(window.location.href);
    url.searchParams.set("term", slug);
    window.history.replaceState(null, "", url);
  }

  function clearSelection() {
    setSelected(""); setHovered("");
    const url = new URL(window.location.href);
    url.searchParams.delete("term");
    window.history.replaceState(null, "", url);
  }

  const zoom = useCallback((factor: number, point = { x: size.current.width / 2, y: size.current.height / 2 }) => {
    setView(previous => {
      const scale = Math.max(.12, Math.min(3, previous.scale * factor));
      const ratio = scale / previous.scale;
      return { x: point.x - (point.x - previous.x) * ratio, y: point.y - (point.y - previous.y) * ratio, scale };
    });
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
      setReframing(false);
      zoom(Math.exp(-delta * .002), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    // React delegates wheel events passively; the canvas must own wheel/pinch zoom.
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [zoom]);

  function localPoint(event: { clientX: number; clientY: number }) {
    const rect = canvas.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    event.currentTarget.setPointerCapture(event.pointerId);
    setReframing(false);
    if (pointers.current.size === 2) {
      releaseNode();
      const [a, b] = [...pointers.current.values()];
      pinch.current = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, view };
      dragged.current = true;
      return;
    }
    const slug = (event.target as HTMLElement).closest<HTMLElement>("[data-graph-node]")?.dataset.graphNode;
    const node = slug ? positions().find(item => item.slug === slug) : undefined;
    gesture.current = { start: point, view, slug, point: node ? { x: node.x, y: node.y } : undefined };
    dragged.current = false;
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const point = localPoint(event);
    const engine = simulation.current;
    if (!pointers.current.has(event.pointerId)) {
      if (event.pointerType !== "mouse" || event.buttons) return;
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-graph-node]")?.dataset.graphNode || "";
      // Only a real pointer movement changes hover; moving stars cannot flicker it.
      setHovered(target);
      if (target || reducedMotion.current || !engine || event.timeStamp - lastNudge.current < 64) return;
      lastNudge.current = event.timeStamp;
      if (nudgeGraph(engine.nodes(), (point.x - view.x) / view.scale, (point.y - view.y) / view.scale, 65 / view.scale)) engine.alpha(Math.max(.025, engine.alpha())).restart();
      return;
    }
    pointers.current.set(event.pointerId, point);
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const original = pinch.current;
      const scale = Math.max(.12, Math.min(3, original.view.scale * Math.hypot(a.x - b.x, a.y - b.y) / original.distance));
      setView({ x: (a.x + b.x) / 2 - (original.center.x - original.view.x) * scale / original.view.scale, y: (a.y + b.y) / 2 - (original.center.y - original.view.y) * scale / original.view.scale, scale });
      return;
    }
    const start = gesture.current;
    if (!start || pinch.current) return;
    const dx = point.x - start.start.x;
    const dy = point.y - start.start.y;
    if (Math.hypot(dx, dy) < 4 && !dragged.current) return;
    dragged.current = true;
    if (start.slug && start.point) {
      const origin = start.point;
      const node = engine?.nodes().find(item => item.slug === start.slug);
      if (!node) return;
      node.x = node.fx = origin.x + dx / start.view.scale;
      node.y = node.fy = origin.y + dy / start.view.scale;
      node.vx = 0; node.vy = 0;
      if (reducedMotion.current) paintPositions();
      else engine!.alphaTarget(.25).restart();
    } else setView({ ...start.view, x: start.view.x + dx, y: start.view.y + dy });
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    releaseNode();
    if (event.type === "pointerup" && pointers.current.size === 1 && !dragged.current && gesture.current?.slug) selectNode(gesture.current.slug);
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!pointers.current.size) { gesture.current = null; pinch.current = null; }
  }

  return <main className={styles.page} id="main-content">
    <h1 className={styles.visuallyHidden}>概念星图</h1>
    <div className={styles.workspace}>
      <button className={styles.searchToggle} type="button" popoverTarget="graph-search" aria-label="打开概念搜索" title="搜索概念"><MagnifyingGlass size={23} /></button>
      <div ref={searchPanel} className={styles.searchPanel} id="graph-search" popover="auto" onToggle={event => { if (event.newState === "closed") setQuery(""); }}>
        <input autoFocus aria-label="搜索概念" placeholder="搜索概念、英文或别名" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && matches[0]) { event.preventDefault(); selectNode(matches[0].slug); } }} />
        {needle && <div className={styles.results} aria-label="搜索结果">{matches.length ? matches.map(node => <button type="button" key={node.slug} onClick={() => selectNode(node.slug)}><strong>{node.zh}</strong><span>{node.en || node.cat}</span></button>) : <p>没有找到这个概念</p>}</div>}
      </div>
      <div ref={canvas} className={styles.canvas} role="region" aria-label="概念关系画布，可拖动、缩放或用方向键移动" tabIndex={0}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onPointerLeave={() => setHovered("")}
        onKeyDown={event => {
          if (event.key === "Escape") { clearSelection(); return; }
          if (event.target !== event.currentTarget) return;
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "+", "=", "-", "0"].includes(event.key)) event.preventDefault();
          setReframing(false);
          if (event.key === "+" || event.key === "=") zoom(1.25);
          if (event.key === "-") zoom(.8);
          if (event.key === "0") frame(positions());
          if (event.key.startsWith("Arrow")) setView(value => ({ ...value, x: value.x + (event.key === "ArrowLeft" ? 50 : event.key === "ArrowRight" ? -50 : 0), y: value.y + (event.key === "ArrowUp" ? 50 : event.key === "ArrowDown" ? -50 : 0) }));
        }}>
        <div className={`${styles.world} ${reframing ? styles.reframing : ""}`} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, opacity: ready ? 1 : 0 }}>
          <svg className={styles.lines} aria-hidden="true">{edges.map(edge => {
            const connected = edge.source === selected || edge.target === selected;
            if (!showLines && !connected) return null;
            const from = bySlug.get(edge.source)!; const to = bySlug.get(edge.target)!;
            return <line key={`${edge.source}|${edge.target}`} ref={element => {
              const key = `${edge.source}|${edge.target}`;
              if (element) lineElements.current.set(key, { element, ...edge });
              else lineElements.current.delete(key);
            }} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={connected ? styles.connectedLine : styles.quietLine} />;
          })}</svg>
          {nodes.map(node => {
            const connected = selectedNeighbors.has(node.slug);
            const highlighted = node.slug === selected || connected;
            const named = node.slug === hovered || highlighted;
            return <button type="button" key={node.slug} ref={element => {
              if (element) nodeElements.current.set(node.slug, element);
              else nodeElements.current.delete(node.slug);
            }} data-graph-node={node.slug} aria-label={`${node.zh}${node.en ? ` · ${node.en}` : ""}`} aria-pressed={node.slug === selected}
              className={`${styles.node} ${node.slug === selected ? styles.selected : ""} ${node.slug === hovered ? styles.hovered : ""} ${selected && !named ? styles.dimmed : ""}`}
              style={{ transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)` }}
              onFocus={() => setHovered(node.slug)} onBlur={() => setHovered("")}
              onClick={event => { if (event.detail === 0) selectNode(node.slug); }}>
              <span className="brand-star-only" aria-hidden="true" style={{ width: Math.min(52, Math.max(23 + node.degree, 20 / view.scale)), height: Math.min(52, Math.max(23 + node.degree, 20 / view.scale)) }} /><span className={styles.label} style={{ fontSize: 14 / view.scale, opacity: named ? 1 : labelOpacity }}>{node.zh}</span>
            </button>;
          })}
        </div>
      </div>
      <div className={styles.controls} aria-label="星图视图控制">
        <button type="button" aria-label="放大星图" title="放大" onClick={() => { setReframing(true); zoom(1.3); }}><Plus size={18} /></button>
        <button type="button" aria-label="缩小星图" title="缩小" onClick={() => { setReframing(true); zoom(1 / 1.3); }}><Minus size={18} /></button>
        <button type="button" aria-label="显示完整星图" title="显示完整星图" onClick={() => { clearSelection(); frame(positions()); }}><CornersOut size={18} /></button>
        <label><input type="checkbox" checked={showLines} onChange={event => setShowLines(event.target.checked)} />显示连线</label>
      </div>
      {current && <aside className={styles.detail} aria-label={`${current.zh}概念详情`}>
        <button className={styles.close} type="button" aria-label="关闭概念详情" onClick={clearSelection}><X size={18} /></button>
        <span className={styles.category}>{current.cat}</span>
        <h2>{current.zh}</h2>{current.en && <span className={styles.english}>{current.en}</span>}
        <p>{current.definition}</p>
        <Link className={styles.enter} href={`/terms/${current.slug}`} onClick={event => {
          if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const star = canvas.current?.querySelector<HTMLElement>(`[data-graph-node="${current.slug}"] .brand-star-only`);
          if (star) { event.preventDefault(); beginRouteFlight(`/terms/${current.slug}`, star); }
        }}>阅读词条<ArrowUpRight size={18} /></Link>
        <div className={styles.neighbors}><h3>相连的概念</h3>{nodes.filter(node => selectedNeighbors.has(node.slug)).map(node => <button key={node.slug} type="button" onClick={() => selectNode(node.slug)}><span className="brand-star-only" aria-hidden="true" />{node.zh}</button>)}</div>
      </aside>}
    </div>
  </main>;
}
