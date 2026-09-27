# 第026批：流式输出、结构化输出与函数调用 · VBP-041

VBP-012的三个既有词条，顾毅盛负责全部本批研究、设计、实现、review和本地dev集成。保留分类、别名、relatedSlugs和六个旧锚点。不含main、生产或远端dev部署。

## 已读资料与正文映射

每篇四份实际读到的公开原始资料。只声明阅读论点相关范围，搜索摘要不计入，未通读整本规范或整篇论文。OpenAI Markdown页由于工具不支持content-type未计入，改读其HTML正文。日期不明留空，论文用已核实年份；MDN日期为页面修改日期，非技术发明时间。下列工具行号只供本次定位，不是永久引用。

| 词条 / 来源 | 实际已读范围 | 正文论点 / 限定 |
| --- | --- | --- |
| 流式 · [OpenAI Streaming API responses](https://developers.openai.com/api/docs/guides/streaming-responses) | 860–869、1090–1150、1411–1422 | stream-definition/completion：增量与生命周期完成不同，不限定所有传输都为SSE |
| 流式 · [WHATWG SSE](https://html.spec.whatwg.org/multipage/server-sent-events.html) | 393–448、481–515 | stream-framing：UTF-8/逐行/空行分派；一次网络读取不等于完整事件或token |
| 流式 · [Anthropic Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming) | 77–160、192–205 | stream-errors：开始后可出现错误，内容块停止与message_stop不同，未知事件需兼容 |
| 流式 · [MDN abort](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort) | 172–206、232 | stream-cancel：客户端中止读取；不推断远端全部动作撤回 |
| 结构 · [OpenAI Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) | 1792–1809、15321–15339、16781–16793 | structured-definition/truth：可解析与schema合规不同，仍可能内容错误，未承诺任意schema支持 |
| 结构 · [JSON Schema object](https://json-schema.org/understanding-json-schema/reference/object) | 77–91、159–174、306–316 | structured-fields：properties/required/additionalProperties，不冒称本例验证器支持通用schema |
| 结构 · [Anthropic Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | 85–89、382–389、437–476、534–565 | structured-decoding/terminal：编译语法/采样约束，支持子集与拒绝/截断；不写易变价格、模型或SDK字段 |
| 结构 · [Willard/Louf Guided Generation](https://arxiv.org/pdf/2307.09702) | PDF0–54、92–133、166–170 | structured-guidance：当前前缀、候选掩码与采样；论文方法不是全部厂商算法，2023 |
| 函数 · [OpenAI Function calling](https://developers.openai.com/api/docs/guides/function-calling) | 851–889、1013–1026、2717–2727、2959–2964 | function-definition/return：应用执行与call_id匹配，字段形式明确属接口 |
| 函数 · [Anthropic Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) | 77–95、211–213 | function-executor：客户端自定义代码与平台服务端工具执行者不同 |
| 函数 · [MCP Tools 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) | 364–415 | function-controls：输入校验、访问控制与协议/业务错误不同，明确该版本，不说函数调用必须MCP |
| 函数 · [Toolformer](https://arxiv.org/pdf/2302.04761) | PDF0–64、224–237 | function-learning：学习API选择/时机/参数/结果使用，生成请求后实际执行取得结果；2023训练方法不冒称全部接口基础 |

## 机制差异与场景合同

| 页面 | 首图 | 核心状态与证据 | 正文节奏 |
| --- | --- | --- | --- |
| 流式输出 | 片段与合成文字逐次到达，最后完成标记 | 建立响应→逐事件接收→delta累加→text-done仍未整次完成→complete；错误/取消保留部分，空文本正常完成；共享useScene有限播放/暂停/手动，输入改动清理计时并保留旧退出快照 | 定义与两类等待→接收列表/缓冲区并列→传输层次错位→中断与取消 |
| 结构化输出 | 整数120/999保留、字符串排除，格式不验证事实 | 选择输出模式/候选/结束情境→格式过滤→正常输出或拒绝/截断/空→解析/字段/资料三层检查；120通过、999形状通过事实失败 | 数据读取→候选过滤桌面→大字判断→生成时约束/生成后校验对照→边界 |
| 函数调用 | 函数名与参数匹配注册表，再出现call_01结果 | 收到请求快照→独立点击检查注册名/JSON/唯一字段订单号/权限→实际本地查固定记录→call_id对应结果；失败不执行/无结果，A999执行一次但业务失败 | 定义→请求JSON→请求与应用注册表→全宽结果→结果交回/执行责任→训练与业务可靠性 |

模拟事件、候选及订单记录全部固定，无真实API、网络、用户订单或任意代码执行。结构化候选为整份结果，不是token，也不复刻厂商完整decoder；本例amountShape只检查一个整数必填字段与无额外字段。无新依赖、永久帧循环、通用工厂；公共阅读壳/Citation/Aside/Hero/Reveal/States/useScene复用。

结果只在执行时更新；输入改变关闭旧层而不替换其退出内容。函数新请求用run key使上次结果层从closed起点重建，避免混进新请求；旧输入退出仍保留两层快照。首图有限一次，共享离屏/后台暂停/重播/reduced-motion，不改用户OS设置。

## 实现review与初步验证

组合模型检查一次通过，覆盖增量拼接/文字done与完整done/取消错误空、格式与事实层分离/截断拒绝空、函数注册与参数权限边界及缺订单。npm run build首次通过，106静态页、95公开词条。

Review增加未接收文字的aria-hidden，防止读屏提前拿到完整预设回答；结果检查加明确“通过/未通过”文本，不仅依靠颜色和图标。模型规则未变，不重复组合检查。快速验证中工具fill空字符串未修改textarea，真实按键Meta+A/Backspace已清空且实际显示参数不完整/执行0次；不把工具未完成操作记成产品Bug。

最终UI调整后第二次build通过，106静态页、95公开词条。12条书目映射16个唯一正文目标，逐页4条；保留元数据和原有相关概念关系。三篇常驻正文分别说明定义、过程、边界，标题直接描述对象与动作。候选、事件列表与注册表的空间组织不同。旧六锚点三页实际DOM均存在。


## 真实浏览器观察

Chrome桌面1470×762及手机390×844。桌面/手机实际截图已看，三页实验均正文宽度；手机document390/lab342px，没有横向溢出。函数手机请求、注册表与结果顺序堆叠；结构候选四格保留两列、三检查纵向；流式布局按窄屏改为事件列表与接收区上下。

- 流式：建立后逐事件接收，第6个文字done仍尚非完整，第7个complete才完整；中断在第4事件保留两段文字且未完成。自动接收后取消停在2事件，后续复查仍2，不继续追加；重置Enter可再建立。空情境完整结束且明确没有文本。第四条MDN三角展开当前正文并回跳#stream-cancel，桌面top约130px。
- 结构：默认120三层通过；999格式通过但资料不符；schema字符串与空对象被排除；JSON字符串能解析但字段失败。截断、拒绝、空结果均未完成；重置Enter恢复默认。三层检查最终构建已有明确文字“通过/未通过”。第四条论文三角摘录回跳#structured-guidance，桌面top约130px。手机正常结果、候选、按钮和检查文字均可读。
- 函数：默认收到后只有请求与注册表，检查执行之后才显示1次执行与shipped/call_01。未授权、未注册、空参数、损坏JSON、整数订单号均0次无业务结果。A999执行1次但order_not_found。实际按键清空参数后确认空输入0次。重置Enter恢复默认；手机结果完整同宽。第四条Toolformer回跳#function-learning，桌面top约130px。
- 退出与快照：函数改权限时隐藏层inert，旧shipped快照仍保留于退出层；新请求容器从closed起点无上一结果。结构改候选时旧120报告inert且open=false，不提前替换999结果。流式改情境旧7事件报告关闭/inert，重新建立才换事件计划。快速重建的残影另见下文缺陷记录。
- 首图：三页重播后CSS动画iteration1、实际终态opacity1。结构和流式手机首屏截图已看、文字与关系稳定。共享离屏/后台暂停、reduced-motion实现review，无新增常驻循环；未改OS动态效果设置。

有限自动流式、可访问性和日志均按最终构建观察。没有整站回归或远端集成验证。


## 快速重建缺陷与回归

真实截图复现BUG-7DED17C9：完整回答后立即重置重建，仅created的新响应仍显示旧整段文字，span opacity约0.128、外层open=true/opacity0.993。根因是文字节点退出过渡被新响应复用；修复为每次新响应使用新的run key接收层，普通输入关闭保留旧层淡出。第三次构建通过；最终构建真实桌面复现同一路径，新created响应全部span opacity0、aria-hidden=true，截图接收区无旧文字。仅回归受影响路径，没有重复整个套件。

最终流式自动接收停在7个事件/完整响应；手机document390/lab342px，全部事件与缓冲区可读，日志warn/error为空。函数首屏稳定终态截图也已看。三页有限首图全部终态opacity1。

按新增write-like-me审校当前三篇：标题陈述具体内容，正文主语/动作/因果明确，无宣传铺垫或设问套路；定义、过程、事实范围和必要技术区别保留，不将面向读者的概念文章机械改成编号工作报告。全体前序公开词条的文字复核另行记录，不将本批三页审校冒称全站完成。

## 集成记录

PR [#85](https://github.com/Gyschuaner/VibePolaris/pull/85) 已合入 dev，提交 `560cfafa3b65dc74aa13401992af75b6417db7ed`。DP 测试计划 `9bbe648f-baa9-40f6-82a4-a26f6caff7f2` 3/3 通过，BUG-7DED17C9 关闭，需求 VBP-041 处于待发布。合并后重启本机 dev 预览，在 Chrome 核对流式页面收到 created 但尚未完成，结构化与函数调用页面均可打开。本机部署记录 `b300539c-c84a-4bcd-b1f5-7b2fde45d6f8`，回退基点为 `1dc5c83ff89545a65584e35fd24c53fe77b82bb3`。未部署远端 dev 或生产。

全体公开词条的文风复核已另记于 [VBP-042](VBP-042-published-style-review.md)，没有把本批三页 review 代替全站复核。
