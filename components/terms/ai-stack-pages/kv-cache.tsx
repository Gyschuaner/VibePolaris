import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { kvCacheSources } from "@/lib/ai-stack-concept-sources/kv-cache";
import { KvCacheSignatureHero } from "../AiStackSignatureHeroes";
import { KvCacheLesson } from "../ai-stack-lessons/kv-cache";

const sections: [string, string][] = [
  ["kv-cache-prefix", "先把一段前缀放进抽屉"],
  ["kv-cache-state", "缓存的不是答案，是中间状态"],
  ["kv-cache-reuse", "相同前缀才能捡回旧积木"],
  ["kv-cache-boundary", "缓存也会满，也会搬家"],
];

export function KvCacheTermPage() {
  return <Article slug="kv-cache" title="KV Cache" subtitle="KV Cache · 保存注意力中间状态，减少生成时的重复计算" sources={kvCacheSources} sections={sections} hero={<KvCacheSignatureHero />} intro={<>模型逐 token 生成时，前面那一大段上下文不会突然变成废纸。KV cache 把注意力已经算出的 key 和 value 留在手边，下一步只带新的 query 来取。它像一套有位置的书签：能让重复计算少一点，却不负责记住模型权重，也不负责证明答案正确。</>}>
    <ArticleSection id="kv-cache-prefix" title="先把一段前缀放进抽屉">
      <p>第一次处理一段对话前缀时，模型要为每一层注意力计算相关的中间状态。下一 token 到来后，如果每次都从第一格重新算，前面已经做过的乘法会反复出现。KV cache 的出发点很朴素：把仍然会用到的 K 和 V 放在可以按位置取回的抽屉里。</p>
      <p id="kv-cache-recompute" className="vp-citation-target">Hugging Face 的 caching 说明用自回归生成解释了这份重复工作：预测更靠后的 token 时，旧上下文对应的注意力计算会再次参与；缓存此前 token 的 key/value，就能在后续步骤复用，而不用重新计算那一段。<Cite id="kv-cache-recompute" sources={kvCacheSources} /></p>
      <KvCacheLesson />
    </ArticleSection>
    <ArticleSection id="kv-cache-state" title="缓存的不是答案，是中间状态">
      <p id="kv-cache-qkv" className="vp-citation-target">注意力把 query、key、value 投影成矩阵。对因果注意力来说，过去 token 的 K 和 V 在未来位置不会因为“还没生成的 token”而改变，所以它们适合缓存；当前这一步的新 query 仍要拿来和这些 K 比较，再混合 V。缓存里没有一段可以直接展示给用户的完整回答。<Cite id="kv-cache-qkv" sources={kvCacheSources} /></p>
      <p id="kv-cache-definition" className="vp-citation-target">NVIDIA Dynamo 的术语表把 KV cache 定义为保存先前 token 的 key-value attention states，以避免推理时重复计算。这个定义也提醒我们：它属于一次运行的中间工作内存，和模型参数、训练数据、业务数据库是不同的东西。<Cite id="kv-cache-definition" sources={kvCacheSources} /></p>
      <p id="kv-cache-inference" className="vp-citation-target">缓存只适合推理路径。Hugging Face 明确提醒，训练时启用缓存可能产生意外错误；训练需要让计算图和梯度按训练目标工作，推理缓存则假定旧状态可以在后续 decode 中只读复用。<Cite id="kv-cache-inference" sources={kvCacheSources} /></p>
    </ArticleSection>
    <ArticleSection id="kv-cache-reuse" title="相同前缀才能捡回旧积木">
      <p id="kv-cache-prefix-reuse" className="vp-citation-target">如果许多请求共享完全相同的系统提示或文档前缀，服务可以把这段前缀预先算好，再让不同的后缀接着生成。Hugging Face 的 prefix caching 示例就是先填充一份 cache，再复制它给不同的后续 prompt；复用的是相同前缀的 K/V，不是把上一位用户的答案带进下一位用户的请求。<Cite id="kv-cache-prefix-reuse" sources={kvCacheSources} /></p>
      <p id="kv-cache-blocks" className="vp-citation-target">vLLM 的 PagedAttention 把 KV cache 切成固定 token 数的 blocks，每个 block 只存上下文的一部分。这样缓存管理不必为每个请求预留一条大而连续的内存带；演示里“命中第一块、后缀另算”就是这种按块管理的直觉模型。<Cite id="kv-cache-blocks" sources={kvCacheSources} /></p>
      <p id="kv-cache-paged" className="vp-citation-target">命中需要前缀和位置条件一致。只改一个系统词、换了 tokenizer 或模型配置，旧 block 就不能安全地当作新请求的 K/V；工程实现还要处理部分命中、写入和淘汰，不能把“相似”误当成“相同”。<Cite id="kv-cache-paged" sources={kvCacheSources} /></p>
    </ArticleSection>
    <ArticleSection id="kv-cache-boundary" title="缓存也会满，也会搬家">
      <p id="kv-cache-types" className="vp-citation-target">Hugging Face 提供 DynamicCache、StaticCache、QuantizedCache 等策略：动态缓存随生成增长，静态缓存预留固定容量以便编译，量化缓存用更低精度换内存。选哪一种，是速度、容量和实现约束之间的取舍，不是“缓存越大模型越聪明”。<Cite id="kv-cache-types" sources={kvCacheSources} /></p>
      <p id="kv-cache-memory" className="vp-citation-target">长上下文会让 KV cache 占掉可观的显存。Hugging Face 文档把 offload 和 quantization 都描述成内存与速度的权衡：把缓存搬到 CPU 或降低精度，可能缓解 OOM，却也可能增加搬运或量化开销。<Cite id="kv-cache-memory" sources={kvCacheSources} /></p>
      <p id="kv-cache-offload" className="vp-citation-target">NVIDIA Dynamo 的 offloading 指南把 KV blocks 的路径扩展到 host memory 或本地磁盘，让工作节点能容纳更多缓存并复用前缀。层级越远，搬运就越需要调度和监控；“能存下”不等于“每次取回都更快”。<Cite id="kv-cache-offload" sources={kvCacheSources} /></p>
      <p id="kv-cache-tier" className="vp-citation-target">Dynamo 的实现把 GPU、CPU 和 disk 看成不同缓存层，路由还可以按已有 KV overlap 选择更合适的 worker。命中率、容量、驱逐策略和 TTFT 应当一起观测；缓存命中只优化了计算路径，答案仍要沿正常的权限、证据和质量检查走。<Cite id="kv-cache-tier" sources={kvCacheSources} /></p>
      <p id="kv-cache-router" className="vp-citation-target">因此看到“KV-aware routing”时，理解成“尽量把请求送到已有前缀的 worker”更准确，而不是“路由器知道这次问题的答案”。Dynamo 术语表把 KV router 的目标写成按 cache overlap 导流；它改善的是资源位置和重复计算，不改变模型的知识边界。<Cite id="kv-cache-router" sources={kvCacheSources} /></p>
      <p><strong>带走一个检查顺序：</strong>先确认缓存保存的是哪一层、哪一段、哪种精度的 K/V；再看请求前缀是否真的相同、命中发生在哪个 block；最后把容量、迁移、驱逐和事实核验分开记录。缓存让路径更短，不会让证据变多。</p>
    </ArticleSection>
  </Article>;
}
