# VBP-075 · 传输与 HTTP 应用边界词条更新及生产发布记录

## 范围

本批按 `vibepolaris-concept-pages` Skill 逐条重做十条已有词条：`tcp`、`udp`、`tls-handshake`、`response-body`、`response-header`、`cookie`、`cors`、`websocket`、`api-key`、`rbac`。每条先确认零基础读者的追问，再查阅至少四份规范或官方资料，独立编写正文、段落级 Cite 映射、失败/边界分支和概念专属演示；每条单独提交，十条完成后才合入 dev、main 和生产。本批未使用 ZCode CLI，按用户要求只使用唯一 review 子智能体 `/root/ai_stack_review`；其他本地功能和未授权改动没有带入发布。

首图的因果链分别是：TCP 的缺口与重传、UDP 的数据报边界、TLS 的身份确认与密钥建立、响应体的解码与解析、响应头的元数据控制、Cookie 的属性筛选、CORS 的浏览器读取闸门、WebSocket 的升级与帧生命周期、API key 的暴露与轮换、RBAC 的用户—角色—权限—对象范围。它们没有共用同一张请求流水线。

## 逐条提交与 review

| 词条 | 独立提交 | review |
| --- | --- | --- |
| `tcp` | `97c46f80` | PASS |
| `udp` | `fd11f578` | PASS |
| `tls-handshake` | `ecc5b23f` | PASS |
| `response-body` | `925371c9` | PASS |
| `response-header` | `862fd0b4` | PASS |
| `cookie` | `79d991a9` | PASS |
| `cors` | `5907cae3` | PASS |
| `websocket` | `0b1e282a` | PASS |
| `api-key` | `d8a4150d` | PASS |
| `rbac` | `ae1eb272` | PASS |

复审覆盖事实边界、来源可访问性、研究/批次/体验台账一致性、section 与段落 ID、Cite 映射、正常与失败分支、路由注册、响应式与 reduced-motion。API key 复审发现 AWS usage plans URL 在代码来源数组与两份台账中不一致，已统一 canonical URL 后重新 PASS。RBAC 首屏在真实浏览器中发现四节点横排过窄，改成两层授权链后重新构建并 PASS。

## 资料

十条的来源数组位于 `lib/transport-http-sources.ts`，研究记录位于 `content/zh/term-research/backend-data.json`，体验来源位于 `content/zh/term-experiences/backend-data.json`。每页的 Cite 只指向实际支持该段论断的来源：

- TCP：RFC 9293、RFC 5681、RFC 1122、IANA 端口注册表。
- UDP：RFC 768、RFC 1122、RFC 8085、IANA 端口注册表。
- TLS 握手：RFC 8446、RFC 9525、RFC 6066、MDN TLS。
- 响应体：RFC 9110、MDN HTTP messages、Response.json、204 No Content。
- 响应头：RFC 9110、RFC 9111、MDN HTTP headers、Retry-After。
- Cookie：RFC 6265、MDN Cookies、Cookie header、NIST SP 800-63B、OWASP Session Management。
- CORS：WHATWG Fetch、MDN CORS configuration、Preflight request、CORS missing header。
- WebSocket：RFC 6455、MDN client applications、MDN WebSocket、RFC 8441。
- API key：OWASP REST Security、Google Cloud API key best practices、AWS API Gateway usage plans、GitHub token docs。
- RBAC：NIST RBAC、NIST SP 800-162、OWASP Authorization、Microsoft Learn RBAC。

## 验证

- `npm run typecheck`：通过。
- `npm run build`：通过，生成 280 个静态页面。
- `git diff --check`：通过；三份 JSON 台账解析通过。
- 本地功能分支 `http://127.0.0.1:3237`：十条路由逐页打开，桌面首屏和互动状态可见；390px 十页 `scrollWidth === clientWidth === 390`。
- dev 合并提交 `54dae0c24d3cd77ebae85e3f971dc54ef87410e3` 在 `http://127.0.0.1:3238` 逐页打开十条路由通过，并记录 DP deployment `local-dev-20261004-vbp075-54dae0c2`。
- 生产合并提交 `c17654b4b47154f8942b8000b05aa6cff163e1ab` 上线后，十条 `/terms/<slug>`、`/`、`/about`、`/sitemap.xml`、`/robots.txt` 均 HTTP 200；生产浏览器桌面逐页可见页面根节点、H1 与 Cite，390px 十页无横向溢出，容器日志无应用错误。

## Git、DP 与生产

- dev PR [#335](https://github.com/Gyschuaner/VibePolaris/pull/335) 已合入，合并提交 `54dae0c24d3cd77ebae85e3f971dc54ef87410e3`。
- main PR [#336](https://github.com/Gyschuaner/VibePolaris/pull/336) 已合入，生产源提交 `c17654b4b47154f8942b8000b05aa6cff163e1ab`。
- 需求 `VBP-075` 已置为 `released`；研发任务 `e2861361-11b2-47d1-a439-86fb60fc177c` 已置为 `done`。
- DP dev deployment：`local-dev-20261004-vbp075-54dae0c2`，对象 ID `129cbf14-d72f-4897-b700-40a60e999641`。
- DP production deployment：`deploy-vbp075-transport-http-prod-20261004`，对象 ID `54c170c7-b2c7-4035-8ce9-986a0dbda930`，状态 `released`。
- 生产 release：`/opt/vibepolaris/releases/20261004T155510Z-c17654b4`；当前镜像 `vibepolaris:c17654b4b47154f8942b8000b05aa6cff163e1ab`；`vibepolaris-web-1` 为 `running/healthy`。
- 回滚备份：`/opt/vibepolaris/backups/20261004T155510Z-from-6417a7e39d54cbb009db515f103afeada30b532b`；上一版 release 为 `/opt/vibepolaris/releases/20261004T124133Z-6417a7e3`，旧镜像为 `vibepolaris:6417a7e39d54cbb009db515f103afeada30b532b`。回滚时恢复备份 Compose 和旧镜像，再将 `/opt/vibepolaris/current` 指回上一版 release；持久化数据卷保持不变。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此没有创建空记录。

