"use client";

import { CheckCircle, Envelope, IdentificationCard, LockKey, WarningCircle } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { formSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

function FormHero() {
  return <ConceptHero slug="form" label="表单把标签、输入、约束与反馈放在同一张卡片里">
    <div className={styles.formHero}><div className={styles.formHeroSheet}>
      <div className={styles.formHeroHead}><IdentificationCard size={20} /><span>活动报名</span><b>待检查</b></div>
      <div className={styles.formHeroField}><span>姓名</span><strong>顾言</strong><CheckCircle size={16} /></div>
      <div className={styles.formHeroField} data-invalid="true"><span>邮箱</span><strong>guyan@</strong><WarningCircle size={16} /></div>
      <div className={styles.formHeroMessage}><Envelope size={15} />先补全邮箱，别清掉已经填好的姓名</div>
    </div></div>
  </ConceptHero>;
}

type FormStatus = "idle" | "client" | "server" | "success";

function FormLab() {
  const [name, setName] = useState("顾言");
  const [email, setEmail] = useState("guyan@");
  const [registered, setRegistered] = useState(true);
  const [status, setStatus] = useState<FormStatus>("idle");
  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missingName = !name.trim();
    const invalidEmail = !validEmail;
    if (missingName || invalidEmail) {
      setStatus("client");
      requestAnimationFrame(() => (missingName ? nameInput : emailInput).current?.focus());
      return;
    }
    if (registered) { setStatus("server"); return; }
    setStatus("success");
  }
  const message = status === "client" ? (!name.trim() && !validEmail ? "姓名和邮箱都需要补全；已有内容会保留。" : !name.trim() ? "姓名不能为空；邮箱格式已经通过。" : "邮箱需要完整地址；姓名仍保留。") : status === "server" ? "这个邮箱已经报名过，请换一个或直接登录。" : status === "success" ? "报名成功，确认邮件会发到这个地址。" : "先填一项，再按提交观察检查位置。";
  return <div className={styles.formLab} role="region" aria-label="表单客户端与服务端校验演示">
    <form className={styles.formCard} onSubmit={submit} noValidate>
      <div className={styles.formCardHead}><span>报名表</span><small>字段错误贴在字段旁</small></div>
      <label>姓名<input ref={nameInput} value={name} onChange={event => { setName(event.target.value); setStatus("idle"); }} aria-invalid={status === "client" && !name.trim()} /></label>
      <label>邮箱<input ref={emailInput} type="email" value={email} onChange={event => { setEmail(event.target.value); setStatus("idle"); }} aria-invalid={status === "client" && !validEmail} aria-describedby="form-demo-message" /></label>
      <button type="submit">尝试提交</button>
      <p id="form-demo-message" className={styles.formMessage} data-status={status} role="status">{status === "success" ? <CheckCircle size={17} /> : status === "idle" ? <Envelope size={17} /> : <WarningCircle size={17} />}<span>{message}</span></p>
    </form>
    <div className={styles.formServerCard}><div className={styles.formServerHead}><LockKey size={18} /><span>模拟服务端条件</span></div><label><input type="checkbox" checked={registered} onChange={event => { setRegistered(event.target.checked); setStatus("idle"); }} />这个邮箱已注册</label><p>客户端只看格式；勾选后，格式通过仍会被业务规则拒绝。</p></div>
  </div>;
}

