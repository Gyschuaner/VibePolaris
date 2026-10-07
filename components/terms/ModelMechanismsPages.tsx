"use client";

import { Check, LockKey, Scales, ShieldCheck, WarningCircle, X } from "@phosphor-icons/react";
import { useState, type CSSProperties } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import {
  beamSearchSources,
  confidenceCalibrationSources,
  dataContaminationSources,
  knowledgeDistillationSources,
  mixtureOfExpertsSources,
  modelCardSources,
  outOfDistributionSources,
  parameterEfficientFineTuningSources,
  quantizationSources,
  speculativeDecodingSources,
} from "@/lib/ai-stack-concept-sources";
import styles from "./ModelMechanismsPages.module.css";

const pct = (value: number) => ({ "--fill": `${value}%` } as CSSProperties);

function QuantizationHero() {
  const [bits, setBits] = useState(8);
  const memory = bits === 16 ? 100 : bits === 8 ? 50 : 25;
  const error = bits === 4 ? "需要校准" : bits === 8 ? "小幅误差" : "基准精度";
  return <figure className={styles.hero} aria-label="量化把同一组模型权重换成不同精度">
    <div className={styles.heroTop}><span>WEIGHT PALETTE / QUANTIZATION</span><strong>{bits}-bit 砝码</strong></div>
    <div className={styles.paletteHero}><div className={styles.paletteLegend}><strong>{memory}%</strong><p>相对 FP16 的权重存储量</p><div className={styles.heroControls}>{[16, 8, 4].map(value => <button type="button" key={value} aria-pressed={bits === value} onClick={() => setBits(value)}>{value}-bit</button>)}</div></div><div className={styles.paletteBars}>{[["内存", memory], ["可表示刻度", bits === 4 ? 25 : bits === 8 ? 50 : 100], ["误差预算", bits === 4 ? 76 : bits === 8 ? 28 : 8]].map(([label, value]) => <div className={styles.paletteBar} data-warn={label === "误差预算" && bits === 4} key={label}><span>{label}</span><i style={pct(value as number)} /><b>{label === "误差预算" ? error : `${value}%`}</b></div>)}</div></div>
    <figcaption className={styles.heroCaption}>量化不是把模型“缩小后就一样”：每个权重能用的刻度少了，换来更轻的存储和推理负担。</figcaption>
  </figure>;
}

function QuantizationLab() {
  const [bits, setBits] = useState(8);
  const [calibrated, setCalibrated] = useState(false);
  const weightHeight = bits === 16 ? 100 : bits === 8 ? 72 : 45;
  const safe = bits !== 4 || calibrated;
  return <div className={styles.lab} aria-label="量化精度实验"><div className={styles.labTop}><span>LOCAL WEIGHT CHECK / NO MODEL CALL</span><strong>只模拟内存与误差取舍</strong></div><div className={styles.paletteLab}><div className={styles.precisionDial}><label>选择存储精度<input type="range" min="4" max="16" step="4" value={bits} onChange={event => setBits(Number(event.target.value))} /></label><div className={styles.heroControls}>{[16, 8, 4].map(value => <button type="button" key={value} aria-pressed={bits === value} onClick={() => setBits(value)}>{value}-bit</button>)}</div><label><input type="checkbox" checked={calibrated} onChange={event => setCalibrated(event.target.checked)} /> 用一小份校准资料检查误差</label></div><div className={styles.paletteResult}><div className={styles.weightGrid} aria-label="权重刻度"><span style={{ "--h": `${weightHeight}%`, "--o": 1 } as CSSProperties} /><span style={{ "--h": `${weightHeight * .82}%`, "--o": .8 } as CSSProperties} /><span style={{ "--h": `${weightHeight * .64}%`, "--o": .65 } as CSSProperties} /><span style={{ "--h": `${weightHeight * .9}%`, "--o": .9 } as CSSProperties} /><span style={{ "--h": `${weightHeight * .52}%`, "--o": .52 } as CSSProperties} /><span style={{ "--h": `${weightHeight * .72}%`, "--o": .72 } as CSSProperties} /><span style={{ "--h": `${weightHeight * .6}%`, "--o": .6 } as CSSProperties} /><span style={{ "--h": `${weightHeight * .46}%`, "--o": .46 } as CSSProperties} /></div><div className={styles.resultChip}><strong>{safe ? "可以进入下一轮评测" : "先别部署"}</strong><small>{safe ? `${bits}-bit 权重已保留一条可核查的误差记录。` : "INT4 只是格式选择，校准与任务评测还没有跟上。"}</small></div></div></div></div>;
}

export function QuantizationTermPage() {
  return <Article slug="quantization" title="量化" subtitle="Quantization · 用更少的刻度装下模型" sources={quantizationSources} sections={[["quantization-definition", "先把精度和大小分开"], ["quantization-choices", "低 bit 换来了什么"], ["quantization-deploy", "部署前要留下哪条证据"], ["quantization-boundary", "它不能替你保证什么"]]} hero={<QuantizationHero />} intro={<>量化把模型参数从较高精度改成更少的数值刻度。<strong>你得到的是更小的权重和更低的存储压力，同时要重新面对误差、校准和硬件支持。</strong></>}>
    <ArticleSection id="quantization-definition" title="先把精度和大小分开"><p id="quantization-definition" className="vp-citation-target"><strong>量化用较少的 bit 表示原本较高精度的参数或激活值。</strong>训练后量化（PTQ）在训练完成后转换；量化感知训练（QAT）则在训练时模拟量化带来的影响。Hugging Face 将这两条路线区分开来，GPTQ 也把生成模型的训练后权重量化作为具体方法。<Cite id="quantization-definition" sources={quantizationSources} /></p><p>bit 数下降会减少可用刻度，但不会自动把模型架构、知识或输出任务改成另一种东西。本页的砝码只代表权重存储量；真实内存还会受激活、缓存、批大小和运行时内核影响。</p></ArticleSection>
    <ArticleSection id="quantization-choices" title="低 bit 换来了什么"><p id="quantization-choices" className="vp-citation-target">AWQ 的研究指出，不同权重的重要性并不相同，可以利用激活分布保护一小部分敏感通道；这说明“全都粗暴压到同一刻度”并不是唯一方案。<Cite id="quantization-choices" sources={quantizationSources} /></p><QuantizationLab /><p>切到 4-bit，再勾上校准，你看到的是一个决策顺序：先选择部署预算，再用代表性输入检查任务误差。校准通过不等于所有输入都通过，它只是给下一轮评测留下了可解释的起点。</p></ArticleSection>
    <ArticleSection id="quantization-deploy" title="部署前要留下哪条证据"><p id="quantization-deploy" className="vp-citation-target">量化实现还要匹配运行时后端、硬件和支持的权重格式。推理服务文档把 GPTQ、AWQ、bitsandbytes 等方案作为不同后端能力，而不是一个任意环境都能直接装上的开关。<Cite id="quantization-deploy" sources={quantizationSources} /></p><p>发布记录至少写清：使用哪种 bit 宽、哪份校准集、在哪类硬件上测过，以及质量和延迟相比基准怎么变化。否则“模型变小”只是一句宣传，无法帮助下一位维护者复现。</p></ArticleSection>
    <ArticleSection id="quantization-boundary" title="它不能替你保证什么"><p id="quantization-boundary" className="vp-citation-target">GPTQ 报告了特定模型、硬件和实验设置下的压缩与速度结果；AWQ 也把自己的方法与基准进行比较。它们不能证明任何模型在任何任务上都没有质量损失。<Cite id="quantization-boundary" sources={quantizationSources} /></p><ArticleAside title="量化后的第一道回归题"><p>拿一小组线上真实输入，与未量化版本逐条比较；把“格式能加载”“延迟下降”和“答案仍可接受”记录成三个独立结果。</p></ArticleAside></ArticleSection>
  </Article>;
}

