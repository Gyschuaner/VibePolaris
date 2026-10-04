import { ArrowRight, FileCode, Globe, Wrench } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { DevServerLesson } from "../ai-stack-lessons/dev-server";
import { devServerSources } from "@/lib/ai-stack-concept-sources/dev-server";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["dev-server-definition", "开发服务器正在提供什么"], ["dev-server-loop", "保存一次文件发生什么"], ["dev-server-boundary", "本地反馈的边界"]];

export function DevServerTermPage() {
  return <Article slug="dev-server" title="开发服务器" subtitle="Development Server · 让本地页面按请求得到最新模块" sources={devServerSources} sections={sections}
    hero={<ConceptHero slug="dev-server" label="浏览器请求本地模块，保存文件后由监听器和更新连接把反馈送回页面"><div className={styles.toolchainHero}><div className={styles.devServerHero}><div><FileCode size={22} /><span>button.css</span><code>保存一次</code></div><ArrowRight size={18} aria-hidden="true" /><div><Wrench size={22} /><span>localhost</span><code>按需处理</code></div><ArrowRight size={18} aria-hidden="true" /><div><Globe size={22} /><span>浏览器</span><code>看到变化</code></div></div><p className={styles.heroNote}>本地服务缩短反馈时间，生产服务的稳定性和安全配置仍是另一件事。</p></div></ConceptHero>}
    intro={<>你打开 `localhost` 后保存一个 CSS 或模块文件，页面很快就能看到变化。<strong>开发服务器在本机按请求提供资源，监听文件变化并把受影响的处理结果通过更新连接送回浏览器。</strong>它服务的是开发反馈，不是生产上线。</>}> 
    <ArticleSection id="dev-server-definition" title="开发服务器正在提供什么">
      <p id="dev-server-definition-text" className="vp-citation-target">开发服务器通常同时做两件事：给浏览器提供本地页面和模块，并在开发期间提供比静态文件服务器更多的反馈能力。Vite 把 dev server 和生产 build 命令分开列出，前者面向开发体验，后者生成生产静态资源。<Cite id="dev-server-definition-text" sources={devServerSources}/></p>
      <p id="dev-server-entry" className="vp-citation-target">本地项目的根目录和入口决定哪些 URL 可以被提供。以 Vite 为例，`index.html` 是开发期的入口，服务器把其中的模块引用解析为浏览器可以请求的地址；这不是把整个项目目录无条件暴露出去。<Cite id="dev-server-entry" sources={devServerSources}/></p>
      <ArticleAside title="它和生产服务器不是同一个承诺"><p id="dev-server-boundary-text" className="vp-citation-target">开发服务器可以为了快速反馈按需处理模块，甚至依赖内存中的中间产物；生产环境还要考虑构建产物、缓存、访问控制、容量和故障恢复。把 `localhost` 能访问误当成公网部署完成，会把两条链路混在一起。<Cite id="dev-server-boundary-text" sources={devServerSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="dev-server-loop" title="保存一次文件发生什么">
      <p id="dev-server-update" className="vp-citation-target">一次开发更新可以观察成四段：文件变化被监听，服务器处理受影响的模块，更新连接（常见实现是 WebSocket）发送消息，浏览器再选择整页刷新或模块级替换。更新连接只负责把变化或诊断送回页面，更新并不意味着所有模块都重新构建。<Cite id="dev-server-update" sources={devServerSources}/></p>
      <p>把手放在一个具体动作上：保存 `button.css`，先看变化事件落到监听器，再看服务器处理，最后看浏览器收到什么。切到“源码报错”，同一条路径会停在 `button.css:1:8`，页面保留旧模块，只叠出错误覆盖层；修好文件并再次保存，才会产生下一次有效更新。</p>
      <DevServerLesson />
      <p id="dev-server-hmr" className="vp-citation-target">如果工具和框架支持 HMR，更新连接可以只替换受影响的模块并保留部分运行状态；如果没有可接受的更新边界，就会退回整页刷新。开发服务器提供这条通道，但状态能否保留还取决于模块和框架的更新规则。<Cite id="dev-server-hmr" sources={devServerSources}/></p>
    </ArticleSection>
    <ArticleSection id="dev-server-boundary" title="本地反馈的边界">
      <p id="dev-server-proxy" className="vp-citation-target">开发时前端常需要访问另一个本地 API 服务，代理规则可以把 `/api` 请求转发到后端端口；这只改变开发请求的去向，不会自动为生产环境建立同样的网关、鉴权或 TLS 策略。<Cite id="dev-server-proxy" sources={devServerSources}/></p>
      <p id="dev-server-error" className="vp-citation-target">源码语法错误、模块解析失败或端口冲突都可能让开发反馈停住。诊断里需要同时看文件、行列和服务器日志；修复文件后，下一次监听事件才会产生新的处理结果。<Cite id="dev-server-error" sources={devServerSources}/></p>
      <p id="dev-server-http" className="vp-citation-target">底层 HTTP 服务器只是监听连接并响应请求；开发服务器在此之上增加了项目根目录、模块处理、代理和更新协议。理解这层关系，能避免把 Node 的 `http.createServer` 等同于完整的前端开发工具。<Cite id="dev-server-http" sources={devServerSources}/></p>
      <p><strong>读者判断</strong>：如果 `localhost` 页面更新正常，但上线后的静态地址没有新文件，先排查哪一层？答案是生产构建和部署产物；开发服务器只证明本地反馈链路工作。</p>
    </ArticleSection>
  </Article>;
}
