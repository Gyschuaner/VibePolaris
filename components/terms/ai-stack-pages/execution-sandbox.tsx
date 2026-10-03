import { ArticleSection } from "../ConceptArticle";
import { Article, Cite, Hero } from "../AiStackConceptPageShared";
import { executionSandboxSources } from "@/lib/ai-stack-concept-sources/execution-sandbox";
import { ContextRetrievalLesson } from "../ContextRetrievalLessonShared";

export function ExecutionSandboxTermPage() {
  const sections: [string, string][] = [["sandbox-scope", "先列出允许的资源"], ["sandbox-deny", "访问被拒也要有结果"], ["sandbox-limit", "隔离仍有边界"]];
  return <Article slug="execution-sandbox" title="执行沙箱" subtitle="Execution Sandbox · 在受限环境里运行不可信代码" sources={executionSandboxSources} sections={sections} hero={<Hero trigger="为什么让智能体运行代码时，不能直接给它整台机器？" change="文件、网络、进程和资源预算先被隔离" proof="越界请求被拒，超时后环境被销毁，输出仍需检查" />} intro={<>执行沙箱把代码放进隔离环境，并限制它能读写的文件、访问的网络、创建的进程和消耗的时间、内存等资源。沙箱降低了影响范围，却不是“绝对安全盒子”；宿主内核、运行时配置、输入和输出仍需防护。</>}>
    <ArticleSection id="sandbox-scope" title="先列出允许的资源"><p>一个处理表格的任务也许只需要临时目录、Python 和少量内存。它不需要读取项目密钥，也不需要访问任意外网。把允许的范围写成可检查的配置，才知道“隔离”具体隔离了什么。</p><p id="sandbox-runtime" className="vp-citation-target">OpenAI Code Interpreter 在沙箱化容器中运行 Python，并支持为容器指定文件和内存配置；容器是运行环境，不是把宿主机所有资源交给模型。<Cite id="sandbox-runtime" sources={executionSandboxSources} /></p><ContextRetrievalLesson mode="execution-sandbox" /></ArticleSection>
    <ArticleSection id="sandbox-deny" title="访问被拒也要有结果"><p id="sandbox-network" className="vp-citation-target">OpenAI 的沙箱安全文档要求根据工具连接所在环境配置网络访问，并通过受控的秘密注入和批准主机降低外传范围。<Cite id="sandbox-network" sources={executionSandboxSources} /></p><p>文件拒绝、网络拒绝和超时都是任务结果的一部分。应用要记录哪个请求被拦截、是否可以重试，以及标准输出是否可信；不能因为进程返回了一段文字就宣布脚本完成了目标。</p></ArticleSection>
    <ArticleSection id="sandbox-limit" title="隔离仍有边界"><p id="sandbox-isolation" className="vp-citation-target">Docker 的安全说明把 namespaces、cgroups、守护进程暴露面和运行时配置分别列为安全考虑；容器共享宿主内核，所以不能把容器自动当成完整虚拟机。<Cite id="sandbox-isolation" sources={executionSandboxSources} /></p><p id="sandbox-rootless" className="vp-citation-target">Rootless 模式让守护进程和容器以非 root 用户运行，降低部分越界后的影响；它仍有前置条件和限制。<Cite id="sandbox-rootless" sources={executionSandboxSources} /></p><p id="sandbox-boundary" className="vp-citation-target">NIST SP 800-190 将镜像、注册表、编排和运行时都纳入容器安全管理；沙箱配置正确也不能替代更新、监控和结果校验。<Cite id="sandbox-boundary" sources={executionSandboxSources} /></p></ArticleSection>
  </Article>;
}
