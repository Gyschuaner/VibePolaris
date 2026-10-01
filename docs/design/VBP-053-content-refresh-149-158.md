# 149–158 词条文案更新与上线记录 · VBP-053

本批按用户要求逐条修改，累计十条后统一发布。每个词条单独完成资料核对、ZCode reader/language 审读、主助手取舍、结构检查和提交；最后才把十个 slug 一次加入 `content/zh/published-terms.json`。范围是已有数据驱动词条的中文正文、边界、演示状态、测验提示和来源映射，其他功能保持在本地。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 149 | semantic-versioning | `24b033c8-d85d-434c-82dd-0b291445a140` | `bd69d0e1` |
| 150 | lockfile | `0ae0b530-3852-4a06-bfb9-033bf8e43568` | `92b2c5d5` |
| 151 | monorepo | `8905476d-dc3a-4a76-ade3-02ef628b3ce5` | `c5a22c21` |
| 152 | environment-variable | `cd0cf57d-f8e4-4af9-b562-d449e5ab234d` | `de398a3f` |
| 153 | source-map | `ac5feb13-88af-42dd-8676-d3fe6f301c2e` | `c5c38e28` |
| 154 | linter | `7d6d5fb5-38a8-4214-b8f7-e883223e8302` | `54db49e9` |
| 155 | formatter | `aafcf1eb-34fb-47f2-854c-d5ece3b24191` | `34a37205` |
| 156 | expression | `04440cc4-743e-4975-9f34-06dca34a18a6` | `8c41db2b` |
| 157 | function | `80a9789a-86c8-4c9c-93dc-47617174cb55` | `492d5572` |
| 158 | parameter | `8aeeb3d2-c76e-4b3f-a600-59a38ab26540` | `9c65e1c2` |

`6db7d4d1` 是十条一起加入公开清单的批次提交；十条内容提交保持独立，公开清单没有在单条提交中提前放出。

## 内容与资料

本批围绕版本、依赖、仓库配置和代码基础拆出不同主线：语义化版本用 MAJOR/MINOR/PATCH 和兼容性变化解释版本号；锁文件区分声明文件、直接依赖与传递依赖；单体仓库展示一个仓库内多个交付单元的依赖图；环境变量说明进程启动时读取配置以及服务端与前端暴露边界；源映射连接生成文件和原始源码的位置；代码检查器与格式化器分别解释规则诊断和稳定排版；表达式通过值、求值和副作用区分表达式与语句；函数用参数绑定、局部调用帧、返回值和外部读写展示一次调用；参数进一步区分形参/实参、位置或名称绑定、默认值、缺失和多给实参。

十条体验数据均保留独立场景，正文、体验和研究记录分别映射在：

- `content/zh/term-batches/ai-stack.json`
- `content/zh/term-experiences/ai-stack.json`
- `content/zh/term-research/ai-stack.json`

每条词条均保留 4 个已实际阅读的一手或维护方来源。来源包括 SemVer、npm、pnpm、Bazel、Node.js、Vite、Next.js、Docker、ECMA-426、TypeScript、Chrome DevTools、MDN、ESLint、typescript-eslint、Prettier、Go、rustfmt、ECMAScript、Python 和 TypeScript 官方资料；具体 URL、标签和正文映射以三份内容 JSON 为准。

## ZCode CLI 协作证据

使用真实 ZCode CLI 入口 `/tmp/zcode-cli/zcode.cjs`，临时数据目录为 `/tmp/zcode-data`，模型配置为 `Qwen3.8-Flash-Next-FP8`。reader 和 language 会话均按当前仓库的 `vibepolaris-zcode-partner` 与 `humanizer-zh` 绝对路径派发，只读当前词条材料，不让 ZCode 修改仓库。

| slug | reader / language |
| --- | --- |
| semantic-versioning | `sess_6beb3a98-9de3-4394-9b67-057861497c9a` / `sess_b469b3df-a7fd-44d3-a0ea-772cbba8dc41` |
| lockfile | `sess_7d8f7f29-0df7-4e4b-9e06-fd69b204dfd8` / `sess_e5bc772c-ebd6-4714-b850-7c8fa1ed4740` |
| monorepo | `sess_3eed2bd3-219e-48a4-86c3-5e6813b1ef6e` / `sess_64d31325-6b21-469b-bcb1-a45a449f3b67` |
| environment-variable | `sess_7a5b621f-62f9-4d3a-a3fd-6d46130e270f` / `sess_4a198f81-c45b-4f51-bcca-6161d3a815a2` |
| source-map | `sess_fd1b9184-a3e0-41d6-b4d0-f54051040b38` / `sess_49682883-7bd5-4cc5-bb67-50d7d6de8357` |
| linter | `sess_8a6eef9b-fb74-4b59-9278-632553eac7d8` / `sess_9392a1a9-f2de-438a-a91c-e308d0a24e31` |
| formatter | `sess_7b5477bb-4d7c-4eab-bd92-470f83a57016` / `sess_cf5e531a-528b-4228-9ef2-bac03f1843f6` |
| expression | `sess_2479fb2d-56d0-4576-9f41-64d210b10242` / `sess_f901fc5d-8bc5-429b-9488-5c6a69e12f23` |
| function | `sess_7e6389c6-8b01-4418-9e42-a4b01a327462` / `sess_d163ed02-0fa1-4aa6-adaa-229df37a37d2` |
| parameter | `sess_e8dce97e-32c3-4df4-9a14-86b47b193753` / `sess_086a8dc8-2430-4921-bb59-071c34c9bd9b` |

reader 输入是当前词条的读者可见文案与按阶段配对的状态材料；language 输入是当前成稿与 `humanizer-zh`。reader 反馈推动了函数调用帧、参数默认值、缺失/多给实参和绑定顺序边界的补充；language 复核统一了形参/实参、多给实参和局部调用的中文表达。模拟反馈只作为编辑线索，最终取舍由主助手按一手来源、schema 和页面状态完成。

## 本地验证

- 三份 JSON 均通过解析，`git diff --check` 通过。
- 首次统一构建发现 `demoSteps` schema 要求恰好 3 步；已将 `parameter` 的批次演示收敛为“定义 → 传入实参 → 省略 rate 使用默认值”，交换顺序保留在独立互动帧中。
- `npm run build`：公开清单更新前通过，静态页 `147/147` 生成；十条加入公开清单后再次通过，静态页 `157/157` 生成，TypeScript 通过。
- 十条本地路由均返回 HTTP 200：`semantic-versioning`、`lockfile`、`monorepo`、`environment-variable`、`source-map`、`linter`、`formatter`、`expression`、`function`、`parameter`。
- CUA 真实浏览器在本地 3003 端口打开 `parameter`，依次推进“调用提供实参”“按位置绑定”“省略 rate”“交换顺序”，观察到 `price=100/rate=0.2`、默认值和交换后的 `price=0.2/rate=100`；选择默认值答案后显示正确反馈。
- 未执行真实目标读者测试；ZCode reader 是模拟审读，不能替代用户验收。

## 生产发布记录

截至创建本记录时，本批已完成逐条内容、十条批量公开清单、构建和本地受影响交互验收；VBP-053 的生产合并、部署、线上十条路由检查和 DP 发布记录在完成后补录。生产覆盖分支必须保留现有线上 `/news` 版本，只叠加本批内容和公开清单。

Obsidian 记录路径 `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，本批不创建空记录；研发记录保留在本文件与 DP。
