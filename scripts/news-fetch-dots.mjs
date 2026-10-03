const endpoint = process.env.NEWS_DOTS_ENDPOINT;
const token = process.env.NEWS_DOTS_TOKEN;

if (!endpoint) {
  throw new Error("未配置 NEWS_DOTS_ENDPOINT；定时任务保持无写入状态");
}

const url = new URL(endpoint);
if (url.protocol !== "https:" && !["127.0.0.1", "localhost"].includes(url.hostname)) {
  throw new Error("NEWS_DOTS_ENDPOINT 必须使用 HTTPS");
}

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 90_000);
try {
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: controller.signal,
  });
  if (!response.ok) throw new Error(`Dots 交接端点返回 HTTP ${response.status}`);
  const payload = await response.json();
  process.stdout.write(`${JSON.stringify(payload)}\n`);
} finally {
  clearTimeout(timer);
}
