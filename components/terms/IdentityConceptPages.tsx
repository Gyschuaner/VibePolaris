import { Browser, Key, LockKey } from '@phosphor-icons/react/dist/ssr';
import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { JwtLesson, OAuthLesson, SessionLesson } from './IdentityConceptLessons';
import { jwtSources, oauthSources, sessionSources } from '@/lib/identity-concept-sources';
import s from './IdentityConcepts.module.css';

export function SessionTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={sessionSources}/>;
  return <ConceptArticle slug="session" title="会话" sources={sessionSources}
    intro={<>阿青登录书架后，刷新页面不用再输一次密码。浏览器在后续请求中带回一段会话秘密（通常是不透明的会话 ID），服务据此认出这次访问仍属于阿青。</>}
    sections={[["continuity", "登录之后如何保持连续"], ["cookie", "浏览器带回会话 ID"], ["lifetime", "退出使旧标识失效"], ["boundary", "会话与身份核验的边界"]]}
    hero={<ConceptHero slug="session" label="浏览器携带不透明的会话标识，服务查找对应的有效记录"><div className={s.heroSession}><span><Browser size={23}/>浏览器 · sid=7c4…</span><Key size={20}/><span><LockKey size={23}/>服务 · 阿青</span></div></ConceptHero>}>
    <ArticleSection id="continuity" title="登录之后如何保持连续">
      <p id="session-purpose" className="vp-citation-target"><strong>会话让一次登录成功在后面的很多次请求里都继续有效。</strong>NIST 将会话描述为浏览器等软件与服务之间、由会话秘密维系的一段关系。它从认证后开始，到退出、闲置超时或其他终止条件出现时结束。<Cite id="session-purpose"/></p>
      <p>在常见的服务端会话方案里，登录通过后，服务保存“某个会话 ID 对应阿青”的记录，浏览器只保留这段看不出用户信息的不透明 ID。下一次请求带回 ID，服务先查记录是否仍有效，再决定是否把请求当作阿青发来的。下面只演示这种方案；其他系统也可能用不同的会话绑定方式。</p>
      <p id="session-secret" className="vp-citation-target">会话 ID 是能让服务延续已认证状态的秘密，拿到有效 ID 的人可能冒用这段会话。NIST 要求会话秘密由服务在认证时生成，长度、随机性、安全传输和失效时间都有相应规定。它不能当作普通展示编号。<Cite id="session-secret"/></p>
    </ArticleSection>
    <ArticleSection id="cookie" title="浏览器带回会话 ID">
      <p id="session-cookie" className="vp-citation-target">HTTP 本身不会自动记住“上一条请求是谁”。服务可以用 <code>Set-Cookie</code> 把会话 ID 交给浏览器，浏览器之后在符合设定范围的请求里用 <code>Cookie</code> 把它带回。RFC 6265 给出的示例就是发送 <code>SID</code>，再由浏览器返回它。<Cite id="session-cookie"/></p>
      <p>在演示中先“登录并建会话”，再“访问书架”。留意浏览器与服务端两侧的变化：浏览器手里只有标识；它现在是否仍然有效，只有服务端能判断。</p>
      <SessionLesson/>
      <p id="session-flags" className="vp-citation-target">承载会话秘密的 Cookie 通常需要限定传输与读取范围。<code>Secure</code> 限制它在安全连接中发送，<code>HttpOnly</code> 阻止页面脚本读取；<code>SameSite</code> 控制跨站请求是否携带。它们各管一部分风险，不能替代服务端的过期和撤销。<Cite id="session-flags"/></p>
    </ArticleSection>
    <ArticleSection id="lifetime" title="退出使旧标识失效">
      <p id="session-logout" className="vp-citation-target"><strong>退出需要让服务端不再接受原会话。</strong>只在网页上清掉“已登录”字样，无法阻止有人继续提交旧 ID。OWASP 建议在退出时使服务端记录中的会话失效；演示保留浏览器里的旧 ID，正是为了看清“持有旧标识”和“服务仍接受它”是两回事。<Cite id="session-logout"/></p>
      <p id="session-expiry" className="vp-citation-target">退出之外，还要按系统风险限制会话能活多久。NIST 分别讨论闲置超时和总时长超时，明确要求期限到了就终止会话。Cookie 的过期设置有助于清理浏览器侧数据，但服务不能只靠浏览器删除 Cookie 来判定会话是否结束。<Cite id="session-expiry"/></p>
      <ArticleAside title="登录前就有的 ID，可以继续沿用吗？"><p id="session-rotate" className="vp-citation-target">登录会把一个未认证的会话变成已认证会话。OWASP 建议在登录成功时重新生成会话 ID，并使旧 ID 失效，避免攻击者提前塞给用户一个攻击者已经知道的 ID，等用户登录后拿来冒用；这类风险叫会话固定。<Cite id="session-rotate"/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="boundary" title="会话与身份核验的边界">
      <blockquote className={s.quote}>密码证明登录时是谁；<br/>会话让后续请求沿用那次核验结果。</blockquote>
      <p>会话本身不决定阿青能否修改别人的书目。服务认出请求后，还需针对资源和操作做 <ConceptTerm slug="authorization">授权</ConceptTerm>检查。至于 <ConceptTerm slug="jwt">JWT</ConceptTerm>，它是一种声明格式：有些系统会拿它承载令牌，但“采用 JWT”并不能替代会话管理。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function JwtTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={jwtSources}/>;
  return <ConceptArticle slug="jwt" title="JWT" sources={jwtSources}
    intro={<>一份令牌写着“主体是阿青、到某时过期”。接收方需要核对这段声明是否来自可信签发者、是否被改过，以及现在还能不能用。</>}
    sections={[["format", "JWT 承载声明"], ["verify", "载荷改写与验签"], ["claims", "签名之外的验证条件"], ["limits", "签名与加密的不同作用"]]}
    hero={<ConceptHero slug="jwt" label="有签名的 JWT 由受保护头部、载荷与签名组成"><div className={s.heroJwt}><span>Header</span><span>Payload<br/>阿青 · 有效期</span><span>Signature</span></div></ConceptHero>}>
    <ArticleSection id="format" title="JWT 承载声明">
      <p id="jwt-format" className="vp-citation-target"><strong>JWT 是传递一组声明的紧凑格式，不等于某一种登录机制。</strong>RFC 7519 允许声明放在 JWS 的载荷里受签名或完整性保护，也允许放进 JWE 里加密。下面重点看常见的“有签名的 JWT”。<Cite id="jwt-format"/></p>
      <p id="jwt-signature" className="vp-citation-target">采用 JWS 紧凑表示时，它常呈现为三段，以点号隔开：受保护头部、载荷、签名。签名覆盖前两段的编码结果；接收方按约定的算法和可信密钥验证它。令牌里写了谁，并不足以证明这句话可信。<Cite id="jwt-signature"/></p>
      <p>这页的方块是结构示意，不生成真正的签名，也不处理真实令牌。它用三种输入分别说明接收方应在哪一步拒绝。</p>
    </ArticleSection>
    <ArticleSection id="verify" title="载荷改写与验签">
      <p id="jwt-tamper" className="vp-citation-target">签名 JWT 的载荷可以被解码读取；如果把“阿青”改成“管理员”却保留原签名，验证就不应通过。JWS 规范说明签名输入包含受保护头部和载荷，改变其中任何一段都会改变待验证的内容。<Cite id="jwt-tamper"/></p>
      <p>切换“改写载荷”再验证。演示固定了签名，所以结果是拒绝；它没有真的执行 HMAC 或公钥验签，不能拿来判断任意真实 JWT 是否安全。</p>
      <JwtLesson/>
      <p id="jwt-claims" className="vp-citation-target">JWT 可以携带 <code>iss</code>（签发者）、<code>aud</code>（接收对象）、<code>exp</code>（过期时间）等声明。<code>exp</code> 的含义是到期后不能继续接受；因此演示里的“过期令牌”即使签名没有变化，也应被拒绝。<Cite id="jwt-claims"/></p>
    </ArticleSection>
    <ArticleSection id="claims" title="签名之外的验证条件">
      <p id="jwt-validation" className="vp-citation-target"><strong>签名通过只是检查的一部分。</strong>RFC 8725 要求应用按自身用途选择并验证算法、签发者与接收对象等条件。一个由可信服务签发、却是发给别的应用的令牌，不能因为签名正确就拿来通用。<Cite id="jwt-validation"/></p>
      <p id="jwt-context" className="vp-citation-target">同一系统若用 JWT 表示多种用途，例如访问令牌和身份令牌，应给不同用途设置明确而互不混淆的验证规则。RFC 8725 把这称为防止不同种类 JWT 之间的混用。令牌能否撤销、多久过期，也取决于应用另外设计的生命周期。<Cite id="jwt-context"/></p>
    </ArticleSection>
    <ArticleSection id="limits" title="签名与加密的不同作用">
      <p id="jwt-encryption" className="vp-citation-target">JWE 的紧凑表示有五段，用于承载加密内容。签名 JWT 的可读载荷与加密 JWT 的密文不能混为一谈：<strong>签名保护内容不被悄悄改写，加密才处理内容保密。</strong>不要把密码、私钥等秘密直接塞进普通可读的签名载荷。<Cite id="jwt-encryption"/></p>
      <div className={s.contrast}><div><h3>会话</h3><p>描述一次已认证访问怎样在多次请求间延续，通常需要考虑退出与失效。</p></div><div><h3>JWT</h3><p>描述声明怎样被表示和保护。令牌可参与会话或授权方案，但格式本身不规定整套生命周期。</p></div></div>
    </ArticleSection>
  </ConceptArticle>;
}

