"use client";

import { Archive, ArrowRight, ArrowsOutCardinal, ArrowCounterClockwise, Bell, Browser, Camera, CheckCircle, Clock, Cloud, Code, Database, DeviceMobile, FileArrowUp, Gear, GitBranch, Key, LockSimple, MapPinLine, Ruler, ShieldCheck, Stack, Target, TreeStructure, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { HeroShell } from "./FrontendInteractionSignatureHeroes";
import { useScene } from "./HarnessStoryScenes";
import styles from "./PlatformCssSignatureHeroes.module.css";

const safeAreaLabels = ["背景先铺到边缘", "读取动态 inset", "内容离开危险区", "旋转后重新计算"];

export function SafeAreaSignatureHero() {
  const scene = useScene(safeAreaLabels.length);
  const orientation = scene.step === 3 ? "landscape" : "portrait";
  const inset = scene.step === 0 ? 0 : scene.step === 1 ? 12 : scene.step === 2 ? 18 : 14;
  return <HeroShell scene={scene} title="安全区域怎样把内容从刘海和手势区移开" labels={safeAreaLabels} className={styles.platformHero}>
    <div className={styles.safeBoard} data-step={scene.step} data-orientation={orientation} style={{ "--safe-inset": `${inset}px` } as CSSProperties}>
      <div className={styles.safeLegend}><DeviceMobile size={18} aria-hidden="true" /><span>同一张全屏活动页</span><strong>{orientation === "portrait" ? "竖屏" : "横屏"}</strong></div>
      <div className={styles.safePhone}>
        <div className={styles.safeNotch} aria-hidden="true" />
        <div className={styles.safeScreen}>
          <div className={styles.safeBackdrop}><span>活动页</span><i>背景延伸到屏幕边缘</i></div>
          <div className={styles.safeContent}>
            <div className={styles.safeContentTop}><MapPinLine size={15} /><strong>订单 42</strong><small>{scene.step < 1 ? "贴近顶部" : "已避开危险区"}</small></div>
            <div className={styles.safeAction}><span>领取优惠券</span><b>{scene.step < 2 ? "容易贴边" : "可放心点击"}</b></div>
          </div>
          <div className={styles.safeGuides} aria-hidden="true"><span /><span /></div>
          <div className={styles.safeHome} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.safeProof} role="status">
        {scene.step < 2 ? <WarningCircle size={18} aria-hidden="true" /> : <ShieldCheck size={18} aria-hidden="true" />}
        <div><strong>{scene.step < 2 ? "危险边界仍可能碰到内容" : "关键内容跟着 inset 移动"}</strong><span>{scene.step === 3 ? "横屏后，左右边距重新取值" : scene.step === 0 ? "只铺背景，不代表控件安全" : `当前安全距离 ${inset}px`}</span></div>
      </div>
      <ArrowsOutCardinal className={styles.safeRotate} size={18} aria-hidden="true" />
    </div>
  </HeroShell>;
}

const lifecycleLabels = ["前台编辑草稿", "进入后台", "进程被回收", "重新打开恢复"];

