# 第 004 批：Fetch API、Promise、异步等待、JSON、JSON Schema · VBP-016

2026-09-21，从 dev `d9af2fa538d967d4b8379df9f1bf884019e1dbeb` 开始。上一批已完成 dev 集成；本批按最新要求扩展为五页。五篇旧通用页面已在真实浏览器中观察，保留词库关系与旧锚点。

## 机制差异和场景契约

| 页面 | 首图 / 主体 | 操作 → 可见结果 | 正文节奏 |
| --- | --- | --- | --- |
| Fetch API | 信封揭开头部与内容；响应验收台 | 请求真实同源静态资源，先看状态/响应头，再检查并解析。404、非JSON、错误字段不生成书目；重置/切换取消旧请求 | 请求与响应、分层实验、简短代码、取消与边界 |
| Promise | 取餐凭条由等待盖为终态；一份不可改写的结果单 | 创建原生Promise，手动resolve/reject；第二次落定不改终态；真实记录同步语句早于回调，新单清除旧记录 | 状态凭条、处理顺序、返回值与链、resolve含义补充 |
| async/await | 两条资料轨道汇成阅读卡；两项可手动返回的任务 | 串行只先开始标题，并发先开始两项；全部成功才拼成卡片，等待时收藏仍可切换；拒绝不伪成功，也不自动取消另一项 | 代码与任务并排、起始时机对照、拒绝与依赖判断 |

| JSON | 一段文本拆成带类型的值；可编辑的解析台 | 原生JSON.parse，错误与成功分层渐变，编辑使旧结果失效，根null与字符串数字可辨 | 文本/对象区别、解析实验、引号与缺失对照、精度与序列化边界 |
| JSON Schema | 两行字段对齐约束；规则与实例并排 | 固定Schema按字段验证枚举、整数、下限、必填、额外项，不修改输入，旧结果在编辑时失效 | 约定与数据、逐项校验、关键字分工、业务事实与方言边界 |

Fetch 只 GET 本站教学文件，不写服务器或访问用户私有资料。Promise/await 使用本地原生Promise，返回时机由按钮决定，不声称测量真实网络耗时。无新依赖，无持续定时器。有限首图复用 ConceptHero，披露复用 Reveal/States；交互结果取自回调而不是动画时间表。

## 资料与论断映射

- MDN Using the Fetch API：请求、取得响应、AbortController；fetch-response、fetch-cancel。
- MDN Window.fetch / Response.ok：HTTP错误仍可能履行Promise，ok表示200–299；fetch-http、fetch-ok。
- MDN Response.json：读取并解析、无效JSON抛错；fetch-json。
- MDN Promise：三种状态、已落定不变、resolve采用另一Promise、取消边界；promise-states、promise-resolved、promise-cancel。
- MDN Using promises：当前同步代码结束后执行回调、晚注册仍可处理；promise-timing。
- MDN Promise.then：返回的新Promise以及处理函数返回/抛错；promise-chain。
- MDN async function / await：返回Promise、暂停当前函数、首个await之前的同步代码、拒绝抛出；await-function、await-resume、await-cpu、await-error。
- MDN Promise.all：汇合结果按输入顺序、拒绝不取消剩余任务；await-all、await-reject。

- JSON：RFC8259定义、精度，MDN JSON语法、parse解析结果与错误、stringify和类型损失；json-values、json-precision、json-grammar、json-parse、json-stringify、json-loss。
- JSON Schema：官方Draft2020-12 validation、object、numeric、enum、dialect说明；schema-definition、schema-boundary、schema-required、schema-extra、schema-numeric、schema-enum、schema-dialect。

以上原文已阅读对应段落，发布日期不确定则留空。场景说明和应用侧字段检查为本站教学设计，不冒充API内置保证。

## 选定验收范围

正文独立可读、来源/引用/旧锚点；五种主交互的正常与明确失败分支、切换与重置、键盘、桌面和390px；实际中间态与终态；构建和Skill内容/代码review。只验证本批，不追加全站回归。

## 实际验收与 review

