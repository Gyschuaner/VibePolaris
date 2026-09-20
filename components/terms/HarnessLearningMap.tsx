import Link from "next/link";
import type { CSSProperties } from "react";

const stars = [
  { slug: "llm", label: "模型调用", x: 10, y: 28 },
  { slug: "tools", label: "工具调用", x: 35, y: 12 },
  { slug: "agent-loop", label: "智能体循环", x: 61, y: 27 },
  { slug: "context", label: "上下文", x: 87, y: 12 },
  { slug: "memory", label: "记忆", x: 90, y: 65 },
  { slug: "prompt", label: "提示词", x: 64, y: 82 },
  { slug: "mcp", label: "MCP", x: 37, y: 65 },
  { slug: "execution-sandbox", label: "沙箱与权限", x: 12, y: 82 },
];

export function HarnessLearningMap() {
  return (
    <nav className="vp-learning-map" aria-label="星图学习路线">
      <svg className="vp-learning-lines is-desktop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={stars.map(({ x, y }) => `${x},${y}`).join(" ")} />
      </svg>
      <svg className="vp-learning-lines is-mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={stars.map((_, index) => `${index % 2 ? 74 : 24},${8 + index * 12}`).join(" ")} />
      </svg>
      <ol>
        {stars.map(({ slug, label, x, y }, index) => (
          <li key={slug} style={{ "--x": `${x}%`, "--y": `${y}%`, "--mobile-x": `${index % 2 ? 74 : 24}%`, "--mobile-y": `${8 + index * 12}%` } as CSSProperties}>
            <Link href={`/terms/${slug}`} className={index < 3 ? "is-foundation" : undefined}>
              <span className="brand-star-only" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