export function AppLifecycleSignatureHero() {
  const scene = useScene(lifecycleLabels.length);
  const memoryStatus = scene.step === 0 ? "正在编辑" : scene.step === 1 ? "暂停" : "已释放";
  const diskStatus = scene.step === 0 ? "旧快照" : scene.step === 1 ? "已保存" : scene.step === 2 ? "唯一证据" : "恢复来源";
  return <HeroShell scene={scene} title="应用生命周期怎样决定草稿能不能回来" labels={lifecycleLabels} className={styles.platformHero}>
    <div className={styles.lifecycleBoard} data-step={scene.step}>
      <div className={styles.lifecyclePhone}>
        <div className={styles.lifecycleChrome}><DeviceMobile size={16} /><span>编辑页</span><b>{scene.step === 1 ? "后台" : scene.step === 2 ? "已关闭" : "前台"}</b></div>
        <div className={styles.lifecycleDraft}><span>草稿 · 周报</span><strong>{scene.step === 3 ? "17:40 的版本" : "17:38 的版本"}</strong><small>{scene.step === 0 ? "光标还在这里" : scene.step === 1 ? "暂停写入" : scene.step === 2 ? "内存不存在" : "从快照读回"}</small></div>
        <div className={styles.lifecycleCursor} aria-hidden="true" />
      </div>
      <div className={styles.lifecycleBridge} aria-hidden="true"><Clock size={17} /><span>{scene.step < 2 ? "运行状态" : "重新创建"}</span><i /></div>
      <div className={styles.lifecycleStore}>
        <div className={styles.lifecycleMemory} data-lost={scene.step >= 2}><Archive size={19} /><span>内存中的页面</span><strong>{memoryStatus}</strong><small>{scene.step >= 2 ? "进程结束后不存在" : "可能被系统暂停"}</small></div>
        <div className={styles.lifecycleDisk} data-restored={scene.step === 3}><Database size={19} /><span>持久化草稿</span><strong>{diskStatus}</strong><small>{scene.step === 3 ? "读回后重新建立页面" : "保存才会留下证据"}</small></div>
      </div>
      <div className={styles.lifecycleProof} role="status">
        {scene.step === 2 ? <WarningCircle size={18} aria-hidden="true" /> : scene.step === 3 ? <ArrowCounterClockwise size={18} aria-hidden="true" /> : <ShieldCheck size={18} aria-hidden="true" />}
        <div><strong>{scene.step === 2 ? "后台事件不是保险箱" : scene.step === 3 ? "恢复的是快照，不是原来的进程" : "把必须保留的内容写进持久化存储"}</strong><span>{scene.step === 0 ? "用户仍在编辑，先保存草稿" : scene.step === 1 ? "应用可以暂停工作，但不能假设永不被杀" : scene.step === 2 ? "内存里的光标和临时状态已经消失" : "重新创建后，用已保存数据重建页面"}</span></div>
      </div>
    </div>
  </HeroShell>;
}

const permissionLabels = ["用户先提出任务", "解释为什么需要", "系统给出选择", "按结果继续"];
type PermissionDecision = "allow" | "deny";

export function AppPermissionSignatureHero() {
  const scene = useScene(permissionLabels.length);
  const [decision, setDecision] = useState<PermissionDecision>("allow");
  const decisionLabel = decision === "allow" ? "允许相机" : "拒绝相机";
  const resetDecision = (next: PermissionDecision) => { setDecision(next); scene.seek(0); };
  return <HeroShell scene={scene} title="权限请求怎样从具体任务走到允许或替代路径" labels={permissionLabels} className={styles.platformHero}>
    <div className={styles.permissionBoard} data-step={scene.step} data-decision={decision}>
      <div className={styles.permissionChoice} role="group" aria-label="选择系统决定"><span>演示系统结果</span><button type="button" aria-pressed={decision === "allow"} onClick={() => resetDecision("allow")}>允许</button><button type="button" aria-pressed={decision === "deny"} onClick={() => resetDecision("deny")}>拒绝</button></div>
      <div className={styles.permissionTask}><Camera size={21} /><span>用户的任务</span><strong>拍照上传订单</strong><small>{scene.step === 0 ? "先有具体动作" : "不是一打开应用就询问"}</small></div>
      <div className={styles.permissionGate}><Gear size={20} /><span>权限闸门</span><strong>{scene.step < 2 ? "尚未决定" : decisionLabel}</strong><small>{scene.step === 1 ? "说明：只用于拍照，不上传相册" : "系统状态决定能否调用相机"}</small></div>
      <div className={styles.permissionResult}>
        <div className={styles.permissionSystem}><ShieldCheck size={18} /><span>系统对话框</span><b>{scene.step < 2 ? "等待请求" : scene.step === 2 ? "用户选择" : decisionLabel}</b></div>
        <div className={styles.permissionOutcome} data-visible={scene.step === 3} data-decision={decision}><span>{decision === "allow" ? "相机" : "文件选择"}</span>{decision === "allow" ? <Camera size={22} /> : <FileArrowUp size={22} />}<strong>{scene.step === 3 ? (decision === "allow" ? "打开相机" : "改用文件上传") : "等待结果"}</strong>{scene.step === 3 ? <CheckCircle size={17} /> : null}</div>
      </div>
      <div className={styles.permissionProof} role="status"><span>结果证据</span><strong>{scene.step < 3 ? "尚未代表用户访问设备" : decision === "allow" ? "相机已获得本次所需访问" : "拒绝相机，任务仍有可用后路"}</strong><small>{scene.step === 0 ? "先解释当前动作需要什么" : scene.step === 1 ? "解释不是替系统做决定" : scene.step === 2 ? "允许与拒绝都会进入应用分支" : "拒绝不能被画成成功"}</small></div>
    </div>
  </HeroShell>;
}

