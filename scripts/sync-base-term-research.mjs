import { readFile, writeFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));
const terms = await readJson("content/zh/terms.json");
const experiences = await readJson("content/zh/term-experiences/base.json");
const existing = await readJson("content/zh/term-research/base.json");
const component = existing.find((item) => item.slug === "component");

if (!component) throw new Error("Component research card is missing");

const specialPages = [
  {
    slug: "css",
    mechanism: "浏览器先用选择器匹配元素，再按来源、重要性、层叠层、优先级和源码顺序确定声明，最后把计算值交给布局与绘制。",
    misconception: "CSS 不是给 HTML 表面加颜色；层叠决定哪条声明生效，布局规则还会随容器与媒体条件改变。",
    demoSignature: "responsive-code-map: 3 frames; actors=CSS代码行/计算值/三列星图; phases=桌面展开→发现拥挤→媒体查询改单列; action=播放代码与布局同步变化",
    sourceUrls: [
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade",
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design",
    ],
    rewriteRisk: "不要把 CSS 讲成属性清单；正式页面必须同时说明匹配、层叠、计算值和布局结果。",
    nearDuplicates: ["css-selector", "box-model", "responsive"],
  },
  {
    slug: "html",
    mechanism: "HTML 元素与属性构成文档结构；浏览器据此建立 DOM 和可访问性语义，使标题、区域和原生控件能够被程序与辅助技术识别。",
    misconception: "HTML 不只是把内容显示出来；用 div 模仿按钮或标题会丢失原生语义与交互行为。",
    demoSignature: "semantic-node-recognition: 3 frames; actors=普通容器/标题层级/原生按钮/浏览器识别结果; phases=只有容器→标题被识别→操作可被键盘触发; action=切换元素语义",
    sourceUrls: [
      "https://html.spec.whatwg.org/",
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
    ],
    rewriteRisk: "不要只强调 SEO；正式页面要把文档结构、原生行为和辅助技术识别放在同一个例子中。",
    nearDuplicates: ["semantic-html", "dom", "a11y"],
  },
  {
    slug: "javascript",
    mechanism: "JavaScript 接收事件，读取或修改程序数据，再通过浏览器 API 更新页面；异步任务完成后会在事件循环允许的时机继续执行。",
    misconception: "JavaScript 语言不等于 DOM、网络或文件系统 API；可调用能力由浏览器、Node.js 等运行时决定。",
    demoSignature: "event-state-render: 3 frames; actors=点击事件/count状态/计数节点; phases=事件进入→count加一→textContent更新; action=逐段执行一次点击",
    sourceUrls: [
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events",
    ],
    rewriteRisk: "不要把 JavaScript 写成‘让页面动起来’；正式页面要明确事件、数据变化和界面更新的先后。",
    nearDuplicates: ["event", "dom", "async-await"],
  },
];

const bySlug = new Map(terms.map((term) => [term.slug, term]));
const generated = experiences.map((experience) => {
  const term = bySlug.get(experience.slug);
  if (!term) throw new Error(`Unknown base term: ${experience.slug}`);
  return {
    slug: experience.slug,
    mechanism: experience.definition,
    misconception: experience.boundary,
    demoSignature: `${experience.sceneKind}: ${experience.frames.length} frames; actors=${experience.actors.map((actor) => actor.label).join("/")}; phases=${experience.frames.map((frame) => frame.label).join("→")}; action=${experience.actionLabel}`,
    sourceUrls: experience.sources.map((source) => source.url),
    rewriteRisk: `正式页面需守住边界：${experience.boundary}`,
    nearDuplicates: term.relatedSlugs,
  };
});

await writeFile(
  new URL("../content/zh/term-research/base.json", import.meta.url),
  `${JSON.stringify([component, ...specialPages, ...generated], null, 2)}\n`,
  "utf8",
);

console.log(`Synced ${generated.length} generated and ${specialPages.length + 1} bespoke base research cards.`);
