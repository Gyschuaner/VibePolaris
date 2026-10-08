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

## 后续优先修复对象

独立 reviewer 在当前主线确认 embedding、reranking、execution-sandbox、bundler、hmr、dependency、semantic-versioning、hot-reload、jwt、load-balancer 的活动路由仍有缺口。当前批次第一条已先处理 TypeScript，随后逐条推进上述名单，不一次修改十条。已有正确交互只保留并复核，不因首图有问题而重写全部正文。

允许保留少数流程语法的例子：工具调用的请求与回执交接、智能体循环的结果回写和停止、CI/CD 的依赖检查与失败阻断。树、几何空间、排名、封签和模块替换按各自机制表达。

JSON 标签统计 `pipeline/route/loop` 为 44/372（11.8%），只作为索引信息，不能作为独立页面视觉验收证据。

## 当前交付状态

变更逐条本地提交，本轮尚未集成或发布，不改动公开词条清单。DP 需求列表查询两次均遇到 `SSL: UNEXPECTED_EOF_WHILE_READING`；未创建任务或写入状态。使用已有父需求 VBP-012 继续本地独立工作，连接恢复后按真实结果补录。当前 Mac 不存在规则指定的 `D:/Obsidian/gysnote`，研发记录保留在本文，未写入不存在的库。
