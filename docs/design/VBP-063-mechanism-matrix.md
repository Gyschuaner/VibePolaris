# VBP-063 · Git 工作流与分支协作机制差异

这批选择十个尚未完成的 Git 词条。每页共用阅读目录、引用和星图能力，但演示的对象、动作和可观察结果分别对应一个读者判断；不把 Git 命令堆成同一张流程图。

| slug | 读者要判断什么 | 初始对象 → 操作 → 证据 | 关键边界 | 资料组 |
| --- | --- | --- | --- | --- |
| `repo-commit` | 本地提交记录了什么 | 工作区差异 → 只暂存修复 → 创建提交；HEAD 出现新快照，远程不动 | 提交不是推送，也不包含未暂存改动 | Git Book recording changes；git-add；git-diff；git-commit；git-push |
| `branch` | 分支是不是复制了一份项目 | 共同提交 → 创建指针 → 两条线各自提交；指针分叉，文件内容随当前 HEAD 变 | 分支是引用，不是隔离权限；合并仍可能冲突 | Git Book branches；git-branch；git-switch；git-merge；git-rebase |
| `working-tree` | 文件保存后处在哪一层 | HEAD/index/工作树对齐 → 编辑一行 → 工作树变色；暂存和历史保持原样 | 工作树不是暂存区，也不是远程副本 | gitglossary；git-status；git-add；git-restore；Git Book recording changes |
| `staging-area` | 下一次提交会包含哪一块 | 两个 hunk → 只暂存修复 → 提交；格式改动仍在工作树 | index 保存候选内容，不是上传队列或备份 | git-add；gitglossary；git-diff；git-reset；Git Book recording changes |
| `diff` | 两个端点之间具体差了什么 | 选择工作树/index/HEAD → 切换端点 → 行级 hunk 改变；同一行可从未暂存变已暂存 | diff 解释内容差异，不证明意图、测试或业务正确 | git-diff；git-diff-files；git-diff-index；git-diff-tree；Git Book recording changes |
| `checkout-switch` | 切换会不会覆盖本地工作 | 目标分支 + 未提交冲突 → 尝试 switch → 闸门阻止；保存后再切换 | `switch` 切分支，`checkout` 还可恢复路径；不靠强制覆盖解决未知改动 | git-switch；git-checkout；git-restore；git-status；git-stash |
| `remote` | 本地引用和远程地址是什么关系 | origin/upstream 配置 → fetch 指定远程 → remote-tracking ref 前进；当前分支不动 | origin 只是名字，跟踪引用不是实时远程分支 | git-remote；Git Book remotes；git-fetch；git-push；git-pull |
| `clone` | 拿到项目后还缺什么 | full clone / shallow clone / ZIP → 查看内部结构 → `.git`、历史、origin 的差异可见 | clone 取得版本库，不安装依赖；ZIP 没有 Git 对象库 | git-clone；git-init；git-fetch；git-remote；Git Book getting a repository |
| `pull` | 同步远程会怎样改变当前分支 | fetch → 选择 merge 或 rebase → 当前历史分别出现合并节点或重放提交 | pull 不是只下载；配置决定集成方式，冲突需人工处理 | git-pull；git-fetch；git-merge；git-rebase；git-config |
| `fetch` | 先看更新是否等于采用更新 | 远程新增提交 → fetch → `origin/main` 前进、`main` 和工作树不动；比较区显示落后 | 获取对象和整合提交是两步；fetch 不替你解决冲突 | git-fetch；git-remote；git-log；git-diff；Git Book remotes |

正文研究记录在 `content/zh/term-research/base.json` 与 `content/zh/term-research/frontend-product.json`；每条五个来源，页面段落通过 `Cite` 映射到稳定锚点。
