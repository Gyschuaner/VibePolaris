"use client";

import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouteMeteor } from "@/components/RouteMeteorProvider";

type Concept = {
  id: string;
  label: string;
  en?: string;
  href: string;
};

type Domain = {
  slug: string;
  title: string;
  category: string;
  concepts: Concept[];
};

type StarStyle = CSSProperties & {
  "--x": string;
  "--y": string;
  "--mobile-x": string;
  "--mobile-y": string;
  "--enter-x": string;
  "--enter-y": string;
  "--mobile-enter-x": string;
  "--mobile-enter-y": string;
  "--delay": string;
  "--collapse-delay": string;
  "--scale": number;
};

type OrbitConcept = {
  concept: Concept;
  slotIndex: number;
};

type SwapFlight = {
  slotIndex: number;
  nextFocusId: string | null;
};

type FlightStyle = CSSProperties & {
  "--flight-x": string;
  "--flight-y": string;
  "--flight-mid-x": string;
  "--flight-mid-y": string;
  "--mobile-flight-x": string;
  "--mobile-flight-y": string;
  "--mobile-flight-mid-x": string;
  "--mobile-flight-mid-y": string;
  "--flight-size": string;
  "--mobile-flight-size": string;
};

type MotionPhase = "initial" | "idle" | "collapsing" | "entering" | "swapping" | "settling";

const domains: Domain[] = [
  {
    slug: "frontend",
    title: "前端",
    category: "前端",
    concepts: [
      { id: "component", label: "组件", en: "Component", href: "/terms/component" },
      { id: "state", label: "状态", en: "State", href: "/terms/state" },
      { id: "responsive", label: "响应式", en: "Responsive", href: "/terms/responsive" },
      { id: "html", label: "HTML", href: "/terms?q=HTML" },
      { id: "css", label: "CSS", href: "/terms/css" },
      { id: "form", label: "表单", en: "Form", href: "/terms/form" },
      { id: "dom", label: "DOM", href: "/terms?q=DOM" },
    ],
  },
  {
    slug: "backend",
    title: "后端",
    category: "后端",
    concepts: [
      { id: "api", label: "API 接口", href: "/terms/api" },
      { id: "database", label: "数据库", en: "Database", href: "/terms/database" },
      { id: "auth", label: "认证", en: "Authentication", href: "/terms/auth" },
      { id: "cache", label: "缓存", en: "Cache", href: "/terms?q=缓存" },
      { id: "queue", label: "队列", en: "Queue", href: "/terms?q=队列" },
      { id: "rest", label: "REST", href: "/terms?q=REST" },
      { id: "webhook", label: "Webhook", href: "/terms?q=Webhook" },
    ],
  },
  {
    slug: "ai-agent",
    title: "AI · Agent",
    category: "AI·Agent",
    concepts: [
      { id: "context", label: "上下文", en: "Context", href: "/terms/context" },
      { id: "token", label: "Token", href: "/terms/token" },
      { id: "agent", label: "智能体", en: "Agent", href: "/terms/agent" },
      { id: "tools", label: "工具调用", en: "Tools", href: "/terms?q=工具调用" },
      { id: "memory", label: "记忆", en: "Memory", href: "/terms?q=记忆" },
      { id: "rag", label: "RAG", href: "/terms?q=RAG" },
      { id: "mcp", label: "MCP", href: "/terms?q=MCP" },
    ],
  },
  {
    slug: "stack",
    title: "技术栈",
    category: "技术栈",
    concepts: [
      { id: "framework", label: "框架", en: "Framework", href: "/terms/framework" },
      { id: "library", label: "库", en: "Library", href: "/terms/framework" },
      { id: "rendering", label: "SSG / SSR", href: "/terms/ssg-ssr" },
      { id: "deploy", label: "部署", en: "Deploy", href: "/terms/deploy" },
      { id: "runtime", label: "运行时", en: "Runtime", href: "/terms?q=运行时" },
      { id: "package", label: "包管理", href: "/terms?q=包管理" },
      { id: "typescript", label: "TypeScript", href: "/terms?q=TypeScript" },
    ],
  },
  {
    slug: "product",
    title: "产品与设计",
    category: "产品与设计",
    concepts: [
      { id: "mvp", label: "MVP", href: "/terms/mvp" },
      { id: "flow", label: "用户流程", en: "User Flow", href: "/terms/user-flow" },
      { id: "wireframe", label: "线框图", en: "Wireframe", href: "/terms/wireframe" },
      { id: "ia", label: "信息架构", href: "/terms?q=信息架构" },
      { id: "prototype", label: "原型", en: "Prototype", href: "/terms?q=原型" },
      { id: "system", label: "设计系统", href: "/terms?q=设计系统" },
      { id: "a11y", label: "无障碍", href: "/terms?q=无障碍" },
    ],
  },
];

