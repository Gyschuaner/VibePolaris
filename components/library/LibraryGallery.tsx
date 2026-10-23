"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass, ArrowRight, X } from "@phosphor-icons/react/dist/ssr";
import { filterLibrary, libraryCategories, libraryCategory, libraryHref, type LibraryCategory } from "@/lib/library";
import { LibraryPreview } from "./LibraryPreview";
import styles from "./Library.module.css";

export function LibraryGallery() {
  const params = useSearchParams(), router = useRouter();
  const category = libraryCategory(params.get("category")), query = params.get("q")?.slice(0, 120) || "", sort = params.get("sort") === "name" ? "name" : "featured";
  const items = filterLibrary(category, query, sort);
  const update = (nextCategory = category, nextQuery = query, nextSort = sort) => {
    // The native history API keeps filtering immediate without a server round trip.
    window.history.replaceState(null, "", libraryHref(nextCategory, nextQuery, nextSort));
  };
  return <main className={styles.gallery} id="main-content">
    <header className={styles.galleryHeading}>
      <div><p className={styles.eyebrow}>LIBRARY</p><h1>组件库</h1><p className={styles.subtitle}>挑一个喜欢的效果，放进你的页面。</p></div>
      <label className={styles.search}><MagnifyingGlass size={23} aria-hidden /><input type="search" aria-label="搜索组件、样式或素材" placeholder="搜索组件、样式或素材" maxLength={120} value={query} onChange={event => update(category, event.target.value)} />{query && <button type="button" aria-label="清空搜索" onClick={() => update(category, "")}><X size={18} /></button>}</label>
    </header>
    <div className={styles.filters}>
      <nav className={styles.categories} aria-label="资源分类">{(Object.entries(libraryCategories) as [LibraryCategory, string][]).map(([key, label]) => <button type="button" key={key} aria-pressed={category === key} onClick={() => update(key)}>{label}</button>)}</nav>
      <label className={styles.sort}><span className={styles.srOnly}>排序方式</span><select value={sort} onChange={event => update(category, query, event.target.value)}><option value="featured">精选</option><option value="name">按名称</option></select></label>
    </div>
    <p className={styles.srOnly} role="status">找到 {items.length} 个条目</p>
    {items.length ? <div className={styles.grid}>{items.map(item => <Link key={item.slug} className={styles.item} href={libraryHref(category, query, sort, item.slug)} onMouseEnter={() => router.prefetch(`/library/${item.slug}`)}>
      <div className={styles.thumbnail}><LibraryPreview slug={item.slug} decorative /><span className={styles.openItem}>查看{libraryCategories[item.category]}<ArrowRight size={18} /></span></div>
      <h2>{item.name}</h2><p>{libraryCategories[item.category]}</p>
    </Link>)}</div> : <div className={styles.empty}><MagnifyingGlass size={32} aria-hidden /><h2>没有找到匹配的内容</h2><p>试试“导航”“背景”或“图标”。</p><button type="button" onClick={() => update("all", "")}>清除筛选</button></div>}
  </main>;
}
