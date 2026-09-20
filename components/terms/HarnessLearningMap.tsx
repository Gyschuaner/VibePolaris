"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Term } from "@/lib/content";
import { useRouteMeteor } from "@/components/RouteMeteorProvider";

const slots = [
  { x: 15, y: 27, mobileX: 18, mobileY: 24, size: 28 },
  { x: 46, y: 8, mobileX: 47, mobileY: 5, size: 34 },
  { x: 82, y: 21, mobileX: 80, mobileY: 20, size: 27 },
  { x: 88, y: 63, mobileX: 85, mobileY: 58, size: 30 },
  { x: 67, y: 84, mobileX: 71, mobileY: 83, size: 22 },
  { x: 34, y: 76, mobileX: 34, mobileY: 68, size: 24 },
  { x: 11, y: 59, mobileX: 14, mobileY: 49, size: 23 },
  { x: 25, y: 90, mobileX: 22, mobileY: 90, size: 25 },
];

export function HarnessLearningMap({ terms }: { terms: Pick<Term, "slug" | "zh">[] }) {
  const { beginRouteFlight } = useRouteMeteor();

  return (
    <nav className="vp-learning-map" aria-label="Harness 相关词条星图">
      <div className="vp-learning-center" aria-label="当前词条：Harness">
        <span className="brand-star-only" aria-hidden="true" />
        <strong>Harness</strong>
      </div>
      <ul>
        {terms.slice(0, slots.length).map(({ slug, zh }, index) => {
          const { x, y, mobileX, mobileY, size } = slots[index];
          const label = slug === "llm" ? "模型调用" : slug === "execution-sandbox" ? "沙箱与权限" : zh;
          return (
          <li key={slug} style={{ "--x": `${x}%`, "--y": `${y}%`, "--mobile-x": `${mobileX}%`, "--mobile-y": `${mobileY}%`, "--star-size": `${size}px` } as CSSProperties}>
            <svg className="vp-learning-lines is-desktop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="50" y1="48" x2={x} y2={y} />
            </svg>
            <svg className="vp-learning-lines is-mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="50" y1="48" x2={mobileX} y2={mobileY} />
            </svg>
            <Link href={`/terms/${slug}`} onClick={(event) => {
              if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              const star = event.currentTarget.querySelector<HTMLElement>(".brand-star-only");
              if (!star) return;
              event.preventDefault();
              beginRouteFlight(`/terms/${slug}`, star);
            }}>
              <span className="brand-star-only" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </li>
        ); })}
      </ul>
    </nav>
  );
}
