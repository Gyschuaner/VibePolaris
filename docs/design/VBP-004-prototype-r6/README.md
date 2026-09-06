# VBP-004 · R6 可维护桌面原型

用户本轮取消网页涂鸦。R5 只作为教学分镜参考，网页采用真实文本、复用组件和 CSS 动画。只改 Harness 词条，保留星图主页。

本地入口：http://127.0.0.1:3001/terms/agent-harness

```powershell
npm run check
npm run start -- --port 3001
```

check 包含生产构建，首次准备需安装仓库依赖。当前预览使用生产构建，修改后重新构建并重启。

## 维护入口

| 文件 | 职责 |
| --- | --- |
| lib/harness-lesson.ts | 六步文案、时长、固定待办数据、状态转换及可见数据派生 |
| components/terms/HarnessLesson.tsx | 复用 Caption、TodoRows、Flow；定时清理、键盘与减少动态效果 |
| components/terms/HarnessLesson.module.css | 主题变量、布局与方向动画 |
| components/terms/AgentHarnessTermPage.tsx | 词条外壳、星图返回、关联词条与折叠来源 |
| tests/harness-lesson.test.mjs | 数据到达先后、旧计时事件、回退重播与减少动态效果 |

主线：未知文件内容 → 准备任务与工具 → 模型请求 → 工具执行并回传 → 第二次调用 → 回答。每次推进一步，步内动作自动播放，结束后才允许继续。回退直接稳定展示上一阶段，revision 使过期计时事件失效。演示不调用真实模型或读取用户文件。

## 验证与限制

npm run check 通过，43/43 测试含新增 4 项。最终清理无用 CSS 后生产构建再次通过。浏览器完整六步、回退、重播、键盘、折叠说明、主题、星图入口通过。1440×900 与 1280×800 无横向溢出，生产预览无控制台 warning/error。

截图 01–06 为六步，07 为 1280 浅色，08 为 1280 深色，09 为深色结果，10 为首页选中 Harness。第 4 步实测中间态执行向右、下一步禁用，稳定态结果向左。详见根目录 design-qa.md。

减少动态效果已做状态单元测试与 CSS 降级，未改系统偏好实测。未做手机端、真实模型、权限拒绝等扩展教学、dev/生产部署。自动检查通过不等于用户设计认可。

## 协作记录

VBP-004 保持研发中，等待本地评审；旧 BUG-F319515E 保留待复测。DP 聚合 workflow preview 连续服务断连，单资源 CLI 正常后改用 CLI 逐项登记，没有绕过 API 或认证。dp-workflow.json 是未执行原计划，不要重复 apply；实际用例 ID 见 dp-cases.json。

飞书沿用既有方案，追加 R6 章节，revision 21；标题保持原 R3 名称：[正式方案](https://ycn7t34xe864.feishu.cn/docx/VWilddQlHoNCEqxlGNjcEwMnn5f)。DP document ensure 确认关联未变。

分支 feat/VBP-004-desktop-harness，本轮本地提交，不合并 dev/main，不部署。

R6 测试计划已创建：4950b0fd-89c6-4035-9652-31d92e9ba243，状态 ready。登记执行结果时 DP 返回 REQUIREMENT_NOT_IN_TESTING：需求未进入测试中，不允许执行计划。未为录入结果强行更改需求阶段；本地通过证据保存在本目录和飞书。正式测试记录待需求进入测试阶段后补录，不能声称 DP 测试计划已完成。
