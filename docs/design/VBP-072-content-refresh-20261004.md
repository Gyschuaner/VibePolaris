# VBP-072：AI 工具链基础词条逐条升级

需求：`VBP-072` · `662d58ae-982c-42d7-ad23-c2636dc02794` · 第 052 批。研发任务：`d0e2ebff-f759-4994-8ab5-55bc114eeed6`。

本批按 `vibepolaris-concept-pages` Skill 逐条完成十条词条：

1. `compiler`
2. `interpreter`
3. `transpiler`
4. `build-tool`
5. `bundler`
6. `dev-server`
7. `hot-reload`
8. `hmr`
9. `dependency`
10. `semantic-versioning`

每条都重新研究当前公开原始资料，先写面向零基础读者的正文，再为该概念设计独立的机制演示；正文保留前提、过程、结果和边界，段落引用与来源一一对应。动画分别表现编译目标边界、运行时指针、源码转译、任务依赖图、模块加载边界、本地请求反馈、整页重载、模块级替换、依赖图与锁文件、版本段选择，未复用同一套卡片流程。唯一 review 子智能体 `/root/ai_stack_review` 逐条复核，十条最终均 PASS；没有调用 ZCode CLI。

## 独立提交

| slug | 最终提交 |
|---|---|
| `compiler` | `982c81e1` |
| `interpreter` | `d3931215` |
| `transpiler` | `9784fff7` |
| `build-tool` | `4b12258a` |
| `bundler` | `e5880740` |
| `dev-server` | `0e1288ec` |
| `hot-reload` | `f08d1bc0` |
| `hmr` | `18f2ade5` |
| `dependency` | `c50640f1` |
| `semantic-versioning` | `8e9de5e2` |

每条词条的研究台账、正文台账、路由和演示实现都在同一批功能分支中维护。中间修复也保持逐条提交，未把十条合并成一个编辑步骤。

## 验证

- `npm run typecheck` 通过。
- `npm run build` 通过，生成 265 个静态页面。
- `git diff --check` 通过。
- 本地生产构建下十条路由逐条用真实浏览器检查了桌面 1280px 和 390px；每页有 H1、主体和专属控件，`document.scrollWidth === innerWidth`。
- HMR 的接受/边界回退、依赖图删除边、Semantic Versioning 的 patch/minor/major 三分支均实际操作复查；失败与边界状态不会沿用上一轮结果。
- 生产域名十条路由和首页均 HTTP 200；生产浏览器再次检查十条页面的 H1、主体和 390px 无横向溢出。
- 没有把模拟读者审读写成真实用户试读结论。

## Git、DP 与发布

- 功能分支：`feat/VBP-072-toolchain`，从 `origin/main` 切出。
- dev PR [#326](https://github.com/Gyschuaner/VibePolaris/pull/326) 已合入，合并提交 `ec6402d3afe4a9a47ec07890867fd2af3d22b722`。
- main PR [#327](https://github.com/Gyschuaner/VibePolaris/pull/327) 已合入，生产提交 `0ea36fb272daa1313f17b16b4e01081384849159`。
- DP 生产 deployment：`deploy-vbp072-toolchain-prod-20261004`，对象 ID `be63da5f-77ec-4d11-be74-4cb8c8900e85`，状态 `released`，关联需求 `VBP-072`。
- 生产地址：`https://vibe.chuansgu.top`。
- 当前 release：`/opt/vibepolaris/releases/20261004T052352Z-0ea36fb2`；`/opt/vibepolaris/current` 已指向该目录。
- 当前镜像：`vibepolaris:0ea36fb272daa1313f17b16b4e01081384849159`；容器 `vibepolaris-web-1` 为 `running/healthy`。
- 回滚备份：`/opt/vibepolaris/backups/20261004T052352Z-from-c5ca5c80`；回滚 release 为 `/opt/vibepolaris/releases/20261004T020155Z-c5ca5c80`，旧镜像为 `vibepolaris:c5ca5c80fcdb5ee6dd98f25f7d55fc2b93979324`。回滚时恢复备份 Compose/元数据并将 `current` 指回旧 release，保留 `vibepolaris_xiaobei_data` 数据卷。

规则指定的 `D:/Obsidian/gysnote` 在当前 Mac 环境不存在，因此没有创建空记录。
