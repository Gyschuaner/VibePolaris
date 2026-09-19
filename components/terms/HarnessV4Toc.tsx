"use client";

import { useEffect, useState } from "react";

const items = [
  ["why", "只有模型时"],
  ["need", "加上 Harness"],
  ["name", "为什么叫 Harness"],
  ["practice", "磁盘例子"],
  ["boundary", "谁在执行"],
  ["tools", "工具"],
  ["inside", "内部组成"],
  ["service", "修服务实验"],
  ["quality", "同一个模型"],
  ["compare", "概念区别"],
  ["code", "循环代码"],
  ["roadmap", "接下来学什么"],
  ["check", "自测"],
  ["related", "相关词条"],
] as const;

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
      <span className="vp-toc-label">本页</span>
      {items.map(([id, label]) => (
        <a href={`#${id}`} className={activeId === id ? "active" : undefined} aria-current={activeId === id ? "location" : undefined} onClick={() => setActiveId(id)} key={id}>
          {label}
        </a>
      ))}
    </nav>
  );
}
