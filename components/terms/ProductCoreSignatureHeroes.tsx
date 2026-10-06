"use client";

import { ArrowCounterClockwise, ArrowDown, ArrowRight, Browser, CheckCircle, Clock, Code, Envelope, Eye, FileText, GitBranch, Gauge, HardDrives, Key, Layout, LockKey, MagnifyingGlass, Package, Pause, Scissors, ShareNetwork, ShieldCheck, Stack, Tag, Target, WarningCircle } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./ProductCoreSignatureHeroes.module.css";

function Header({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return <div className={styles.header}><span>{eyebrow}</span><strong>{meta}</strong></div>;
}

function Result({ icon: Icon, title, detail }: { icon: typeof CheckCircle; title: string; detail: string }) {
  return <div className={styles.result} role="status"><Icon size={19} aria-hidden="true" /><span><strong>{title}</strong> · {detail}</span></div>;
}

function Frame({ ariaLabel, className, eyebrow, meta, labels, scene, children, result, caption }: {
  ariaLabel: string;
  className?: string;
  eyebrow: string;
  meta: string;
  labels: string[];
  scene: ReturnType<typeof useScene>;
  children: ReactNode;
  result: { icon: typeof CheckCircle; title: string; detail: string };
  caption: string;
}) {
  return <figure ref={scene.ref} className={`${styles.frame} ${className ?? ""}`} aria-label={ariaLabel} data-step={scene.step}>
    <Header eyebrow={eyebrow} meta={meta} />
    <SceneControls scene={scene} labels={labels} />
    {children}
    <Result {...result} />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function RuntimeSignatureHero() {
  const scene = useScene(4);
  const [environment, setEnvironment] = useState<"browser" | "node">("browser");
  const labels = ["放入代码", "选运行时", "对照能力", "停在边界"];
  const current = [
    { title: "代码还没有环境", detail: "同一张卡片，尚未执行", icon: Code },
    { title: environment === "browser" ? "浏览器接住它" : "Node.js 接住它", detail: environment === "browser" ? "DOM 插槽已打开" : "文件系统插槽已打开", icon: environment === "browser" ? Browser : HardDrives },
    { title: environment === "browser" ? "DOM 能力可用" : "文件能力可用", detail: environment === "browser" ? "document.querySelector()" : "fs.readFile()", icon: environment === "browser" ? CheckCircle : CheckCircle },
    { title: environment === "browser" ? "换 API 就会撞边界" : "换 API 就会撞边界", detail: environment === "browser" ? "fs 不在浏览器运行时" : "document 不在 Node 默认环境", icon: WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="运行时决定一段代码能够使用哪些环境能力" className={styles.runtime} eyebrow="代码带着环境一起运行" meta="same code · different runtime" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="运行时不是把代码重新写一遍，而是决定这次执行能拿到哪些宿主能力；换环境时，先找能力边界。">
    <div className={styles.runtimeControls} role="group" aria-label="选择运行环境">
      <button type="button" aria-pressed={environment === "browser"} onClick={() => { setEnvironment("browser"); scene.seek(1); }}><Browser size={15} />浏览器</button>
      <button type="button" aria-pressed={environment === "node"} onClick={() => { setEnvironment("node"); scene.seek(1); }}><HardDrives size={15} />Node.js</button>
    </div>
    <div className={styles.runtimeBoard} data-environment={environment} data-step={scene.step}>
      <div className={styles.runtimeCode}><span>同一段代码</span><code>readThing()</code><div><b data-enabled={environment === "browser" && scene.step >= 2}>document</b><b data-enabled={environment === "node" && scene.step >= 2}>fs</b></div></div>
      <ArrowRight className={styles.runtimeArrow} size={20} aria-hidden="true" />
      <div className={styles.runtimeHost}><div className={styles.runtimeHostTop}>{environment === "browser" ? <Browser size={20} /> : <HardDrives size={20} />}<strong>{environment === "browser" ? "Browser" : "Node.js"}</strong></div><div className={styles.runtimeSlots}><span data-open={environment === "browser" && scene.step >= 2}>DOM</span><span data-open={environment === "node" && scene.step >= 2}>文件系统</span></div><small>{scene.step < 2 ? "等待环境接入" : scene.step === 2 ? "能力已挂上" : environment === "browser" ? "fs → 不存在" : "document → 不存在"}</small></div>
    </div>
  </Frame>;
}

export function PackageSignatureHero() {
  const scene = useScene(4);
  const [resolution, setResolution] = useState<"range" | "lock">("lock");
  const labels = ["写下范围", "展开依赖", "盖上锁印", "隔天重装"];
  const current = [
    { title: "范围还没变成版本", detail: "A ^1.2.0 · 允许一段 1.x", icon: Package },
    { title: "直接依赖带出间接依赖", detail: "A → B → color-utils", icon: GitBranch },
    { title: "精确版本被记录", detail: "lockfile · integrity", icon: LockKey },
    { title: resolution === "lock" ? "同一棵树可重现" : "范围相同也可能换版本", detail: resolution === "lock" ? "color-utils 1.4.2" : "color-utils 1.5.0", icon: resolution === "lock" ? CheckCircle : WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="包管理把版本范围解析成可复现的依赖树" className={styles.package} eyebrow="范围不是一棵树，锁文件才是一次安装的快照" meta="range → tree → lock" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="package.json 说允许哪些版本，锁文件记录这次究竟装了哪些版本；它让安装可复现，却不替你判断依赖是否安全。">
    <div className={styles.packageControls} role="group" aria-label="选择安装是否使用锁文件">
      <button type="button" aria-pressed={resolution === "lock"} onClick={() => { setResolution("lock"); scene.seek(3); }}><LockKey size={15} />按锁文件</button>
      <button type="button" aria-pressed={resolution === "range"} onClick={() => { setResolution("range"); scene.seek(3); }}><Package size={15} />只按范围</button>
    </div>
    <div className={styles.packageBoard} data-resolution={resolution} data-step={scene.step}>
      <div className={styles.packageManifest}><span>package.json</span><code>A: ^1.2.0</code><small>允许范围</small></div>
      <div className={styles.packageTree}><span className={styles.treeLabel}>依赖树</span><div className={styles.treeRoot}>A <small>1.2.0</small></div><div className={styles.treeBranches}><b>B <small>2.0.1</small></b><b>color-utils <small>{resolution === "lock" ? "1.4.2" : "1.5.0"}</small></b></div><i className={styles.treeLine} aria-hidden="true" /></div>
      <div className={styles.packageLock} data-visible={scene.step >= 2 && resolution === "lock"}><LockKey size={20} /><strong>{resolution === "lock" ? "package-lock" : "再解析"}</strong><small>{scene.step >= 2 && resolution === "lock" ? "exact + integrity" : "没有精确印记"}</small></div>
    </div>
  </Frame>;
}

export function TypeScriptSignatureHero() {
  const scene = useScene(4);
  const [payload, setPayload] = useState<"valid" | "unknown">("unknown");
  const labels = ["收到未知值", "压过类型尺", "编译通过", "运行时再验"];
  const current = [
    { title: "外部数据没有类型承诺", detail: "payload: unknown", icon: FileText },
    { title: "类型尺要求先缩窄", detail: "typeof payload === 'object'", icon: ShieldCheck },
    { title: "静态检查通过", detail: "编译器只检查写出来的路径", icon: CheckCircle },
    { title: payload === "valid" ? "运行时形状匹配" : "运行时仍可能撞墙", detail: payload === "valid" ? "name 是字符串" : "name 实际是数字", icon: payload === "valid" ? CheckCircle : WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="TypeScript 的静态类型检查与运行时输入校验是两道不同的门" className={styles.typescript} eyebrow="类型尺能提前看见一部分错误" meta="static check ≠ runtime proof" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="TypeScript 的类型在编译检查里发挥作用；来自网络、文件或用户的值仍要在运行时验证，类型通过不等于数据已经可信。">
    <div className={styles.typescriptControls} role="group" aria-label="选择运行时输入形状">
      <button type="button" aria-pressed={payload === "unknown"} onClick={() => { setPayload("unknown"); scene.seek(3); }}><WarningCircle size={15} />未校验 JSON</button>
      <button type="button" aria-pressed={payload === "valid"} onClick={() => { setPayload("valid"); scene.seek(3); }}><CheckCircle size={15} />通过运行时校验</button>
    </div>
    <div className={styles.typescriptBoard} data-payload={payload} data-step={scene.step}>
      <div className={styles.typeSource}><span>源代码</span><code><b>type</b> Profile = &#123; name: string &#125;</code><code>const p: Profile = payload</code><small>编译器看到的约束</small></div>
      <ArrowDown className={styles.typeArrow} size={19} aria-hidden="true" />
      <div className={styles.typeRuntime}><div className={styles.typeRuntimeHead}><FileText size={19} /><strong>真实输入</strong></div><code>&#123; name: {payload === "valid" ? '"Lin"' : "42"} &#125;</code><div className={styles.typeGate}><ShieldCheck size={14} /><span>{scene.step < 3 ? "尚未校验" : payload === "valid" ? "shape ok" : "shape mismatch"}</span></div></div>
      <div className={styles.typeBadge} data-visible={scene.step >= 2}>{scene.step >= 2 ? "类型尺已移开" : "类型尺"}</div>
    </div>
  </Frame>;
}

export function MvpSignatureHero() {
  const scene = useScene(4);
  const [scope, setScope] = useState<"minimum" | "full">("minimum");
  const labels = ["写下假设", "选关键任务", "砍掉外围", "留下证据"];
  const current = [
    { title: "先写要验证的猜测", detail: "邀请码能被找到吗？", icon: Target },
    { title: "只保留一条关键任务", detail: "进入空间 → 找到邀请码", icon: Gauge },
    { title: scope === "minimum" ? "外围功能先留在桌上" : "功能太多，证据被摊薄", detail: scope === "minimum" ? "支付 · 多语言 · 分享" : "无法知道哪一项改变结果", icon: Scissors },
    { title: scope === "minimum" ? "任务留下可观察证据" : "还没学到关键答案", detail: scope === "minimum" ? "3/3 找到邀请码" : "完成 ≠ 验证假设", icon: scope === "minimum" ? CheckCircle : WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="MVP 通过缩小范围验证一个关键产品假设" className={styles.mvp} eyebrow="少做一点，是为了更快知道什么是真的" meta="hypothesis · task · evidence" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="MVP 的最小指的是验证范围，不是粗糙程度；留下关键任务和证据，才能知道下一轮该保留、修改还是放弃。">
    <div className={styles.mvpControls} role="group" aria-label="选择产品范围"><button type="button" aria-pressed={scope === "minimum"} onClick={() => { setScope("minimum"); scene.seek(3); }}><Target size={15} />一个假设</button><button type="button" aria-pressed={scope === "full"} onClick={() => { setScope("full"); scene.seek(3); }}><Gauge size={15} />完整愿望单</button></div>
    <div className={styles.mvpBoard} data-scope={scope} data-step={scene.step}>
      <div className={styles.mvpTarget}><Target size={22} /><span>本轮假设</span><strong>邀请码能找到</strong><small>判断：用户是否完成关键任务</small></div>
      <div className={styles.mvpChips} aria-label="功能筹码">{["入口", "邀请码", "支付", "分享", "多语言"].map((item, index) => <span key={item} data-keep={index < 2 && scene.step >= 1} data-extra={index > 1}>{item}</span>)}</div>
      <div className={styles.mvpEvidence}><span>证据槽</span><strong>{scope === "minimum" && scene.step >= 3 ? "3 / 3" : "—"}</strong><small>{scope === "minimum" && scene.step >= 3 ? "找到邀请码" : "等待可观察结果"}</small></div>
    </div>
  </Frame>;
}

export function UserFlowSignatureHero() {
  const scene = useScene(4);
  const [branch, setBranch] = useState<"success" | "expired">("expired");
  const labels = ["发出任务票", "打开入口", "遇到分支", "回到任务"];
  const current = [
    { title: "任务从一个真实入口开始", detail: "找回账号 · 邮件链接", icon: Envelope },
    { title: "入口把人带到当前任务", detail: "输入新密码", icon: ArrowRight },
    { title: branch === "expired" ? "票据过期，不把人丢在门外" : "票据有效，任务继续", detail: branch === "expired" ? "重新发送 → 原任务" : "验证通过 → 保存", icon: branch === "expired" ? Clock : CheckCircle },
    { title: branch === "expired" ? "恢复点保留了原任务" : "成功也要落到明确结果", detail: branch === "expired" ? "邮箱字段仍在" : "账号已恢复", icon: branch === "expired" ? ArrowCounterClockwise : CheckCircle },
  ][scene.step];

  return <Frame ariaLabel="用户流程把入口、分支和恢复点接成一条可回来的任务" className={styles.userFlow} eyebrow="画的是任务怎样回来，不是页面怎样排队" meta="entry · branch · recovery" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="用户流程要把失败也接回目标；过期链接是一次分支，重新发送后仍应回到原来的任务，而不是回到无关首页。">
    <div className={styles.userFlowControls} role="group" aria-label="选择用户流程分支"><button type="button" aria-pressed={branch === "expired"} onClick={() => { setBranch("expired"); scene.seek(2); }}><Clock size={15} />链接过期</button><button type="button" aria-pressed={branch === "success"} onClick={() => { setBranch("success"); scene.seek(2); }}><CheckCircle size={15} />链接有效</button></div>
    <div className={styles.userFlowBoard} data-branch={branch} data-step={scene.step}>
      <div className={styles.flowTicket}><Envelope size={20} /><span>入口票据</span><strong>找回账号</strong><small>邮件链接</small></div>
      <div className={styles.flowTurn}><div className={styles.flowGate}><span>{branch === "expired" ? "过期" : "有效"}</span><b>{branch === "expired" ? "重新发送" : "保存新密码"}</b></div><i className={styles.flowArc} aria-hidden="true" /><ArrowRight size={19} aria-hidden="true" /></div>
      <div className={styles.flowHome}><span>恢复点</span><strong>{branch === "expired" ? "继续输入" : "账号已恢复"}</strong><small>{branch === "expired" ? "原任务仍在" : "完成状态"}</small></div>
    </div>
  </Frame>;
}

export function WireframeSignatureHero() {
  const scene = useScene(4);
  const [visual, setVisual] = useState(false);
  const labels = ["遮住装饰", "摆内容块", "校对层级", "停在低保真"];
  const current = [
    { title: "先把视觉噪音盖住", detail: "只讨论结构和任务", icon: Layout },
    { title: "内容块占住真实位置", detail: "标题 · 金额 · 操作", icon: FileText },
    { title: "层级决定阅读顺序", detail: "先看什么，下一步在哪里", icon: CheckCircle },
    { title: visual ? "颜色抢回了讨论" : "结构证据足够，先停在低保真", detail: visual ? "视觉稿不能替结构验收" : "尚未承诺动效与响应式", icon: visual ? WarningCircle : CheckCircle },
  ][scene.step];

  return <Frame ariaLabel="线框图用低细节骨架验证内容层级和操作位置" className={styles.wireframe} eyebrow="先让页面站得住，再决定它长什么样" meta="content · hierarchy · action" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="线框图的低保真是一个讨论工具：它暴露内容、分组和操作的位置，却不替真实文案、响应式和动效做承诺。">
    <div className={styles.wireframeControls} role="group" aria-label="切换是否显示视觉装饰"><button type="button" aria-pressed={!visual} onClick={() => { setVisual(false); scene.seek(3); }}><Layout size={15} />只看结构</button><button type="button" aria-pressed={visual} onClick={() => { setVisual(true); scene.seek(3); }}><Eye size={15} />打开视觉稿</button></div>
    <div className={styles.wireframeBoard} data-visual={visual} data-step={scene.step}>
      <div className={styles.wireCanvas}><span className={styles.wireGrid} aria-hidden="true" /><div className={styles.wireBlock} data-slot="title"><small>标题</small><strong>订单详情</strong></div><div className={styles.wireBlock} data-slot="body"><small>内容</small><span>金额 · 条件 · 状态</span></div><div className={styles.wireBlock} data-slot="action"><small>操作</small><b>确认退款</b></div><div className={styles.wirePaint} aria-hidden="true" /></div>
      <div className={styles.wireRuler}><Layout size={20} /><span>结构刻度</span><strong>{scene.step >= 2 ? "标题 → 判断 → 操作" : "等待内容块"}</strong><small>{visual ? "颜色已进入" : "颜色暂不参与"}</small></div>
    </div>
  </Frame>;
}

export function PrototypeSignatureHero() {
  const scene = useScene(4);
  const [observation, setObservation] = useState<"pause" | "smooth">("pause");
  const labels = ["写下假设", "交给任务", "留下停顿", "决定下一轮"];
  const current = [
    { title: "先写一个可观察的猜测", detail: "用户能找到邀请码吗？", icon: Target },
    { title: "把真实任务交给假版本", detail: "加入朋友空间", icon: ArrowRight },
    { title: observation === "pause" ? "停顿是证据，不是噪音" : "顺利完成也只是一条观察", detail: observation === "pause" ? "2/3 在入口回看" : "3/3 完成", icon: observation === "pause" ? Pause : CheckCircle },
    { title: observation === "pause" ? "改入口，再测一轮" : "还要决定下一步证据", detail: observation === "pause" ? "把疑问带回设计" : "性能与真实后端尚未验证", icon: observation === "pause" ? WarningCircle : CheckCircle },
  ][scene.step];

  return <Frame ariaLabel="原型把一个假设交给真实任务，再把停顿变成下一轮证据" className={styles.prototype} eyebrow="原型不是成品缩小版，是一台观察机器" meta="hypothesis · task · evidence" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="原型只需要实现本轮要观察的行为；完成任务不等于上线，停顿、回看和错误路径才会告诉下一轮该改哪里。">
    <div className={styles.prototypeControls} role="group" aria-label="选择测试观察结果"><button type="button" aria-pressed={observation === "pause"} onClick={() => { setObservation("pause"); scene.seek(3); }}><Pause size={15} />记录停顿</button><button type="button" aria-pressed={observation === "smooth"} onClick={() => { setObservation("smooth"); scene.seek(3); }}><CheckCircle size={15} />顺利完成</button></div>
    <div className={styles.prototypeBoard} data-observation={observation} data-step={scene.step}>
      <div className={styles.prototypeHypothesis}><Target size={21} /><span>假设卡</span><strong>邀请码找得到吗？</strong><small>这轮只验证入口理解</small></div>
      <div className={styles.prototypeFilm}><span>任务胶片</span><div className={styles.filmFrames}><b data-seen={scene.step >= 1}>进入空间</b><b data-seen={scene.step >= 1}>找邀请码</b><b data-seen={scene.step >= 2} data-pause={observation === "pause"}>加入成功</b></div><small>{scene.step < 2 ? "观察中" : observation === "pause" ? "回看入口" : "完成任务"}</small></div>
      <div className={styles.prototypeEvidence}><span>观察台</span><strong>{observation === "pause" && scene.step >= 2 ? "2 / 3" : scene.step >= 2 ? "3 / 3" : "—"}</strong><small>{observation === "pause" && scene.step >= 2 ? "入口处停顿" : scene.step >= 2 ? "未发现停顿" : "等待测试"}</small></div>
    </div>
  </Frame>;
}

export function IaSignatureHero() {
  const scene = useScene(4);
  const [entry, setEntry] = useState<"task" | "team">("task");
  const labels = ["孤立内容", "贴任务词", "找到入口", "复用正文"];
  const current = [
    { title: "一张内容卡还没有去处", detail: "API 密钥 · 单一正文", icon: FileText },
    { title: "先贴用户会说的词", detail: "换 API 密钥", icon: Tag },
    { title: entry === "task" ? "任务入口能找到它" : "团队目录不一定是任务入口", detail: entry === "task" ? "搜索 → 账户安全" : "开发工具 → 迷路", icon: entry === "task" ? CheckCircle : WarningCircle },
    { title: "多入口指向同一份正文", detail: "不复制、不分叉", icon: ShareNetwork },
  ][scene.step];

  return <Frame ariaLabel="信息架构把内容卡和用户任务词连接成可预测入口" className={styles.ia} eyebrow="先听用户怎么找，再决定内容放哪" meta="task words · labels · one source" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="信息架构组织的是用户要完成的任务；同一篇内容可以有多个入口，但正文只维护一份，避免不同菜单说出不同结论。">
    <div className={styles.iaControls} role="group" aria-label="选择入口语言"><button type="button" aria-pressed={entry === "task"} onClick={() => { setEntry("task"); scene.seek(2); }}><Tag size={15} />用户任务词</button><button type="button" aria-pressed={entry === "team"} onClick={() => { setEntry("team"); scene.seek(2); }}><ShareNetwork size={15} />团队目录词</button></div>
    <div className={styles.iaBoard} data-entry={entry} data-step={scene.step}>
      <div className={styles.iaCard}><FileText size={20} /><span>一份正文</span><strong>API 密钥</strong><small>只维护这一张卡</small></div>
      <div className={styles.iaTags}><span>领域</span><b data-active={scene.step >= 1}>账户安全</b><b data-active={entry === "task" && scene.step >= 1}>换 API 密钥</b><b data-active={entry === "team" && scene.step >= 2}>开发工具</b></div>
      <div className={styles.iaSearch}><MagnifyingGlass size={18} /><code>{entry === "task" ? "换 API 密钥" : "开发工具"}</code><small>{scene.step >= 2 ? entry === "task" ? "找到 → API 密钥" : "结果太宽，需补任务词" : "等待入口"}</small></div>
    </div>
  </Frame>;
}

export function DesignSystemSignatureHero() {
  const scene = useScene(4);
  const [token, setToken] = useState<"brand" | "contrast">("brand");
  const labels = ["定下 token", "织成组件", "同步实例", "留下治理"];
  const current = [
    { title: "先给重复决定一个名字", detail: "--action-color", icon: Layout },
    { title: "组件把规则织进去", detail: "Button · focus · disabled", icon: Stack },
    { title: token === "brand" ? "两个实例一起改变" : "对比 token 也能整体替换", detail: token === "brand" ? "CTA A + CTA B" : "contrast-safe pair", icon: CheckCircle },
    { title: "治理让改变可追踪", detail: "token v2 · migration note", icon: GitBranch },
  ][scene.step];

  return <Frame ariaLabel="设计系统把设计决定织成可复用组件并留下治理记录" className={styles.designSystem} eyebrow="组件只是织片，系统还要记住为什么这样织" meta="tokens · components · governance" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="设计系统把原则、token、组件、模式和治理放在同一套约定里；它让一致性可维护，也让迁移和例外有记录。">
    <div className={styles.designSystemControls} role="group" aria-label="选择设计 token"><button type="button" aria-pressed={token === "brand"} onClick={() => { setToken("brand"); scene.seek(2); }}><Layout size={15} />品牌 token</button><button type="button" aria-pressed={token === "contrast"} onClick={() => { setToken("contrast"); scene.seek(2); }}><CheckCircle size={15} />高对比 token</button></div>
    <div className={styles.designSystemBoard} data-token={token} data-step={scene.step}>
      <div className={styles.dsToken}><span>token</span><code>--action-color</code><strong>{token === "brand" ? "苔绿" : "深蓝"}</strong><small>一个决定，多个使用处</small></div>
      <div className={styles.dsLoom}><span>组件织片</span><div className={styles.dsThreads}><b data-on={scene.step >= 1}>Button / primary</b><b data-on={scene.step >= 1}>Button / quiet</b></div><div className={styles.dsInstances}><i data-on={scene.step >= 2}>保存</i><i data-on={scene.step >= 2}>继续</i></div></div>
      <div className={styles.dsGovernance}><GitBranch size={19} /><span>治理记录</span><strong>{scene.step >= 3 ? "v2 · 已迁移" : "待记录"}</strong><small>{scene.step >= 3 ? "旧 token → 新 token" : "谁能改、怎样发布"}</small></div>
    </div>
  </Frame>;
}

export function A11ySignatureHero() {
  const scene = useScene(4);
  const [outcome, setOutcome] = useState<"error" | "success">("error");
  const labels = ["进入页面", "沿 Tab 走", "提交表单", "回到结果"];
  const current = [
    { title: "焦点从可跳过链接开始", detail: "键盘用户知道现在在哪", icon: Key },
    { title: "每个控件都有顺序和名称", detail: "邮箱 → 密码 → 提交", icon: ShieldCheck },
    { title: outcome === "error" ? "错误不能只变红" : "成功也要有可读结果", detail: outcome === "error" ? "邮箱需要修正" : "账号已登录", icon: outcome === "error" ? WarningCircle : CheckCircle },
    { title: outcome === "error" ? "焦点回到问题处" : "焦点落到确认结果", detail: outcome === "error" ? "提示与字段相邻" : "状态被读到", icon: CheckCircle },
  ][scene.step];

  return <Frame ariaLabel="无障碍让焦点、名称、错误和结果沿同一条可操作路径保持可见" className={styles.a11y} eyebrow="无障碍是一条能被走完、读懂、修正的路" meta="focus · name · recovery" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="ARIA 只是语义工具之一；真正的无障碍还要让结构、键盘顺序、可见焦点、文字错误和恢复位置彼此接得上。">
    <div className={styles.a11yControls} role="group" aria-label="选择表单结果"><button type="button" aria-pressed={outcome === "error"} onClick={() => { setOutcome("error"); scene.seek(2); }}><WarningCircle size={15} />出现错误</button><button type="button" aria-pressed={outcome === "success"} onClick={() => { setOutcome("success"); scene.seek(2); }}><CheckCircle size={15} />提交成功</button></div>
    <div className={styles.a11yBoard} data-outcome={outcome} data-step={scene.step}>
      <div className={styles.a11yKeyring}><Key size={20} /><span>Tab 顺序</span><b>{scene.step === 0 ? "跳过" : scene.step === 1 ? "邮箱 → 密码" : scene.step >= 2 ? "提交 → 结果" : "—"}</b><small>焦点可见，名称可读</small></div>
      <div className={styles.a11yFields}><div data-focus={scene.step === 0}>跳过链接</div><div data-focus={scene.step === 1 || outcome === "error" && scene.step >= 3} data-error={outcome === "error" && scene.step >= 2}>邮箱 <small>{outcome === "error" && scene.step >= 2 ? "需要修正" : "name@example.com"}</small></div><div data-focus={scene.step === 1}>密码 <small>••••••</small></div><div data-focus={outcome === "success" && scene.step >= 3}>提交</div></div>
      <div className={styles.a11yFeedback}><span>反馈</span><strong>{outcome === "error" && scene.step >= 2 ? "邮箱格式不正确" : outcome === "success" && scene.step >= 3 ? "登录成功" : "等待结果"}</strong><small>{outcome === "error" && scene.step >= 2 ? "焦点回到邮箱，错误文字贴近字段" : outcome === "success" && scene.step >= 3 ? "结果有名称，不靠颜色单独表达" : "尚未提交"}</small></div>
    </div>
  </Frame>;
}
