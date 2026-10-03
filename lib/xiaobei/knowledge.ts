import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPublishedTerm, publishedTerms } from "@/lib/content";
import { XiaobeiError } from "./store.ts";

export const platformGuide = `VibePolaris（Vibe指北）是技术概念词典与概念星图。首页可搜索、按分类探索和打开词条。
词条支持关联阅读及互动演示，HTML/CSS/JavaScript词条可进入对应教程。导航“我的笔记”按钮打开抽屉，管理当前浏览器本地笔记（没有独立的笔记网址），选中文字可划线或批注；笔记不会上传，不跨设备同步。
主题入口可调整背景及主题色。小北是内部邀请码激活的全站悬浮星星，每码每天100积分，每日北京时间零点恢复。
小北右上角可以新建对话或打开历史，切回旧对话可继续聊。历史按邀请码与当前浏览器隔离，刷新后可恢复；换浏览器或清除网站Cookie不能找回原历史，同码不同使用者不共享对话。`;
export const catalog = publishedTerms.map(t => `${t.slug}：${t.zh} ${t.en}`).join("\n");
export const toolDefinitions = [
  { type: "function", function: { name: "search_terms", description: "搜索已发布的技术词条，返回摘要及可读取的slug。可换用词名、同义词或短关键词。", parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false } } },
  { type: "function", function: { name: "read_term", description: "读取已发布词条的实际正文。按字符offset分页；truncated时可用nextOffset继续。", parameters: { type: "object", properties: { slug: { type: "string" }, offset: { type: "integer", minimum: 0 } }, required: ["slug"], additionalProperties: false } } },
];
export function pageContext(path: string) {
  const url = new URL(path, "http://local");
  const term = getPublishedTerm(url.pathname.split("/terms/")[1] || url.searchParams.get("term") || "");
  if (term) return { path: `/terms/${term.slug}`, title: term.zh, summary: term.definition };
  const pages: Record<string, string> = { "/": "概念星图", "/about": "关于", "/guides/css": "CSS 教程", "/guides/html": "HTML 教程", "/guides/javascript": "JavaScript 教程" };
  return { path: pages[url.pathname] ? url.pathname : "/", title: pages[url.pathname] || "概念星图" };
}
export function searchTerms(query: string) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return publishedTerms.map(term => {
    const names = `${term.zh} ${term.en} ${term.slug} ${term.aliases.join(" ")}`.toLowerCase();
    const full = `${names} ${term.definition} ${term.say}`.toLowerCase();
    const score = words.reduce((n, word) => n + (names.includes(word) ? 3 : full.includes(word) ? 1 : 0), 0);
    return { term, score };
  }).filter(x => x.score).sort((a, b) => b.score - a.score).slice(0, 8).map(({ term }) => ({ slug: term.slug, title: term.zh, summary: term.definition, url: `/terms/${term.slug}` }));
}
function articleText(html: string) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new XiaobeiError("暂时无法读取词条正文。", 502);
  return main.replace(/<(script|style|svg|nav)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/(p|h[1-6]|li|section|div|tr|pre)>|<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, code: string) => {
      if (code[0] === "#") { const value = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1)); return value <= 0x10ffff ? String.fromCodePoint(value) : ""; }
      return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " } as Record<string, string>)[code.toLowerCase()] || "";
    }).replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n").trim();
}
export async function readTerm(slug: string, offset: number, signal?: AbortSignal) {
  const term = getPublishedTerm(slug);
  if (!term) return { error: "找不到已发布的词条，请先搜索。" };
  let html: string;
  try {
    if (process.env.NODE_ENV !== "production") throw new Error("Read current development page");
    html = await readFile(join(process.cwd(), ".next/server/app/terms", `${term.slug}.html`), "utf8");
  } catch {
    // Only deployment-configured loopback; never fetch a model/user supplied URL.
    const origin = new URL(process.env.XIAOBEI_CONTENT_ORIGIN || `http://127.0.0.1:${process.env.PORT || 3000}`);
    if (!["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname)) throw new XiaobeiError("词条读取地址配置错误。", 503);
    const response = await fetch(new URL(`/terms/${term.slug}`, origin), { signal: AbortSignal.any([signal ?? new AbortController().signal, AbortSignal.timeout(30_000)]), redirect: "error", cache: "no-store" });
    if (!response.ok) throw new XiaobeiError("词条正文暂不可用。", 502);
    html = await response.text();
  }
  const text = articleText(html);
  const end = Math.min(text.length, offset + 12_000);
  return { title: term.zh, url: `/terms/${slug}`, text: text.slice(offset, end), truncated: end < text.length, nextOffset: end < text.length ? end : null, related: term.relatedSlugs.filter(s => getPublishedTerm(s)) };
}
