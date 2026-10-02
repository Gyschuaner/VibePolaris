# 169–178 词条文案更新与上线记录 · VBP-055

本批按用户要求逐条修改，累计十条后统一发布。十个词条分别完成资料核对、真实 ZCode CLI 协作、主助手取舍、结构检查和独立提交；最后才把十个 slug 一次加入 `content/zh/published-terms.json`。本阶段已完成本地构建和真实浏览器验收，生产发布记录在批量上线后补充。范围是已有词条的中文正文、边界、读者追问、机制演示、测验提示和来源映射，其他功能继续留在本地。

需求：`VBP-055` · `7587038f-baa4-4d4c-a7f3-9ec15747dd84` · 第036批：前端基础与技术栈词条升级。十个研发任务在生产发布完成后再统一置为 `done`。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 169 | responsive | `a5a750ee-5d9a-411e-93a1-1d72f1bd8849` | `1c5ea509` |
| 170 | css | `72479f92-30ef-4470-ab64-3eb5051ab213` | `8f7b3ab5` |
| 171 | form | `7e3a622c-39c1-415b-bece-109c40dabe21` | `15b39abc` |
| 172 | html | `0fb1165b-b1b8-4c34-a31a-cb1a62568dab` | `f3818a10` |
| 173 | javascript | `795fed63-60d3-4bc9-9f3a-de4eeb988c3e` | `d0486683` |
| 174 | dom | `c92934e5-96dc-47eb-b946-b3b2b2a8f066` | `6e42d7e3` |
| 175 | framework | `40b2ddde-ae65-401d-8052-34338995318f` | `65bcebaf` |
| 176 | ssg-ssr | `d7da3593-402e-476c-aff4-f36abca19e52` | `ab6644d7` |
| 177 | deploy | `1d7dff6e-5e46-4339-92d3-d6ee047727bc` | `9e1e3bcf` |
| 178 | library | `17ad9564-e6ed-4feb-827d-39944f37fdc5` | `f0237c06` |

`41d72ac4` 是十条一起加入公开清单的批次提交；十条内容提交保持独立，公开清单没有在单条内容提交中提前放出。

## 内容与资料

本批内容分别落在基础词条数据、数据驱动演示和研究映射中：

- `content/zh/terms.json`：responsive、form、html、javascript、dom、framework、ssg-ssr、deploy、library 的正文与页面结构。
- `content/zh/foundation-terms/css.json`：CSS 的正文、演示、边界和引用。
- `content/zh/term-experiences/base.json`：本批十条的数据驱动演示状态与提示。
- `content/zh/term-research/base.json`：本批十条的来源和论断映射。
- `content/zh/published-terms.json`：一次追加十个公开 slug。

本批的讲解主线按词条分别处理：响应式布局从可用空间和内容失效点决定重排；CSS 沿选择器命中、层叠胜者、计算值和布局结果展开；表单把标签、约束校验、错误关联和提交状态放在同一条反馈链上；HTML 区分语义结构、浏览器解析和无障碍关系；JavaScript 用事件、状态、DOM 和浏览器能力说明行为变化；DOM 展示文档树、查询、修改和重新渲染；框架与库用控制流和调用方向区分；SSG/SSR 区分构建时、请求时和客户端接管；部署沿提交、制品、目标环境、健康检查、流量和回滚走一遍；库用固定调用接口、原生能力、依赖体积和维护成本比较取舍。

研究记录中的公开来源均已实际阅读，并映射到对应正文或演示：

