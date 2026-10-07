"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Browser,
  CheckCircle,
  CloudArrowDown,
  Code,
  Database,
  Eye,
  Gear,
  GitBranch,
  GridFour,
  Lightning,
  LinkSimple,
  LockSimple,
  MapPinLine,
  Package,
  Ruler,
  Scales,
  SpinnerGap,
  Stack,
  Target,
  TreeStructure,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./RenderingLayoutSignatureHeroes.module.css";

type Scene = ReturnType<typeof useScene>;

function SignatureFrame({ scene, title, labels, caption, children }: { scene: Scene; title: string; labels: string[]; caption: string; children: ReactNode }) {
  return <figure ref={scene.ref} className={styles.signatureHero} role="region" aria-label={title} data-step={scene.step}>
    <div className={styles.signatureHeader}><span>{title}</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.signatureCanvas}>{children}</div>
    <figcaption className={styles.signatureCaption} aria-live="polite"><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{caption}</p></figcaption>
  </figure>;
}

const flexLabels = ["先放入基准", "看到余量", "按比例伸展", "收回负空间", "允许换行", "换一条主轴"];
const flexCaptions = [
  "A、B、C 先把自己的基准尺寸放上同一条主轴。",
  "容器剩下的正空间还没有归属，浏览器先把这笔账标出来。",
  "grow 是分配比例：B 得两份，A 和 C 各得一份。",
  "空间变成负数，shrink 收回尺寸；内容有最小宽度时仍可能溢出。",
  "wrap 把项目分成两条 flex line，每条线仍沿自己的主轴结算。",
  "主轴转为 column，justify-content 的方向也跟着转，不再等于水平对齐。",
];

export function FlexboxSignatureHero() {
  const scene = useScene(flexLabels.length);
  const step = scene.step;
  const sizes = step === 2 ? [31, 38, 31] : step === 3 ? [27, 27, 27] : step === 4 ? [44, 44, 44] : [29, 29, 29];
  const flexStyle = (index: number): CSSProperties => step === 2
    ? { flexGrow: index === 1 ? 2 : 1, flexShrink: 1, flexBasis: "24%" }
    : step === 3
      ? { flexGrow: 0, flexShrink: 1, flexBasis: "42%" }
      : { flexGrow: 0, flexShrink: 0, flexBasis: "29%" };
  return <SignatureFrame scene={scene} title="一条弹性尺怎样结算空间" labels={flexLabels} caption={flexCaptions[step]}>
    <div className={styles.flexSignature} data-step={step} data-axis={step === 5 ? "column" : "row"}>
      <div className={styles.flexRuler}><span>主轴</span><i /><b>{step === 3 ? "−60px" : step === 1 || step === 2 ? "+120px" : step === 5 ? "480px 高度" : "480px"}</b></div>
      <div className={styles.flexTrack}>
        <div className={styles.flexFree} data-negative={step === 3}><span>{step === 3 ? "负空间" : step >= 2 ? "已分完" : "自由空间"}</span></div>
        <div className={styles.flexItems}>
          {sizes.map((size, index) => <div key={index} className={styles.flexItem} data-item={index === 1 ? "b" : "other"} style={flexStyle(index)}><strong>{String.fromCharCode(65 + index)}</strong><small>{step === 2 ? `${index === 1 ? 2 : 1} 份` : step === 4 ? "line" : `${Math.round(size * 4.8)}px`}</small></div>)}
        </div>
      </div>
      <div className={styles.flexAxisMark}><ArrowDown size={16} /><span>{step === 5 ? "主轴 ↓" : step === 4 ? "line 1 / line 2" : "主轴 →"}</span></div>
      <div className={styles.flexProof} role="status"><Ruler size={16} aria-hidden="true" /><strong>{step === 2 ? "grow 1 : 2 : 1" : step === 3 ? "shrink = 1" : step === 4 ? "flex-wrap: wrap" : step === 5 ? "flex-direction: column" : "flex-basis"}</strong><span>{step === 4 ? "C 落到下一条线" : step === 3 ? "先问最小内容" : "先算空间，再交给项目"}</span></div>
    </div>
  </SignatureFrame>;
}

