"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { ArticleNotesRail } from "@/components/notes/ReadingNotes";
import { harnessSectionTitles } from "@/lib/harness-sections";

const defaultItems = Object.entries(harnessSectionTitles);
export type TocItem = [id: string, label: string, depth?: number];

export function HarnessV4Toc({ items = defaultItems, scrollRoot, className = "" }: { items?: TocItem[]; scrollRoot?: RefObject<HTMLElement | null>; className?: string }) {
  const navigation = useRef<HTMLElement>(null);
  const star = useRef<HTMLSpanElement>(null);
  const [activeId, setActiveId] = useState<string>(items[0]?.[0] ?? "");

  useEffect(() => {
    const root = scrollRoot?.current;
    const scroller = root ?? window;
    const sections = items
      .map(([id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const updateActive = () => {
      const marker = root ? root.getBoundingClientRect().top + Math.min(96, root.clientHeight * 0.28) : window.innerHeight * 0.28;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
        else break;
      }
      if (root && root.scrollHeight > root.clientHeight && root.scrollTop + root.clientHeight >= root.scrollHeight - 2) current = sections[sections.length - 1].id;
      setActiveId((previous) => previous === current ? previous : current);
    };

    updateActive();
    scroller.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      scroller.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [items, scrollRoot]);

  useLayoutEffect(() => {
    function revealActive() {
      const nav = navigation.current;
      const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
      if (!nav || !link) return;
      const bounds = nav.getBoundingClientRect();
      const item = link.getBoundingClientRect();
      if (star.current) {
        star.current.style.transform = `translateY(${nav.scrollTop + item.top - bounds.top + (item.height - 16) / 2}px)`;
        star.current.style.opacity = "1";
      }
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
      // Scroll this container only; scrollIntoView would also move the article.
      if (window.matchMedia("(min-width: 901px)").matches) {
        if (item.top < bounds.top + 12 || item.bottom > bounds.bottom - 12) {
          nav.scrollTo({ top: nav.scrollTop + item.top - bounds.top - (nav.clientHeight - item.height) / 2, behavior });
        }
      } else if (item.left < bounds.left + 12 || item.right > bounds.right - 12) {
        nav.scrollTo({ left: nav.scrollLeft + item.left - bounds.left - (nav.clientWidth - item.width) / 2, behavior });
      }
    }

    revealActive();
    const observer = new ResizeObserver(revealActive);
    if (navigation.current) observer.observe(navigation.current);
    return () => observer.disconnect();
  }, [activeId, items]);

  return (
    <ArticleNotesRail><nav ref={navigation} aria-label="本页目录" className={`vp-toc ${className}`}>
      <span ref={star} className="vp-toc-marker brand-star-only" aria-hidden="true" />
      {items.map(([id, label, depth]) => (
        <a href={`#${id}`} className={activeId === id ? "active" : undefined} aria-current={activeId === id ? "location" : undefined} key={id} style={depth === undefined ? undefined : { "--toc-depth": depth } as CSSProperties}
          onClick={event => {
            const root = scrollRoot?.current, section = document.getElementById(id);
            if (!root || !section || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            root.scrollTo({ top: root.scrollTop + section.getBoundingClientRect().top - root.getBoundingClientRect().top - 24, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
            section.focus({ preventScroll: true });
          }}>
          {label}
        </a>
      ))}
    </nav></ArticleNotesRail>
  );
}
