# VBP-099 · 导航当前页与阴影滑块

关联缺陷：BUG-5612F7CE。原共享导航只有知识画布接收 active 参数，其他栏目缺少当前页状态。

## 实现

SiteHeader 统一按路径识别栏目：首页、词条、教程归属星图，新闻详情归属新闻。链接保留 aria-current。笔记弹窗通过原生 dialog 的 close 事件同步状态，打开时滑块移至我的笔记，关闭或 Escape 后恢复页面栏目，不把弹窗伪装成新页面。

以一个圆角浅纸面与淡阴影替代原下划线。浏览器 Web Animations 在 360ms 内移动位置并适配入口宽度；短暂保存上次可见位置，跨页面重挂载也能连续移动，不写存储。窗口调整直接重新定位；首次加载、减少动态偏好与缺少动画接口时直接显示。桌面与手机现有入口分别定位，不改变导航布局。未添加依赖。

## 已执行的检查

- 同 npm prebuild/build 的内容校验和 Next 生产构建通过，TypeScript 与 1185 页生成通过。本机没有 npm，直接使用同一 Node 运行脚本入口。
- 1 个路由归属断言测试通过，覆盖详情和相似前缀的边界。
- 新增导航组件、SiteHeader、路径函数和测试的 ESLint 通过。NotesProvider 原有 reload effect 触发 react-hooks/set-state-in-effect；使用 origin/dev 原文经 stdin 复查同样报错，本次没有新增该问题，未称全仓 lint 通过。
- IAB 1280×720：四个页面栏目，新闻详情、词条和 CSS 教程；直接刷新、键盘 Enter、浏览器前进后退、连续切换；笔记弹窗打开、Escape 和关闭按钮后正确恢复。过程中未编辑或创建笔记。
- 390×844：画布文档宽 390，滑块位于正确图标；笔记弹窗与返回星图后定位正常，恢复窗口后重新定位。首页导航在视口内，星图页面文档宽 392，未扩展为整站布局修复。
- 夜晚主题可见，随后恢复原亮色主题；控制台 error/warn 为空。证据在 [导航检查目录](../design/VBP-099-navigation/evidence/)。

未检查其他浏览器、真机触摸和系统减少动态设置；后者由媒体查询关闭动画。本次没有扩展整站回归。

## 集成、发布与回滚

[PR #489](https://github.com/Gyschuaner/VibePolaris/pull/489) 合入 dev `e0fca4e9e645bf1d284cc200f832cdb091e83101`，源码树与已验证功能提交一致。重启本机 3001 生产构建实例，真实浏览器检查画布活动入口和笔记弹窗关闭恢复，DP 批次 `local-dev-20261019-vbp099-e0fca4e9`。未部署远端 dev。限定测试计划 `18a9a19a-6b0e-41ca-a80e-b85b232d5c22` 已完成通过，BUG-5612F7CE 已回归关闭。

[PR #490](https://github.com/Gyschuaner/VibePolaris/pull/490) 将相同导航改动选入 main `a9de70c8288056eb7a3f55d0856b97ca313caac2`；未包含 dev 其他待发布文案。合并树 `d5a24ba835f107f07eee0f55da175cb0b27893f9` 与生产构建源码树一致，内容校验、TypeScript 和 1185 页生产构建再次通过。BuildID 为 `2lWPPSgZAyvlWPZfIKJBU`。生产发布沿用用户“检查没问题直接上线”的既有授权。

## 生产结果

2026-10-19 17:01:18（北京时间）部署至 `150.109.241.213`，入口为 <https://vibe.chuansgu.top/canvas>。

- 镜像 `vibepolaris:a9de70c8288056eb7a3f55d0856b97ca313caac2`，ID `sha256:a6c8cf0fb7c6bc6f2a8cec9dd5f91f27c8906a36008ac46c593e1650b6ceb202`。
- 9608 个文件逐项校验通过；SHA256 清单摘要 `f26e528c041deb0a2d162691d7a218abd245c3f34b5c3e00a98673a6ab066a18`。锁文件、依赖和服务配置沿用当前生产镜像。
- 发布目录 `/opt/vibepolaris/releases/20261019T090016Z-a9de70c8`。无外部网络容器中 `/canvas` 与 `/about` 预检通过，随后备份并切换；服务 healthy，首页、画布、新闻和关于均为 200，未登录对话接口仍为 401。
- 真实生产 IAB 1280×720：首页、画布、新闻和关于的栏目标记与滑块一致；刷新、浏览器前后退、笔记弹窗打开及 Escape 关闭后恢复画布均通过，控制台 error/warn 为空。没有创建、编辑或删除笔记。检查后恢复浏览器尺寸，保留线上画布。

首次部署尝试 `/opt/vibepolaris/releases/20261019T085605Z-a9de70c8` 被错误的预检条件拦下，未备份或切换现网。画布通过 Suspense 等待客户端导航参数，静态 HTML 不包含导航标记；原检查错误要求该标记。BUG-6B7FE19D 修正为检查画布 HTTP 与关于页服务端导航，同时保存失败信息；重试前核对镜像 revision 与文件清单标签，复用同一份镜像重新预检并通过。没有重建产品代码。

实际生产检查记录在计划 `b7cb75f1-a991-4f83-b121-1d647d3733ca`，截图为 `production-about.png`，状态与部署事实分别为 `production-checks.json`、`production-deployment.json`。

## 备份与回滚

备份目录 `/opt/vibepolaris/backups/20261019T090016Z-from-99017d6e`，目录权限 700、文件权限 600，包含旧 Compose、环境文件和 SQLite 在线备份。SQLite quick_check 为 ok，SHA256 为 `e15b41964ac07e9ec50b1e327220e02aa2684f7c1f23651100f9b86d56ea46dc`。继续使用 `vibepolaris_xiaobei_data` 数据卷。

```sh
sudo /opt/vibepolaris/releases/20261019T090016Z-a9de70c8/rollback.sh
```

该命令恢复之前健康的 `99017d6e0fec9e4e0aa632beedc5f2beb8739db6` 镜像与 current 指向，保留当前数据卷和浏览器内容。回滚脚本已检查语法；本次发布健康，未实际执行回滚。

当前 Mac 不存在指定的 D:/Obsidian/gysnote，记录保存在 DP 与 Git；没有产生正式飞书文档。primary checkout 中原有运维文档修改保留。
