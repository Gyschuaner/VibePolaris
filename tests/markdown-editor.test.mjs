import assert from "node:assert/strict";
import test from "node:test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import { remarkMark } from "remark-mark-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { formatMarkdown, markdownShortcut } from "../lib/markdown-editing.ts";
import { insertMarkdownImages, markdownImageRanges, readMarkdownImages } from "../lib/markdown-images.ts";
import { markdownSchema, rehypeFallbackTitle, rehypeTextColors, safeTextColor } from "../lib/markdown-rendering.ts";

function apply(value, start, end, format) {
  const edit = formatMarkdown(value, start, end, format);
  return { value: value.slice(0, edit.from) + edit.text + value.slice(edit.to), start: edit.start, end: edit.end };
}

test("image insertion preserves surrounding prose, order, escaped names and the Markdown size limit", async () => {
  const source = "data:image/png;base64,iVBORw0KGgo=";
  const edit = insertMarkdownImages("前文后文", 2, [{ name: "图[1]\\示例.png", source }, { name: "第二张.png", source }]);
  const result = "前文后文".slice(0, edit.from) + edit.text + "前文后文".slice(edit.to);
  assert.match(result, /^前文\n\n!\[图\\\[1\\\]\\\\示例\]/);
  assert.ok(result.endsWith("\n\n后文"));
  assert.equal(result.slice(edit.end), "后文");
  const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeSanitize, markdownSchema);
  const tree = await processor.run(processor.parse(result));
  const images = tree.children.flatMap(node => node.children ?? []).filter(node => node.tagName === "img");
  assert.deepEqual(images.map(image => image.properties.alt), ["图[1]\\示例", "第二张"]);
  assert.ok(images.every(image => image.properties.src === source));
  const ranges = markdownImageRanges(result);
  assert.deepEqual(ranges.map(image => image.alt), ["图[1]\\示例", "第二张"]);
  assert.ok(ranges.every(image => result.slice(image.from, image.to).startsWith("![")));
  assert.equal(markdownImageRanges('`![code](https://example.com/a.png)`\n\n```md\n![code](https://example.com/b.png)\n```\n\n![unsafe](javascript:alert)\n\n![ref][pic]\n\n[pic]: https://example.com/c.png').length, 1);
  assert.equal(insertMarkdownImages("", 0, [{ name: "image.png", source }]).from, 0);
  assert.throws(() => insertMarkdownImages("字".repeat(4 * 1024 * 1024), 0, [{ name: "image.png", source }]), /10 MB/);
  await assert.rejects(readMarkdownImages([{ type: "image/svg+xml", size: 10 }]), /5 MB/);
  await assert.rejects(readMarkdownImages([{ type: "image/png", size: 6 * 1024 * 1024 }]), /5 MB/);
  await assert.rejects(readMarkdownImages(Array(2).fill({ type: "image/png", size: 5 * 1024 * 1024 })), /10 MB/);
});

test("生成笔记的来源标记不会替代标题，已有 Markdown/HTML 标题不重复", async () => {
  const processor = unified().use(remarkParse).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeSanitize, markdownSchema).use(rehypeFallbackTitle, "状态码 <示例>");
  for (const markdown of ["> 小北生成\n\n正文", "> 小北生成\n\n```md\n# 代码中的标题\n```", "# 原文标题\n\n> 小北生成", "原文标题\n===\n\n> 小北生成", "<h1>原文标题</h1>\n\n> 小北生成"]) {
    const tree = await processor.run(processor.parse(markdown));
    const headings = tree.children.filter(node => node.tagName === "h1");
    assert.equal(headings.length, 1);
    assert.equal(headings[0].children[0].value, markdown.startsWith(">") ? "状态码 <示例>" : "原文标题");
    assert.ok(tree.children.some(node => node.tagName === "blockquote"));
  }
  const unchanged = { type: "root", children: [] }; rehypeFallbackTitle()(unchanged); assert.deepEqual(unchanged.children, []);
});

