import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { encryptionInTransitSources } from "@/lib/encryption-in-transit-sources";
import { EncryptionInTransitHero } from "./encryption-in-transit-hero";
import { EncryptionInTransitLesson } from "./encryption-in-transit";

const sections: [string, string][] = [
  ["encryption-in-transit-definition-section", "传输中到底保护哪一段"],
  ["encryption-in-transit-handshake-section", "握手先确认规则和身份"],
  ["encryption-in-transit-hop-section", "每个跳点都要重新画锁"],
  ["encryption-in-transit-failure-section", "失败时应该停在哪里"],
];

export function EncryptionInTransitTermPage() {
  return <Article slug="encryption-in-transit" title="传输中加密" subtitle="Encryption in Transit · 让路上的内容和对端身份一起可验证" sources={encryptionInTransitSources} sections={sections} hero={<EncryptionInTransitHero />} intro={<>登录请求从浏览器经过 CDN、负载均衡器，再到应用。<strong>传输中加密保护的是某一对端点之间的通道；通道在哪终止、下一跳有没有重新建立 TLS、证书到底指向谁，决定了那把锁实际覆盖到哪里。</strong></>}>
    <ArticleSection id="encryption-in-transit-definition-section" title="传输中到底保护哪一段">
      <p id="eit-goal" className="vp-citation-target">TLS 的目标是让两个通信端点在可能被攻击者完全控制的网络上建立安全通道，提供机密性、完整性和服务器身份验证。它保护的是通道里的内容，不能让网络流量的时间、方向和大致大小消失。<Cite id="eit-goal" sources={encryptionInTransitSources} /></p>
      <p id="eit-mitm" className="vp-citation-target">浏览器使用 HTTPS，是为了抵抗中间人把自己插到用户和服务器之间、读取或改写请求的场景。抓包者可以知道“这里有一条连接”，但正确配置的 TLS 记录不应让他直接读到 Authorization、订单内容或响应正文。<Cite id="eit-mitm" sources={encryptionInTransitSources} /></p>
      <p id="eit-endpoint" className="vp-citation-target">锁的边界在端点结束：服务器终止 TLS 后，请求会以应用能处理的 HTTP 形式出现，可能继续进入日志、缓存或下游服务。静态加密关注保存中的副本，传输中加密关注路上的下一段，两个词不能互相代替。<Cite id="eit-endpoint" sources={encryptionInTransitSources} /></p>
      <p>所以首图不画一条从浏览器直通应用的长箭头，而是把 CDN 和负载均衡器拆成三个跳点。每一跳都要回答同一组问题：谁和谁建立连接，证书验证了谁，抓包时敏感字段处于什么状态。</p>
    </ArticleSection>

    <ArticleSection id="encryption-in-transit-handshake-section" title="握手先确认规则和身份">
      <p id="eit-handshake" className="vp-citation-target">TLS 握手先协商版本、密码参数和密钥交换材料，再建立后续记录使用的共享密钥。ClientHello 和 ServerHello 解决“按哪套规则说话”，握手完成后才进入应用流量；把收到 ServerHello 误当成“可以发送订单”会把中间状态当成成功。<Cite id="eit-handshake" sources={encryptionInTransitSources} /></p>
      <p id="eit-browser-handshake" className="vp-citation-target">浏览器还会在握手里检查证书、信任链和服务端身份。证书不是一把把整段网页加密的长期密码，而是把公钥和服务身份连起来的凭据；会话密钥则由这次连接的握手材料导出。<Cite id="eit-browser-handshake" sources={encryptionInTransitSources} /></p>
      <p id="eit-identity" className="vp-citation-target">客户端要把自己期待的 reference identity 和证书里 presented identity 比较。证书链能验过，只说明签名关系可信；如果用户要找的是 orders.example，而证书只写 other.example，连接仍不能被当作目标服务。<Cite id="eit-identity" sources={encryptionInTransitSources} /></p>
      <p id="eit-san" className="vp-citation-target">RFC 9525 规定常见的 DNS 身份放在 subjectAltName 的 dNSName 中，IP 地址也有专门的 iPAddress 形式。主机名验证不是把字符串“看起来像”就算通过，而是按身份类型和匹配规则检查。<Cite id="eit-san" sources={encryptionInTransitSources} /></p>
      <p id="eit-sni" className="vp-citation-target">共享地址上，SNI 可以告诉服务器客户端想访问哪个服务名，帮助它选择证书；它不会替客户端完成最终的主机名验证。服务器选错证书或客户端放弃验证，都会把“加密了”与“连对了”混成一件事。<Cite id="eit-sni" sources={encryptionInTransitSources} /></p>
      <EncryptionInTransitLesson />
    </ArticleSection>

    <ArticleSection id="encryption-in-transit-hop-section" title="每个跳点都要重新画锁">
      <p id="eit-record" className="vp-citation-target">TLS record protocol 使用握手导出的流量密钥保护应用记录；在记录层，篡改会被检测，旁观者读不到内容。首图第 3 帧把 Authorization 又变回明文，是为了显示 CDN 解密后到负载均衡器的那一跳没有自动继承外层的保护。<Cite id="eit-record" sources={encryptionInTransitSources} /></p>
      <p id="eit-termination" className="vp-citation-target">OWASP 明确提醒：TLS 在反向代理或负载均衡器终止后，后续链路需要自己的保护。只看浏览器地址栏的锁，会漏掉服务到服务、代理到上游和日志导出这些新的明文位置。<Cite id="eit-termination" sources={encryptionInTransitSources} /></p>
      <p id="eit-all-pages" className="vp-citation-target">保护范围也不能只覆盖登录页。OWASP 建议全站使用 TLS，API 端点在不能重定向时应直接拒绝明文 HTTP；否则攻击者可以从一个普通页面或回退入口窃取会话信息。<Cite id="eit-all-pages" sources={encryptionInTransitSources} /></p>
      <p id="eit-cookie" className="vp-citation-target">如果会话 Cookie 只在 HTTPS 上发送，应该带 Secure 属性，让浏览器不把它送进明文连接。这个属性是端点侧的补充护栏，不能替代服务器为每个下一跳建立 TLS。<Cite id="eit-cookie" sources={encryptionInTransitSources} /></p>
      <p id="eit-wildcard" className="vp-citation-target">共享一张 wildcard 证书也会扩大故障和泄露范围：多个信任层级的系统共用同一私钥，轮换和事件响应都会变复杂。证书覆盖的域名、终止它的机器和下一跳的身份，应在架构图上逐项留下名字。<Cite id="eit-wildcard" sources={encryptionInTransitSources} /></p>
    </ArticleSection>

    <ArticleSection id="encryption-in-transit-failure-section" title="失败时应该停在哪里">
      <p id="eit-0rtt" className="vp-citation-target">TLS 1.3 的 0-RTT 可以更早送出部分应用数据，但它有独立的重放风险和适用边界。首图展示的是常规完整握手；如果接口会写订单、扣款或改变状态，不能因为省下一次往返就跳过幂等和重放判断。<Cite id="eit-0rtt" sources={encryptionInTransitSources} /></p>
      <p id="eit-config" className="vp-citation-target">配置层应明确允许的协议、密码套件、证书和扩展。NIST SP 800-52 给出 TLS 实现选择与配置指导；OWASP 也建议默认 TLS 1.3、为兼容性谨慎保留 TLS 1.2，并关闭旧的 SSL/TLS 版本。<Cite id="eit-config" sources={encryptionInTransitSources} /></p>
      <p id="eit-version" className="vp-citation-target">版本兼容不是把安全要求降到最低。NIST 的指导把 TLS 1.2 的支持条件、TLS 1.3 的要求和证书、扩展放在同一个配置问题里；排查时应记录实际协商版本和套件，而不是只写“HTTPS 已开启”。<Cite id="eit-version" sources={encryptionInTransitSources} /></p>
      <p id="eit-strong" className="vp-citation-target">OWASP 建议使用 TLS 1.3 的标准 AEAD 套件，旧版本兼容时也要避开空、匿名、导出和不提供前向保密的静态密钥传输。密码套件列表是策略的一部分，不能靠浏览器地址栏替它验收。<Cite id="eit-strong" sources={encryptionInTransitSources} /></p>
      <p id="eit-mixed" className="vp-citation-target">HTTPS 页面还要避免混入 HTTP 脚本、样式或图片；一个明文资源就可能让攻击者窃取 Cookie 或修改页面。失败时应停在具体的跳点和证书检查上，不能把错误降级为“先用 HTTP 试一下”。<Cite id="eit-mixed" sources={encryptionInTransitSources} /></p>
      <p>复核一条实际链路时，把浏览器、CDN、网关、负载均衡器和应用逐一列出，再给每段填上协议、证书身份、终止点、抓包可见内容和失败动作。这样才知道“有 HTTPS”解决的是哪一个问题，还留下了哪一个问题。</p>
    </ArticleSection>
  </Article>;
}
