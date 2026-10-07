"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { temperatureConceptSources } from "@/lib/temperature-sources";
import { temperatureDistribution, pickTemperatureCandidate } from "@/lib/temperature-demo";
import styles from "./TemperatureConceptPage.module.css";

const candidates = ["带伞", "慢走", "看路"];
const colors = ["var(--accent-text)", "#bf9751", "#7299a5"];
const frames = [
  { label: "原来的机会", temperature: 1, draw: false },
  { label: "调低温度", temperature: 0.5, draw: false },
  { label: "抽到带伞", temperature: 0.5, draw: true },
  { label: "调高温度", temperature: 2, draw: false },
  { label: "同一落点换词", temperature: 2, draw: true },
];
const draws = [0.62, 0.94, 0.12, 0.78, 0.36, 0.55];

function ChanceWheel({ temperature, roll }: { temperature: number; roll: number | null }) {
  const distribution = temperatureDistribution(temperature);
  const picked = roll === null ? -1 : pickTemperatureCandidate(distribution, roll);
  const circumference = 2 * Math.PI * 56;
  let start = 0;
  return <div className={styles.wheelBoard}>
    <div className={styles.wheel}>
      <svg viewBox="0 0 180 180" aria-hidden="true">
        <circle cx="90" cy="90" r="56" className={styles.ringBase} />
        <g transform="rotate(-90 90 90)">{distribution.map((probability, index) => {
          const offset = -start * circumference;
          start += probability;
          return <circle key={candidates[index]} cx="90" cy="90" r="56" fill="none" stroke={colors[index]} strokeWidth="25" strokeDasharray={`${probability * circumference} ${circumference}`} strokeDashoffset={offset} className={styles.sector} />;
        })}</g>
        <g className={styles.needle} data-visible={roll !== null} style={{ transform: `rotate(${(roll ?? 0) * 360}deg)` }}><line x1="90" y1="90" x2="90" y2="17" /><circle cx="90" cy="17" r="5" /></g>
        <circle cx="90" cy="90" r="31" className={styles.hub} />
      </svg>
      <div className={styles.dialLabel}><span>温度</span><strong>{temperature.toFixed(1)}</strong></div>
    </div>
    <div className={styles.legend}>{candidates.map((candidate, index) => <div key={candidate} data-picked={picked === index} style={{ "--candidate-color": colors[index] } as CSSProperties}><i /><span>{candidate}</span><code>{(distribution[index] * 100).toFixed(1)}%</code></div>)}</div>
  </div>;
}

function TemperatureHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const roll = current.draw ? draws[0] : null;
  const picked = roll === null ? -1 : pickTemperatureCandidate(temperatureDistribution(current.temperature), roll);
  return <figure ref={scene.ref} className={styles.hero} aria-label="温度改变候选抽签面积的演示">
    <div className={styles.heroHeading}><span>出门记得<span className={styles.blank}>{picked < 0 ? "___" : candidates[picked]}</span></span></div>
    <ChanceWheel temperature={current.temperature} roll={roll} />
    <div className={styles.drawResult} role="status" aria-live="polite">{roll === null ? "候选面积随温度改变" : `同一落点 0.62 · 抽到「${candidates[picked]}」`}</div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} compact />
    <figcaption>教学示例，未调用模型。</figcaption>
  </figure>;
}

function TemperatureLab() {
  const [temperature, setTemperature] = useState(1);
  const [drawIndex, setDrawIndex] = useState<number | null>(null);
  const roll = drawIndex === null ? null : draws[drawIndex % draws.length];
  const picked = roll === null ? -1 : pickTemperatureCandidate(temperatureDistribution(temperature), roll);
  return <div className={styles.lab} role="region" aria-label="温度候选抽签实验">
    <div className={styles.labHeading}><strong>出门记得{picked < 0 ? "___" : candidates[picked]}</strong><span>本地演示 · 不调用模型</span></div>
    <div className={styles.labControls} role="group" aria-label="选择采样温度">{[0.5, 1, 2].map((value) => <button type="button" key={value} aria-pressed={temperature === value} onClick={() => { setTemperature(value); setDrawIndex(null); }}>{value === 0.5 ? "低温" : value === 1 ? "原分布" : "高温"} {value.toFixed(1)}</button>)}</div>
    <ChanceWheel temperature={temperature} roll={roll} />
    <div className={styles.labActions}><button type="button" onClick={() => setDrawIndex(0)}>用落点 0.62 抽一次</button><button type="button" onClick={() => setDrawIndex((index) => index === null ? 0 : index + 1)}>换个落点</button><button type="button" onClick={() => { setTemperature(1); setDrawIndex(null); }}>重置</button></div>
    <p className={styles.drawResult} role="status" aria-live="polite">{roll === null ? "尚未抽取" : `落点 ${roll.toFixed(2)} · 选中「${candidates[picked]}」`}</p>
  </div>;
}

const sections: [string, string][] = [["temperature-candidates", "下一小段文字怎样被选中"], ["temperature-chances", "调温度，改的是机会"], ["temperature-limits", "更稳定，也可能稳定地答错"], ["temperature-practice", "实际使用时怎样调"]];

