"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight, CornersOut, Minus, Plus } from "@phosphor-icons/react";
import { createGraphSimulation, graphNeighbors, nudgeGraph, type GraphEdge, type GraphNode } from "@/lib/term-graph";

type RelatedTerm = { slug: string; zh: string; en: string };

export type NewsAtlasArticle = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  isExample: boolean;
  source: { name: string; url: string };
  related: RelatedTerm[];
  relatedArticleSlugs: string[];
};

type Point = { x: number; y: number };
type View = Point & { scale: number };
type NewsGraphNode = GraphNode & {
  kind: "article" | "term";
  articleSlug?: string;
  term?: RelatedTerm;
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

function utcDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function timelineDays(latestDate: string) {
  const latest = utcDate(latestDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(latest);
    date.setUTCDate(latest.getUTCDate() - (6 - index));
    return dateKey(date);
  });
}

function graphData(articles: NewsAtlasArticle[]) {
  const nodes: NewsGraphNode[] = [];
  const edges: GraphEdge[] = [];
  const terms = new Map<string, NewsGraphNode>();
  const articleSlugs = new Set(articles.map(article => article.slug));
  const edgeKeys = new Set<string>();
  const addEdge = (source: string, target: string) => {
    const key = [source, target].sort().join("|");
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ source, target });
  };

  articles.forEach((article, index) => {
    const slug = `news:${article.slug}`;
    const angle = index * 2.399963229728653;
    nodes.push({
      slug,
      zh: article.title,
      en: "NEWS",
      cat: "新闻",
      aliases: [],
      definition: article.summary,
      relatedSlugs: article.related.map(term => term.slug),
      x: Math.cos(angle) * (150 + index * 60),
      y: Math.sin(angle) * (130 + index * 35),
      degree: article.related.length,
      kind: "article",
      articleSlug: article.slug,
    });

    article.related.forEach((related, relatedIndex) => {
      let term = terms.get(related.slug);
      if (!term) {
        const termAngle = (terms.size + relatedIndex) * 2.399963229728653;
        term = {
          slug: related.slug,
          zh: related.zh,
          en: related.en,
          cat: "关联词条",
          aliases: [],
          definition: "",
          relatedSlugs: [],
          x: Math.cos(termAngle) * 250,
          y: Math.sin(termAngle) * 210,
          degree: 0,
          kind: "term",
          term: related,
        };
        terms.set(related.slug, term);
        nodes.push(term);
      }
      term.degree += 1;
      addEdge(slug, related.slug);
    });

    article.relatedArticleSlugs.filter(relatedSlug => relatedSlug !== article.slug && articleSlugs.has(relatedSlug)).forEach(relatedSlug => {
      addEdge(slug, `news:${relatedSlug}`);
    });
  });

  return { nodes, edges };
}

