# BUG-A76240C4 密码最低长度调整为6位

按用户2026-10-20最新要求，注册和登录的HTML最短长度、注册提示、服务端认证规则及错误提示由15位同步改成6位，不增加字符组合要求。原密码哈希、账号、会话、云端画布和小北权限不迁移。

本次修改限于 `components/account/AccountProvider.tsx`、`lib/account/store.ts` 及现有账号测试。现有测试改用6位密码，并增加5位注册被拒绝的边界断言；4项账号测试通过，优化构建通过，dev BuildID为 `VbtXJdV0f4GFz3DYy5xrh`。

本机优化构建运行于 `http://127.0.0.1:3101`，使用独立临时数据库。真实IAB确认注册提示与minlength均为6；合成账号使用6位纯数字密码完成注册、退出、重新登录及退出，控制台无error。未触碰用户账号、邀请码或画布数据。截图见 [dev注册窗口](BUG-A76240C4-password-minimum/dev-register.png)。

DP关联需求VBP-102，Bug `BUG-A76240C4` 已回归关闭，研发任务 `e705dbc0-da0f-44b8-b4b7-37f5defb0bfa`。本机无指定的 `D:/Obsidian/gysnote`，记录保存在Git并关联DP。

## dev集成

功能提交 `72d9ed78` 经 [PR #507](https://github.com/Gyschuaner/VibePolaris/pull/507) 合入dev，合并提交 `06776bc439fd61474d4e6160110f94aac931cbdd` 与已验证功能提交的Git树完全一致。合并后真实IAB重新检查注册提示与minlength均为6。集成环境为本机3101优化构建，并非远程dev；DP部署记录 `BUG-A76240C4-dev-20261020-06776bc4`（ID `eaf5a5dc-7af8-4a6b-b981-36da1467be2d`）。

## 生产发布与验证

从main单独提取本次修改，经 [PR #508](https://github.com/Gyschuaner/VibePolaris/pull/508) 合入main，运行提交 `364b103d24197d7d5193ee31575273d804326fd3`；生产候选 `01744605e08c75cfac8d40d2a0b73b343200c784` 与合并提交的Git树完全一致，优化构建通过。仅补充部署记录的后续提交不改变该运行版本。

2026-10-20 15:48:48（北京时间）在 `150.109.241.213` 发布完成：

- 发布目录 `/opt/vibepolaris/releases/20261020T074333Z-364b103d`，`current` 已切换，容器healthy。
- 镜像 `vibepolaris:364b103d24197d7d5193ee31575273d804326fd3`；BuildID `rR8bj8a7Di5gF1Zu6TXiU`。
- 9696文件的构建清单SHA-256 `6a62d254c2337f448f29aaee3cb2ff7980241782cd8f4d3273570c9060040352`；上传压缩包SHA-256 `3193733291fa1933411a4f7e065f5c7b0b86a3b42b3645d206ab5102bf28dbc0`，服务器核对一致。
- 发布前SQLite在线备份 `/opt/vibepolaris/backups/20261020T074333Z-from-ae9161ec`，SHA-256 `e3519379803c593be49cb9cb6d60f58e92f1790ca07923e1b8d059398ca40652`，`quick_check=ok`。配置备份在服务器以0600保存，不进入Git。
- 沿用 `vibepolaris_xiaobei_data` 持久卷，小北补全扣费保持关闭。

新镜像先用隔离网络及独立临时数据库检查5位拒绝、6位纯数字注册与再次登录、会话退出，再切换生产服务。正式站首页、画布、设置、关于及原有入口健康；匿名私有接口维持401。

生产另执行4项真实HTTP检查，确认5位密码返回400及最低6位提示、6位纯数字可注册、可再次登录、退出后会话为空。两个HTTP合成会话均退出。真实IAB确认注册提示与minlength=6，用另一个合成账号完成6位纯数字注册、退出、再次登录及退出，控制台无error；未上传游客画布，退出后原游客画布仍在。

证据：[生产HTTP检查](BUG-A76240C4-password-minimum/production-http.json)、[正式站注册窗口](BUG-A76240C4-password-minimum/production-register.png)、[发布事实](BUG-A76240C4-password-minimum/production-release.json)。DP生产部署记录 `BUG-A76240C4-production-20261020T074333Z`（ID `bbb97681-dc5f-49ec-830f-2aa30aea221a`）已发布。

需要回滚时执行 `sudo /opt/vibepolaris/releases/20261020T074333Z-364b103d/rollback.sh`，恢复 `vibepolaris:ae9161ec2134416a20d540d9e1c9da7e8dd0ecea` 及上一发布目录，保留最新数据库持久卷；不能以旧数据库备份覆盖上线后数据。脚本已生成、旧镜像已确认保留，本轮未执行回滚。回滚后的版本仍要求15位，因此本轮新建的6位密码账号在回滚期间不能重新登录。

发布后已移除本次331.8MB临时压缩包、约890MB构建目录及闲置构建缓存，构建元数据保留在当前发布的 `artifact-metadata/`。可用空间约4.8GiB，当前和上一版镜像保留，服务healthy；见 [产物清理事实](BUG-A76240C4-password-minimum/artifact-cleanup.json)。
