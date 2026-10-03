const origin = process.argv[2] ?? process.env.NEWS_SMOKE_ORIGIN ?? "http://127.0.0.1:3000";
const response = await fetch(new URL("/", origin));
if (!response.ok) throw new Error("应用根路径返回 HTTP " + response.status);
process.stdout.write(JSON.stringify({ origin, checked: ["/"] }) + "\n");
