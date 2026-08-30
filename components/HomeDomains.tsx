"use client";

import { useRouter } from "next/navigation";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import { useRouteMeteor } from "@/components/RouteMeteorProvider";
import termSnippets from "@/content/zh/terms.json";

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
  "--edge-x": string;
  "--edge-y": string;
  "--mobile-edge-x": string;
  "--mobile-edge-y": string;
};

type MotionPhase = "initial" | "idle" | "collapsing" | "entering";

const domains: Domain[] = [
  {
    slug: "frontend",
    title: "前端",
    category: "前端",
    concepts: [
      { id: "component", label: "组件", en: "Component", href: "/terms/component" },
      { id: "state", label: "状态", en: "State", href: "/terms/state" },
      { id: "responsive", label: "响应式", en: "Responsive", href: "/terms/responsive" },
      { id: "html", label: "HTML", href: "/terms/html" },
      { id: "css", label: "CSS", href: "/terms/css" },
      { id: "form", label: "表单", en: "Form", href: "/terms/form" },
      { id: "dom", label: "DOM", href: "/terms/dom" },
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
      { id: "cache", label: "缓存", en: "Cache", href: "/terms/cache" },
      { id: "queue", label: "队列", en: "Queue", href: "/terms/queue" },
      { id: "rest", label: "REST", href: "/terms/rest" },
      { id: "webhook", label: "Webhook", href: "/terms/webhook" },
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
      { id: "tools", label: "工具调用", en: "Tools", href: "/terms/tools" },
      { id: "memory", label: "记忆", en: "Memory", href: "/terms/memory" },
      { id: "rag", label: "RAG", href: "/terms/rag" },
      { id: "mcp", label: "MCP", href: "/terms/mcp" },
    ],
  },
  {
    slug: "stack",
    title: "技术栈",
    category: "技术栈",
    concepts: [
      { id: "framework", label: "框架", en: "Framework", href: "/terms/framework" },
      { id: "library", label: "库", en: "Library", href: "/terms/library" },
      { id: "rendering", label: "SSG / SSR", href: "/terms/ssg-ssr" },
      { id: "deploy", label: "部署", en: "Deploy", href: "/terms/deploy" },
      { id: "runtime", label: "运行时", en: "Runtime", href: "/terms/runtime" },
      { id: "package", label: "包管理", href: "/terms/package" },
      { id: "typescript", label: "TypeScript", href: "/terms/typescript" },
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
      { id: "ia", label: "信息架构", href: "/terms/ia" },
      { id: "prototype", label: "原型", en: "Prototype", href: "/terms/prototype" },
      { id: "system", label: "设计系统", href: "/terms/design-system" },
      { id: "a11y", label: "无障碍", href: "/terms/a11y" },
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

const summarySlugs: Record<string, string> = {
  rendering: "ssg-ssr",
  flow: "user-flow",
  system: "design-system",
};

const termSummaryBySlug = new Map(termSnippets.map((term) => [term.slug, term.say]));

function getConceptSummary(concept: Concept) {
  const slug = summarySlugs[concept.id] ?? concept.id;
  return termSummaryBySlug.get(slug) ?? `用一句话认识${concept.label}，再进入完整术语页继续阅读。`;
}

function hasDedicatedDetailPage(concept: Concept) {
  return concept.href.startsWith("/terms/") && !concept.href.includes("?");
}

export function HomeDomains() {
  const router = useRouter();
  const { beginRouteFlight, isRouteFlying } = useRouteMeteor();
  const [activeSlug, setActiveSlug] = useState("ai-agent");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [motionPhase, setMotionPhase] = useState<MotionPhase>("initial");
  const domainTimersRef = useRef<number[]>([]);
  const focusedStarRef = useRef<HTMLSpanElement>(null);

  const activeDomain = domains.find((domain) => domain.slug === activeSlug) ?? domains[2];
  const focusedConcept = activeDomain.concepts.find((concept) => concept.id === focusId) ?? null;

  const clearDomainTimers = useCallback(() => {
    domainTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    domainTimersRef.current = [];
  }, []);

  const chooseDomain = (slug: string) => {
    if (slug === activeSlug) {
      if (focusId) setFocusId(null);
      return;
    }

    clearDomainTimers();
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

  const openConcept = (concept: Concept, source: HTMLElement | null) => {
    if (isRouteFlying) return;
    if (hasDedicatedDetailPage(concept) && source) {
      beginRouteFlight(concept.href, source);
      return;
    }
    router.push(concept.href);
  };

  const focusConcept = (concept: Concept, source: HTMLElement | null) => {
    if (isRouteFlying) return;
    if (focusId === concept.id) {
      openConcept(concept, source);
      return;
    }
    setFocusId(concept.id);
  };

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setMotionPhase("idle"), 700);
    return () => {
      window.clearTimeout(initialTimer);
      domainTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    activeDomain.concepts.forEach((concept) => {
      if (concept.href.startsWith("/terms/") && !concept.href.includes("?")) {
        router.prefetch(concept.href);
      }
    });
  }, [activeDomain, router]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!focusId) return;
      setFocusId(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [focusId]);

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
        className={`constellation-map is-${motionPhase}${focusedConcept ? " has-concept-focus" : ""}`}
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

        <div className="constellation-center">
          <span
            className="brand-star-only constellation-center-star"
            aria-hidden="true"
          />
          <h1 id="constellation-title">{activeDomain.title}</h1>
        </div>

        <div className="constellation-orbit" aria-label={`${activeDomain.title}相关概念`}>
          {activeDomain.concepts.slice(0, starSlots.length).map((concept, slotIndex) => {
            const slot = starSlots[slotIndex];
            const focused = concept.id === focusId;
            const muted = focusId !== null && !focused;
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
              "--edge-x": `${slot.x < 50 ? -4.5 : 4.5}vw`,
              "--edge-y": `${slot.y < 49 ? -3.5 : 3.5}vh`,
              "--mobile-edge-x": `${slot.mobileX < 50 ? -4 : 4}vw`,
              "--mobile-edge-y": `${slot.mobileY < 40 ? -2.5 : 2.5}vh`,
            };
            return (
              <button
                key={concept.id}
                className={`concept-star concept-star--${slotIndex}${slotIndex === 3 ? " is-featured" : ""}${focused ? " is-focused" : ""}${muted ? " is-muted" : ""}`}
                style={style}
                type="button"
                onClick={(event) => {
                  const source = event.currentTarget.querySelector<HTMLElement>(".concept-star-mark");
                  focusConcept(concept, source);
                }}
                aria-label={focused ? `进入${concept.label}详情` : `聚焦${concept.label}`}
                aria-pressed={focused}
              >
                <span
                  ref={focused ? focusedStarRef : undefined}
                  className="brand-star-only concept-star-mark"
                  aria-hidden="true"
                />
                <span className="concept-star-label">
                  <strong>{concept.label}</strong>
                  {concept.en && <small>{concept.en}</small>}
                </span>
              </button>
            );
          })}
        </div>

        {focusedConcept && (
          <div className="concept-focus-detail" key={`${activeDomain.slug}-${focusedConcept.id}`}>
            <p>{getConceptSummary(focusedConcept)}</p>
            <button
              className="concept-focus-enter"
              type="button"
              aria-label={`进入${focusedConcept.label}详情`}
              onClick={() => openConcept(focusedConcept, focusedStarRef.current)}
            >
              →
            </button>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {focusedConcept
            ? `已聚焦${focusedConcept.label}。${getConceptSummary(focusedConcept)}再次点击可进入详情。`
            : `当前中心主题：${activeDomain.title}`}
        </p>
      </div>
    </section>
  );
}
