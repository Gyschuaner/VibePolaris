"use client";

import { useState } from "react";
import { ArrowUp, ArrowUpRight, CaretRight } from "@phosphor-icons/react";

import { harnessSources as sources } from "@/lib/harness-references";

type Excerpt = { id: string; heading: string; text: string };

export function HarnessReferences() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [excerptsBySource, setExcerptsBySource] = useState<Record<number, Excerpt[]>>({});

  function show(index: number) {
    // Read the rendered article so excerpts always match the current wording.
    const excerpts = sources[index].citations.flatMap((id) => {
      const target = document.getElementById(id);
      if (!target) return [];
      const excerpt = target.cloneNode(true) as HTMLElement;
      excerpt.querySelectorAll(".vp-term-card, .vp-citation").forEach((card) => card.remove());
      return [{ id, heading: target.closest("section")?.querySelector("h2")?.textContent ?? "正文", text: excerpt.textContent ?? "" }];
    });
    setExcerptsBySource(previous => ({ ...previous, [index]: excerpts }));
    setExpanded(index);
  }

  return (
    <ol className="vp-bibliography" id="references">
      {sources.map((source, index) => (
        <li key={source.url} id={`ref-${index + 1}`} tabIndex={-1}
          onKeyDown={(event) => { if (event.key === "Escape") { setExpanded(null); event.currentTarget.querySelector<HTMLButtonElement>(".vp-bib-toggle")?.focus(); event.stopPropagation(); } }}
        >
          <span className="vp-bib-number" aria-hidden="true">[{index + 1}]</span>
          <div className="vp-bib-entry">
            <div className="vp-bib-meta"><span>{source.publisher}{source.date && <> · <time dateTime={source.date}>{source.date}</time></>}</span><button type="button" className="vp-bib-toggle" aria-label={`查看 ${source.title} 的正文引用`} aria-expanded={expanded === index} aria-controls={`ref-preview-${index}`} onClick={() => { if (expanded === index) setExpanded(null); else show(index); }}><CaretRight size={12} weight="fill" aria-hidden="true" /></button></div>
            <a className="vp-bib-title" href={source.url} target="_blank" rel="noopener noreferrer"><cite>{source.title}</cite><ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="vp-bib-url" href={source.url} target="_blank" rel="noopener noreferrer" tabIndex={-1}>{source.url}</a>
          </div>
          <div className="vp-bib-reveal" data-open={expanded === index} inert={expanded !== index} aria-hidden={expanded !== index}><div className="vp-bib-clip"><div className="vp-bib-preview" id={`ref-preview-${index}`} role="region" aria-label={`${source.title} 在本文中的引用`}>
            {excerptsBySource[index]?.map((excerpt) => <a key={excerpt.id} href={`#${excerpt.id}`} onClick={(event) => {
              event.preventDefault();
              const target = document.getElementById(excerpt.id);
              const reveal = event.currentTarget.closest(".vp-bib-reveal");
              let parent = target?.parentElement;
              while (parent) { if (parent instanceof HTMLDetailsElement) parent.open = true; parent = parent.parentElement; }
              setExpanded(null);
              // Let the collapsing excerpt settle before starting a page scroll.
              requestAnimationFrame(async () => {
                await Promise.all(reveal?.getAnimations().map(animation => animation.finished.catch(() => {})) ?? []);
                if (!target?.isConnected) return;
                if (window.location.hash !== `#${excerpt.id}`) history.pushState(null, "", `#${excerpt.id}`);
                target.tabIndex = -1;
                target.focus({ preventScroll: true });
                target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
              });
            }}><span>{excerpt.heading}<ArrowUp size={15} aria-hidden="true" /></span><blockquote>{excerpt.text}</blockquote></a>)}
          </div></div></div>
        </li>
      ))}
    </ol>
  );
}