export function OAuthTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={oauthSources}/>;
  return <ConceptArticle slug="oauth" title="OAuth 2.0" subtitle="第三方授权" sources={oauthSources}
    intro={<>阿青想让图片整理器读取自己在相册服务里的头像。整理器只需要这项权限，不需要阿青把相册密码交给它。</>}
    sections={[["delegation", "把一部分访问权交给应用"], ["code", "同意后先给授权码"], ["token", "访问令牌的使用范围"], ["identity", "授权与登录不能混用"]]}
    hero={<ConceptHero slug="oauth" label="用户同意后，第三方应用取得有限访问令牌，再读取资源"><div className={s.heroOAuth}><span>阿青 · 同意读取头像</span><span>授权服务 · 发放令牌</span><span>图片整理器 · 持有令牌</span><span>相册服务 · 返回头像</span></div></ConceptHero>}>
    <ArticleSection id="delegation" title="把一部分访问权交给应用">
      <p id="oauth-purpose" className="vp-citation-target"><strong>OAuth 2.0 让第三方应用在限定范围内访问资源，不必拿到资源所有者的密码。</strong>RFC 6749 区分资源所有者、客户端、授权服务器和资源服务器。阿青是资源所有者；图片整理器是客户端；相册服务负责授权与提供头像。实际产品中后两个角色也可能由不同服务承担。<Cite id="oauth-purpose"/></p>
      <p id="oauth-scope" className="vp-citation-target">阿青同意的是“读取头像”这一项请求，而不是把整个相册交出去。RFC 9700 建议把访问令牌的权限限制在应用所需的最小范围，以降低越权和令牌泄露后的影响。服务仍需按自己的规则判断阿青是否有权委托这项访问。<Cite id="oauth-scope"/></p>
      <p>下面以授权码配合 PKCE 为例。点击同意或拒绝，再观察应用能拿到哪一步；它是角色关系示意，不会连接真实账号。</p>
      <OAuthLesson/>
    </ArticleSection>
    <ArticleSection id="code" title="同意后先给授权码">
      <p id="oauth-code" className="vp-citation-target">在授权码流程中，客户端把用户带到授权服务；授权服务处理用户决定，再把授权码交回客户端。客户端随后用授权码换取访问令牌。<strong>授权码是中间凭据，拿到它还不等于已能读取头像。</strong><Cite id="oauth-code"/></p>
      <p id="oauth-pkce" className="vp-citation-target">PKCE 在授权请求时提交由随机校验材料变换得到的挑战值，换令牌时再提交原始校验材料；授权服务比较两者。不匹配就拒绝。这能降低授权码被截取后遭冒用的风险。上方选择“不匹配”可看到失败分支，演示并不生成真实挑战值。<Cite id="oauth-pkce"/></p>
      <p id="oauth-current" className="vp-citation-target">OAuth 的安全实践仍在演进。RFC 9700 对不同类型客户端使用 PKCE 作出建议，且建议使用不会在授权请求中暴露校验材料的挑战方法；当前符合这一要求的方法为 <code>S256</code>。因此新实现不能只照搬早期规范里出现的各种流程。<Cite id="oauth-current"/></p>
    </ArticleSection>
    <ArticleSection id="token" title="访问令牌的使用范围">
      <p id="oauth-bearer" className="vp-citation-target">如果使用常见的 Bearer 访问令牌，资源服务器通常凭令牌判断是否接受请求。RFC 6750 明确指出，拿到 Bearer 令牌的一方就能使用其关联的访问权，所以令牌在传输和保存时都要防止泄露。演示中能读头像，不代表能改动相册其他数据。<Cite id="oauth-bearer"/></p>
      <p id="oauth-token-format" className="vp-citation-target">OAuth 访问令牌没有被限定为 JWT。RFC 6749 允许它是用于查询授权信息的标识，也允许令牌本身携带可验证的信息；对客户端而言，令牌通常是不透明的。<ConceptTerm slug="jwt">JWT</ConceptTerm>解释的是后一类实现可能采用的格式，而不是 OAuth 的同义词。<Cite id="oauth-token-format"/></p>
      <ArticleAside title="拒绝授权后会发生什么？"><p>拒绝意味着这次授权请求没有产生可供应用换取令牌的授权码。应用可以解释某项功能因而不可用，也可以让用户继续使用不依赖相册访问的部分；具体界面由产品设计决定。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="identity" title="授权与登录不能混用">
      <p id="oauth-identity" className="vp-citation-target">OAuth 2.0 解决的是应用对资源的受限访问，不能把“拿到了访问令牌”直接当成“确认了眼前用户是谁”。OpenID Connect 在 OAuth 2.0 之上定义身份层，让客户端能够验证终端用户身份。若需求是“用相册账号登录”，还要按身份协议处理，不能只读取任意访问令牌就认定登录成功。<Cite id="oauth-identity"/></p>
      <blockquote className={s.quote}>让应用看一张头像，<br/>不等于把账号交给它。</blockquote>
      <p>站内的 <ConceptTerm slug="authorization">授权</ConceptTerm>词条解释单次资源操作如何判断允许与拒绝；OAuth 2.0 进一步规定了第三方应用怎样取得受限的访问凭据。<ConceptTerm slug="session">会话</ConceptTerm>则关注登录状态怎样延续，它们各自回答不同问题。</p>
    </ArticleSection>
  </ConceptArticle>;
}
