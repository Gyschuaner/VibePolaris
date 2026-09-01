"use client";

import { useState } from "react";

import type { Tool } from "@/lib/content";

export function ToolsBrowser({ tools }: { tools: Tool[] }) {
  const categories = ["全部", ...Array.from(new Set(tools.map((tool) => tool.category)))];
  const [active, setActive] = useState("全部");

  return (
    <>
      <div className="chips" aria-label="工具分类">
        {categories.map((category) => (
          <button key={category} className={`fchip${active === category ? " on" : ""}`} type="button" onClick={() => setActive(category)}>
            {category}
          </button>
        ))}
      </div>
      <section className="tools-list">
        {tools.filter((tool) => active === "全部" || tool.category === active).map((tool) => (
          <div className="toolrow" key={tool.name}>
            <span className="tn">{tool.name}</span><span className="td">{tool.description}</span><span className="tt">{tool.category}</span>
          </div>
        ))}
      </section>
    </>
  );
}
