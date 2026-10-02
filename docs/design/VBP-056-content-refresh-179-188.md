# 179–188 词条文案更新与上线记录 · VBP-056

本批按用户要求逐条修改、逐条提交，累计十条后统一发布。每个词条都先完成资料核对、真实 ZCode CLI reader/language 审读、主助手取舍和单条构建/浏览器验收；十条内容完成后，才一次性追加公开清单。范围是已有词条的中文正文、边界、读者追问、机制演示、测验提示和来源映射，其他功能继续留在本地。

需求：`VBP-056` · `c7cf20b6-fd29-4a14-8514-d8e75eb2417c` · 第037批：运行时、包管理与产品设计基础词条升级。十个研发任务在批量发布完成后统一置为 `done`。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 179 | runtime | `c6c99f7e-ade7-4260-8aa9-65672bac936f` | `5be274b7` |
| 180 | package | `d65df974-b6d1-435d-b090-e6c5415c4f67` | `28ad73e2` |
| 181 | typescript | `9dc8e1c9-ed5a-4b3a-b498-9d946aa05deb` | `eda2126e` |
| 182 | repo-commit | `53d99e0b-6093-4c41-9ce6-38979c918077` | `3b6e7a83` |
| 183 | branch | `a0ca5713-7220-49a3-a2f4-d6f1375c16c5` | `6ccf4ccd` |
| 184 | mvp | `5255d963-7998-48e1-bea3-23ea6961b55d` | `c72e16a4` |
| 185 | user-flow | `a0506c69-6a61-40d2-b2c1-044f0edb2720` | `9d70d9cc` |
| 186 | wireframe | `35a792e5-71bf-4e04-8cee-3258c139f061` | `dd8ba3b4` |
| 187 | ia | `2c617c29-52c2-4ddb-bb4d-7793306acd24` | `2650fb22` |
| 188 | prototype | `c146f969-f1a1-47c6-955f-41b4fa4c455f` | `d87c6824` |

十条内容提交保持独立；发布清单在后续单独提交中一次追加十个 slug，没有在任何单条内容提交中提前公开。

## 内容与资料

本批内容落在基础词条数据、数据驱动演示和研究映射中：

- `content/zh/terms.json`：runtime、package、typescript、repo-commit、branch、mvp、user-flow、wireframe、ia、prototype 的正文、边界、读者问题、演示摘要和测验。
- `content/zh/term-experiences/base.json`：本批十条的场景角色、边、逐帧状态、提示、测验和来源。
- `content/zh/term-research/base.json`：本批十条的机制、误解边界、演示签名、来源和近邻词条映射。
- `content/zh/published-terms.json`：发布阶段一次追加本批十个 slug。

本批讲解主线按词条分别处理：运行时把语言能力与浏览器/Node.js 宿主 API 放在同一段代码的环境切换里；包管理区分 `package.json` 的版本范围、锁文件的精确依赖树和 `node_modules` 的安装结果；TypeScript 展示类型约束、提前诊断、JavaScript 输出与运行时输入；仓库与提交沿工作区、差异、暂存、提交和推送展开；分支展示共同起点、独立提交线和合并；MVP 用关键假设、核心体验和证据说明取舍；用户流程把过期链接、输入不一致和回到原任务放进完整路径；线框图先安排内容、分组、层级和操作位置，再说明视觉与真实内容仍需验证；信息架构从用户任务、分类、搜索语言和交叉入口组织内容；原型用可操作的局部版本验证真实任务和关键假设，并明确模拟数据与生产实现的边界。

研究记录中的公开来源已映射到对应正文或演示：

