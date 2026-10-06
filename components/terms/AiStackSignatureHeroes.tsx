"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowsClockwise,
  Brain,
  Check,
  CheckCircle,
  Circuitry,
  Envelope,
  FileText,
  Funnel,
  Gauge,
  GitBranch,
  Lightning,
  LockKey,
  MagnifyingGlass,
  Pause,
  Scales,
  Stack,
  Target,
  Timer,
  WarningCircle,
  WifiHigh,
} from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./AiStackSignatureHeroes.module.css";

function Header({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return <div className={styles.header}><span>{eyebrow}</span><strong>{meta}</strong></div>;
}

function Result({ icon: Icon, title, detail }: { icon: typeof CheckCircle; title: string; detail: string }) {
  return <div className={styles.result} role="status"><Icon size={19} aria-hidden="true" /><span><strong>{title}</strong> · {detail}</span></div>;
}

export function ModelGraderSignatureHero() {
  const scene = useScene(4);
  const [order, setOrder] = useState<"blind" | "known">("blind");
  const steps = ["收进信封", "逐项量尺", "对照人工", "保留未评分"];
  const current = [
    { title: "先把名字藏起来", detail: "回答 A / B 只剩内容可看", Icon: Envelope },
    { title: "同一把尺逐项落下", detail: "事实 · 完整 · 风险", Icon: Scales },
    { title: "分数回到人工样本", detail: "5 条校准样本，高估 2 条", Icon: GitBranch },
    { title: "证据不足就停手", detail: "unscored 不是一分，也不是通过", Icon: WarningCircle },
  ][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.modelGrader}`} aria-label="模型评分器用盲评、规则和人工校准检查回答" data-step={scene.step}>
    <Header eyebrow="评分器的偏差要露在样本上" meta="blind review · calibration" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.modelControls} role="group" aria-label="切换评分是否知道候选名称">
      <button type="button" aria-pressed={order === "blind"} onClick={() => setOrder("blind")}><LockKey size={15} />盲评</button>
      <button type="button" aria-pressed={order === "known"} onClick={() => setOrder("known")}><FileText size={15} />知道名称</button>
    </div>
    <div className={styles.modelBoard} data-known={order === "known"}>
      <div className={styles.envelopeRail}>
        <span className={styles.railLabel}>待评回答</span>
        {(["A", "B"] as const).map((label, index) => <div key={label} className={styles.envelope} data-open={scene.step >= 1} data-warn={order === "known" && index === 0}>
          <Envelope size={25} aria-hidden="true" /><strong>{order === "blind" ? `信封 ${index + 1}` : `模型-${label}`}</strong><small>{index === 0 ? "退款条件" : "退款条件"}</small>
        </div>)}
      </div>
      <div className={styles.ruler} data-active={scene.step === 1 || scene.step === 2}>
        <div className={styles.rulerHead}><Scales size={18} /><strong>rubric v3</strong><span>0—2</span></div>
        {["事实准确", "条件完整", "越界承诺"].map((item, index) => <div key={item} className={styles.rulerRow}><span>{item}</span><i><b style={{ width: `${[78, 62, 34][index]}%` }} /></i><em>{scene.step >= 1 ? [2, 1, 0][index] : "—"}</em></div>)}
      </div>
      <div className={styles.calibration} data-active={scene.step >= 2}>
        <div className={styles.calibrationRing}><strong>{scene.step >= 2 ? "3/5" : "?"}</strong><small>人工参考</small></div>
        <div><span>偏差方向</span><strong>{scene.step >= 2 ? "高估" : "等待样本"}</strong><small>{scene.step >= 2 ? "不能只看单条高分" : "先跑一组代表性样本"}</small></div>
      </div>
    </div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>模型可以执行评分，却不能替自己证明没有偏差；把候选遮住、固定量尺、回到人工样本，偏差才有机会被看见。</figcaption>
  </figure>;
}

export function RegressionEvaluationSignatureHero() {
  const scene = useScene(4);
  const [suite, setSuite] = useState<"v1" | "v2">("v1");
  const steps = ["锁定题集", "翻开逐项差异", "钉住关键回退", "决定发布"];
  const current = [
    { title: "两版拿同一份题", detail: "suite-v1 · 20 条任务", Icon: Stack },
    { title: "总分变好也要逐项翻", detail: "17/20 → 18/20", Icon: MagnifyingGlass },
    { title: "关键行为的红钉不能拔", detail: "退款条件：通过 → 失败", Icon: WarningCircle },
    { title: "关键失败为零才放行", detail: suite === "v1" ? "阻断发布" : "题集不同，暂不比较", Icon: CheckCircle },
  ][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.regression}`} aria-label="回归评测用同一题集逐项比较基线和候选版本" data-step={scene.step}>
    <Header eyebrow="平均分不能替关键行为辩护" meta="baseline ↔ candidate" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.regressionControls} role="group" aria-label="切换题集版本"><button type="button" aria-pressed={suite === "v1"} onClick={() => setSuite("v1")}>suite-v1 · 同题</button><button type="button" aria-pressed={suite === "v2"} onClick={() => setSuite("v2")}>suite-v2 · 换题</button></div>
    <div className={styles.regressionLedger} data-mismatch={suite === "v2"}>
      <div className={styles.ledgerHeader}><span>逐项差异账本</span><strong>{suite === "v1" ? "20 条共同任务" : "12 条新任务"}</strong></div>
      <div className={styles.versionLine}><div><small>基线 · agent-B</small><strong>17 / 20</strong><span>关键项全通过</span></div><ArrowRight size={20} aria-hidden="true" /><div data-candidate="true"><small>候选 · agent-C</small><strong>18 / 20</strong><span>{suite === "v1" ? "多 1 条，但有回退" : "没有共同分母"}</span></div></div>
      <div className={styles.diffRows}>{["退款条件", "普通问答", "工具回执", "格式约束"].map((item, index) => <div key={item} data-regression={scene.step >= 1 && index === 0 && suite === "v1"}><span>{item}</span><b>{suite === "v1" ? ["通过", "通过", "通过", "失败"][index] : "未对齐"}</b><ArrowRight size={14} /><b>{suite === "v1" ? [scene.step >= 2 && index === 0 ? "失败" : "通过", "通过", "通过", "通过"][index] : "—"}</b><i>{scene.step >= 2 && index === 0 && suite === "v1" ? "关键回退" : ""}</i></div>)}</div>
      <div className={styles.releaseGate}><span>发布闸门</span><strong data-blocked={scene.step >= 2 && suite === "v1"}>{scene.step >= 2 && suite === "v1" ? "BLOCK" : scene.step === 3 && suite === "v2" ? "COMPARE LATER" : "检查中"}</strong></div>
    </div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>回归评测看的不是“新版本平均变高了没有”，而是原来重要的通过项有没有被改坏；换了题集，先承认不能比较。</figcaption>
  </figure>;
}

