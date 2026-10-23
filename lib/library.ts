import { libraryAnimations, animationGroups } from "./library-animations.ts";

export const libraryCategories = { all: "全部", animation: "动画", component: "组件", style: "样式", asset: "素材" } as const;
export type LibraryCategory = keyof typeof libraryCategories;
export type LibraryItem = {
  slug: string; name: string; english: string; category: Exclude<LibraryCategory, "all">;
  group: string; description: string; prompt: string; keywords: string;
  file?: string; format?: string; dimensions?: string;
};

export const libraryItems: readonly LibraryItem[] = [
  { slug: "sliding-tabs", name: "滑动导航", english: "Sliding tabs", category: "component", group: "导航", description: "选中项平滑移动，让当前位置一目了然。", prompt: "做一个带滑动选中背景的导航栏，切换时背景平滑移动。保留键盘操作，并尊重减少动态效果的偏好。", keywords: "tab 标签 切换 按钮 导航" },
  { slug: "soft-gradient", name: "柔光渐变", english: "Soft gradient", category: "style", group: "背景", description: "用柔和的色彩过渡，为页面留一点光。", prompt: "用鼠尾草绿与奶油黄做一层柔和的渐变背景，保持低对比，让背景上的文字清晰可读。", keywords: "css background 背景 配色 渐变" },
  { slug: "line-icons", name: "线性图标", english: "Line icons", category: "asset", group: "图标", description: "十二枚常用界面图标，保持一致的线条与留白。", prompt: "使用 Phosphor Icons 的 regular 线性图标，保持一致的尺寸和线宽。图标按钮需要可读的无障碍名称。", keywords: "icon svg 矢量 图标 符号", file: "/library/line-icons.svg", format: "SVG", dimensions: "480 × 360 · 12 枚图标" },
  { slug: "expandable-card", name: "展开卡片", english: "Expandable card", category: "component", group: "内容", description: "先看到标题，需要时再展开里面的内容。", prompt: "做一个可展开的内容卡片，默认展示标题，点击标题展开封面和摘要，再次点击收起。使用原生 details 与 summary，支持键盘操作。", keywords: "accordion 折叠 展开 卡片 内容" },
  { slug: "paper-shadow", name: "纸面阴影", english: "Paper shadow", category: "style", group: "层次", description: "用轻柔的阴影，表现纸面之间的距离。", prompt: "给纸色卡片添加柔和的分层阴影，边缘保持清晰，投影自然扩散。不要把阴影用在所有元素上。", keywords: "css shadow 阴影 投影 卡片 层次" },
  { slug: "paper-grain", name: "颗粒纹理", english: "Paper grain", category: "asset", group: "纹理", description: "一张低对比的纸张纹理，让背景有一点触感。", prompt: "将这张低对比纸张纹理作为页面背景，按页面比例裁切，保持正文的对比度。不要把纹理当作文字或重要信息的载体。", keywords: "texture png 纹理 背景 纸张 颗粒", file: "/library/paper-grain.png", format: "PNG", dimensions: "1024 × 1024" },
  ...libraryAnimations.map(item => ({ ...item, category: "animation" as const, description: item.kind === "loader" ? `${item.name}，用持续的运动反馈等待状态。` : `${item.name}，用于界面元素的${item.group}动效。`, prompt: `为界面实现「${item.name}」效果，参考 ${item.english} 的运动方式。${item.kind === "loader" ? "只在真实等待时展示，完成后移除加载状态。" : "用在需要表达层级或状态变化的元素上。"}保留减少动态效果的偏好，避免无关内容持续运动。`, keywords: `${item.english} ${item.group} ${item.source} CSS animation 动画 动效 ${item.kind === "loader" ? "loading spinner 加载" : "transition 过渡"}` })),
];

export function libraryCategory(value: string | null): LibraryCategory {
  return value && Object.hasOwn(libraryCategories, value) ? value as LibraryCategory : "all";
}
export const libraryPageSize = 24;
export function libraryPage(value: string | null) { return value && /^\d{1,6}$/.test(value) ? Math.max(1, Number(value)) : 1; }
export function libraryGroup(value: string | null) { return value && animationGroups.includes(value) ? value : ""; }
export function libraryHref(category: LibraryCategory, query = "", sort = "featured", slug?: string, page = 1, group = "") {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (query.trim()) params.set("q", query.slice(0, 120));
  if (sort === "name") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  if (group && category === "animation") params.set("group", group);
  return `/library${slug ? `/${slug}` : ""}${params.size ? `?${params}` : ""}`;
}
export function filterLibrary(category: LibraryCategory, query: string, sort: string, group = "") {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const result = libraryItems.filter(item => (category === "all" || category === item.category) && (!group || category !== "animation" || item.group === group) && words.every(word => `${item.name} ${item.english} ${item.description} ${item.keywords}`.toLocaleLowerCase().includes(word)));
  return sort === "name" ? result.toSorted((a, b) => a.name.localeCompare(b.name, "zh-CN")) : result;
}
