# VBP-012：旧词条演示与讲解复审

本轮从 `origin/main` 的 `dbe42873` 新建 `feat/VBP-012-legacy-animation-diversity`。旧图标分支落后生产主线，不作为本轮实现基线。现有 373 个已发布词条先完成复审，不新增词条。

用户要求旧词条也使用概念专属的演示，流程图只占少数。按真实画面判断：去掉箭头、换 `sceneKind` 或轮流点亮卡片不能算重做。标题旁只放紧凑概念首图，主体按理解需要展开。演示的步数自由决定，不再把历史三步字段当成设计要求。

执行顺序保持逐条研究、撰写、实现、独立 review、浏览器验收和提交；累计十条验收完成后统一发布。只复用 `/root/ai_stack_review`，不调用 ZCode。

## 本批逐条记录

### 1. TypeScript（本地已验收）

- 读者任务：购物车数量为什么从 `2 + 3 = 5` 变成 `"2" + 3 = "23"`；类型检查能提前发现什么，接口回来之后又要检查什么。
- 旧页问题：只有简短定义与四阶段卡片；`unknown` 赋给 `Profile` 的画面没有展示对应静态错误，且“运行时校验”只切换预设标签。
- 专属形式：紧凑编辑器首图用错误下划线与类型标注擦除呈现差别；主体直接切换数字/字符串和 TypeScript/JavaScript 视图。第二个实验在同一个数据标本上对比 `as number` 与实际 `typeof` 校验，值不会被标签改变。
- 读者追问：引号为什么改变结果；冒号后写的是什么；不运行怎么报错；为什么报错后还能输出 JavaScript；`as` 会转换数据吗；`number` 能保证商品数量合法吗。
- 实读来源：TypeScript `TypeScript for the New Programmer`、`Everyday Types`、`Narrowing`、`noEmitOnError` 与 MDN `Addition (+)`。正文映射在 `lib/typescript-sources.ts`，只对支持对应断言的段落挂引用；更新时间不当作出版日期。
- 边界：实验只演示指定表达式，不运行任意输入或调用模型；类型断言不验证数据；类型擦除不等于每个构建工具都会忽略错误；`typeof number` 不验证正整数业务条件。
- 验证已执行：修复后 `npm run build` 与 `npm run typecheck` 通过（构建 1111 页）；桌面实际操作字符串/数字、擦除类型、断言/真实校验，结果分别为 `"23"`、`5` 与拒绝字符串。390px 首图保持紧凑，测得 viewport/pageWidth 均为 390。
- 独立 review PASS；其发现的 P2 已关闭：JavaScript 视图真正移除类型标注节点，AX 与复制文本不再保留 `: number`。切换输入清除旧结果，reviewer 的浏览器核对未见 console error。
- 后续台账复核：索引与 experience 同步为六个独立条件、无流程边；移除旧的“通过检查才输出”连线，补齐 noEmitOnError 与加法来源，保持与活动页面一致。

### 2. 嵌入（本地已验收）

- 读者任务：用“忘记密码”找到字面不同的资料；相近是什么意思，为什么最高分的旧材料也可能不可用。
- 旧页问题：正文提到二维点，但首图/主体没有几何对象；三卡箭头和预设分数字符串不展示任何比较关系。
- 专属形式：单位圆上的文档点保持不动，查询方向和查询圈同组旋转；二维单位向量的实际点积形成余弦分数，并推动候选实体换位。按钮查看原文，键盘滑块改变方向；旧说明 D 的高分与过期状态共同呈现边界。
- 读者追问：向量是什么；维度能否对应词义；余弦为什么看方向；二维图能否当真实距离；高分是否等于正确概率；换模型后旧向量能否混用。
- 实读来源：Sentence-BERT HTML 正文的引言、模型和训练段；Sentence Transformers `Semantic Search` 与 `Semantic Textual Similarity`；scikit-learn `cosine_similarity`。正文共 6 个映射，引用在 `lib/ai-stack-concept-sources/embedding.ts`。
- 修正边界：重排序和 RAG 也可使用关键词检索，不把嵌入说成所有方法的前提。教学坐标不是模型输出，也不把教学分数称为真实概率。
- 验证已执行：修复后 build（1111 页）与 typecheck 通过；桌面查询切换、查看原文、range 键盘推进通过；390px 测得 viewport/pageWidth 均为 390，排名对象实际换位。查询点与方向线整体运动，避免中间帧脱节。独立审读 PASS，唯一正文 P2 已关闭；reviewer 确认减弱动效规则有效。
- 画面证据：本地 `embedding-geometry-20261008.jpg` 已保存在本任务的 visualization 目录；不将截图放入产品包。

