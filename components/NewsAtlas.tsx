"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight, CaretRight, CornersOut, Minus, Plus } from "@phosphor-icons/react";
import { createGraphSimulation, graphNeighbors, nudgeGraph, type GraphEdge, type GraphNode } from "@/lib/term-graph";

type RelatedTerm = { slug: string; zh: string; en: string };

export type NewsAtlasArticle = {
  slug: string;
  title: string;
  summary: string;
  eventDate: string;
  publishedAt: string;
  isExample: boolean;
  source: { name: string; url: string };
  related: RelatedTerm[];
  relatedArticleSlugs: string[];
};

type Point = { x: number; y: number };
type View = Point & { scale: number };
type NewsGraphNode = GraphNode & {
  kind: "article";
  articleSlug?: string;
};

const specks: Point[] = [
  { x: 18, y: 7 }, { x: 31, y: 4 }, { x: 49, y: 9 }, { x: 82, y: 6 },
  { x: 12, y: 18 }, { x: 24, y: 22 }, { x: 57, y: 18 }, { x: 92, y: 20 },
  { x: 17, y: 34 }, { x: 44, y: 31 }, { x: 76, y: 33 }, { x: 95, y: 39 },
  { x: 8, y: 48 }, { x: 23, y: 53 }, { x: 58, y: 49 }, { x: 88, y: 51 },
  { x: 15, y: 67 }, { x: 46, y: 66 }, { x: 77, y: 69 }, { x: 95, y: 72 },
  { x: 8, y: 84 }, { x: 29, y: 91 }, { x: 61, y: 86 }, { x: 89, y: 91 },
];

const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", { weekday: "short", timeZone: "UTC" });
const shortDateFormatter = new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", timeZone: "UTC" });
const longDateFormatter = new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" });

const rangePresets = [
  { key: "month", label: "近一个月", days: 30 },
  { key: "quarter", label: "近三个月", days: 90 },
  { key: "halfYear", label: "近半年", days: 183 },
  { key: "year", label: "近一年", days: 365 },
] as const;

type RangePreset = typeof rangePresets[number]["key"] | "custom";
type NewsDayGroup = { date: string; articles: NewsAtlasArticle[] };

function utcDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftUtcDays(value: string, days: number) {
  const date = utcDate(value);
  date.setUTCDate(date.getUTCDate() - days);
  return dateKey(date);
}

function rangeLabel(start: string, end: string) {
  if (start.slice(0, 4) !== end.slice(0, 4)) return `${start.replaceAll("-", "/")} — ${end.replaceAll("-", "/")}`;
  return `${shortDateFormatter.format(utcDate(start))} — ${shortDateFormatter.format(utcDate(end))}`;
}

function graphData(articles: NewsAtlasArticle[]) {
  const nodes: NewsGraphNode[] = [];
  const edges: GraphEdge[] = [];
  const articleNodes = new Map<string, NewsGraphNode>();
  const articleSlugs = new Set(articles.map(article => article.slug));
  const edgeKeys = new Set<string>();
  const addEdge = (source: string, target: string) => {
    const key = [source, target].sort().join("|");
    if (edgeKeys.has(key)) return false;
    edgeKeys.add(key);
    edges.push({ source, target });
    return true;
  };

  articles.forEach((article, index) => {
    const slug = `news:${article.slug}`;
    const angle = index * 2.399963229728653;
    const articleNode: NewsGraphNode = {
      slug,
      zh: article.title,
      en: "NEWS",
      cat: "新闻",
      aliases: [],
      definition: article.summary,
      relatedSlugs: article.relatedArticleSlugs,
      x: Math.cos(angle) * (118 + Math.sqrt(index) * 88),
      y: Math.sin(angle) * (102 + Math.sqrt(index) * 58),
      degree: 0,
      kind: "article",
      articleSlug: article.slug,
    };
    articleNodes.set(article.slug, articleNode);
    nodes.push(articleNode);
  });

  articles.forEach(article => {
    const source = articleNodes.get(article.slug);
    if (!source) return;
    article.relatedArticleSlugs.filter(relatedSlug => relatedSlug !== article.slug && articleSlugs.has(relatedSlug)).forEach(relatedSlug => {
      const target = articleNodes.get(relatedSlug);
      if (!target) return;
      if (addEdge(source.slug, target.slug)) {
        source.degree += 1;
        target.degree += 1;
      }
    });
  });

  return { nodes, edges };
}