export function ContextOverflowSignatureHero() {
  const scene = useScene(4);
  const [compressed, setCompressed] = useState(false);
  const steps = ["逐件装入", "顶到容量线", "溢出拒收", "压缩再核对"];
  const current = [
    { title: "每份材料都有重量", detail: "指令 · 历史 · 工具 · 预计输出", Icon: Stack },
    { title: "容量线被顶住", detail: "26k / 24k tokens", Icon: Gauge },
    { title: "请求在门口停下", detail: "最新任务还没执行", Icon: WarningCircle },
    { title: compressed ? "压缩后重新核对" : "先选择保留什么", detail: compressed ? "11k · 目标和未完成动作仍在" : "裁剪、摘要、检索或分段", Icon: CheckCircle },
  ][scene.step];
  const pieces = ["系统 2k", "历史 14k", "工具 7k", "输出 3k"];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.overflow}`} aria-label="上下文溢出如何由输入组成和容量预算共同触发" data-step={scene.step}>
    <Header eyebrow="上下文是一只有限容量的托盘" meta="24k window" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.overflowControls}><button type="button" aria-pressed={compressed} onClick={() => { setCompressed(value => !value); scene.seek(3); }}>{compressed ? "还原原始材料" : "压缩保留关键事实"}</button></div>
    <div className={styles.overflowBoard} data-compressed={compressed} data-over={scene.step >= 2 && !compressed}>
      <div className={styles.capacityTray}><div className={styles.trayTop}><span>一次请求的托盘</span><strong>0 / 24k</strong></div><div className={styles.traySlots}>{pieces.map((piece, index) => <div key={piece} className={styles.trayPiece} data-visible={scene.step >= 0 && (scene.step !== 3 || compressed || index < 2)} data-piece={index}>{compressed && index > 1 ? (index === 2 ? "摘要 2k" : "保留输出 3k") : piece}</div>)}</div><div className={styles.capacityLine}><span>可用容量</span><i><b /></i><strong>{compressed ? "11k / 24k" : scene.step >= 1 ? "26k / 24k" : "8k / 24k"}</strong></div></div>
      <div className={styles.overflowSpill}><div className={styles.spillIcon}>{scene.step >= 2 && !compressed ? <WarningCircle size={29} /> : <ArrowDown size={29} />}</div><strong>{scene.step >= 2 && !compressed ? "OVERFLOW" : compressed ? "重新装入" : "还没越线"}</strong><small>{scene.step >= 2 && !compressed ? "多出来的内容不能假装仍在上下文里" : compressed ? "保留目标、决策和未完成动作" : "预计输出也要预留位置"}</small></div>
      <div className={styles.overflowFacts}><span>必须保留</span>{["用户目标", "关键证据", "未完成动作"].map((fact, index) => <div key={fact} data-kept={compressed || scene.step < 2 || index === 0}><Check size={14} />{fact}</div>)}</div>
    </div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>溢出不是模型忽然失忆，而是这次请求的各部分加起来超过了窗口；压缩后也要检查关键事实是否真的留下。</figcaption>
  </figure>;
}

export function TransformerSignatureHero() {
  const scene = useScene(4);
  const steps = ["铺开位置", "叠上关系", "经过改写", "交给下一层"];
  const current = [
    { title: "token 先各站各位", detail: "顺序和表示一起进入", Icon: Stack },
    { title: "透明片把关系叠出来", detail: "它 ↔ 小猫 · 看见 ↔ 雨", Icon: GitBranch },
    { title: "同一层再做一次改写", detail: "注意力后接逐位置前馈", Icon: Brain },
    { title: "表示继续向前", detail: "下一层仍可交换信息", Icon: ArrowRight },
  ][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.transformer}`} aria-label="Transformer 用层叠的透明计算片交换并改写 token 表示" data-step={scene.step}>
    <Header eyebrow="不是一条流水线，是一摞会叠加的透明片" meta="attention + FFN" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.transformerStack}>
      <div className={styles.tokenStrip}>{["小猫", "坐在", "窗边", "它", "看见", "雨"].map((token, index) => <span key={token} data-focus={scene.step >= 1 && [0, 3, 4, 5].includes(index)}><strong>{token}</strong><small>p{index + 1}</small></span>)}</div>
      <div className={styles.acetateStage} data-stage={scene.step}>
        <div className={styles.acetateSheet} data-layer="attention"><span>关系片</span><b>它 ↔ 小猫</b><b>看见 ↔ 雨</b></div>
        <div className={styles.acetateSheet} data-layer="feedforward"><span>逐位置片</span><b>角色</b><b>动作</b><b>场景</b></div>
        <div className={styles.acetateSheet} data-layer="residual"><span>残差片</span><b>原表示 + 新线索</b></div>
      </div>
      <div className={styles.transformerOut}><ArrowDown size={19} /><strong>{scene.step < 3 ? "正在叠层" : "下一层输入"}</strong><small>{scene.step < 3 ? "一张片完成后再叠下一张" : "带着位置继续前进"}</small></div>
    </div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>Transformer 的核心不是一条固定流程图，而是同一排位置反复经过“交换信息—各自改写”的层叠计算。</figcaption>
  </figure>;
}