test("format commands preserve selection, toggle wrappers, and insert safe block boundaries", () => {
  assert.deepEqual(apply("想法", 0, 2, "bold"), { value: "**想法**", start: 2, end: 4 });
  assert.deepEqual(apply("**想法**", 2, 4, "bold"), { value: "想法", start: 0, end: 2 });
  assert.deepEqual(apply("**想法**", 0, 6, "bold"), { value: "想法", start: 0, end: 2 });
  assert.deepEqual(apply("前后", 1, 1, "bold"), { value: "前****后", start: 3, end: 3 });
  assert.equal(apply("想法", 0, 2, "highlight").value, "==想法==");
  assert.equal(apply("想法", 0, 2, "strike").value, "~~想法~~");
  assert.equal(apply("a`b", 0, 3, "code").value, "``a`b``");
  assert.equal(apply("`code`", 0, 6, "code").value, "code");
  assert.equal(apply("想法", 0, 2, "color").value, '<span style="color: #a33a32">想法</span>');
  assert.deepEqual(apply("想法", 0, 2, "link"), { value: "[想法](https://)", start: 5, end: 13 });
  assert.equal(apply("前后", 1, 1, "codeblock").value, "前\n```\n\n```\n后");
  assert.match(apply("", 0, 0, "mermaid").value, /^```mermaid\nflowchart LR/);
  const table = apply("前文\n后文", 0, 3, "table");
  assert.match(table.value, /^前文\n\n\| 列 1 \| 列 2 \| 列 3 \|\n\| --- \| --- \| --- \|\n[\s\S]+\n\n后文$/);
  assert.equal(table.value.slice(table.start, table.end), "列 1");
  assert.ok(apply("", 0, 0, "table").value.startsWith("| 列 1 |"));
  const indented = apply("一\n二\n三", 0, 4, "indent");
  assert.equal(indented.value, "  一\n  二\n三");
  assert.equal(apply(indented.value, indented.start, indented.end, "outdent").value, "一\n二\n三");
  assert.equal(apply("\n内容", 0, 0, "indent").value, "  \n内容");
  assert.equal(markdownShortcut("b", false), "bold");
  assert.equal(markdownShortcut("h", true), "highlight");
  assert.equal(markdownShortcut("Enter", false), null);
});

test("rendering supports Obsidian highlights, safe color, GFM and code without executing note HTML", async () => {
  const source = '==高亮 **加粗**== ~~删除~~ `==原样==` \\==转义==\n\n<span style="color: #8053a3">紫色</span> <span style="color:red;position:fixed">无样式</span><script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)">\n\n```js\nconst answer = 42;\n```\n\n```mermaid\nflowchart LR\n A --> B\n```\n\n| 功能 | 状态 | 说明 |\n| :--- | :---: | ---: |\n| **表格** | 已支持 | 一\\|二 |';
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMark).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeTextColors).use(rehypeSanitize, markdownSchema).use(rehypeHighlight, { detect: false, ignoreMissing: true, plainText: ["mermaid"] });
  const tree = await processor.run(processor.parse(source));
  const nodes = [];
  function collect(node) { nodes.push(node); node.children?.forEach(collect); }
  collect(tree);
  assert.equal(nodes.filter(node => node.tagName === "mark").length, 1);
  assert.ok(nodes.some(node => node.tagName === "del"));
  assert.ok(nodes.some(node => node.properties?.style === "color: #8053a3"));
  assert.ok(nodes.some(node => node.properties?.className?.includes("hljs-keyword")));
  assert.ok(nodes.some(node => node.properties?.className?.includes("language-mermaid")));
  assert.equal(nodes.filter(node => node.tagName === "table").length, 1);
  assert.equal(nodes.filter(node => node.tagName === "th").length, 3);
  assert.equal(nodes.filter(node => node.tagName === "td").length, 3);
  assert.ok(nodes.some(node => node.tagName === "td" && node.properties.align === "center"));
  assert.ok(nodes.some(node => node.tagName === "td" && node.properties.align === "right"));
  assert.ok(nodes.some(node => node.type === "text" && node.value === "一|二"));
  assert.ok(!nodes.some(node => node.tagName === "script" || node.properties?.onError || String(node.properties?.src).startsWith("javascript:") || String(node.properties?.style).includes("position")));
  assert.equal(safeTextColor("color: red; background: url(https://invalid.example)"), undefined);
  assert.equal(safeTextColor("color: expression(alert(1))"), undefined);
});
