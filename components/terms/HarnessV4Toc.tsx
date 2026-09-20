"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { harnessSectionTitles } from "@/lib/harness-sections";

const defaultItems = Object.entries(harnessSectionTitles);

export function HarnessV4Toc({ items = defaultItems }: { items?: [string, string][] }) {
  const navigation = useRef<HTMLElement>(null);
  const star = useRef<HTMLSpanElement>(null);
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
  }, [items]);

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
  }, [activeId]);

  return (
    <nav ref={navigation} aria-label="本页目录" className="vp-toc">
      <span ref={star} className="vp-toc-marker brand-star-only" aria-hidden="true" />
      {items.map(([id, label]) => (
        <a href={`#${id}`} className={activeId === id ? "active" : undefined} aria-current={activeId === id ? "location" : undefined} key={id}>
          {label}
        </a>
      ))}
    </nav>
  );
}
