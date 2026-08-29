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

术语位于 `content/zh/terms.json`，分类位于 `content/taxonomy.json`，工具位于 `content/zh/tools.json`。构建时由 Zod 校验字段、分类和 slug 唯一性。