const gridLabels = ["画出轨道", "放入卡片", "跨两格", "留下空位", "回填空位", "缩窄保下限"];
const gridCaptions = [
  "网格先有行号和列号，项目还没有盖住任何格子。",
  "A、B、C 按文档顺序进入下一块可用区域。",
  "A 跨两列，占据真实的两个 track，后面的项目必须绕开它。",
  "sparse 不回头，D 被推到下一行，留下一个看得见的空位。",
  "dense 允许后来的 D 回填空位，但 DOM 顺序没有改变。",
  "容器变窄后保住 minmax 下限，列数减少，内容不被压成细条。",
];

export function CssGridSignatureHero() {
  const scene = useScene(gridLabels.length);
  const step = scene.step;
  const cells = ["A", "B", "C", "D", "E", "F"];
  return <SignatureFrame scene={scene} title="一张二维座位表怎样放下卡片" labels={gridLabels} caption={gridCaptions[step]}>
    <div className={styles.gridSignature} data-step={step}>
      <div className={styles.gridLineLabel}><span>列线</span><b>1</b><b>2</b><b>3</b><b>4</b></div>
      <div className={styles.gridBoard} role="img" aria-label={`当前网格演示第 ${step + 1} 步`}>
        {cells.map(cell => <div key={cell} className={styles.gridCell} data-cell={cell.toLowerCase()} data-hidden={step === 0 || (step === 3 && cell === "E")} data-span={step >= 2 && cell === "A"} data-dense={step === 4 && cell === "D"}><strong>{step === 0 ? "·" : cell}</strong><small>{step >= 2 && cell === "A" ? "span 2" : step === 5 ? "min 120" : "1 cell"}</small></div>)}
      </div>
      <div className={styles.gridRowLabel}><span>行</span><b>1</b><b>2</b><b>3</b></div>
      <div className={styles.gridProof} role="status"><GridFour size={16} aria-hidden="true" /><span>{step === 3 ? "sparse · 空位保留" : step === 4 ? "dense · 回头填洞" : step === 5 ? "2 列 · implicit row" : step >= 2 ? "跨列先占轨道" : "auto-placement"}</span></div>
    </div>
  </SignatureFrame>;
}

const positionLabels = ["普通流", "保留原位", "找包含块", "钉在视口", "越过阈值"];
const positionCaptions = [
  "static 不接受偏移，卡片只是按文档顺序排队。",
  "relative 移动卡片，但原来的占位幽灵仍留在队列里。",
  "absolute 脱离普通流，top/right 以最近定位祖先为锚点。",
  "fixed 把参照换成视口，组件滚动时它不跟着普通流走。",
  "sticky 先占位，滚到 inset 阈值后才贴住滚动容器。",
];

export function PositioningSignatureHero() {
  const scene = useScene(positionLabels.length);
  const step = scene.step;
  const mode = ["static", "relative", "absolute", "fixed", "sticky"][step];
  return <SignatureFrame scene={scene} title="定位先找参照系，再移动盒子" labels={positionLabels} caption={positionCaptions[step]}>
    <div className={styles.positionSignature} data-mode={mode}>
      <div className={styles.positionViewport}><span className={styles.viewportLabel}>scroll container</span><div className={styles.positionLine}>标题</div><div className={styles.positionLine}>正文</div><div className={styles.positionAnchor}><MapPinLine size={15} /><span>anchor</span></div><div className={styles.positionGhost}><span>原位置</span></div><div className={styles.positionToken}><Target size={17} /><strong>{mode}</strong><small>{step === 0 ? "普通流" : step === 1 ? "自己的原位" : step === 2 ? "container" : step === 3 ? "viewport" : "threshold"}</small></div><div className={styles.positionLine}>下一段</div></div>
      <div className={styles.positionReadout} role="status"><span>偏移参照</span><strong>{step === 0 ? "没有" : step === 1 ? "自己的原位置" : step === 2 ? "最近定位祖先" : step === 3 ? "视口" : "滚动容器边界"}</strong><div className={styles.positionMeasure}><ArrowUpRight size={16} /><code>{step === 4 ? "top: 0 · sticky" : step === 0 ? "top/left 无效" : "inset: 16px"}</code></div><small>{step === 2 ? "没有 containing block，absolute 会继续向上找" : step === 4 ? "先在流里占位，再到阈值贴住" : "同一个 top，参照系不同，结果也不同"}</small></div>
    </div>
  </SignatureFrame>;
}

