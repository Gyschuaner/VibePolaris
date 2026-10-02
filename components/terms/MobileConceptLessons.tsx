"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowCounterClockwise, Bell, Brain, Browser, Check, CheckCircle, Cloud, Code, Database, DeviceMobile, FileText, Gear, GitBranch, Key, Layout, LockSimple, Pause, Play, Plus, ShieldCheck, Stack, TreeStructure, User, WarningCircle, X } from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./ConceptArticle.module.css";

type Scene = ReturnType<typeof useScene>;

function FrameCopy({ scene, labels, title, text }: { scene: Scene; labels: string[]; title: string[]; text: string[] }) {
  return <><div className={styles.controlsWrap}><SceneControls scene={scene} labels={labels} /></div><div className={styles.layers} aria-live="polite">{title.map((item, index) => <div className={styles.layer} data-current={scene.step === index} key={item}><h3>{item}</h3><p>{text[index]}</p></div>)}</div></>;
}

function OfflineFirstLesson() {
  const scene = useScene(4);
  const [resolution, setResolution] = useState<"mine" | "server" | null>(null);
  const labels = ["断开网络", "写入本地", "恢复连接", "处理冲突"];
  const pending = scene.step >= 1 && !(scene.step === 3 && resolution);
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="离线优先笔记同步演示">
    <div className={styles.contract}>
      <div><FileText size={27} /><h3>正在编辑的笔记</h3><p>草稿先写进设备上的本地数据源，断网时仍能继续输入。</p><code>待同步：{pending ? "1 条修改" : scene.step === 3 && resolution ? "已处理" : "0 条修改"}</code></div>
      <div><Cloud size={27} /><h3>服务器版本</h3><p>{scene.step >= 2 ? "另一台设备也改过标题，需要明确选择保留哪一次。" : "断开时无法确认服务器有没有收到这次修改。"}</p><code>{scene.step >= 2 ? "服务器：周五 10:05" : "连接中断"}</code></div>
    </div>
    <div className={styles.resultFlow} aria-label="本地数据和同步队列的关系"><Database size={28} /><span>本地数据</span><ArrowRight size={19} /><span>{pending ? "待同步队列" : scene.step === 3 && resolution ? "已处理" : "编辑器"}</span><ArrowRight size={19} /><Cloud size={28} /></div>
    {scene.step === 3 && <div className={styles.choices} role="group" aria-label="选择冲突处理结果"><button type="button" aria-pressed={resolution === "mine"} onClick={() => setResolution("mine")}>保留我的修改</button><button type="button" aria-pressed={resolution === "server"} onClick={() => setResolution("server")}>采用服务器版本</button></div>}
    {scene.step === 3 && <p className={styles.inputExample}><strong>当前结果</strong>{resolution === "mine" ? "本地内容上传并成为新版本；队列已处理，仍要等待服务器确认。" : resolution === "server" ? "本地草稿被服务器版本覆盖；这次取舍已记录。" : "先选择一项处理冲突，队列暂时保持待处理。"}</p>}
    <FrameCopy scene={scene} labels={labels} title={["网络暂时不可用", "先保证本地可继续", "队列等待真正上传", "冲突必须由规则处理"]} text={["点击下一步后，笔记编辑器显示离线状态，但已输入的内容没有消失。", "本地数据库保存草稿和同步标记；这不等于服务器已经确认。", "恢复连接只让待同步操作有机会执行，队列仍要等待服务器响应。", "同一条笔记在两端都变过时，系统不能静默覆盖，应按版本或业务规则选择。"]} />
  </div>;
}

