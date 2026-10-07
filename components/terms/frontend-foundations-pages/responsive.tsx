"use client";

import { BookOpen, Browser, FilmSlate, Storefront } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { responsiveSources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection, ConceptTerm } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import styles from "./FrontendFoundations.module.css";

function ResponsiveHero() {
  return <ConceptHero slug="responsive" label="同一组活动卡片在画框收窄后，从三列变为单列，内容保留">
    <div className={styles.heroMorph}><div className={styles.heroViewport}>
      <div className={styles.heroCard}><Storefront size={22} /><span>市集</span></div>
      <div className={styles.heroCard}><FilmSlate size={22} /><span>放映</span></div>
      <div className={styles.heroCard}><BookOpen size={22} /><span>旧书</span></div>
    </div></div>
  </ConceptHero>;
}

function ResponsiveLab() {
  const [width, setWidth] = useState(100);
  const [fixed, setFixed] = useState(false);
  const [pixels, setPixels] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!viewport.current) return;
    const observer = new ResizeObserver(([entry]) => setPixels(Math.round(entry.contentRect.width)));
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);
  const columns = fixed ? 3 : pixels >= 570 ? 3 : pixels >= 360 ? 2 : 1;
  return <div className={styles.lab} role="region" aria-label="缩窄活动页容器，观察卡片真实换列">
    <label className={styles.widthControl}>容器宽度<input aria-label="容器宽度" type="range" min="45" max="100" value={width} onChange={event => setWidth(Number(event.target.value))} /><output>{pixels || "—"} px</output></label>
    <div className={styles.controls}><label><input type="checkbox" checked={fixed} onChange={event => setFixed(event.target.checked)} />坚持三列</label></div>
    <div className={styles.responsiveStage}><div className={styles.responsiveViewport} ref={viewport} style={{ "--viewport-width": `${width}%` } as CSSProperties}>
      <div className={styles.windowBar}><Browser size={17} /><span>周末活动</span></div>
      <div className={styles.responsiveCards} data-fixed={fixed}>
        {[[Storefront, "河边手作市集", "周六 · 10:00"], [FilmSlate, "露天电影放映", "周六 · 19:30"], [BookOpen, "旧书交换日", "周日 · 14:00"]].map(([Icon, title, time]) => {
          const EventIcon = Icon as typeof BookOpen;
          return <div className={styles.eventCard} key={title as string}><span><EventIcon size={30} aria-hidden="true" /></span><strong>{title as string}</strong><small>{time as string}</small><a href="#responsive-inspection-section">查看活动</a></div>;
        })}
      </div>
    </div></div>
    <p className={styles.labResult} role="status"><strong>{columns} 列</strong> · 三项活动和字号保持不变{fixed && pixels < 360 ? "，但每张卡片已经挤得很窄。" : "，浏览器按照容器空间安排位置。"}</p>
  </div>;
}

