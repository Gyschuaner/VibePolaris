type PageCatalog = {
  terms: readonly { slug: string; zh: string; definition: string }[];
  news: readonly { slug: string; title: string; summary: string }[];
  categories: readonly { slug: string; name: string }[];
};

const pages: Record<string, { kind: string; title: string; summary: string; features: string[] }> = {
  "/": {
    kind: "graph", title: "概念星图", summary: "通过搜索、领域分类和概念之间的连线探索技术词条。",
    features: ["搜索词名或关键词，按领域聚焦星群", "点击星点查看概念卡片及关联，再进入词条正文", "拖动星点或空白区域、缩放星图"],
  },
  "/canvas": {
    kind: "canvas", title: "知识画布", summary: "自由摆放和连接自己的节点，用 Markdown 整理想法。",
    features: ["用新建节点按钮或空白处右键创建节点，双击空白处新建笔记", "拖动节点排布；点按或拖动节点圆点后选择另一节点来连线", "点击节点打开简述，从节点操作菜单编辑正文、复制或导出 Markdown", "导入 .md 文件；移动和缩放画布，显示全部节点", "游客画布保存在本浏览器；登录后可选择保存到账号，账号画布可手动或自动同步"],
  },
  "/settings": {
    kind: "settings", title: "设置", summary: "登录后管理账号头像和此浏览器的画布同步偏好。",
    features: ["上传或恢复默认头像", "开启或关闭此浏览器的账号画布自动同步；关闭后修改仍保存在本地", "返回画布或退出账号；游客画布需自行选择保存到账号"],
  },
  "/news": {
    kind: "news-index", title: "新闻星历", summary: "按时间线和新闻星图浏览已发布进展。",
    features: ["选择近一个月、三个月、半年、一年或自定义日期范围", "选择日期或新闻星点查看摘要，再打开文章全文", "拖动、缩放新闻星图，阅读关联新闻及概念"],
  },
  "/about": {
    kind: "about", title: "关于 VibePolaris", summary: "介绍网站定位、概念学习方式和后续规划。",
    features: ["了解词典、概念星图和互动教程的用途", "通过探索概念星图入口回到首页；后续规划不代表已经上线的功能"],
  },
  "/xiaobei/activate": {
    kind: "activation", title: "激活小北", summary: "使用有效的内部邀请码授权小北。",
    features: ["在激活表单中输入邀请码；账号可绑定已有邀请码以使用小北", "小北可新建、恢复历史对话，每个邀请码每天北京时间零点恢复100积分"],
  },
};

const courses: Record<string, string> = {
  html: "学习文档结构、语义元素和表单。",
  css: "学习选择器、层叠、布局、响应式和样式调试。",
  javascript: "学习值与变量、函数、事件、异步请求和调试。",
};

export function describePage(path: string, catalog: PageCatalog) {
  const unknown = { path: "", kind: "unknown", title: "未识别页面", summary: "没有可靠的页面功能说明；不能据此假设用户位于星图或某个词条。", features: [] as string[] };
  let url: URL;
  try { url = new URL(path, "http://local"); }
  catch { return unknown; }
  if (!path.startsWith("/") || url.origin !== "http://local" || /[\\\r\n]/.test(path)) return unknown;
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  const base = { ...unknown, path: pathname };
  const termRef = (slug: string) => {
    const term = catalog.terms.find(item => item.slug === slug);
    return term ? { slug: term.slug, title: term.zh, summary: term.definition, url: `/terms/${term.slug}` } : undefined;
  };
  const term = pathname.startsWith("/terms/") ? termRef(pathname.slice("/terms/".length)) : undefined;
  if (term) return {
    ...base, kind: "term", title: term.title, summary: term.summary, subject: term,
    features: ["阅读当前概念的讲解、示例和关联词条", "操作本页提供的互动演示，按需查看补充内容和参考资料", "选中正文划线或批注，使用目录或阅读侧栏导航"],
  };
  const news = pathname.startsWith("/news/") ? catalog.news.find(item => item.slug === pathname.slice("/news/".length)) : undefined;
  if (news) return {
    ...base, kind: "news-article", title: news.title, summary: news.summary,
    subject: { slug: news.slug, title: news.title, url: `/news/${news.slug}` },
    features: ["阅读新闻正文、事件日期和原始来源", "沿关联新闻或概念继续阅读，返回新闻星历探索其他进展"],
  };
  const course = pathname.startsWith("/guides/") ? pathname.slice("/guides/".length) : "";
  if (Object.hasOwn(courses, course)) return {
    ...base, kind: "course", title: `${course === "javascript" ? "JavaScript" : course.toUpperCase()} 深度教程`, summary: courses[course],
    subject: termRef(course), features: ["使用章节目录导航，顺序阅读讲解与代码示例", "操作本页练习和自测，选中正文划线或批注", "通过页首词条入口回到对应概念"],
  };
  const page = pages[pathname];
  if (!page) return base;
  if (pathname === "/") return {
    ...base, ...page,
    selectedTerm: termRef(url.searchParams.get("term") || ""),
    searchQuery: (url.searchParams.get("q") || "").trim().slice(0, 200),
    category: catalog.categories.find(item => item.slug === url.searchParams.get("cat"))?.name,
  };
  if (pathname === "/canvas") {
    const view = url.searchParams.get("note") ? url.searchParams.get("edit") === "1" ? "文档编辑" : "文档阅读" : "画布总览";
    const features = view === "画布总览" ? page.features : [
      "用顶部按钮切换阅读和编辑，或返回画布", "编辑时左侧输入 Markdown、右侧实时预览；格式工具栏支持加粗（Command/Ctrl+B）、颜色、代码块和 Mermaid", "编辑时 Command/Ctrl+Enter 请求小北短补全，Tab 接受、Escape 放弃", "通过节点操作菜单复制、导出 Markdown 或查看节点信息",
    ];
    const title = view === "画布总览" ? page.title : `画布${view}`;
    const summary = view === "文档编辑" ? "当前是文档编辑页：左侧输入 Markdown，右侧实时预览。" : view === "文档阅读" ? "当前是文档阅读页：阅读全文，可切换编辑或返回画布。" : page.summary;
    return { ...base, ...page, title, summary, view, features };
  }
  return { ...base, ...page };
}
