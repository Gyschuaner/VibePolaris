"use client";

import { useEffect, useState } from "react";
import { harnessSectionTitles } from "@/lib/harness-sections";

const items = Object.entries(harnessSectionTitles);

export function HarnessV4Toc() {
  const [activeId, setActiveId] = useState<string>(items[0][0]);

  useEffect(() => {
    const sections = items
      .map(([id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const updateActive = () => {
      const marker = window.innerHeight * 0.28;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
        else break;
      }
      setActiveId((previous) => previous === current ? previous : current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <nav aria-label="本页目录" className="vp-toc">
      <span className="vp-toc-label"><i className="vp-toc-star" aria-hidden="true" />本页</span>
      {items.map(([id, label]) => (
        <a href={`#${id}`} className={activeId === id ? "active" : undefined} aria-current={activeId === id ? "location" : undefined} onClick={() => setActiveId(id)} key={id}>
          {label}
        </a>
      ))}
    </nav>
  );
}
