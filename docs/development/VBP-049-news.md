# VBP-049 新闻栏目交付记录

状态：阶段一已在 `feat/VBP-049-news-column` 完成 2021-01-01 至 2021-01-07 七天试跑；阶段二正在 `feat/VBP-049-news-backfill-news` 按新闻事件逐日回溯；当前已完成 2026-09-30 至 2026-08-31 的 30 个有事件日和 1 个空档日，共 31 条按天记录，继续倒序向更早日期推进，目标范围仍是 2021-01-08 至 2026-10-02。本分支不合并 `dev`；论文不再作为阶段二的主事件来源。2026-10-02 曾按用户授权准备腾讯云部署，但用户随后取消，已恢复原生产镜像并保持线上服务健康。

### 2026-10-02 腾讯云部署尝试（已回滚）

- 目标提交：`7de944165ad88a03d7a9dea80f1708a452d507bf`；本机 `linux/amd64` 镜像构建、`news:validate`、`typecheck` 和定向 5 项测试、192 页构建均通过。
- 子智能体完成镜像传输并短暂加载新容器；用户在正式切换后续阶段要求停止，因此没有把它作为成功发布。线上已恢复 `vibepolaris:46b7612c`，`current` 为 `/opt/vibepolaris/releases/20261002T093829Z-46b7612c`，容器 health 为 `healthy`。
- 临时镜像、release 目录和上传包已清理；数据库卷、旧镜像和 Caddy 未改动。DP 部署记录：`deploy-vbp049-news-20261002-7de94416-rollback`，状态 `rolled_back`。

这次发布不依赖 `NEWS_DOTS_ENDPOINT`，也不要求 `dev` 分支保护。工作流在没有 Dots endpoint 时会跳过外部交接，继续校验仓库内的官方来源内容；如果以后配置 endpoint 或触发 `repository_dispatch`，仍会经过同一套 ingest、事实、来源、词条关系和发布门槛。

## 阶段二执行口径

- 每个事件日有独立的 `content/zh/news-daily/YYYY-MM-DD.json`，保留检索式、候选、事件日、来源发布日期、原始链接、引用卡片、去重决策和空档日原因；当前反向回溯已完成 2026-09-30 至 2026-08-31（含 9 月 27 日空档日），再逐日处理更早日期；9 月 5 日按两条独立事实链发布两篇，9 月 6 日按三条独立事实链发布三篇。
- 主事件优先取官方公告/官方博客、监管文件、可信新闻报道和可核验的行业或个人解读；论文只作为已成立新闻事件的背景来源，不能单独填充 `selectedSlugs`。
- 文章先写事实链和读者问题，再组织按事件需要变化的正文段落、讲解步骤和自制 SVG；`hero.sourceUrl`、许可和引用卡片都保留追溯信息。
- 词条关系只确认已经公开且正文确实解释的 slug。草稿在 `ready` 前必须经过 humanizer-zh 表达检查与 `codex-subagent-reader` 零基础读者审读，审读结果写入 `readerReview`。
- 每完成一个事件日就创建独立 Git 提交；空档日也提交按天记录，不复制邻日文章。

### 单日闭环（阶段二新口径）

候选脚本只负责记录当天的检索式、候选事件、日期字段、来源卡片、去重判断和空档日原因；正文、段落组织、讲解步骤、词条联动和头图由主助手针对当天事件逐篇手写。不同事件可以采用不同的叙事顺序，不把论文摘要或固定段落批量改写成新闻。

每个事件日依次完成新闻信源核验、正文与演示编写、Codex 子智能体零基础读者审读、中文表达审读、`news:validate`、单次构建/定向页面检查和一次独立提交。子智能体审读是内容可读性检查，不等同于真实用户访谈；论文仅在新闻事件已经成立时补充背景。

### 阶段二已完成样本