export function NewsAtlas({ articles }: { articles: NewsAtlasArticle[] }) {
  const orderedArticles = useMemo(
    () => [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [articles],
  );
  const days = useMemo(() => timelineDays(orderedArticles[0]?.publishedAt ?? new Date().toISOString().slice(0, 10)), [orderedArticles]);
  const timelineArticles = useMemo(() => orderedArticles.filter(article => days.includes(article.publishedAt)), [days, orderedArticles]);
  const todayKey = new Date().toISOString().slice(0, 10);
  const { nodes, edges } = useMemo(() => graphData(orderedArticles), [orderedArticles]);
  const articleBySlug = useMemo(() => new Map(orderedArticles.map(article => [article.slug, article])), [orderedArticles]);
  const [selectedSlug, setSelectedSlug] = useState(orderedArticles[0]?.slug ?? "");
  const [hovered, setHovered] = useState("");
  const [showLines, setShowLines] = useState(true);
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: .72 });
  const [ready, setReady] = useState(false);
  const [reframing, setReframing] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
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
  const selected = articleBySlug.get(selectedSlug) ?? orderedArticles[0];
  const selectedNodeSlug = selected ? `news:${selected.slug}` : "";
  const selectedNeighbors = useMemo(() => graphNeighbors(selectedNodeSlug, edges), [selectedNodeSlug, edges]);
  const bySlug = useMemo(() => new Map(nodes.map(node => [node.slug, node])), [nodes]);
  const labelOpacity = Math.max(0, Math.min(1, (view.scale - .74) / .4));

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

  useLayoutEffect(paintPositions, [paintPositions, selectedSlug, showLines, hovered]);

  const getPositions = useCallback(() => simulation.current?.nodes() || nodes, [nodes]);

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
    setView({ x: width / 2 - middleX * scale, y: height / 2 - middleY * scale, scale });
    setReframing(true);
  }, []);

  useEffect(() => {
    const engine = createGraphSimulation(nodes, edges);
    simulation.current = engine;
    engine.on("tick", paintPositions);
    engine.alpha(.2);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches || document.hidden) engine.stop();
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
        const selectedItems = getPositions().filter(node => node.slug === selectedNodeSlug || selectedNeighbors.has(node.slug));
        frame(selectedItems.length ? selectedItems : getPositions());
      } else {
        setReframing(false);
        setView(value => ({ ...value, x: value.x + (next.width - previous.width) / 2, y: value.y + (next.height - previous.height) / 2 }));
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [frame, getPositions, selectedNeighbors, selectedNodeSlug]);

  useEffect(() => {
    if (!ready) return;
    const selectedItems = getPositions().filter(node => node.slug === selectedNodeSlug || selectedNeighbors.has(node.slug));
    frame(selectedItems.length ? selectedItems : getPositions());
  // A selected article is the user's explicit framing action; the graph engine owns the live coordinates.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug]);

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
      setReframing(false);
      zoom(Math.exp(-delta * .002), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [zoom]);

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
    setSelectedSlug(slug);
    setHovered("");
    const nodeSlug = `news:${slug}`;
    const related = graphNeighbors(nodeSlug, edges);
    const selectedItems = getPositions().filter(node => node.slug === nodeSlug || related.has(node.slug));
    frame(selectedItems.length ? selectedItems : getPositions());
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
    if (Math.hypot(dx, dy) < 4 && !dragged.current) return;
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

  if (!selected) return null;

  return (
    <section className="news-atlas" aria-label="新闻星历">
      <div className="news-atlas-heading">
        <div>
          <p className="news-kicker">NEWS / 星历</p>
          <h1>星历</h1>
          <p>把进展放回上下文里。</p>
        </div>
        <p className="news-atlas-hint">拖动星点或缩放画布，沿着概念关系继续阅读。</p>
      </div>

      <div className="news-atlas-layout">
        <nav className="news-atlas-dates" aria-label="新闻时间线">
          <div className="news-atlas-timeline-head">
            <div><span>时间线</span><strong>最近进展</strong></div>
            <small>{timelineArticles.length} 篇</small>
          </div>
          <div className="news-atlas-timeline-list">
            {timelineArticles.map(article => {
              const isSelected = article.slug === selected.slug;
              const isToday = article.publishedAt === todayKey;
              const date = utcDate(article.publishedAt);
              return <button className={`news-atlas-timeline-item${isSelected ? " is-selected" : ""}`} key={article.slug} type="button" aria-pressed={isSelected} onClick={() => selectArticle(article.slug)}>
                <span className="news-atlas-timeline-marker" aria-hidden="true"><i /></span>
                <span className="news-atlas-timeline-copy">
                  <span className="news-atlas-timeline-date"><time dateTime={article.publishedAt}>{shortDateFormatter.format(date)}</time>{isToday && <em>今天</em>}</span>
                  <small>{weekdayFormatter.format(date)}</small>
                  <strong>{article.title}</strong>
                </span>
              </button>;
            })}
          </div>
          <div className="news-atlas-timeline-range">
            <span>时间范围</span>
            <time dateTime={days[0]}>{shortDateFormatter.format(utcDate(days[0]))}—{shortDateFormatter.format(utcDate(days[days.length - 1]))}</time>
          </div>
        </nav>

        <div ref={canvas} className="news-atlas-map news-atlas-canvas" role="region" aria-label="新闻与概念关系画布，可拖动、缩放或用方向键移动" tabIndex={0}
          onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onPointerLeave={() => { if (!pointers.current.size) setHovered(""); }}
          onKeyDown={event => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "+", "=", "-", "0"].includes(event.key)) event.preventDefault();
            setReframing(false);
            if (event.key === "+" || event.key === "=") zoom(1.25);
            if (event.key === "-") zoom(.8);
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
                const hoveredConnected = hovered && (edge.source === hovered || edge.target === hovered);
                const visible = showLines || connected || Boolean(hoveredConnected);
                const from = bySlug.get(edge.source);
                const to = bySlug.get(edge.target);
                if (!from || !to) return null;
                const key = `${edge.source}|${edge.target}`;
                return <line key={key} ref={element => {
                  if (element) lineElements.current.set(key, { element, ...edge });
                  else lineElements.current.delete(key);
                }} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`news-atlas-graph-line${connected || hoveredConnected ? " is-connected" : ""}`} style={{ opacity: visible ? undefined : 0 }} />;
              })}
            </svg>
            {nodes.map(node => {
              const article = node.articleSlug ? articleBySlug.get(node.articleSlug) : undefined;
              const connected = selectedNeighbors.has(node.slug);
              const highlighted = node.slug === selectedNodeSlug || connected || node.slug === hovered;
              const hoveredConnected = hovered ? graphNeighbors(hovered, edges).has(node.slug) : false;
              const named = node.kind === "article" || highlighted || hoveredConnected;
              const muted = Boolean(selectedNodeSlug) && !highlighted && !hoveredConnected;
              const starSize = node.kind === "article" ? (node.slug === selectedNodeSlug ? 58 : 39) : 22;
              const label = node.kind === "article" ? article?.title : node.term?.zh;
              const classes = `news-atlas-node news-atlas-${node.kind}-node${highlighted ? " is-highlighted" : ""}${node.slug === selectedNodeSlug ? " is-selected" : ""}${node.slug === hovered ? " is-hovered" : ""}${muted ? " is-muted" : ""}`;
              if (node.kind === "term" && node.term) {
                return <Link className={classes} key={node.slug} href={`/terms/${node.term.slug}`} data-news-node={node.slug} aria-label={`打开词条：${node.term.zh}`} ref={element => {
                  if (element) nodeElements.current.set(node.slug, element);
                  else nodeElements.current.delete(node.slug);
                }} style={{ transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)` }} onFocus={() => setHovered(node.slug)} onBlur={() => setHovered("")}>
                  <span className="brand-star-only news-atlas-node-star" style={{ width: starSize, height: starSize }} aria-hidden="true" /><span className="news-atlas-node-label" style={{ opacity: named ? 1 : labelOpacity }}>{label}</span>
                </Link>;
              }
              return <button className={classes} key={node.slug} type="button" data-news-node={node.slug} aria-label={`${article ? shortDateFormatter.format(utcDate(article.publishedAt)) : ""}：${label}`} aria-pressed={node.slug === selectedNodeSlug} ref={element => {
                if (element) nodeElements.current.set(node.slug, element);
                else nodeElements.current.delete(node.slug);
              }} style={{ transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)` }} onFocus={() => setHovered(node.slug)} onBlur={() => setHovered("")} onClick={event => { if (event.detail === 0 && article) selectArticle(article.slug); }}>
                <span className="brand-star-only news-atlas-node-star" style={{ width: starSize, height: starSize }} aria-hidden="true" />
                <span className="news-atlas-node-copy"><strong className="news-atlas-node-label" style={{ opacity: named ? 1 : labelOpacity }}>{label}</strong>{article && <small>{shortDateFormatter.format(utcDate(article.publishedAt))}</small>}</span>
              </button>;
            })}
          </div>
          <div className="news-atlas-graph-controls" aria-label="星图视图控制" onPointerDown={event => event.stopPropagation()}>
            <button type="button" aria-label="放大星图" title="放大" onClick={() => { setReframing(true); zoom(1.25); }}><Plus size={18} /></button>
            <button type="button" aria-label="缩小星图" title="缩小" onClick={() => { setReframing(true); zoom(.8); }}><Minus size={18} /></button>
            <button type="button" aria-label="显示完整星图" title="显示完整星图" onClick={() => { setReframing(true); frame(getPositions()); }}><CornersOut size={18} /></button>
            <label><input type="checkbox" checked={showLines} onChange={event => setShowLines(event.target.checked)} />显示连线</label>
          </div>
        </div>

        <aside className="news-atlas-detail" aria-live="polite">
          <div className="news-atlas-detail-meta"><time dateTime={selected.publishedAt}>{longDateFormatter.format(utcDate(selected.publishedAt))}</time><span>来源 {selected.source.name}</span>{selected.isExample && <span className="news-atlas-example">示例内容</span>}</div>
          <h2>{selected.title}</h2>
          <p>{selected.summary}</p>
          <div className="news-atlas-related">
            <h3>关联词条</h3>
            {selected.related.map(term => <Link key={term.slug} href={`/terms/${term.slug}`}>{term.zh}<span>{term.en}</span></Link>)}
          </div>
          <Link className="news-atlas-read" href={`/news/${selected.slug}`}>阅读文章 <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </aside>
      </div>
    </section>
  );
}