- `runtime`：[MDN Execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)、[ECMAScript specification](https://tc39.es/ecma262/)、[Node.js globals](https://nodejs.org/api/globals.html)、[Node.js fs](https://nodejs.org/api/fs.html)、[MDN Document](https://developer.mozilla.org/en-US/docs/Web/API/Document)。
- `package`：[npm package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json)、[npm dependencies](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file)、[npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/)、[npm audit reports](https://docs.npmjs.com/about-audit-reports)、[npm semver](https://docs.npmjs.com/cli/v6/using-npm/semver/)。
- `typescript`：[TypeScript Handbook intro](https://www.typescriptlang.org/docs/handbook/intro)、[Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)、[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)、[Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility)、[strict](https://www.typescriptlang.org/tsconfig/strict.html)。
- `repo-commit`：[Git recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)、[git add](https://git-scm.com/docs/git-add)、[git diff](https://git-scm.com/docs/git-diff)、[git commit](https://git-scm.com/docs/git-commit)、[git push](https://git-scm.com/docs/git-push)。
- `branch`：[Git branches in a nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell.html)、[git branch](https://git-scm.com/docs/git-branch)、[git switch](https://git-scm.com/docs/git-switch)、[git merge](https://git-scm.com/docs/git-merge)、[git rebase](https://git-scm.com/docs/git-rebase)。
- `mvp`：[GOV.UK alpha](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works)、[GOV.UK agile principles](https://www.gov.uk/service-manual/agile-delivery/core-principles-agile)、[GOV.UK deciding priorities](https://www.gov.uk/service-manual/agile-delivery/deciding-on-priorities)、[GOV.UK MVP guidance](https://www.gov.uk/government/publications/nuar-minimum-viable-product-mvp/nuar-minimum-viable-product-mvp)、[Agile delivery assurance guide](https://assets.publishing.service.gov.uk/media/618521c1d3bf7f55fe946e98/Guide_on_Assurance_for_Agile_Delivery_of_Digital_Services_V1.2_October_2021.docx.pdf)。
- `user-flow`：[GOV.UK scoping a service](https://www.gov.uk/service-manual/design/scoping-your-service)、[GOV.UK experience map](https://www.gov.uk/service-manual/user-research/creating-an-experience-map)、[GOV.UK whole problem](https://www.gov.uk/service-manual/design/map-a-users-whole-problem)、[GOV.UK step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation/)、[GOV.UK designing services](https://www.gov.uk/service-manual/design/introduction-designing-government-services)。
- `wireframe`：[GOV.UK making prototypes](https://www.gov.uk/service-manual/design/making-prototypes)、[GOV.UK Design System prototyping](https://design-system.service.gov.uk/get-started/prototyping/)、[GOV.UK introduction to designing services](https://www.gov.uk/service-manual/design/introduction-designing-government-services)、[GOV.UK alpha](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works)、[NN/g deliverables glossary](https://media.nngroup.com/media/articles/attachments/UX-Deliverables-Glossary-PDF-2.pdf)。
- `ia`：[W3C headings and labels](https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels)、[W3C navigation design](https://www.w3.org/WAI/curricula/designer-modules/navigation-design/)、[W3C writing tips](https://www.w3.org/WAI/tips/writing/)、[GOV.UK scoping a service](https://www.gov.uk/service-manual/design/scoping-your-service)、[GOV.UK whole problem](https://www.gov.uk/service-manual/design/map-a-users-whole-problem)。
- `prototype`：[GOV.UK making prototypes](https://www.gov.uk/service-manual/design/making-prototypes)、[GOV.UK Design System prototyping](https://design-system.service.gov.uk/get-started/prototyping/)、[GOV.UK Prototype Kit](https://prototype-kit.service.gov.uk/tutorials-and-guides/)、[GOV.UK alpha](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works)、[NN/g UX prototypes](https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/)。

## ZCode CLI 协作证据

本批使用真实 ZCode CLI 入口 `/tmp/zcode-cli/zcode.cjs`，每次均指定 `--cwd /tmp/vbp056-runtime-product`、`--mode plan`、`--disallowed-tools 'Bash Edit'`，并按每条词条分别派发 `reader` 和 `language`。ZCode 只读取词条材料，不修改仓库；主助手结合来源、schema、页面状态和本地验证决定取舍。当前可复核的后段会话记录为：

| slug | reader / language |
| --- | --- |
| wireframe | `sess_9cd06a85-db1c-4ddb-b8ad-5b3fc9cfda89` / `sess_dd9282b2-81ee-41bd-bc33-d98bf416a298` |
| ia | `sess_3f08ab28-5df2-448d-9fc6-b2575050dffa` / `sess_42c5845a-664f-4bb6-adaf-eb8caba8d12b` |
| prototype | `sess_13790a02-18de-4688-9998-1288630deedc` / `sess_95009efd-f378-4a16-949a-062ccaca3758` |

runtime、package、typescript、repo-commit、branch、mvp、user-flow 也按同一 CLI 流程完成 reader/language 审读；本地临时 prompt 和材料文件保留在 `/private/tmp/vbp056-*.prompt`、`/private/tmp/vbp056-*.md`，不进入仓库。原型审读特别确认了可操作假版本与生产实现的边界、真实任务与观察指标、模拟数据/账号验证/邮件发送的说明；线框和信息架构审读确认了步骤数量、用户任务分组、来源注释和初学者追问的表达。

## 本地验证

- 每条词条修改后均单独提交；`git diff --check` 通过，十条提交均只涉及该条所需的内容数据文件。
- 每条词条均使用临时公开清单单独打开 `/terms/<slug>` 做真实浏览器检查，确认标题、H1、正文、演示、测验和来源区可见；同时检查窄屏视口，浏览器控制台无错误。公开清单在每次单条验收后恢复到 165 条，未提前上线。
- 十条内容完成后，在发布阶段把公开清单一次追加十个 slug，预期从 165 条变为 175 条，再执行最终构建和导航检查。
- `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此不创建空记录。

## 生产发布记录

本节在十条公开清单一次性发布、DP 发布对象和线上健康检查完成后补充。
