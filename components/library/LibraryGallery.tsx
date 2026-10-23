"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MagnifyingGlass, ArrowRight, X } from "@phosphor-icons/react/dist/ssr";
import { filterLibrary, libraryCategories, libraryCategory, libraryHref, libraryPage, libraryPageSize, libraryGroup, type LibraryCategory } from "@/lib/library";
import { animationGroups, libraryAnimations } from "@/lib/library-animations";
import { LibraryPreview } from "./LibraryPreview";
import styles from "./Library.module.css";

export function LibraryGallery() {
  const params = useSearchParams(), router = useRouter();
  const [active, setActive] = useState("");
  const category = libraryCategory(params.get("category")), query = params.get("q")?.slice(0, 120) || "", sort = params.get("sort") === "name" ? "name" : "featured";
  const group = category === "animation" ? libraryGroup(params.get("group")) : "";
  const items = filterLibrary(category, query, sort, group), totalPages = Math.max(1, Math.ceil(items.length / libraryPageSize));
  const page = Math.min(libraryPage(params.get("page")), totalPages), pageItems = items.slice((page - 1) * libraryPageSize, page * libraryPageSize);
  const update = (nextCategory = category, nextQuery = query, nextSort = sort, nextGroup = group) => {
    // The native history API keeps filtering immediate without a server round trip.
    window.history.replaceState(null, "", libraryHref(nextCategory, nextQuery, nextSort, undefined, 1, nextGroup));
  };
  const turnPage = (next: number) => { window.history.pushState(null, "", libraryHref(category, query, sort, undefined, next, group)); setActive(""); document.getElementById("library-results")?.scrollIntoView({ block: "start" }); };
  return <main className={styles.gallery} id="main-content">
    <header className={styles.galleryHeading}>
      <div><p className={styles.eyebrow}>LIBRARY</p><h1>组件库</h1><p className={styles.subtitle}>挑一个喜欢的效果，放进你的页面。</p></div>
      <label className={styles.search}><MagnifyingGlass size={23} aria-hidden /><input type="search" aria-label="搜索名称、效果或用途" placeholder="搜索名称、效果或用途" maxLength={120} value={query} onChange={event => update(category, event.target.value)} />{query && <button type="button" aria-label="清空搜索" onClick={() => update(category, "")}><X size={18} /></button>}</label>
    </header>
    <div className={styles.filters}>
      <nav className={styles.categories} aria-label="资源分类">{(Object.entries(libraryCategories) as [LibraryCategory, string][]).map(([key, label]) => <button type="button" key={key} aria-pressed={category === key} onClick={() => update(key)}>{label}</button>)}</nav>
      <label className={styles.sort}><span className={styles.srOnly}>排序方式</span><select value={sort} onChange={event => update(category, query, event.target.value)}><option value="featured">精选</option><option value="name">按名称</option></select></label>
    </div>
    <div className={styles.resultsBar} id="library-results"><p role="status">{items.length} 个条目{category === "all" && !query && <> · {libraryAnimations.length} 个动画</>}</p>{category === "animation" && <label>动画类型<select aria-label="动画类型" value={group} onChange={event => update(category, query, sort, event.target.value)}><option value="">全部类型</option>{animationGroups.map(name => <option key={name} value={name}>{name}</option>)}</select></label>}</div>
    {items.length ? <div className={styles.grid}>{pageItems.map(item => <Link key={item.slug} className={styles.item} href={libraryHref(category, query, sort, item.slug, page, group)} onMouseEnter={() => { setActive(item.slug); router.prefetch(`/library/${item.slug}`); }} onMouseLeave={() => setActive("")} onFocus={() => setActive(item.slug)} onBlur={() => setActive("")}>
      <div className={styles.thumbnail}><LibraryPreview slug={item.slug} decorative active={active === item.slug} /><span className={styles.openItem}>查看{libraryCategories[item.category]}<ArrowRight size={18} /></span></div>
      <h2>{item.name}</h2><p>{libraryCategories[item.category]}{item.category === "animation" && ` · ${item.group}`}</p>
    </Link>)}</div> : <div className={styles.empty}><MagnifyingGlass size={32} aria-hidden /><h2>没有找到匹配的内容</h2><p>试试“加载”“入场”或“图标”。</p><button type="button" onClick={() => update("all", "")}>清除筛选</button></div>}
    {totalPages > 1 && <nav className={styles.pagination} aria-label="条目分页"><button type="button" disabled={page === 1} onClick={() => turnPage(page - 1)}>上一页</button><span>第 {page} / {totalPages} 页</span><button type="button" disabled={page === totalPages} onClick={() => turnPage(page + 1)}>下一页</button></nav>}
  </main>;
}
