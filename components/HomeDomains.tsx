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
  "--focus-x": string;
  "--focus-y": string;
  "--mobile-focus-x": string;
  "--mobile-focus-y": string;
  "--nudge-x": string;
  "--nudge-y": string;
};

type MotionPhase = "initial" | "idle" | "collapsing" | "entering";
type FocusPhase = "idle" | "primed" | "anchoring" | "revealed";

type ConceptFocusDetail = {
  definition: string;
  why: string;
  steps: string[];
  related: string[];
};

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
  { x: 21, y: 19, mobileX: 14, mobileY: 18, focusX: 8, focusY: 14, mobileFocusX: 7, mobileFocusY: 11, scale: 1.18 },
  { x: 67, y: 17, mobileX: 64, mobileY: 15, focusX: 75, focusY: 10, mobileFocusX: 72, mobileFocusY: 9, scale: .88 },
  { x: 79, y: 55, mobileX: 66, mobileY: 61, focusX: 94, focusY: 72, mobileFocusX: 85, mobileFocusY: 82, scale: .98 },
  { x: 58, y: 73, mobileX: 18, mobileY: 75, focusX: 93, focusY: 90, mobileFocusX: 78, mobileFocusY: 91, scale: 1.08 },
  { x: 12, y: 62, mobileX: 12, mobileY: 50, focusX: 6, focusY: 76, mobileFocusX: 5, mobileFocusY: 71, scale: .72 },
  { x: 32, y: 79, mobileX: 66, mobileY: 83, focusX: 48, focusY: 94, mobileFocusX: 38, mobileFocusY: 94, scale: .78 },
  { x: 88, y: 34, mobileX: 72, mobileY: 36, focusX: 95, focusY: 24, mobileFocusX: 88, mobileFocusY: 25, scale: .72 },
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
const termBySlug = new Map(termSnippets.map((term) => [term.slug, term]));

const focusDetailsById: Record<string, Omit<ConceptFocusDetail, "definition">> = {
  context: {
    why: "让模型理解当前对话、项目资料和这一次任务的边界。",
    steps: ["历史对话", "当前资料", "任务要求"],
    related: ["上下文窗口", "Token", "记忆"],
  },
  token: {
    why: "帮助判断上下文长度、生成成本，以及内容会不会被截断。",
    steps: ["文本输入", "模型分词", "长度计数"],
    related: ["上下文", "计费", "截断"],
  },
  agent: {
    why: "让模型围绕目标自主拆解步骤，并持续使用信息与工具。",
    steps: ["理解目标", "规划步骤", "执行与校验"],
    related: ["工具调用", "记忆", "工作流"],
  },
  tools: {
    why: "让模型获取实时信息，并完成查询、计算或外部操作。",
    steps: ["工具定义", "生成参数", "执行结果"],
    related: ["MCP", "Function Calling", "Agent"],
  },
  memory: {
    why: "保留之后仍有价值的信息，减少每次从零补充背景。",
    steps: ["提取信息", "选择保存", "需要时召回"],
    related: ["上下文", "长期记忆", "智能体"],
  },
  rag: {
    why: "先找到可信资料，再让模型依据资料回答，减少凭空猜测。",
    steps: ["检索资料", "筛选片段", "依据内容生成"],
    related: ["向量检索", "知识库", "上下文"],
  },
  mcp: {
    why: "用统一协议连接模型、工具和数据源，减少重复接入。",
    steps: ["声明能力", "建立连接", "调用资源"],
    related: ["MCP Server", "工具调用", "数据源"],
  },
};

function getConceptSummary(concept: Concept) {
  const slug = summarySlugs[concept.id] ?? concept.id;
  return termSummaryBySlug.get(slug) ?? `用一句话认识${concept.label}，再进入完整术语页继续阅读。`;
}

function getConceptFocusDetail(concept: Concept): ConceptFocusDetail {
  const slug = summarySlugs[concept.id] ?? concept.id;
  const term = termBySlug.get(slug);
  const tailored = focusDetailsById[concept.id];
  if (tailored) {
    return { definition: getConceptSummary(concept), ...tailored };
  }

  return {
    definition: getConceptSummary(concept),
    why: `先弄清${concept.label}解决什么问题，再决定它要不要放进当前项目。`,
    steps: ["理解边界", "放进项目", "检查结果"],
    related: term?.aliases.slice(0, 3) ?? [concept.label],
  };
}

function hasDedicatedDetailPage(concept: Concept) {
  return concept.href.startsWith("/terms/") && !concept.href.includes("?");
}