export function ResponsiveTermPage() {
  return <Article slug="responsive" title="响应式布局" subtitle="Responsive design · 空间变了，内容重新站位" sources={responsiveSources} hero={<ResponsiveHero />} sections={[
    ["responsive-definition-section", "把窗口缩窄，页面该怎么办"],
    ["responsive-rules-section", "同一份内容，几条不同的摆放规则"],
    ["responsive-container-section", "看整扇窗口，还是看自己的格子"],
    ["responsive-inspection-section", "哪里挤坏了，就从哪里修"],
    ["responsive-boundary-section", "有些内容需要横着看"],
  ]} intro={<>电脑上整整齐齐的三栏活动，到了手机里却每行只剩两个字。<strong>响应式布局让内容根据可用空间重新排列，让人仍能看清、找到并完成操作。</strong></>}>
    <ArticleSection id="responsive-definition-section" title="把窗口缩窄，页面该怎么办">
      <p>你让 AI 做了一页周末活动：市集、电影、旧书交换，各占一张卡片。电脑上三张并排挺合适，手机上却像三个人硬挤进一条窄走廊。标题断成好多行，“查看活动”按钮也被挤瘪了。</p>
      <p id="responsive-definition" className="vp-citation-target"><strong>响应式布局是一种让网页适应可用空间的设计做法。</strong>它可以让卡片变宽变窄、换行，或在空间不足时换成单列。浏览器拿到的仍可以是同一份内容，变化的是摆放规则。CSS 的 Grid、Flexbox 和媒体查询是常见工具，响应式本身并不是某一个开关或某一种框架。<Cite id="responsive-definition" sources={responsiveSources} /></p>
      <p>没有额外样式时，普通网页文字本来就会随着窗口宽度换行。麻烦往往来自后来加上的固定宽度、最低尺寸，或“永远三列”的要求。你需要找出是哪条规则挡住了内容重新安排，不能只在手机上把整页缩小。</p>
      <p>缩小以后看起来“全都装进去了”，人却得放大才能读，手指也难点中按钮。活动时间还在，使用者却不好用了。响应式要保住的是这个人正在做的事情：看活动、比较时间、打开详情。</p>
    </ArticleSection>
    <ArticleSection id="responsive-rules-section" title="同一份内容，几条不同的摆放规则">
      <p>拖动下面的宽度尺。你只改变卡片所在区域的宽度，不换标题、不删活动，也不缩字号。空间足够时并排；空间少了就换列。勾上“坚持三列”，再把区域收窄，就能看到旧规则怎样把同一份内容挤坏。</p>
      <ResponsiveLab />
      <p id="responsive-rules" className="vp-citation-target">浏览器会根据布局规则计算每张卡片的位置。有些规则本身就允许伸缩与换行；另一些会在条件满足时切换，例如宽度不足就从三列改为两列。<strong>响应式不一定需要一长串媒体查询。</strong>能自动适应的尺寸和布局先处理连续变化，只有安排需要明显改变时，再增加条件。<Cite id="responsive-rules" sources={responsiveSources} /></p>
      <p id="responsive-breakpoint" className="vp-citation-target">“开始换一种摆法的宽度”叫<ConceptTerm slug="breakpoint">断点</ConceptTerm>。它应该回答“现在的内容哪里不好用了”，而不是“这是不是某款手机”。比如活动标题在两列里还能正常读，但第三列让每个标题断成六行，减少一列就有了理由。web.dev 建议从内容需要出发选择断点。<Cite id="responsive-breakpoint" sources={responsiveSources} /></p>
      <p>演示里的 360px 和 570px 是为这三张卡片选的条件，换成商品卡、长德文标题或更大的字体，合适的位置也会变。先读真实内容，再定数字，能少掉许多为了某台设备临时补的规则。</p>
    </ArticleSection>
    <ArticleSection id="responsive-container-section" title="看整扇窗口，还是看自己的格子">
      <p>这里有两把容易混淆的尺。视口是浏览器里显示网页的那片区域；内容容器则是页面上某一块区域。电脑窗口很宽，不代表右侧栏里的卡片也很宽。打开目录、并排摆两个面板，都可能把局部空间压小。</p>
      <p id="responsive-container" className="vp-citation-target"><ConceptTerm slug="media-query">媒体查询</ConceptTerm>可以检查视口宽度等环境条件；容器尺寸查询检查被指定为查询容器的祖先元素的尺寸，再调整它里面的内容。这样，同一张卡片放进主栏和窄侧栏时，可以各自适应身边的空间。上面的演示用的就是容器查询：整页没变窄，活动区却能单独换列。<Cite id="responsive-container" sources={responsiveSources} /></p>
      <div className={styles.comparison}><div><h3>窗口的变化</h3><p>手机旋转、浏览器分屏、桌面窗口缩小。整页导航或大布局可以按视口条件调整。</p></div><div><h3>局部的变化</h3><p>一张卡片从主栏搬进侧栏。它需要看自己的容器，不能只看外面的窗口够不够宽。</p></div></div>
      <ArticleAside title="这两行 CSS 在量什么"><p><code>container-type: inline-size</code> 把某个区域声明为可查询的尺寸容器；里面的 <code>@container (min-width: 360px)</code> 表示这个容器达到该宽度时使用一组规则。数字是容器的 CSS 像素宽度，不是手机屏幕的物理像素数。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="responsive-inspection-section" title="哪里挤坏了，就从哪里修">
      <p>检查时，从宽到窄缓缓拖动窗口，比只看一张手机截图更容易抓住问题。记住第一处失效：长标题盖住图片、按钮被推到屏外，还是整个页面开始横着滚。顺着这一处找尺寸和布局规则，改完再看更窄的空间。</p>
      <p id="responsive-content" className="vp-citation-target">别为了让截图整齐就直接隐藏内容。屏幕尺寸不能说明使用者不需要什么；在活动页上，手机使用者同样需要地点、时间和报名入口。可以改变信息的摆放顺序与密度，但删掉重要信息会改变任务本身。<Cite id="responsive-content" sources={responsiveSources} /></p>
      <p id="responsive-reflow" className="vp-citation-target">还要把文字放大后再读一次。W3C 的回流要求关注信息与功能是否保留，以及普通纵向阅读内容在相当于 320 CSS 像素的宽度下，能否避免同时向两个方向滚动。它会帮助你发现“默认字号刚好没溢出，一放大就无法用”的页面。<Cite id="responsive-reflow" sources={responsiveSources} /></p>
      <p>如果让 AI 修这一页，可以说：“缩窄活动容器时，三列标题过度换行。请保留三项活动和可读字号，依据卡片可用宽度换列；检查打开目录、长标题和放大文字时仍能访问详情。”这比只说“做个手机版”更容易让它改到真正的问题。</p>
    </ArticleSection>
    <ArticleSection id="responsive-boundary-section" title="有些内容需要横着看">
      <p id="responsive-exception" className="vp-citation-target">地图、需要按行列比较的数据表，或某些图形，可能本来就靠二维位置表达关系。W3C 的回流说明保留了这类内容的例外。可以把横向操作限制在那个区域，并让页面其余部分继续正常阅读；不必把每张表都强行拆成单列。<Cite id="responsive-exception" sources={responsiveSources} /></p>
      <p>回到活动页：三张独立卡片换行不会丢掉关系；路线地图换行却会破坏方位。能判断这两种情况，你就已经知道响应式该保护什么，也知道什么时候该停止“往一列里塞”。</p>
    </ArticleSection>
  </Article>;
}
