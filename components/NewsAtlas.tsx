"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";

type RelatedTerm = { slug: string; zh: string; en: string };

export type NewsAtlasArticle = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  isExample: boolean;
  source: { name: string; url: string };
  related: RelatedTerm[];
};

type Point = { x: number; y: number };

const specks: Point[] = [
  { x: 18, y: 7 }, { x: 31, y: 4 }, { x: 49, y: 9 }, { x: 82, y: 6 },
  { x: 12, y: 18 }, { x: 24, y: 22 }, { x: 57, y: 18 }, { x: 92, y: 20 },
  { x: 17, y: 34 }, { x: 44, y: 31 }, { x: 76, y: 33 }, { x: 95, y: 39 },
  { x: 8, y: 48 }, { x: 23, y: 53 }, { x: 58, y: 49 }, { x: 88, y: 51 },
  { x: 15, y: 67 }, { x: 46, y: 66 }, { x: 77, y: 69 }, { x: 95, y: 72 },
  { x: 8, y: 84 }, { x: 29, y: 91 }, { x: 61, y: 86 }, { x: 89, y: 91 },
];

const articleX = [34, 67, 51, 76, 29, 60];
const termPositions: Point[] = [
  { x: 70, y: 18 }, { x: 84, y: 42 }, { x: 73, y: 70 }, { x: 43, y: 79 },
  { x: 24, y: 63 }, { x: 19, y: 29 }, { x: 51, y: 14 }, { x: 91, y: 27 },
];

const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", { weekday: "short", timeZone: "UTC" });
const shortDateFormatter = new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", timeZone: "UTC" });
const longDateFormatter = new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeZone: "UTC" });

function utcDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function timelineDays(latestDate: string) {
  const latest = utcDate(latestDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(latest);
    date.setUTCDate(latest.getUTCDate() - (6 - index));
    return dateKey(date);
  });
}

function pointForArticle(article: NewsAtlasArticle, articles: NewsAtlasArticle[], days: string[]): Point {
  const dayIndex = Math.max(0, days.indexOf(article.publishedAt));
  const sameDayIndex = articles.filter((candidate) => candidate.publishedAt === article.publishedAt).indexOf(article);
  return { x: articleX[(dayIndex + sameDayIndex) % articleX.length], y: 14 + dayIndex * 6.3 };
}

export function NewsAtlas({ articles }: { articles: NewsAtlasArticle[] }) {
  const orderedArticles = useMemo(
    () => [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [articles],
  );
  const days = useMemo(() => timelineDays(orderedArticles[0]?.publishedAt ?? new Date().toISOString().slice(0, 10)), [orderedArticles]);
  const [selectedSlug, setSelectedSlug] = useState(orderedArticles[0]?.slug ?? "");
  const selected = orderedArticles.find((article) => article.slug === selectedSlug) ?? orderedArticles[0];
  const selectedPoint = selected ? pointForArticle(selected, orderedArticles, days) : { x: 50, y: 50 };
  const selectedTermPoints = selected?.related.map((_, index) => termPositions[index % termPositions.length]) ?? [];

  if (!selected) return null;

  return (
    <section className="news-atlas" aria-label="新闻星历">
      <div className="news-atlas-heading">
        <div>
          <p className="news-kicker">NEWS / 星历</p>
          <h1>星历</h1>
          <p>把进展放回上下文里。</p>
        </div>
        <p className="news-atlas-hint">沿着时间向下探索，看看一条进展连接了哪些概念。</p>
      </div>

      <div className="news-atlas-layout">
        <nav className="news-atlas-dates" aria-label="新闻日期">
          {days.map((day, index) => {
            const dayArticle = orderedArticles.find((article) => article.publishedAt === day);
            const isSelected = dayArticle?.slug === selected.slug;
            const isToday = index === days.length - 1;
            const date = utcDate(day);
            const content = <>
              {isToday && <span className="news-atlas-today">今天</span>}
              <time dateTime={day}>{shortDateFormatter.format(date)}</time>
              <small>{weekdayFormatter.format(date)}</small>
            </>;
            return dayArticle ? (
              <button className={`news-atlas-date${isSelected ? " is-selected" : ""}${isToday ? " is-today" : ""}`} key={day} type="button" aria-pressed={isSelected} onClick={() => setSelectedSlug(dayArticle.slug)}>
                {content}
              </button>
            ) : <div className={`news-atlas-date is-empty${isToday ? " is-today" : ""}`} key={day}>{content}</div>;
          })}
          <span className="news-atlas-scroll-cue"><ArrowDown size={19} aria-hidden="true" /><span>继续探索<br />更多进展</span></span>
        </nav>

        <div className="news-atlas-map" role="region" aria-label="新闻与概念关系画布">
          <div className="news-atlas-specks" aria-hidden="true">
            {specks.map((point, index) => <span className="brand-star-only news-atlas-speck" key={`${point.x}-${point.y}`} style={{ left: `${point.x}%`, top: `${point.y}%`, animationDelay: `${index * 120}ms` }} />)}
          </div>
          <svg className="news-atlas-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {selectedTermPoints.map((point, index) => <line className="news-atlas-connector" key={`${selected.slug}-${index}`} x1={selectedPoint.x} y1={selectedPoint.y} x2={point.x} y2={point.y} />)}
          </svg>
          {orderedArticles.map((article) => {
            const point = pointForArticle(article, orderedArticles, days);
            const isSelected = article.slug === selected.slug;
            return <button className={`news-atlas-article${isSelected ? " is-selected" : ""}`} key={article.slug} type="button" aria-pressed={isSelected} aria-label={`${shortDateFormatter.format(utcDate(article.publishedAt))}：${article.title}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} onClick={() => setSelectedSlug(article.slug)}>
              <span className="brand-star-only news-atlas-star" aria-hidden="true" />
              <span className="news-atlas-article-copy"><strong>{article.title}</strong><small>{shortDateFormatter.format(utcDate(article.publishedAt))}</small></span>
            </button>;
          })}
          {selected.related.map((term, index) => {
            const point = selectedTermPoints[index];
            return <Link className="news-atlas-term" key={term.slug} href={`/terms/${term.slug}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
              <span className="brand-star-only news-atlas-term-star" aria-hidden="true" />
              <span>{term.zh}</span>
            </Link>;
          })}
        </div>

        <aside className="news-atlas-detail" aria-live="polite">
          <div className="news-atlas-detail-meta"><time dateTime={selected.publishedAt}>{longDateFormatter.format(utcDate(selected.publishedAt))}</time><span>来源 {selected.source.name}</span>{selected.isExample && <span className="news-atlas-example">示例内容</span>}</div>
          <h2>{selected.title}</h2>
          <p>{selected.summary}</p>
          <div className="news-atlas-related">
            <h3>关联词条</h3>
            {selected.related.map((term) => <Link key={term.slug} href={`/terms/${term.slug}`}>{term.zh}<span>{term.en}</span></Link>)}
          </div>
          <Link className="news-atlas-read" href={`/news/${selected.slug}`}>阅读文章 <ArrowUpRight size={19} aria-hidden="true" /></Link>
        </aside>
      </div>
    </section>
  );
}