export function HomeDomains() {
  const router = useRouter();
  const { beginRouteFlight, isRouteFlying } = useRouteMeteor();
  const [activeSlug, setActiveSlug] = useState("ai-agent");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [focusPhase, setFocusPhase] = useState<FocusPhase>("idle");
  const [motionPhase, setMotionPhase] = useState<MotionPhase>("initial");
  const domainTimersRef = useRef<number[]>([]);
  const focusTimersRef = useRef<number[]>([]);
  const focusedStarRef = useRef<HTMLSpanElement>(null);

  const activeDomain = domains.find((domain) => domain.slug === activeSlug) ?? domains[2];
  const focusedConcept = activeDomain.concepts.find((concept) => concept.id === focusId) ?? null;
  const focusedDetail = focusedConcept ? getConceptFocusDetail(focusedConcept) : null;

  const clearDomainTimers = useCallback(() => {
    domainTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    domainTimersRef.current = [];
  }, []);

  const clearFocusTimers = useCallback(() => {
    focusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    focusTimersRef.current = [];
  }, []);

  const clearConceptFocus = useCallback(() => {
    clearFocusTimers();
    setFocusId(null);
    setFocusPhase("idle");
  }, [clearFocusTimers]);

  const chooseDomain = (slug: string) => {
    if (slug === activeSlug) {
      if (focusId) clearConceptFocus();
      return;
    }

    clearDomainTimers();
    clearConceptFocus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveSlug(slug);
      setMotionPhase("idle");
      return;
    }

    setMotionPhase("collapsing");
    const swapTimer = window.setTimeout(() => {
      setActiveSlug(slug);
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
      if (focusPhase === "revealed") openConcept(concept, source);
      return;
    }

    clearFocusTimers();
    setFocusId(concept.id);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFocusPhase("revealed");
      return;
    }

    setFocusPhase("primed");
    const anchorTimer = window.setTimeout(() => setFocusPhase("anchoring"), 120);
    const revealTimer = window.setTimeout(() => setFocusPhase("revealed"), 520);
    focusTimersRef.current.push(anchorTimer, revealTimer);
  };

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setMotionPhase("idle"), 700);
    return () => {
      window.clearTimeout(initialTimer);
      domainTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      focusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
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
      clearConceptFocus();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [clearConceptFocus, focusId]);

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
        className={`constellation-map is-${motionPhase}${focusedConcept ? ` has-concept-focus is-focus-${focusPhase}` : ""}`}
        aria-busy={motionPhase !== "idle" || (focusedConcept !== null && focusPhase !== "revealed")}
        data-focus-phase={focusedConcept ? focusPhase : undefined}
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
              "--focus-x": `${slot.focusX}%`,
              "--focus-y": `${slot.focusY}%`,
              "--mobile-focus-x": `${slot.mobileFocusX}%`,
              "--mobile-focus-y": `${slot.mobileFocusY}%`,
              "--nudge-x": `${slot.x < 50 ? -3 : 3}px`,
              "--nudge-y": `${slot.y < 49 ? -2 : 2}px`,
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
                aria-label={focused && focusPhase === "revealed" ? `进入${concept.label}详情` : `聚焦${concept.label}`}
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

        {focusedConcept && focusedDetail && (
          <div
            className={`concept-focus-detail${focusPhase === "revealed" ? " is-visible" : ""}`}
            key={`${activeDomain.slug}-${focusedConcept.id}`}
          >
            <p className="concept-focus-kicker">
              {focusedConcept.label}
              {focusedConcept.en && <span>{focusedConcept.en}</span>}
            </p>
            <p className="concept-focus-definition">{focusedDetail.definition}</p>
            <dl className="concept-focus-facts">
              <div>
                <dt>它解决什么</dt>
                <dd>{focusedDetail.why}</dd>
              </div>
              <div>
                <dt>怎么工作</dt>
                <dd className="concept-focus-steps">
                  {focusedDetail.steps.map((step, index) => (
                    <span key={step}>
                      {step}
                      {index < focusedDetail.steps.length - 1 && <b aria-hidden="true">→</b>}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>相关概念</dt>
                <dd className="concept-focus-related">{focusedDetail.related.join(" · ")}</dd>
              </div>
            </dl>
            <button
              className="concept-focus-enter"
              type="button"
              aria-label={`进入${focusedConcept.label}详情`}
              onClick={() => openConcept(focusedConcept, focusedStarRef.current)}
            >
              <span>查看完整词条</span>
              <b aria-hidden="true">→</b>
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
