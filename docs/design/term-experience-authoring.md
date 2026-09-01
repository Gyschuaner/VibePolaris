# 词条独立体验编写规范

## 目标

每个词条都要回答一个具体问题，并通过一次可以操作、可以观察结果的演示解释概念。公共页头、排版、控制器和无障碍行为可以复用，核心场景、画面对象、状态变化与结论不能套用同一份模板。

## 数据结构

正式体验数据存放在 `content/zh/term-experiences/`，每条记录包含：

- `slug`：与正式词条一致。
- `lead`：用一个具体问题引出概念，不写空泛背景。
- `definition`：说明机制，不复述词典式释义。
- `boundary`：明确它负责什么、不负责什么，以及最容易混淆的邻近概念。
- `sceneKind`：从现有画面语法中选择最贴近机制的一种。相邻词条应主动错开。
- `sceneTitle`：说明演示里正在观察什么。
- `actionLabel`：用户主动推进演示时看到的动作。
- `actors`：场景中的真实对象。每个对象有稳定的 `id`、短标签、补充信息、图标和布局分组。
- `edges`：对象之间确实存在关系时才添加，不能为了装饰补线。
- `frames`：2–7 帧。每帧必须改变可观察状态，并写清原因和结果。
- `insight`：演示结束后保留的一句结论。
- `quiz`：验证概念边界，不考定义背诵。
- `prompt`：可复制到真实项目中的检查或操作提示，不绑定 VibePolaris 自身业务。
- `sources`：1–3 个规范、官方文档或原始论文。

页面会根据 `actionLabel` 选择真实控件：含“拖动、调整、移动、修改”等动作时使用滑杆；含“选择、切换、筛选、比较”等动作时使用下拉选择；其余动作使用逐步按钮。动作词必须与控件一致，不能写“拖动”却只给下一步按钮。自动播放只运行一遍，到最终状态后停止。

### 可用 sceneKind

`route`、`pipeline`、`transform`、`compare`、`layers`、`tree`、`network`、`timeline`、`queue`、`state-machine`、`memory`、`contract`、`branch`、`loop`、`matrix`、`spectrum`、`assembly`、`terminal`。

### 可用 actor icon

`browser`、`server`、`database`、`file`、`code`、`user`、`robot`、`brain`、`gear`、`package`、`git`、`shield`、`key`、`cloud`、`clock`、`queue`、`search`、`chart`、`layout`、`component`、`message`、`network`、`memory`、`spark`。

### frame 约束

```json
{
  "slug": "cache",
  "lead": "商品已经改价，为什么部分用户仍看到旧价格？",
  "definition": "缓存把数据副本放在更快的位置，读取前先按键检查副本是否仍可使用。",
  "boundary": "缓存不是唯一数据来源；源数据、有效期和失效动作必须能对上。",
  "sceneKind": "branch",
  "sceneTitle": "同一次商品查询的命中与回源",
  "actionLabel": "继续查询",
  "actors": [
    { "id": "client", "label": "商品页", "detail": "请求 sku-42", "icon": "browser", "group": "请求" },
    { "id": "cache", "label": "缓存", "detail": "key: sku-42", "icon": "memory", "group": "快速路径" },
    { "id": "database", "label": "数据库", "detail": "价格 129 元", "icon": "database", "group": "数据源" }
  ],
  "edges": [
    { "id": "client-cache", "from": "client", "to": "cache", "label": "先查副本" },
    { "id": "cache-database", "from": "cache", "to": "database", "label": "未命中才回源" }
  ],
  "frames": [
    {
      "label": "缓存命中",
      "note": "键已存在且尚未过期，读取在缓存层结束。",
      "activeIds": ["client", "cache"],
      "doneIds": ["client"],
      "mutedIds": ["database"],
      "values": { "cache": "HIT · 8 ms", "database": "未访问" },
      "activeEdgeIds": ["client-cache"],
      "metric": { "label": "示例响应时间", "value": "8 ms" }
    }
  ],
  "insight": "命中减少读取成本，失效规则决定用户会看到多久的旧数据。",
  "quiz": {
    "question": "商品价格更新后，最需要同时处理哪一项？",
    "options": [
      { "label": "更新或删除对应缓存键", "correct": true },
      { "label": "增加页面动画", "correct": false },
      { "label": "把缓存当作唯一数据源", "correct": false }
    ],
    "success": "源数据变化与缓存失效对齐，才能控制旧值存在的时间。",
    "retry": "问题不在页面外观，而在副本何时失效。"
  },
  "prompt": {
    "title": "检查一项数据的缓存策略",
    "text": "请列出这项数据的来源、缓存键、写入时机、有效期和失效动作……"
  },
  "sources": [
    { "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching", "label": "MDN · HTTP caching", "note": "缓存命中、验证与失效" }
  ]
}
```

- `activeIds` 表示当前正在发生变化的对象。
- `doneIds` 表示已经完成工作的对象。
- `mutedIds` 表示本帧刻意没有参与的对象。
- `values` 只写本帧需要观察的值；不要把定义换个说法塞进去。
- `activeEdgeIds` 只点亮实际经过的关系。
- `metric` 可选，必须是这个示例中的教学数值或状态，并在可能被误解为基准测试时注明“示例”。

## 独立性门禁

两个词条只要同时出现以下任意两项，就视为同质化，需要重写：

- 相同的对象集合；
- 相同的帧标题顺序；
- 相同的状态变化；
- 相同的用户操作；
- 只替换名词后仍能成立的说明；
- 相同的结论或测验逻辑。

页面完成前还要检查：键盘可操作、移动端不横向溢出、减少动效偏好、来源可访问、文案没有模板化 AI 表达。

关系型场景还必须验证 `edges.from` 与 `edges.to` 确实在画面中形成连线；不能只把关系文字列在卡片下面。相邻词条不得连续复用同一个 `sceneKind`。