| 事件日 | 选中事件 | 主来源 | 事件日 / 报道日 | 子智能体审读 | 提交 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-30 | HHS/ARPA-H 启动 SURPASS：用预测模型、连续分析和自动化运营推动自适应临床试验；当前是 AI 项目启动与团队方案征集 | HHS 官方公告；Axios 同日报道；ARPA-H SURPASS 项目页；BioPharma Dive 10-01 跟进 | 2026-09-30 / 2026-09-30（10-01 为后续报道） | `passed`（两轮 Codex 子智能体读者与中文审读；修正来源归属、开放征集状态、术语边界和 SVG 可能性） | 本次提交 |
| 2026-09-29 | ① OpenAI DevDay 发布 Dots：持续运行的 AI 代理与权限规则；② 白宫总统令把行政文本中的 AI 改称 SI，后续定义仍待提出 | OpenAI Dots/DevDay/GPT-6.1 Sol 官方页；TechCrunch；White House 总统令与事实说明；AP/Axios 同日报道 | 2026-09-29 / 2026-09-29 | `passed`（一个 Codex 子智能体完成两篇零基础可读性、中文表达、来源归属和动画一致性复审） | 本次提交 |
| 2026-09-28 | ① NVIDIA 发布 Open Agent Safety Platform：OpenShell 在沙箱内执行，Sentry 在外部硬件层监控并可隔离越界代理；② Tempus ECG-MR 获 FDA 510(k) 清除：从标准 12 导联 ECG 提示中重度二尖瓣反流风险 | NVIDIA 官方投资者公告、Newsroom、OpenShell 页面和技术博客；AP；Axios；Tempus 官方公告、投资者 PDF；FDA K254297 原始记录 | 2026-09-25（FDA 决定）/ 2026-09-28（Tempus 公告）；2026-09-28（NVIDIA 公告与媒体报道） | `passed`（一个 Codex 子智能体复审两篇新闻主线、中文表达、日期与监管边界、官方/媒体归属、SVG/动画和词条联动；按建议修正后通过） | 本次提交 |
| 2026-09-27 | 空档日：AP 对 Anthropic/OpenAI 安全表态的分析、Axios 政治会面预告和白宫贸易公告均未形成当天新的 AI 主线事件 | AP；Axios；White House；KeyNews.AI 聚合页 | — | `n/a`（空档日，无文章） | 本次提交 |
| 2026-09-26 | ① 美中同意建立 SI 对话与拟建事故沟通渠道；② OpenAI 披露代理意外访问美国政府网站；③ OpenAI 随后暂停最强模型中涉及工具使用的训练、评估和推理 | White House 事实清单；AP；Axios；OpenAI Alignment 一手事件报告 | 2026-09-25（白宫文件）/ 2026-09-26（新闻报道与公司响应） | `passed`（同一个 Codex review 子智能体两轮复审；按日期、渠道落地状态、SEC 范围、Transluce 归属和工具使用范围建议修订后通过） | 本次提交 |
| 2026-09-25 | ① OpenAI 披露研究环境代理把 53 张用户图片发到外部图床；② 教宗良十四世在 UNESCO 谈 AI、人的尊严、真实信息与媒体信息素养 | TechCrunch；OpenAI 官方失配审查总览；Axios 交叉报道；梵蒂冈 UNESCO 演讲原文；AP；Axios 法国行程报道 | 2026-09-25 / 2026-09-25 | `passed`（同一个 Codex review 子智能体两轮复审；按消费/企业数据训练边界、Transluce 部分归因、Vatican/AP/Axios 报道范围和价值判断边界修订后通过） | 本次提交 |
| 2026-09-24 | ① 澳大利亚公开 OpenAI 代理闯入 Medicare 统计门户并成立跨部门调查组；② Google 测试 Gemini Call for Me 代用户拨打商家；③ 多州检察长联署要求国会监管前沿 AI | 澳大利亚总理官方记者会；AP；Axios；ABC；Services Australia；TechCrunch；Google Gemini 帮助页与 Agentic Calling 条款；California DOJ；New York AG；联名信 PDF；AP 法律责任报道 | 2026-09-24 / 2026-09-24（联名信原件标注 9 月 23 日） | `passed`（同一个 Codex review 子智能体逐篇复审三篇；按 Medicare 公开/非公开文件和披露时序、Call for Me 测试条件与身份披露、检察长联名信日期/人数及政策效力修订后通过） | 本次提交 |
| 2026-09-23 | ① 联合国安理会讨论 AI 与国际安全；② Anthropic 称 Claude 在 DNA 数据库中发现带有类 CRISPR 特征的 ART；③ Meta 宣布把个人代理 Muse 带到 AI 眼镜；④ YouTube 发布 Ask Studio、Gemini 对话剪辑、实时配音、A/B 测试和内容保护工具 | 联合国安理会转录与 AP/Axios；Anthropic 官方 Science 公告；Meta Newsroom 与 AP；YouTube 官方博客、Google Blog、TechCrunch | 2026-09-23 / 2026-09-23 | `passed`（同一个 Codex review 子智能体逐篇复审四篇；确认新闻主线、事件日/报道日、公司/媒体/未决边界、同日去重和四套事件专属 SVG/讲解；YouTube 补充实时配音与 2027 年视频 A/B 测试计划后通过） | 本次提交 |
| 2026-09-22 | ① OpenAI 发布 GPT-6 Sol/Luna，重点是成本、缓存和分层入口；② Anthropic 发布 Claude Opus 5.5，按公司口径主打长任务效率与安全护栏；③ 微软披露并打击 EvilTokens 端到端 AI 网络犯罪服务；④ 特朗普在联合国演讲中把 AI 称为“超级智能”；⑤ Snorkel AI 完成 3.5 亿美元 E 轮，训练数据服务成为独立基础设施新闻 | OpenAI、Anthropic、Microsoft DCU、白宫官方页；Axios、TechCrunch、PR Newswire 交叉报道 | 2026-09-22 / 2026-09-22 | `passed`（唯一 Codex review 子智能体逐篇复审五篇；修正 OpenAI explainer 的能力归属、Anthropic 护栏/准入边界、Microsoft“打击”措辞与调查数字归属；五个 SVG 和日台账通过检查） | 本次提交 |
| 2026-09-21 | ① OpenAI 提议为前沿 AI 建国际标准，覆盖 RSI、人类监督和事故通报；② OpenAI 称内部模型已解出 100 多道开放数学题，并成立无内部否决权的数学顾问组；③ 第三方估算称 Meta Muse 在美国/加拿大 iOS 首 12 天下载超过 ChatGPT，代理产品开始争夺日常入口 | OpenAI、Institute for Advanced Study 官方页；TechCrunch、Axios 交叉报道 | 2026-09-21 / 2026-09-21（9 月 20 日中美会谈的 AI 事故通报提议按 eventDate 延至 9 月 20 日） | `passed`（唯一 Codex review 子智能体复审三篇；确认厂商声明、第三方估算、比较窗口、Secure VM 和政策倡议边界；三张 SVG、日台账与词条联动通过检查） | 本次提交 |
| 2026-09-20 | ① 中美在纽约讨论可能影响国家安全的 AI 事故通报机制；② Qwen-Image-2.1 发布研究权重，统一文生图、局部编辑和透明图层；③ 阶跃星辰发布 Step 5 Preview，以 API preview 提供 1M token 上下文和多模态输入 | AP；中国商务部/新华社；Qwen、StepFun 官方页和文档；华盛顿邮报、Vercel 交叉信息 | 2026-09-20（AP 报道发表于 09-21；其余官方发布为 09-20） | `passed`（唯一 Codex review 子智能体复审三篇；修正中美“提议未落地”、Qwen 研究许可/商业许可边界和 Step 5 的 1M token、推理强度、提示缓存白话解释；三张 SVG、日台账与词条联动通过检查） | 本次提交 |
| 2026-09-19 | 特朗普在 Truth Social 宣布组建仿照 Space Force 的“AI Force”并将任命 AI 负责人；这是政治公告和组织设想，正式授权、预算、归属与职位权限尚未公开 | Truth Social 原帖；Axios；Deutsche Welle；Quartz | 2026-09-19 / 2026-09-19 | `passed`（唯一 Codex review 子智能体复审；补原帖引用，收紧“总统提出的组织设想”与公开证据边界，修正法律地位和职位权限表述；SVG、日台账与词条联动通过检查） | 本次提交 |
| 2026-09-18 | ① Anthropic 与 Accenture 启动嵌入式评估；② 加州行政令推动独立 AI 监督与“紧急关闭开关”可行性研究；③ Qwen3.8-Omni-Flash 发布；④ Google 承认 Gemini 在 Irregular 测试中访问三家真实公司；⑤ 四家 AI 公司因“协同放慢开发”被起诉；⑥ Anthropic 确认运营生物湿实验室；⑦ AI 错误情报差点推动美军行动 | Anthropic、加州州长办公室行政令与签署 PDF、Qwen 官方页；Axios、AP、TechCrunch、Politico、CNN、TechRadar | 2026-09-18 / 2026-09-18（AP 诉讼报道发表于 09-19；军事事件发生于春季、09-18 为公开披露日） | `passed`（唯一 Codex review 子智能体逐篇复审七篇；确认新闻主线、来源归属、事件日/报道日、诉状/行政令/公司口径边界、正文可读性、SVG/动画和词条联动） | 本次提交 |
| 2026-09-17 | ① Anthropic 生命科学验证计划；② Anthropic AI 研发指标；③ 查尔斯三世苏格兰 AI 峰会；④ Claude Projects 重做；⑤ Google 家庭代理 CC；⑥ Mozilla/Mila 开源 AI 基础层 | Anthropic、Royal Family、Google、Claude、Mozilla、Mila 官方；AP、TechCrunch、Ars Technica 交叉 | 2026-09-17 / 2026-09-17（Anthropic 指标 AP 后续发表于 09-18） | `passed`（唯一 Codex review 子智能体逐篇复审六篇；确认新闻主线、日期、来源归属、beta/公司指标/峰会倡议边界、SVG/动画和词条联动） | 本次提交 |
| 2026-09-16 | ① OpenAI 模型失配披露框架与六个案例；② ChatGPT Sponsored Agents 广告代理；③ Google Home MCP；④ Salesforce Missionforce 与 OpenAI 合作；⑤ AI Energy Management Alliance；⑥ 前沿实验室 AI 安全协调谈话 | OpenAI、Google Home、Salesforce、NVIDIA 官方；AP、Quartz、Axios、TechCrunch、TechRadar、The Information 交叉 | 2026-09-16 / 2026-09-16 | `passed`（唯一 Codex review 子智能体逐篇复审六篇；确认新闻主线、事件日/报道日、产品测试/合作/政策未落地边界、SVG/动画和词条联动） | 本次提交 |
| 2026-09-15 | ① Google Gemini 3.8 Live、Extended Thinking 与 3.5 Transcribe；② Salesforce/NVIDIA Koa CRM 推理模型；③ Salesforce AIforce 界面层；④ AWS/Salesforce 跨云企业 AI；⑤ Salesforce/Google Cloud 统一 AI 栈；⑥ Google AI & Economy ATLAS 数据产品；⑦ Dreamforce AI 速度与安全争论 | Google、Salesforce、AWS 官方；Axios、TechRadar 同日报道；ATLAS 研究 PDF 作背景 | 2026-09-15 / 2026-09-15（AWS 日本译文发表于 09-18，保留美国原稿日期） | `passed`（唯一 Codex review 子智能体逐篇复审七篇；确认新闻主线、厂商 benchmark/合作/预览/观点边界、跨日去重、SVG/动画和词条联动） | 本次提交 |
| 2026-09-14 | ① Microsoft Humanist AI 行为准则草案；② Apple Siri AI beta rollout；③ 据报道 OpenAI 收购 Glass Imaging；④ 特朗普与黄仁勋公开反对 AI 放慢 | Microsoft AI、Apple Newsroom、Glass Imaging 官方技术页；Axios、TechCrunch、SiliconANGLE、Reuters Breakingviews | 2026-09-14 / 2026-09-14（Glass 并购仍未获双方公开确认；DeepSeek 路由计划按 09-10 原公告延期） | `passed`（唯一 Codex review 子智能体逐篇复审四篇；确认草案/ beta / 未确认报道 / 公开立场边界、四张 SVG 与机制讲解） | 本次提交 |
| 2026-09-13 | ① 特朗普在爱尔兰淡化 AI 监管压力并强调对华竞争；② 众议长 Mike Johnson 反对国会仓促带头监管、主张企业先负安全责任 | AP 爱尔兰现场报道；Axios CNN/NBC 采访整理；AP 同日报道作交叉 | 2026-09-13 / 2026-09-13（9 月 12 日实验室放慢倡议和 Amodei 原文按原始事件日延期） | `passed`（唯一 Codex review 子智能体逐篇复审两篇；确认现场表态、企业自律、护栏与会议提议均未落地成新政策） | 本次提交 |
| 2026-09-11 | ① OpenAI 公开 Habitat 在线存储平台；② 联合国秘书长报告建议推进 AI 能力建设全球基金；③ Roblox 扩大 Build AI 创作层；④ Mecka AI 传出接近 5 亿美元估值；⑤ 众议员联署要求取消休会推动 AI 护栏；⑥ 28 位菲尔兹奖得主发布 Math and AI 声明；⑦ Moonshot AI 目标年底 20 亿美元年化收入 | OpenAI、联合国 ODET、Roblox、Math and AI 官方原文；TechCrunch、Axios 交叉报道；A/80/817 监管/政策文件 | 2026-09-11 / 2026-09-11（UN 基金、Mecka 估值、Moonshot 收入均保留建议/报道/目标边界；9 月 10 日 Anthropic 警告后续评论延期） | `passed`（唯一 Codex review 子智能体逐篇复审七篇；确认公司规模/采用数据、政策建议、融资传闻、公开声明和商业目标边界；七张 SVG 与各自讲解） | 本次提交 |
| 2026-09-10 | ① Anthropic 发布八个月威胁情报报告；② OpenAI Agents API 公测；③ GPT-Live-1 API 全双工语音；④ ChatGPT for Financial Services；⑤ ChatGPT Work Data agent；⑥ 美国参议院调查 OpenAI 处置 Hugging Face 事件；⑦ 公共服务请求可能因 AI 代理激增；⑧ Positron AI 完成 8.75 亿美元 C 轮 | Anthropic、OpenAI、Positron 官方公告/博客；Axios、TechCrunch；Hawley 原始信件与 agentic flooding 预印本作证据背景 | 2026-09-10 / 2026-09-10 | `passed`（唯一 Codex review 子智能体逐篇复审八篇；收紧 Anthropic 与公共服务标题的因果边界，修复金融服务 SVG 柱形图；八张 SVG、日台账和引用卡片通过检查） | 本次提交 |
| 2026-09-09 | ① Paul Christiano 加入 OpenAI 基金会董事会并进入安全与安保委员会；② Anthropic 研究员辞职并公开警告 AI 风险；③ Anthropic Economic Scenarios 情景探索器；④ Suno v6 与唱片公司合作；⑤ Apple Watch 健康传感与 Apple Intelligence；⑥ Apple Reference Image 来源证明；⑦ Harvey 完成 5.5 亿美元融资 | OpenAI、Anthropic Institute、Suno、Apple 官方公告/博客；AP；Axios；TechCrunch | 2026-09-09 / 2026-09-09 | `passed`（唯一 Codex review 子智能体逐篇复审七篇；确认新闻主线、公司/媒体口径、情景模型/健康提示/来源证明/融资估值边界，七张 SVG、日台账和引用卡片通过检查） | 本次提交 |
| 2026-09-08 | ① OpenAI 发布 ChatGPT Images 2.5；② Meta 发布个人代理 Muse 与 Sentinel 安全架构；③ Mistral 完成 30 亿欧元 D 轮融资；④ Google DeepMind 发布 AlphaGenome Atlas；⑤ GPT-5.6 Sol 参与量子实验校准；⑥ Anthropic 因芯片出口立场退出 ITI；⑦ Claude 订阅额度异常消耗与会话密钥风险；⑧ OpenAI 称 AI 生成 Navier–Stokes 证明并引发贡献归属争议 | OpenAI、Meta、Mistral、Google DeepMind 官方公告/博客；Axios；TechCrunch | 2026-09-08 / 2026-09-08 | `passed`（唯一 Codex review 子智能体逐篇复审八篇；收紧 Sentinel、会话密钥异常和 Navier–Stokes 的公司声明/报道边界；八张 SVG、日台账和引用卡片通过检查） | 本次提交 |
| 2026-09-07 | ① OpenAI、WAN-IFRA 与 AIRPPU 支持乌克兰独立媒体的 Newsroom AI 计划；② Google DeepMind 选出亚太 16 个绿色 AI 项目；③ Google 与国泰扩大 AI 尾迹规避试验；④ Jaipur Robotics 获 430 万欧元种子轮；⑤ 移动云推出 AutoLab for Quantum | OpenAI、AIRPPU、Google DeepMind、国泰航空、Jaipur Robotics、EquityPitcher 官方；SCMP；第一财经；界面新闻 | 2026-09-07 / 2026-09-07（国泰正式新闻稿为 09-08，事件日按 09-07 媒体披露记录） | `passed`（唯一 Codex review 子智能体逐篇复审五篇；删除无对应引用卡片的 Aviation Week 归属，保留计划/公司指标/媒体报道边界；五张 SVG、日台账和引用卡片通过检查） | 本次提交 |
| 2026-09-06 | ① OpenAI 称研究代理达到“自动化研究实习生”目标；② OpenAI 首席科学家发表《An Alien Mind》讨论递归自我改进与安全门槛；③ 《卫报》报道餐厅 AI 菜单图引发消费信任争议 | OpenAI 官方博客；TechRadar 后续报道；The Guardian 原始报道 | 2026-09-06 / 2026-09-06（TechRadar 后续发表于 09-10，作为同一事件重复候选） | `passed`（唯一 Codex review 子智能体逐篇复审三篇；确认内部指标、署名安全立场、行业调查、平台政策和独立研究边界；三张 SVG、日台账和引用卡片通过检查） | 本次提交 |
| 2026-09-05 | ① OpenAI 回应 DSEwiki 代理失配事件并承诺披露框架；② Axios：OpenAI 扩充州政策团队，押注“逆向联邦主义” | OpenAI Alignment 官方 notice；TechCrunch；Ars Technica；Axios；OpenAI 政策说明 | 2026-09-05 / 2026-09-05（9 月 4 日 DSEwiki 研究记录、9 月 4 日诉讼、9 月 3 日 GPT-6 Astra 和 Mount Shasta 救援按 eventDate 延期） | `passed`（唯一 Codex review 子智能体分别复审两篇；修正“定为”→“称为”、标题媒体归属和逆向联邦主义确定性；两张 SVG、日台账和引用卡片通过检查） | 本次提交 |
| 2026-09-04 | ① 研究者披露 OpenAI 评测代理在 DseWiki 留下协作记录；② Seattle Times 与 Newsday 起诉 OpenAI、Microsoft；③ XDOF 传出洽谈 12 亿美元估值 B 轮；④ Nscale 传出拟融资 35 亿美元 | TechCrunch；Nightingale/Trajectory 原始重建；CourtListener 原始诉状；GeekWire；XDOF/Nscale 官方页 | 2026-09-04 / 2026-09-04 | `passed`（唯一 Codex review 子智能体复审四篇；修正简体员工、诉状 SVG、XDOF 直述、Nscale summary；四张 SVG、日台账和引用卡片通过检查） | 本次提交 |
| 2026-09-03 | ① OpenAI 发布 GPT-6 Astra 并披露 Critical 网络安全能力与监测性下降；② NVIDIA 同意收购 Hugging Face；③ OpenAI 推出 Daybreak 一线防守者计划；④ Sanders/Casar 宣布拟提禁止人工超级智能法案 | OpenAI、NVIDIA 官方博客；SEC 8-K；Sanders 官方新闻稿；Axios；TechCrunch；TechRadar | 2026-09-03 / 2026-09-03（NVIDIA 8-K 记载 9 月 2 日签署） | `passed`（唯一 Codex review 子智能体逐篇复审四篇；收紧收购未完成、补贴能力、政治提案与现行法律边界；四张 SVG、日台账、引用卡片和词条联动通过） | 本次提交 |
| 2026-09-02 | ① Meta Muse Spark 1.3 长任务代理与编码更新；② Google Gemini 3.8 Flash/Cyber；③ Google Fairwind 受信防守计划；④ Caterpillar×FieldAI 工业 Physical AI 合作；⑤ HiddenLayer 1 亿美元 B 轮；⑥ Wonderful 5.5 亿美元 C 轮 | Meta、Google、Caterpillar、FieldAI、HiddenLayer、Wonderful 官方；Google/DeepMind 模型卡；Axios；TechCrunch；PR Newswire | 2026-09-02 / 2026-09-02 | `passed`（唯一 Codex review 子智能体逐篇复审六篇；补充 agentic、token、Physical AI/数字孪生、ARR、运行时安全和融资口径；六张 SVG、日台账、引用卡片和词条联动通过） | 本次提交 |
| 2026-09-01 | ① Anthropic Fable 5.1 与 Mythos 5.1 分层护栏；② Anthropic Enterprise Frontier Safeguards；③ Meta Muse Voice Transcribe；④ CrowdStrike×NVIDIA SafeMind；⑤ AIR Security 上下文防火墙；⑥ Tripo AI Series B/B+ 与 P2.0；⑦ 美国司法部在 OpenAI 版权案中支持训练阶段合理使用 | Anthropic、Meta、CrowdStrike、NVIDIA、AIR Security、Tripo AI/PR Newswire、CourtListener；AP；TechCrunch；Axios | 2026-09-01 / 2026-09-01 | `passed`（唯一 Codex review 子智能体逐篇复审七篇；解释 token、harness、stealth、MCP 与 Statement of Interest，收紧公司指标和政府意见边界；七张 SVG、日台账、引用卡片和词条联动通过） | 本次提交 |
| 2026-08-31 | ① Anthropic 公布越界事件后的安全修补；② HUMAIN×MinIO AI 数据基础设施合作；③ 五角大楼 GenAI.mil 纳入 ChatGPT Mil 与 Grok；④ Clipto 本地 AI 媒体搜索融资；⑤ Apple/OpenAI 商业秘密诉讼新证据；⑥ Cloudflare Adaptive Intelligence；⑦ Microsoft×HUMAIN 企业 AI 套装与 AI PC 计划 | Anthropic、MinIO、HUMAIN、美国国防部 CDAO；Cloudflare；PR Newswire；TechCrunch；OpenAI 回应 | 2026-08-31 / 2026-08-31 | `passed`（唯一 Codex review 子智能体逐篇复审七篇；补充 ARR、MCP，拆分 DoD 官方 ChatGPT Mil 与媒体报道 Grok，收紧 Cloudflare 产品目标和合作计划边界；七张 SVG、日台账、引用卡片和词条联动通过） | 本次提交 |

