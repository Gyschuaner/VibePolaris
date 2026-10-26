"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MagnifyingGlass, ArrowRight, X } from "@phosphor-icons/react/dist/ssr";
import { filterLibrary, libraryCategories, libraryCategory, libraryHref, libraryGroup, type LibraryCategory } from "@/lib/library";
import { animationGroups, animationsByGroup } from "@/lib/library-animations";
import { AnimationGroupCard } from "./AnimationGroupCard";
import { LibraryPreview } from "./LibraryPreview";
import styles from "./Library.module.css";

export function LibraryGallery() {
  const params = useSearchParams();
  const [hovered, setHovered] = useState(""), [focused, setFocused] = useState("");
  const category = libraryCategory(params.get("category")), query = params.get("q")?.slice(0, 120) || "", sort = params.get("sort") === "name" ? "name" : "featured";
  const group = category === "animation" ? libraryGroup(params.get("group")) : "";
  const items = filterLibrary(category, query, sort, group);
  const matching = new Set(items.filter(item => item.category === "animation").map(item => item.slug));
  const groups = [...animationsByGroup].map(([name, effects]) => ({ name, effects: effects.filter(item => matching.has(item.slug)) })).filter(section => section.effects.length);
  if (sort === "name") for (const section of groups) section.effects.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
  const resources = items.filter(item => item.category !== "animation");
  const update = (nextCategory = category, nextQuery = query, nextSort = sort, nextGroup = group) => {
    // The native history API keeps filtering immediate without a server round trip.
    setHovered(""); setFocused("");
    window.history.replaceState(null, "", libraryHref(nextCategory, nextQuery, nextSort, undefined, 1, nextGroup));
  };

  return <main className={styles.gallery} id="main-content">
    <header className={styles.galleryHeading}>
      <div><p className={styles.eyebrow}>LIBRARY</p><h1>组件库</h1><p className={styles.subtitle}>挑一个喜欢的效果，放进你的页面。</p></div>
      <label className={styles.search}><MagnifyingGlass size={23} aria-hidden /><input type="search" aria-label="搜索名称、效果或用途" placeholder="搜索名称、效果或用途" maxLength={120} value={query} onChange={event => update(category, event.target.value)} />{query && <button type="button" aria-label="清空搜索" onClick={() => update(category, "")}><X size={18} /></button>}</label>
    </header>
    <div className={styles.filters}>
      <nav className={styles.categories} aria-label="资源分类">{(Object.entries(libraryCategories) as [LibraryCategory, string][]).map(([key, label]) => <button type="button" key={key} aria-pressed={category === key} onClick={() => update(key, query, sort, "")}>{label}</button>)}</nav>
      <label className={styles.sort}><span className={styles.srOnly}>排序方式</span><select value={sort} onChange={event => update(category, query, event.target.value)}><option value="featured">精选</option><option value="name">按名称</option></select></label>
    </div>
    {(category === "all" || category === "animation") && (groups.length > 0 || !query.trim()) && <section className={styles.animationSection} aria-labelledby="animation-results-title">
      <div className={styles.resultsBar}><div><h2 id="animation-results-title">{group || "动画"}</h2><p role="status">{matching.size} 个动画 · {groups.length} 个分类</p></div>{category === "animation" && <label><span className={styles.srOnly}>动画类型</span><select aria-label="动画类型" value={group} onChange={event => update(category, query, sort, event.target.value)}><option value="">全部类型</option>{animationGroups.map(name => <option key={name} value={name}>{name}</option>)}</select></label>}</div>
      <div className={styles.animationGrid}>{groups.map(({ name, effects }) => <AnimationGroupCard key={JSON.stringify([name, query, sort])} group={name} effects={effects} category={category} query={query} sort={sort} filterGroup={group} active={hovered || focused} setHovered={setHovered} setFocused={setFocused} />)}</div>
    </section>}
    {resources.length > 0 && <section className={styles.results} aria-labelledby="library-results-title">
      <div className={styles.resultsBar}><div><h2 id="library-results-title">{category === "all" ? "组件、样式与素材" : libraryCategories[category]}</h2><p role="status">{resources.length} 个条目</p></div></div>
      <div className={styles.grid}>{resources.map(item => <Link key={item.slug} className={styles.item} prefetch={false} href={libraryHref(category, query, sort, item.slug)}>
        <div className={styles.thumbnail}><LibraryPreview slug={item.slug} decorative /><span className={styles.openItem}>查看{libraryCategories[item.category]}<ArrowRight size={18} /></span></div>
        <h2>{item.name}</h2><p>{libraryCategories[item.category]}</p>
      </Link>)}</div>
    </section>}
    {!items.length && <div className={styles.empty}><MagnifyingGlass size={32} aria-hidden /><h2>没有找到匹配的内容</h2><p>试试“加载”“入场”或“图标”。</p><button type="button" onClick={() => update("all", "", sort, "")}>清除筛选</button></div>}
  </main>;
}
