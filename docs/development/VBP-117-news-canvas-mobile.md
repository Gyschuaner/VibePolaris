# VBP-117 新闻与知识画布移动适配

用户授权测试通过后直接上线。承接 VBP-116，沿用现有视觉与导航。负责人顾毅盛；DP 需求 VBP-117，缺陷 BUG-F34C42F9（额外页面滚动）、BUG-2C0AB5C1（节点连接点被简述遮挡）、BUG-1391BD7A（菜单被底部导航遮挡）。

手机新闻在列表和关联星图之间切换；1100px 及以下使用原生详情弹窗，正文部分可滚动、阅读按钮固定在面板底部。关闭后焦点回到所选新闻；读完返回新闻时恢复时间筛选、浏览方式和列表／页面位置。平板列表不少于 260px。桌面保留原有三栏详情。

画布第二个触点接管视图，按两指中点和间距缩放、平移，沿用 30%–200% 限制。首触点保留节点／连线的原始点击目标，第二触点进入画布捕获；抬起一指后保持手势占有，全部离开后才恢复节点操作。拖动连线取消或失焦时不提交草稿；节点拖动后的坐标与画布视图按原方式保存。没有新增依赖或改变存储格式、账号隔离和模型调用。

手机简述停靠底部，选中／新建节点位于面板上方；内容可纵向滚动。缩放、菜单、关闭和连接点扩大触区，缩小后连接点仍约 44px，节点文字优先接收点击。修复路由最小高度叠加底部导航造成的 64px 多余滚动。

本地 `npm run build` 通过；聚焦自检 4/4 通过，覆盖缩放中点与上下限、抬指／取消占有、第三触点接续及损坏的新闻位置缓存。真实浏览器 360×640、390×844、820×1180 检查新闻详情与阅读往返、列表／星图切换、节点拖动／点按连线、编辑保存和刷新保留。390px 新闻从列表深处阅读并返回，筛选仍为近三个月，前后 scrollY 均 6442.5；820px 列表宽 273px、星图宽 507px；360px 阅读按钮底边 629px，位于 640px 视口内。手机画布文档高度从 908px 修正为 844px，scrollY=0。只使用独立本地临时节点，没有修改生产用户数据或调用模型。

浏览器工具只提供鼠标、键盘与视口尺寸控制，没有多触点注入能力。双指算法通过自检，尚未执行真实手机／平板的双指手势与软键盘验证。最小真机复核：在空白画布和节点上分别放下第二根手指，捏合并平移；先抬一指再抬另一指，确认余指不拖动节点、不生成连线；随后单指选中、拖动、点两端连线，刷新后内容和位置保留。不得把算法自检或尺寸模拟写成真机手势通过。

DP Agent 专用模型登录过期，使用同一个官方 DP CLI 直接记录。本机未找到飞书 CLI，未创建飞书正式文档或虚构索引。指定 Obsidian `D:/Obsidian/gysnote` 不存在，跳过。保留与代码相关的验证和发布事实于本目录。

## 集成与发布