function DistillationHero() {
  const [soft, setSoft] = useState(true);
  const values = soft ? ["猫 0.72", "狐狸 0.21", "狗 0.07"] : ["猫 1.00", "其他 0.00", "其他 0.00"];
  return <figure className={styles.hero} aria-label="知识蒸馏把教师模型的软分布交给学生模型"><div className={styles.heroTop}><span>SHADOW CLASSROOM / DISTILLATION</span><strong>{soft ? "soft targets" : "hard label"}</strong></div><div className={styles.classroomHero}><div className={styles.board} data-active={soft}><h3>教师模型 · 大但有细节</h3><p>看到同一张图片，不只说“答案是什么”，还给出候选之间的相似度。</p><div className={styles.softDistribution}>{values.map((value, index) => <div className={styles.softRow} key={`${value}-${index}`}><span>{value.split(" ")[0]}</span><i style={{ width: `${soft ? [72, 21, 7][index] : [100, 0, 0][index]}%` }} /><b>{value.split(" ")[1]}</b></div>)}</div></div><div className={styles.board} data-active={!soft}><h3>学生模型 · 小而快</h3><p>它不复制教师的参数，只在训练时把这份分布当作额外的提示。</p><span className={styles.chalkMark}>{soft ? "吸收相似度" : "只背答案"}</span></div></div><div className={styles.heroControls}><button type="button" aria-pressed={soft} onClick={() => setSoft(true)}>给 soft targets</button><button type="button" aria-pressed={!soft} onClick={() => setSoft(false)}>只给 hard label</button></div><figcaption className={styles.heroCaption}>老师留下的不只是“对/错”，还留下“像不像另一个答案”的温度；学生才能学到更细的边界。</figcaption></figure>;
}

function DistillationLab() {
  const [mode, setMode] = useState<"soft" | "hard">("soft");
  const soft = mode === "soft";
  return <div className={styles.lab} aria-label="知识蒸馏软目标实验"><div className={styles.labTop}><span>TEACHER / STUDENT CHECK</span><strong>只模拟训练信号</strong></div><div className={styles.classroomLab}><div className={styles.lessonChoice}><button type="button" aria-pressed={soft} onClick={() => setMode("soft")}><strong>软目标</strong><small>猫 0.72 · 狐狸 0.21 · 狗 0.07</small></button><button type="button" aria-pressed={!soft} onClick={() => setMode("hard")}><strong>硬标签</strong><small>猫 1.00 · 其他 0.00</small></button></div><div className={styles.studentCard}><h3>学生的输出倾向</h3>{[["猫", soft ? 72 : 100], ["狐狸", soft ? 21 : 0], ["狗", soft ? 7 : 0]].map(([label, value]) => <div className={styles.softRow} key={label as string}><span>{label}</span><i style={{ width: `${value}%` }} /><b>{value}%</b></div>)}<div className={styles.studentVerdict}>{soft ? "保留相似类别之间的关系，学生更容易学到边界。" : "只知道哪项胜出，类别之间的距离被抹平。"}</div></div></div></div>;
}

export function KnowledgeDistillationTermPage() {
  return <Article slug="knowledge-distillation" title="知识蒸馏" subtitle="Knowledge Distillation · 让小模型学到大模型的分寸" sources={knowledgeDistillationSources} sections={[["distillation-definition", "学生到底学了什么"], ["distillation-soft-targets", "软目标为什么有用"], ["distillation-lab", "把训练信号摊开看"], ["distillation-boundary", "蒸馏不是复制能力"]]} hero={<DistillationHero />} intro={<>知识蒸馏让一个较大的教师模型给较小的学生模型提供训练信号。<strong>学生接收的是教师对候选的分布和判断，不是把教师的参数整包搬走。</strong></>}>
    <ArticleSection id="distillation-definition" title="学生到底学了什么"><p id="distillation-definition" className="vp-citation-target"><strong>蒸馏通常把教师模型的输出作为学生训练时的额外目标。</strong>Hinton 等人的原始工作把教师集成的知识压进更容易部署的模型；DistilBERT 则在预训练阶段加入蒸馏损失，训练出更轻的语言模型。<Cite id="distillation-definition" sources={knowledgeDistillationSources} /></p><p>教师和学生可以拥有不同大小的网络。教师只在准备训练信号时出现，线上请求通常交给学生。这个“线下教、线上跑”的分工，才是蒸馏能降低部署成本的原因。</p></ArticleSection>
    <ArticleSection id="distillation-soft-targets" title="软目标为什么有用"><p id="distillation-soft-targets" className="vp-citation-target">“猫 0.72、狐狸 0.21、狗 0.07”比“猫”包含更多相对信息：教师认为狐狸比狗更像当前样例。蒸馏论文把这种带温度的软目标作为知识来源；TinyBERT 进一步把表示层和注意力等信号纳入蒸馏设计。<Cite id="distillation-soft-targets" sources={knowledgeDistillationSources} /></p><DistillationLab /><p>实验里切换到 hard label，学生仍知道赢家是谁，却看不见“第二名离它有多远”。软目标不是正确答案的证书，它只是训练阶段更丰富的一份示范。</p></ArticleSection>
    <ArticleSection id="distillation-lab" title="把训练信号摊开看"><p id="distillation-lab" className="vp-citation-target">本页的影子课堂只播放固定分布，不调用教师模型，也不重新训练学生。它把抽象的损失拆成可读的三列：输入样例、教师概率、学生要拟合的方向。<Cite id="distillation-lab" sources={knowledgeDistillationSources} /></p><p>真正的训练还要选择温度、损失权重、数据范围和评测任务。你需要记录学生在目标任务与未见任务上的表现，而不能只看它是否复现了教师的一次输出。</p></ArticleSection>
    <ArticleSection id="distillation-boundary" title="蒸馏不是复制能力"><p id="distillation-boundary" className="vp-citation-target">DistilBERT 的压缩比、速度与能力保留来自特定模型和实验设置；TinyBERT 也有自己的训练流程。论文结果不能推导出任何教师都能无损压成同一个学生。<Cite id="distillation-boundary" sources={knowledgeDistillationSources} /></p><ArticleAside title="何时不该先做蒸馏"><p>如果教师本身的事实、许可或安全边界还没有审清，先把它压进学生只会让问题更便宜地扩散。先固定评测集和失败样本，再决定要不要蒸馏。</p></ArticleAside></ArticleSection>
  </Article>;
}

