import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { remarkTermLinks } from "../lib/xiaobei/citations.ts";

test("小北裸词条引用转链接，保持代码、已有链接和地址边界", () => {
  const names = { "/terms/agent-loop": "智能体循环", "/terms/context": "上下文", "/terms/tools": "工具调用" };
  const render = text => renderToStaticMarkup(createElement(Markdown, { remarkPlugins: [remarkGfm, [remarkTermLinks, names]], children: text }));
  const html = render("（/terms/agent-loop、 /terms/context）与 /terms/tools。\n\n[已写好的引用](/terms/tools)");
  assert.ok(html.includes('<a href="/terms/agent-loop">智能体循环</a>、 <a href="/terms/context">上下文</a>'));
  assert.ok(html.includes('<a href="/terms/tools">工具调用</a>。'));
  assert.ok(html.includes('<a href="/terms/tools">已写好的引用</a>'));
  assert.equal((html.match(/<a /g) || []).length, 4);
  for (const source of ["`/terms/tools`", "```\n/terms/tools\n```", "/terms/unpublished", "/terms/tool", "/terms/tools-more", "/terms/tools/extra", "/terms/tools?q=1", "//terms/tools", "https://example.com/terms/tools", "relative/terms/tools"]) {
    assert.ok(!render(source).includes('href="/terms/'), source);
  }
  assert.ok(render("/terms/agent-loo").includes("/terms/agent-loo"));
  assert.ok(render("/terms/agent-loop").includes('href="/terms/agent-loop"'));
});
