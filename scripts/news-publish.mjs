import { publishNewsDrafts } from "./news-contract.mjs";

try {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    process.stdout.write("用法：npm run news:publish -- <草稿 JSON 路径> [--approve]\n默认只预览；加入 --approve 才会更新 news.json。\n");
    process.exit(0);
  }
  if (args.some(arg => arg.startsWith("--") && arg !== "--approve")) throw new Error("仅支持草稿路径和 --approve；默认仅预览，不写入文件");
  const output = publishNewsDrafts(args.filter(arg => arg !== "--approve"), { approve: args.includes("--approve") });
  process.stdout.write(`${JSON.stringify(output)}\n`);
} catch (error) {
  process.stderr.write(`News 提升失败：${error.message}\n`);
  process.exitCode = 1;
}