function MixtureOfExpertsHero() {
  const [token, setToken] = useState("数学");
  const routes: Record<string, [number, number, number]> = { 数学: [86, 21, 18], 代码: [22, 91, 20], 闲聊: [24, 20, 56] };
  const loads = routes[token];
  return <figure className={styles.hero} aria-label="混合专家用路由器把 token 分给少数专家"><div className={styles.heroTop}><span>TRIAGE DIAL / MIXTURE OF EXPERTS</span><strong>当前 token：{token}</strong></div><div className={styles.moeHero}><div className={styles.dial} style={{ transform: `rotate(${token === "数学" ? -18 : token === "代码" ? 28 : 0}deg)` }}><strong>ROUTER</strong><small>只叫少数专家</small></div><div className={styles.expertStalls}>{["数理专家", "代码专家", "通用专家"].map((label, index) => <div className={styles.stall} data-active={loads[index] > 70} data-over={loads[index] > 90} key={label}><strong>{label}</strong><small>{loads[index] > 90 ? "容量接近上限" : loads[index] > 70 ? "本轮被选中" : "保持待命"}</small><div className={styles.stallMeter}><i style={{ "--load": `${loads[index]}%` } as CSSProperties} /></div></div>)}</div><span className={styles.moeToken} style={{ transform: `translate(${token === "数学" ? 115 : token === "代码" ? 205 : 160}px, ${token === "闲聊" ? 37 : -28}px)` }} /></div><div className={styles.heroControls}>{["数学", "代码", "闲聊"].map(value => <button type="button" key={value} aria-pressed={token === value} onClick={() => setToken(value)}>{value} token</button>)}</div><figcaption className={styles.heroCaption}>“混合”不等于每个 token 都走完整模型；路由器只唤醒少数专家，容量与负载就成了新的边界。</figcaption></figure>;
}

function MixtureOfExpertsLab() {
  const [token, setToken] = useState("数学");
  const [capacity, setCapacity] = useState(70);
  const scores: Record<string, number[]> = { 数学: [86, 21, 18], 代码: [22, 91, 20], 闲聊: [24, 20, 56] };
  const values = scores[token];
  const chosen = values.indexOf(Math.max(...values));
  return <div className={styles.lab} aria-label="混合专家路由与容量实验"><div className={styles.labTop}><span>ROUTER CAPACITY CHECK</span><strong>选择 token，再调容量</strong></div><div className={styles.moeLab}><div><div className={styles.tokenTray}>{Object.keys(scores).map(value => <button className={styles.tokenButton} type="button" key={value} data-selected={token === value} onClick={() => setToken(value)}>{value}</button>)}</div><label className={styles.labNote}>每个专家的容量上限：{capacity}%<input type="range" min="40" max="100" step="10" value={capacity} onChange={event => setCapacity(Number(event.target.value))} /></label></div><div className={styles.routeResult}><p>路由器偏好最高的是 <strong>{["数理专家", "代码专家", "通用专家"][chosen]}</strong>；如果它的容量不够，token 需要排队或被丢弃。</p><div className={styles.routeRows}>{["数理专家", "代码专家", "通用专家"].map((label, index) => <div className={styles.routeRow} data-over={values[index] > capacity} key={label}><span>{label}</span><i style={{ "--load": `${values[index]}%` } as CSSProperties} /><b>{values[index] > capacity ? "容量不足" : `${values[index]}%`}</b></div>)}</div></div></div></div>;
}

export function MixtureOfExpertsTermPage() {
  return <Article slug="mixture-of-experts" title="混合专家" subtitle="Mixture of Experts · 让路由器只叫醒合适的几间房" sources={mixtureOfExpertsSources} sections={[["moe-definition", "为什么不让所有专家都出场"], ["moe-routing", "路由器怎样分诊"], ["moe-lab", "容量不足会怎样"], ["moe-boundary", "稀疏不等于没有成本"]]} hero={<MixtureOfExpertsHero />} intro={<>混合专家模型把多个“专家”放在同一层，由路由器为每个 token 选择少数专家。<strong>计算量可以保持稀疏，但路由、负载平衡和通信会成为新的工程问题。</strong></>}>
    <ArticleSection id="moe-definition" title="为什么不让所有专家都出场"><p id="moe-definition" className="vp-citation-target"><strong>混合专家（MoE）用一组专家子网络和一个路由器处理输入，每个 token 只激活其中一部分。</strong>稀疏门控 MoE 论文把这种做法用于扩大参数容量；Switch Transformer 更进一步使用 top-1 路由，试图用更简单的稀疏选择扩展模型。<Cite id="moe-definition" sources={mixtureOfExpertsSources} /></p><p>因此“参数很多”和“每次都做很多计算”不是同一件事。专家参数可以躺在模型里，但本轮 token 只触碰被路由到的那几间房。</p></ArticleSection>
    <ArticleSection id="moe-routing" title="路由器怎样分诊"><p id="moe-routing" className="vp-citation-target">路由器根据 token 的表示给专家打分，再按实现选择 top-k 或 top-1。Switch Transformer 的设计把每个 token 交给一个专家，并需要额外的负载平衡损失，避免所有 token 挤到同一专家。<Cite id="moe-routing" sources={mixtureOfExpertsSources} /></p><MixtureOfExpertsLab /><p>切换输入，你会看到“数学”偏向数理专家、“代码”偏向代码专家；这不是一条固定语义规则，而是模型学到的路由分数。演示只展示偏好，不暗示每个模型的专家都有可解释名字。</p></ArticleSection>
    <ArticleSection id="moe-lab" title="容量不足会怎样"><p id="moe-lab" className="vp-citation-target">稀疏专家层通常设置容量限制，以避免一个专家被无限 token 填满。Switch Transformer 讨论了 token capacity、丢弃和负载平衡之间的取舍；本页的红色条只模拟“本轮超出容量”。<Cite id="moe-lab" sources={mixtureOfExpertsSources} /></p><p>生产实现可能选择补充专家、共享专家、丢弃 token 或重新路由。页面把决定权留给你调整容量，是为了让“路由成功”和“整层稳定”分开出现。</p></ArticleSection>
    <ArticleSection id="moe-boundary" title="稀疏不等于没有成本"><p id="moe-boundary" className="vp-citation-target">MoE 的训练和推理仍要处理专家间通信、路由不稳定、容量配置和负载不均；GLaM 与 Switch 的实验结果都依赖具体架构与硬件。<Cite id="moe-boundary" sources={mixtureOfExpertsSources} /></p><ArticleAside title="读 MoE 指标时多问一句"><p>看到“激活参数量”时，同时确认总参数量、专家并行通信、路由丢弃率和 batch 形状。一个数字不足以描述实际成本。</p></ArticleAside></ArticleSection>
  </Article>;
}

function SpeculativeHero() {
  const [step, setStep] = useState(2);
  const accepted = [0, 1, 2].map(index => index < step);
  return <figure className={styles.hero} aria-label="投机解码用小模型草稿并由大模型验证"><div className={styles.heroTop}><span>DRAFT DESK / SPECULATIVE DECODING</span><strong>{step === 3 ? "全部验收" : step === 2 ? "第 3 个 token 被拒" : "等待验收"}</strong></div><div className={styles.specHero}><div className={styles.draftStrip}><strong>小模型草稿</strong>{["今", "天", "下雨"].map((token, index) => <span className={styles.tokenPill} data-accepted={accepted[index]} key={token}>{token}</span>)}</div><div className={styles.verifyStrip}><strong>大模型校对</strong><span className={styles.verifyStamp} data-rejected={step === 2}>VERIFY · {step === 2 ? "ROLLBACK" : step === 3 ? "ACCEPT" : "CHECK"}</span></div></div><div className={styles.heroControls}>{[1, 2, 3].map(value => <button type="button" key={value} aria-pressed={step === value} onClick={() => setStep(value)}>验收到 {value} 个</button>)}</div><figcaption className={styles.heroCaption}>大模型不是照单全收：它一次看草稿片段，接受能接受的，拒绝处重新采样。</figcaption></figure>;
}