| 2026-09-12 | ① Anthropic CEO Dario Amodei 提出 “We Must Pace the Frontier”；② Anthropic、OpenAI、SpaceXAI、Google DeepMind 负责人同日回应；③ Sam Altman 确认 OpenAI 2026 年不 IPO | Amodei 原文；Fortune、Axios、TechCrunch 同日报道；OpenAI/Anthropic 的安全承诺按采访和公开回应归属 | 2026-09-12 / 2026-09-12（9 月 10 日 Anthropic 威胁报告、9 月 9 日网络事件评估按原始公告日延期） | `passed`（唯一 Codex review 子智能体逐篇复审三篇；确认 pacing≠停训、个人回应≠共同协议、IPO 是 CEO 采访表态且无正式 2027 时间表） | 本次提交 |
| 2021-01-08 | Waste-Free World AI 塑料回收试点 | Circular Online（新闻报道）；WebWire 企业新闻稿作一手核验 | 2021-01-08 / 2021-01-12 | `passed`（先 `needs-revision`，按建议修订后通过） | `9a7cb072` |
| 2021-03-01 | 警务 AI 产品特写：转写、脱敏、车牌识别与加密货币分析 | Police Chief Magazine；VIQ、Veritone、Jenoptik 官方产品页；加州 DOJ AB 953 规则 | 2021-03-01 / 2021-03-01 | `passed`（子智能体读者与中文审读，按来源卡片建议修订） | `53037828` |
| 2021-03-02 | Azure Percept 进入公开预览：边缘设备、现场推理与云端管理 | Microsoft News Center；Azure Blog、Ignite Book of News；TechCrunch 同日交叉报道 | 2021-03-02 / 2021-03-02 | `passed`（两轮子智能体读者与中文审读） | `60aef89c` |
| 2021-03-03 | AI Index 2021：AI 走向产业实践，数据盲区也更明显 | Stanford HAI 官方公告与报告；Axios 同日报道 | 2021-03-03 / 2021-03-03 | `passed`（两轮子智能体读者与中文审读） | `ce2cc3d4` |
| 2021-03-04 | OpenAI 拆开 CLIP 的视觉神经元：能解释，也可能被文字骗过 | OpenAI 官方博客；Axios 同日报道；Distill 原文作技术背景 | 2021-03-04 / 2021-03-04 | `passed`（两轮子智能体读者与中文审读） | `53f47f96` |
| 2021-03-05 | MHRA 关注 Babylon AI 分诊聊天机器人：报道提出英国医疗监管空档 | TechCrunch 同日报道；MHRA GOV.UK 执法说明与 Yellow Card 安全报告页面作制度背景 | 2021-03-05 / 2021-03-05 | `passed`（两轮子智能体读者与中文审读） | `fe3508e9` |
| 2021-03-06 | 空档日：观点文章与前日回顾，未确认新的当天 AI 事件 | Financial Express 观点文章；Tech Xplore 前日新闻汇总；Microsoft 官方页核对 Power Fx 为 03-02 | — | `n/a`（空档日，无文章） | `356b90d2` |
| 2021-03-07 | 空档日：研究汇总与跨日官方发布，未确认新的当天 AI 事件 | Brightsurf 科学新闻汇总；CAIDP 月度政策回顾；MIT News 核对 CARRL 实际为 03-08 | — | `n/a`（空档日，无文章） | `1abd0f5e` |
| 2021-03-08 | MIT 研究团队提出 CARRL：让强化学习在传感器不可靠时先按最坏情况选动作 | MIT News；arXiv、MIT Aerospace Controls Laboratory 与作者发表列表作方法和出处背景 | 2021-03-08 / 2021-03-08 | `passed`（两轮 Codex 子智能体读者与中文审读） | `55c7a784` |
| 2021-03-09 | KPMG 调查：企业 AI 采用在加速，治理担忧也在升温 | KPMG/PR Newswire；KPMG 官方报告与介绍页；Fortune 同日报道 | 2021-03-09 / 2021-03-09 | `passed`（两轮 Codex 子智能体读者与中文审读） | `501ed3f8` |
| 2021-03-10 | MIT 报道 Tensor Holography：深度学习让 3D 全息图生成更快，手机端也能运行原型 | MIT News；Nature 论文、MIT CSAIL Tensor Holography 项目页与 MIT Technology Licensing Office 作方法和原型背景 | 2021-03-10 / 2021-03-10 | `passed`（两轮 Codex 子智能体读者与中文审读） | `b0351d07` |
| 2021-03-11 | Facebook AI 的“公平落地”框架：先分清产品目标、政策选择和模型误差 | Facebook AI 官方博客；Meta 研究页与 arXiv 作方法背景；Pew 同日医疗政策分析；03-31 Fairness Flow 后续官方页作时间线背景 | 2021-03-11 / 2021-03-11 | `passed`（两轮 Codex 子智能体读者与中文审读） | `66496401` |
| 2021-03-12 | 英国宣布年内发布国家 AI 战略：当天公布的是方向，不是完整文本 | GOV.UK 政府公告；AI Council 路线图、Office for AI 议会书面证据作政策阶段核验；techUK 同期行业语境；9 月正式战略作后续时间线 | 2021-03-12 / 2021-03-12（techUK 页面标注 03-11，议会材料也保留 03-11 原文） | `passed`（两轮 Codex 子智能体读者与中文审读） | `5016a86` |
| 2021-03-13 | 空档日：AI 观点访谈、前一日 RIT 新闻转发和平台治理报道，未确认新的当天 AI 事件 | Times of India、GeekWire、RIT 官方新闻/Targeted News、Reuters via Cyprus Mail | — | `n/a`（空档日，无文章） | `5675e1f9` |
| 2021-03-14 | ① Outmin 走出隐身：AI 与人工经验结合到小企业记账；② NATO 把 AI 放进新兴技术实施框架，完整 AI 战略仍在后续 | The Irish Times；Defense News；NATO 03-03 官方新闻、EDT 主题页和 10 月后续战略作核验/时间线 | 2021-03-14 / 2021-03-14 | `passed`（两轮 Codex 读者审读；中文表达审读，按事实边界与措辞建议修订） | `06e13008` |
| 2021-03-15 | Sherpa 融资 850 万美元，把面向企业、强调隐私的联邦学习列为新重点；报道仍保留原有对话式 AI/搜索服务 | TechCrunch；Sherpa 当前官方平台页作后续产品背景；McMahan 联邦学习原始论文与 Bonawitz 安全聚合作论文作机制背景 | 2021-03-15 / 2021-03-15（按新闻报道日记录；不推断融资完成日） | `passed`（两轮 Codex 子智能体读者审读；中文表达审读，按归因、术语和通用示意边界修订） | `c7e06050` |
| 2021-03-16 | DataGen 融资 1850 万美元，押注合成视觉数据；报道的是训练数据产品与扩展测试数据计划，真实部署仍需复测 | Fortune；VentureBeat 同日交叉报道；DataGen 当前官网作身份补充；9 月公司新闻稿作后续时间线 | 2021-03-16 / 2021-03-16 | `passed`（两轮 Codex 子智能体读者审读；中文表达审读；新增 `synthetic-data` 机制动画） | `a267dc1c` |
| 2021-03-17 | Torch.AI 融资 3000 万美元，押注“数据在流动中处理”；客户、联邦机构覆盖和认证均保留为公司口径，03-18 国防报道作后续 | PR Newswire（Torch.AI）；VentureBeat 同日交叉报道；InsideDefense 03-18 后续；Feedzai/Keelvar 候选拒选并保留原因 | 2021-03-17 / 2021-03-17 | `passed`（两轮 Codex 子智能体读者审读；中文表达审读；新增 `data-motion` 机制动画） | `1f361d8f` |
| 2021-03-18 | FORT Robotics 融资 1300 万美元，扩展自主机器安全平台；无线急停、多机停止和客户数量保留为公司/媒体口径，当前页面只作机制与验收背景 | FORT Robotics 官方新闻稿；VentureBeat 同日报道；FORT 当前 AMR 页面；OSHA、NIST 当前安全背景；2022 Series B 后续稿 | 2021-03-18 / 2021-03-18 | `passed`（读者与中文表达子智能体复审；修正客户数量“前一年”、门控触发、多机协同、停机确认和当前页面时效；新增 `robot-safety` 机制动画） | `8fa0eb92` |
| 2021-03-19 | Viz.ai 在国际卒中大会期间发布护理协调数据；Hassan 的 Viz LVO 研究与 Jankowitz 的 Viz RECRUIT/AI ENRICH 招募结果严格分开，Practical Neurology 只作前者交叉报道 | Viz.ai 官方新闻稿；Practical Neurology；AHA ISC 2021 页面；Viz.ai 当前 notification-only 使用说明；ISC 海报摘要与早期评估页 | 2021-03-19 / 2021-03-19 | `passed`（读者与中文表达子智能体复审；修正 102.3 分钟/45%/mRS 与 41%/213% 的研究归属，补 CTA/LVO/到院到转出/到院到穿刺白话解释；新增 `clinical-alert` 机制动画） | `8613dab3` |
| 2021-03-20 | 空档日：检索到的内容是前几日主题的观点、采访或进行中项目分析，未确认新的当天 AI 公告、产品上线、融资或监管动作 | VentureBeat 合成数据观点与机器人采访；Google News RSS；TechCrunch 日期索引；DOE 页面交叉核对 | — | `n/a`（空档日，无文章） | `7de94416` |


