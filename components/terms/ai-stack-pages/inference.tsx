import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { inferenceSources } from "@/lib/ai-stack-concept-sources/inference";
import { InferenceSignatureHero } from "../AiStackSignatureHeroes";
import { InferenceLesson } from "../ai-stack-lessons/inference-hero";

const sections: [string, string][] = [
  ["inference-request", "先把一次请求送进模型"],
  ["inference-prefill-section", "整段读入，之后逐 token 写出"],
  ["inference-frozen-section", "推理会算，但不会学习"],
  ["inference-boundary", "快、完整和正确不是一回事"],
];

export function InferenceTermPage() {
  return <Article slug="inference" title="推理" subtitle="Inference · 用已经学到的参数处理一次输入并交付结果" sources={inferenceSources} sections={sections} hero={<InferenceSignatureHero />} intro={<>“推理”听起来像模型在想一个答案，工程上却更像一次有起点、有中间阶段、有停止条件的运行：输入先被整理，已经训练好的权重负责计算，生成模型再把输出一个 token 一个 token 地交出来。读懂这条路径，才分得清首字延迟、持续输出和真正的结果。</>}>
    <ArticleSection id="inference-request" title="先把一次请求送进模型">
      <p>你在客服页面输入“请说明订单 A17 的退款条件”，浏览器发出去的不是一团魔法，而是一份带任务和输入的请求。模型服务要先找到对应的模型和预处理器，把文字变成模型能接收的表示；结果出来后，还要经过后处理，才变回页面能展示的文本或标签。</p>
      <p id="inference-pipeline" className="vp-citation-target">Hugging Face 把 Pipeline 描述成一层推理 API：它把任务、预处理器、模型和后处理串在一起，外部只需交给它输入并接收输出。这个便利层不会改变模型已经学到的参数，也不会替应用替输入补上缺失事实。<Cite id="inference-pipeline" sources={inferenceSources} /></p>
      <p id="inference-components" className="vp-citation-target">因此看到“模型在推理”，要把几个角色分开：tokenizer 或其他 processor 负责把输入整理好，model 负责前向计算，post-process 负责把模型输出还原成任务结果。设备、数据类型和批大小也属于运行条件，不是模型知识本身。<Cite id="inference-components" sources={inferenceSources} /></p>
      <InferenceLesson />
    </ArticleSection>
    <ArticleSection id="inference-prefill-section" title="整段读入，之后逐 token 写出">
      <p id="inference-prefill" className="vp-citation-target">对生成式大模型，一次请求常被拆成两个节奏。<strong>Prefill</strong> 先处理已有上下文，并建立后续生成要用的中间状态；输入越长，这一段越像先把整叠材料读一遍。NVIDIA Dynamo 的分离式服务文档把这一步描述为由 prefill worker 计算前缀并生成 KV cache。<Cite id="inference-prefill" sources={inferenceSources} /></p>
      <p id="inference-decode" className="vp-citation-target">接着是 <strong>decode</strong>：模型拿着当前上下文预测下一个 token，把它接回上下文，再预测下一个。于是首 token 之前的等待和首 token 之后的逐步输出是两种不同的时间感；后续系统也可以把 prefill 与 decode 分到不同的 worker，但它们仍属于同一条请求路径。<Cite id="inference-decode" sources={inferenceSources} /></p>
      <p id="inference-latency" className="vp-citation-target">这也是为什么服务监控常把首 token 延迟和 token 间隔分开看。Dynamo 的文档指出，prefill 更偏计算密集，decode 更偏内存和逐步生成；把两段拆开，是为了按各自的负载分配硬件，不是把一次回答拆成两个互不相干的模型。<Cite id="inference-latency" sources={inferenceSources} /></p>
    </ArticleSection>
    <ArticleSection id="inference-frozen-section" title="推理会算，但不会学习">
      <p id="inference-mode" className="vp-citation-target">推理阶段使用的是已经保存的权重：它会做前向计算，产出 logits、标签或生成 token，但不会因为这一次请求就把新知识写回权重。PyTorch 的 <code>inference_mode</code> 进一步关闭 autograd 的部分开销，适合确定不需要梯度的评估或数据处理。<Cite id="inference-mode" sources={inferenceSources} /></p>
      <p id="inference-eval" className="vp-citation-target">有一个很容易踩的坑：PyTorch 明确说明，<code>inference_mode</code> 不会自动把模型切到 <code>eval()</code>。如果没有切换评估模式，dropout 或 BatchNorm 的运行统计可能仍按训练时的行为工作；“没有梯度”与“评估行为正确”是两个检查项。<Cite id="inference-eval" sources={inferenceSources} /></p>
      <p id="inference-output" className="vp-citation-target">生成接口还可能以流的形式返回结果：页面先收到几个 token，模型仍在继续计算，直到遇到结束标记、长度上限、取消或错误。Hugging Face 的 Pipeline API 区分输入、生成的文本和 token ids；因此 UI 已经显示一行文字，不代表服务已经完成，也不代表内容经过了事实核验。<Cite id="inference-output" sources={inferenceSources} /></p>
    </ArticleSection>
    <ArticleSection id="inference-boundary" title="快、完整和正确不是一回事">
      <p id="inference-batching" className="vp-citation-target">批处理、半精度、量化和专用推理引擎都可能改变吞吐、显存或延迟。Hugging Face 提醒，batch inference 是否更快取决于模型、数据和硬件；当产品受实时延迟约束时，盲目加大 batch 反而可能让排队变长。<Cite id="inference-batching" sources={inferenceSources} /></p>
      <p id="inference-optimization" className="vp-citation-target">TensorRT-LLM 的文档把自己的定位写得很具体：构建带优化的 TensorRT engine 和运行时，让大模型在 NVIDIA GPU 上更高效地执行推理。这类优化是在同一计算目标上换更合适的执行方式，不能被解释成“引擎因此知道更多事实”。<Cite id="inference-optimization" sources={inferenceSources} /></p>
      <p>把订单号拿掉时，模型仍然可以流畅地产生句子；把停止条件弄错时，页面也可能收到半截回答；把 <code>eval()</code> 漏掉时，代码甚至能正常跑完。它们分别是证据缺失、生命周期不完整和运行状态不对。判断一次推理是否可用，至少要同时问：输入有没有关键材料，模型是否按评估方式运行，输出有没有完整结束，最后的事实又由谁核对。</p>
      <p><strong>带走一个顺序：</strong>先看请求和输入，再看 prefill 到 decode 的阶段，接着确认权重是否只读、停止条件是否满足，最后才谈速度和答案质量。推理是一次运行过程，不是“模型已经想明白”的证明。</p>
    </ArticleSection>
  </Article>;
}