function AdaptiveLayoutLesson() {
  const scene = useScene(4);
  const [width, setWidth] = useState(390);
  const mode = width < 600 ? "single" : width < 900 ? "split" : "rail";
  const sampleWidths = [390, 720, 1000];
  const labels = ["窄窗口", "中等窗口", "宽窗口", "保留焦点"];
  useEffect(() => {
    if (scene.step < 3) setWidth(current => current === sampleWidths[scene.step] ? current : sampleWidths[scene.step]);
  }, [scene.step]);
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="自适应布局演示">
    <label className={styles.inputExample}>拖动窗口宽度（CSS px 教学示例）：<input type="range" min="320" max="1120" value={width} onChange={event => { const nextWidth = Number(event.target.value); setWidth(nextWidth); scene.seek(nextWidth < 600 ? 0 : nextWidth < 900 ? 1 : 2); }} /><code>{width}px</code></label>
    <div className={styles.contract} style={{ gridTemplateColumns: mode === "single" ? "1fr" : mode === "split" ? "1fr 1fr" : "180px 1fr 1fr" }}>
      <div><Layout size={27} /><h3>{mode === "single" ? "任务列表" : "主导航"}</h3><button type="button" aria-pressed="true" aria-label="当前选中的订单 42">订单 42 · 已选中</button><p>{mode === "single" ? "先完成当前任务，再回到列表。" : "导航关系改变，但当前任务仍可回到。"}</p></div>
      {mode !== "single" && <div><FileText size={27} /><h3>任务列表</h3><p>列表与详情同时可见，减少来回切换。</p></div>}
      <div><CheckCircle size={27} /><h3>任务详情</h3><p>订单 42 的详情仍然对应同一条记录，布局变化不会把它换成第一条。</p></div>
    </div>
    <FrameCopy scene={scene} labels={labels} title={["先让窄屏任务可完成", "空间变宽，关系重新安排", "宽屏增加并列信息", "布局变了，任务没有丢"]} text={["自适应布局根据可用窗口空间安排信息，不先猜手机还是平板型号。", "中等宽度可以把列表和详情并列，但仍围绕同一项任务。", "空间足够时再显示侧栏和更多上下文，内容不只是等比放大。", "重新布局后，键盘焦点和选中项应回到原来的任务控件。"]} />
  </div>;
}

function SafeAreaLesson() {
  const scene = useScene(4);
  const [shape, setShape] = useState<"flat" | "notch" | "landscape">("flat");
  const [adapted, setAdapted] = useState(true);
  const inset = shape === "flat" ? 0 : shape === "notch" ? 34 : 18;
  const labels = ["普通屏幕", "加入刘海和手势区", "旋转设备", "看错误对照"];
  useEffect(() => {
    if (scene.step === 0) { setShape("flat"); setAdapted(true); }
    if (scene.step === 1) { setShape("notch"); setAdapted(true); }
    if (scene.step === 2) { setShape("landscape"); setAdapted(true); }
    if (scene.step === 3) { setShape("notch"); setAdapted(false); }
  }, [scene.step]);
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="安全区域演示">
    <div className={styles.choices} role="group" aria-label="选择设备外形"><button type="button" aria-pressed={shape === "flat" && adapted} onClick={() => { setShape("flat"); setAdapted(true); scene.seek(0); }}>普通屏幕</button><button type="button" aria-pressed={shape === "notch" && adapted} onClick={() => { setShape("notch"); setAdapted(true); scene.seek(1); }}>刘海屏</button><button type="button" aria-pressed={shape === "landscape" && adapted} onClick={() => { setShape("landscape"); setAdapted(true); scene.seek(2); }}>横屏</button></div>
    <div className={styles.resultFlow} style={{ border: adapted ? "1px solid var(--line)" : "2px solid #c45454", borderRadius: 18, padding: shape === "landscape" && adapted ? "14px 24px 22px" : `${(adapted ? inset : 0) + 14}px 24px 22px`, background: adapted ? "var(--surface)" : "color-mix(in srgb,#c45454 9%,var(--surface))", position: "relative" }}><span style={{ position: "absolute", inset: 0, borderRadius: 18, borderTop: adapted && shape !== "landscape" ? `${inset}px solid color-mix(in srgb,var(--accent) 40%,transparent)` : undefined, borderLeft: adapted && shape === "landscape" ? `${inset}px solid color-mix(in srgb,var(--accent) 40%,transparent)` : undefined, borderRight: adapted && shape === "landscape" ? `${inset}px solid color-mix(in srgb,var(--accent) 40%,transparent)` : undefined, pointerEvents: "none" }} />{adapted ? <Layout size={27} /> : <WarningCircle size={27} />}<span>背景可铺满</span><ArrowRight size={19} /><ShieldCheck size={27} /><span>{adapted ? shape === "landscape" ? "侧边控件离开左右危险区 18px" : `标题和按钮离开危险区 ${inset}px` : "底部按钮固定 20px，被手势区盖住"}</span></div>
    <p className={styles.inputExample}><strong>当前安全值</strong>{shape === "landscape" && adapted ? <><code>env(safe-area-inset-left/right)</code> = 18px（本例 CSS px 教学值）</> : <><code>env(safe-area-inset-top/bottom)</code> = {inset}px（本例 CSS px 教学值）</>}；背景是否延伸到边缘，不决定内容是否可以贴边。</p>
    <FrameCopy scene={scene} labels={labels} title={["没有额外 inset", "内容需要动态内边距", "方向改变，值也会变", "固定边距造成遮挡"]} text={["普通矩形屏幕没有刘海或手势区，标题可以按页面自己的间距排布。", "系统提供安全边距后，关键内容读取这个值；背景仍可以画到屏幕边缘。", "横屏时危险区域可能转到左右两侧，页面需要重新计算四个方向。", "不读取安全值而固定 20px 时，底部按钮会被手势区盖住，不能把这条路径当作安全。"]} />
  </div>;
}

