# VBP-124：代码块语言标签

用户希望代码块右上角显示语言名称，例如 CSS、Python。关联既有 VBP-103，研发、验收与 dev 集成负责人顾毅盛；任务 `e9f29b72-6763-4720-8302-e1d4ff6a4eab`。

画布共享 MarkdownDocument 读取围栏已有的 language 类，统一常见别名与大小写；未知语言显示原名称，未标注不猜测。标签位于代码 pre 之外，禁止选中且单独定位，代码保留横向滚动。CSS 为标签预留顶部空间。Mermaid 仍走原图表渲染，行内代码不受影响；没有新增依赖、检测语言或改写正文。语言类允许字符补充加号、井号与点，兼容 C++、C# 等常用围栏名称，其余清理规则不变。

`npm run build` 通过，BUILD_ID `pdcTjOPPKEJK4IYmuuSmm`。没有为这项低影响展示变更新增单元测试或执行全站检查。

真实 Chrome 操作独立 QA 账号和合成笔记：编辑预览、草稿阅读、文章阅读均有 CSS、Python、JavaScript、C++、C# 与未知语言标签；无语言围栏没有标签，行内代码及 Mermaid 图表正常。标签底部均在代码首行之上；长行横向滚动从 0 到 2940 px，标签横坐标保持 844.68 px。三种视图的全部代码 DOM 文本一致。导出 Markdown 去除既有节点元数据头后与 1,051 字符原稿完全相同。点击复制提示“已复制 Markdown”，工具自动读取剪贴板为空，未把该结果当作复制内容证据，内容保护依据为代码文本及实际导出比对。

[预览截图](VBP-124-code-language/preview.png) · [阅读截图](VBP-124-code-language/read.png) · [浏览器结果](VBP-124-code-language/browser.json)

验收用例 `0cc59bc2-ecad-479f-b14a-abb0ade62e85`，dev-local 计划 `8d3ab069-7c94-4a81-a6fb-3d4ce7aafa45`。仅操作隔离合成笔记，未修改个人生产画布。生产发布需本项明确授权。

[PR614](https://github.com/Gyschuaner/VibePolaris/pull/614) 已合入 dev `ee3ff10a3df4876c5ca628683ef22cd6f4bebd0e`，与实测构建全部非 docs 路径一致。dev-local 部署 `vbp-124-code-language-dev-20261027` 已记录；合并后真实浏览器刷新确认 9 个代码块、8 个标签与 Mermaid 图表，控制台无警告和错误。上述计划 completed，1/1 passed；任务 done，VBP-124 ready_for_release。

生产候选 `feat/VBP-124-production` 从当前 main 选择性应用本项变更，不包含 dev 的其他内容。候选源码 `0b3f3508c33809a8bc63eccadc33f11c985b5626` 再次构建通过，BUILD_ID `USqoCOBdt5nrcMS2X44Jp`，本机启动后预览标签一致，控制台无警告错误。随后获用户明确授权发布，实绩如下。

## 生产发布

用户明确授权“上线，备份并完成健康检查”。[PR615](https://github.com/Gyschuaner/VibePolaris/pull/615) 合入 main `9466849a5ba415a6a56fa15a19c8d291ea88fd08`，2026-10-27 11:12:08（Asia/Shanghai）发布生产。构建源与该提交全部非 docs 路径一致，镜像和实际 BUILD_ID 核对通过。容器 healthy，公开页及 session 为 200，匿名画布/笔记接口为 401；原持久卷与扣费关闭状态保留。

SQLite 在线备份 `/opt/vibepolaris/backups/20261027T030927Z-from-2e9bb624`，quick_check `ok`，SHA-256 `1891d7f56dbed5ba65b334cc872e2e37e6156edceacf0ab85bb9c6c5ae1b7791`。回滚执行 `/opt/vibepolaris/releases/20261027T030927Z-9466849a/rollback.sh`，恢复旧镜像并保留上线后的数据库；本次未执行回滚。

Chrome 新标签页只读复查生产既有笔记：CSS 阅读与编辑预览均有 2 个 CSS 标签，Python 阅读有 2 个 Python 标签，标签均位于代码首行之上，控制台无警告或错误。没有输入或改写个人正文，也没有切换原有用户编辑标签页。生产截图仅在本机私有临时目录保存，Git 仅保留匿名结果。

生产任务 `d352267b-5d18-48a6-9377-e5cde640b3d3` done，生产计划 `e8bc2b47-cad9-404a-872f-856bc606ee0a` completed，1/1 passed；部署批次 `vbp-124-code-language-production-20261027` 已记录。DP 录入测试时要求需求为 testing，因此按允许流转临时返回 testing 录入实际检查，再完成发布状态；没有重复执行检查或绕过条件。

[发布与备份事实](VBP-124-code-language/production-release.json) · [匿名浏览器结果](VBP-124-code-language/production-browser.json)。没有扩大为全站回归。

当前机器不存在规则指定的 D:/Obsidian/gysnote，跳过该库写入；没有新建正式飞书文档。
