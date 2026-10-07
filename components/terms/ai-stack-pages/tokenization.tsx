import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { tokenizationSources } from "@/lib/ai-stack-concept-sources/tokenization";
import { TokenizationLesson } from "../ai-stack-lessons/tokenization";

const sections: [string, string][] = [["tokenizer-encoding", "模型实际收到什么"], ["tokenizer-bpe", "切分边界为什么不固定"], ["tokenizer-budget", "token 数怎样影响预算"]];

export function TokenizationTermPage() {
  return <Article slug="tokenization" title="分词" subtitle="Tokenization · 把字符串编码成模型词表里的 token" sources={tokenizationSources} sections={sections} hero={<Hero variant="split" trigger="同样一句中文，为什么换模型后 token 数不一样？" change="字符串 → 编码器切分 → token 编号序列" proof="BPE 和按词示意给出不同数量；真实结果取决于具体编码器" />} intro={<>分词是把字符串切成模型词表能识别的 token，并把每个片段映射成编号。token 可能是一个字、几个字的一部分、空格或符号；它不是固定长度的字符，也不是语言学上必然完整的词。</>}>
    <ArticleSection id="tokenizer-encoding" title="模型实际收到什么"><p>人看到的是“CSS 很好用”，模型接口通常先调用某个具体编码器，把它转成编号序列。模型接收的是这些编号，再用编号查找向量并继续处理。</p><p id="tokenizer-encoding-evidence" className="vp-citation-target">tiktoken 是一个具体的 BPE tokenizer 实现；它的编码结果由编码器词表和规则决定。<Cite id="tokenizer-encoding-evidence" sources={tokenizationSources} /></p><p id="tokenizer-count" className="vp-citation-target">OpenAI Cookbook 建议用实际模型对应的 tokenizer 统计输入和输出 token，因为字符数与 token 数不是同一个预算。<Cite id="tokenizer-count" sources={tokenizationSources} /></p><TokenizationLesson /></ArticleSection>
    <ArticleSection id="tokenizer-bpe" title="切分边界为什么不固定"><p id="tokenizer-bpe-evidence" className="vp-citation-target">BPE 会把常见的子词片段合并进词表，稀有字符串则可能被切成更小片段；Sennrich 等人的论文解释了子词单元如何处理罕见词。<Cite id="tokenizer-bpe-evidence" sources={tokenizationSources} /></p><p id="tokenizer-unigram" className="vp-citation-target">SentencePiece 把分词当作从词表中选择片段的模型，并可以直接处理没有空格的语言；它与 BPE 是不同的训练和切分路线。<Cite id="tokenizer-unigram" sources={tokenizationSources} /></p><p>演示用“BPE 示意”和“按词示意”故意给出不同数量，不把按词结果冒充任何真实编码器。</p></ArticleSection>
    <ArticleSection id="tokenizer-budget" title="token 数怎样影响预算"><p id="tokenizer-budget-evidence" className="vp-citation-target">token 统计会影响上下文窗口、输入输出限制和费用；不同模型可能使用不同词表，所以应在目标模型上实际计数。<Cite id="tokenizer-budget-evidence" sources={tokenizationSources} /></p><p id="tokenizer-boundary" className="vp-citation-target">Hugging Face 的 tokenizer 文档列出了 BPE、WordPiece、Unigram 等方法；没有“一个汉字一定是一个 token”的通用规则。<Cite id="tokenizer-boundary" sources={tokenizationSources} /></p><p><strong>读者判断</strong>：看到“这段文字有多少 token”时，先问是哪一个模型、哪一个 tokenizer、是否包含空格和特殊 token，再谈预算。</p></ArticleSection>
  </Article>;
}