function SpeculativeLab() {
  const [draftLength, setDraftLength] = useState(3);
  const [match, setMatch] = useState(80);
  const accepted = Math.round(draftLength * match / 100);
  return <div className={styles.lab} aria-label="投机解码接受率实验"><div className={styles.labTop}><span>LOCAL ACCEPTANCE CHECK</span><strong>改变草稿长度和匹配率</strong></div><div className={styles.specLab}><div className={styles.specSettings}><label>草稿 token 数：{draftLength}<input type="range" min="1" max="6" value={draftLength} onChange={event => setDraftLength(Number(event.target.value))} /></label><label>草稿与验证器匹配率：{match}%<input type="range" min="20" max="100" step="10" value={match} onChange={event => setMatch(Number(event.target.value))} /></label></div><div className={styles.specBoard}><h3>本轮验收桌</h3><div className={styles.draftStrip}>{Array.from({ length: draftLength }, (_, index) => <span className={styles.tokenPill} data-accepted={index < accepted} data-rejected={index === accepted && accepted < draftLength} key={index}>{["明", "天", "有", "阵", "雨", "夹"][index]}</span>)}</div><div className={styles.specStatus} role="status" aria-live="polite"><strong>{accepted}/{draftLength} 个草稿被接受。</strong> {accepted < draftLength ? "拒绝处之后会回到验证器的分布继续写。" : "这一轮没有回滚，但下一轮仍要重新验证。"}</div></div></div></div>;
}

export function SpeculativeDecodingTermPage() {
  return <Article slug="speculative-decoding" title="投机解码" subtitle="Speculative Decoding · 让小模型先写草稿，大模型负责盖章" sources={speculativeDecodingSources} sections={[["speculative-definition", "它为什么能省等待"], ["speculative-verification", "拒绝时为什么不会留下假 token"], ["speculative-lab", "匹配率怎样改变收益"], ["speculative-boundary", "速度收益不是固定折扣"]]} hero={<SpeculativeHero />} intro={<>投机解码让一个较小的草稿模型先提出多个 token，再由目标模型一次验证。<strong>被接受的草稿可以少走几次完整解码；不匹配的位置会回到目标模型的分布重新采样。</strong></>}>
    <ArticleSection id="speculative-definition" title="它为什么能省等待"><p id="speculative-definition" className="vp-citation-target"><strong>投机解码把“小模型提出、大模型验证”放在同一轮生成里。</strong>Leviathan 等人的方法用草稿模型生成候选 token，目标模型并行检查；Hugging Face 也把它和搜索、采样区分开，强调它是加速策略。<Cite id="speculative-definition" sources={speculativeDecodingSources} /></p><p>如果草稿很接近目标模型，一次验证可以接受多个 token，用户等待的目标模型迭代次数就可能下降。这里的“可能”很重要，因为匹配率和硬件决定真实收益。</p></ArticleSection>
    <ArticleSection id="speculative-verification" title="拒绝时为什么不会留下假 token"><p id="speculative-verification" className="vp-citation-target">目标模型会按自己的概率分布验证草稿；对不符合的 token，算法重新采样而不是把草稿硬塞进最终序列。论文的核心性质是保持目标分布，而不是保证每个草稿都被接受。<Cite id="speculative-verification" sources={speculativeDecodingSources} /></p><p>首图里的红色回滚故意停在“拒绝处”：读者能看到草稿是建议，不是事实。目标模型仍然拥有最终决定权。</p></ArticleSection>
    <ArticleSection id="speculative-lab" title="匹配率怎样改变收益"><SpeculativeLab /><p id="speculative-lab" className="vp-citation-target">实验只用固定 token 和整数计数，帮助你看见接受率怎样影响一轮中留下多少草稿；它没有测量真实吞吐。<Cite id="speculative-lab" sources={speculativeDecodingSources} /></p></ArticleSection>
    <ArticleSection id="speculative-boundary" title="速度收益不是固定折扣"><p id="speculative-boundary" className="vp-citation-target">投机解码的速度取决于草稿模型和目标模型的匹配、草稿长度、批处理、硬件和实现。论文在特定 T5 设置报告了加速，不能把论文里的倍数直接写成产品承诺。<Cite id="speculative-boundary" sources={speculativeDecodingSources} /></p><ArticleAside title="上线前要测的两个对照"><p>同一提示集分别跑目标模型单独解码与投机解码：一边记录 token 一致性和最终分布，一边记录首 token 延迟、总吞吐与回滚比例。</p></ArticleAside></ArticleSection>
  </Article>;
}

function BeamHero() {
  const [width, setWidth] = useState(2);
  const scores = [0.92, 0.77, 0.71, 0.66];
  return <figure className={styles.hero} aria-label="束搜索保留多个候选并剪掉低分候选"><div className={styles.heroTop}><span>BOOKMARK RACK / BEAM SEARCH</span><strong>保留 {width} 条候选</strong></div><div className={styles.beamHero}><div className={styles.beamRack}>{scores.map((score, index) => <div className={styles.beamCandidate} data-keep={index < width} data-drop={index >= width} key={score}><span>候选 {index + 1}</span><strong>{["去公园", "去商场", "去车站", "去医院"][index]}</strong><code>{score.toFixed(2)}</code></div>)}</div><div className={styles.beamMeta}><strong>{width}</strong><p>架书签先放在桌面上，下一次只从保留下来的候选继续展开。分数高代表模型更偏好，不代表现实中一定正确。</p></div></div><div className={styles.heroControls}>{[1, 2, 3].map(value => <button type="button" key={value} aria-pressed={width === value} onClick={() => setWidth(value)}>beam width {value}</button>)}</div><figcaption className={styles.heroCaption}>贪心只拿眼前最高的一本；束搜索让几本书签同时留下，等后面的词把总分拉开。</figcaption></figure>;
}

function BeamLab() {
  const [width, setWidth] = useState(2);
  const candidates = [["订单已发货", ".86"], ["订单已取消", ".78"], ["订单待处理", ".65"]];
  return <div className={styles.lab} aria-label="束宽与候选保留实验"><div className={styles.labTop}><span>CANDIDATE RACK / LOCAL SCORE</span><strong>调束宽，看保留集合变化</strong></div><div className={styles.beamLab}><label className={styles.beamControl}>beam width <input type="range" min="1" max="3" value={width} onChange={event => setWidth(Number(event.target.value))} /><strong>{width}</strong></label><div className={styles.beamTable}>{candidates.map(([label, score], index) => <div className={styles.beamCell} data-keep={index < width} key={label}><strong>{label}</strong><small>{index < width ? `保留 · 总分 ${score}` : `剪掉 · 总分 ${score}`}</small></div>)}</div></div></div>;
}