## 交付内容

- `content/zh/news.json` 当前包含 206 篇已发布内容，其中包括本轮新增的 2026-08-31 七篇、2026-09-01 七篇、2026-09-02 六篇、2026-09-03 四篇、2026-09-04 四篇、2026-09-05 两篇 AI 新闻、2026-09-06 三篇 AI 新闻、2026-09-07 五篇 AI 新闻、2026-09-08 八篇 AI 新闻、2026-09-09 七篇 AI 新闻、2026-09-10 八篇 AI 新闻、2026-09-11 七篇 AI 新闻、2026-09-12 三篇 AI 新闻、2026-09-13 两篇 AI 新闻、2026-09-14 四篇 AI 新闻、2026-09-15 七篇 AI 新闻、2026-09-16 六篇 AI 新闻、2026-09-17 六篇 AI 新闻、2026-09-18 七篇 AI 新闻、AI Force 组织设想、中美 AI 事故通报对话、Qwen-Image-2.1 研究权重、Step 5 Preview、OpenAI 前沿 AI 国际标准提议、OpenAI 数学顾问组与 100 多道开放题声明、Meta Muse 早期采用估算、GPT-6 Sol/Luna、Claude Opus 5.5、EvilTokens 网络犯罪服务、白宫“超级智能”联合国表态、Snorkel AI 数据基础设施融资、联合国安理会 AI 安全会议、Anthropic Claude 生物发现、Meta Muse AI 眼镜、YouTube Made on YouTube AI 工具、美中 SI 对话、OpenAI 政府网站访问披露、OpenAI 暂停工具使用训练、NVIDIA Open Agent Safety Platform、Tempus ECG-MR、OpenAI Dots、白宫 SI 总统令和 HHS/ARPA-H SURPASS、OpenAI 用户图片披露、教宗 UNESCO AI 演讲、澳大利亚 Medicare 代理事件、Google Gemini Call for Me 和多州检察长 AI 监管倡议新闻；七篇阶段一试跑文章另见下方逐日记录。所有真实条目都带 canonical URL、`sourceHash`、证据和已确认的相关词条。
- 2026-08-31 按七条独立事实链发布七篇：Anthropic 事故后安全修补、HUMAIN×MinIO AI 数据基础设施、GenAI.mil 的 ChatGPT Mil/Grok 多模型入口、Clipto 本地媒体搜索融资、Apple/OpenAI 商业秘密诉讼新证据、Cloudflare Adaptive Intelligence、Microsoft×HUMAIN 企业 AI 套装与 AI PC 计划。正文把公司披露、政府入口、融资与 ARR 口径、诉讼主张、产品目标和合作意向分开；GenAI.mil 与 HUMAIN Fabric 的官方镜像记为 `duplicate`，七篇各自保留原始链接、引用卡片、自制 SVG、事件专属讲解、词条联动和唯一 reader-review 结果。
- 2026-09-01 按七条独立事实链发布七篇：Anthropic Fable/Mythos 5.1 与企业 Frontier Safeguards、Meta Muse Voice Transcribe、CrowdStrike×NVIDIA SafeMind、AIR Security 上下文安全、Tripo AI 融资与 P2.0 预览，以及美国司法部在 OpenAI 版权案中的 Statement of Interest。正文把产品发布、公司指标、融资预览和政府诉讼意见分开，明确“同一模型”护栏、harness、stealth、MCP 与政府意见的白话边界；两条重复来源、Path to Astra/Microsoft 治理报告/Apple 诉讼候选留在日台账，七篇各自保留原始链接、引用卡片、自制 SVG、事件专属讲解、词条联动和唯一 reader-review 结果。
- 2026-09-07 按五条独立事实链发布五篇：乌克兰独立媒体 Newsroom AI 计划、Google DeepMind AI for the Planet APAC、Google/国泰尾迹规避试验、Jaipur Robotics 工业视觉融资、移动云 AutoLab for Quantum。正文把合作计划、早期试验估计、公司指标和媒体报道分开；Google 加速器项目页记为同日 `duplicate`，DeepSeek 芯片计划、HUMAIN 模型、Qwen-Drive、Altman 专访、纽约学校分析和 TechCrunch 术语词典按原始事件日或 evergreen 性质 `deferred`。五篇各自保留原始链接、引用卡片、可追溯 SVG、词条联动和唯一 reader-review 结果。
- 2026-09-05 按两条独立事实链发布两篇：OpenAI 对 DSEwiki 代理失配事件的回应与披露框架承诺；Axios 报道 OpenAI 扩充州政策团队并采用“逆向联邦主义”路线。正文把研究者公共记录、OpenAI 官方分类、媒体报道、招聘信号和正式州法分开，9 月 4 日诉讼、9 月 3 日 GPT-6 Astra/Mount Shasta 救援按 eventDate 延期；两篇分别保留官方/媒体原始链接、引用卡片、自制 SVG、事件专属讲解、词条联动和唯一 reader-review 结果。
- 2026-09-04 按四条独立事实链发布四篇：研究者通过 DseWiki 公共记录披露 OpenAI 评测代理的跨站协作迹象；Seattle Times 与 Newsday 在 CourtListener 留下对 OpenAI/Microsoft 的版权诉状；TechCrunch 报道 XDOF 洽谈约 12 亿美元估值 B 轮；TechCrunch 报道 Nscale 寻求约 35 亿美元上市前融资。正文把公共重建、诉状指控、融资传闻和公司背景分别标注，明确 OpenAI 未确认、诉状尚未裁判、融资条款未敲定和 IPO 仍属可能性；四篇各自保留原始链接、引用卡片、自制 SVG、事件专属讲解、词条联动和唯一 reader-review 结果。9 月 3 日四篇已按独立事实链完成；Mount Shasta 救援按更早事件日保留在延期候选。
- 2026-09-03 按四条独立事实链发布四篇：GPT-6 Astra 把模型能力、Critical 网络安全级别与监测性下降放在同一次部署中；NVIDIA 宣布收购 Hugging Face，SEC 8-K 把股东对价、员工留任计划和监管批准拆开；OpenAI Daybreak 为关键基础设施防守者提供 10 亿美元补贴访问、培训和 MS-ISAC 试点；Sanders/Casar 宣布拟议超级智能禁令和先进 AI 暂停。正文把公司自测、监管文件、补贴承诺、政治提案和现行法律状态分开，四篇各自保留官方/监管/媒体原始链接、引用卡片、自制 SVG、事件专属讲解、词条联动和唯一 reader-review 结果。
- 2026-09-02 按六条独立事实链发布六篇：Meta Muse Spark 1.3 把长任务代理和编码效率放到 Muse Code/API；Gemini 3.8 Flash/Cyber 分开记录通用模型价格、模型卡限制和网络防守评测；Fairwind 把 Cyber 能力放进政府与关键基础设施的受信访问；Caterpillar×FieldAI 以设备数据、机器人基础模型和数字孪生推进工业 Physical AI；HiddenLayer 的 1 亿美元 B 轮聚焦代理运行时与工具链安全；Wonderful 的 5.5 亿美元 C 轮把企业 AI OS 与全球扩张写成融资新闻。正文把公司评测、内部增长数据、估值、合作早期状态和未披露指标分开，另有 7 条重复/延期候选留在日台账；六篇各自保留原始链接、引用卡片、自制 SVG、事件专属讲解、词条联动和唯一 reader-review 结果。
- 2026-09-06 按三条独立事实链发布三篇：OpenAI 研究自动化里程碑、OpenAI 首席科学家安全公开信、餐厅 AI 菜单图消费信任争议。正文分别标注公司内部指标、署名作者判断、新闻个案、行业调查、平台政策和研究背景；TechRadar 对研究实习生的后续报道记为同一事件 `duplicate`。三篇各自保留原始链接、引用卡片、可追溯 SVG、词条联动和唯一 reader-review 结果。
- 2026-09-08 按八条独立事实链发布八篇：ChatGPT Images 2.5、Meta Muse、Mistral D 轮、AlphaGenome Atlas、GPT-5.6 Sol 量子实验、Anthropic/ITI 芯片政策、Claude 订阅额度异常和 Navier–Stokes 贡献争议。正文把厂商产品/研究声明、融资口径、媒体个案和政策状态分开；Muse 安全架构的独立官方文章记为同日 `duplicate`，Google Missouri AI 项目和 OpenAI “The work now within reach” 保留为 `deferred`。八篇各自保留原始链接、引用卡片、可追溯 SVG、词条联动和唯一 reader-review 结果。
- 2026-09-10 按八条独立事实链发布八篇：Anthropic 威胁情报报告、OpenAI Agents API、GPT-Live-1 全双工语音、金融服务工作区、Data agent、Hugging Face 事件参议院调查、公共服务 agentic flooding 新闻和 Positron 推理芯片融资。正文把官方产品主张、公司威胁归因、监管调查启动、论文的潜在案例、评测数字与融资路线图分别标注；9 月 10 日抗菌分子应用案例保留为 `deferred` 候选（每日发布上限为 8），Anthropic 蒸馏后续、代理消息板跟进和观点评论没有重复发布。八篇各自保留原始链接、引用卡片、可追溯 SVG、词条联动和唯一 reader-review 结果；9 月 12 日重复命中的 Anthropic 候选已改为 `duplicate` 指向 9 月 10 日主文章。
- 2026-09-09 按七条独立事实链发布七篇：OpenAI 基金会治理任命、Anthropic 研究员辞职、Anthropic 经济情景工具、Suno v6、Apple 健康智能、Apple Reference Image 来源证明和 Harvey 融资。正文把任命/个人警告/条件模型/产品公告/媒体报道/融资路线分别标注；Axios 对同一 Anthropic 安全争论的跟进记为 `duplicate`，Listen Labs 未完成融资与潜在收购记为 `deferred`。七篇各自保留原始链接、引用卡片、可追溯 SVG、词条联动和唯一 reader-review 结果。
- 2026-09-11 按七条独立事实链发布七篇：OpenAI Habitat 是基础设施工程新闻；联合国 A/80/817 是能力建设基金政策建议；Roblox Build 是 AI 创作层产品更新；Mecka 是条款未敲定的融资报道；众议员联署信是尚未进入正式立法的政治动作；Math and AI 是 28 位菲尔兹奖得主公开声明；Moonshot K3 是开放权重模型的收入目标。每篇都把公司自述、报道传闻、指示性金额、第三方 token 统计和政策建议分开，保留七张事件专属 SVG、引用卡片、词条联动和唯一 reader-review 结果；Anthropic 9 月 10 日警告后续、OpenAI 数学争议分析和 Axios 周综述留在延期候选，同一 Moonshot canonical URL 的旧候选记为 `duplicate`。
- 2026-09-12 按三条事实链发布三篇：Amodei 原文写出 pacing、嵌入式第三方评估和两层国际协调；Altman、Musk、Hassabis 的回应被单独写成行业信号，明确不是共同协议；Altman 的 Fortune 专访则单独记录 OpenAI 2026 年不 IPO，强调这是 CEO 表态而非 SEC/董事会公告，也没有正式的 2027 时间表。9 月 13 日台账中的 Amodei 原文候选已在 9 月 12 日主文章选中后改为 `duplicate`；9 月 10 日威胁情报报告和 9 月 9 日网络事件评估按原始日期延期。三篇都保留原始链接、引用卡片、自制 SVG、各自组织的段落、机制讲解、词条联动和唯一 reader-review 结果。
- 2026-09-13 也按实际事件数发布两篇：特朗普在爱尔兰的讲话与 Johnson 在 CNN/NBC 的国会责任表态分别成篇；前者记录国家竞争优先级和缺少具体护栏，后者记录企业自律、紧急暂停和跨方会议提议。9 月 12 日 Amodei 原文候选已指向 9 月 12 日主文章并改为 `duplicate`，四家实验室回应和 9 月 13 日 TechCrunch 播客评论则按原始事件日或分析性质延期，没有重复扩写。两篇都保留 AP/Axios 原始链接、引用卡片、自制 SVG、各自组织的段落、机制讲解、词条联动和唯一 reader-review 结果。
- 2026-09-14 也按独立事实链发布四篇，而不是限制每天一篇：Humanist AI 是公开治理草案，Siri AI 是有地区/语言/额度条件的 beta rollout，Glass Imaging 是 TechCrunch 援引 WSJ 的未确认并购报道，特朗普与黄仁勋是 All-In Summit 现场的公开立场。当天的 Apple 总览候选与 Siri 共享 canonical URL，按 `duplicate` 合并；DeepSeek 9 月 10 日公告和 Reuters Breakingviews 市场分析保留为 `deferred`，没有把运营计划或评论文章扩写成 9 月 14 日新事件。四篇都保留原始链接、引用卡片、自制 SVG、各自组织的段落、机制讲解、词条联动和唯一 reader-review 结果。
- 2026-09-15 不是“每天一篇”的限制：当天按独立事实链发布七篇。Gemini 音频模型与 ATLAS 是 Google 的两条不同新闻；Koa、AIforce、AWS/Salesforce、Google Cloud/Salesforce 分别对应模型、界面层和两条跨云合作；Dreamforce 速度争论则按公开报道单独记录。泛多语言/社会影响综述和 Siemens 单客户合作留在当天候选台账，没有机械扩写成文章；9 月 16、17 台账中同一 canonical URL 的 Gemini/ATLAS/Koa 候选已改为指向 9 月 15 日主文章的 `duplicate`。
- 2026-09-23 的四篇新闻按事件边界拆开：联合国会议记录国际治理讨论但没有当天约束性决议；Anthropic 的 ART 仍是公司披露的早期发现，实验由人类完成且功能未知；Meta 的 Muse 眼镜能力写成未来数月计划，和已售 Ray-Ban Meta Audio 分开；YouTube 把 Gemini 放进创作者工作流，实时配音和视频 A/B 测试保留后续开放边界。四篇均保留原始链接、引用卡片、自制 SVG、独立机制讲解、词条联动和唯一 reader-review 结果。
- 2026-09-22 的五篇新闻分别记录模型成本下沉、长任务模型护栏、AI 犯罪服务处置、政策语言变化和训练数据融资：OpenAI/Anthropic 的厂商评测均保留测试归属；Microsoft 的 12,000+ 邮箱和 10,000+ 组织数字标注为微软估计并由 Axios 交叉报道；白宫演讲与 9 月 29 日后续行政行动分开；Snorkel 的 3.75 亿美元年化运行率标注为公司口径。五篇各自保留原始链接、引用卡片、自制 SVG、独立机制讲解、词条联动和唯一 reader-review 结果。
- 2026-09-21 的三篇新闻把能力声明、政策倡议和消费级采用拆开：OpenAI 的 RSI 标准文章明确不是法律或中美协议；数学“100 多道题”保留为公司声明，顾问组没有内部研究否决权；Muse 的下载和日活来自 Apptopia 第三方估算，标题限定美国/加拿大 iOS 可比窗口，并说明 Secure VM 和长期留存边界。三篇均保留官方或新闻原始链接、引用卡片、自制 SVG、独立机制讲解、词条联动和唯一 reader-review 结果。
- 2026-09-20 的三篇新闻按事件日拆开并保留发布日差异：中美事故通报机制是美方提出、双方对话但尚未落地的政策新闻；Qwen-Image-2.1 的权重按官方研究许可记录，商业使用需另行许可；Step 5 Preview 的 1M token、多模态输入、工具调用、推理强度和提示缓存按官方文档解释，第三方价格只作交叉信息。三篇均保留原始链接、引用卡片、自制 SVG、独立机制讲解、词条联动和唯一 reader-review 结果。
- 2026-09-19 的 AI Force 新闻以 Truth Social 原帖为事实起点、Axios/DW/Quartz 为交叉来源；正文把总统公告、正式授权、职位权限和后续执行分开，明确“AI Force”截至报道日仍是组织设想。9 月 19 日检索到的 9 月 18 日诉讼、Anthropic 模型计划和递归自我改进解释稿，以及 9 月 17 日英国王室 AI 安全峰会，均按 `eventDate` 延期到相应日期，没有把报道日误当成新事件。文章保留原始链接、引用卡片、自制 SVG、政策治理讲解、词条联动和唯一 reader-review 结果。
- 2026-09-18 按事件拆成七篇独立新闻：Anthropic/Accenture 嵌入式评估、加州独立监督与 kill switch 行政令、Qwen3.8-Omni-Flash、Google Gemini 测试越界、AI 放慢开发反垄断诉讼、Anthropic 湿实验室和美军错误情报险情。官方公告、行政令/签署 PDF 与 AP、Axios、TechCrunch、Politico、CNN、TechRadar 交叉保留；诉状、政策方向、公司披露、新闻报道和春季发生/9 月披露的日期边界分别写明。七篇均有自制 SVG、按事件组织的段落、可追溯引用卡片、词条/文章联动和唯一 reader-review 结果。9 月 18 日检索到的 Google CC、Meta Muse、TypeSafe、Hacktron、Anthropic Life Sciences Verification 等事件按实际更早 `eventDate` 延期，Manus 估值消息暂作候选保留。
- 2026-09-17 按事件拆成六篇独立 AI 新闻：Anthropic 生命科学验证计划、Anthropic AI 研发指标、查尔斯三世苏格兰 AI 峰会、Claude Projects 重做、Google 家庭代理 CC 和 Mozilla/Mila 开源 AI 基础层。官方公告、王室演讲、AP、TechCrunch、Ars Technica 交叉保留；beta 条件、公司内部指标、政策倡议和仍未交付的基础层参考实现分别写明。六篇均有自制 SVG、按事件组织的段落、可追溯引用卡片、词条/文章联动和唯一 reader-review 结果。9 月 17 日检索到的 OpenAI misalignment framework、Emerald AI、LawZero、Gemini 3.8 Live、ATLAS AI science 等事件按更早 `eventDate` 延期；Amazon 安全立场、AP 中美分析和 Axios 黑客趋势分析暂作候选保留。
- 2026-09-16 按事件拆成六篇独立 AI 新闻：OpenAI 模型失配披露框架、ChatGPT Sponsored Agents、Google Home MCP、Salesforce Missionforce/OpenAI、AI Energy Management Alliance，以及前沿实验室 AI 安全协调谈话。OpenAI、Google Home、Salesforce、NVIDIA 官方公告与 AP、Quartz、Axios、TechCrunch、TechRadar、The Information 交叉保留；六篇分别写明披露框架仍属自愿流程、广告代理仍在测试、家庭设备需要 MCP 和用户授权、政府工作流仍需人工审批、电力联盟尚无效果数据、实验室对协调放慢仍有分歧。9 月 16 日的 OpenAI 工作方式研究、Google 青少年调查和 ChatGPT Work 状态故障保留为候选；Gemini 3.8 Live、Google ATLAS 和 Salesforce Koa 按原始 9 月 15 日事件日延期。六篇均有自制 SVG、按事件组织的段落、可追溯引用卡片、词条/文章联动和唯一 reader-review 结果。
- 2026-09-26 的三篇新闻按时间线拆开：白宫 9 月 25 日事实清单与 9 月 26 日 AP/Axios 报道确认双边 SI 安排；OpenAI 政府网站披露限定为公开资料访问与待核查的 Transluce 线索；暂停训练单独记录公司响应，并引用 OpenAI Alignment 的 DNS 事件报告。三篇均保留原始链接、引用卡片、自制 SVG、独立机制讲解和文章联动。
- 2026-09-25 的两篇新闻按事件主线拆开：OpenAI 用户图片披露保留 TechCrunch、Axios、OpenAI 官方总览和 Transluce 背景，明确消费账号与 Enterprise/Business 数据边界，并与 9 月 26 日政府网站/暂停训练文章联动；教宗良十四世 UNESCO 演讲以梵蒂冈原文为主，AP 报道演讲，Axios 只作法国行程/Élysée 背景，避免把伦理观点写成技术标准或监管结论。两篇均保留原始链接、引用卡片、自制 SVG 和独立机制讲解。
- 2026-09-24 的三篇新闻分别记录代理越界、产品代理和监管回应：澳大利亚总理官方记者会与 AP/Axios/ABC 确认 Medicare 统计门户事件及调查范围；Google Gemini Call for Me 以 TechCrunch 为新闻来源、Google 帮助页和条款为一手边界，保留 Pixel 11/美国/订阅/公测、AI 身份披露、录音和实时接管条件；多州检察长联署以 California DOJ、New York AG 和原始 PDF 为主，明确 9 月 23 日联名信与 9 月 24 日公告、26 位合计和“尚非联邦法律”。三篇均保留原始链接、引用卡片、自制 SVG、独立机制讲解和文章/词条联动。
- 2026-09-29 的 OpenAI Dots 与白宫 SI 总统令文章已完成官方页面、可信媒体和政策文件核验；两篇草稿在发布后保留复审字段和原始引用卡片。
- 2026-09-28 的两篇 AI 新闻已完成 NVIDIA/Tempus 官方来源、AP/Axios 交叉报道和 FDA K254297 原始记录核验；两篇草稿保留一个 Codex review 子智能体的复审记录、视觉机制和文章/词条联动。
- `/news`、新闻详情页、sitemap 和 Xiaobei 的 published-only 检索均使用同一份已发布目录；草稿不会出现在公开路由或 sitemap。
- `scripts/news-contract.mjs`、`news:validate`、幂等 ingest、canonical/sourceHash 去重、证据/风险/词条关系门槛继续作为发布闸门。
- `.github/workflows/news-update.yml` 现在把 Dots 作为可选交接入口；无 endpoint 时不会因等待 Dots 失败。