function AppLifecycleLesson() {
  const scene = useScene(4);
  const [saved, setSaved] = useState(false);
  const labels = ["前台编辑", "进入后台", "进程被回收", "重新打开"];
  const draft = scene.step >= 3 ? (saved ? "已恢复：周五发布说明" : "没有可恢复草稿") : "周五发布说明";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="应用生命周期与草稿恢复演示">
    <div className={styles.choices} role="group" aria-label="模拟保存时机"><button type="button" aria-pressed={saved} onClick={() => setSaved(true)}><Check size={16} />编辑时持久化（重启后可读）</button><button type="button" aria-pressed={!saved} onClick={() => setSaved(false)}>只等退出时保存</button></div>
    <div className={styles.contract}><div><FileText size={27} /><h3>当前草稿</h3><p>{draft}</p></div><div><Gear size={27} /><h3>{scene.step === 0 ? "前台 · 可编辑" : scene.step === 1 ? "后台 · 可能暂停" : scene.step === 2 ? "Android 回收 · Web 丢弃" : "重新创建"}</h3><p>{scene.step < 2 ? "页面仍可能有机会保存，但不能假设一定会继续运行。" : "回来时只能从已经持久化的状态尝试恢复。"}</p></div></div>
    <div className={styles.resultFlow}><User size={28} /><span>编辑</span><ArrowRight size={19} /><Stack size={28} /><span>{saved ? "持久化草稿" : "内存中的草稿"}</span><ArrowRight size={19} /><Browser size={28} /></div>
    <FrameCopy scene={scene} labels={labels} title={["变化发生在前台", "后台不是永久运行", "Android 与 Web 的回收方式不同", "恢复要读取已保存数据"]} text={["用户输入时就保存重要状态，比把全部希望放在最后一次退出更可靠。", "切到后台后，系统或浏览器可以暂停、冻结甚至回收页面。", "Android 进程可能被系统回收；Web 标签页可能被冻结或被浏览器丢弃，二者都不保证最后回调。", "本例从已持久化状态读取草稿；没有保存的内存状态不能凭空回来。"]} />
  </div>;
}

