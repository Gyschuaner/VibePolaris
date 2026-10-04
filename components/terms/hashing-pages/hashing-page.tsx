import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { hashingSources } from "@/lib/hashing-sources";
import { HashingHero } from "./hashing-hero";
import { HashingLesson } from "./hashing";

const sections: [string, string][] = [
  ["hash-definition-section", "先把输入压成指纹"],
  ["hash-change-section", "改一个字，摘要就换一张脸"],
  ["hash-password-section", "密码要加盐，还要慢一点"],
  ["hash-verify-section", "验证时重算，不要解密"],
];

export function HashingTermPage() {
  return <Article slug="hashing" title="哈希" subtitle="Hashing · 把输入压成一张可比对的指纹" sources={hashingSources} sections={sections} hero={<HashingHero />} intro={<>下载一个发布包时，你想确认“它有没有被改过”；保存一个密码时，你又不想把原文放进数据库。<strong>哈希把输入变成可重复计算的摘要，但不同用途需要不同的安全边界：文件要能对比，密码还要加盐并把猜测成本调高。</strong></>}>
    <ArticleSection id="hash-definition-section" title="先把输入压成指纹">
      <p id="hash-definition" className="vp-citation-target">哈希函数把任意长度的比特串映射成固定长度的比特串。NIST 把摘要比作文件或消息的指纹：它依赖输入的全部内容，却比原文短得多，适合拿来做“这次算出来的值”和“之前记录的值”的比较。<Cite id="hash-definition" sources={hashingSources} /></p>
      <p id="hash-properties" className="vp-citation-target">密码学哈希通常要求单向性和抗碰撞性：给定摘要，反推出一个对应输入应该很难；想找两份不同输入撞到同一个摘要，也应该在计算上不可行。这里的“难”是安全目标，不是数学上绝对不会发生碰撞。<Cite id="hash-properties" sources={hashingSources} /></p>
      <p>所以哈希和压缩软件不是一回事。压缩是为了之后还原，哈希是为了留下一个便于比较的结果；它没有“解压摘要”这条回程。</p>
    </ArticleSection>
    <ArticleSection id="hash-change-section" title="改一个字，摘要就换一张脸">
      <p id="hash-integrity" className="vp-citation-target">发布方可以先对 <code>release.tar</code> 计算摘要，把它放进清单；下载方再对本地文件计算一次。两串摘要相同，只能说明在这次比较里没有观察到内容变化；不相同则应停止继续使用，并回到来源检查。NIST 将消息摘要用于检测消息在生成摘要后是否被改变。<Cite id="hash-integrity" sources={hashingSources} /></p>
      <p id="hash-digest" className="vp-citation-target">摘要长度由算法决定，不会因为输入从一行文字变成一整个安装包就跟着变长。它是对输入的浓缩表示，不是输入的备份；首图把 `release.tar` 改一个字符后换成另一串演示摘要，就是这个边界的可视化。<Cite id="hash-digest" sources={hashingSources} /></p>
      <p>这也解释了为什么摘要对不上时不能“猜回原文”。你可以重新拿可信文件来计算、比较和定位差异，却不能从一串 `3a1c…9f` 把整个压缩包倒推出来。</p>
    </ArticleSection>
    <ArticleSection id="hash-password-section" title="密码要加盐，还要慢一点">
      <p id="hash-password-boundary" className="vp-citation-target">密码场景和文件校验不是同一条路。OWASP 明确区分了哈希和加密：密码验证应保存现代、适应性强的密码哈希，而不是保存明文或可逆密文；快速的 SHA-256 允许攻击者大量尝试，不适合直接拿来存密码。<Cite id="hash-password-boundary" sources={hashingSources} /></p>
      <p id="hash-salt" className="vp-citation-target">盐是一段每个账号独立生成的随机值，可以和结果一起保存。它不是拿来保密的；它的作用是让相同密码产生不同保存值，迫使攻击者按每份盐分别猜，不能把一次预计算结果复制给整张用户表。<Cite id="hash-salt" sources={hashingSources} /></p>
      <p id="hash-fast" className="vp-citation-target">密码 KDF 还要有可调成本。快速哈希让攻击者每秒试更多候选，密码存储应选专门的慢哈希并把参数调到服务自己能承受的范围。<Cite id="hash-fast" sources={hashingSources} /></p>
      <p id="hash-argon2" className="vp-citation-target">RFC 9106 把 Argon2 描述为 memory-hard 函数，参数里有内存大小、遍数和并行度；它们共同决定每次计算要占多少资源。<Cite id="hash-argon2" sources={hashingSources} /></p>
      <p id="hash-cost" className="vp-citation-target">成本不是越高越好：OWASP 建议在安全和登录性能之间调平，验证本身也不能被成本拖成新的拒绝服务入口。<Cite id="hash-cost" sources={hashingSources} /></p>
      <p id="hash-verifier" className="vp-citation-target">NIST 的密码验证指南把密码、盐和成本因子一起视为密码哈希方案的输入，并要求保存盐和结果，才能在验证时沿着同一条路线重算。<Cite id="hash-verifier" sources={hashingSources} /></p>
      <p id="hash-upgrade" className="vp-citation-target">算法版本和成本也要写进记录。硬件会变快，旧参数不能永远不动；登录成功时可以用当前输入按新参数升级记录。<Cite id="hash-upgrade" sources={hashingSources} /></p>
      <HashingLesson />
    </ArticleSection>
    <ArticleSection id="hash-verify-section" title="验证时重算，不要解密">
      <p id="hash-verify" className="vp-citation-target">登录时，服务器从记录中取出算法版本、盐和成本参数，把用户这次输入送进同一套 KDF，再比较新结果与保存结果。OWASP 把哈希称为单向函数：验证需要的是“是否相等”，不是把保存值解回密码。<Cite id="hash-verify" sources={hashingSources} /></p>
      <p>如果记录里没有算法版本和成本参数，未来升级会变得很笨重。把这些元数据和摘要放在一起，登录成功时就能发现旧参数，并在不拿到密码原文的情况下用当前输入重算一份更强的记录。</p>
      <p><strong>边界：</strong>哈希不能代替加密。需要稍后取回原文的地址、令牌或文件，应使用合适的加密方案和密钥管理；需要验证密码或检查文件有没有变，才是哈希更自然的位置。</p>
    </ArticleSection>
  </Article>;
}