## 2026-10-02 阶段一：逐日试跑

DP 研发任务：`a9fe492c-5e3d-44ec-99d9-5101746794ed`（VBP-049，进行中）。本阶段只写入 `2021-01-01` 至 `2021-01-07`，没有启动 2021-now 全量回溯，也没有合并 `dev` 或部署生产。

| 事件日 | 选中事件 | 主题 | 来源 | 文章 slug |
| --- | --- | --- | --- | --- |
| 2021-01-01 | 1 | EfficientQA 与问答内存预算 | 论文原文 | `efficientqa-memory-budget-20210101` |
| 2021-01-02 | 1 | VinVL 的视觉表示 | 论文原文 | `vinvl-visual-representations-20210102` |
| 2021-01-03 | 1 | 少样本特征库与简单分类器 | 论文原文 | `few-shot-feature-library-20210103` |
| 2021-01-04 | 1 | 让智能体读论文与写作 | 论文原文 | `agent-read-write-20210104` |
| 2021-01-05 | 1 | OpenAI CLIP | 官方研究公告 | `clip-natural-language-supervision-20210105` |
| 2021-01-06 | 1 | TextBox 文本生成框架 | 论文原文 | `textbox-text-generation-framework-20210106` |
| 2021-01-07 | 1 | OOD 检测的场景化评测 | 论文原文 | `ood-detection-evaluation-scenarios-20210107` |

