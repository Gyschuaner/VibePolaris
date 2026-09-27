# VBP-046 · 技能（Agent Skill）

第 030 批为单页新增词条。站点此前只在 Harness 页用 InlineTerm 顺带提过 Skill，本页按词条 Skill 流程完整建立：先研究、再成文、演示机制独立选择。

| 词条 | 读者需要辨认的机制 | 演示的对象与结果 | 边界 |
| --- | --- | --- | --- |
| 技能 | 说明与资源如何分三层按需进入上下文，命中靠任务与描述匹配 | 上下文预算面板：渐进加载与全部塞进提示词对照；启动→命中→读正文→运行脚本；周报任务展示无匹配分支 | 数字为教学样例；技能依赖宿主的文件读取与代码执行能力；只应安装可信来源 |

## 演示机制选择

站内已有的相邻页面首图分别是两侧携带（会话）、三段条带（JWT）、四方角色（OAuth）。本页改用“窄到宽的三层阶梯”表达渐进披露：越往下材料越多，但默认不加载。主体演示不用传输动画，而是让读者直接看见 token 账目：谁在什么时候进入右侧上下文列，容量条何时越过 6,000 的教学预算。eager 模式在启动一步就超支（7,400 > 6,000），渐进模式走完完整任务仍留有一半余量（3,555 / 6,000）；无匹配分支中预算纹丝不动，证明触发基于描述匹配而非安装数量。

## 已读资料与正文对应

下列资料均已打开正文，并按列出的锚点进入文章角标和书目。

| 资料 | 支持的正文 |
| --- | --- |
| Anthropic Engineering, [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | `skill-purpose`（目录与入职材料类比）、`skill-disclosure`（核心设计原则）、`skill-trigger`（元数据用于触发判断）、`skill-scripts`（脚本不进上下文，PDF 表单示例）、`skill-mcp`（与 MCP 互补）、`skill-security`（恶意技能警告） |
| Agent Skills, [Specification](https://agentskills.io/specification) | `skill-structure`（frontmatter 字段与目录约定、name ≤64 / description ≤1024）、`skill-disclosure`（三层与各层建议预算）、`skill-description`（good/poor 描述示例） |
| Anthropic Docs, [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | `skill-disclosure`（Level 1–3 与 token 量级）、`skill-trigger`（命中后读取正文）、`skill-scripts`（执行环境、代码不进上下文）、`skill-prompt-diff`（对话级提示词 vs 按需加载）、`skill-security`（仅用可信来源、外部依赖风险） |
| Anthropic, [Introducing Agent Skills](https://claude.com/blog/skills)（2025-10） | `skill-purpose`（定位、仅在相关时使用、开放格式可移植） |

## 本批 review

- 常驻正文不播放演示即可说明定义、三层加载过程、触发方式与安全边界；演示数字（800/285/2,400/45/6,000）与正文交代一致，且明确标注为教学样例。
- 演示的每个动作都改变上下文列与容量条：启动进元数据、命中读正文、脚本只进输出；切换装载方式即重置，不残留旧账目；无匹配与超预算分支不显示成功。
- 词条元数据把“不增加模型能力、不提供新执行接口”写入 boundary；relatedSlugs 取 prompt、context、tools、mcp、memory，均有正文依据。
- `npm run build` 通过，生成 105 个词条页。Chrome 本地预览逐分支核对：渐进链 800→1,085→1,110→3,510→3,555，eager 启动 7,400 超出 1,400 并标记，周报分支不读取正文；书目三角展开显示正确摘录；390px 下无横向溢出。验收中发现非脚本技能卡误显“脚本输出 45”标签，已修正并复查。
- 代码经 [PR #93](https://github.com/Gyschuaner/VibePolaris/pull/93) 合入 dev，合并提交为 `89fababdfe745815403fb96bdd86ccc6bae95f2f`；合并后的 Git 树与本地验收的功能提交一致，本地 dev 预览已打开词条页。尚无远端 dev 部署记录，生产未发布。