export function AttentionSignatureHero() {
  const scene = useScene(4);
  const [masked, setMasked] = useState(false);
  const steps = ["递出查询", "吸住匹配键", "取回值", "合成表示"];
  const current = [
    { title: "Query 先说清想找什么", detail: "查：无糖饮品", Icon: Target },
    { title: "磁力只作用于比较线索", detail: masked ? "无糖被遮住，权重转向剩余卡片" : "无糖标签吸力最强", Icon: MagnifyingGlass },
    { title: "带回的是 Value", detail: "规格与价格，不是事实盖章", Icon: Funnel },
    { title: "一层输出一份加权表示", detail: "亮度说明偏向，不说明唯一原因", Icon: CheckCircle },
  ][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.attention}`} aria-label="注意力用 Query 吸引 Key，再按权重混合 Value" data-step={scene.step}>
    <Header eyebrow="把注意力看成一次带磁力的取数" meta="Q → K → V" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.attentionControls}><button type="button" aria-pressed={masked} onClick={() => setMasked(value => !value)}>{masked ? "放回无糖证据" : "遮住无糖证据"}</button></div>
    <div className={styles.attentionBoard} data-masked={masked}>
      <div className={styles.queryTile}><Target size={20} /><span>Query</span><strong>找无糖饮品</strong><small>当前问题</small></div>
      <div className={styles.magnetField} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.keyShelf}><span className={styles.shelfLabel}>Key / Value 货架</span>{[{key:"美式",detail:"无糖 · ¥18",value:"规格 + 价格"},{key:"拿铁",detail:"含奶 · ¥22",value:"规格 + 价格"},{key:"果茶",detail:"含糖 · ¥20",value:"规格 + 价格"}].map((item,index)=><div key={item.key} className={styles.keyCard} data-hit={!masked && index === 0 && scene.step >= 1} data-hidden={masked && index === 0}><b>{item.key}</b><span>{item.detail}</span><em>{scene.step >= 2 && (!masked || index !== 0) ? item.value : "等待取回"}</em></div>)}</div>
      <div className={styles.attentionOutput}><ArrowRight size={18} /><span>加权输出</span><strong>{masked ? "剩余候选的混合表示" : scene.step >= 2 ? "无糖规格 + 价格" : "尚无输出"}</strong></div>
    </div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>权重是这一次计算的取数信号；遮住证据后仍能算出结果，但缺失的 value 不会凭空回来。</figcaption>
  </figure>;
}

export function InferenceSignatureHero() {
  const scene = useScene(4);
  const steps = ["整段读入", "建好状态", "逐 token 写", "满足停止"];
  const current = [
    { title: "输入先完整抵达", detail: "订单 · 日期 · 退款原因", Icon: FileText },
    { title: "Prefill 一次读过前缀", detail: "准备下一步生成状态", Icon: Circuitry },
    { title: "Decode 像打字带一样前进", detail: "先 · 核对 · 订单 · 条件", Icon: Brain },
    { title: "停止条件收住输出", detail: "结束标记 / 长度 / 取消", Icon: CheckCircle },
  ][scene.step];
  const output = ["先", "核对", "订单", "条件"];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.inference}`} aria-label="推理从 prefill 进入逐 token decode，满足停止条件后结束" data-step={scene.step}>
    <Header eyebrow="一次推理像一条有停止点的打字带" meta="prefill → decode" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.inferenceBoard}>
      <div className={styles.inferencePaper}><span>request</span><strong>请说清退款条件</strong><div>{["订单 A17", "购买日期", "退款原因"].map((item, index) => <b key={item} data-read={scene.step >= 0}>{item}<small>{index + 1}</small></b>)}</div></div>
      <div className={styles.inferenceEngine}><div className={styles.engineWindow} data-active={scene.step === 1}><Circuitry size={21} /><strong>Prefill</strong><small>{scene.step >= 1 ? "3 / 3 已读" : "等待请求"}</small></div><div className={styles.engineWindow} data-active={scene.step >= 2}><Brain size={21} /><strong>Decode</strong><small>{scene.step >= 2 ? `${scene.step === 3 ? 4 : scene.step - 1} token` : "等待 prefill"}</small></div><div className={styles.weightLock}><LockKey size={14} />权重更新 0 次</div></div>
      <div className={styles.inferenceRibbon}><span>output tape</span><div>{output.map((token,index)=><b key={token} data-printed={scene.step >= 2 && index < (scene.step === 3 ? 4 : Math.max(1, scene.step - 1))}>{token}</b>)}</div><small>{scene.step === 3 ? "STOP" : scene.step >= 2 ? "printing…" : "尚未出字"}</small></div>
    </div>
    <div className={styles.inferenceStops}><span><Timer size={16} />首 token <strong>{scene.step >= 2 ? "已返回" : "等待"}</strong></span><span><Pause size={16} />完整结束 <strong>{scene.step === 3 ? "是" : "否"}</strong></span><span><Check size={16} />事实核验 <strong>另行检查</strong></span></div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>流式页面先显示几个字，不等于推理已经完成；prefill、decode、停止和事实核验是四个不同的检查点。</figcaption>
  </figure>;
}