const pushLabels = ["设备注册令牌", "服务器记住去处", "变化交给推送服务", "展示或清理失效令牌"];
type PushTokenState = "valid" | "stale";

export function PushNotificationSignatureHero() {
  const scene = useScene(pushLabels.length);
  const [tokenState, setTokenState] = useState<PushTokenState>("valid");
  const resetToken = (next: PushTokenState) => { setTokenState(next); scene.seek(0); };
  const stale = tokenState === "stale";
  return <HeroShell scene={scene} title="推送通知怎样把服务器变化送到正确设备" labels={pushLabels} className={styles.platformHero}>
    <div className={styles.pushBoard} data-step={scene.step} data-token={tokenState}>
      <div className={styles.pushChoice} role="group" aria-label="选择令牌状态"><span>令牌状态</span><button type="button" aria-pressed={!stale} onClick={() => resetToken("valid")}>有效</button><button type="button" aria-pressed={stale} onClick={() => resetToken("stale")}>已过期</button></div>
      <div className={styles.pushDevice}><DeviceMobile size={22} /><span>用户设备</span><strong>订单 42</strong><small>{scene.step < 3 ? "等待变化" : stale ? "没有可展示的通知" : "通知已到达"}</small><div className={styles.pushToken}><Key size={14} /><code>{stale ? "token_old…" : "token_42…"}</code></div></div>
      <div className={styles.pushCloud}><Cloud size={22} /><span>推送服务</span><strong>{scene.step < 2 ? "等待事件" : stale ? "返回失效" : "转发中"}</strong><small>{scene.step === 2 ? "FCM / APNs" : "只负责投递，不保证展示"}</small><ArrowRight className={styles.pushArrow} size={18} aria-hidden="true" /></div>
      <div className={styles.pushEvent}><Bell size={21} /><span>服务器事件</span><strong>{scene.step < 2 ? "订单状态变化" : "已发送：已发货"}</strong><small>{scene.step === 0 ? "还没有注册去处" : scene.step === 1 ? "服务器保存令牌" : "服务按令牌尝试投递"}</small></div>
      <div className={styles.pushProof} role="status"><span>最后一跳</span><strong>{scene.step < 3 ? "尚无展示证据" : stale ? "失效令牌应被清理并重新注册" : "系统权限允许后，通知才出现在设备上"}</strong><small>{scene.step === 3 && stale ? "服务器收到失败回执，不应继续重试旧令牌" : scene.step === 3 ? "点击通知后仍应回服务器核对最新订单" : "投递成功与用户看见是两件事"}</small></div>
      {scene.step === 3 ? <div className={styles.pushBadge} aria-hidden="true">{stale ? <WarningCircle size={17} /> : <CheckCircle size={17} />}</div> : null}
    </div>
  </HeroShell>;
}

const crossPlatformLabels = ["写一次业务规则", "分到平台边界", "各自调用能力", "检查共享是否越界"];
type CrossBoundary = "clean" | "leaky";

