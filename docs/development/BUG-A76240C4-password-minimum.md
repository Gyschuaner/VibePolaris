# BUG-A76240C4 密码最低长度调整为6位

按用户2026-10-20最新要求，注册和登录的HTML最短长度、注册提示、服务端认证规则及错误提示由15位同步改成6位，不增加字符组合要求。原密码哈希、账号、会话、云端画布和小北权限不迁移。

本次修改限于 `components/account/AccountProvider.tsx`、`lib/account/store.ts` 及现有账号测试。现有测试改用6位密码，并增加5位注册被拒绝的边界断言；4项账号测试通过，优化构建通过，dev BuildID为 `VbtXJdV0f4GFz3DYy5xrh`。

本机优化构建运行于 `http://127.0.0.1:3101`，使用独立临时数据库。真实IAB确认注册提示与minlength均为6；合成账号使用6位纯数字密码完成注册、退出、重新登录及退出，控制台无error。未触碰用户账号、邀请码或画布数据。截图见 [dev注册窗口](BUG-A76240C4-password-minimum/dev-register.png)。

DP关联需求VBP-102，Bug `BUG-A76240C4`，研发任务 `e705dbc0-da0f-44b8-b4b7-37f5defb0bfa`。发布与回滚的实际事实在生产检查后补齐。本机无指定的 `D:/Obsidian/gysnote`，记录保存在Git并关联DP。
