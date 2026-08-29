"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import type { Term } from "@/lib/content";

export function TermsBrowser({ terms, categories }: { terms: Term[]; categories: string[] }) {
  const locationSearch = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("popstate", onStoreChange);
      return () => window.removeEventListener("popstate", onStoreChange);
    },
    () => window.location.search,
    () => "",
  );
  const params = useMemo(() => new URLSearchParams(locationSearch), [locationSearch]);
  const query = params.get("q")?.trim() ?? "";
  const requestedCategory = params.get("cat");
  const category = requestedCategory && categories.includes(requestedCategory) ? requestedCategory : "全部";

  const filteredTerms = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return terms.filter((term) => {
      if (category !== "全部" && term.cat !== category) return false;
      const haystack = [term.zh, term.en, term.say, term.cat, ...term.aliases].join(" ").toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [category, query, terms]);

  function updateUrl(nextQuery: string, nextCategory: string) {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextCategory !== "全部") params.set("cat", nextCategory);
    window.history.replaceState(null, "", params.size ? `/terms?${params}` : "/terms");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function selectCategory(next: string) {
    updateUrl(query, next);
  }

  function updateQuery(next: string) {
    updateUrl(next, category);
  }

  return (
    <>
      <header className="browse-head wrap">
        <div className="searchbar" style={{ marginTop: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input value={query} onChange={(event) => updateQuery(event.target.value)} aria-label="搜索术语" placeholder="搜术语：用你的大白话就行…" autoComplete="off" />
        </div>
      </header>
      <main className="wrap">
        <div className="browse">
          <aside className="side" aria-label="术语分类">
            <div className="cap">分类</div>
            {["全部", ...categories].map((item) => {
              const count = item === "全部" ? terms.length : terms.filter((term) => term.cat === item).length;
              return (
                <button key={item} className={`cat-item${category === item ? " active" : ""}`} type="button" onClick={() => selectCategory(item)}>
                  {item === "AI·Agent" ? "AI · Agent" : item}<span className="n">{count}</span>
                </button>
              );
            })}
          </aside>
          <div className="grid-wrap">
            <div className="grid-tools"><span className="cnt">共 {filteredTerms.length} 条</span></div>
            <section className="grid-terms" aria-live="polite">
              {filteredTerms.length ? filteredTerms.map((term) => (
                <Link className="t-item" href={`/terms/${term.slug}`} key={term.slug}>
                  <div className="t-name">{term.zh}{term.en && term.en !== term.zh && <span className="en">{term.en}</span>}</div>
                  <div className="say">{term.say}</div>
                  <div className="meta"><span className="tag">{term.cat}</span></div>
                </Link>
              )) : <div className="empty">没搜到 —— 换个大白话说法试试，比如「点一下弹出来的小框」。</div>}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