export function NewsAtlas({ articles }: { articles: NewsAtlasArticle[] }) {
  const orderedArticles = useMemo(
    () => [...articles].sort((a, b) => b.eventDate.localeCompare(a.eventDate)),
    [articles],
  );
  const latestDate = orderedArticles[0]?.eventDate ?? new Date().toISOString().slice(0, 10);
  const earliestDate = orderedArticles.at(-1)?.eventDate ?? latestDate;
  const [rangePreset, setRangePreset] = useState<RangePreset>("month");
  const [customStart, setCustomStart] = useState(() => shiftUtcDays(latestDate, 30));
  const [customEnd, setCustomEnd] = useState(latestDate);
  const customRangeError = !customStart || !customEnd || customStart > customEnd;
  const activeRange = useMemo(() => {
    if (rangePreset === "custom" && !customRangeError) return { start: customStart, end: customEnd };
    const preset = rangePresets.find(option => option.key === rangePreset);
    return { start: shiftUtcDays(latestDate, preset?.days ?? 30), end: latestDate };
  }, [customEnd, customRangeError, customStart, latestDate, rangePreset]);
  const timelineArticles = useMemo(
    () => orderedArticles.filter(article => article.eventDate >= activeRange.start && article.eventDate <= activeRange.end),
    [activeRange, orderedArticles],
  );
  const timelineGroups = useMemo<NewsDayGroup[]>(() => {
    const groups = new Map<string, NewsAtlasArticle[]>();
    timelineArticles.forEach(article => groups.set(article.eventDate, [...(groups.get(article.eventDate) || []), article]));
    return [...groups.entries()].map(([date, groupedArticles]) => ({ date, articles: groupedArticles }));
  }, [timelineArticles]);
  const todayKey = new Date().toISOString().slice(0, 10);
  const { nodes, edges } = useMemo(() => graphData(timelineArticles), [timelineArticles]);
  const articleBySlug = useMemo(() => new Map(timelineArticles.map(article => [article.slug, article])), [timelineArticles]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [hovered, setHovered] = useState("");
  const [showLines, setShowLines] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: .72 });
  const [ready, setReady] = useState(false);
  const [reframing, setReframing] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLElement>(null);
  const detailToggle = useRef<HTMLButtonElement>(null);
  const nodeElements = useRef(new Map<string, HTMLButtonElement | HTMLAnchorElement>());
  const lineElements = useRef(new Map<string, { element: SVGLineElement; source: string; target: string }>());
  const size = useRef({ width: 1000, height: 740 });
  const gesture = useRef<{ start: Point; view: View; slug?: string; point?: Point } | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ distance: number; center: Point; view: View } | null>(null);
  const dragged = useRef(false);
  const simulation = useRef<ReturnType<typeof createGraphSimulation> | null>(null);
  const reducedMotion = useRef(false);
  const lastNudge = useRef(0);
  const frameRaf = useRef<number | null>(null);
  const frameTimer = useRef<number | null>(null);
  const reframeTimer = useRef<number | null>(null);
  const reframeSequence = useRef(0);
  const selected = articleBySlug.get(selectedSlug);
  const selectedNodeSlug = detailOpen && selected ? `news:${selected.slug}` : "";
  const selectedNeighbors = useMemo(() => graphNeighbors(selectedNodeSlug, edges), [selectedNodeSlug, edges]);
  const bySlug = useMemo(() => new Map(nodes.map(node => [node.slug, node])), [nodes]);
  const selectedNodeSlugRef = useRef(selectedNodeSlug);
  const selectedNeighborsRef = useRef(selectedNeighbors);
  const labelOpacity = Math.max(0, Math.min(1, (view.scale - .74) / .4));
  const labelsNeedFocus = nodes.length > 24;

  useEffect(() => {
    selectedNodeSlugRef.current = selectedNodeSlug;
    selectedNeighborsRef.current = selectedNeighbors;
  }, [selectedNeighbors, selectedNodeSlug]);

  useEffect(() => {
    if (selectedSlug && !articleBySlug.has(selectedSlug)) {
      setSelectedSlug("");
      setDetailOpen(false);
      setHovered("");
    }
  }, [articleBySlug, selectedSlug]);

  useEffect(() => {
    if (!selectedSlug || !detailOpen || !ready || !window.matchMedia("(max-width: 700px)").matches) return;
    const frameId = window.requestAnimationFrame(() => detail.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    return () => window.cancelAnimationFrame(frameId);
  }, [detailOpen, ready, selectedSlug]);

  const paintPositions = useCallback(() => {
    const moving = simulation.current?.nodes();
    if (!moving) return;
    const positions = new Map(moving.map(node => [node.slug, node]));
    for (const node of moving) {
      const element = nodeElements.current.get(node.slug);
      if (element) element.style.transform = `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`;
    }
    for (const { element, source, target } of lineElements.current.values()) {
      const from = positions.get(source);
      const to = positions.get(target);
      if (!from || !to) continue;
      element.setAttribute("x1", String(from.x));
      element.setAttribute("y1", String(from.y));
      element.setAttribute("x2", String(to.x));
      element.setAttribute("y2", String(to.y));
    }
  }, []);

  useLayoutEffect(paintPositions, [paintPositions]);

  const getPositions = useCallback(() => simulation.current?.nodes() || nodes, [nodes]);

  const armReframing = useCallback(() => {
    if (reframeTimer.current !== null) window.clearTimeout(reframeTimer.current);
    const sequence = ++reframeSequence.current;
    setReframing(true);
    reframeTimer.current = window.setTimeout(() => {
      if (reframeSequence.current === sequence) setReframing(false);
    }, 620);
  }, []);

  const frame = useCallback((items: Array<{ x: number; y: number }>) => {
    if (!items.length) return;
    const { width, height } = size.current;
    const minX = Math.min(...items.map(node => node.x));
    const maxX = Math.max(...items.map(node => node.x));
    const minY = Math.min(...items.map(node => node.y));
    const maxY = Math.max(...items.map(node => node.y));
    const middleX = (minX + maxX) / 2;
    const middleY = (minY + maxY) / 2;
    const spanX = Math.max(280, maxX - minX);
    const spanY = Math.max(240, maxY - minY);
    const scale = Math.max(.22, Math.min(1.15, (width - 110) / (spanX + 170), (height - 110) / (spanY + 170)));
    const nextView = { x: width / 2 - middleX * scale, y: height / 2 - middleY * scale, scale };
    setView(previous => previous.x === nextView.x && previous.y === nextView.y && previous.scale === nextView.scale ? previous : nextView);
    armReframing();
  }, [armReframing]);

  const stopReframing = useCallback(() => {
    reframeSequence.current += 1;
    if (reframeTimer.current !== null) {
      window.clearTimeout(reframeTimer.current);
      reframeTimer.current = null;
    }
    setReframing(false);
  }, []);

  const scheduleFrame = useCallback((delay = 80) => {
    if (frameRaf.current !== null) window.cancelAnimationFrame(frameRaf.current);
    if (frameTimer.current !== null) window.clearTimeout(frameTimer.current);
    frameRaf.current = window.requestAnimationFrame(() => {
      frameRaf.current = null;
      frameTimer.current = window.setTimeout(() => {
        frameTimer.current = null;
        const positions = getPositions();
        const selectedItems = positions.filter(node => node.slug === selectedNodeSlugRef.current || selectedNeighborsRef.current.has(node.slug));
        frame(selectedItems.length ? selectedItems : positions);
      }, delay);
    });
  }, [frame, getPositions]);

  useEffect(() => () => {
    if (frameRaf.current !== null) window.cancelAnimationFrame(frameRaf.current);
    if (frameTimer.current !== null) window.clearTimeout(frameTimer.current);
    if (reframeTimer.current !== null) window.clearTimeout(reframeTimer.current);
  }, []);

  useEffect(() => {
    const engine = createGraphSimulation(nodes, edges);
    simulation.current = engine;
    engine.on("tick", paintPositions);
    const denseGraph = nodes.length > 180;
    engine.alpha(denseGraph ? 0 : .2);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reducedMotion.current = preference.matches;
      if (denseGraph || preference.matches || document.hidden) engine.stop();
      else if (engine.alpha() >= engine.alphaMin()) engine.restart();
    };
    syncMotion();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    return () => {
      engine.stop();
      simulation.current = null;
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
    };
  }, [nodes, edges, paintPositions]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const previous = size.current;
      const next = { width: entry.contentRect.width, height: entry.contentRect.height };
      size.current = next;
      if (!element.dataset.ready) {
        element.dataset.ready = "true";
        setReady(true);
        scheduleFrame(0);
      } else {
        if (next.width !== previous.width || next.height !== previous.height) scheduleFrame(90);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [getPositions, scheduleFrame]);

  useEffect(() => {
    if (!ready) return;
    scheduleFrame(80);
  }, [ready, scheduleFrame, selectedNodeSlug]);

  const zoom = useCallback((factor: number, point = { x: size.current.width / 2, y: size.current.height / 2 }) => {
    setView(previous => {
      const scale = Math.max(.18, Math.min(3, previous.scale * factor));
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
      stopReframing();
      zoom(Math.exp(-delta * .002), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [stopReframing, zoom]);

  function localPoint(event: { clientX: number; clientY: number }) {
    const rect = canvas.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function releaseNode() {
    const engine = simulation.current;
    const slug = gesture.current?.slug;
    if (!engine || !slug) return;
    const node = engine.nodes().find(item => item.slug === slug);
    if (!node || node.fx == null && node.fy == null) return;
    node.fx = null;
    node.fy = null;
    engine.alphaTarget(0);
    if (!reducedMotion.current && !document.hidden) engine.restart();
  }

  function selectArticle(slug: string) {
    if (selectedSlug === slug && detailOpen) {
      clearSelection();
      return;
    }
    setSelectedSlug(slug);
    setDetailOpen(true);
    setHovered("");
  }

  function clearSelection() {
    if (detail.current?.querySelector(".news-atlas-detail-body")?.contains(document.activeElement)) {
      detailToggle.current?.focus({ preventScroll: true });
    }
    setDetailOpen(false);
    setHovered("");
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    event.currentTarget.setPointerCapture(event.pointerId);
    stopReframing();
    if (pointers.current.size === 2) {
      releaseNode();
      const [a, b] = [...pointers.current.values()];
      pinch.current = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, view };
      dragged.current = true;
      return;
    }
    const slug = (event.target as HTMLElement).closest<HTMLElement>("[data-news-node]")?.dataset.newsNode;
    const node = slug ? getPositions().find(item => item.slug === slug) : undefined;
    gesture.current = { start: point, view, slug, point: node ? { x: node.x, y: node.y } : undefined };
    dragged.current = false;
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const point = localPoint(event);
    const engine = simulation.current;
    if (!pointers.current.has(event.pointerId)) {
      if (event.pointerType !== "mouse" || event.buttons) return;
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-news-node]")?.dataset.newsNode || "";
      setHovered(target);
      if (target || reducedMotion.current || !engine || event.timeStamp - lastNudge.current < 64) return;
      lastNudge.current = event.timeStamp;
      if (nudgeGraph(engine.nodes(), (point.x - view.x) / view.scale, (point.y - view.y) / view.scale, 75 / view.scale)) engine.alpha(Math.max(.025, engine.alpha())).restart();
      return;
    }
    pointers.current.set(event.pointerId, point);
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const original = pinch.current;
      const scale = Math.max(.18, Math.min(3, original.view.scale * Math.hypot(a.x - b.x, a.y - b.y) / original.distance));
      setView({ x: (a.x + b.x) / 2 - (original.center.x - original.view.x) * scale / original.view.scale, y: (a.y + b.y) / 2 - (original.center.y - original.view.y) * scale / original.view.scale, scale });
      return;
    }
    const start = gesture.current;
    if (!start || pinch.current) return;
    const dx = point.x - start.start.x;
    const dy = point.y - start.start.y;
    if (Math.hypot(dx, dy) < 8 && !dragged.current) return;
    dragged.current = true;
    if (start.slug && start.point) {
      const node = engine?.nodes().find(item => item.slug === start.slug);
      if (!node) return;
      node.x = node.fx = start.point.x + dx / start.view.scale;
      node.y = node.fy = start.point.y + dy / start.view.scale;
      node.vx = 0;
      node.vy = 0;
      if (reducedMotion.current) paintPositions();
      else engine?.alphaTarget(.25).restart();
    } else {
      setView({ ...start.view, x: start.view.x + dx, y: start.view.y + dy });
    }
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    releaseNode();
    const clicked = event.type === "pointerup" && pointers.current.size === 1 && !dragged.current;
    const slug = gesture.current?.slug;
    if (clicked && slug?.startsWith("news:")) selectArticle(slug.slice(5));
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!pointers.current.size) {
      gesture.current = null;
      pinch.current = null;
    }
  }

  if (!orderedArticles.length) return null;

  return (
    <section className="news-atlas" aria-label="世界最近发生了什么">
      <div className="news-atlas-heading">
        <div>
          <p className="news-kicker">NEWS</p>
          <h1>世界最近发生了什么</h1>
          <div className="news-atlas-range" aria-label="新闻时间范围">
            <div className="news-atlas-range-presets" role="group" aria-label="选择时间范围">
              {rangePresets.map(option => <button key={option.key} className={`news-atlas-range-button${rangePreset === option.key ? " is-active" : ""}`} type="button" aria-pressed={rangePreset === option.key} onClick={() => setRangePreset(option.key)}>{option.label}</button>)}
              <button className={`news-atlas-range-button${rangePreset === "custom" ? " is-active" : ""}`} type="button" aria-pressed={rangePreset === "custom"} onClick={() => setRangePreset("custom")}>自选时间</button>
            </div>
            {rangePreset === "custom" && <div className="news-atlas-range-custom">
              <label>从 <input type="date" value={customStart} min={earliestDate} max={latestDate} onChange={event => setCustomStart(event.target.value)} /></label>
              <span aria-hidden="true">—</span>
              <label>到 <input type="date" value={customEnd} min={earliestDate} max={latestDate} onChange={event => setCustomEnd(event.target.value)} /></label>
            </div>}
            <p className={`news-atlas-range-status${rangePreset === "custom" && customRangeError ? " is-error" : ""}`}>
              {rangePreset === "custom" && customRangeError ? "请选择有效的起止日期" : `${rangeLabel(activeRange.start, activeRange.end)} · ${timelineArticles.length} 篇`}
              <span>按事件发生日筛选</span>
            </p>
          </div>
        </div>
      </div>

      <div className={`news-atlas-layout${selected ? " has-detail" : ""}${detailOpen ? " has-selection" : ""}`}>
        <nav className="news-atlas-dates" aria-label="新闻时间线">
          <div className="news-atlas-timeline-head">
            <div><span>时间线</span><strong>最近进展</strong></div>
            <small>{timelineArticles.length} 篇</small>
          </div>
          <div className="news-atlas-timeline-list">
            {timelineGroups.length ? timelineGroups.map(group => {
              const date = utcDate(group.date);
              const isToday = group.date === todayKey;
              return <section className="news-atlas-day" key={group.date} aria-labelledby={`news-day-${group.date}`}>
                <div className="news-atlas-day-heading">
                  <div><time id={`news-day-${group.date}`} dateTime={group.date}>{longDateFormatter.format(date)}</time><small>{weekdayFormatter.format(date)}{isToday ? " · 今天" : ""}</small></div>
                  <span>{group.articles.length} 篇</span>
                </div>
                <div className="news-atlas-day-list">
                  {group.articles.map(article => {
                    const isSelected = detailOpen && article.slug === selectedSlug;
                    return <button className={`news-atlas-timeline-item${isSelected ? " is-selected" : ""}`} key={article.slug} type="button" aria-pressed={isSelected} onClick={() => selectArticle(article.slug)}>
                      <span className="news-atlas-timeline-marker" aria-hidden="true"><i /></span>
                      <span className="news-atlas-timeline-copy"><strong>{article.title}</strong></span>
                    </button>;
                  })}
                </div>
              </section>;
            }) : <p className="news-atlas-empty">这个时间范围还没有已发布新闻。</p>}
          </div>
        </nav>

        <div ref={canvas} className="news-atlas-map news-atlas-canvas" role="region" aria-label="新闻星图，点击新闻星点查看文章详情，可拖动、缩放或用方向键移动" tabIndex={0}
          onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onPointerLeave={() => { if (!pointers.current.size) setHovered(""); }}
          onKeyDown={event => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "+", "=", "-", "0"].includes(event.key)) event.preventDefault();
            stopReframing();
            if (event.key === "+" || event.key === "=") { armReframing(); zoom(1.25); }
            if (event.key === "-") { armReframing(); zoom(.8); }
            if (event.key === "0") frame(getPositions());
            if (event.key.startsWith("Arrow")) setView(value => ({ ...value, x: value.x + (event.key === "ArrowLeft" ? 50 : event.key === "ArrowRight" ? -50 : 0), y: value.y + (event.key === "ArrowUp" ? 50 : event.key === "ArrowDown" ? -50 : 0) }));
          }}>
          <div className="news-atlas-specks" aria-hidden="true">
            {specks.map((point, index) => <span className="brand-star-only news-atlas-speck" key={`${point.x}-${point.y}`} style={{ left: `${point.x}%`, top: `${point.y}%`, animationDelay: `${index * 120}ms` }} />)}
          </div>
          <div className={`news-atlas-world${reframing ? " is-reframing" : ""}`} style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`, opacity: ready ? 1 : 0 }}>
            <svg className="news-atlas-graph-lines" aria-hidden="true">
              {edges.map(edge => {
                const connected = edge.source === selectedNodeSlug || edge.target === selectedNodeSlug;
                const visible = Boolean(selectedNodeSlug) && showLines && connected;
                const from = bySlug.get(edge.source);
                const to = bySlug.get(edge.target);
                if (!visible || !from || !to) return null;
                const key = `${edge.source}|${edge.target}`;
                return <line key={key} ref={element => {
                  if (element) lineElements.current.set(key, { element, ...edge });
                  else lineElements.current.delete(key);
                }} x1={from.x} y1={from.y} x2={to.x} y2={to.y} strokeLinecap="round" className="news-atlas-graph-line is-connected" />;
              })}
            </svg>
            {nodes.map(node => {
              const article = node.articleSlug ? articleBySlug.get(node.articleSlug) : undefined;
              const connected = selectedNeighbors.has(node.slug);
              const highlighted = node.slug === selectedNodeSlug || connected || node.slug === hovered;
              const hoveredConnected = hovered ? graphNeighbors(hovered, edges).has(node.slug) : false;
              const named = !labelsNeedFocus || highlighted || hoveredConnected;
              const muted = Boolean(selectedNodeSlug) && !highlighted && !hoveredConnected;
              const starSize = node.slug === selectedNodeSlug ? 58 : 39;
              const label = article?.title;
              const classes = `news-atlas-node news-atlas-${node.kind}-node${highlighted ? " is-highlighted" : ""}${node.slug === selectedNodeSlug ? " is-selected" : ""}${node.slug === hovered ? " is-hovered" : ""}${muted ? " is-muted" : ""}`;
              return <button className={classes} key={node.slug} type="button" data-news-node={node.slug} aria-label={`${article ? shortDateFormatter.format(utcDate(article.eventDate)) : ""}：${label}`} aria-pressed={node.slug === selectedNodeSlug} aria-expanded={node.slug === selectedNodeSlug && detailOpen} ref={element => {
                if (element) nodeElements.current.set(node.slug, element);
                else nodeElements.current.delete(node.slug);
              }} style={{ transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)` }} onFocus={() => setHovered(node.slug)} onBlur={() => setHovered("")} onClick={event => { if (article && event.detail === 0) selectArticle(article.slug); }}>
                <span className="brand-star-only news-atlas-node-star" style={{ width: starSize, height: starSize }} aria-hidden="true" />
                <span className="news-atlas-node-copy"><strong className="news-atlas-node-label" style={{ opacity: named ? 1 : labelOpacity }}>{label}</strong>{article && <small>{shortDateFormatter.format(utcDate(article.eventDate))}</small>}</span>
              </button>;
            })}
          </div>
          <div className="news-atlas-graph-controls" aria-label="星图视图控制" onPointerDown={event => event.stopPropagation()}>
            <button type="button" aria-label="放大星图" title="放大" onClick={() => { armReframing(); zoom(1.25); }}><Plus size={18} /></button>
            <button type="button" aria-label="缩小星图" title="缩小" onClick={() => { armReframing(); zoom(.8); }}><Minus size={18} /></button>
            <button type="button" aria-label="显示完整星图" title="显示完整星图" onClick={() => { setReframing(true); frame(getPositions()); }}><CornersOut size={18} /></button>
            <label><input type="checkbox" checked={showLines} disabled={!selectedNodeSlug} onChange={event => setShowLines(event.target.checked)} />显示连线</label>
          </div>
        </div>

        {selected && <aside ref={detail} className={`news-atlas-detail${detailOpen ? " is-open" : ""}`} data-open={detailOpen} aria-label={`${selected.title}详情`} onKeyDown={event => {
          if (event.key === "Escape" && detailOpen) {
            event.preventDefault();
            clearSelection();
            detailToggle.current?.focus({ preventScroll: true });
          }
        }}>
          <button ref={detailToggle} className="news-atlas-detail-toggle" type="button" aria-expanded={detailOpen} aria-controls="news-atlas-detail-content" aria-label={detailOpen ? "收起新闻详情" : "展开新闻详情"} title={detailOpen ? "收起新闻详情" : "展开新闻详情"} onClick={() => detailOpen ? clearSelection() : selectArticle(selected.slug)}><CaretRight size={18} weight="fill" aria-hidden="true" /></button>
          <div className="news-atlas-detail-body" id="news-atlas-detail-content" aria-live="polite" aria-hidden={!detailOpen} inert={!detailOpen}>
          <div className="news-atlas-detail-content">
          <div className="news-atlas-detail-copy">
          <div className="news-atlas-detail-meta"><time dateTime={selected.eventDate}>事件 {longDateFormatter.format(utcDate(selected.eventDate))}</time><span>来源发布 {longDateFormatter.format(utcDate(selected.publishedAt))}</span><span>来源 {selected.source.name}</span>{selected.isExample && <span className="news-atlas-example">示例内容</span>}</div>
          <h2>{selected.title}</h2>
          <p>{selected.summary}</p>
          <div className="news-atlas-related">
            <h3>关联词条</h3>
            {selected.related.map(term => <Link key={term.slug} href={`/terms/${term.slug}`}>{term.zh}<span>{term.en}</span></Link>)}
          </div>
          <Link className="news-atlas-read" href={`/news/${selected.slug}`}>阅读文章 <ArrowUpRight size={19} aria-hidden="true" /></Link>
          </div>
          </div>
          </div>
        </aside>}
      </div>
    </section>
  );
}
