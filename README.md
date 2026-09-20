# VibePolaris

VibePolaris（Vibe 指北）是面向 Vibe Coder 的术语词典与选型指北。

## 本地开发

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。旧版 `prototype/` 仅作为视觉评审基线，不再承载正式页面。

## 验证与构建

```bash
npm run check
npm run start
```

- `npm run dev`：组件化开发与热更新。
- `npm run build`：校验结构化内容并生成优化后的生产构建。
- `npm run start`：运行生产构建。
- `npm run check`：依次执行 ESLint、TypeScript、测试与生产构建。

基础术语位于 `content/zh/terms.json`，扩展词库按领域拆分在 `content/zh/term-batches/`；分类位于 `content/taxonomy.json`，工具位于 `content/zh/tools.json`。构建时由 Zod 校验字段、分类、动画步骤、关联词条和 slug 唯一性。

`/graph` 从词库的 `relatedSlugs` 自动生成概念星图；`/graph?term=<slug>` 可定位某个概念。详情页相关词条与星图共用这些关系，不按分类补充未声明的链接。每个词条可声明 2–8 个关联，星图合并双向重复连线，并显示反向关联。

星图使用 [D3 Force](https://d3js.org/d3-force) 模拟连线牵引、节点排斥与碰撞；`lib/term-graph.ts` 共用同一套力参数生成初始布局并驱动页面互动。拖动节点会带动邻居，释放后逐渐稳定；鼠标经过时轻微扰动附近星星，直接指向的节点保持可点击。缩放 ≤ 1.05 时隐藏全部名字，放大至 1.5 逐渐显示。页面隐藏时暂停模拟，减少动态偏好下保留直接拖动并停用惯性和鼠标扰动。拖动不改写词库，新增词条或关系重新构建即可同步。

交互参考 [Quartz Graph](https://github.com/quartz-community/graph) 的力学图谱思路；保留本站 DOM 星星、键盘操作及词条流星跳转，只引入 `d3-force`（ISC），未复制 Quartz/PixiJS 渲染实现。
