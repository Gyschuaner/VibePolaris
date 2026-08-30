"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

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
  "--scale": number;
};

const domains: Domain[] = [
  {
    slug: "frontend",
    title: "前端",
    category: "前端",
    concepts: [
      { id: "component", label: "组件", en: "Component", href: "/terms?q=组件" },
      { id: "state", label: "状态", en: "State", href: "/terms?q=状态" },
      { id: "responsive", label: "响应式", en: "Responsive", href: "/terms?q=响应式" },
      { id: "html", label: "HTML", href: "/terms?q=HTML" },
      { id: "css", label: "CSS", href: "/terms?q=CSS" },
      { id: "form", label: "表单", en: "Form", href: "/terms?q=表单" },
      { id: "dom", label: "DOM", href: "/terms?q=DOM" },
    ],
  },
  {
    slug: "backend",
    title: "后端",
    category: "后端",
    concepts: [
      { id: "api", label: "API 接口", href: "/terms?q=API" },
      { id: "database", label: "数据库", en: "Database", href: "/terms?q=数据库" },
      { id: "auth", label: "认证", en: "Authentication", href: "/terms?q=认证" },
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
  const [activeSlug, setActiveSlug] = useState("ai-agent");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [motionKey, setMotionKey] = useState(0);

  const activeDomain = domains.find((domain) => domain.slug === activeSlug) ?? domains[2];
  const focusedConcept = activeDomain.concepts.find((concept) => concept.id === focusId) ?? null;

  const orbitConcepts = useMemo<Concept[]>(() => {
    if (!focusedConcept) return activeDomain.concepts;
    return [
      {
        id: `${activeDomain.slug}-root`,
        label: activeDomain.title,
        href: `/terms?cat=${encodeURIComponent(activeDomain.category)}`,
      },
      ...activeDomain.concepts.filter((concept) => concept.id !== focusedConcept.id),
    ];
  }, [activeDomain, focusedConcept]);

  const chooseDomain = (slug: string) => {
    if (slug === activeSlug && !focusId) return;
    setActiveSlug(slug);
    setFocusId(null);
    setMotionKey((key) => key + 1);
  };

  const focusConcept = (concept: Concept) => {
    const rootId = `${activeDomain.slug}-root`;
    setFocusId(concept.id === rootId ? null : concept.id);
    setMotionKey((key) => key + 1);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setFocusId((current) => {
        if (!current) return current;
        setMotionKey((key) => key + 1);
        return null;
      });
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

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

      <div id="constellation-field" className="constellation-map" data-motion-key={motionKey}>
        {specks.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            className="brand-star-only constellation-speck"
            style={{ "--x": `${x}%`, "--y": `${y}%` } as CSSProperties}
            aria-hidden="true"
          />
        ))}

        <div key={`center-${motionKey}`} className="constellation-center">
          <span className="brand-star-only constellation-center-star" aria-hidden="true" />
          {focusedConcept ? (
            <Link id="constellation-title" className="constellation-center-link" href={focusedConcept.href}>
              <span>{focusedConcept.label}</span>
              {focusedConcept.en && <small>{focusedConcept.en}</small>}
            </Link>
          ) : (
            <h1 id="constellation-title">{activeDomain.title}</h1>
          )}
        </div>

        <div key={`orbit-${motionKey}`} className="constellation-orbit" aria-label={`${activeDomain.title}相关概念`}>
          {orbitConcepts.slice(0, starSlots.length).map((concept, index) => {
            const slot = starSlots[index];
            const style: StarStyle = {
              "--x": `${slot.x}%`,
              "--y": `${slot.y}%`,
              "--mobile-x": `${slot.mobileX}%`,
              "--mobile-y": `${slot.mobileY}%`,
              "--scale": slot.scale,
            };
            return (
              <button
                key={concept.id}
                className={`concept-star concept-star--${index}${index === 3 ? " is-featured" : ""}`}
                style={style}
                type="button"
                onClick={() => focusConcept(concept)}
                aria-label={`聚焦${concept.label}`}
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