export function CrossPlatformSignatureHero() {
  const scene = useScene(crossPlatformLabels.length);
  const [boundary, setBoundary] = useState<CrossBoundary>("clean");
  const leaky = boundary === "leaky";
  const resetBoundary = (next: CrossBoundary) => { setBoundary(next); scene.seek(0); };
  return <HeroShell scene={scene} title="跨平台开发怎样共享规则而保留平台差异" labels={crossPlatformLabels} className={styles.platformHero}>
    <div className={styles.crossBoard} data-step={scene.step} data-boundary={boundary}>
      <div className={styles.crossChoice} role="group" aria-label="选择共享边界"><span>共享边界</span><button type="button" aria-pressed={!leaky} onClick={() => resetBoundary("clean")}>清楚</button><button type="button" aria-pressed={leaky} onClick={() => resetBoundary("leaky")}>越界</button></div>
      <div className={styles.crossCore}><Code size={21} /><span>共享核心</span><strong>{leaky ? "订单 + 相机权限" : "订单计算规则"}</strong><small>{leaky ? "把平台细节带进来" : "输入相同，规则相同"}</small></div>
      <div className={styles.crossSplit}><GitBranch size={18} /><span>{scene.step < 1 ? "等待分工" : "适配器分开"}</span><i /><i /></div>
      <div className={styles.crossPlatform}><DeviceMobile size={21} /><span>iOS 适配器</span><strong>{leaky ? "权限写死" : "相机 · 通知"}</strong><small>{scene.step < 2 ? "等待规则" : "调用系统能力"}</small></div>
      <div className={styles.crossPlatform}><DeviceMobile size={21} /><span>Android 适配器</span><strong>{leaky ? "权限写死" : "相机 · 通知"}</strong><small>{scene.step < 2 ? "等待规则" : "调用系统能力"}</small></div>
      <div className={styles.crossProof} role="status"><span>观察共享结果</span><strong>{scene.step < 3 ? "两端还没有完成一次动作" : leaky ? "改一个平台权限，可能牵动共享核心" : "业务规则保持一致，平台能力各自负责"}</strong><small>{scene.step === 0 ? "先把能共用的部分留在中心" : scene.step === 1 ? "差异在边界处分流" : scene.step === 2 ? "两端可以有不同系统 API" : "共享代码量不是唯一目标，边界更重要"}</small></div>
    </div>
  </HeroShell>;
}

const webviewLabels = ["网页发出请求", "宿主检查来源", "校验方法和参数", "允许或拒绝原生动作"];
type WebviewOrigin = "trusted" | "unknown";

export function WebviewSignatureHero() {
  const scene = useScene(webviewLabels.length);
  const [origin, setOrigin] = useState<WebviewOrigin>("trusted");
  const unknown = origin === "unknown";
  const resetOrigin = (next: WebviewOrigin) => { setOrigin(next); scene.seek(0); };
  return <HeroShell scene={scene} title="WebView 消息桥怎样把网页请求关在宿主边界内" labels={webviewLabels} className={styles.platformHero}>
    <div className={styles.webviewBoard} data-step={scene.step} data-origin={origin}>
      <div className={styles.webviewChoice} role="group" aria-label="选择网页来源"><span>页面来源</span><button type="button" aria-pressed={!unknown} onClick={() => resetOrigin("trusted")}>受信</button><button type="button" aria-pressed={unknown} onClick={() => resetOrigin("unknown")}>未知</button></div>
      <div className={styles.webviewPage}><Browser size={22} /><span>WebView 页面</span><strong>分享订单 42</strong><small>{unknown ? "https://陌生站点" : "https://shop.example"}</small><code>postMessage({`{ method: "share" }`})</code></div>
      <div className={styles.webviewBridge}><ShieldCheck size={21} /><span>宿主消息桥</span><strong>{scene.step < 1 ? "等待消息" : scene.step === 1 ? "检查 origin" : scene.step === 2 ? "校验 method + payload" : unknown ? "拒绝" : "允许"}</strong><small>{scene.step < 2 ? "网页不能直接调用原生 API" : "把请求翻译成有限能力"}</small><i /></div>
      <div className={styles.webviewNative}><DeviceMobile size={22} /><span>原生能力</span><strong>{scene.step === 3 && !unknown ? "系统分享面板" : "尚未打开"}</strong><small>{unknown && scene.step === 3 ? "来源不在白名单" : "只接收通过校验的请求"}</small>{scene.step === 3 ? (unknown ? <LockSimple size={18} /> : <CheckCircle size={18} />) : null}</div>
      <div className={styles.webviewProof} role="status"><span>宿主的证据</span><strong>{scene.step < 3 ? "原生动作还没有发生" : unknown ? "未知页面被挡在消息桥外" : "原生分享已被明确允许"}</strong><small>{scene.step === 0 ? "先看到网页请求，再谈是否执行" : scene.step === 1 ? "来源是权限边界的一部分" : scene.step === 2 ? "方法名和参数也需要白名单" : "网页展示与原生执行各负其责"}</small></div>
    </div>
  </HeroShell>;
}

const selectorLabels = ["先看一组节点", "加上 class 条件", "再加属性条件", "把命中交给层叠"];
const selectorSamples = [".notice", ".notice.alert", ".notice.alert[data-live]", ".notice.alert[data-live]"];
const selectorNodes = [
  { id: "nav", label: "nav", kind: "导航" },
  { id: "notice", label: "notice", kind: "普通提示" },
  { id: "alert", label: "notice.alert", kind: "错误提示" },
  { id: "live", label: "notice.alert[data-live]", kind: "实时错误" },
  { id: "footer", label: "footer", kind: "页脚" },
];

