# VBP-102 头像入口与精简设置

## 行为与数据

未登录时右上角仅显示用户选定的第三版手绘挥手人物。原图为 `../design/VBP-102-avatar-settings/selected-reference.png`；通过内置 Image Gen 移除纸色背景、保持人物形状，生成 `public/images/ui/login-wave-v1.png`。网页使用 Next 内置图片优化的96px版本作为透明蒙版，随主题文字颜色显示，不以代码重画人物。

登录后显示主题色默认头像或用户上传的头像。悬停、键盘聚焦和点击均可展开下方设置入口；Escape收起并归还焦点。进入 `/settings` 前先等待画布草稿持久化。小屏使用品牌图形，保留全部导航入口与44px头像触控区。

设置页只包含头像更换、自动云同步和退出。同步偏好继续按账号和浏览器保存，沿用 `vp-canvas-account:<owner>:sync`，由全站账号Provider统一管理；设置页和画布读取同一份值，跨同源窗口通过storage事件更新。登录和打开同步开关均不自动上传游客画布，保存到账号仍需要在画布中确认。小北邀请码激活页与Markdown内的账号绑定窗口保留。补全扣费开关未改动。

头像先在浏览器将5MB内的PNG/JPEG/WebP/GIF/AVIF中心裁成128×128静态PNG，再发到受保护的 `/api/account/profile`。API检查同源、有效会话、请求创建时的账号围栏、JSON体积和PNG签名/尺寸/尾标记；不接受SVG、任意地址或客户端指定的账号ID。头像写入增量表 `account_profiles`，私有账号会话以no-store返回；不同账号隔离。上传失败保留原头像，恢复默认写入null。原账号、会话、小北账本、云画布与游客存储不重建。

## 已执行验证

- 优化构建通过，含内容校验、TypeScript及新增设置与头像接口；相关ESLint无错误。
- 账号专项4项断言通过，覆盖头像跨会话、恢复默认、格式体积校验、撤销会话以及原租户与小北行为。
- 8项真实HTTP检查通过：匿名401、跨源403、旧账号围栏403、头像写入/读取及no-store、其他账号隔离、拒绝SVG且保留原头像、恢复默认；合成会话均退出。证据 `../design/VBP-102-avatar-settings/evidence/http-avatar.json`。
- IAB完成注册、首次点击头像、设置导航、上传图片、刷新保留、恢复默认、同步开关及返回云画布的状态验证。390×844检查手机导航与设置布局；1093×737检查桌面页面。控制台未见error。
- 验收中发现并修复 `BUG-B351BA51`（焦点/点击反转关闭菜单）和 `BUG-F5A8B755`（小屏头像裁切），两项均经真实浏览器回归关闭。

DP需求VBP-102，研发任务 `37edcc29-0572-470b-975c-3b35be086abc`。dev限定计划 `6b428cde-3397-442a-bbc6-65a5199ace6f` 已通过；生产限定计划 `b5cabb89-9629-4083-a520-11600fc16418` 记录本次正式站冒烟。无新依赖；头像表为增量新增，回退旧镜像时保留当前SQLite持久卷，不能用旧备份覆盖新增用户数据。

## 集成与生产发布