export function BeamSearchTermPage() {
  return <Article slug="beam-search" title="束搜索" subtitle="Beam Search · 把几条候选一起带到下一步" sources={beamSearchSources} sections={[["beam-definition", "它和贪心选择差在哪"], ["beam-search-space", "保留候选并不等于保留真相"], ["beam-lab", "束宽是一个取舍旋钮"], ["beam-boundary", "高分可能仍然走错"]]} hero={<BeamHero />} intro={<>束搜索在生成下一段文字时保留若干条候选序列，再按累计评分剪去较弱的候选。<strong>它扩大了模型自己的搜索视野，却没有把模型评分变成事实核验。</strong></>}>
    <ArticleSection id="beam-definition" title="它和贪心选择差在哪"><p id="beam-definition" className="vp-citation-target"><strong>贪心解码每一步只选眼前最高概率的 token；束搜索保留多个部分序列，之后按整体分数挑选。</strong>Hugging Face 把 beam search 描述为保留多个序列并选择更高总概率的策略；序列到序列研究和机器翻译系统都把它作为生成候选的常见方法。<Cite id="beam-definition" sources={beamSearchSources} /></p><p>“束”是候选书签的数量，不是并行专家的数量，也不是模型参数。束宽越大，计算与显存压力通常也越高。</p></ArticleSection>
    <ArticleSection id="beam-search-space" title="保留候选并不等于保留真相"><p id="beam-search-space" className="vp-citation-target">束搜索只在模型给出的概率空间里比较候选。它能避免某一步的局部选择锁死后续，但候选本身若没有覆盖正确事实，增加束宽也救不了答案。<Cite id="beam-search-space" sources={beamSearchSources} /></p><p>首图的候选是固定文案，分数只是演示用读数。产品里的分数通常不可直接解释成事实可信度，更不能替代来源、工具或人工确认。</p></ArticleSection>
    <ArticleSection id="beam-lab" title="束宽是一个取舍旋钮"><BeamLab /><p id="beam-lab" className="vp-citation-target">把束宽从 1 调到 3，页面会留下更多候选，也会把更低的候选带进后续比较。<Cite id="beam-lab" sources={beamSearchSources} /></p></ArticleSection>
    <ArticleSection id="beam-boundary" title="高分可能仍然走错"><p id="beam-boundary" className="vp-citation-target">序列到序列论文和 GNMT 的束搜索设置都是特定任务、模型与评分函数的实验结果；生成配置也会受长度惩罚、早停和采样设置影响。<Cite id="beam-boundary" sources={beamSearchSources} /></p><ArticleAside title="何时别盯着束宽"><p>如果任务要引用最新订单、法规或数据库记录，先让模型拿到可核查资料；不要用更宽的束去搜索一个没有证据的答案。</p></ArticleAside></ArticleSection>
  </Article>;
}

function CalibrationHero() {
  const [temperature, setTemperature] = useState(1);
  const aligned = temperature === 1.4;
  const heights = aligned ? [28, 43, 58, 73, 89, 96] : [18, 35, 48, 64, 79, 96];
  return <figure className={styles.hero} aria-label="置信度校准把预测概率与实际正确率放在同一把尺上"><div className={styles.heroTop}><span>THERMOMETER / CALIBRATION</span><strong>T = {temperature.toFixed(1)}</strong></div><div className={styles.calibrationHero}><div className={styles.thermometer} style={{ "--mercury": `${temperature * 42}%` } as CSSProperties}><b>{aligned ? "接近实际" : "偏乐观"}</b></div><div className={styles.calibrationCurve}>{heights.map((height, index) => <span className={styles.curveBar} data-mismatch={!aligned && index < 3} style={{ "--h": `${height}%` } as CSSProperties} key={index} />)}<small>每一桶：模型报出的置信度 ↔ 长期实际正确率</small></div></div><div className={styles.heroControls}>{[0.8, 1, 1.4, 1.8].map(value => <button type="button" key={value} aria-pressed={temperature === value} onClick={() => setTemperature(value)}>T {value.toFixed(1)}</button>)}</div><figcaption className={styles.heroCaption}>0.9 分不是“九成正确”的承诺；只有在长期分桶后，它才有机会成为可解释的概率。</figcaption></figure>;
}

function CalibrationLab() {
  const [temperature, setTemperature] = useState(1.4);
  const aligned = temperature === 1.4;
  return <div className={styles.lab} aria-label="置信度校准分桶实验"><div className={styles.labTop}><span>BUCKET CHECK / EMPIRICAL ACCURACY</span><strong>调整温度，观察分桶差距</strong></div><div className={styles.calibrationLab}><label className={styles.tempSlider}>temperature <input type="range" min="0.8" max="1.8" step="0.2" value={temperature} onChange={event => setTemperature(Number(event.target.value))} /><strong>{temperature.toFixed(1)}</strong></label><div className={styles.bucketGrid}>{["0.1", "0.3", "0.5", "0.7", "0.9"].map((label, index) => <div className={styles.bucket} data-close={aligned || index > 2} key={label}><strong>{label}</strong><small>预测</small><small>实际 {aligned ? label : ["0.02", "0.22", "0.41", "0.56", "0.73"][index]}</small></div>)}</div><p className={styles.labNote}>{aligned ? "分桶读数更接近：可以把置信度作为排序或拒答的一个输入。" : "分桶仍偏离：先别把概率显示给用户，也别用它直接当审批门槛。"}</p></div></div>;
}

export function ConfidenceCalibrationTermPage() {
  return <Article slug="confidence-calibration" title="置信度校准" subtitle="Confidence Calibration · 让数字更像它声称的把握程度" sources={confidenceCalibrationSources} sections={[["calibration-definition", "置信度到底在说什么"], ["calibration-temperature", "温度缩放改变了哪一层"], ["calibration-lab", "用分桶检查数字"], ["calibration-boundary", "校准也有失效场景"]]} hero={<CalibrationHero />} intro={<>置信度校准把模型报出的概率，调整到更接近长期实际正确率。<strong>它修的是“数字说得有多满”，不负责让错误答案变成正确答案。</strong></>}>
    <ArticleSection id="calibration-definition" title="置信度到底在说什么"><p id="calibration-definition" className="vp-citation-target"><strong>一个校准良好的模型，在报 0.8 的样本里，长期看应当大约有 80% 是正确的。</strong>Guo 等人将 calibration 定义为置信度与预测正确率之间的关系，并指出现代神经网络可能准确率不错但概率不校准。<Cite id="calibration-definition" sources={confidenceCalibrationSources} /></p><p>置信度是模型对自身预测的读数，不是事实来源，也不是“这次一定对”的保证。它要在一组足够大的、与使用场景相近的数据上检查。</p></ArticleSection>
    <ArticleSection id="calibration-temperature" title="温度缩放改变了哪一层"><p id="calibration-temperature" className="vp-citation-target">温度缩放在输出概率前调整 logits 的尺度，通常不重新训练整个模型；Guo 等人的实验发现它是简单而有效的校准方法之一。<Cite id="calibration-temperature" sources={confidenceCalibrationSources} /></p><p>首图的 T 旋钮只改变分布的“尖或平”，不会改掉哪个类别的排序。排序准确但概率过于自信时，校准可能有帮助；排序本身错了，温度不能替你换答案。</p></ArticleSection>
    <ArticleSection id="calibration-lab" title="用分桶检查数字"><CalibrationLab /><p id="calibration-lab" className="vp-citation-target">scikit-learn 的校准文档也用 reliability diagram 把预测概率与实际频率放到一起。<Cite id="calibration-lab" sources={confidenceCalibrationSources} /></p></ArticleSection>
    <ArticleSection id="calibration-boundary" title="校准也有失效场景"><p id="calibration-boundary" className="vp-citation-target">校准曲线依赖数据分布、标签质量和样本量；模型换到分布外输入后，原来的对齐关系可能不再成立。NIST 的风险框架也要求把测量范围和适用条件写清，而不是把一个概率数字当成通用安全证明。<Cite id="calibration-boundary" sources={confidenceCalibrationSources} /></p><ArticleAside title="把校准用在什么动作上"><p>它可以帮助排序、选择人工复核或设定拒答门，但先固定数据切分，再观察阈值改变带来的漏报、误报和覆盖率。</p></ArticleAside></ArticleSection>
  </Article>;
}