function AppPermissionLesson() {
  const scene = useScene(5);
  const [outcome, setOutcome] = useState<"allow" | "deny" | "blocked">("allow");
  const labels = ["提出任务", "解释用途", "系统决定", "继续或替代", "长期拒绝"];
  const state = scene.step < 2 ? "尚未请求" : outcome === "allow" ? "已允许" : outcome === "deny" ? "本次拒绝" : "不再询问";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="运行时权限请求演示">
    <div className={styles.choices} role="group" aria-label="选择系统授权结果"><button type="button" aria-pressed={outcome === "allow"} onClick={() => { setOutcome("allow"); scene.seek(2); }}>允许相机</button><button type="button" aria-pressed={outcome === "deny"} onClick={() => { setOutcome("deny"); scene.seek(2); }}>这次拒绝</button><button type="button" aria-pressed={outcome === "blocked"} onClick={() => { setOutcome("blocked"); scene.seek(4); }}>不再询问</button></div>
    <div className={styles.contract}><div><CameraIcon /><h3>拍照上传</h3><p>用户先点了需要相机的任务，应用说明用途后才提出请求。</p></div><div><Key size={27} /><h3>系统状态：{state}</h3><p>{outcome === "allow" ? "可以打开相机。" : outcome === "deny" ? "仍可选择文件上传。" : "只能引导用户到系统设置修改。"}</p></div></div>
    <FrameCopy scene={scene} labels={labels} title={["能力在任务中才出现", "先说明为什么需要", "权限由系统决定", "拒绝也要能完成任务", "长期拒绝走设置"]} text={["启动应用时不必先收集所有权限；先让用户看到自己的目标。", "用途说明应和当前动作相连，用户知道允许后会发生什么。", "应用只能发起请求，不能把自己的按钮当成系统授权。", "拒绝相机不应让整个上传任务无路可走，可以提供文件选择。", "永久拒绝后重复弹窗没有帮助，应给出设置入口和清楚的替代方案。"]} />
  </div>;
}

function CameraIcon() { return <Browser size={27} />; }

function PushNotificationLesson() {
  const scene = useScene(5);
  const [invalid, setInvalid] = useState(false);
  const labels = ["登记令牌", "提交消息", "网关投递", "设备展示", "点击核对"];
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="推送通知投递链路演示">
    <div className={styles.choices} role="group" aria-label="选择推送令牌"><button type="button" aria-pressed={!invalid} onClick={() => { setInvalid(false); scene.seek(0); }}>当前令牌</button><button type="button" aria-pressed={invalid} onClick={() => { setInvalid(true); scene.seek(2); }}>过期令牌</button></div>
    <div className={styles.resultFlow}><DeviceMobile size={27} /><span>{invalid ? "旧令牌" : "注册令牌"}</span><ArrowRight size={19} /><Database size={27} /><span>业务服务器</span><ArrowRight size={19} /><Bell size={27} /><span>{scene.step >= 3 && !invalid ? "系统通知" : "等待结果"}</span></div>
    <div className={styles.distinctions}><div><Bell size={25} /><h3>投递</h3><p>{invalid ? "网关返回令牌无效，服务器应清理映射。" : "FCM 或 APNs 接到服务器的消息。"}</p></div><div><CheckCircle size={25} /><h3>业务事实</h3><p>{scene.step === 4 && !invalid ? "点击后重新从服务器读取订单状态。" : "投递成功不等于用户已看到或点击。"}</p></div></div>
    <FrameCopy scene={scene} labels={labels} title={["令牌先登记", "服务器提交消息", "平台网关负责投递", "展示还受权限和系统策略影响", "点击后再核对事实"]} text={["注册令牌代表这次安装的投递地址，不是永久设备 ID。", "业务服务器把订单变化和目标令牌交给平台推送服务。", "FCM/APNs 处理平台之间的投递，应用服务器不直接画系统通知。", "用户关闭通知权限、设备离线或前台策略不同，展示结果都可能不同。", "关键订单状态仍应打开应用向服务器确认，通知只是一条提示。"]} />
  </div>;
}

