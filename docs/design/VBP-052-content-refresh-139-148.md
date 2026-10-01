# 139–148 词条文案更新与上线记录 · VBP-052

本批按用户要求逐条修改，累计十条后统一发布。每个词条单独完成资料核对、ZCode reader/language 审读、主助手取舍、结构检查和提交；最后才把十个 slug 一次加入 `content/zh/published-terms.json`。范围是已有数据驱动词条的中文正文、边界、演示状态、测验提示和来源映射，其他功能保持在本地。

## 词条与逐条提交

| 编号 | slug | DP 任务 | 逐条提交 |
| --- | --- | --- | --- |
| 139 | prompt-injection | `e9d6e141-8268-4b4a-8b63-8f2c9c3202d5` | `a0574bf` |
| 140 | compiler | `6807d21a-ebe7-4b2c-b40c-38213686a985` | `f03db32` |
| 141 | interpreter | `99a4d31f-283d-4651-a071-ecf51bfc978b` | `1c87639` |
| 142 | transpiler | `23278005-3bf6-4c10-b203-d7037e477bdf` | `65df809` |
| 143 | build-tool | `1593a3be-b002-475c-bece-3ae38418f1fd` | `5bc86ee` |
| 144 | bundler | `680368bf-e9f5-477f-8e17-9a753525c118` | `3321b08` |
| 145 | dev-server | `f733a3a7-d345-4bb9-8601-3dacbf9ec861` | `267d48b` |
| 146 | hot-reload | `5a84c41b-4aee-4ac5-a8d5-07774ed74ecf` | `ef8bb1b` |
| 147 | hmr | `98826910-d0e0-4465-96a1-ff8e0c65dc3f` | `b158095` |
| 148 | dependency | `9a001096-b848-4d8f-95e5-a3377299a910` | `c79f0ce` |

`ba7217a` 是十条一起加入公开清单的批次提交；十条内容提交仍保持独立，公开清单没有在单条提交中提前放出。

## 内容与资料

本批按安全边界和前端工具链拆出不同主线：提示注入把来源标记、读取数据与工具权限分开；编译器把语法树、中间表示、目标代码和运行时执行分开；解释器说明源码到指令/字节码、状态更新和错误时机；转译器说明类型标注、源码到源码改写、source map 与运行时 API 垫片；构建工具说明依赖图、并行任务、失败阻塞和本机构建与部署的边界；打包器说明入口、静态/动态导入、主包与按需块；开发服务器说明 localhost 请求、按需处理、更新连接、代理和生产边界；热重载与 HMR 分别展示整页重建、模块级替换、dispose/accept 和失败回退；依赖说明直接/传递、开发/可选/运行用途、版本约束、锁文件和其他引用条件。

十条体验数据均保留独立场景，来源数组各为 4 份已实际阅读的公开来源。资料包括 NIST、OWASP、OpenAI 安全说明、间接提示注入论文、LLVM/GCC/ECMA/MDN、Python/ECMA-262/Lua、TypeScript/Babel/SWC、Vite/Make/npm/Bazel、Rollup/webpack/esbuild、Node.js HTTP、React Refresh、npm package.json、SemVer 和 Node Packages。逐条 URL、标签与正文映射保存在 `content/zh/term-experiences/ai-stack.json` 和 `content/zh/term-research/ai-stack.json`。

## ZCode CLI 协作证据

使用真实 ZCode CLI 入口 `/tmp/zcode-cli/zcode.cjs`，临时数据目录为 `/tmp/zcode-data`，模型配置为 `Qwen3.8-Flash-Next-FP8`。reader 和 language 会话均按当前仓库的 `vibepolaris-zcode-partner` 与 `humanizer-zh` 绝对路径派发，只读当前词条材料，不让 ZCode 修改仓库。

| slug | reader / language |
| --- | --- |
| prompt-injection | `sess_5160dc38-9bbf-471d-ae02-9b2a7cb405aa` / `sess_059d83d1-2e62-4934-896e-c90a6ff8e6cf` |
| compiler | `sess_1e967ffd-3836-451c-a0d2-d90adb9b3797` / `sess_fe8aa36b-3d78-40d3-bef7-956a0acfed6d` |
| interpreter | `sess_3081e368-a9e5-4cef-aa28-d3beeb6d6d01` / `sess_a653228a-6749-4797-afb3-cc0d278ed16b` |
| transpiler | `sess_9979bc56-eb02-4e22-9ff0-f7d50fc1d2bd` / `sess_ed432241-24fb-4d71-b5e7-ec8dfd499ddb` |
| build-tool | `sess_1512f2f6-e375-442b-899b-454a165a7a62` / `sess_b5341b8b-0b05-44ff-83f6-786d5a9c1879` |
| bundler | `sess_6b9750ea-6631-4ce0-906c-98c813eece11` / `sess_519fbdca-dfff-438a-a09c-2dcbf9de4a75` |
| dev-server | `sess_0e8e5ac7-ba4f-4258-a922-f022eb2d0f8e` / `sess_9a925987-1e3b-4951-aa1d-ea6fab331f3a` |
| hot-reload | `sess_dae943c2-29c3-445c-81ad-20b4b9869e95` / `sess_a4998425-e011-4282-b0a0-e29f2602764d` |
| hmr | `sess_87adbde7-e512-4b6f-bec7-1a87344d5270` / `sess_7bf653f6-e48e-4ca3-a87d-3792b513091f` |
| dependency | `sess_1ee892e9-a44a-47ff-afa4-7a852a5579e7` / `sess_bdfe5291-56d0-4c4a-88fd-9a14c245507c` |

reader 和 language 的输入是当前词条的读者可见文案与按阶段配对的状态材料，不是源码、研究资料或作者预期。reader 反馈推动了来源/权限、IR 与运行时、指令指针、source map、任务分支、动态导入、localhost、整页重载、HMR 回退和依赖版本等补充；language 复核统一了称呼、指代和技术限定。ZCode CLI 有两次短暂网络重试，最终均返回有效会话；模拟反馈只作为编辑线索，最终取舍由主助手按一手来源、schema 和页面状态完成。

## 本地验证

- `npm run build`：公开清单更新前通过，静态页 `137/137` 生成；加入十条公开清单后再次通过，静态页 `147/147` 生成，TypeScript 通过。
- 词条结构检查：十条批次演示均为 3 步；体验演示为 3–4 帧；每条体验来源 4 份、研究来源 URL 4 个；JSON、关系 ID、演示引用和唯一正确选项由构建 schema 校验通过。
- 十条路由通过 HTTP 200：`prompt-injection`、`compiler`、`interpreter`、`transpiler`、`build-tool`、`bundler`、`dev-server`、`hot-reload`、`hmr`、`dependency`。
- CUA 真实浏览器抽查：在本地 3003 端口打开提示注入，依次切到“恶意句子浮现”“权限闸门拒绝”“完成原任务”，最后状态显示工具拒绝且摘要继续；编译器切到“运行验证”，显示运行时执行目标代码并保留运行期错误边界。
- 390px 窄屏抽查提示注入页面，标题、正文、演示阶段切换、终态说明和底部阅读操作均可见，未发现横向溢出；验收后视口应恢复默认。
- 未执行真实目标读者测试；ZCode reader 是模拟审读，不能替代用户验收。

## 发布边界

本批已完成逐条内容、十条批量公开清单、构建和本地受影响交互验收。生产发布沿用既有新闻版本的生产叠加分支，待 main 合并后执行；生产提交、DP deployment、线上路由、版本镜像与回滚位置在发布完成后补录。