### 3. 重排序（本地已验收）

- 读者任务：问退款到银行卡需要多久，初次检索第一条却只说取消会员；已有资料如何换位，哪些资料重排仍然看不到。
- 旧页问题：A/B/C 只作为结果字符串轮换，候选实体未换位；原有台账的排序与分数也未对应新正文。
- 专属形式：标题旁三张纸直接换位置，控制按钮留在纸外；主体保留候选身份和原文，A/C/B 实际移为 B/A/C。取用边界随 topN 移动，未取用的纸变淡；漏掉 B 时移除实体；失败时明确回到召回次序。D 始终在框外且没有重排分。
- 读者追问：同一话题为什么答非所问；交叉编码器如何同时读问题与正文；候选缺失能否靠重排补救；返回数量是否等于评分数量；分数能否当正确概率；截短正文、服务失败之后如何处理。
- 实读来源：Sentence Transformers `Retrieve & Re-Rank` 与 `Cross-Encoders`；Nogueira & Cho 的 `Passage Re-ranking with BERT` v5 HTML 正文（版本日期 2020-04-14）；Google Cloud Ranking API 的输入、topN 与输出说明。正文 7 处引用映射；四来源在 helper/research/experience 同序。
- 边界：资料与分数为教学示例，未调用模型；关键词召回也可进入重排；重排不补回漏掉的候选，不保证真实性。失败保留召回顺序是本例策略，不是所有服务的约定。
- 验证已执行：build 与 typecheck 通过；真实浏览器核对换位、查看原文、漏 B、topN=1/2 和失败降级；390px 首图 225px，viewport/pageWidth 均为 390。独立审读 PASS；其 P1 台账漂移已关闭，experience 与 batch 同步五个自由长度的条件，不设固定三步。
- 画面证据：`reranking-papers-20261008.jpg` 保存在本任务 visualization 目录，展示同一候选换位与输出边界。

## 后续优先修复对象

独立 reviewer 在当前主线确认 embedding、reranking、execution-sandbox、bundler、hmr、dependency、semantic-versioning、hot-reload、jwt、load-balancer 的活动路由仍有缺口。当前批次第一条已先处理 TypeScript，随后逐条推进上述名单，不一次修改十条。已有正确交互只保留并复核，不因首图有问题而重写全部正文。

允许保留少数流程语法的例子：工具调用的请求与回执交接、智能体循环的结果回写和停止、CI/CD 的依赖检查与失败阻断。树、几何空间、排名、封签和模块替换按各自机制表达。

JSON 标签统计 `pipeline/route/loop` 为 44/372（11.8%），只作为索引信息，不能作为独立页面视觉验收证据。

## 当前交付状态

变更逐条本地提交，本轮尚未集成或发布，不改动公开词条清单。DP 需求列表查询两次均遇到 `SSL: UNEXPECTED_EOF_WHILE_READING`；未创建任务或写入状态。使用已有父需求 VBP-012 继续本地独立工作，连接恢复后按真实结果补录。当前 Mac 不存在规则指定的 `D:/Obsidian/gysnote`，研发记录保留在本文，未写入不存在的库。