export function FormTermPage(_props: BespokeTermPageProps) {
  return <Article slug="form" title="表单" subtitle="Form · 把输入、约束和反馈放在一起" sources={formSources} hero={<FormHero />} sections={[
    ["form-definition-section", "表单收集的不是一堆输入框"],
    ["form-label-section", "先让人知道每一格要填什么"],
    ["form-client-section", "浏览器可以先拦一次"],
    ["form-server-section", "服务端还要再判断一次"],
    ["form-error-section", "错误要能带人回到正确位置"],
  ]} intro={<>邮箱少写了一个部分时，页面应该告诉你哪里要改，同时保留已经填好的姓名。<strong>表单把字段含义、输入约束、错误反馈和提交结果连在一个可恢复的任务里。</strong></>}>
    <ArticleSection id="form-definition-section" title="表单收集的不是一堆输入框">
      <p>一个报名表看起来像两根输入框和一个按钮。真正的表单还包括：这个输入代表什么、什么值算合格、用户提交后谁会判断、出错时他回到哪里。少了其中一块，页面仍能“提交”，但用户不知道发生了什么。</p>
      <p id="form-definition" className="vp-citation-target"><strong>表单把一组相关数据收集起来交给后续处理。</strong>HTML 的 <code>form</code>、<code>label</code>、输入控件和按钮提供结构；约束属性与浏览器的约束校验可以先发现一些格式问题，服务端再根据业务规则作最终判断。<Cite id="form-definition" sources={formSources} /></p>
      <p>“一组相关”很重要。姓名和邮箱属于一次报名，错误提示应该让人知道哪一个字段要改，已经正确的输入不用被清空。表单是一个可以继续完成的任务，不是点一下就消失的黑盒。</p>
    </ArticleSection>
    <ArticleSection id="form-label-section" title="先让人知道每一格要填什么">
      <p id="form-label" className="vp-citation-target">字段标签要始终可见，并且能和对应的输入控件建立关联。占位文字可以给一个格式例子，不能在输入后消失就让人猜“这一格原来要填什么”。W3C 把标签或说明看作帮助用户理解输入目的的基本信息。<Cite id="form-label" sources={formSources} /></p>
      <div className={styles.labelComparison}><div><span>只有占位文字</span><label><input placeholder="guyan@example.com" aria-label="邮箱" /></label><p>一开始像提示，输入后不再说明字段含义。</p></div><div data-good="true"><span>可见标签</span><label><b>邮箱</b><input value="guyan@example.com" readOnly /></label><p>标签和输入始终在一起，读屏也能得到字段名称。</p></div></div>
      <p>标签也不能替你决定业务规则。邮箱格式可以先在浏览器提示，但“这个邮箱是否已注册”要等服务端查询。把两种判断写在同一个“无效”里，用户就不知道该修格式还是换账号。</p>
    </ArticleSection>
    <ArticleSection id="form-client-section" title="浏览器可以先拦一次">
      <p>在下面实验里，先保留一个不完整的邮箱，直接提交。浏览器这一层只做格式检查：它在请求发出前指出问题，焦点和原来的姓名都还在。补全邮箱后再提交，才会进入模拟服务端条件。</p>
      <FormLab />
      <p id="form-client" className="vp-citation-target">客户端校验适合反馈“这里不是一个完整邮箱”“这一项不能为空”这样的即时问题。它让错误离输入更近，也减少了无谓请求；但它只是用户界面上的第一道提示，不能成为安全边界。<Cite id="form-client" sources={formSources} /></p>
      <p id="form-boundary" className="vp-citation-target">客户端规则只是在这个页面里先给出提示，不能证明请求来自可信用户，也不能证明数据符合业务规则。有人可以跳过页面直接构造请求，所以真正的边界必须在服务端重新检查。<Cite id="form-boundary" sources={formSources} /></p>
      <p>有人可以关闭脚本、改请求，或直接调用接口。只在浏览器里把按钮禁用，不会改变服务器收到的内容。交互演示用的是本地状态，不会发送真实报名请求。</p>
    </ArticleSection>
    <ArticleSection id="form-server-section" title="服务端还要再判断一次">
      <p id="form-server" className="vp-citation-target">服务端应把收到的输入当作不可信数据，重新检查类型、格式、长度和业务规则。OWASP 的输入校验建议把校验放在信任边界处；客户端规则可以改善体验，却不能替代服务器的检查。<Cite id="form-server" sources={formSources} /></p>
      <p>把实验里的“这个邮箱已注册”勾上，再填一个格式正确的地址。客户端不会拦你，服务端条件才会给出“已经报名过”。如果把这个判断写死在页面里，别人绕开页面时仍能创建重复记录。</p>
      <ArticleAside title="格式通过，不等于业务通过"><p>“像邮箱”只回答格式问题；“这个账号是否能报名”还可能取决于登录身份、活动名额、重复提交和当前时间。每一类判断都应该有自己的错误说明和日志证据。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="form-error-section" title="错误要能带人回到正确位置">
      <p id="form-error" className="vp-citation-target">错误信息应该指出出错字段，说明发生了什么，并给出修复方向。不要只在页面顶端写一句“提交失败”，也不要只用红色而不提供文字。W3C 的错误识别准则要求让用户知道哪个输入有问题。<Cite id="form-error" sources={formSources} /></p>
      <p>好的错误反馈还要保留有效输入、把焦点带到需要修正的地方，并在提交成功后给出明确结果。错误状态、等待状态和成功状态不能共用一句模糊的“处理中”。如果网络请求失败，用户需要知道是否可以安全重试，以及刚才的数据有没有被保存。</p>
      <p>让 AI 改表单时，可以把验收写成：“用不完整邮箱提交；错误贴在邮箱旁，姓名保留；补全后勾选已注册，显示业务错误；取消勾选后成功；用键盘从标签、输入到提交走一遍。”这比“把表单做得更友好”可检查得多。</p>
    </ArticleSection>
  </Article>;
}
