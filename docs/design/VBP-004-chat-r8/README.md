# VBP-004：User 消息与 Chat 对照 R8

日期：2026-09-06。范围：桌面本地原型，未进入 dev 集成或生产发布。

## 调整

- 开场 Harness 内展示 User 消息、todo.txt 附件和“我还有什么没做？”。第二步沿用这条消息，补充读取工具说明。
- 模型采用 Claude SVG 图标，移除原来的圆形外框；删除开场顶部重复任务、模型下方状态及文件侧重复解释。
- 右上角加入 Chat / Harness 分段开关。Chat 用相同的问题和文件名演示没有读取工具时的回复；回复有短暂的等待动画。
- 明确此对照没有把文件正文传入模型；直接提供正文时 Chat 同样可以分析。此处为固定教学演示，不调用真实模型。
- 切到 Chat 暂停 Harness 分镜计时，返回后保留步骤并继续。重播仍回到初始消息。
- 文案保留在词条内容目录，消息组件复用，无新增依赖。图标来源见 public/brands/README.md。

## 实际验证

- 隔离工作区运行 npm run build：成功，TypeScript 检查通过，生成 313 个静态页面。
- 真实桌面浏览器 http://127.0.0.1:3001/terms/agent-harness：检查初始消息、Claude 图标和开关；Chat 回复与输入边界说明正常，Chat 不显示六步控制。
- 第二步 beat=0 时切到 Chat，两次间隔读取均保持 step=2、beat=0、settled=false；返回 Harness 后推进至 beat=2、settled=true。
- 逐步完成第 3–6 步，最终回答为“寄快递”“给绿植浇水”；重播恢复 step=1，移除工具结果和最终回答。
- 目视检查开场、Chat 及第二步布局。截图见本目录 01–04 PNG。
- git diff --check 通过。未运行无关整站测试、手机端验证或部署。

## 工作区与交付边界

分支 feat/VBP-004-harness-user-dialog，继承已有星星与拖尾修复。预览由隔离工作区 D:/Pythonproject/VibeP-harness-star 提供。

改动同步到 D:/Pythonproject/VibeP，保留该工作区已有内容目录重构及其他未提交修改。该工作区的全部未提交重构不在本次构建验证范围内。

DP 研发任务：73c7bfab-c217-4aa5-8c76-c699ed87a279（User 消息与图标）、4f467442-354a-4170-acc4-acf3d4dd591c（Chat 对照）。需求保持开发中，等待用户视觉反馈；本次不推送远端。