function CrossPlatformLesson() {
  const scene = useScene(4);
  const [sharedCamera, setSharedCamera] = useState(false);
  const labels = ["共享规则", "接入平台能力", "错误地全共享", "放回适配器"];
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="跨平台代码边界演示">
    <div className={styles.contract}><div><Code size={27} /><h3>共享核心</h3><p>订单计算、数据校验和状态规则可以共用。</p><code>calculateTotal()</code></div><div><DeviceMobile size={27} /><h3>平台适配器</h3><p>{sharedCamera ? "相机实现被错误地塞进共享核心。" : "iOS 与 Android 各自翻译相机、通知和生命周期。"}</p><button type="button" onClick={() => setSharedCamera(!sharedCamera)}>{sharedCamera ? "移回平台边界" : "把相机移进共享核心"}</button></div></div>
    <div className={styles.resultFlow}><Code size={28} /><span>共享接口</span><ArrowRight size={19} /><GitBranch size={28} /><span>iOS / Android 实现</span><ArrowRight size={19} /><CheckCircle size={28} /></div>
    {sharedCamera && <p className={styles.inputExample}><strong>可观察失败</strong>共享核心开始依赖某个平台的相机 API，另一平台无法编译或只能加一层条件分支；共享比例需要退回到真实边界。</p>}
    <FrameCopy scene={scene} labels={labels} title={["先共享不依赖平台的规则", "平台能力通过接口接入", "全部相同会遇到边界", "把差异留在适配器"]} text={["跨平台不是复制一套屏幕，而是先找出业务规则和数据模型的共同部分。", "相机、权限、通知和生命周期通过平台通道或适配器接到共享接口。", "把平台 API 硬塞进共享核心，会把差异隐藏到编译、性能和行为错误里。", "共享代码与原生实现都要在真实平台上测试；统一接口不承诺统一体验。"]} />
  </div>;
}

function WebviewLesson() {
  const scene = useScene(4);
  const [tampered, setTampered] = useState(false);
  const labels = ["网页发消息", "校验来源", "调用原生能力", "拒绝篡改消息"];
  const accepted = scene.step >= 2 && !tampered;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="WebView 消息桥安全演示">
    <div className={styles.choices} role="group" aria-label="选择网页消息"><button type="button" aria-pressed={!tampered} onClick={() => { setTampered(false); scene.seek(0); }}>受信网页</button><button type="button" aria-pressed={tampered} onClick={() => { setTampered(true); scene.seek(2); }}>未知来源</button></div>
    <div className={styles.contract}><div><Browser size={27} /><h3>WebView 页面</h3><p><code>{tampered ? "https://ads.example" : "https://shop.example"}</code> 请求分享当前订单。</p></div><div><ShieldCheck size={27} /><h3>宿主检查</h3><p>{accepted ? "origin、方法和参数都符合约定。" : tampered ? "来源不在白名单，消息被拒绝。" : "等待校验，原生能力尚未调用。"}</p></div></div>
    <div className={styles.resultFlow}><Browser size={28} /><span>网页消息</span><ArrowRight size={19} /><ShieldCheck size={28} /><span>origin + 方法 + 参数</span><ArrowRight size={19} /><DeviceMobile size={28} /><span>{accepted ? "原生分享完成" : "无调用"}</span></div>
    <FrameCopy scene={scene} labels={labels} title={["网页只能发出请求", "宿主先检查边界", "通过后才调用原生", "不可信页面不能任意调用"]} text={["WebView 是原生应用里的网页容器，消息桥把网页请求交给宿主。", "宿主验证来源、允许的方法和参数形状；收到消息不等于应该执行。", "检查通过后，原生代码调用分享能力，再返回结构化结果。", "如果不可信页面也能调用任意原生方法，桥就会扩大网页的攻击面。"]} />
  </div>;
}

