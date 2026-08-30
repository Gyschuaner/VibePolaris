"use client";

import { useEffect, useState } from "react";

type Chapter = readonly [id: string, number: string, title: string];

export function CssCourseToc({ chapters }: { chapters: readonly Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.[0] ?? "");

  useEffect(() => {
    const sections = chapters
      .map(([id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const updateActiveSection = () => {
      const readingLine = Math.min(window.innerHeight * 0.3, 260);
      let current = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) current = section.id;
        else break;
      }

      const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      setActiveId(reachedBottom ? sections.at(-1)?.id ?? current : current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [chapters]);

  return (
    <aside className="css-course-toc" aria-label="CSS 教程章节">
      <span>课程目录</span>
      <nav>
        {chapters.map(([id, number, title]) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "location" : undefined}
              onClick={() => setActiveId(id)}
            >
              <small>{number}</small>
              <strong>{title}</strong>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