const breakpointLabels = ["宽屏呼吸", "开始拥挤", "记录失效", "提前切换", "小屏收束"];
const breakpointCaptions = [
  "同一组内容在宽屏上还有余量，暂时没有理由写断点。",
  "按钮间距开始变薄，压力出现了，但还没有改变规则。",
  "导航文字和操作项第一次互相抢位置，这条线来自内容。",
  "在碰撞前切到紧凑布局，断点改变规则而不是复制内容。",
  "小屏保留必要操作；如果流体布局够用，就停在这里。",
];

export function BreakpointSignatureHero() {
  const scene = useScene(breakpointLabels.length);
  const step = scene.step;
  const width = [960, 760, 640, 680, 360][step];
  const compact = step >= 3;
  return <SignatureFrame scene={scene} title="内容压力先出声，断点再改规则" labels={breakpointLabels} caption={breakpointCaptions[step]}>
    <div className={styles.breakpointSignature} data-step={step} data-layout={compact ? "compact" : "fluid"}>
      <div className={styles.pressureHeader}><span>可用宽度</span><strong>{width}px</strong><div className={styles.pressureMeter}><i style={{ width: `${Math.max(12, Math.min(100, width / 9.6))}%` }} /><b /></div><small>{step === 2 ? "内容失效线" : "还在观察"}</small></div>
      <div className={styles.pressureContent}><div className={styles.pressureNav}><span>产品</span><b>文档</b><b>示例</b><button type="button">开始使用</button></div><div className={styles.pressureBody}><strong>一段需要读完的标题</strong><span>真实内容决定什么时候需要换一条规则。</span></div></div>
      <div className={styles.pressureProof} role="status"><Scales size={16} aria-hidden="true" /><strong>{compact ? "规则已切换" : step === 2 ? "碰撞证据" : "流体布局"}</strong><span>{step === 2 ? "不是 768px 这个设备名字" : compact ? "同一份内容，换成紧凑排列" : "继续缩窄，直到内容给出证据"}</span></div>
    </div>
  </SignatureFrame>;
}

const mediaLabels = ["默认环境", "窗口变窄", "没有 hover", "少一点运动", "条件叠加"];
const mediaCaptions = [
  "基础规则先存在，查询还没有把任何声明拉进来。",
  "width 条件命中，只改变列数，内容和 DOM 仍是同一份。",
  "hover 条件退出，提示改为可见的按钮反馈。",
  "用户要求 reduced motion，非必要位移停下，但状态仍能读懂。",
  "多个条件各管一件事，可以叠加，不会复制一套页面。",
];

export function MediaQuerySignatureHero() {
  const scene = useScene(mediaLabels.length);
  const [reduced, setReduced] = useState(false);
  const [hover, setHover] = useState(true);
  const step = scene.step;
  const narrow = step >= 1;
  const noHover = step === 0 ? false : step >= 2 || !hover;
  const quiet = step === 0 ? false : step >= 3 || reduced;
  return <SignatureFrame scene={scene} title="环境信号怎样让 CSS 规则入场" labels={mediaLabels} caption={mediaCaptions[step]}>
    <div className={styles.mediaSignature} data-narrow={narrow} data-no-hover={noHover} data-quiet={quiet}>
      <div className={styles.mediaSignals} role="group" aria-label="调整环境信号"><button type="button" aria-pressed={narrow} onClick={() => scene.seek(1)}>width</button><button type="button" aria-pressed={!noHover} onClick={() => { setHover(value => !value); scene.seek(2); }}>hover</button><button type="button" aria-pressed={quiet} onClick={() => { setReduced(value => !value); scene.seek(3); }}>motion</button></div>
      <div className={styles.mediaMixer}><div className={styles.mediaDial}><span>环境</span><i data-on={!narrow}>wide</i><i data-on={narrow}>narrow</i></div><div className={styles.mediaDial}><span>输入</span><i data-on={!noHover}>hover</i><i data-on={noHover}>touch</i></div><div className={styles.mediaDial}><span>偏好</span><i data-on={!quiet}>motion</i><i data-on={quiet}>reduce</i></div></div>
      <div className={styles.mediaTarget}><div className={styles.mediaCards}><b>卡片 A</b><b>卡片 B</b><b>卡片 C</b></div><button type="button">{noHover ? "点开提示" : "悬停查看"}</button><span className={styles.mediaPulse}>{quiet ? "状态可见" : "轻微位移"}</span></div>
      <div className={styles.mediaRules} role="status"><Gear size={16} aria-hidden="true" /><span>{[narrow, noHover, quiet].filter(Boolean).length} 条条件命中</span><strong>{step === 4 ? "叠加规则" : "只更新它负责的属性"}</strong></div>
    </div>
  </SignatureFrame>;
}

