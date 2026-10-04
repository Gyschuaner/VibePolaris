# VBP-074 · 网络基础与 HTTP 边界词条更新及生产发布记录

## 范围

本批按 `vibepolaris-concept-pages` Skill 完成十条已有技术栈词条：`firewall`、`ip-address`、`network-port`、`packet`、`url`、`hostname`、`dns-record`、`dns-resolver`、`cache-control`、`mime-type`。每条词条单独查阅公开原始资料、重写面向零基础读者的正文、建立段落级 Cite 映射、实现概念专属演示并逐条提交；十条完成后才统一进入 dev、main 和生产。没有把本地其他功能带入本批，也没有调用 ZCode CLI。

首图和主体演示按机制分别设计：防火墙按规则逐层放行或丢弃，IP 地址沿私网与公网路由换乘，端口把监听与暴露拆开，数据包在拆分、丢失和重组间移动，URL 把 fragment 留在客户端，主机名把 DNS、地址和 TLS 服务名对照，DNS 记录和解析器分别展示权威记录与递归缓存，Cache-Control 展示存储、fresh、revalidate 和 stale 分支，MIME 类型展示解析、纯文本、错误 JSON、压缩和边界参数。每页都保留失败或边界状态、键盘可操作步骤和 reduced-motion 规则。

## 逐条提交与审查

功能分支从 `origin/main` 创建：`feat/VBP-074-network-boundaries`。十条词条各自完成后保留独立提交；中间的资料、交互和事实修正也保持单条提交：

| slug | 主要提交 |
|---|---|
| `firewall` | `7eedc105`, `21e7ad64`, `352e6a03` |
| `ip-address` | `aaf61ecc` |
| `network-port` | `7831172c`, `8a33e662` |
| `packet` | `02cdb9f0`, `4d35ebc9` |
| `url` | `c3a31c4a`, `ebd089e6` |
| `hostname` | `492c2295` |
| `dns-record` | `6a30533d`, `4ba2d9dd` |
| `dns-resolver` | `3f76dc40`, `d9bcbaaa` |
| `cache-control` | `ff4b3361`, `8dca2784` |
| `mime-type` | `aabbbdc7`, `1b039f4f` |

唯一 review 子智能体 `/root/ai_stack_review` 逐条复核并最终 PASS。复核覆盖零基础追问、资料真实性、段落引用的 missing/orphan/duplicate、概念差异化演示、失败分支、稳定 DOM ID、桌面与 390px 布局、reduced-motion、构建和类型检查。审查中发现并修正了缓存实验把 `no-cache` 与验证请求混在同一响应行、以及 MIME 错误 JSON 仍显示成功图标的问题，修正后重新复核通过。

## 资料

每页研究台账记录至少四份实际阅读的标准或官方资料，并把来源映射到对应段落。防火墙页使用 NIST SP 800-41、AWS security groups、nftables 和 OWASP SCSVS；IP、端口和数据包页使用 RFC 791、RFC 8200、RFC 1918、RFC 3022、RFC 9293、RFC 768、RFC 6335、IANA registry、RFC 1191、RFC 8201 和 RFC 792；URL 与主机名页使用 RFC 3986、WHATWG URL/HTML、RFC 9110、RFC 9112、RFC 1035、RFC 1123、RFC 8499 和 RFC 9525；DNS 两页使用 RFC 1034、RFC 1035、RFC 2181、RFC 2308、RFC 8499 和 RFC 9520；缓存页使用 RFC 9111、RFC 9110、RFC 5861 和 RFC 8246；MIME 页使用 RFC 6838、RFC 2046、RFC 9110 和 WHATWG MIME Sniffing Standard。具体 URL 和段落锚点保存在 `content/zh/term-research/backend-data.json` 与 `lib/backend-boundary-sources.ts`。

## 验证

- `npm run build`：通过，生成 275 个静态页面。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- 合并后的 dev 树 `efece404db2dd814ff335b3097d09420ec3dc57c` 上重新构建；十条路由逐一返回 HTTP 200 并有正确 H1。
- dev 浏览器在 1280px 和 390px 检查无横向溢出、无重复 ID；Cache-Control 实验实际切到 `no-cache` 并显示 `304 Not Modified`。
- 生产 HTTPS 下十条词条、`/`、`/about`、`/sitemap.xml`、`/robots.txt` 均返回 HTTP 200；生产浏览器再次操作 Cache-Control 的 `no-cache → 304` 分支，390px `scrollWidth` 等于视口宽度，无重复 ID。

## Git、DP 与发布

- dev PR [#332](https://github.com/Gyschuaner/VibePolaris/pull/332) 合入 `dev`，合并提交 `efece404db2dd814ff335b3097d09420ec3dc57c`。
- DP dev deployment：`local-dev-20261004-vbp074-efece404`，对象 ID `59b9dbbe-7ff3-4b3b-b25e-cb142b9d2f9a`，地址 `http://127.0.0.1:3236`。
- 生产 PR [#333](https://github.com/Gyschuaner/VibePolaris/pull/333) 合入 `main`，生产提交 `6417a7e39d54cbb009db515f103afeada30b532b`。
- DP 生产 deployment：`deploy-vbp074-network-boundaries-prod-20261004`，对象 ID `d75c4b39-f761-423d-a787-948a6de079cb`，状态 `released`，关联需求 `VBP-074`。
- 生产地址：`https://vibe.chuansgu.top`。
- 当前 release：`/opt/vibepolaris/releases/20261004T124133Z-6417a7e3`；`/opt/vibepolaris/current` 已原子切换到该目录。
- 当前镜像：`vibepolaris:6417a7e39d54cbb009db515f103afeada30b532b`；`vibepolaris-web-1` 为 `running/healthy`。
- 回滚备份：`/opt/vibepolaris/backups/20261004T124133Z-from-ddad1da3`；上一版 release 为 `/opt/vibepolaris/releases/20261004T082603Z-ddad1da3`，旧镜像为 `vibepolaris:ddad1da30f4e7c2ef28870dc3369fa2043f8d572`。回滚使用备份的 Compose 和旧镜像恢复同名 `web` 服务，再将 `current` 指回旧 release；`vibepolaris_xiaobei_data` 持久化卷保持不变。

`D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此未创建空记录。