export function TemperatureConceptTermPage() {
  return <Article slug="temperature" title="温度" subtitle="Temperature · 改变候选被选中的机会" sources={temperatureConceptSources} sections={sections} hero={<TemperatureHero />} intro={<>让 AI 写一句雨天提醒，第一次是“出门记得带伞”，第二次成了“出门记得慢走”。你在设置里看见了 temperature。<strong>这个数字会改变生成时的选择分布：低温更偏向原本占优势的候选，高温让其他候选也更有机会。</strong></>}>
    <ArticleSection id="temperature-candidates" title="下一小段文字怎样被选中">
      <p>先把一整段回答缩到一个小位置：“出门记得___”。模型会根据已经看到的文字，为接下来可能出现的片段打分。我们把候选简化成“带伞、慢走、看路”，原来的机会分别是 70%、20%、10%。这些数字是本站设定的例子。</p>
      <p>模型实际处理的片段叫 <ConceptTerm slug="token">token</ConceptTerm>，可能是一个字、一个词的一部分或符号。“带伞”在某个模型里未必恰好是一个 token；这里把它当成一枚候选，方便先看懂选择。选完这一小段，模型再根据新的前文继续选下一段，很多小步才连成完整回答。</p>
      <p id="temperature-definition" className="vp-citation-target">如果采用采样，就像在一个分成几块的抽签盘上落下一根针：某个候选所占的面积越大，被选中的机会越多。温度在抽取之前调整这些面积。Google 的生成指南将它定义为控制 token 选择随机程度的参数。<Cite id="temperature-definition" sources={temperatureConceptSources} /></p>
      <p id="temperature-generation" className="vp-citation-target">实际输出还会受模型版本和生成配置影响。OpenAI 的文档提醒，同一系列的不同模型快照也可能需要不同的提示方式；因此，本页的抽签盘只是把一个参数的作用单独拎出来观察。<Cite id="temperature-generation" sources={temperatureConceptSources} /></p>
    </ArticleSection>
    <ArticleSection id="temperature-chances" title="调温度，改的是机会">
      <p id="temperature-distribution" className="vp-citation-target">低温会放大原有的差距。在我们的例子里，温度从 1 降到 0.5，“带伞”的机会从 70% 增到约 90.7%；温度升到 2 时，它降到约 52.3%，“慢走”和“看路”各自得到更大的面积。最高候选仍是最高候选，只是领先多少变了。Holtzman 等人的论文给出了这种重新计算分布的方法。<Cite id="temperature-distribution" sources={temperatureConceptSources} /></p>
      <TemperatureLab />
      <p>先选低温，用落点 0.62 抽一次，再选高温，用同一个落点抽一次。输入、候选和落点都没有换，选中的词却变了：低温时那根针仍落在“带伞”里，高温时已经进入“慢走”的区域。差异来自温度改变了候选的面积。</p>
      <p>再点“换个落点”，会看到同一个温度也能选出不同的词。高温不会强迫每次都选最罕见的候选，低温也不等于取消一切随机。演示用一组固定落点方便比较，实际采样通常使用随机数；它只演示一小步，后续文字还会继续生成。</p>
      <ArticleAside title="想看计算方法"><p>若温度为 1 时的概率是 p，先计算 p 的 1/T 次方，再把结果除以总和，就得到本例调整后的分布。这等价于论文中对模型得分除以温度再做 softmax。T 必须大于 0；接口里的温度 0 通常按选择最高候选处理，不是直接除以零。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="temperature-limits" title="更稳定，也可能稳定地答错">
      <p>雨天提醒允许换措辞，所以给其他候选多一点机会可能有用。换成“这家店周日几点关门”，判断依据就不同了：你需要店家的营业时间，而不是一句更少见的回答。<strong>候选的生成概率，衡量的是这段文字被选中的机会；它不是“这句话正确”的概率。</strong></p>
      <p id="temperature-quality" className="vp-citation-target">温度能改变多样性，也可能影响重复和连贯程度。Holtzman 等人的研究在 GPT-2 的特定生成实验中观察了这些取舍；这些指标不能直接转换成所有模型、所有任务的事实正确率。<Cite id="temperature-quality" sources={temperatureConceptSources} /></p>
      <p id="temperature-evidence" className="vp-citation-target">如果输入里没有营业时间，降温没有增加一份资料。Google 的指南把提供上下文、用搜索取得新事实和运行代码计算，列为另外的处理办法。该查来源就查来源，该核对计算就核对计算；改变采样设置替不了这些工作。<Cite id="temperature-evidence" sources={temperatureConceptSources} /></p>
    </ArticleSection>
    <ArticleSection id="temperature-practice" title="实际使用时怎样调">
      <p id="temperature-api" className="vp-citation-target">先查看你使用的模型是否支持温度、默认值和最大值是什么。Gemini 的模型资料分别提供这些字段；不同接口的上限并不相同。本页的 0.5、1、2 是便于比较的教学值，不是给每个模型的一套推荐配置。<Cite id="temperature-api" sources={temperatureConceptSources} /></p>
      <p id="temperature-settings" className="vp-citation-target">还要留意采样是否真的开启。Hugging Face Transformers 将 <code>do_sample</code>、temperature、top-k、top-p 分开配置：选择最高候选的贪心模式，与按概率抽取的采样模式不同；另外两种参数会筛掉一部分候选。只抄一个 temperature 数字，未必能复现别人的输出。<Cite id="temperature-settings" sources={temperatureConceptSources} /></p>
      <p id="temperature-defaults" className="vp-citation-target">从模型默认配置开始，用相同任务样本比较一次只改一个参数的结果。例如 Google 当前明确建议 Gemini 3.x 保持默认采样参数，随意降低温度可能造成循环或表现退化。“越低越好”并不是通用规则。<Cite id="temperature-defaults" sources={temperatureConceptSources} /></p>
      <p>写标题、改文案，可以看结果是否够多样、是否仍符合要求；提取订单编号或回答事实题，要看字段是否正确、是否有来源。前者可以多试几种表达，后者需要明确约束和校验。评价标准先定下来，温度才有东西可调。</p>
    </ArticleSection>
  </Article>;
}
