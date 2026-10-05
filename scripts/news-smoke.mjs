const origin = process.argv[2] ?? process.env.NEWS_SMOKE_ORIGIN ?? "http://127.0.0.1:3000";
const expectedSlugs = (process.env.NEWS_EXPECTED_SLUGS ?? "")
  .split(",")
  .map(value => value.trim())
  .filter(Boolean);

async function request(path) {
  const response = await fetch(new URL(path, origin));
  const body = await response.text();
  if (!response.ok) throw new Error(`${path} 返回 HTTP ${response.status}`);
  return { response, body };
}

const home = await request("/");
const news = await request("/news");
const sitemap = await request("/sitemap.xml");
const session = await request("/api/xiaobei/session");
const invite = await request("/xiaobei/activate");

if (!news.body.includes("世界最近发生了什么")) throw new Error("新闻页面标题未渲染");
if (!sitemap.body.includes("/news/")) throw new Error("sitemap 没有新闻详情链接");
for (const slug of expectedSlugs) {
  if (!sitemap.body.includes(`/news/${slug}`)) throw new Error(`sitemap 缺少新闻：${slug}`);
}

let sessionData;
try {
  sessionData = JSON.parse(session.body);
} catch {
  throw new Error("小北 session 不是 JSON");
}
if (sessionData.active !== false) throw new Error("小北邀请制状态异常：预览环境不应默认激活");
if (home.body.includes('href="/xiaobei/activate"')) throw new Error("邀请制入口意外出现在公开首页");
if (!invite.body.includes("激活") && !invite.body.includes("邀请码")) throw new Error("小北激活页不可达");

process.stdout.write(JSON.stringify({
  origin,
  checked: ["/", "/news", "/sitemap.xml", "/api/xiaobei/session", "/xiaobei/activate"],
  expectedSlugs,
  xiaobeiInviteOnly: true,
}, null, 2) + "\n");