const moduleLabels = ["画出依赖", "读取 live binding", "修改导出", "保留快照", "撞上 TDZ"];
const moduleCaptions = [
  "entry 依赖 greeting，greeting 依赖 settings；模块先形成依赖图。",
  "import 指向导出绑定，调用方读取的是同一个名字。",
  "settings 把 locale 改成 zh-CN，live binding 让调用方读到新值。",
  "如果先复制成普通变量，调用方仍保留 en-US 这张快照。",
  "循环本身不是禁区；初始化未完成时读取绑定，才会进入 TDZ。",
];

export function ModuleSignatureHero() {
  const scene = useScene(moduleLabels.length);
  const [mode, setMode] = useState<"live" | "copy">("live");
  const step = scene.step;
  const effectiveMode = step === 0 ? "live" : mode;
  const live = effectiveMode === "live" && step >= 2 && step < 4;
  const cycle = step === 4;
  const choose = (next: "live" | "copy") => { setMode(next); scene.seek(next === "copy" ? 3 : 0); };
  return <SignatureFrame scene={scene} title="模块之间连的是能力，还是一张副本" labels={moduleLabels} caption={moduleCaptions[step]}>
    <div className={styles.moduleSignature} data-mode={effectiveMode} data-cycle={cycle} data-live={live}>
      <div className={styles.moduleGraph}><div className={styles.moduleNode}><Code size={16} /><strong>settings.js</strong><small>{step >= 2 && !cycle ? "locale = zh-CN" : "locale = en-US"}</small></div><div className={styles.moduleWire}><LinkSimple size={17} /><span>{effectiveMode === "live" ? "binding" : "snapshot"}</span></div><div className={styles.moduleNode}><GitBranch size={16} /><strong>greeting.js</strong><small>import &#123; locale &#125;</small></div><ArrowRight size={17} className={styles.moduleArrow} /><div className={styles.moduleOutput}><span>entry.js</span><strong>{cycle ? "ReferenceError" : live ? "输出：zh-CN" : "输出：en-US"}</strong></div></div>
      <div className={styles.moduleControls} role="group" aria-label="选择模块绑定"><button type="button" aria-pressed={effectiveMode === "live"} onClick={() => choose("live")}>live binding</button><button type="button" aria-pressed={effectiveMode === "copy"} onClick={() => choose("copy")}>复制快照</button><button type="button" aria-pressed={cycle} onClick={() => scene.seek(4)}><WarningCircle size={13} />模拟循环</button></div>
      <div className={styles.moduleProof} role="status">{cycle ? <><XCircle size={16} /><strong>TDZ · 读取太早</strong><span>先完成初始化，或把读取放进函数调用。</span></> : step < 2 ? <><TreeStructure size={16} /><strong>同一张依赖图</strong><span>模块求值后保留自己的边界。</span></> : <><CheckCircle size={16} /><strong>{effectiveMode === "live" ? "调用方跟着导出" : "调用方留在旧快照"}</strong><span>{effectiveMode === "live" ? "导入连接到当前绑定" : "普通变量不会自动回写"}</span></>}</div>
    </div>
  </SignatureFrame>;
}

const splitLabels = ["首页入口", "功能上锁", "打开编辑器", "chunk ready", "拆得太碎"];
const splitCaptions = [
  "首页只拿自己需要的代码，编辑器还在功能门后。",
  "动态 import 画出边界；门外没有编辑器请求。",
  "用户走到入口，门才打开，chunk 开始进入网络。",
  "chunk 到达并执行，编辑器挂回原来的入口；下一次可走缓存。",
  "把一次功能拆成二十个包，首包更轻，点击后的等待却更长。",
];