export function CssSelectorSignatureHero() {
  const scene = useScene(selectorLabels.length);
  const matches = scene.step === 0 ? ["notice", "alert", "live"] : scene.step === 1 ? ["alert", "live"] : ["live"];
  return <HeroShell scene={scene} title="CSS 选择器怎样从节点墙里找出匹配集合" labels={selectorLabels} className={styles.platformHero}>
    <div className={styles.selectorBoard} data-step={scene.step}>
      <div className={styles.selectorRule}><Code size={20} /><span>当前选择器</span><code>{selectorSamples[scene.step]}</code><small>{scene.step < 3 ? "只负责找元素" : "命中的元素还要继续参加层叠"}</small></div>
      <div className={styles.selectorLens}><Target size={20} /><span>匹配条件</span><strong>{matches.length} 个节点</strong><i /></div>
      <div className={styles.selectorNodes} role="img" aria-label={`当前选择器命中 ${matches.length} 个节点`}><div className={styles.selectorNodeTitle}><TreeStructure size={18} /><span>DOM 节点墙</span></div>{selectorNodes.map(node => <div key={node.id} className={styles.selectorNode} data-match={matches.includes(node.id)}><span>{node.label}</span><small>{node.kind}</small>{matches.includes(node.id) ? <CheckCircle size={16} /> : null}</div>)}</div>
      <div className={styles.selectorProof} role="status"><span>观察匹配结果</span><strong>{scene.step === 3 ? "只找到实时错误这一项" : `从五个节点收窄到 ${matches.length} 个`}</strong><small>{scene.step === 3 ? "颜色最终由层叠决定，不是选择器直接上色" : "改变一个条件，匹配集合就会改变"}</small></div>
    </div>
  </HeroShell>;
}

const boxModelLabels = ["只有内容区", "加上 padding", "包住 border", "切换尺寸起点"];
type BoxSizingMode = "content-box" | "border-box";

export function BoxModelSignatureHero() {
  const scene = useScene(boxModelLabels.length);
  const [sizing, setSizing] = useState<BoxSizingMode>("content-box");
  const resetSizing = (next: BoxSizingMode) => { setSizing(next); scene.seek(0); };
  const outside = sizing === "content-box" && scene.step >= 2 ? "234px" : sizing === "border-box" && scene.step >= 2 ? "200px" : "200px";
  return <HeroShell scene={scene} title="盒模型怎样把 width 拆成几层空间" labels={boxModelLabels} className={styles.platformHero}>
    <div className={styles.boxBoard} data-step={scene.step} data-sizing={sizing}>
      <div className={styles.boxChoice} role="group" aria-label="选择 box sizing"><span>尺寸起点</span><button type="button" aria-pressed={sizing === "content-box"} onClick={() => resetSizing("content-box")}>content-box</button><button type="button" aria-pressed={sizing === "border-box"} onClick={() => resetSizing("border-box")}>border-box</button></div>
      <div className={styles.boxStack}><div className={styles.boxMargin}><span>margin</span><div className={styles.boxBorder}><span>border</span><div className={styles.boxPadding}><span>padding</span><div className={styles.boxContent}><strong>内容</strong><small>width: 200px</small></div></div></div></div></div>
      <div className={styles.boxMeasure}><Ruler size={20} /><span>外框账单</span><strong>{outside}</strong><small>{scene.step === 0 ? "只有 content" : scene.step === 1 ? "padding 加在外面" : scene.step === 2 ? "border 也占空间" : sizing === "border-box" ? "width 已包含 padding + border" : "width 只指 content"}</small></div>
      <div className={styles.boxProof} role="status"><Stack size={18} /><div><strong>{scene.step < 3 ? "每一层都负责不同的空间" : sizing === "border-box" ? "总尺寸固定，内容区分配剩余空间" : "内容尺寸固定，外框继续向外长"}</strong><span>{scene.step === 3 ? "margin 仍在整个盒子之外，另算相邻间距" : "先分辨盒子内部和盒子外部"}</span></div></div>
    </div>
  </HeroShell>;
}