export function PretrainingSignatureHero() {
  const scene = useScene(4);
  const steps = ["切开语料", "藏起目标", "量出损失", "挪动参数"];
  const current = [
    { title: "从语料里切出一小段", detail: "退款 · 需 · 在 · 七日内", Icon: FileText },
    { title: "目标藏在数据本身", detail: "下一 token = 七日内", Icon: Target },
    { title: "预测和目标拉出误差", detail: "loss = 可比较的差", Icon: Scales },
    { title: "梯度只推一小步", detail: "W → W + ΔW", Icon: Lightning },
  ][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.pretraining}`} aria-label="预训练从语料构造目标，计算损失，再用梯度更新参数" data-step={scene.step}>
    <Header eyebrow="目标不是人工写在天上的答案" meta="data → loss → update" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.trainingLoom}>
      <div className={styles.loomStrip}><span>语料线</span>{["退款", "需", "在", "七日内"].map((token,index)=><b key={token} data-hidden={scene.step === 1 && index === 3} data-target={index === 3 && scene.step >= 1}>{token}</b>)}</div>
      <div className={styles.loomNeedle}><ArrowDown size={20} /><span>{scene.step === 1 ? "目标" : scene.step === 2 ? "比较" : scene.step === 3 ? "更新" : "样本"}</span></div>
      <div className={styles.loomCards}><div><small>模型猜测</small><strong>{scene.step >= 1 ? "三日内" : "?"}</strong><i /></div><div className={styles.loomLoss} data-active={scene.step >= 2}><small>loss</small><strong>{scene.step >= 2 ? "0.42" : "—"}</strong><span>{scene.step >= 2 ? "有误差，才能有方向" : "需要目标比较"}</span></div><div><small>参数</small><strong>{scene.step >= 3 ? "W + ΔW" : "W"}</strong><i data-move={scene.step >= 3} /></div></div>
      <div className={styles.loomBoundary}><WarningCircle size={15} />低损失只说明贴近目标，不等于语料事实已核验</div>
    </div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>自监督不等于没有目标：目标从数据构造，损失才能定义，梯度才能移动参数；这条训练信号也不会自动替语料做事实核查。</figcaption>
  </figure>;
}

export function KvCacheSignatureHero() {
  const scene = useScene(4);
  const [changed, setChanged] = useState(false);
  const steps = ["读过前缀", "钉下书签", "带新 Q", "命中或失效"];
  const current = [
    { title: "前缀先被完整读过", detail: "系统：你是客服", Icon: FileText },
    { title: "把 K / V 中间状态钉住", detail: "block 0 · block 1", Icon: Stack },
    { title: "下一步只带新的 Q", detail: "旧状态留在货架上", Icon: ArrowRight },
    { title: changed ? "前缀改了，书签失效" : "同一前缀可以少算一段", detail: changed ? "不能按大意复用" : "命中 · 复用 block 0", Icon: changed ? WarningCircle : CheckCircle },
  ][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.kvCache}`} aria-label="KV Cache 把过去 token 的 K/V 中间状态保存成可复用书签" data-step={scene.step}>
    <Header eyebrow="缓存的是中间状态，不是一份答案" meta="K / V shelf" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.kvControls}><button type="button" aria-pressed={changed} onClick={() => setChanged(value => !value)}>{changed ? "还原前缀" : "改一个词：客服 → 销售"}</button></div>
    <div className={styles.kvShelf} data-changed={changed}>
      <div className={styles.kvPrompt}><span>prefix</span><strong>{changed ? "系统：你是销售" : "系统：你是客服"}</strong><small>位置 0—4</small></div>
      <div className={styles.kvBlocks}>{["K/V 0", "K/V 1", "K/V 2"].map((block,index)=><div key={block} data-saved={scene.step >= 1 && index < 2} data-stale={changed && index < 2}><Stack size={18} /><b>{block}</b><small>{changed && index < 2 ? "stale" : scene.step >= 1 && index < 2 ? "reusable" : "待计算"}</small></div>)}</div>
      <div className={styles.kvQuery}><span>new Q</span><strong>请问</strong><ArrowRight size={19} /><em>{changed ? "重新计算" : scene.step >= 2 ? "读取旧 K/V" : "等待"}</em></div>
      <div className={styles.kvTier}><span>容量层级</span><b>GPU</b><b>CPU</b><b>disk</b><small>{scene.step === 3 ? changed ? "miss · 重新算" : "hit · 少算前缀" : "取回成本另算"}</small></div>
    </div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>KV cache 保存注意力已经算过的 K/V；它依赖具体前缀和位置，改一个词即使大意相近，也不能把旧书签当成答案。</figcaption>
  </figure>;
}

