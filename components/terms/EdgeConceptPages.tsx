import { CloudArrowDown, Globe, HardDrives, LockKey } from '@phosphor-icons/react/dist/ssr';
import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { GatewayLesson, ProxyLesson, ServerLesson } from './EdgeConceptLessons';
import { gatewaySources, proxySources, serverSources } from '@/lib/edge-concept-sources';
import base from './EventConcepts.module.css';
import s from './EdgeConcepts.module.css';

function Legacy({ slug, names }: { slug: string; names: string[] }) {
  return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true" />)}</>;
}

export function ServerTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={serverSources} />;
  return <ConceptArticle slug="server" title="服务器" sources={serverSources}
    intro={<>浏览器输入地址后，另一端要有程序接住请求，并决定返回什么。同一台电脑可以运行不止一个服务；能否连上某个地址，还要看相应程序是否在监听。</>}
    sections={[["role", "服务器是连接中的角色"], ["listen", "监听、匹配与回应"], ["host", "程序与主机"], ["diagnose", "失败发生在哪一步"]]}
    hero={<ConceptHero slug="server" label="浏览器请求到达8000端口的HTTP程序并收到200响应"><div className={s.serverHero}><div><Globe size={23} /><code>GET /books</code></div><div><HardDrives size={23} /><code>:8000 → 200</code></div><span>请求到达监听程序，程序生成响应</span></div></ConceptHero>}>
    <ArticleSection id="role" title="服务器是连接中的角色"><Legacy slug="server" names={['question', 'definition']} />
      <p id="server-role" className="vp-citation-target"><strong>在 HTTP 连接中，服务器是接受连接、处理请求并发出响应的程序角色。</strong>同一个程序在不同连接中也可能充当客户端，例如它再去请求另一项服务。这个称呼描述的是一次通信中的职责。<Cite id="server-role" /></p>
      <p>浏览器要看书目，就发送 <code>GET /books</code>。处理程序收到目标和方法后，查找对应资源或执行代码，再构造 <ConceptTerm slug="response">响应</ConceptTerm>。浏览器收到的是处理结果，不会因为网页上有“书目”按钮就自动得到数据。</p>
    </ArticleSection>
    <ArticleSection id="listen" title="监听、匹配与回应"><Legacy slug="server" names={['scene-heading']} />
      <p id="server-listen" className="vp-citation-target">Node.js 的 HTTP 示例先用 <code>createServer</code> 注册请求处理函数，再调用 <code>listen(8000)</code> 开始监听。建立了函数却没有启动监听时，客户端不能靠该端口把请求交给它。<Cite id="server-listen" /></p>
      <p>下面的主机只有 8000 端口运行教学 HTTP 程序。先访问书目，再改成不存在的路径，最后换到没有监听的端口。演示只在页面里计算结果，不发送真实网络请求。</p>
      <ServerLesson />
      <p id="server-handler" className="vp-citation-target">访问 <code>/missing</code> 时，连接已经交给程序，程序却找不到目标，因而给出 404；访问没有监听的端口，连请求处理函数都到不了。MDN 用找不到文档说明 404，Python 文档也把监听和具体请求处理函数分开描述。<strong>这两种失败不在同一层。</strong><Cite id="server-handler" /></p>
    </ArticleSection>
    <ArticleSection id="host" title="程序与主机" className={base.offset}><Legacy slug="server" names={['quiz-heading']} />
      <p id="server-hardware" className="vp-citation-target">日常说“服务器”也可能指运行服务的电脑。MDN 明确区分了硬件和软件：硬件提供运行与存储环境，HTTP 程序理解请求并交付内容。同一台主机可以运行多个程序，生产服务也可能由多台主机共同承载。<Cite id="server-hardware" /></p>
      <div className={s.paired}><div><h3>主机</h3><p>提供计算、网络与存储资源。知道机器开着，不等于指定服务已经启动。</p></div><div><h3>服务程序</h3><p>在特定地址和端口接收连接，按请求决定处理方式。它可能读取文件，也可能访问数据库。</p></div></div>
      <p id="server-port" className="vp-citation-target">Python 的 HTTPServer 示例用主机地址与端口建立监听；<code>--bind 127.0.0.1</code> 则只绑定本机地址。网页在自己电脑上能打开，却无法从其他设备访问时，应先检查绑定地址、端口和网络可达性，而不只检查页面代码。<Cite id="server-port" /></p>
    </ArticleSection>
    <ArticleSection id="diagnose" title="失败发生在哪一步"><Legacy slug="server" names={['prompt-heading']} />
      <blockquote className={s.quote}>先确认连接到哪台主机、哪个端口；<br />再检查程序怎样处理路径。</blockquote>
      <p>如果根本连不上，检查程序是否运行、监听地址是否对外可达，以及中间的网络限制。如果拿到 404，说明已经有一方回应，应继续核对路径和处理规则。若前面还有 <ConceptTerm slug="reverse-proxy">反向代理</ConceptTerm>，返回的错误也可能由代理产生，需要看具体响应和日志。</p>
      <ArticleAside title="服务器一定连接数据库吗？"><p>不一定。静态文件服务可以直接读文件；计算服务可以根据输入生成结果；应用服务才可能为了这次请求访问数据库。数据库是可选的依赖，不是“服务器”这个词的定义条件。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function ApiGatewayTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={gatewaySources} />;
  return <ConceptArticle slug="api-gateway" title="API 网关" sources={gatewaySources}
    intro={<>一个应用要调用订单和用户两项服务。客户端可以走同一个 API 入口；入口按约定检查请求、选择目标，再把可转交的请求送往后端。</>}
    sections={[["entry", "统一入口接住多项 API"], ["policy", "请求在哪一层停下"], ["route", "把通过的请求交给服务"], ["scope", "公共策略与业务处理"]]}
    hero={<ConceptHero slug="api-gateway" label="请求经过认证和配额后进入订单服务"><div className={s.gatewayHero}><div><Globe size={24} /><span>客户端请求</span></div><div><LockKey size={23} /><span>认证 · 配额</span></div><div><HardDrives size={24} /><span>订单服务</span></div></div></ConceptHero>}>
    <ArticleSection id="entry" title="统一入口接住多项 API"><Legacy slug="api-gateway" names={['question', 'definition']} />
      <p id="gateway-role" className="vp-citation-target"><strong>API 网关给客户端一个集中入口，并按配置把请求送到相应应用服务。</strong>它可以承担认证、限流等跨服务的接入规则。Azure 架构文档把它描述为一种反向代理，但也提醒各产品支持的附加能力并不相同。<Cite id="gateway-role" /></p>
      <p>客户端访问 <code>api.example.com/orders</code>，不必直接知道订单服务的内部地址。网关改变服务部署方式时，可以更新入口后的路由，而不要求所有调用方同时改地址。不过多了一层入口，也意味着入口自身需要监控和故障处理。</p>
    </ArticleSection>
    <ArticleSection id="policy" title="请求在哪一层停下"><Legacy slug="api-gateway" names={['scene-heading']} />
      <p id="gateway-auth" className="vp-citation-target">在 AWS 的 HTTP API 中，可以给路由配置授权器，决定请求是否获准继续。这里用“有效／无效凭据”演示这一分支，并不模拟真实签名或令牌解析。未通过时，后端服务的调用计数保持不变。<Cite id="gateway-auth" /></p>
      <p>本例把配额简化为两次成功转交。换请求路径、改凭据，或连续发到配额用尽，观察请求停在哪一层。数字只用于教学，不代表某个产品的默认阈值。</p>
      <GatewayLesson />
      <p id="gateway-limit" className="vp-citation-target">AWS 文档说明，超过其配置的请求速率与突发限制时，客户端可能收到 429；这些限制是尽力而为的目标，不应当成绝对精确的计数器。本例的“2 次”是离散教学规则，重点是看见请求在进入后端前被阻止。<Cite id="gateway-limit" /></p>
    </ArticleSection>
    <ArticleSection id="route" title="把通过的请求交给服务" className={base.offset}><Legacy slug="api-gateway" names={['quiz-heading']} />
      <p id="gateway-route" className="vp-citation-target">AWS HTTP API 用方法与资源路径确定路由，例如 <code>GET /pets</code>；没有匹配规则时，可能走默认路由，也可能直接返回未找到。<strong>认证通过只解决“能不能进入”，路由才决定“交给谁”。</strong><Cite id="gateway-route" /></p>
      <div className={s.paired}><div><h3>/orders</h3><p>转交订单服务。订单金额、库存等业务判断继续由相应服务完成。</p></div><div><h3>/users</h3><p>转交用户服务。统一入口没有把两个服务合成同一个程序。</p></div></div>
    </ArticleSection>
    <ArticleSection id="scope" title="公共策略与业务处理"><Legacy slug="api-gateway" names={['prompt-heading']} />
      <p id="gateway-boundary" className="vp-citation-target">Azure 架构文档把网关路由、聚合和公共能力卸载列为不同用法；具体产品对认证、限流和负载均衡的支持各异。设计时要逐项核对，不因为名称带“网关”就假定功能齐全。它也不能替订单服务决定退款是否合法。<Cite id="gateway-boundary" /></p>
      <p>若入口返回 401 或 429，先查网关策略与调用方条件；若请求已进入订单服务并返回业务错误，再查订单服务。把失败发生的位置写进日志和指标，比让所有错误都显示“网关异常”更容易排查。</p>
      <ArticleAside title="它与反向代理怎样分？"><p><ConceptTerm slug="reverse-proxy">反向代理</ConceptTerm>强调代表上游接入、转发与回传。API 网关可以使用这种转发能力，同时管理 API 路由和策略。两者在实现中可能重叠，不宜按产品名称推断完整职责。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function ReverseProxyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={proxySources} />;
  return <ConceptArticle slug="reverse-proxy" title="反向代理" sources={proxySources}
    intro={<>访客只看到一个公开域名，图片和应用页面却由不同上游提供。反向代理在公开入口接收请求，按规则转交，再把上游结果送回访客。</>}
    sections={[["position", "公开入口与背后的上游"], ["forward", "请求转交，响应返回"], ["headers", "转发头不是天然可信"], ["limits", "代理能做什么，不能保证什么"]]}
    hero={<ConceptHero slug="reverse-proxy" label="公开代理把图片请求转交给静态资源服务，再把响应带回客户端"><div className={s.proxyHero}><span>客户端</span><span><CloudArrowDown size={23} /> proxy.example</span><span>静态资源服务</span></div></ConceptHero>}>
    <ArticleSection id="position" title="公开入口与背后的上游"><Legacy slug="reverse-proxy" names={['question', 'definition']} />
      <p id="proxy-role" className="vp-citation-target"><strong>反向代理作为服务端的公开入口接收请求，再向后方服务发起请求。</strong>HTTP 规范也把这类中间方称作 gateway；它对外像源站，对内再与真实处理方通信。这里的“反向”是相对于替客户端出门访问的正向代理而言。<Cite id="proxy-role" /></p>
      <p id="proxy-public" className="vp-citation-target">Cloudflare 的反向代理说明展示了这一位置关系：客户端流量先到代理，再去源站，或者由代理代表源站处理部分请求。客户端使用公开域名，不需要知道每个上游的内部地址。<Cite id="proxy-public" /></p>
    </ArticleSection>
    <ArticleSection id="forward" title="请求转交，响应返回"><Legacy slug="reverse-proxy" names={['scene-heading']} />
      <p id="proxy-forward" className="vp-citation-target">NGINX 的 <code>proxy_pass</code> 把匹配的请求送到指定上游；代理取得上游响应后再交还客户端。路径是否被改写取决于规则，不能从“有代理”直接推断上游收到完全相同的 URL。<Cite id="proxy-forward" /></p>
      <p>把图片与应用路径切换一下。先点“转交请求”，再点“带回响应”，可以看到两个方向。下方地址栏只是教学示意，没有连接真实代理或上游。</p>
      <ProxyLesson />
      <p id="proxy-path" className="vp-citation-target">Apache 的 <code>ProxyPass</code> 可以只把特定路径映射给上游，其他路径留给本机处理。示例把 <code>/images</code> 分给静态资源服务，把 <code>/app</code> 分给应用服务；这两条是本站教学配置，不是 Apache 默认规则。<Cite id="proxy-path" /></p>
    </ArticleSection>
    <ArticleSection id="headers" title="转发头不是天然可信" className={base.offset}><Legacy slug="reverse-proxy" names={['quiz-heading']} />
      <p id="proxy-headers" className="vp-citation-target">NGINX 可以用 <code>proxy_set_header</code> 给上游请求设置 Host 等字段，也能传递代理看到的来源地址。应用要识别最初的客户端，往往要结合可信代理链与连接来源，而不能只看一条请求头字符串。<Cite id="proxy-headers" /></p>
      <p id="proxy-trust" className="vp-citation-target">Envoy 文档提醒，客户端可以伪造 <code>X-Forwarded-For</code>；只有可信代理加入的地址才可作为可信依据。本例中的 <code>1.2.3.4</code> 是伪造值，<code>198.51.100.8</code> 是预设的客户端地址。勾选错误信任后，应用读到伪造值，演示的是配置风险，不是真实 IP 探测。<Cite id="proxy-trust" /></p>
    </ArticleSection>
    <ArticleSection id="limits" title="代理能做什么，不能保证什么"><Legacy slug="reverse-proxy" names={['prompt-heading']} />
      <p id="proxy-redirect" className="vp-citation-target">上游如果返回指向内部地址的 <code>Location</code>，Apache 常用 <code>ProxyPassReverse</code> 改写响应头里的地址，使客户端继续走公开入口。代理转交的不止请求正文；响应字段也可能需要配置。<Cite id="proxy-redirect" /></p>
      <blockquote className={s.quote}>公开入口可以转交请求，<br />上游是否健康仍需另行判断。</blockquote>
      <p>反向代理可以再配置缓存、TLS 终止或负载分配，但页面里的两条路径没有自动具备这些功能。若上游没响应，代理也不能凭空造出业务成功；排查时把代理日志、上游日志和返回状态对应起来。</p>
      <ArticleAside title="为什么后端看到的是代理地址？"><p>上游的直接连接来自代理，连接来源自然是代理。若需要原始客户端信息，代理可以按配置传递相关字段；应用只应信任明确列入代理链的中间节点。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