function ContaminationHero() {
  const [leaked, setLeaked] = useState(true);
  return <figure className={styles.hero} aria-label="数据污染把评测题提前放进训练资料"><div className={styles.heroTop}><span>SEALED EXAM / DATA CONTAMINATION</span><strong>{leaked ? "发现泄漏" : "独立切分"}</strong></div><div className={styles.contaminationHero}><div className={styles.vault} data-leaked={leaked}><h3>训练资料</h3><div className={styles.paperStack}>{["题库 A", "网页摘录", leaked ? "评测题 17" : "新题 17"].map((label, index) => <span className={styles.paper} data-leaked={leaked && index === 2} key={label}>{label}</span>)}</div><div className={styles.vaultStatus}>{leaked ? "评测题已经在训练资料里出现" : "评测题与训练资料隔离"}</div></div><div className={styles.vault}><h3>公开评测</h3><div className={styles.paperStack}><span className={styles.paper}>{leaked ? "题 17 · 已见过" : "题 17 · 未见过"}</span><span className={styles.paper}>题 18 · 未知</span></div><div className={styles.vaultStatus}>{leaked ? "高分可能包含记忆" : "分数更接近独立泛化"}</div></div></div><div className={styles.heroControls}><button type="button" aria-pressed={leaked} onClick={() => setLeaked(true)}>打开泄漏</button><button type="button" aria-pressed={!leaked} onClick={() => setLeaked(false)}>封存评测题</button></div><figcaption className={styles.heroCaption}>考前见过题，再高的分也很难说明“遇到新题会不会做”。</figcaption></figure>;
}

function ContaminationLab() {
  const [leaked, setLeaked] = useState(true);
  return <div className={styles.lab} aria-label="数据污染与评测独立性实验"><div className={styles.labTop}><span>BENCHMARK INTEGRITY CHECK</span><strong>切换泄漏证据</strong></div><div className={styles.contaminationLab}><div className={styles.contamToggle}><button type="button" aria-pressed={leaked} onClick={() => setLeaked(true)}>训练集包含测试题</button><button type="button" aria-pressed={!leaked} onClick={() => setLeaked(false)}>测试题独立封存</button><p className={styles.labNote}>{leaked ? "先暂停比较，不把分数写成泛化能力。" : "可以继续记录切分方式和去重证据。"}</p></div><div className={styles.scoreBoard}><div className={styles.scoreLine} data-risk={leaked}><span>公开分数</span><i style={{ "--score": `${leaked ? 94 : 78}%` } as CSSProperties} /><strong>{leaked ? "94" : "78"}</strong></div><div className={styles.scoreLine}><span>可比性</span><i style={{ "--score": `${leaked ? 28 : 84}%` } as CSSProperties} /><strong>{leaked ? "低" : "较高"}</strong></div><div className={styles.scoreLine}><span>需要补证据</span><i style={{ "--score": `${leaked ? 92 : 32}%` } as CSSProperties} /><strong>{leaked ? "是" : "少量"}</strong></div></div></div></div>;
}

export function DataContaminationTermPage() {
  return <Article slug="data-contamination" title="数据污染" subtitle="Data Contamination · 先确认考题有没有提前泄露" sources={dataContaminationSources} sections={[["contamination-definition", "为什么一套题不再独立"], ["contamination-detection", "泄漏证据怎么找"], ["contamination-lab", "把分数和可比性拆开"], ["contamination-boundary", "没有发现不等于没有污染"]]} hero={<ContaminationHero />} intro={<>数据污染发生在评测数据或其近似内容提前进入训练、微调或提示资料。<strong>它会让模型看起来像是在解决新题，实际却可能是在复述见过的材料。</strong></>}>
    <ArticleSection id="contamination-definition" title="为什么一套题不再独立"><p id="contamination-definition" className="vp-citation-target"><strong>当基准题出现在训练资料中，测试集就不再能独立衡量泛化。</strong>Dodge 等人把评测集进入训练拆分视为严重污染，会带来虚高分数和错误结论；污染综述也把记忆、重复和间接泄漏区分为不同风险。<Cite id="contamination-definition" sources={dataContaminationSources} /></p><p>“模型回答对了”仍然是事实，但这个事实不再支持“它会做没见过的题”。先把题目是否独立说清，分数才有解释空间。</p></ArticleSection>
    <ArticleSection id="contamination-detection" title="泄漏证据怎么找"><p id="contamination-detection" className="vp-citation-target">检测通常会查训练语料与测试题的精确匹配、近似匹配、时间切分和资料来源；研究也提醒，训练数据常常不完整或不可见，检测结果很难证明绝对没有泄漏。<Cite id="contamination-detection" sources={dataContaminationSources} /></p><ContaminationLab /><p>本实验把“分数高”和“可比性高”放在两条独立横条上：泄漏时分数仍高，但可比性下降；封存后分数可能降低，证据反而更干净。</p></ArticleSection>
    <ArticleSection id="contamination-lab" title="把分数和可比性拆开"><p id="contamination-lab" className="vp-citation-target">这组固定数字不是模型评测，只是把“污染风险”从分数里剥出来。真正的报告应写明数据来源、时间范围、去重方法和哪些样本被排除。<Cite id="contamination-lab" sources={dataContaminationSources} /></p><p>如果不能公开完整训练集，就至少给出可审计的排除规则、近似匹配阈值和独立复测结果，避免把一个无法复核的百分比当成结论。</p></ArticleSection>
    <ArticleSection id="contamination-boundary" title="没有发现不等于没有污染"><p id="contamination-boundary" className="vp-citation-target">综述和污染研究都强调，公开资料、重复网页、合成数据和提示注入可能让泄漏路径复杂化；一次去重扫描无法覆盖全部情况。<Cite id="contamination-boundary" sources={dataContaminationSources} /></p><ArticleAside title="给评测单加一枚封条"><p>每次发布模型时保存题目版本、生成时间、去重报告与独立集摘要。下一轮评测先检查封条，再比较分数。</p></ArticleAside></ArticleSection>
  </Article>;
}

function OodHero() {
  const [ood, setOod] = useState(false);
  const confidence = ood ? 88 : 72;
  return <figure className={styles.hero} aria-label="分布外样本在模型高置信度下仍可能是陌生输入"><div className={styles.heroTop}><span>INCOMING INSPECTION / OOD</span><strong>{ood ? "陌生分布" : "训练分布"}</strong></div><div className={styles.oodHero}><div className={styles.sampleCard} data-ood={false}><h3>训练过的摄像头</h3><p>同一地点、相似光线、熟悉角度。</p><span className={styles.confidenceTag}>confidence 72%</span><span className={styles.gateLine}><i style={{ "--gate": "72%" } as CSSProperties} /></span></div><div className={styles.sampleCard} data-ood={ood}><h3>{ood ? "陌生摄像头" : "换一张同类照片"}</h3><p>{ood ? "换了医院和夜间光线，类别仍然相似。" : "输入仍落在已见过的范围。"}</p><span className={styles.confidenceTag}>confidence {confidence}%</span><span className={styles.gateLine}><i style={{ "--gate": `${confidence}%` } as CSSProperties} /></span></div></div><div className={styles.heroControls}><button type="button" aria-pressed={!ood} onClick={() => setOod(false)}>同分布</button><button type="button" aria-pressed={ood} onClick={() => setOod(true)}>换医院与夜间</button></div><figcaption className={styles.heroCaption}>陌生输入不一定会让置信度自动下降；验收台要有“我没见过”的出口。</figcaption></figure>;
}

