# BUG-92799E7A Mermaid 编辑闪烁

关联 DP：VBP-103、BUG-92799E7A。连线功能 VBP-104 单独推进。

## 原因和修复

MarkdownDocument 内联声明的 pre 渲染器在每次正文变化时都是新组件类型，React 因此卸载图表。固定组件类型后，普通段落编辑不会触发 Mermaid effect。新增段落还可能改变 Markdown 块的 key，因此在当前浏览器内存中按源码保留最近 16 个成功 SVG，不写入持久化存储。实际修改图表源码时，保留上一张图直到新图完成；无效源码仍显示提示和源码，修正后恢复。

Mermaid strict 安全设置、SVG 图片隔离、350ms 输入防抖保持一致。

## 本地与 dev 验证

- 2026-10-20：npm run build 通过，BUILD_ID `yZG5IScD_tZ4-44atD8N7`。
- 本地独立 QA 数据库与优化构建，地址 http://127.0.0.1:3103；不是远端开发环境。
- 真实浏览器连续编辑普通段落、在图前插入段落：SVG src 与初始值完全相同，绘图占位未出现。
- 修改 Mermaid 节点文字：即时检查保留旧 SVG，完成后得到不同 SVG 且包含新文字。
- 无效图表类型：提示及源码正常；恢复有效源码立即复用图表。
- 阅读和编辑切换正常，浏览器控制台无错误。
- [编辑器截图](BUG-92799E7A-mermaid-stability/dev-editor.png)。

没有增加复刻组件实现的 mock 测试，以上检查直接覆盖已报告的组件生命周期问题。构建通过后仅执行必要的受影响交互和发布检查。

## 发布

2026-10-20 实际发布完成，PR515 进入 dev，PR516 选择性合并 main；生产提交 `ad03d3003f0a200c606544332ccbc9530725f6c9`，BUILD_ID `ToOqwu5d0P23u_Eb6lPrh`。

- 独立容器无网络、无凭据、无生产数据挂载启动检查通过；正式容器 healthy。
- 正式站根页、画布、设置、账号会话接口返回 200，未登录画布接口 401。
- 真实生产浏览器使用隔离 QA 账号，连续正文输入与图前新增段落三次均保留同一 SVG；无绘图占位或控制台错误。验证后退出账号，原访客画布未改动。
- 发布前在线 SQLite 备份 `/opt/vibepolaris/backups/20261020T090039Z-from-3def738d`，quick_check=ok；积分扣费仍关闭，持久卷保持不变。
- 回滚：在服务器执行 `sudo /opt/vibepolaris/releases/20261020T090039Z-ad03d300/rollback.sh`，回到 `3def738d` 镜像，保留最新持久化数据，不恢复旧数据库。
- 当前版本 `ad03d300` 与上个已验证版本 `3def738d` 镜像保留；更早且未被容器引用的4个 VibePolaris 镜像已清理。清理释放约18.7 GB；本次部署后可用约17 GB。其他项目镜像与所有数据卷未动。
- [生产截图](BUG-92799E7A-mermaid-stability/production-editor.png)、[发布事实](BUG-92799E7A-mermaid-stability/production-evidence.json)。

本机不存在项目规则指定的 `D:/Obsidian/gysnote` 库，研发记录保留在 Git 与 DP。
