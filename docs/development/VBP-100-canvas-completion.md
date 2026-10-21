# VBP-100 · 画布小北补全

用户批准停顿灰字提示方案，并授权检查通过后直接上线，积分扣费保持关闭。实现、测试与发布负责人为顾毅盛。

## 实现边界

- 编辑区聚焦且前文非空，光标和输入停顿3秒后显示快捷键提示。停顿只运行本地定时器；按 Command/Ctrl+Enter 或点击提示才请求策略与一次补全。没有常驻入口或免费标签。
- Tab 接受、Escape 放弃；输入、选区变化、组字、失焦、滚动或卸载时取消请求。接受前正文、预览和导出均保留原文。程序插入单独保留一步撤销/重做。文末候选直接以灰字延续；中间插入使用光标旁的轻浮层，避免候选覆盖原有后文。
- 只提交当前笔记标题、前文的 Markdown 标题提纲及靠近光标的最多6000字符；提纲最多1500字符，标题160字符。首次使用说明主动发送片段；不新增正文或补全记录持久化。
- 独立 `/api/xiaobei/completion` 复用小北身份验证、同源保护、模型传输和精确计价。无意图分类、检索、工具与会话写入；整次30秒期限，每邀请码单并发及2秒冷却。VBP-108 起改为提示词通常20到100字、一两句、完整收尾，不按100个Unicode码点裁剪；1024 Token生成预算为收尾留余量，详见 [VBP-108](VBP-108-completion-ending.md)。
- 只为补全关闭思考，聊天继续原协议。[百炼官方 DeepSeek API](https://help.aliyun.com/zh/model-studio/deepseek-api) 说明 `enable_thinking` 切换思考模式。

## 计量、配置与兼容

`XIAOBEI_COMPLETION_CHARGE_ENABLED` 只有精确 `true` 才启用，示例环境与 Compose 默认为 `false`。接口按服务端策略扣费，客户端收费确认只能阻止未确认的新收费，无法将收费请求降级为免费。策略在每次请求开始时固定并写入用量行。

usage 表增量增加 feature、charge、calculated_cost。既有 cost 继续表示实扣，reserved 表示实际预占，真实输入、缓存与输出列沿用原结构。免费请求预占0，成功后cost为0、calculated_cost记录按现有单价算出的积分；无usage的请求保留NULL未知用量，不假装消耗为0。余额0的有效授权仍可免费补全。原聊天行默认charge=1，旧结算和余额保持兼容，既有历史行的理论成本可从cost读取。

冷却保存在独立表，不修改runs结构。旧程序仍可插入5列runs；回滚后保留新表和新增usage列，不恢复覆盖当前数据库。免费请求后续结算只遵守原charge=0，不追扣。

## 验证与发布

内容校验、TypeScript和1185页生产构建通过；新增文件ESLint通过，专项8项断言通过（补全4、原聊天3、历史1）。未运行整仓check。真实HTTP验证未激活POST401、跨站POST403；停顿时usage仍0行。

本机localhost:3100使用独立测试数据库与临时邀请码，调用既有百炼配置，只发送合成笔记。两次成功补全分别157输入/42输出与201输入/26输出，均预占0、实际扣分0，原价计量2830与2790百万分之一积分。一次中途取消没有usage，保留NULL未知用量与0预占。

桌面真实浏览器通过灰字提示点击和Command+Enter、首次发送范围说明、未激活入口、文末灰字与正文中间浮层、Tab接受、Escape放弃、继续输入取消、一次撤销/重做、普通Tab聚焦分隔条、50→55→50键盘调整和保存刷新。截图 `../design/VBP-100-canvas-completion/evidence/local-suggestion.png`。

BUG-2470593E：共享按钮重置覆盖了提示颜色，导致继承镜像透明色；提高局部规则优先级。BUG-604DA800：首次autoFocus早于ref可用，改用事件currentTarget并保留空引用保护。BUG-AB3BFAA7：长文输入自动滚动会清除提示计时，底部候选也可能裁切；滚动后重新计时，空间不足时使用可见区域内的浮层。最终构建重新进入编辑页无控制台错误；45行合成笔记文末停顿后提示恢复，候选完整可读，截图 `../design/VBP-100-canvas-completion/evidence/local-long-note.png`。测试节点已通过可撤销的节点菜单删除，本地画布恢复原先空白状态。

390px宽、844px高的真实浏览器iframe检查中，文档宽度390、编辑区宽度390，停顿提示可见，无横向溢出，截图 `../design/VBP-100-canvas-completion/evidence/local-390px.png`。后台浏览器视口覆盖未生效，改用同一应用的受限iframe检查布局；该环境无法派发嵌套框架快捷键，因此窄屏只验证编辑和提示布局，完整快捷键流程由桌面验收覆盖。

PR492已合入dev `195ee84e8e721d209392295775dbc8fce496d8c5`，Git树与已构建功能提交一致。本机独立数据库重启后，真实浏览器通过新建、全文编辑、停顿提示、Esc与清理，控制台无error，证据 `../design/VBP-100-canvas-completion/evidence/dev-hint.png`。

首轮生产PR493提交 `f6399040ba07c8c807db22625781167b0934b4ce` 于2026-10-19 10:52 UTC上线，服务健康且扣费false。SQLite在线备份 `/opt/vibepolaris/backups/20261019T104731Z-from-a9de70c8`，quick_check为ok；回滚脚本 `/opt/vibepolaris/releases/20261019T104731Z-f6399040/rollback.sh`。真实模型冒烟发现BUG-0F1F7D8A：前文“今天我想试着”，模型候选重复同一开头。已放弃该候选，原文未变；证据 `../design/VBP-100-canvas-completion/evidence/production-repetition.png`。服务端现在先移除至少4个非纯空白Unicode码点的精确首尾重叠，再限制长度；短词与Markdown换行保留，新增实际复现及边界断言通过。待修复集成和第二轮生产冒烟完成后补充最终发布结果。

未实测系统中文组字、真机键盘及其他浏览器；组字与按键重复已有事件分支保护。

本机没有指定的 `D:/Obsidian/gysnote`，研发记录保存在Git与DP。