function OodLab() {
  const [shift, setShift] = useState("地点");
  const readout: Record<string, [string, string]> = { 地点: ["医院 B", "输入分布已变，先转人工复核"], 时间: ["夜间", "光线变化，置信度不能直接当答案"], 相机: ["新镜头", "传感器变化，重新评估阈值"] };
  const [label, note] = readout[shift];
  return <div className={styles.lab} aria-label="分布外输入与拒答门实验"><div className={styles.labTop}><span>SHIFT GATE / LOCAL CHECK</span><strong>每次只改变一个分布因素</strong></div><div className={styles.oodLab}><div className={styles.shiftControls}>{Object.keys(readout).map(value => <button type="button" key={value} aria-pressed={shift === value} onClick={() => setShift(value)}>{value}</button>)}</div><div className={styles.oodReadout}><div><strong>当前变化：{label}</strong><small>{note}</small></div><div><strong>动作：暂缓自动通过</strong><small>把 OOD 侦测、置信度和业务阈值分开记录。</small></div></div></div></div>;
}

export function OutOfDistributionTermPage() {
  return <Article slug="out-of-distribution" title="分布外" subtitle="Out-of-Distribution · 先承认这类输入可能没见过" sources={outOfDistributionSources} sections={[["ood-definition", "什么叫训练分布之外"], ["ood-confidence", "高置信为什么仍会错"], ["ood-lab", "每次只换一个环境因素"], ["ood-boundary", "检测器也不是安全证明"]]} hero={<OodHero />} intro={<>分布外（OOD）输入与训练数据的来源、地点、时间、设备或任务条件不同。<strong>模型仍可能给出很满的概率，因此“高置信”与“熟悉输入”必须分开检查。</strong></>}>
    <ArticleSection id="ood-definition" title="什么叫训练分布之外"><p id="ood-definition" className="vp-citation-target"><strong>当训练和测试输入来自不同分布，后者就可能是分布外或分布发生了偏移。</strong>Hendrycks 与 Gimpel 讨论了用置信度识别错误与 OOD 的基线；WILDS 则用医院、摄像头、时间和地点等真实变化展示了分布偏移。<Cite id="ood-definition" sources={outOfDistributionSources} /></p><p>OOD 不只是一张完全陌生的图片，也可能是同一任务在新医院、新季节或新设备上的数据。边界应写在业务场景里，不是只靠一个“陌生/熟悉”按钮。</p></ArticleSection>
    <ArticleSection id="ood-confidence" title="高置信为什么仍会错"><p id="ood-confidence" className="vp-citation-target">最大 softmax 概率等简单分数可作为基线，但研究指出它们不能在所有分布变化上可靠区分 OOD。模型可能把陌生输入投到一个熟悉类别，并报出很高置信。<Cite id="ood-confidence" sources={outOfDistributionSources} /></p><p>首图特意让陌生摄像头的读数更高：它要打破“陌生就会低分”的直觉。生产系统应把 OOD 分数、模型置信度与拒答/人工动作分别记录。</p></ArticleSection>
    <ArticleSection id="ood-lab" title="每次只换一个环境因素"><OodLab /><p id="ood-lab" className="vp-citation-target">WILDS 的基准按具体环境变化组织数据集；本实验让你一次只改变地点、时间或相机，帮助定位哪种变化触发了风险。<Cite id="ood-lab" sources={outOfDistributionSources} /></p></ArticleSection>
    <ArticleSection id="ood-boundary" title="检测器也不是安全证明"><p id="ood-boundary" className="vp-citation-target">OOD 检测器自身也会受分布、阈值和数据质量影响；不确定性研究展示了分布变化下校准与可靠性会下降。<Cite id="ood-boundary" sources={outOfDistributionSources} /></p><ArticleAside title="拒答要有去处"><p>检测到可能 OOD 后，系统需要给出人工复核、补充资料或安全默认值，而不是只把一个红色标签丢给用户。</p></ArticleAside></ArticleSection>
  </Article>;
}

function PeftHero() {
  const [adapter, setAdapter] = useState("客服");
  return <figure className={styles.hero} aria-label="参数高效微调冻结基座模型只替换小适配器"><div className={styles.heroTop}><span>ADAPTER WALL / PEFT</span><strong>{adapter} 适配器已挂上</strong></div><div className={styles.peftHero}><div className={styles.baseModel}><h3>冻结的基座模型</h3><p>大部分参数保持原样，不随任务搬家。</p></div><div className={styles.adapterStack}><span className={styles.adapterSticker}>{adapter} adapter</span><small>少量可训练参数</small></div><div className={styles.taskOutput}><h3>任务输出</h3><p>{adapter === "客服" ? "语气更像订单支持" : adapter === "代码" ? "更偏向补全函数" : "保留基座回答"}</p></div></div><div className={styles.heroControls}>{["客服", "代码", "无"].map(value => <button type="button" key={value} aria-pressed={adapter === value} onClick={() => setAdapter(value)}>{value === "无" ? "取下适配器" : `挂上${value}`}</button>)}</div><figcaption className={styles.heroCaption}>换任务时换一张小磁贴，基座仍在墙上；省下的是训练和存储成本，不是验证工作。</figcaption></figure>;
}

function PeftLab() {
  const [adapter, setAdapter] = useState("客服");
  const active = adapter !== "无";
  return <div className={styles.lab} aria-label="参数高效微调适配器实验"><div className={styles.labTop}><span>FROZEN BASE / ADAPTER CHECK</span><strong>切换任务，不移动基座</strong></div><div className={styles.peftLab}><div className={styles.adapterSwitches}>{["客服", "代码", "无"].map(value => <button type="button" key={value} aria-pressed={adapter === value} onClick={() => setAdapter(value)}>{value === "无" ? "取下" : value}</button>)}</div><div className={styles.peftStats}><div className={styles.peftStat}><strong>{active ? "0.8%" : "0%"}</strong><small>可训练参数（演示值）</small></div><div className={styles.peftStat}><strong>{active ? "18 MB" : "0 MB"}</strong><small>适配器文件</small></div><div className={styles.peftStat}><strong>{active ? "任务偏置" : "基座默认"}</strong><small>当前输出</small></div></div><p className={styles.labNote}>{active ? "适配器只改变任务方向；仍需在目标任务和安全边界上评测。" : "取下后回到基座行为，说明适配器不是永久改写基座参数。"}</p></div></div>;
}

