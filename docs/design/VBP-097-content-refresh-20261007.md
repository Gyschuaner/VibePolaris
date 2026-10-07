# VBP-097：十条 AI 与提示词词条特色演示批量发布记录

本批从 `origin/main` 的 `224043bc5bf7f9faf137315f39dc588235a68dd` 切出 `feat/VBP-097-next-concepts`，按 `vibepolaris-concept-pages` Skill 逐条完成十个已有词条。每条都独立研究、独立实现、独立提交，并由唯一 review 子智能体 `/root/ai_stack_review` 逐条审查；十条完成后才合批进入 `dev`、`main` 和生产。

## 发布范围

| 词条 | 独立实现提交 | 演示机制 |
| --- | --- | --- |
| Generative AI | `52c59c41` | 种子花园：提示里的种子与生成结果分叉生长 |
| Multimodal | `61e13f38` | 证据镜头：文字、图片和表格经过同一观察框汇合 |
| Reasoning Model | `4c64f838` | 约束平衡：预算、约束和答案在同一架上重新配平 |
| System Prompt | `f19a8108` | 规则模板：系统规则盖在用户请求上并留下边界 |
| Few-shot Prompting | `c23810ed` | 模式压印：示例先压出结构，新输入再沿着结构成形 |
| Zero-shot Prompting | `2858e72c` | 罗盘：没有示例时只靠任务说明和约束定向 |
| Temperature | `fa689cb6` | 抽签盘：同一候选池在不同随机度下改变抽签结果 |
| Context Window | `f2f350a2` | 旅行箱：资料、规则和输出预算共同占用窗口 |
| Tokenization | `2504d09e` | 片段压板：字符串按编码器切成不同边界并重新编号 |
| Hallucination | `77393b3a` | 证据验票台：候选签被证据印章拒绝，补入字段后获得引用落点 |

每页都保留原有 slug、分类、别名、relatedSlugs 和阅读锚点；每页都有独立研究记录、段落级来源映射、概念专属的紧凑演示和本地可重复实验。首图均按概念选择对象变化，未继续使用统一流程图模板。后续词条和其他本地功能没有带入本批。

## 资料与审查

- 每条页面至少核对四份公开原始资料，正文中的事实论断通过 Cite target 回到对应来源；research、experience 与 helper 的 URL 顺序保持一致。
- `/root/ai_stack_review` 对本批十条逐条 PASS，覆盖来源可达性、段落映射、概念边界、独特演示、失败分支、暂停/逐帧/重播、`prefers-reduced-motion`、ARIA、键盘焦点和移动布局。
- 幻觉页额外核对收入/利润/利润率的证据关系：缺少字段时显示“资料不足”，补入利润后 `48 ÷ 120 = 40%`，移除字段会回到停机状态。

## 验证

- `npm run typecheck`：通过。
- `npm run build`：通过，生成 1071 个静态页面。
- `npm run audit:terms`：通过，329 条 experience，0 个重复场景、0 个相邻同类、0 个近重复对。
- 目标测试：temperature、context-window、tokenization、hallucination 测试通过；每条的新状态逻辑都有最小可运行检查。
- `git diff --check` 与三份词条 JSON 解析：通过。
- 本地真实浏览器逐条推进每个演示的中间帧、终态、重置/失败分支；幻觉页在 390×844 下 `scrollWidth = 390`，无横向溢出。

## Git 集成

- dev PR [#418](https://github.com/Gyschuaner/VibePolaris/pull/418) 已合入，提交 `7e16c3fa6ef1bfd535031f023819123e090a1779`。
- main PR [#419](https://github.com/Gyschuaner/VibePolaris/pull/419) 已合入，生产源提交 `4b7ca56b6689e002f0dbdef6eb15cebeb56ba323`。

## 生产发布

- 本机构建目标为 `linux/amd64`；镜像 `vibepolaris:4b7ca56b6689e002f0dbdef6eb15cebeb56ba323`，镜像清单 ID `sha256:fa2cb16a5b6251089d8c82f9444329a15a8bdc781366afa0bdd1ac4b69796348`。
- 传输包 `/tmp/vibepolaris-4b7ca56b.tar.gz`，本地与服务器 SHA-256 均为 `61f9c1e7e9ffe4c0ccb1d8612477979a30ea4f60ad6e453a1918cc3a84257934`。
- 生产 release：`/opt/vibepolaris/releases/20261007T024603Z-4b7ca56b`；`/opt/vibepolaris/current` 已原子切换到该目录。
- 切换前备份：`/opt/vibepolaris/backups/20261007T024603Z-from-8381386f`，包含旧 compose、旧容器/镜像检查信息和 SQLite 在线备份 `xiaobei.sqlite`（561152 bytes）；数据卷未删除或替换。
- 生产容器 `vibepolaris-web-1` 使用新镜像，状态 `running/healthy`；最近日志只有正常启动信息，healthcheck `FailingStreak=0`。
- 服务器内 HTTPS 冒烟：`/`、`/news`、`/about`、`/sitemap.xml`、十条新词条路由均返回 200；`/api/xiaobei/session` 返回 `200 {"active":false}`，符合未激活状态。

回滚时恢复备份中的 compose 与旧镜像 `vibepolaris:8381386f9849b4dff64cfa72d7d9e358aa087b77`，重新启动同名 web 服务，再把 `/opt/vibepolaris/current` 指回旧 release `/opt/vibepolaris/releases/20261007T003614Z-8381386f`；保留上线后新产生的数据，不覆盖 Xiaobei 数据卷。

## DP 与记录限制

本批尝试用 `dp --project 8c243d4c-cf5e-4eca-a682-0a12cc0660b0 deployment record` 记录 `deploy-vbp097-ai-stack-concepts-prod-20261007`，但 Developer Platform CLI 仍返回 `SSL: UNEXPECTED_EOF_WHILE_READING`。本记录只写入已实际发生的 Git、服务器和冒烟证据，没有伪造 DP deployment、需求状态或测试状态；网络恢复后应使用完整提交、环境、URL 和备份路径补录并重新查询确认。`D:/Obsidian/gysnote` 在当前 macOS 环境不存在，本批未写入 Obsidian。
