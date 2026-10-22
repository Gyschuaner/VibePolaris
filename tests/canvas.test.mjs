import assert from "node:assert/strict";
import test from "node:test";
import { availablePosition, connectNodes, editNodeTask, emptyCanvas, exportNodeMarkdown, importNodeMarkdown, markdownFileName, moveView, nodePreview, nodeResource, nodeTasks, parseCanvas, safeNodeUrl, withNodeResource } from "../lib/canvas.ts";
import { connectionPath, edgeAnchors, portAnchor } from "../lib/canvas-routing.ts";

const note = (id, markdown) => ({ id, markdown, fileName: "", x: 20, y: -40, createdAt: "2026-10-19T02:00:00.000Z", updatedAt: "2026-10-19T02:00:00.000Z" });

test("自由 Markdown 可无标题；标题、简述与安全导出文件名不改变正文", () => {
  const input = note("one", "# 一个网站点子\n\n把 **灵感** 放在一起。\n\n[参考](/terms/css)");
  assert.deepEqual(nodePreview(input), { title: "一个网站点子", summary: "把 灵感 放在一起。" });
  assert.equal(nodePreview({ ...input, markdown: '# 标题\n\n==重点==与<span style="color: #777777">灰色文字</span>' }).summary, "重点与灰色文字");
  assert.equal(nodePreview(note("two", "有些东西，先留下就好。")).title, "有些东西，先留下就好。");
  assert.equal(nodePreview({ markdown: "", fileName: "读书随记.md" }).title, "读书随记");
  assert.equal(nodePreview(note("empty", "")).title, "未命名笔记");
  assert.equal(markdownFileName(note("unsafe", "# A/B:想法")), "A_B_想法.md");
  assert.equal(input.markdown, "# 一个网站点子\n\n把 **灵感** 放在一起。\n\n[参考](/terms/css)");
});

test("新建和导入避开已有节点，窄画布逐行放置", () => {
  const existing = [{ x: 0, y: 0 }, { x: 330, y: 0 }];
  assert.deepEqual(availablePosition(existing, { x: 0, y: 0 }), { x: 660, y: 0 });
  assert.deepEqual(availablePosition(existing, { x: 0, y: 0 }, 1), { x: 0, y: 170 });
  assert.deepEqual(availablePosition([{ x: 0, y: 0, kind: "image" }], { x: 0, y: 170 }, 1), { x: 0, y: 340 });
});

test("旧画布兼容；节点显示信息和四种内容可随 Markdown 往返且不改正文", () => {
  const original = note("old", "# 原正文标题\r\n\r\n正文 **保留**。\r\n");
  assert.deepEqual(parseCanvas({ ...emptyCanvas(), nodes: [original] }).nodes[0], original);
  assert.equal(parseCanvas({ ...emptyCanvas(), version: 1 }).version, 5);
  assert.equal(exportNodeMarkdown(original), original.markdown);
  for (const kind of ["note", "link", "image", "todo"]) {
    const node = { ...original, kind, title: "画布标题 --> <script>", summary: "手动摘要\n第二行" };
    assert.deepEqual(importNodeMarkdown(exportNodeMarkdown(node)), { kind, title: node.title, summary: node.summary, markdown: original.markdown });
    assert.equal(nodePreview(node).title, node.title);
    assert.equal(nodePreview({ ...node, summary: "" }).summary, "");
  }
  assert.throws(() => importNodeMarkdown('<!-- vibepolaris-node {"kind":"unknown"} -->\n正文'));
  assert.equal(safeNodeUrl("javascript:alert(1)"), undefined);
  assert.equal(safeNodeUrl("data:image/svg+xml;base64,PHN2Zz4=", true), undefined);
  assert.equal(safeNodeUrl("/terms/css"), "/terms/css");
  const image = { kind: "image", markdown: "![图片](<https://example.com/a.png>)\n\n保留图注" };
  const src = "data:image/png;base64,aGVsbG8=";
  assert.equal(safeNodeUrl(src, true), src);
  assert.equal(safeNodeUrl(src), undefined);
  const changed = { ...image, markdown: withNodeResource(image, src) };
  assert.equal(nodeResource(changed), src);
  assert.ok(changed.markdown.endsWith("\n\n保留图注"));
  const todo = "# 清单\n\n- [ ] 读书\n- [x] 写笔记\n\n正文";
  const tasks = nodeTasks(todo);
  assert.deepEqual(tasks.map(({ text, checked }) => [text, checked]), [["读书", false], ["写笔记", true]]);
  assert.ok(editNodeTask(todo, tasks[0].line, true).includes("- [x] 读书"));
  assert.equal(editNodeTask(todo, tasks[1].line, null), "# 清单\n\n- [ ] 读书\n\n正文");
  assert.equal(nodeTasks("```md\n- [ ] 示例\n```\n- [ ] 真正待办").length, 1);
});

test("连线不重复、不自连、不指向不存在的节点；损坏存储不作为空画布覆盖", () => {
  const data = { ...emptyCanvas(), nodes: [note("a", "A"), note("b", "B")] };
  const linked = connectNodes(data, "a", "b");
  assert.equal(linked.edges.length, 1);
  assert.equal(connectNodes(linked, "b", "a"), linked);
  assert.equal(connectNodes(linked, "a", "a"), linked);
  assert.equal(connectNodes(linked, "a", "missing"), linked);
  assert.deepEqual(parseCanvas(linked), linked);
  assert.throws(() => parseCanvas({ ...linked, nodes: [note("a", "A")] }));
  assert.throws(() => parseCanvas({ ...linked, nodes: [note("a", "A"), note("a", "B")] }));
  assert.throws(() => parseCanvas({ ...linked, view: { x: Infinity, y: 0, scale: 1 } }));
});