- `responsive`： [MDN Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)、[MDN Media queries](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries)、[W3C CSS Containment Level 3](https://www.w3.org/TR/css-contain-3/)、[W3C Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow)。
- `css`： [MDN CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)、[W3C CSS Cascading Level 5](https://www.w3.org/TR/css-cascade-5/)、[MDN Box model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)、[MDN CSS layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout)。
- `form`： [MDN Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)、[W3C labels](https://www.w3.org/WAI/tutorials/forms/labels/)、[W3C errors](https://www.w3.org/WAI/tutorials/forms/notifications/)、[OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)。
- `html`： [WHATWG HTML](https://html.spec.whatwg.org/)、[MDN HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)、[MDN Structuring content](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content)、[WCAG Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)。
- `javascript`： [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)、[MDN Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)、[MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)、[ECMAScript Language Specification](https://tc39.es/ecma262/)。
- `dom`： [WHATWG DOM](https://dom.spec.whatwg.org/)、[MDN DOM scripting](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting)、[MDN querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)、[MDN textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)。
- `framework`： [Next.js Docs](https://nextjs.org/docs)、[Next.js layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)、[React Describing the UI](https://react.dev/learn/describing-the-ui)、[Angular overview](https://angular.dev/overview)。
- `ssg-ssr`： [Next.js Linking and navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)、[Next.js Revalidating](https://nextjs.org/docs/app/getting-started/revalidating)、[React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)、[Next.js CDN caching](https://nextjs.org/docs/app/guides/cdn-caching)。
- `deploy`： [GitHub deployment controls](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments)、[GitHub deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)、[Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)、[Google SRE canarying](https://sre.google/workbook/canarying-releases/)。
- `library`： [MDN Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)、[React Describing the UI](https://react.dev/learn/describing-the-ui)、[npm dependencies](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file)、[npm audit reports](https://docs.npmjs.com/about-audit-reports)。

## ZCode CLI 协作证据

使用真实 ZCode CLI 入口 `/tmp/zcode-cli/zcode.cjs`，临时数据目录为 `/tmp/zcode-data`，模型配置为 `Qwen3.8-Flash-Next-FP8`。所有派发均使用当前仓库的 `vibepolaris-zcode-partner` 与 `humanizer-zh` 绝对路径；ZCode 只读词条材料，不修改仓库。每条先派发 `reader`，再派发 `language`，主助手依据来源、schema 和页面状态决定是否采纳。

| slug | reader / language |
| --- | --- |
| responsive | `sess_30ae226f-6657-41e8-a7cd-e49510a9809f` / `sess_fe8a699d-1524-4806-a070-fc0e485ac128` |
| css | `sess_9ab675ca-2318-4644-96ed-7f82d6cd0f16` / `sess_0e2a1107-b6b3-4cc4-b4a8-57eee82d65e9` |
| form | `sess_b8573887-60b4-4b35-a7db-a479507cb1b0` / `sess_77a4bf41-a6c2-43c1-8f06-11fc39c15861` |
| html | `sess_d727f92e-534c-4218-b8cb-9bd0ba9a7068` / `sess_22c26a6a-d212-4daa-9d03-524cdf2ede97` |
| javascript | `sess_0e80ae56-3301-4ef3-95e6-9096046a8d8e` / `sess_ee0be0a2-a77b-4b31-80ab-a218c5bd9695` |
| dom | `sess_24d1f651-8fb7-4137-9b16-e372d02222af` / `sess_122ec051-1df1-4ff2-b5c5-48dd1960d9bd` |
| framework | `sess_4ef5ff66-ef69-40e5-be39-753c70ce7ec7` / `sess_0717115f-2a03-42b2-96e6-166f18127d73` |
| ssg-ssr | `sess_074fb074-4ca5-4b89-b4e9-dc69fcfbb998` / `sess_1015a501-7060-4441-b0e9-2bb1e99bcd86` |
| deploy | `sess_f391c7c7-d218-436a-b46e-65e17583deb3` / `sess_6b76aa6e-7b64-4d76-8bd1-b377a966a410` |
| library | `sess_f4b8d55f-d128-45a5-a91f-b55ca6d79f6d` / `sess_3e8b118a-57c7-4a5e-ace0-e0cee32fae6b` |

## 本地验证

- `npm run build` 通过，TypeScript 通过，静态页面生成 `177/177`。
- `git diff --check` 和本批 JSON 解析通过；公开清单从 155 条增至 165 条，尾部正好是本批十个 slug。
- CUA 真实浏览器在本地 `3010` 端口逐条打开十个 `/terms/<slug>` 路由，十页标题、H1、正文和来源区均可见，均没有 404；CSS 页面检查了选择器—层叠—计算值演示，部署页面推进了“锁定版本 → 构建制品”状态，库、SSG/SSR、部署页面查看了实际画面；浏览器控制台日志为空。
- 本批只有文字与数据驱动体验内容进入当前分支，其他功能仍留在本地；生产发布需在本记录补充合并、覆盖分支、镜像、路径、健康检查和回滚证据。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此不创建空记录。
