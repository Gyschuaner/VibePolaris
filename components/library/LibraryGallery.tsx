"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MagnifyingGlass, ArrowRight, ArrowLeft, X } from "@phosphor-icons/react/dist/ssr";
import { filterLibrary, libraryCategories, libraryCategory, libraryHref, libraryPage, libraryPageSize, libraryGroup, type LibraryCategory } from "@/lib/library";
import { animationGroups, animationCollections, animationsByGroup, animationPoster, libraryAnimations } from "@/lib/library-animations";
import { LibraryPreview } from "./LibraryPreview";
import styles from "./Library.module.css";

function AnimationCollections({ select }: { select: (group: string) => void }) {
  return <section className={styles.collections} aria-labelledby="animation-collections">
    <div className={styles.sectionHeading}><div><h2 id="animation-collections">按用途找动画</h2><p>先选一个类型，再挑喜欢的效果。</p></div><span>{libraryAnimations.length} 个动画 · {animationGroups.length} 种类型</span></div>
    <div className={styles.collectionGrid}>{animationCollections.map(collection => {
      const effects = collection.groups.flatMap(group => animationsByGroup.get(group) || []);
      const examples = [effects[0], effects[Math.floor(effects.length / 2)], effects[effects.length - 1]];
      return <section className={styles.collection} key={collection.name}>
        <header><div><h3>{collection.name}</h3><p>{collection.description}</p></div><span>{effects.length}</span></header>
        <div className={styles.collectionSamples} aria-hidden="true">{examples.map(item => <img key={item.slug} src={animationPoster(item)} alt="" width={280} height={180} loading="lazy" decoding="async" />)}</div>
        <div className={styles.groupLinks}>{collection.groups.map(group => <button key={group} type="button" onClick={() => select(group)}><span>{group}<small>{animationsByGroup.get(group)?.length}</small></span><ArrowRight size={16} aria-hidden /></button>)}</div>
      </section>;
    })}</div>
  </section>;
}

export function LibraryGallery() {
  const params = useSearchParams();
  const [active, setActive] = useState("");
  const category = libraryCategory(params.get("category")), query = params.get("q")?.slice(0, 120) || "", sort = params.get("sort") === "name" ? "name" : "featured";
  const group = category === "animation" ? libraryGroup(params.get("group")) : "";
  const overview = (category === "all" || category === "animation") && !query.trim() && !group;
  const items = filterLibrary(category, query, sort, group).filter(item => !overview || item.category !== "animation");
  const totalPages = Math.max(1, Math.ceil(items.length / libraryPageSize));
  const page = Math.min(libraryPage(params.get("page")), totalPages), pageItems = items.slice((page - 1) * libraryPageSize, page * libraryPageSize);
  const update = (nextCategory = category, nextQuery = query, nextSort = sort, nextGroup = group) => {
    // The native history API keeps filtering immediate without a server round trip.
    setActive("");
    window.history.replaceState(null, "", libraryHref(nextCategory, nextQuery, nextSort, undefined, 1, nextGroup));
    if (nextCategory !== category || nextGroup !== group) window.scrollTo({ top: 0, behavior: "instant" });
  };
  const selectGroup = (name: string) => update("animation", query, sort, name);
  const turnPage = (next: number) => { window.history.pushState(null, "", libraryHref(category, query, sort, undefined, next, group)); setActive(""); document.getElementById("library-results")?.scrollIntoView({ block: "start" }); };
  return <main className={styles.gallery} id="main-content">
    <header className={styles.galleryHeading}>
      <div><p className={styles.eyebrow}>LIBRARY</p><h1>组件库</h1><p className={styles.subtitle}>挑一个喜欢的效果，放进你的页面。</p></div>
      <label className={styles.search}><MagnifyingGlass size={23} aria-hidden /><input type="search" aria-label="搜索名称、效果或用途" placeholder="搜索名称、效果或用途" maxLength={120} value={query} onChange={event => update(category, event.target.value)} />{query && <button type="button" aria-label="清空搜索" onClick={() => update(category, "")}><X size={18} /></button>}</label>
    </header>
    <div className={styles.filters}>
      <nav className={styles.categories} aria-label="资源分类">{(Object.entries(libraryCategories) as [LibraryCategory, string][]).map(([key, label]) => <button type="button" key={key} aria-pressed={category === key} onClick={() => update(key, query, sort, "")}>{label}</button>)}</nav>
      {!overview && <label className={styles.sort}><span className={styles.srOnly}>排序方式</span><select value={sort} onChange={event => update(category, query, event.target.value)}><option value="featured">精选</option><option value="name">按名称</option></select></label>}
    </div>
    {overview && <AnimationCollections select={selectGroup} />}
    {(!overview || category === "all") && <div className={category === "animation" ? styles.browseLayout : undefined}>
    {category === "animation" && <aside className={styles.groupNav} aria-label="动画分类">
      <button type="button" className={styles.allGroups} onClick={() => update("animation", "", sort, "")}><ArrowLeft size={16} aria-hidden />分类总览</button>
      {animationCollections.map(collection => <div key={collection.name}><h2>{collection.name}</h2>{collection.groups.map(name => <button key={name} type="button" aria-pressed={group === name} onClick={() => selectGroup(name)}><span>{name}</span><span>{animationsByGroup.get(name)?.length}</span></button>)}</div>)}
    </aside>}
    <section className={styles.results} aria-labelledby="library-results-title">
    <div className={styles.resultsBar} id="library-results"><div><h2 id="library-results-title">{overview ? "组件、样式与素材" : group || (query.trim() ? "搜索结果" : libraryCategories[category])}</h2><p role="status">{items.length} 个{category === "animation" ? "动画" : "条目"}{category === "animation" && <span className={styles.hoverHint}> · 移入播放</span>}</p></div>{category === "animation" && <label className={styles.mobileGroupSelect}><span className={styles.srOnly}>动画类型</span><select aria-label="动画类型" value={group} onChange={event => selectGroup(event.target.value)}><option value="">{query.trim() ? "全部类型" : "分类总览"}</option>{animationGroups.map(name => <option key={name} value={name}>{name}</option>)}</select></label>}</div>
    {items.length ? <div className={styles.grid}>{pageItems.map(item => <Link key={item.slug} className={styles.item} prefetch={false} href={libraryHref(category, query, sort, item.slug, page, group)} onMouseEnter={() => setActive(item.slug)} onMouseLeave={() => setActive("")} onFocus={() => setActive(item.slug)} onBlur={() => setActive("")}>
      <div className={styles.thumbnail}><LibraryPreview slug={item.slug} decorative active={active === item.slug} /><span className={styles.openItem}>查看{libraryCategories[item.category]}<ArrowRight size={18} /></span></div>
      <h2>{item.name}</h2><p>{libraryCategories[item.category]}{item.category === "animation" && ` · ${item.group}`}</p>
    </Link>)}</div> : <div className={styles.empty}><MagnifyingGlass size={32} aria-hidden /><h2>没有找到匹配的内容</h2><p>试试“加载”“入场”或“图标”。</p><button type="button" onClick={() => update("all", "")}>清除筛选</button></div>}
    {totalPages > 1 && <nav className={styles.pagination} aria-label="条目分页"><button type="button" disabled={page === 1} onClick={() => turnPage(page - 1)}>上一页</button><span>第 {page} / {totalPages} 页</span><button type="button" disabled={page === totalPages} onClick={() => turnPage(page + 1)}>下一页</button></nav>}
    </section></div>}
  </main>;
}