export function AgentWorkflowSignatureHero() {
  const scene = useScene(4);
  const steps = ["盖上请求章", "过字段闸门", "交给节点", "验收出口"];
  const current = [
    { title: "任务先有一张护照", detail: "退款 A17 · ¥1,280", Icon: FileText },
    { title: "没有证据就停在闸门", detail: "字段 · 权限 · 风险", Icon: LockKey },
    { title: "模型只负责节点内判断", detail: "路由 → 账单专家", Icon: Brain },
    { title: "done 需要回执", detail: "done / blocked / needs-human", Icon: CheckCircle },
  ][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.workflow}`} aria-label="智能体工作流用任务护照经过闸门、节点和验收出口" data-step={scene.step}>
    <Header eyebrow="工作流把自由判断装进有出口的护照" meta="state · guard · proof" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.workflowBoard}>
      <div className={styles.workflowPassport} data-active={scene.step === 0}><div><FileText size={21} /><span>任务护照</span></div><strong>退款 A17</strong><small>¥1,280 · received</small><i>{scene.step >= 0 ? "状态可追踪" : ""}</i></div>
      <div className={styles.workflowGate} data-active={scene.step === 1} data-blocked={scene.step === 1}><LockKey size={22} /><span>{scene.step === 1 ? "BLOCKED" : "guard"}</span><small>字段 / 权限 / 风险</small></div>
      <div className={styles.workflowNode} data-active={scene.step === 2}><Brain size={22} /><span>局部节点</span><strong>账单专家</strong><small>草稿还没改订单</small></div>
      <div className={styles.workflowExit} data-active={scene.step === 3}><CheckCircle size={22} /><span>验收出口</span><strong>{scene.step === 3 ? "needs-human" : "等待证据"}</strong><small>回执才能 done</small></div>
    </div>
    <div className={styles.workflowStamp}><span>副作用</span><strong>{scene.step >= 3 ? "验收后才允许" : "仍被护栏挡住"}</strong><small>模型提出选择 ≠ 系统已经执行</small></div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>工作流不是把模型画成一条自动流水线，而是把权限、状态、回执和人工接管留在可追踪的任务路径上。</figcaption>
  </figure>;
}

export function BackpressureSignatureHero() {
  const scene = useScene(4);
  const steps = ["放水入池", "水位到线", "闸门回传", "排空再开"];
  const current = [
    { title: "上游先把 chunk 放进池子", detail: "6 / 秒，水位 2 / 4", Icon: WifiHigh },
    { title: "有界池到达红线", detail: "4 / 4 · 再来就溢出", Icon: WarningCircle },
    { title: "下游把容量信号送回去", detail: "capacity = 0 · 暂停", Icon: ArrowsClockwise },
    { title: "空出一格才重新开闸", detail: "等待、吞吐、丢弃分别记录", Icon: CheckCircle },
  ][scene.step];
  const level = [2, 4, 4, 1][scene.step];
  return <figure ref={scene.ref} className={`${styles.frame} ${styles.backpressure}`} aria-label="背压用有界蓄水池和回传闸门让生产速度服从下游容量" data-step={scene.step}>
    <Header eyebrow="下游喘不过气时，容量信号逆流" meta="bounded buffer" />
    <SceneControls scene={scene} labels={steps} />
    <div className={styles.pressureBoard}>
      <div className={styles.pressureSource}><span>生产者</span><strong>{scene.step >= 2 ? "暂停" : "6 / 秒"}</strong><div>{["A", "B", "C", "D", "E", "F"].map((packet,index)=><b key={packet} data-visible={index < (scene.step === 0 ? 4 : scene.step === 1 ? 6 : scene.step === 2 ? 3 : 2)}>{packet}</b>)}</div><small>数据沿蓝色水流向右</small></div>
      <div className={styles.pressurePipe}><i /><ArrowRight size={20} /></div>
      <div className={styles.pressureTank} data-full={scene.step === 1}><div className={styles.tankTop}><span>有界缓冲</span><strong>{level} / 4</strong></div><div className={styles.tank}><div style={{ height: `${level * 25}%` }}><span>{scene.step === 1 ? "FULL" : "capacity"}</span></div></div><small>{scene.step === 1 ? "没有空槽" : "池子有明确上限"}</small></div>
      <div className={styles.pressurePipe}><i /><ArrowRight size={20} /></div>
      <div className={styles.pressureSink}><span>消费者</span><strong>{scene.step === 3 ? "排空中" : "2 / 秒"}</strong><div className={styles.sinkWheel}><Gauge size={28} /></div><small>只按能接住的节奏取走</small></div>
    </div>
    <div className={styles.pressureReturn} data-active={scene.step === 2}><ArrowsClockwise size={17} /><span>{scene.step === 1 ? "红线已到：容量信号准备回传" : scene.step === 2 ? "capacity = 0 · 让上游暂停" : "需求沿相反方向传回"}</span></div>
    <Result icon={current.Icon} title={current.title} detail={current.detail} />
    <figcaption>背压不是把队列藏到更深处，而是让真正知道容量的下游把“可以继续多少”传回生产者。</figcaption>
  </figure>;
}