export function ParameterEfficientFineTuningTermPage() {
  return <Article slug="parameter-efficient-fine-tuning" title="参数高效微调" subtitle="Parameter-Efficient Fine-Tuning · 只搬一小块可训练的任务偏置" sources={parameterEfficientFineTuningSources} sections={[["peft-definition", "为什么只改一小部分参数"], ["peft-adapter", "适配器怎样挂在基座上"], ["peft-lab", "训练和存储成本如何变化"], ["peft-boundary", "小文件不代表小风险"]]} hero={<PeftHero />} intro={<>参数高效微调（PEFT）冻结大部分基座参数，只更新少量适配参数。<strong>它让多个任务共享一个基座，各自保存小适配器，但仍需要独立验证每个任务的行为。</strong></>}>
    <ArticleSection id="peft-definition" title="为什么只改一小部分参数"><p id="peft-definition" className="vp-citation-target"><strong>PEFT 的目标是减少训练时需要更新、保存和传输的参数。</strong>Hugging Face 将 LoRA、IA3、AdaLoRA、提示和前缀调优列为不同 PEFT 路线；LoRA 用低秩矩阵注入可训练更新。<Cite id="peft-definition" sources={parameterEfficientFineTuningSources} /></p><p>“少量”是相对基座大小而言，不是零参数，也不是只改一个提示词。适配器仍然包含任务信息，必须像代码和模型一样管理版本与权限。</p></ArticleSection>
    <ArticleSection id="peft-adapter" title="适配器怎样挂在基座上"><p id="peft-adapter" className="vp-citation-target">LoRA 把更新拆成较低秩的可训练矩阵；QLoRA 进一步研究了在量化基座上进行高效微调。<Cite id="peft-adapter" sources={parameterEfficientFineTuningSources} /></p><PeftLab /><p>本页的磁贴把“基座”和“任务偏置”分开：取下磁贴，输出回到基座默认；挂上另一张，基座不用重装。真实模型还要核对适配器兼容的层、量化格式和加载顺序。</p></ArticleSection>
    <ArticleSection id="peft-lab" title="训练和存储成本如何变化"><p id="peft-lab" className="vp-citation-target">PEFT 之所以轻，是因为反向传播需要保存的梯度和优化器状态更少；具体节省取决于方法、基座规模、序列长度和硬件。<Cite id="peft-lab" sources={parameterEfficientFineTuningSources} /></p><p>实验里的 0.8% 和 18 MB 是可读的示意，不是任何模型的通用指标。上线前应记录真实可训练参数、峰值显存、训练步数与任务效果。</p></ArticleSection>
    <ArticleSection id="peft-boundary" title="小文件不代表小风险"><p id="peft-boundary" className="vp-citation-target">QLoRA、LoRA 与提示调优的实验都依赖具体任务和模型；适配器小不代表它已经学会目标能力，也不代表基座的安全边界自动继承。<Cite id="peft-boundary" sources={parameterEfficientFineTuningSources} /></p><ArticleAside title="适配器发布清单"><p>把基座版本、训练数据、适配器版本、可用任务与已知失败样本一起发布；单独下载一张磁贴时，读者也要能知道它贴在哪块基座上。</p></ArticleAside></ArticleSection>
  </Article>;
}

function ModelCardHero() {
  const [missing, setMissing] = useState(false);
  return <figure className={styles.hero} aria-label="模型卡用折页说明用途数据指标和限制"><div className={styles.heroTop}><span>FOLDED RELEASE NOTE / MODEL CARD</span><strong>{missing ? "限制缺失" : "可审阅"}</strong></div><div className={styles.cardHero}><div className={styles.foldCard} data-missing={missing}><h3>MODEL CARD</h3><div className={styles.foldLine} style={{ "--w": "78%" } as CSSProperties} /><div className={styles.foldLine} style={{ "--w": "56%" } as CSSProperties} /><div className={styles.foldLine} style={{ "--w": missing ? "26%" : "69%" } as CSSProperties} /><div className={styles.foldLine} style={{ "--w": "44%" } as CSSProperties} /></div><div className={styles.foldStatus}><strong>{missing ? "先别发布" : "可以进入审阅"}</strong><p>{missing ? "没有把不适用场景和已知失败写出来，读者无法判断风险。" : "用途、数据、评测和限制都能在同一张卡里找到。"}</p></div></div><div className={styles.heroControls}><button type="button" aria-pressed={!missing} onClick={() => setMissing(false)}>补齐限制</button><button type="button" aria-pressed={missing} onClick={() => setMissing(true)}>折掉限制页</button></div><figcaption className={styles.heroCaption}>模型卡不是奖状，是让下一位使用者知道“能在哪用、不能在哪用”的折页。</figcaption></figure>;
}

function ModelCardLab() {
  const [checks, setChecks] = useState([true, true, false, true]);
  const labels = ["预期用途", "训练数据", "评测指标", "限制与已知失败"];
  const ready = checks.every(Boolean);
  return <div className={styles.lab} aria-label="模型卡发布清单实验"><div className={styles.labTop}><span>RELEASE GATE / MODEL CARD</span><strong>每一项都要能被下一位读者找到</strong></div><div className={styles.cardLab}><div className={styles.cardChecklist}>{labels.map((label, index) => <label data-checked={checks[index]} key={label}><input type="checkbox" checked={checks[index]} onChange={event => setChecks(current => current.map((item, itemIndex) => itemIndex === index ? event.target.checked : item))} />{label}</label>)}</div><div className={styles.releaseGate} data-blocked={!ready}><ShieldCheck size={21} aria-hidden="true" /><strong>{ready ? "RELEASE · 可审阅" : "HOLD · 还缺一页"}</strong><p>{ready ? "读者可以同时看到用途、证据和限制。" : "缺少限制或失败样本时，发布按钮应该保持灰色。"}</p></div></div></div>;
}

export function ModelCardTermPage() {
  return <Article slug="model-card" title="模型卡" subtitle="Model Card · 给模型附上一张能被追问的使用说明" sources={modelCardSources} sections={[["model-card-definition", "它要替谁回答什么问题"], ["model-card-sections", "一张卡至少折出哪些页"], ["model-card-lab", "发布前让限制过闸"], ["model-card-boundary", "有卡片仍不等于安全"]]} hero={<ModelCardHero />} intro={<>模型卡用结构化说明记录模型的用途、数据、评测特征和限制。<strong>它把“适不适合这个场景”的判断交给使用者，而不是只展示一个漂亮分数。</strong></>}>
    <ArticleSection id="model-card-definition" title="它要替谁回答什么问题"><p id="model-card-definition" className="vp-citation-target"><strong>模型卡是随模型发布的说明，帮助读者了解模型的性能特征、预期用途和不适用场景。</strong>Model Cards for Model Reporting 主张记录模型的背景、评测和限制，减少模型被放到不适合场景的风险；Google DeepMind 也把 model cards 作为模型发布信息的入口。<Cite id="model-card-definition" sources={modelCardSources} /></p><p>它不是“模型通过认证”的标志，也不是把所有责任转给用户。它的作用是让已有证据和未知之处更早露出来。</p></ArticleSection>
    <ArticleSection id="model-card-sections" title="一张卡至少折出哪些页"><p id="model-card-sections" className="vp-citation-target">Hugging Face 的模型卡文档把模型描述、预期用途、限制、训练数据和评测等内容放在同一份 README 风格的说明里。<Cite id="model-card-sections" sources={modelCardSources} /></p><p>读者可以把卡片当成一张反向提问表：用什么数据训的？在哪些条件测过？什么情况下会失败？缺哪一项，就把“暂时不知道”明确写出来。</p></ArticleSection>
    <ArticleSection id="model-card-lab" title="发布前让限制过闸"><ModelCardLab /><p id="model-card-lab" className="vp-citation-target">实验里的清单只检查说明是否出现，不检查内容是否真实；真实发布仍要把训练数据、评测脚本和失败样本交给评审。<Cite id="model-card-lab" sources={modelCardSources} /></p></ArticleSection>
    <ArticleSection id="model-card-boundary" title="有卡片仍不等于安全"><p id="model-card-boundary" className="vp-citation-target">模型卡提高了透明度，但不能自动修复偏差、泄漏、分布变化或错误部署。Model Cards 论文讨论的是报告和适用范围；风险框架仍要求围绕具体使用环境进行测量、治理和监控。<Cite id="model-card-boundary" sources={modelCardSources} /></p><ArticleAside title="让卡片跟着版本走"><p>模型、数据、适配器和部署配置变化时，重新生成卡片并标记差异。旧卡片留作历史记录，不要让它继续代表新版本。</p></ArticleAside></ArticleSection>
  </Article>;
}

