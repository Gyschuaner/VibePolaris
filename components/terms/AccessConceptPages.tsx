import type { CSSProperties } from 'react';
import { CheckCircle, HardDrives, IdentificationCard, LockKey, XCircle } from '@phosphor-icons/react/dist/ssr';
import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { AuthLesson, AuthorizationLesson, BalanceLesson } from './AccessConceptLessons';
import { authSources, authorizationSources, balanceSources } from '@/lib/access-concept-sources';
import s from './AccessConcepts.module.css';

export function LoadBalancerTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={balanceSources} />;
  return <ConceptArticle slug="load-balancer" title="负载均衡" sources={balanceSources}
    intro={<>同一项服务开了三台实例，请求不必都挤到第一台。入口可以从可用实例中选出一个，把这次请求交给它；下一次请求再作选择。</>}
    sections={[["distribution", "把请求分给可用实例"], ["round-robin", "轮流分配怎样工作"], ["health", "实例停用与恢复"], ["limits", "分流不等于修好服务"]]}
    hero={<ConceptHero slug="load-balancer" label="三个服务实例收到数量不同的请求"><div className={s.heroBalance}><span style={{'--height':'74%'} as CSSProperties}><HardDrives size={22} />实例 A<small>4 个请求</small></span><span style={{'--height':'58%'} as CSSProperties}><HardDrives size={22} />实例 B<small>3 个请求</small></span><span style={{'--height':'42%'} as CSSProperties}><HardDrives size={22} />实例 C<small>2 个请求</small></span></div></ConceptHero>}>
    <ArticleSection id="distribution" title="把请求分给可用实例">
      <p id="balance-role" className="vp-citation-target"><strong>负载均衡是在多个可接收请求的目标之间，按策略选择本次请求的处理者。</strong>入口可以保持不变，后面的服务实例却不止一个。NGINX 文档列出轮询、最少连接和基于客户端 IP 的选择方法；它们解决的是“送到哪台”，不是替实例执行业务逻辑。<Cite id="balance-role" /></p>
      <p>例如书目服务同时运行在 A、B、C 三台实例上。用户仍访问同一入口，均衡器把请求转给其中一台，再将处理结果交还客户端。它与 <ConceptTerm slug="reverse-proxy">反向代理</ConceptTerm>可以由同一个程序实现，但“代理”描述入口与转交位置，“均衡”描述多个目标之间的选择。</p>
      <p id="balance-targets" className="vp-citation-target">AWS 的 Application Load Balancer 用监听规则选择目标组，再把请求交给组内注册的目标；目标组配置协议、端口与健康检查。实际产品可能还有按路径选组、跨可用区等规则，不能把下方三台实例的教学图当作它的完整配置。<Cite id="balance-targets" /></p>
    </ArticleSection>
    <ArticleSection id="round-robin" title="轮流分配怎样工作">
      <p id="balance-round-robin" className="vp-citation-target">最容易观察的策略是轮询：若 A、B、C 都可用，请求依次落到 A、B、C，再从 A 开始。本例只模拟这种无权重的循环选择。NGINX 还支持最少连接、IP 哈希与权重；实际请求分布会受配置、连接与健康状态影响。<Cite id="balance-round-robin" /></p>
      <p>点击“送入一个请求”，看各实例的计数怎样变化；再点实例将它停用。计数记录已经交出的请求，不因停用而清零。</p>
      <BalanceLesson />
      <p id="balance-affinity" className="vp-citation-target">普通轮询并不保证同一用户的下一次请求仍去同一实例。若应用把会话只放在某台机器的内存里，切换实例可能看不到之前的状态；可以考虑共享会话存储，或按适用场景配置会话亲和。NGINX 文档把 IP 哈希列为一种保持客户端与实例关联的方法。<Cite id="balance-affinity" /></p>
    </ArticleSection>
    <ArticleSection id="health" title="实例停用与恢复">
      <p id="balance-health" className="vp-citation-target">均衡器需要知道目标能否接收流量。AWS 的健康检查定期向目标发请求，达到连续失败阈值后才将其标为不健康；恢复也要达到连续成功阈值。<strong>一次业务请求失败，不一定会立刻把实例移出。</strong><Cite id="balance-health" /></p>
      <div className={s.contrast}><div><h3>目标健康</h3><p>检查结果使某个实例暂时退出候选集合；后续请求在其余可用目标中选择。</p></div><div><h3>业务正确</h3><p>即使所有实例都通过简单的健康检查，同一段有缺陷的业务代码仍可能在每台实例上报错。</p></div></div>
      <p id="balance-steering" className="vp-citation-target">Cloudflare 的流量引导还会结合池与端点的健康状态、池集合及各层策略；目标变为不健康时，按这些策略重新分配。可见“故障时改发哪里”取决于产品和配置，不能只靠“有负载均衡”四个字保证。<Cite id="balance-steering" /></p>
    </ArticleSection>
    <ArticleSection id="limits" title="分流不等于修好服务">
      <blockquote className={s.quote}>入口能换一个处理者，<br />不能替处理者写出正确答案。</blockquote>
      <p id="balance-fail-open" className="vp-citation-target">所有目标都不健康时也没有统一的“自动成功”分支。例如 AWS Application Load Balancer 的文档说明，该目标组会发生 fail-open，仍把请求发给组中目标。设计故障预案时应核对所用产品的规则，并监控目标健康和真实请求结果。<Cite id="balance-fail-open" /></p>
      <ArticleAside title="均衡器一定能提升速度吗？"><p>请求分散后，单台实例的压力可能下降；但数据库瓶颈、下游限额、慢查询或客户端网络不会因此消失。扩容前后要看吞吐、延迟和错误位置，而不是只看实例数量。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function AuthTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={authSources} />;
  return <ConceptArticle slug="auth" title="认证" sources={authSources}
    intro={<>用户说“我是阿青”，服务不能仅凭这句话就相信。它要核对用户持有的凭据，再给后续请求一种可验证的身份状态。</>}
    sections={[["claim", "先核对身份声明"], ["session", "下一次请求怎样认出用户"], ["methods", "密码之外的证明方式"], ["boundary", "知道是谁，还不能决定能做什么"]]}
    hero={<ConceptHero slug="auth" label="凭据通过核验后得到可供后续请求使用的身份状态"><div className={s.heroAuth}><span><LockKey size={27} />核对凭据</span><span><IdentificationCard size={30} />阿青 · 已确认</span></div></ConceptHero>}>
    <ArticleSection id="claim" title="先核对身份声明">
      <p id="auth-definition" className="vp-citation-target"><strong>认证是核对某个主体是否掌握与所声明身份关联的凭据。</strong>NIST 把验证者、认证器和主体区分开：提交一个用户名只是提出身份声明，验证者还要检查认证器。通过后，服务才有理由把后续活动关联到该身份。<Cite id="auth-definition" /></p>
      <p>常见登录会要求账号和密码，但比较必须由可信服务端完成。网页表单把密码填进去的瞬间，不代表用户已经通过认证；服务端收到并核对后才给出结果。本页演示只切换“匹配／不匹配”的教学凭据，不收集真实密码。</p>
      <p id="auth-challenge" className="vp-citation-target">在 HTTP 自带的认证框架中，服务器可用带 <code>WWW-Authenticate</code> 的 401 响应提出认证要求，客户端随后携带凭据重试。网站登录表单和会话可以采用不同的交互形式，不是每次登录都必须出现这套 HTTP 挑战。<Cite id="auth-challenge" /></p>
    </ArticleSection>
    <ArticleSection id="session" title="下一次请求怎样认出用户">
      <p id="auth-session" className="vp-citation-target">登录成功不是只让当前页面显示一个名字。后续请求还需要携带可验证的会话信息，服务据此把请求关联到阿青。NIST 把浏览器 Cookie 等短期会话秘密与用于初始认证的认证器分开讨论：<strong>会话延续已建立的身份状态，不等于每次重新输入密码。</strong><Cite id="auth-session" /></p>
      <p>先提交匹配的教学凭据，再访问书架；切换为不匹配后重试。结果分别显示核验、会话建立和后续识别发生在何时。</p>
      <AuthLesson />
      <p>真实系统还要处理会话过期、撤销与盗用风险。用户退出后，应使旧会话不再被接受；只在前端把“已登录”字样隐藏起来，不足以终止服务端身份状态。详见 <ConceptTerm slug="session">会话</ConceptTerm>。</p>
    </ArticleSection>
    <ArticleSection id="methods" title="密码之外的证明方式">
      <p id="auth-webauthn" className="vp-citation-target">WebAuthn 使用另一种证明方式：服务生成挑战，认证器在用户同意后用先前注册的密钥生成签名断言，服务再验证它。这里依然是在证明对认证器的控制，并非“浏览器知道用户名”就算通过。不同方式的安全性质与部署要求各异。<Cite id="auth-webauthn" /></p>
      <div className={s.contrast}><div><h3>身份声明</h3><p>“我要以阿青的身份访问。”这只是待核对的说法。</p></div><div><h3>核验依据</h3><p>密码、密钥签名等凭据通过服务端检查后，才得到可信的身份结果。</p></div></div>
      <p id="auth-failure" className="vp-citation-target">登录失败的提示也有边界。OWASP 建议避免把“用户不存在”“密码错误”“账户锁定”分别暴露成可枚举的公开结果；页面对外可给出统一错误，同时在内部保留适当诊断与防护。<Cite id="auth-failure" /></p>
    </ArticleSection>
    <ArticleSection id="boundary" title="知道是谁，还不能决定能做什么">
      <blockquote className={s.quote}>认证告诉服务“这是阿青”，<br />授权才判断“阿青能否修改这份文档”。</blockquote>
      <p>一个已登录用户可能能读自己的资料，却不能改别人的项目。后续请求仍要按目标资源和操作做 <ConceptTerm slug="authorization">授权</ConceptTerm>检查。把“已登录”直接当成“拥有全部权限”，会让身份确认失去保护资源的意义。</p>
      <ArticleAside title="认证与注册是一回事吗？"><p>注册通常先创建账号及凭据绑定；认证是在后续访问时核对当前主体能否证明自己拥有该身份。初始身份核实、账号注册和每次登录也不能混为一个步骤。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function AuthorizationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={authorizationSources} />;
  return <ConceptArticle slug="authorization" title="授权" sources={authorizationSources}
    intro={<>服务已经认出阿青，仍要看她要访问哪份文档、做什么操作。同一个人能读一份文档，不代表能修改所有文档。</>}
    sections={[["decision", "一次请求要判断三件事"], ["policy", "规则如何给出允许或拒绝"], ["roles", "角色只是组织权限的一种办法"], ["response", "拒绝发生在执行之前"]]}
    hero={<ConceptHero slug="authorization" label="同一用户对两份文档的读取与修改权限不同"><div className={s.heroAuthorization}><span>自己的 · 读取 <CheckCircle size={20}/></span><span>自己的 · 修改 <CheckCircle size={20}/></span><span>别人的 · 读取 <CheckCircle size={20}/></span><span>别人的 · 修改 <XCircle size={20}/></span></div></ConceptHero>}>
    <ArticleSection id="decision" title="一次请求要判断三件事">
      <p id="authorization-definition" className="vp-citation-target"><strong>授权是在已知请求主体的前提下，判断它能否对指定资源执行指定操作。</strong>OWASP 强调检查要落到具体对象或功能；能访问一种资源，不表示能访问该类型的每个对象。<Cite id="authorization-definition" /></p>
      <p>阿青要修改一份文档，服务至少要知道谁在请求、文档属于谁、操作是读取还是修改。只检查“阿青已登录”会漏掉文档归属；只检查“这是文档”会漏掉操作差异。本例的规则是两人都能读两份文档，但只能修改自己的文档。</p>
    </ArticleSection>
    <ArticleSection id="policy" title="规则如何给出允许或拒绝">
      <p id="authorization-default" className="vp-citation-target">规则没有明确放行时，安全的起点是拒绝。OWASP 建议默认拒绝，而不是把未覆盖的新资源自动放行；随后再为有依据的请求增加允许规则。<Cite id="authorization-default" /></p>
      <p>选用户、文档和操作，再点击检查。改变任一输入会收起上一次结果；矩阵保留本例的规则，读者可以对照这次判断是否合理。</p>
      <AuthorizationLesson />
      <p id="authorization-policy" className="vp-citation-target">实际系统往往不止一张简单矩阵。例如 AWS IAM 默认隐式拒绝，需要有适用的允许语句；若有适用的显式拒绝，还会覆盖允许语句。这是 AWS 的策略求值规则，页面里的文档矩阵只是教学模型，不能直接当成 IAM 的全部行为。<Cite id="authorization-policy" /></p>
    </ArticleSection>
    <ArticleSection id="roles" title="角色只是组织权限的一种办法">
      <p id="authorization-role" className="vp-citation-target">当用户和权限很多时，可以把权限分配给角色，再把用户关联到角色。NIST 的 RBAC 研究把这种做法用于组织授权管理。但角色名本身不是最终结果：请求仍需结合实际资源与操作计算；“编辑者”也未必有权修改别人的文档。<Cite id="authorization-role" /></p>
      <div className={s.contrast}><div><h3>认证</h3><p>核对凭据，建立这次请求对应的用户身份。</p></div><div><h3>授权</h3><p>根据主体、资源、操作和适用规则，决定是否让操作继续。</p></div></div>
      <p id="authorization-every-request" className="vp-citation-target">一次页面加载时隐藏了按钮，也不能代替服务端检查。OWASP 要求针对所访问的具体对象或功能，在每次请求上执行访问控制；调用者可以绕过界面直接发请求。<Cite id="authorization-every-request" /></p>
    </ArticleSection>
    <ArticleSection id="response" title="拒绝发生在执行之前">
      <blockquote className={s.quote}>先判定能不能改，<br />再触碰那份文档。</blockquote>
      <p id="authorization-status" className="vp-citation-target">HTTP 规范区分缺少有效认证凭据的 401 与服务理解请求但拒绝执行的 403。有效凭据不足以获得访问权限时可用 403；也可能因其他原因拒绝。上面的教学例子假定身份已确认，因此无修改权限时显示 403，文档本身保持不变。<Cite id="authorization-status" /></p>
      <ArticleAside title="403 一定要向用户说出规则细节吗？"><p>不一定。客户端需要知道操作被拒绝，但响应不必暴露完整策略、角色映射或其他用户的资源信息。内部记录可以保留主体、资源、动作和拒绝原因，供授权排查。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