- 最终 `npm run build` 通过，TypeScript 与 312 个静态页面生成通过。首次浏览器检查发现下述时序问题，修复后重建并针对性回归；未运行无关全量测试。
- `node --experimental-strip-types --test tests/reservation-example.test.mjs`：1 项通过。仅覆盖固定 Schema 的 required/enum/type/minimum/additionalProperties 分工与不做类型强制转换；不声称是通用 JSON Schema 校验器。
- 编译产物检查：五页内部锚点无缺失/重复，六个旧锚点别名保留；19 个来源的所有正文引用目标存在。未改词库 relatedSlugs，未新增依赖。
- 五页均在真实浏览器桌面 1280px 与窄屏 390px 操作并观察画面。JSON、Schema、await 在 390px 测得 document.scrollWidth = innerWidth；Fetch、Promise 卡片与控制区窄屏画面无溢出。

| 页面 | 实际操作与证据 |
| --- | --- |
| Fetch | 200 先出现而书目未读取；下一步才得到两本书。404仍显示Response，非JSON与错误字段各有准确失败；重置回到未读取。键盘读取、角标跳书目和展开摘录正常。 |
| Promise | 先履行再拒绝，终态仍A17；新单先拒绝再履行仍售罄。实际日志顺序为调用resolve/reject、同步结束、处理回调；后续落定尝试不新增处理回调。新单清空旧记录，键盘开合与收起中间态可见。 |
| await | 串行只先发起标题；返回后才发起封面。并发封面先到仍等待，标题后到才组装；封面失败后标题仍能返回但不会成功组装。等待时可收藏；切换/重置取消待返回Promise并隐藏旧内容。键盘启动和窄屏终态通过。 |
| JSON | 原生解析对象显示string/number/boolean，数量加引号变string，尾逗号抛SyntaxError，根null合法；编辑后旧结果失效，Space可重新解析。 |
| JSON Schema | done与−1分别失败，修正到success与0通过；字符串、小数、缺count、多debug各自命中正确规则。编辑后回到未校验；源码点击/键盘开合，窄屏紧邻触发按钮展示。书目摘录返回schema-required，实际hash、焦点与落点正确。 |

### 修复和交互 review

- **BUG-DE4F8DAC**：实测发现 await 等待时轨道提前显示真实标题。改为占位，标题只能由当前轮Promise回调写入；等待、返回、重置、并发逆序和失败已回归。DP用例首次failed，第二次passed，保留两次记录。Bug仍为 `ready_for_retest`，其 `allowed_transitions` 为空；当前CLI没有复测确认命令，未强行改状态。
- 手机端“查看Schema”原来展开在整张编辑器之后，调整到按钮下方；已观察展开终态及593px实际高度，未溢出视口。
- 遮住标题，五种场景仍可由信封、凭条、双轨装配、文本树、字段规则台区分。首图分别为拆封、盖章、汇合、拆值、规则对齐，不复用三个图标曲线。
- 不播放动画、不展开旁支内容通读：定义、关键因果与失败边界均常驻；粗体只标关键区别。保留完整书目URL、正文角标、点击披露与相关星图，没有恢复测验和提示词大模块。
- 状态层持续挂载，退出有淡出；隐藏层aria-hidden/inert，异步回调有轮次保护。自动首图有限播放、可重播；已实测JSON首图离屏后 `data-playing=false`。没有新增持续定时器或帧循环。
- 实测沿用雾蓝/陶土主题；样式均取现有变量。其他主题、系统减少动态模式没有逐个切换；已代码核对减少动态时禁用动画/transition且默认状态可读。没有宣称这些环境已实测。

## 交付状态

- DP：VBP-016 `testing`；2个研发任务done；五项最终执行passed，计划completed。上述Bug保留平台待复测确认状态。
- 功能分支：`feat/VBP-016-async-concepts`，基于dev `d9af2fa538d967d4b8379df9f1bf884019e1dbeb`。
- Git集成、部署事实见对应PR与DP实际记录。本记录随实现提交，不预填未发生的合并提交。
- 远端dev未配置，预览使用本地3001；未发布生产。回滚可独立检出上述基线，构建后重启本地3001，不使用hard reset覆盖工作区。
- 当前Mac无指定的 `D:/Obsidian/gysnote`，记录保留在本仓库；本批无新增正式飞书文档。