test("缩放保持指针下的画布坐标，并限制可用缩放范围", () => {
  const view = { x: 80, y: -40, scale: 1 };
  const next = moveView(view, 1.6, 300, 200);
  assert.equal((300 - next.x) / next.scale, (300 - view.x) / view.scale);
  assert.equal((200 - next.y) / next.scale, (200 - view.y) / view.scale);
  assert.equal(moveView(view, 10, 0, 0).scale, 2);
  assert.equal(moveView(view, .01, 0, 0).scale, .3);
});

function samplePath(path) {
  const samples = [];
  let from;
  for (const command of path.matchAll(/([MLCQ])\s+([^MLCQ]+)/g)) {
    const values = command[2].match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
    const points = Array.from({ length: values.length / 2 }, (_, index) => ({ x: values[index * 2], y: values[index * 2 + 1] }));
    if (command[1] === "M") { from = points[0]; samples.push(from); continue; }
    for (let step = 1; step <= 100; step++) {
      const t = step / 100, s = 1 - t;
      const weights = command[1] === "C" ? [s ** 3, 3 * s * s * t, 3 * s * t * t, t ** 3] : command[1] === "Q" ? [s * s, 2 * s * t, t * t] : [s, t];
      const controls = [from, ...points];
      samples.push({ x: controls.reduce((sum, point, index) => sum + point.x * weights[index], 0), y: controls.reduce((sum, point, index) => sum + point.y * weights[index], 0) });
    }
    from = points.at(-1);
  }
  return samples;
}

test("连线保留端点，绕开自身及途经节点文字，反向、竖向和负坐标也连续", () => {
  const cases = [
    [{ x: 12, y: 17 }, { x: 330, y: 410 }, [{ x: 24, y: 0, width: 230, height: 75 }, { x: 24, y: 280, width: 275, height: 85 }, { x: 342, y: 393, width: 250, height: 40 }]],
    [{ x: 420, y: -150 }, { x: -300, y: 120 }, [{ x: -100, y: -150, width: 300, height: 200 }, { x: 30, y: 10, width: 260, height: 140 }]],
    [{ x: 0, y: 0 }, { x: 0, y: 400 }, [{ x: -80, y: 100, width: 160, height: 100 }, { x: -20, y: 190, width: 130, height: 90 }]],
  ];
  for (const [from, to, labels] of cases) {
    for (const [start, end] of [[from, to], [to, from]]) {
      const path = connectionPath(start, end, labels), points = samplePath(path);
      assert.deepEqual(points[0], start); assert.deepEqual(points.at(-1), end);
      assert.ok(!/NaN|Infinity/.test(path));
      for (const point of points) for (const label of labels) assert.ok(!(point.x > label.x - 4 && point.x < label.x + label.width + 4 && point.y > label.y - 4 && point.y < label.y + label.height + 4), `连线进入文字留白区：${JSON.stringify(point)}`);
    }
  }
  assert.match(connectionPath({ x: 0, y: 0 }, { x: 300, y: 100 }, []), / C /);
  assert.ok(!/NaN|Infinity/.test(connectionPath({ x: 0, y: 0 }, { x: 0, y: 0 }, [{ x: 0, y: 0, width: 100, height: 100 }])));
});


test("四边连接点随边界定位，平滑连线保持端点并避开文字", () => {
  const a = { x: 0, y: 0, width: 160, height: 70 }, b = { x: 420, y: 220, width: 170, height: 80 };
  assert.deepEqual(portAnchor(a, "left"), { x: -14, y: 35, side: "left" });
  assert.deepEqual(portAnchor(a, "bottom"), { x: 80, y: 84, side: "bottom" });
  const auto = edgeAnchors(a, { ...b, y: 0 });
  assert.equal(auto.fromPort, "right"); assert.equal(auto.toPort, "left");
  for (const side of ["top", "right", "bottom", "left"]) {
    const ends = edgeAnchors(a, b, { fromPort: side, toPort: side });
    assert.equal(ends.fromPort, side); assert.equal(ends.toPort, side);
    const path = connectionPath(ends.from, ends.to, [a, b]);
    const points = samplePath(path);
    assert.deepEqual(points[0], { x: ends.from.x, y: ends.from.y });
    assert.deepEqual(points.at(-1), { x: ends.to.x, y: ends.to.y });
    assert.match(path, /[CQ]/);
    for (const point of points) for (const label of [a, b]) assert.ok(!(point.x > label.x - 4 && point.x < label.x + label.width + 4 && point.y > label.y - 4 && point.y < label.y + label.height + 4));
  }
});

test("连线端口与样式持久化，反向重接保留原箭头和线型", () => {
  const data = { ...emptyCanvas(), nodes: [note("a", "A"), note("b", "B")] };
  const linked = connectNodes(data, "a", "b", { fromPort: "right", toPort: "left" });
  linked.edges[0] = { ...linked.edges[0], direction: "both", dashed: true };
  assert.deepEqual(parseCanvas(JSON.parse(JSON.stringify(linked))), linked);
  const changed = connectNodes(linked, "b", "a", { fromPort: "top", toPort: "bottom" });
  assert.equal(changed.edges.length, 1);
  assert.deepEqual(changed.edges[0], { ...linked.edges[0], fromPort: "bottom", toPort: "top" });
  assert.throws(() => parseCanvas({ ...linked, edges: [{ ...linked.edges[0], direction: "invalid" }] }));
});
