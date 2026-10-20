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
import { markdownSchema, rehypeTextColors, safeTextColor } from "../lib/markdown-rendering.ts";

function apply(value, start, end, format) {
  const edit = formatMarkdown(value, start, end, format);
  return { value: value.slice(0, edit.from) + edit.text + value.slice(edit.to), start: edit.start, end: edit.end };
}

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
  const indented = apply("一\n二\n三", 0, 4, "indent");
  assert.equal(indented.value, "  一\n  二\n三");
  assert.equal(apply(indented.value, indented.start, indented.end, "outdent").value, "一\n二\n三");
  assert.equal(apply("\n内容", 0, 0, "indent").value, "  \n内容");
  assert.equal(markdownShortcut("b", false), "bold");
  assert.equal(markdownShortcut("h", true), "highlight");
  assert.equal(markdownShortcut("Enter", false), null);
});

test("rendering supports Obsidian highlights, safe color, GFM and code without executing note HTML", async () => {
  const source = '==高亮 **加粗**== ~~删除~~ `==原样==` \\==转义==\n\n<span style="color: #8053a3">紫色</span> <span style="color:red;position:fixed">无样式</span><script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)">\n\n```js\nconst answer = 42;\n```\n\n```mermaid\nflowchart LR\n A --> B\n```';
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
  assert.ok(!nodes.some(node => node.tagName === "script" || node.properties?.onError || String(node.properties?.src).startsWith("javascript:") || String(node.properties?.style).includes("position")));
  assert.equal(safeTextColor("color: red; background: url(https://invalid.example)"), undefined);
  assert.equal(safeTextColor("color: expression(alert(1))"), undefined);
});
