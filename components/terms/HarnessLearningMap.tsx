import Link from "next/link";
import type { CSSProperties } from "react";

const stars = [
  { slug: "llm", label: "模型调用", x: 15, y: 27, mobileX: 18, mobileY: 24, size: 28 },
  { slug: "tools", label: "工具调用", x: 46, y: 8, mobileX: 47, mobileY: 5, size: 34 },
  { slug: "agent-loop", label: "智能体循环", x: 82, y: 21, mobileX: 80, mobileY: 20, size: 27 },
  { slug: "context", label: "上下文", x: 88, y: 63, mobileX: 85, mobileY: 58, size: 30 },
  { slug: "memory", label: "记忆", x: 67, y: 84, mobileX: 71, mobileY: 83, size: 22 },
  { slug: "prompt", label: "提示词", x: 34, y: 76, mobileX: 34, mobileY: 68, size: 24 },
  { slug: "mcp", label: "MCP", x: 11, y: 59, mobileX: 14, mobileY: 49, size: 23 },
  { slug: "execution-sandbox", label: "沙箱与权限", x: 25, y: 90, mobileX: 22, mobileY: 90, size: 25 },
];

export function HarnessLearningMap() {
  return (
    <nav className="vp-learning-map" aria-label="Harness 相关词条星图">
      <div className="vp-learning-center" aria-label="当前词条：Harness">
        <span className="brand-star-only" aria-hidden="true" />
        <strong>Harness</strong>
      </div>
      <ul>
        {stars.map(({ slug, label, x, y, mobileX, mobileY, size }) => (
          <li key={slug} style={{ "--x": `${x}%`, "--y": `${y}%`, "--mobile-x": `${mobileX}%`, "--mobile-y": `${mobileY}%`, "--star-size": `${size}px` } as CSSProperties}>
            <svg className="vp-learning-lines is-desktop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="50" y1="48" x2={x} y2={y} />
            </svg>
            <svg className="vp-learning-lines is-mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="50" y1="48" x2={mobileX} y2={mobileY} />
            </svg>
            <Link href={`/terms/${slug}`}>
              <span className="brand-star-only" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
