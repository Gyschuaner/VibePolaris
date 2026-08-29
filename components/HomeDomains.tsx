"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";

type DomainItem = {
  label: string;
  href: string;
  en?: string;
  current?: boolean;
  arrow?: boolean;
  note?: string;
};

type Domain = {
  slug: string;
  title: string;
  copy: string;
  summary: string[];
  category: string;
  brand?: boolean;
  items: DomainItem[];
};

const domains: Domain[] = [
  {
    slug: "frontend", title: "前端", copy: "网页在浏览器中的呈现与交互实现。", summary: ["HTML", "CSS"], category: "前端",
    items: [
      { label: "组件", en: "Component", href: "/terms?q=组件" },
      { label: "状态", en: "State", href: "/terms?q=状态" },
      { label: "响应式布局", en: "Responsive", href: "/terms?q=响应式" },
    ],
  },
  {
    slug: "backend", title: "后端", copy: "处理业务逻辑、数据与服务的工程实现。", summary: ["API 接口", "数据库"], category: "后端",
    items: [
      { label: "API 接口", href: "/terms?q=API" },
      { label: "数据库", en: "Database", href: "/terms?q=数据库" },
      { label: "认证", en: "Authentication", href: "/terms?q=认证" },
    ],
  },
  {
    slug: "ai-agent", title: "AI · Agent", copy: "模型怎样理解信息、调用工具并完成任务。", summary: ["上下文", "Token"], category: "AI·Agent", brand: true,
    items: [
      { label: "大模型", en: "LLM", href: "/terms?q=大模型" },
      { label: "上下文", en: "Context", href: "/terms/context", current: true, note: "让模型知道之前说过什么、当前项目是什么样。" },
      { label: "Token", href: "/terms/token", arrow: true },
      { label: "智能体", en: "Agent", href: "/terms/agent", arrow: true },
    ],
  },
  {
    slug: "stack", title: "技术栈", copy: "开发所用语言、框架与基础工具的组合。", summary: ["框架", "部署与托管"], category: "技术栈",
    items: [
      { label: "框架与库", en: "Framework", href: "/terms/framework" },
      { label: "SSG / SSR", href: "/terms/ssg-ssr" },
      { label: "部署与托管", en: "Deploy", href: "/terms/deploy" },
    ],
  },
  {
    slug: "product", title: "产品与设计", copy: "从需求到体验，构建可用与可迭代的产品。", summary: ["用户流程", "信息架构"], category: "产品与设计",
    items: [
      { label: "MVP", href: "/terms/mvp" },
      { label: "用户流程", en: "User Flow", href: "/terms/user-flow" },
      { label: "线框图", en: "Wireframe", href: "/terms/wireframe" },
    ],
  },
];

export function HomeDomains() {
  const gridRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const domainNodes = Array.from(grid.querySelectorAll<HTMLElement>(".domain"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    const activate = (target: HTMLElement) => {
      if (target.classList.contains("is-active")) return;
      domainNodes.forEach((domain) => {
        const active = domain === target;
        const trigger = domain.querySelector<HTMLButtonElement>(".domain-trigger");
        const detail = domain.querySelector<HTMLElement>(".domain-detail");
        domain.classList.toggle("is-active", active);
        trigger?.setAttribute("aria-expanded", String(active));
        if (!detail) return;

        window.clearTimeout(Number(detail.dataset.timer || 0));
        if (active) {
          const wasHidden = detail.hidden;
          detail.hidden = false;
          detail.setAttribute("aria-hidden", "false");
          detail.classList.remove("is-leaving");
          if (!reduceMotion && wasHidden) {
            detail.classList.add("is-entering");
            requestAnimationFrame(() => requestAnimationFrame(() => detail.classList.remove("is-entering")));
          }
        } else if (!detail.hidden) {
          detail.setAttribute("aria-hidden", "true");
          if (reduceMotion) {
            detail.hidden = true;
          } else {
            domain.classList.add("is-leaving");
            detail.classList.add("is-leaving");
            const timer = window.setTimeout(() => {
              if (!domain.classList.contains("is-active")) detail.hidden = true;
              detail.classList.remove("is-leaving");
              domain.classList.remove("is-leaving");
            }, 150);
            detail.dataset.timer = String(timer);
          }
        }
      });
    };

    domainNodes.forEach((domain) => {
      const trigger = domain.querySelector<HTMLButtonElement>(".domain-trigger");
      const handler = () => activate(domain);
      trigger?.addEventListener("click", handler);
      cleanups.push(() => trigger?.removeEventListener("click", handler));
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <section ref={gridRef} className="domain-grid" aria-label="精选技术领域">
      {domains.map((domain) => {
        const active = domain.slug === "ai-agent";
        return (
          <article key={domain.slug} className={`domain${active ? " is-active" : ""}`} data-domain={domain.slug}>
            <button className="domain-trigger" type="button" aria-expanded={active} aria-controls={`domain-detail-${domain.slug}`}>
              <span className={`domain-title${domain.brand ? " domain-title--brand" : ""}`}>
                {domain.brand && <span className="brand-star-only" aria-hidden="true" />}{domain.title}
              </span>
              <span className="domain-copy">{domain.copy}</span>
            </button>
            <div className="domain-summary" aria-hidden="true">{domain.summary.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="domain-detail" id={`domain-detail-${domain.slug}`} hidden={!active} aria-hidden={!active}>
              {domain.items.map((item) => (
                <Fragment key={item.href}>
                  <Link className={item.current ? "is-current" : undefined} href={item.href}>
                    {item.label}{item.en && <span>{item.en}</span>}{(item.current || item.arrow) && <b>→</b>}
                  </Link>
                  {item.note && <><p>{item.note}</p><div className="context-flow" aria-label="上下文组成">之前的对话 <i>+</i> 当前文件 <i>+</i> 任务要求 <b>→</b> 上下文</div></>}
                </Fragment>
              ))}
            </div>
            <Link className="domain-enter" href={`/terms?cat=${encodeURIComponent(domain.category)}`} aria-label={`进入${domain.title}章节`}><span aria-hidden="true">→</span></Link>
          </article>
        );
      })}
    </section>
  );
}