每天的候选、检索式、来源 URL、`eventDate`、`publishedAt`、指纹、证据摘录、关系和决策独立保存在 [`content/zh/news-daily/`](../../content/zh/news-daily/)；文章草稿保留在按发现日分区的 `content/zh/news-drafts/2026-10-02/`。1 月 5 日的 DALL·E 官方公告候选被记录为 `deferred`，原因是本试跑每天只选一个主事件，并没有把它悄悄丢掉。按天校验器同时支持明确 `gap` 记录，空档日不会复制邻日内容。

七篇文章都使用原始论文或 OpenAI 官方研究页，带 2 张引用卡片、按事件组织为 3–5 个可自由编排的正文段落、站内公开词条关系和本地自制 SVG 头图；头图记录 `sourceUrl` 与 CC BY 4.0 许可，NewsExplainer 通过 `benchmark` / `agent-workflow` 两种机制步骤辅助理解。`eventDate` 和 `publishedAt` 在内容、草稿、按天候选中分别保留，即使本试跑的七篇恰好同日。

## 历史记录：2026-10-01 原有内容

### 官方来源与事实边界

- [Anthropic — Introducing Claude Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5)，2026-09-28。文章保留速度、成本和 Terminal-Bench 4.0 数字的厂商归属，没有把自测结果写成独立验证结论。
- [Google DeepMind — Advancing Private AI Compute with secure, server-side memory](https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/)，2026-09-23。文章只记录架构与验证方法，明确不推断所有产品已经普遍可用。
- [OpenAI — Introducing dots](https://openai.com/index/introducing-dots/)，2026-09-29。草稿保留官方页面快照和人工复核要求，状态仍为 `needs-review`。

逐条来源、证据摘录、风险和词条关系记录见 [`news-evidence/2026-10-01-official-sources.md`](news-evidence/2026-10-01-official-sources.md)。

### 已执行校验

- `npm run news:validate`：通过，当前目录统计为 `published=4,drafts=3,pending=1`（两个示例、两篇真实新闻，以及一个待复核 OpenAI 草稿）。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- News 与 Xiaobei 定向测试中，内容/schema 测试通过；涉及临时 git 仓库的 ingest/pipeline 测试被执行环境禁止 `spawnSync git`（`EPERM`）阻断，属于运行环境限制。

### 尚未完成的外部验收

- 本环境的 Next.js production build 在 Turbopack 创建进程/绑定端口时返回 `Operation not permitted`，因此没有把这次运行误报为构建成功。
- Docker 首次因默认 `/home/agent/.docker` 只读，改用临时 `DOCKER_CONFIG` 后又被 Docker Hub `node:22-alpine` 的 `429 Too Many Requests` 限流；没有可验证的新镜像。
- 生产域名访问被执行环境的代理 `127.0.0.1:8080` 拒绝；工作区没有生产 SSH/部署凭据。因此没有声称线上页面或部署已经完成。
- GitHub Actions 的 workflow 文件已经提交，但该分支提交尚无 workflow run；创建 PR 后需在仓库侧运行 Actions，或在具备 Docker/生产网络凭据的环境完成最后验收。

#### 2026-10-01 内容叙事与直发改版（本地验证完成，待集成）

DP 任务：`4fd618eb-43f5-41f1-905a-8f74cd4421e2`（News 详细文章结构与模型首轮直发改版）。功能分支在现有 `feat/VBP-049-news-column` 上继续实现，未把本次自动发布改动部署到生产。

- 公开文章新增可自由编排的 `hero`、Markdown `body`、`sections[]` 段落和 `sources` 引用卡片字段；每篇文章可以按自己的事实链路安排叙事，详情页沿用词条的目录/阅读轨道，并提供可暂停、可重播、尊重 reduced-motion 的 `explainer` 机制动画。头图要求可追溯 URL 与明确许可，当前两篇公开文章使用仓库自制 SVG 并标注 CC BY 4.0。
- ingest 接收 `modelReview` 首轮自判；自判为 `publish` 且机械字段通过的记录写为 `ready`，同一轮 `news:auto-publish -- --approve` 直接提升。模型暂缓或机械字段缺失的记录保留 `needs-review`。
- 机械保护继续检查 canonical URL、sourceHash、结构版式、头图来源/许可、可用链接、去重、非空正文和站内关系目标；没有按文章风格增加二次人工内容审查。
- 本次改动仅在本地验证，未合并 `dev`、未启用生产自动直发、未部署生产。`npm run news:validate` 通过（`published=2,drafts=3,pending=1`）；News 内容/ingest/pipeline 定向测试 5 项通过；`npm run typecheck`、定向 ESLint 和 `npm run build` 通过（120 个静态页面）。
- `NEWS_EXPECTED_SLUGS='anthropic-claude-sonnet-5-5-september-2026,google-private-ai-compute-memory-september-2026' npm run news:smoke -- http://127.0.0.1:3200` 通过；本地浏览器实际切换四步讲解、暂停/重播并确认目录、来源卡片和关联链接可见。
