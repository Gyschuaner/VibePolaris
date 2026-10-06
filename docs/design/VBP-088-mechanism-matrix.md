# VBP-088 机制差异表：测试证据与安全边界

只重做本批十条首图与首屏编排，保留既有正文、主体 Lesson、段落锚点及来源映射。桌面回到标题旁的小型机制演示；手机按自然顺序排版。复用播放、暂停、推进、重播、离屏及后台暂停，不把十条画成同一个过程。

| 词条 / 读者疑问 | 初始对象 → 操作 → 可见证据 → 停止条件 | 特有构图与关键条件 | 已有正文依据 |
| --- | --- | --- | --- |
| regression-test：只改鉴权，为什么旧功能也要测？ | 鉴权绳结悬着三项旧行为 → 拉动改动并运行选集 → 登录和订单不变，后台原本 403 变 200 → 失败停住；漏掉历史风险则保持未验证 | 悬挂的行为标尺；切换是否纳入历史越权 | reg-change-trigger、reg-risk、reg-failure |
| test-case：“应该失败”怎样判？ | 密码重置执行单 → 固定过期令牌并写出预期 → 410、未消费、0 封与实际逐项对齐 → 清理后重跑；只有模糊句则无法判定 | 一张带缺口的执行单，证据填洞后盖章；切换明确/模糊预期 | case-fields、case-side-effect、case-result |
| mock：调用变了，业务没变，为什么红了？ | 结账对象与支付替身接缝 → charge 换成 authorize/capture → 业务仍 paid，旧 Mock 的 charge 计数为 0 → 两种证据分别留在画面 | 可拆的插接面与旁路调用记录；只换协作实现 | mock-state-behavior、mock-refactor、mock-fidelity |
| assertion：点完保存多久才算完成？ | 只执行一次保存，按钮仍隐藏 → 反复观察可见条件 → 目标出现才通过，始终隐藏则到期失败 → 断言停止且动作次数保持 1 | 聚焦镜与有限时间尺；切换目标是否在期限内出现 | assertion-web-first、assertion-retry、assertion-timeout |
| code-coverage：整行亮了，为什么仍漏 Bug？ | age>=18 && verified 的四格地图 → 先跑 TT，再补 TF → 行执行与输入组合分开，TF 暴露错误放行 → 行覆盖亮着，行为断言红着 | 二维条件棋盘；切换是否补 TF 用例 | coverage-lines、coverage-branches、coverage-limitation |
| api-testing：回执没错，为什么还查订单？ | 同一个创建意图与两本账 → 首次请求，再同键重试 → 响应 orderId 和订单数量同时留下证据 → 正常仍 1 行；缺少去重则 2 行失败 | 叠放请求印模和响应/状态双账；切换服务是否遵守示例幂等契约 | api-postcondition、api-retry-key、api-retry-boundary |
| least-privilege：机器人能发布就能删库吗？ | repo/Vibe 的 30 分钟授权票 → 用票尝试发布和越界删除，再让租约到期 → 必需发布可完成，删除被拒绝；到期后的新请求被拒绝 → 已完成发布仍保留 | 授权票剪出动作/资源/时间窗口；切换收窄/组织管理员 | least-actions、least-conditions、least-revoke |
| hashing：改一字，为什么整枚指纹都变？ | release.tar 固定样例与可信清单摘要 → 改一个字符后重算 → 32 字节摘要换形且不匹配 → 原文仍在，摘要没有还原入口 | 字节纸条和固定大小的指纹马赛克；摘要真实 SHA-256 固定输入，密码 KDF 留给主体 Lesson | hash-definition、hash-integrity、hash-password-boundary |
| input-validation：日期都合法，为什么还被拒绝？ | 两个可解析的账单日期 → 检查先后关系，再修正结束日期 → 逆序区间无法跨过比较尺，示例 422 且查询 0 次 → 修正后才允许继续；授权另行判断 | 双端日期尺及跨不过去的区间；只改结束日期 | iv-syntax-semantics、iv-400-422、iv-authorization |
| encryption-at-rest：偷了盘和拿到应用身份有何差别？ | 数据库/备份密文与边界外 KMS → 选择持有介质或有 grant 的身份 → 介质副本仍密文，有授权的应用读入明文 → 撤权阻止新解密，已读内存不倒退 | 存储抽屉、包裹的 DEK 和外置钥匙仓；切换攻击者持有的东西 | ear-dek-kek、ear-separation、ear-kek-boundary |

动画只承担机制可见证据；解释留在正文。每条先实现正确状态，再加入有限位移、翻转、填充或形变。每条单独提交；完成十条后交唯一 reviewer，完成构建与桌面/390px 浏览器验收再批量发布。暂无真实目标读者参与，模型审读不记为读者验证。

## 实施记录

- 十条首图已逐条接入 `TestSecuritySignatureHeroes.tsx`，每条分别保留自己的对象、切换条件和失败证据；原有正文 Lesson 与 Cite 锚点未移除。
- 独立提交顺序：`e33a5b51` regression-test、`3a3ebab4` test-case、`dc329408` mock、`9c67cb1e` assertion、`a71bb402` code-coverage、`08c331de` api-testing、`61d64e56` least-privilege、`143bb888` hashing、`d2a83e3b` input-validation、`05fc098b` encryption-at-rest；时序修正为 `70148b2a`。
- 文档与机制矩阵提交为 `779b2b56`。类型检查、结构审计和生产构建已通过；十条本地生产构建路由均返回 200，桌面浏览器推进交互均产生状态变化，1280px 无横向溢出。
- 内置浏览器当前没有可用的 390px viewport 能力，窄屏只完成 CSS 结构审查，未把未执行的窄屏实测写成通过；DP 测试计划已如实保留这个限制。
- 唯一 reviewer `/root/ai_stack_review` 已完成两轮复核并 PASS，无 P0/P1 阻塞；最后一轮确认十条机制首图、来源映射、路由注册和桌面行为均符合批次要求。
- dev PR [#375](https://github.com/Gyschuaner/VibePolaris/pull/375) 已合入，合并提交为 `d5042c8526b77c9e798421b2e7573adefef57c74`；合并提交的本地生产预览逐条打开十条路由均为 HTTP 200、单一 h1，安全边界演示推进后状态可见变化。DP deployment 记录待平台网络恢复后补写。