PR [#569](https://github.com/Gyschuaner/VibePolaris/pull/569) 合入 dev `edacd4a09b25876004953bfcc987fc9e9041c053`，与功能提交 `9d75d92df5683984720c9711e89bcae1e764d253` tree 一致。无远端 dev，本机 3136 运行同树优化构建 `pW-K3lEat8msl9OQ8OUy1`，手机新闻阅读返回与平板画布缩放、节点／连线保留通过，见 [dev 浏览器事实](VBP-117-news-canvas-mobile/dev-browser.json)。DP dev 计划 `62e655f0-532e-4e41-aec5-52021ee6dc46` 已完成，2/2 通过。

生产候选从 main 选择已集成提交，`4a17b405c46ba64c7b2685f2c7ed0495a5dfb0f8` 独立构建通过。PR [#570](https://github.com/Gyschuaner/VibePolaris/pull/570) 合入 main `93fe22c0d0a12e232f6ad4c4899b9d39ec681d7b`，tree 与候选一致；build `HDfmoDY85NOsh8A7C8XdT`。未打包 dev 的其他待发布内容。


首次生产部署于 2026-10-23 01:08（北京时间）完成，服务与权限健康检查通过，SQLite 在线备份 quick_check=ok，见 [首次发布事实](VBP-117-news-canvas-mobile/production-initial-release.json)。生产浏览器冒烟发现手机节点菜单末项被导航覆盖（BUG-1391BD7A），该次冒烟记为失败。两份临时节点通过平板布局清理，原有节点及坐标保留。

补发修复菜单的定位和最大高度，扣除底部导航空间，窗口变化时重新定位。PR [#571](https://github.com/Gyschuaner/VibePolaris/pull/571) 合入 dev `b40365070103782e9e8b7f7abba33720d36bd6b7`，与 `7aa3adf4ddedea3511f49bdf941afe708f5e68fc` tree 一致；本机 3136 优化构建 `-Wj3D_FOjbO2uHIpSOIan` 通过 390/360px 菜单及删除回归，见 [修正 dev 事实](BUG-1391BD7A-mobile-canvas-menu/dev-browser.json)。生产候选 `3bc38f78949d8adca7d9fbd5cb6d88c7c7fcf25e` 独立构建通过，PR [#572](https://github.com/Gyschuaner/VibePolaris/pull/572) 合入 main `ad8cd024490fb6f071a912bd34989569ada7a891`，tree 一致，build `oH3TBxTltSI2mFsZI8V75`。

补发于 2026-10-23 01:27:56（北京时间）部署成功，当前运行提交为 `ad8cd024490fb6f071a912bd34989569ada7a891`。镜像 healthy；首页、新闻及正文、画布、设置、会话 API 返回 200，匿名笔记和画布 API 返回 401。沿用 `vibepolaris_xiaobei_data` 数据卷，未启用补全扣费。发布目录 `/opt/vibepolaris/releases/20261022T171913Z-ad8cd024`，备份 `/opt/vibepolaris/backups/20261022T171913Z-from-93fe22c0`，SQLite 在线备份 quick_check=ok。构建缓存清理后服务器剩余 3.9GB；保留运行及回滚镜像和数据卷。详见 [发布事实](VBP-117-news-canvas-mobile/production-release.json)。

正式站复核：390×844 下新闻阅读入口高 48px、底边 831px，正文跳转及返回正常；820×1180 下列表宽 273px、详情宽 560px，无横向溢出。首次生产版本在近三个月列表深处阅读往返的 scrollY 均 6452.5，补发仅修改画布菜单。补发画布独立临时节点点按连线成功，390/360px 菜单底边分别为 772/568px，均位于导航顶边 780/576px 上方 8px；点击删除仍在 `/canvas`。临时节点和连线清理后刷新，仅保留原有节点，ID、标题和世界坐标不变。浏览器错误日志为空，见 [生产浏览器事实](VBP-117-news-canvas-mobile/production-browser.json)、[手机截图](VBP-117-news-canvas-mobile/production-news-phone.jpg) 和 [平板截图](VBP-117-news-canvas-mobile/production-news-tablet.jpg)。未上传游客数据或调用模型。

DP dev 计划 2/2、菜单回归计划 1/1、生产计划 `a84282b6-8a92-4de3-956a-a763c0b1523b` 最新执行 1/1 通过，均已完成；生产计划保留首次失败记录，3 个缺陷均关闭。生产部署记录为 `vbp117-production-ad8cd024`（ID `a265149a-f631-4f2b-ad09-cbc0f66ac513`）。构建与聚焦自检证据见 [build-checks.json](VBP-117-news-canvas-mobile/build-checks.json)。

## 回滚

整个 VBP-117 回退到发布前稳定版本 VBP-116（`93d16aa84098250d85a62e3c132a03019a790bef`）：

```sh
ssh co-agent-tencent 'sudo -n /opt/vibepolaris/releases/20261022T170010Z-93fe22c0/rollback.sh'
```

最新补发目录的 `rollback.sh` 只回到紧邻版本 `93fe22c0`，仍包含已知手机菜单问题。以上回滚脚本均沿用当前数据卷，不覆盖为旧备份；执行后检查镜像 healthy、公共页 200、匿名私有 API 401。备份仅在需要修复数据时按独立恢复流程使用。
