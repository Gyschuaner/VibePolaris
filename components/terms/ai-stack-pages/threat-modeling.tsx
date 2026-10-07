import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { threatModelingSources } from "@/lib/ai-stack-concept-sources/threat-modeling";
import styles from "../ConceptArticle.module.css";
import { ThreatModelingLesson } from "../ai-stack-lessons/threat-modeling";

const threatSections: [string, string][] = [["threat-need", "先说清要保护什么"], ["threat-model", "节点、数据流与信任边界"], ["threat-control", "从攻击路径到可验证控制"], ["threat-boundary", "模型要随设计变化"]];
export function ThreatModelingTermPage() {
  const sources = threatModelingSources;
  const Lesson = ThreatModelingLesson;
  return <Article slug="threat-modeling" title="威胁建模" subtitle="Threat Modeling · 在设计里推演滥用路径" sources={sources} sections={threatSections} hero={<Hero variant="boundary" trigger="登录系统接入短信供应商，新增了哪些风险？" change="资产 + 数据流 + 信任边界 → 威胁与控制" proof="架构变化增加攻击路径，控制后仍保留残余风险" />} intro={<>威胁建模把系统、资产、参与者、数据流和信任边界放在一起，反过来问“什么可能出错、谁能利用、后果是什么、怎样降低风险”。它是设计生命周期中的持续分析，不是上线前填一次的表格。</>}>
    <ArticleSection id="threat-need" title="先说清要保护什么"><p>“给登录流程加短信验证”听起来只是多接一个 API，但它会让验证码、手机号和回执经过新的外部系统。没有先说清要保护的资产，团队很容易只讨论实现成功，不讨论伪造或泄露。</p><p id="threat-assets" className="vp-citation-target">NIST 将威胁建模描述为针对数据、应用、主机或系统的攻防风险评估；对象和范围应在分析开始时明确。<Cite id="threat-assets" sources={sources} /></p><p id="threat-process" className="vp-citation-target">OWASP 将它视为结构化、可重复的过程：建立模型、识别威胁、决定响应，再验证控制，而不是列出一串孤立名词。<Cite id="threat-process" sources={sources} /></p><Lesson /></ArticleSection>
    <ArticleSection id="threat-model" title="节点、数据流与信任边界" className={styles.splitSection}><p id="threat-boundary-definition" className="vp-citation-target">信任边界表示数据或控制从一个信任假设进入另一个信任假设的位置。浏览器、登录 API、数据库和外部短信服务的边界不同，不能因为它们都画在一张图上就视为同样可信。<Cite id="threat-boundary-definition" sources={sources} /></p><p>先画四条流：登录请求、验证码发送、短信回执和状态写回。再问每条流谁能伪造、篡改、重放或看到数据。STRIDE（常见威胁分类方法）可以帮助分类，但不能替代对这四条具体流的解释。</p><p>模型不是追求像素级完美的部署图。它只需要足够准确地暴露资产、边界和可被滥用的路径，供团队决定下一项控制。</p></ArticleSection>
    <ArticleSection id="threat-control" title="从攻击路径到可验证控制"><p id="threat-controls" className="vp-citation-target">Microsoft 的威胁建模工具把图上的元素与威胁分类、缓解措施和状态管理连接起来；控制需要有负责人和验证方式，才不会停在纸面。<Cite id="threat-controls" sources={sources} /></p><p>演示中新增签名校验后，伪造短信回执的高风险下降，但供应商泄露风险仍然存在。这种“风险降低但没有归零”的结果，比把一张清单全部打勾更诚实。</p><p id="threat-design" className="vp-citation-target">CISA 的 Secure by Design 方向强调把安全考虑前移到产品设计和默认配置，而不是等问题进入生产才补救。<Cite id="threat-design" sources={sources} /></p></ArticleSection>
    <ArticleSection id="threat-boundary" title="模型要随设计变化"><p>新增外部服务、改变数据字段、开放新角色或改变部署位置，都会改变攻击面。模型过时后，旧的控制可能看似存在，却保护不了新的路径。</p><p>威胁建模也不等于漏洞扫描或渗透测试：它先帮助团队选择“要验证什么”，后两者再用代码、配置和运行行为提供不同证据。</p><p><strong>停止条件</strong>：每项高风险都有控制、负责人和验证状态；设计变化能触发重新审查；剩余风险被明确记录而不是藏在“已完成”里。</p></ArticleSection>
  </Article>;
}