功能提交 `881925d8c96c8b13ba6a1224e41285cc283f8825` 通过 [PR #503](https://github.com/Gyschuaner/VibePolaris/pull/503) 合入dev，合并提交 `1d2544a62e951d5dd8024323caac413a87ee5b5f`。本机优化构建运行于3101，实际浏览器确认游客头像入口和登录窗口；dev部署记录 `VBP-102-dev-20261020-1d2544a6` 指向本机集成环境，并非远程dev服务器。dev BuildID 为 `ah1IOzw04hQB16gRwTtln`。

生产分支仅从main提取本次头像和设置变更，未携带dev的其他未发布页面。[PR #504](https://github.com/Gyschuaner/VibePolaris/pull/504) 合入main，运行代码提交 `ae9161ec2134416a20d540d9e1c9da7e8dd0ecea`；本机生产候选 `4f291e3efa5c74d70af9f4bac95496ff61dd2b37` 与该提交的Git树完全一致，优化构建通过。发布档案后续提交只补充文档与证据，不改变这个运行版本。

2026-10-20 15:16:19（北京时间）发布至 `150.109.241.213`：

- 目录 `/opt/vibepolaris/releases/20261020T071152Z-ae9161ec`，`current` 已原子切换至此处。
- 镜像 `vibepolaris:ae9161ec2134416a20d540d9e1c9da7e8dd0ecea`；镜像ID `sha256:d88e3660c8c1e5dfd7f6b8c5685cfa64729ce81a037fb6f65de94f3769bbaa9e`。
- BuildID `NJo5lNoUJNoSZKdgZR6G7`；9696文件的构建上下文清单SHA-256 `a3af3a462dfc1dfc42f3713eda7eb2a8359a201fd7da76c3f58b5ab535b62967`。本机产物压缩包SHA-256 `4426a1611f6445e32c6488f5365b5f5048a0b24aab9ad9e0e6f967b5b2c7d1c3`，上传后核对一致。
- 发布前SQLite在线备份保存在 `/opt/vibepolaris/backups/20261020T071152Z-from-bae940a8`，备份SHA-256 `65587a06b8daebadf5b33d0bb267dece6dcaa36bdbe7a032e95f403af5c6d465`，`quick_check=ok`。配置备份以0600保存在服务器，不进入Git。
- 沿用 `vibepolaris_xiaobei_data` 持久卷；小北补全扣费保持关闭。

新镜像先在隔离网络、独立临时数据库中检查账号、头像、云画布权限及设置页，再更新生产容器。生产容器为healthy；首页、画布、设置、图标、新闻和关于均200，匿名私有接口维持401。正式站另执行8项真实HTTP头像权限/隔离检查，全部通过，两个合成账号会话均退出。

真实IAB使用独立合成账号完成首次点击头像展开菜单、进入设置、上传128px PNG、刷新确认保存、恢复默认、自动同步开关开/关和退出。未保存游客画布到该账号；退出后原游客画布仍在。浏览器控制台error为空；浏览器合成会话也已退出。证据：

- [生产发布事实](../design/VBP-102-avatar-settings/evidence/production-release.json)
- [生产HTTP检查](../design/VBP-102-avatar-settings/evidence/production-http-avatar.json)
- [正式站游客入口](../design/VBP-102-avatar-settings/evidence/production-guest-header.png)
- [正式站设置页面](../design/VBP-102-avatar-settings/evidence/production-settings.png)

DP生产部署记录 `VBP-102-production-20261020T071152Z`（ID `1ce12b1b-615f-484d-b74e-3153db5e6d61`）已发布；生产测试计划已完成，执行 `850dc0fd-3620-4032-bf06-2d71b0ef4393` 通过。三个相关Bug `BUG-B351BA51`、`BUG-F5A8B755`、`BUG-09F071AE` 均经实际回归关闭。

需要回滚时，在服务器执行 `sudo /opt/vibepolaris/releases/20261020T071152Z-ae9161ec/rollback.sh`。该脚本切回 `vibepolaris:bae940a8b7b92c5a68409d3968d06579eec74d23` 与前一发布目录，保留最新持久卷和用户数据；备份仅用于数据灾难恢复，不随应用回滚覆盖。脚本已生成、目标镜像已确认保留，本轮没有执行回滚。

## 用户授权的磁盘清理（BUG-09F071AE）

发布前先清除本次对话早先VBP-096/VBP-097留下的三个可再生构建目录，保留当时运行版本及回滚材料。VBP-102发布完成后，用户进一步明确要求清理无用镜像，此时根盘占用98%、可用1.5GiB。

核对全部容器的镜像引用及发布档案后，清理11个无容器引用的早期VibePolaris镜像标签；保留当前 `ae9161ec`、上一版 `bae940a8` 和再上一版 `0abfc0a3`。同时清除Docker闲置构建缓存、本次331.8MB临时压缩包和890.5MB构建上下文等可再生文件，构建元数据保存在当前发布的 `artifact-metadata/`。

按文件系统实际可用空间计算，共释放 `4,740,702,208` 字节（约4.42GiB）；可用空间增加至 `6,349,955,072` 字节（约5.91GiB，`df -h` 显示6.0G），占用降至90%。Docker缓存显示的7.094GB含共享层，不能与实际释放量相加。所有原运行容器的ID和运行状态保持，VibePolaris仍healthy；数据库卷、备份、其他项目镜像及其回滚标签未清理。

历史版本通过继承前一运行镜像叠加构建文件，部分旧层仍被保留镜像引用，因此删除旧标签并不等于释放其标称大小。本次只清理确定闲置内容，未改造构建流程、重建镜像或重启其他应用。清理清单、保留版本及前后空间见 [生产磁盘清理证据](../design/VBP-102-avatar-settings/evidence/production-disk-cleanup.json)。

当前Mac不存在指定的 `D:/Obsidian/gysnote`，跳过该库更新；与代码关联的实现及部署记录保存在Git，并通过DP关联。
