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

星图位置由 `lib/term-graph.ts` 在构建时生成。页面中的拖动只调整当前视图，不改写词库；新增词条或修改关系后重新构建即可同步。