const starSlots = [
  { x: 21, y: 19, mobileX: 14, mobileY: 18, scale: 1.18 },
  { x: 67, y: 17, mobileX: 64, mobileY: 15, scale: .88 },
  { x: 79, y: 55, mobileX: 66, mobileY: 61, scale: .98 },
  { x: 58, y: 73, mobileX: 18, mobileY: 75, scale: 1.08 },
  { x: 12, y: 62, mobileX: 12, mobileY: 50, scale: .72 },
  { x: 32, y: 79, mobileX: 66, mobileY: 83, scale: .78 },
  { x: 88, y: 34, mobileX: 72, mobileY: 36, scale: .72 },
];

const specks = [
  [6, 13], [18, 44], [38, 8], [55, 87], [74, 31], [86, 12], [92, 73], [47, 57],
];

export function HomeDomains() {
  const { beginRouteFlight, isRouteFlying } = useRouteMeteor();
  const [activeSlug, setActiveSlug] = useState("ai-agent");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [motionPhase, setMotionPhase] = useState<MotionPhase>("initial");
  const [swapFlight, setSwapFlight] = useState<SwapFlight | null>(null);
  const domainTimersRef = useRef<number[]>([]);
  const centerStarRef = useRef<HTMLSpanElement>(null);

  const activeDomain = domains.find((domain) => domain.slug === activeSlug) ?? domains[2];
  const focusedConcept = activeDomain.concepts.find((concept) => concept.id === focusId) ?? null;
  const rootConcept = useMemo<Concept>(() => ({
    id: `${activeDomain.slug}-root`,
    label: activeDomain.title,
    href: `/terms?cat=${encodeURIComponent(activeDomain.category)}`,
  }), [activeDomain]);
  const centerIdentity = focusedConcept?.id ?? rootConcept.id;

  const orbitConcepts = useMemo<OrbitConcept[]>(() =>
    activeDomain.concepts.map((concept, slotIndex) => ({
      concept: focusedConcept?.id === concept.id ? rootConcept : concept,
      slotIndex,
    })), [activeDomain, focusedConcept, rootConcept]);

  const clearDomainTimers = useCallback(() => {
    domainTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    domainTimersRef.current = [];
  }, []);

  const beginFocusSwap = useCallback((nextFocusId: string | null, slotIndex: number, onSettled?: () => void) => {
    clearDomainTimers();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFocusId(nextFocusId);
      setSwapFlight(null);
      setMotionPhase("idle");
      if (onSettled) window.requestAnimationFrame(onSettled);
      return;
    }

    setSwapFlight({ slotIndex, nextFocusId });
    setMotionPhase("swapping");
    const contentTimer = window.setTimeout(() => {
      setFocusId(nextFocusId);
      setMotionPhase("settling");
    }, 210);
    const finishTimer = window.setTimeout(() => {
      setSwapFlight(null);
      setMotionPhase("idle");
      if (onSettled) window.requestAnimationFrame(onSettled);
    }, 470);
    domainTimersRef.current.push(contentTimer, finishTimer);
  }, [clearDomainTimers]);

  const chooseDomain = (slug: string) => {
    if (slug === activeSlug) {
      if (focusId && !swapFlight) {
        const slotIndex = activeDomain.concepts.findIndex((concept) => concept.id === focusId);
        if (slotIndex >= 0) beginFocusSwap(null, slotIndex);
      }
      return;
    }

    clearDomainTimers();
    setSwapFlight(null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveSlug(slug);
      setFocusId(null);
      setMotionPhase("idle");
      return;
    }

    setMotionPhase("collapsing");
    const swapTimer = window.setTimeout(() => {
      setActiveSlug(slug);
      setFocusId(null);
      setMotionPhase("entering");
      const settleTimer = window.setTimeout(() => setMotionPhase("idle"), 560);
      domainTimersRef.current.push(settleTimer);
    }, 150);
    domainTimersRef.current.push(swapTimer);
  };

  const focusConcept = (concept: Concept, slotIndex: number) => {
    if (swapFlight || isRouteFlying) return;
    const rootId = `${activeDomain.slug}-root`;
    const nextFocusId = concept.id === rootId ? null : concept.id;
    const hasDetailPage = nextFocusId !== null && concept.href.startsWith("/terms/") && !concept.href.includes("?");
    beginFocusSwap(nextFocusId, slotIndex, hasDetailPage ? () => {
      if (centerStarRef.current) beginRouteFlight(concept.href, centerStarRef.current);
    } : undefined);
  };

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setMotionPhase("idle"), 700);
    return () => {
      window.clearTimeout(initialTimer);
      domainTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!focusId || swapFlight) return;
      const slotIndex = activeDomain.concepts.findIndex((concept) => concept.id === focusId);
      if (slotIndex >= 0) beginFocusSwap(null, slotIndex);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeDomain, beginFocusSwap, focusId, swapFlight]);

  const flightSlot = swapFlight ? starSlots[swapFlight.slotIndex] : null;
  const flightStyle: FlightStyle | undefined = flightSlot ? {
    "--flight-x": `${flightSlot.x}%`,
    "--flight-y": `${flightSlot.y}%`,
    "--flight-mid-x": `${(flightSlot.x + 50) / 2}%`,
    "--flight-mid-y": `${(flightSlot.y + 49) / 2 - 3}%`,
    "--mobile-flight-x": `${flightSlot.mobileX}%`,
    "--mobile-flight-y": `${flightSlot.mobileY}%`,
    "--mobile-flight-mid-x": `${(flightSlot.mobileX + 50) / 2}%`,
    "--mobile-flight-mid-y": `${(flightSlot.mobileY + 40) / 2 - 2}%`,
    "--flight-size": `${swapFlight?.slotIndex === 3 ? 31 : 22}px`,
    "--mobile-flight-size": `${swapFlight?.slotIndex === 3 ? 21 : 16}px`,
  } : undefined;

  return (
    <section className="constellation-shell" aria-labelledby="constellation-title">
      <nav className="domain-rail" aria-label="技术领域">
        {domains.map((domain) => {
          const active = domain.slug === activeSlug;
          return (
            <button
              key={domain.slug}
              className={`domain-rail-item${active ? " is-active" : ""}`}
              type="button"
              aria-pressed={active}
              aria-controls="constellation-field"
              onClick={() => chooseDomain(domain.slug)}
            >
              {active && <span className="brand-star-only domain-rail-star" aria-hidden="true" />}
              <span>{domain.title}</span>
            </button>
          );
        })}
      </nav>

      <div
        id="constellation-field"
        className={`constellation-map is-${motionPhase}`}
        aria-busy={motionPhase !== "idle"}
      >
        {specks.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            className="brand-star-only constellation-speck"
            style={{ "--x": `${x}%`, "--y": `${y}%` } as CSSProperties}
            aria-hidden="true"
          />
        ))}

        {flightStyle && (
          <div className="constellation-flight" style={flightStyle} aria-hidden="true">
            <span className="brand-star-only constellation-flight-star is-to-center" />
            <span className="brand-star-only constellation-flight-star is-to-orbit" />
          </div>
        )}

        <div className="constellation-center">
          <span
            ref={centerStarRef}
            key={`center-star-${centerIdentity}`}
            className="brand-star-only constellation-center-star"
            aria-hidden="true"
          />
          {focusedConcept ? (
            <Link
              key={`center-label-${centerIdentity}`}
              id="constellation-title"
              className="constellation-center-link"
              href={focusedConcept.href}
              onClick={(event) => {
                if (!focusedConcept.href.startsWith("/terms/") || focusedConcept.href.includes("?") || !centerStarRef.current) return;
                event.preventDefault();
                beginRouteFlight(focusedConcept.href, centerStarRef.current);
              }}
            >
              <span>{focusedConcept.label}</span>
              {focusedConcept.en && <small>{focusedConcept.en}</small>}
            </Link>
          ) : (
            <h1 key={`center-label-${centerIdentity}`} id="constellation-title">{activeDomain.title}</h1>
          )}
        </div>

        <div className="constellation-orbit" aria-label={`${activeDomain.title}相关概念`}>
          {orbitConcepts.slice(0, starSlots.length).map(({ concept, slotIndex }) => {
            const slot = starSlots[slotIndex];
            const style: StarStyle = {
              "--x": `${slot.x}%`,
              "--y": `${slot.y}%`,
              "--mobile-x": `${slot.mobileX}%`,
              "--mobile-y": `${slot.mobileY}%`,
              "--enter-x": `${(50 - slot.x) * .085}vw`,
              "--enter-y": `${(49 - slot.y) * .07}vh`,
              "--mobile-enter-x": `${(50 - slot.mobileX) * .11}vw`,
              "--mobile-enter-y": `${(40 - slot.mobileY) * .065}vh`,
              "--delay": `${70 + slotIndex * 24}ms`,
              "--collapse-delay": `${(starSlots.length - slotIndex - 1) * 7}ms`,
              "--scale": slot.scale,
            };
            return (
              <button
                key={concept.id}
                className={`concept-star concept-star--${slotIndex}${slotIndex === 3 ? " is-featured" : ""}${swapFlight?.slotIndex === slotIndex ? " is-swap-source" : ""}`}
                style={style}
                type="button"
                onClick={() => focusConcept(concept, slotIndex)}
                aria-label={concept.href.startsWith("/terms/") && !concept.href.includes("?") ? `打开${concept.label}术语` : `聚焦${concept.label}`}
              >
                <span className="brand-star-only concept-star-mark" aria-hidden="true" />
                <span className="concept-star-label">
                  <strong>{concept.label}</strong>
                  {concept.en && <small>{concept.en}</small>}
                </span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          当前中心主题：{focusedConcept ? `${focusedConcept.label}${focusedConcept.en ? ` ${focusedConcept.en}` : ""}` : activeDomain.title}
        </p>
      </div>
    </section>
  );
}