function CssSelectorLesson() {
  const scene = useScene(4);
  const [selector, setSelector] = useState("card");
  const matches = selector === "card" ? ["通知卡片", "订单卡片"] : selector === "notice" ? ["通知卡片"] : ["空集合"];
  const labels = ["匹配类", "增加关系", "加入状态", "进入层叠"];
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="CSS 选择器匹配与层叠演示">
    <div className={styles.choices} role="group" aria-label="选择 CSS 选择器"><button type="button" aria-pressed={selector === "card"} onClick={() => { setSelector("card"); scene.seek(0); }}>.card</button><button type="button" aria-pressed={selector === "notice"} onClick={() => { setSelector("notice"); scene.seek(1); }}>.list &gt; .notice</button><button type="button" aria-pressed={selector === "hover"} onClick={() => { setSelector("hover"); scene.seek(2); }}>.card:hover</button></div>
    <div className={styles.contract}><div><TreeStructure size={27} /><h3>DOM 树</h3><p><code>.list</code> 下面有通知卡片和订单卡片；选择器按节点、类、关系或状态筛选它们。</p></div><div><CheckCircle size={27} /><h3>匹配结果</h3><p>{matches.join("、")}。匹配成功只说明声明进入候选集合。</p></div></div>
    <div className={styles.resultFlow}><span className={styles.code}>.list &gt; .notice {"{"} color: red; {"}"}</span><ArrowRight size={19} /><span>匹配集合</span><ArrowRight size={19} /><span>{scene.step === 3 ? "再比较特异性和顺序" : "等待层叠"}</span></div>
    <FrameCopy scene={scene} labels={labels} title={["先按条件找元素", "关系会缩小集合", "伪类描述当前状态", "匹配不等于最终样式"]} text={["选择器描述哪些 DOM 元素符合条件，类选择器可以命中多个节点。", "子代关系要求元素直接位于指定父节点下，结构改变时匹配集合也会变。", ":hover 这类伪类描述交互或结构状态，同一元素可能在不同时间匹配。", "多个规则都命中后，浏览器还要按来源、层、特异性和顺序决定最终声明。"]} />
  </div>;
}

function BoxModelLesson() {
  const scene = useScene(3);
  const [boxSizing, setBoxSizing] = useState<"content-box" | "border-box">("content-box");
  const content = 240;
  const padding = 24;
  const border = 4;
  const borderBox = boxSizing === "content-box" ? content + padding * 2 + border * 2 : content;
  const labels = ["只有内容", "加上内边距和边框", "切换 box-sizing"];
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="CSS 盒模型尺寸演示">
    <div className={styles.choices} role="group" aria-label="选择盒模型算法"><button type="button" aria-pressed={boxSizing === "content-box"} onClick={() => { setBoxSizing("content-box"); scene.seek(1); }}>content-box</button><button type="button" aria-pressed={boxSizing === "border-box"} onClick={() => { setBoxSizing("border-box"); scene.seek(2); }}>border-box</button></div>
    <div className={styles.resultFlow}><span style={{ width: 120, padding: `${scene.step >= 1 ? 18 : 0}px`, border: `${scene.step >= 1 ? 3 : 0}px solid var(--accent-text)`, background: "var(--tint)", textAlign: "center" }}>内容 {content}px</span><ArrowRight size={19} /><span>border box = {borderBox}px</span></div>
    <div className={styles.contract}><div><Layout size={27} /><h3>盒子内部</h3><p>content 是文字或子元素所在区域；padding 是内容与边框之间的内边距。</p></div><div><Stack size={27} /><h3>盒子外部</h3><p>border 围住盒子，margin 在更外面，不会被 width 计入。</p></div></div>
    <FrameCopy scene={scene} labels={labels} title={["width 先指向内容区", "内边距和边框会占空间", "border-box 把它们算进指定尺寸"]} text={["先看 content，宽度 240px 只描述内容区，外层盒子还没有完整展开。", "content-box 下，左右 padding 和 border 叠加到 border box；margin 仍在盒子外。", "border-box 下，width 直接包含 content、padding 和 border，更容易让卡片保持指定外宽。"]} />
  </div>;
}

export function MobileConceptLesson({ slug }: { slug: string }) {
  switch (slug) {
    case "offline-first": return <OfflineFirstLesson />;
    case "adaptive-layout": return <AdaptiveLayoutLesson />;
    case "safe-area": return <SafeAreaLesson />;
    case "app-lifecycle": return <AppLifecycleLesson />;
    case "app-permission": return <AppPermissionLesson />;
    case "push-notification": return <PushNotificationLesson />;
    case "cross-platform-development": return <CrossPlatformLesson />;
    case "webview": return <WebviewLesson />;
    case "css-selector": return <CssSelectorLesson />;
    case "box-model": return <BoxModelLesson />;
    default: return null;
  }
}
