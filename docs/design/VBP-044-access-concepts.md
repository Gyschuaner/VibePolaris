# VBP-044 · 负载均衡、认证与授权

第 028 批沿用 Harness 的阅读壳和引用方式；机制、首图与主体交互分别设计，避免复用同一套横向流程。

| 词条 | 要辨认的机制 | 操作与可见证据 | 边界 |
| --- | --- | --- | --- |
| 负载均衡 | 同一入口如何选可用实例 | 连续送请求、停用实例 → 计数与下一目标变化 | 分流不修复业务代码；全不健康时行为依产品配置 |
| 认证 | 凭据如何核验，后续请求如何沿用身份 | 匹配／不匹配凭据、访问 → 会话建立或 401 | 已登录不等于有资源权限；教学演示不收集密码 |
| 授权 | 已知用户能否对指定文档执行操作 | 换用户、文档、读取／修改 → 矩阵与允许／403 | 本例矩阵不等于完整 IAM；拒绝先于修改 |

## 来源与正文位置

以下资料均已打开正文核对。产品特性与本站教学简化已在对应段落分开说明，目标 ID 对应正文角标和书目摘录。

| 词条 | 已读资料 | 正文位置 |
| --- | --- | --- |
| 负载均衡 | NGINX, [Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html) | `balance-role`, `balance-round-robin`, `balance-affinity`：策略与会话亲和 |
| 负载均衡 | AWS, [Target groups for your Application Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html) | `balance-targets`：监听规则与目标组 |
| 负载均衡 | AWS, [Health checks for Application Load Balancer target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) | `balance-health`, `balance-fail-open`：健康阈值和全不健康时的行为 |
| 负载均衡 | Cloudflare, [Traffic steering](https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/) | `balance-steering`：池与端点健康参与分配 |
| 认证 | NIST, [SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html) | `auth-definition`, `auth-session`：认证器核验与会话 |
| 认证 | MDN, [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication) | `auth-challenge`：HTTP 挑战与重试 |
| 认证 | OWASP, [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | `auth-failure`：避免可枚举的错误提示 |
| 认证 | MDN, [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) | `auth-webauthn`：挑战与签名断言 |
| 授权 | OWASP, [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | `authorization-definition`, `authorization-default`, `authorization-every-request`：对象级检查与默认拒绝 |
| 授权 | AWS, [Policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-denyallow.html) | `authorization-policy`：允许、隐式拒绝与显式拒绝 |
| 授权 | Ferraiolo、Barkley、Kuhn · NIST, [RBAC reference implementation](https://csrc.nist.gov/pubs/journal/1999/02/a-rolebased-access-control-model-and-reference-imp/final) | `authorization-role`：角色组织权限 |
| 授权 | IETF, [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) | `authorization-status`：401 与 403 |

## 本批 review

- 不运行演示或打开补充区，正文仍交代定义、过程、边界和失败位置。标题陈述内容，重点加粗只用于定义或易混淆结论。
- 三页分别用实例计数、身份卡片、权限矩阵；未恢复旧测验、状态脚注或装饰性星星。交互输入变化会关闭旧结果，减少动态时保持可读和可操作。
- 每页 4 份已读来源，均有正文角标。NGINX、AWS、Cloudflare 的具体行为不被写成所有产品的通用保证；授权教学矩阵不冒充 IAM 规则。
- `npm run build` 通过，生成 112 个静态页面，其中 101 个词条。Chrome 本地预览确认轮询与停用、认证成功与失败、授权允许与拒绝；390px 下三页无横向溢出。生产未发布。