export function CodeSplittingSignatureHero() {
  const scene = useScene(splitLabels.length);
  const step = scene.step;
  const opened = step >= 2;
  const ready = step === 3;
  const fragmented = step === 4;
  return <SignatureFrame scene={scene} title="功能门什么时候放行一份 chunk" labels={splitLabels} caption={splitCaptions[step]}>
    <div className={styles.splitSignature} data-step={step}>
      <div className={styles.splitHome}><Browser size={18} /><strong>首页</strong><small>home.js · 已在场</small><div className={styles.homeSlot}>入口可用</div></div>
      <div className={styles.splitDoor}><div className={styles.doorFrame}><LockSimple size={18} /><span>{opened ? "OPEN" : "import()"}</span></div><div className={styles.doorLight} data-on={opened} /></div>
      <div className={styles.splitEditor}><Package size={18} /><strong>编辑器</strong><small>{fragmented ? "20 × 24 KB" : "editor.js · 420 KB"}</small><div className={styles.chunkShelf}>{Array.from({ length: fragmented ? 5 : 3 }, (_, index) => <i key={index} data-ready={ready} />)}</div><span>{ready ? "ready · cached" : opened ? "loading…" : "未请求"}</span></div>
      <div className={styles.splitProof} role="status"><CloudArrowDown size={16} /><strong>{fragmented ? "20 个请求" : opened ? ready ? "1 个 chunk 已执行" : "1 个 chunk 请求" : "0 个额外请求"}</strong><span>{fragmented ? "拆分本身也有成本" : "请求、执行、缓存分别观察"}</span></div>
    </div>
  </SignatureFrame>;
}

const lazyLabels = ["还在远处", "接近窗口", "进入范围", "资源就绪", "请求失败"];
const lazyCaptions = [
  "资源槽先占住尺寸，远处的内容不抢首屏网络。",
  "接近视口只是准备信号，rootMargin 给下载留下时间。",
  "目标进入观察窗口，请求开始；占位仍保留。",
  "资源换入原槽位，下面的内容没有被推走。",
  "失败也要留下可理解的回退和重试入口，而不是一个空洞。",
];

export function LazyLoadingSignatureHero() {
  const scene = useScene(lazyLabels.length);
  const step = scene.step;
  const failed = step === 4;
  return <SignatureFrame scene={scene} title="视口窗口怎样决定资源值不值得取" labels={lazyLabels} caption={lazyCaptions[step]}>
    <div className={styles.lazySignature} data-step={step}>
      <div className={styles.lazyViewport}><div className={styles.lazyViewportTop}><Eye size={15} />viewport window</div><div className={styles.lazyWindow}><div className={styles.lazySlot} data-state={step >= 2 ? failed ? "error" : step === 3 ? "ready" : "loading" : "reserved"}><div className={styles.lazyArtwork}>{failed ? <WarningCircle size={22} /> : step === 3 ? <CheckCircle size={22} /> : <Stack size={22} />}</div><strong>{failed ? "加载失败" : step === 3 ? "图片已到" : step >= 2 ? "请求中" : "预留 16:9"}</strong>{failed ? <button type="button" className={styles.lazyRetry} onClick={() => scene.seek(2)}>重试加载</button> : <small>尺寸先锁住</small>}</div><div className={styles.lazySlotGhost}>下一张 · 仍在远处</div></div></div>
      <div className={styles.lazyTrack}><i style={{ transform: `translateX(${step * 20}%)` }} /><span>远处</span><span>接近</span><span>相交</span><span>ready</span></div>
      <div className={styles.lazyProof} role="status"><SpinnerGap size={16} /><strong>{failed ? "error · retry" : step === 3 ? "ready · 原位替换" : step >= 2 ? "loading · 槽位保留" : "deferred · 未请求"}</strong><span>{step === 1 ? "rootMargin 提前准备" : "观察器只负责触发信号"}</span></div>
    </div>
  </SignatureFrame>;
}

const hydrationLabels = ["HTML 先到", "对齐节点", "接通事件", "制造 mismatch", "稳定接管"];
const hydrationCaptions = [
  "服务器 HTML 已经可见，按钮仍只是纸片。",
  "客户端树和已有节点对齐，水合还没有完成事件连接。",
  "事件线接上之后，原来的 DOM 才真正可操作。",
  "首轮输出不同，接管停在 mismatch 警报，不应假装成功。",
  "让首轮输入稳定，再把客户端事件接上。",
];

