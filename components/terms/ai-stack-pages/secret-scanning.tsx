import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { secretScanningSources } from "@/lib/ai-stack-concept-sources/secret-scanning";
import styles from "../ConceptArticle.module.css";
import { SecretScanningLesson } from "../ai-stack-lessons/secret-scanning";

const secretSections: [string, string][] = [["secret-need", "密钥进入仓库意味着什么"], ["secret-scope", "当前树和历史都要查"], ["secret-block", "在推送前停下来"], ["secret-response", "撤销、轮换和留痕"]];
export function SecretScanningTermPage() {
  const sources = secretScanningSources;
  const Lesson = SecretScanningLesson;
  return <Article slug="secret-scanning" title="密钥扫描" subtitle="Secret Scanning · 找出已经或将要泄露的凭据" sources={sources} sections={secretSections} hero={<Hero trigger="API Key 被提交了，删掉这一行够不够？" change="模式命中 → 历史定位 → 凭据失效" proof="当前树与旧提交都被发现，旧值变为 revoked" />} intro={<>密钥扫描在代码、提交历史和协作内容中识别可能泄露的密码、令牌或私钥。它负责发现和阻断，不会自动让已经泄露的凭据失效；处置的第一动作通常是撤销或轮换。</>}>
    <ArticleSection id="secret-need" title="密钥进入仓库意味着什么"><p>一次提交把生产 API Key（调用服务的凭据）写进了配置文件。即使下一次提交删除了这一行，旧提交仍可能被克隆、缓存或复制到构建产物。这个值应按已经泄露处理，而不是按“现在看不到了”处理。</p><p id="secret-detect" className="vp-citation-target">GitHub 的 secret scanning 使用供应商模式、通用模式和自定义规则识别疑似凭据，也可以配合有效性检查帮助排序风险。<Cite id="secret-detect" sources={sources} /></p><p>本页只显示掩码值，不展示真实 secret。读者需要关注的是范围和状态变化，而不是背诵某一种密钥格式。</p><Lesson /></ArticleSection>
    <ArticleSection id="secret-scope" title="当前树和历史都要查" className={styles.splitSection}><p id="secret-history" className="vp-citation-target">密钥扫描可以查看告警位置和扫描历史；只扫描 working tree（当前检出的文件）会漏掉旧提交、分支、Issue 或构建输出里的副本。<Cite id="secret-history" sources={sources} /></p><p>演示先看当前树，命中 1 处；切换到全历史后显示 3 处。这个差异解释了为什么“删掉当前文件”不是处置完成，也解释了为什么历史清理和凭据轮换需要同时安排。</p><p>测试密钥、假阳性和格式被拆分的值都可能影响结果。扫描器应该尽量不回显完整内容，并把误报、允许绕过和审计记录分开保存。</p></ArticleSection>
    <ArticleSection id="secret-block" title="在推送前停下来"><p id="secret-block-definition" className="vp-citation-target">GitHub 的 push protection（推送保护）会在凭据到达仓库前阻断推送，并要求提交者移除、确认误报或给出绕过理由；绕过本身会留下审计事件。<Cite id="secret-block-definition" sources={sources} /></p><p>阻断发生在副作用之前，所以修复成本通常小于上线后再追查历史。但一次 push protection 通过只说明这次推送的门禁结果，不能替代仓库历史和制品扫描。</p><p>如果扫描器无法确认供应商有效性，应保留 unknown 状态；unknown 不是安全，也不是 active。业务负责人仍要决定是否立即禁用相关权限。</p></ArticleSection>
    <ArticleSection id="secret-response" title="撤销、轮换和留痕"><p id="secret-rotate" className="vp-citation-target">OWASP 的秘密管理建议把创建、分发、轮换、撤销、过期和审计看成完整生命周期；发现一次泄露后，先让旧值失效，再让新值进入秘密存储。<Cite id="secret-rotate" sources={sources} /></p><p id="secret-lifecycle" className="vp-citation-target">NIST 的密钥管理指南也把密钥状态、生命周期和撤销作为管理对象；删除字符串不能改变已经授予的权限。active 表示旧凭据仍可能被接受，revoked 表示服务端已使它失效。<Cite id="secret-lifecycle" sources={sources} /></p><p><strong>停止条件</strong>：告警位置已定位、旧值已撤销或轮换、新值没有出现在代码和日志里，并且保留了谁在何时完成处置的记录。</p></ArticleSection>
  </Article>;
}
