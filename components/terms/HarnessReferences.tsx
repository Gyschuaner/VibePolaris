"use client";

import { useState } from "react";
import { ArrowUp, ArrowUpRight, CaretRight } from "@phosphor-icons/react";

const sources = [
  { publisher: "Erik S.、Barry Zhang · Anthropic", title: "Building effective agents", date: "2024-12-19", url: "https://www.anthropic.com/engineering/building-effective-agents", citations: ["cite-loop"] },
  { publisher: "Microsoft Learn", title: "Agent Harness", date: "", url: "https://learn.microsoft.com/en-us/agent-framework/concepts/harness", citations: ["cite-harness", "cite-state"] },
  { publisher: "Anthropic · Claude Docs", title: "Tool use with Claude", date: "", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", citations: ["cite-tool-request", "cite-tools"] },
  { publisher: "Model Context Protocol", title: "Architecture overview", date: "", url: "https://modelcontextprotocol.io/docs/learn/architecture", citations: ["cite-mcp"] },
  { publisher: "Justin Young · Anthropic", title: "Effective harnesses for long-running agents", date: "2025-11-26", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", citations: ["cite-verification"] },
  { publisher: "Agent Skills", title: "Agent Skills Overview", date: "", url: "https://agentskills.io/home", citations: ["cite-skills"] },
  { publisher: "Anthropic · Claude Docs", title: "Context windows", date: "", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows", citations: ["cite-context"] },
  { publisher: "Merriam-Webster", title: "Harness", date: "", url: "https://www.merriam-webster.com/dictionary/harness", citations: ["cite-word"] },
  { publisher: "GNU Coreutils · man7.org", title: "df(1) — Linux manual page", date: "", url: "https://man7.org/linux/man-pages/man1/df.1.html", citations: ["cite-df"] },
  { publisher: "GNU Coreutils · man7.org", title: "du(1) — Linux manual page", date: "", url: "https://man7.org/linux/man-pages/man1/du.1.html", citations: ["cite-du"] },
];

type Excerpt = { id: string; heading: string; text: string };

export function HarnessReferences() {
  const [preview, setPreview] = useState<{ index: number; excerpts: Excerpt[] } | null>(null);

  function show(index: number) {
    // Read the rendered article so excerpts always match the current wording.
    const excerpts = sources[index].citations.flatMap((id) => {
      const target = document.getElementById(id);
      if (!target) return [];
      const excerpt = target.cloneNode(true) as HTMLElement;
      excerpt.querySelectorAll(".vp-term-card").forEach((card) => card.remove());
      return [{ id, heading: target.closest("section")?.querySelector("h2")?.textContent ?? "正文", text: excerpt.textContent ?? "" }];
    });
    setPreview({ index, excerpts });
  }

  return (
    <ol className="vp-bibliography" id="references">
      {sources.map((source, index) => (
        <li key={source.url} id={`ref-${index + 1}`}
          onKeyDown={(event) => { if (event.key === "Escape") { setPreview(null); event.stopPropagation(); } }}
        >
          <span className="vp-bib-number" aria-hidden="true">[{index + 1}]</span>
          <div className="vp-bib-entry">
            <div className="vp-bib-meta"><span>{source.publisher}{source.date && <> · <time dateTime={source.date}>{source.date}</time></>}</span><button type="button" className="vp-bib-toggle" aria-label={`查看 ${source.title} 的正文引用`} aria-expanded={preview?.index === index} aria-controls={`ref-preview-${index}`} onClick={() => { if (preview?.index === index) setPreview(null); else show(index); }}><CaretRight size={12} weight="fill" aria-hidden="true" /></button></div>
            <a className="vp-bib-title" href={source.url} target="_blank" rel="noopener noreferrer"><cite>{source.title}</cite><ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="vp-bib-url" href={source.url} target="_blank" rel="noopener noreferrer" tabIndex={-1}>{source.url}</a>
          </div>
          {preview?.index === index && <div className="vp-bib-preview" id={`ref-preview-${index}`} role="region" aria-label={`${source.title} 在本文中的引用`}>
            {preview.excerpts.map((excerpt) => <a key={excerpt.id} href={`#${excerpt.id}`} onClick={() => {
              let parent = document.getElementById(excerpt.id)?.parentElement;
              while (parent) { if (parent instanceof HTMLDetailsElement) parent.open = true; parent = parent.parentElement; }
              setPreview(null);
            }}><span>{excerpt.heading}<ArrowUp size={15} aria-hidden="true" /></span><blockquote>{excerpt.text}</blockquote></a>)}
          </div>}
        </li>
      ))}
    </ol>
  );
}