export function HydrationSignatureHero() {
  const scene = useScene(hydrationLabels.length);
  const step = scene.step;
  const mismatch = step === 3;
  const connected = step === 2 || step === 4;
  return <SignatureFrame scene={scene} title="已有 HTML 怎样接上客户端事件" labels={hydrationLabels} caption={hydrationCaptions[step]}>
    <div className={styles.hydrationSignature} data-step={step} data-mismatch={mismatch}>
      <div className={styles.domPaper}><div className={styles.domTitle}><Code size={15} />server HTML</div><div className={styles.domButton}>{mismatch ? "09:00" : "保存"}</div><div className={styles.domLine} /><div className={`${styles.domLine} ${styles.domLineShort}`} /></div>
      <div className={styles.hydrationSocket}><div className={styles.socketRing} data-connected={connected} /><div className={styles.socketWire} data-connected={connected} /><span>{mismatch ? "首轮不一致" : connected ? "event connected" : "等待客户端"}</span></div>
      <div className={styles.clientCard}><div><Lightning size={15} />client tree</div><strong>{mismatch ? "09:01" : connected ? "onClick → count + 1" : "匹配中"}</strong><small>{mismatch ? "暂停接管" : connected ? "复用已有节点" : "先比对结构"}</small></div>
      <div className={styles.hydrationProof} role="status">{mismatch ? <><WarningCircle size={16} /><strong>mismatch</strong><span>稳定首轮输出后再连接事件</span></> : connected ? <><CheckCircle size={16} /><strong>可交互</strong><span>可见和可操作已经分开</span></> : <><Eye size={16} /><strong>可见 ≠ 可点</strong><span>HTML 先到，事件后来</span></>}</div>
    </div>
  </SignatureFrame>;
}

const csrLabels = ["收到壳", "执行脚本", "取回数据", "填入 DOM", "事件就绪"];
const csrCaptions = [
  "服务器先交付挂载点和脚本地址，主要内容还没有长出来。",
  "浏览器下载、解析并执行 JavaScript，空白取决于这段成本。",
  "应用发出 API 请求，数据回来之前 DOM 还没有完整内容。",
  "数据落回浏览器，应用把列表写进挂载点。",
  "内容和事件都在客户端运行时里就绪；服务器仍提供了壳、脚本和 API。",
];

export function CsrSignatureHero() {
  const scene = useScene(csrLabels.length);
  const step = scene.step;
  const showContent = step >= 3;
  return <SignatureFrame scene={scene} title="浏览器里的空挂载点怎样长成页面" labels={csrLabels} caption={csrCaptions[step]}>
    <div className={styles.csrSignature} data-step={step}>
      <div className={styles.browserCanvas}>
        <div className={styles.browserBar}><Browser size={15} /><span>app.example</span><i data-live={showContent} /></div>
        <div className={styles.mountPoint} data-ready={showContent} data-interactive={step === 4}>
          {showContent ? <div className={styles.mountCard}><span>今日订单</span><strong>3 件待处理</strong><div className={styles.orderRows}><i /><i /><i /></div><button type="button">{step === 4 ? "查看详情" : "等待事件"}</button></div> : <><span id="app">&lt;div id=&quot;app&quot; /&gt;</span><small>{step === 0 ? "空挂载点" : step === 1 ? "运行时建立中" : "等待 API"}</small></>}
          <span className={styles.mountCursor} data-on={step === 4} aria-hidden="true" />
        </div>
        <div className={styles.csrPackets} aria-label="进入浏览器的材料">
          <span className={styles.csrPacket} data-kind="shell" data-arrived={step >= 0}><Browser size={12} /><b>壳</b></span>
          <span className={styles.csrPacket} data-kind="script" data-arrived={step >= 1}><Code size={12} /><b>JS</b></span>
          <span className={styles.csrPacket} data-kind="data" data-arrived={step >= 2}><Database size={12} /><b>API</b></span>
        </div>
      </div>
      <div className={styles.csrProof} role="status"><span className={styles.csrPulse} data-on={showContent} aria-hidden="true" /><strong>{showContent ? step === 4 ? "内容已接上事件" : "数据长进挂载点" : "先只有一个空位置"}</strong><span>{step === 1 ? "脚本还在浏览器里执行" : step === 2 ? "数据回来前，空位仍然是空位" : "CSR 不等于没有服务器"}</span></div>
    </div>
  </SignatureFrame>;
}
