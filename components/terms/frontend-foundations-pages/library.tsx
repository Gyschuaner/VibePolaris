"use client";

import { useMemo, useState } from "react";
import { Calendar, Check, ClipboardText, Package, ShieldCheck, Sparkle, Wrench, X } from "@phosphor-icons/react";
import { librarySources } from "@/lib/frontend-foundation-sources";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "../ConceptArticle";
import { ConceptHero } from "../ConceptHero";
import type { BespokeTermPageProps } from "../BespokeTermScaffold";
import styles from "./FrontendFoundations.module.css";

function LibraryHero() {
  return <ConceptHero slug="library" label="工具抽屉只打开当前需要的能力；原生日期格式化留在平台，额外需求才引入候选库">
    <div className={styles.libraryHero}>
      <div className={styles.libraryDrawer}><div className={styles.libraryDrawerTop}><ClipboardText size={18} /><span>DATE TOOL DRAWER</span><b>先看缺口</b></div><div className={styles.libraryToolCards}><div data-picked="true"><Calendar size={19} /><span>原生能力</span><strong>Intl</strong><small>直接可用</small></div><div><Package size={19} /><span>专用库</span><strong>候选</strong><small>补齐日期运算</small></div><div><Wrench size={19} /><span>通用包</span><strong>候选</strong><small>带来更多接口</small></div></div><div className={styles.libraryDrawerFoot}><span>需求变复杂</span><i /><span>再拿一件工具</span><Sparkle size={15} /></div></div>
    </div>
  </ConceptHero>;
}

type Need = "display" | "relative" | "calendar";
const needLabels: Record<Need, string> = { display: "按中文显示日期", relative: "算‘两天后’", calendar: "换日历系统" };
const candidates = [
  { id: "native", title: "原生 Intl.DateTimeFormat", icon: Calendar, note: "平台已提供格式化能力", covers: ["display", "calendar"] as Need[] },
  { id: "specialized", title: "专用日期库（候选）", icon: Package, note: "先核对接口、版本与维护", covers: ["display", "relative", "calendar"] as Need[] },
  { id: "utility", title: "通用工具包（候选）", icon: Wrench, note: "能力更宽，也要承担更多依赖", covers: ["display", "relative", "calendar"] as Need[] },
] as const;

function LibraryLab() {
  const [needs, setNeeds] = useState<Need[]>(["display"]);
  const [selected, setSelected] = useState("native");
  const formatted = useMemo(() => new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", calendar: needs.includes("calendar") ? "gregory" : undefined }).format(new Date("2026-08-31T00:00:00Z")), [needs]);
  const toggleNeed = (need: Need) => setNeeds(current => current.includes(need) ? current.filter(item => item !== need) : [...current, need]);
  const required = needs.length ? needs : (["display"] as Need[]);
  const canCover = (covers: readonly string[]) => required.every(need => covers.includes(need));
  return <div className={styles.libraryLab} role="region" aria-label="依赖库需求覆盖矩阵">
    <div className={styles.libraryLabTop}><div><span>当前需求</span><div className={styles.libraryNeedChips}>{(Object.keys(needLabels) as Need[]).map(need => <button type="button" key={need} aria-pressed={needs.includes(need)} onClick={() => toggleNeed(need)}>{needs.includes(need) ? <Check size={13} /> : <X size={13} />}{needLabels[need]}</button>)}</div></div><div className={styles.libraryOutput}><small>原生格式化结果</small><strong>{formatted}</strong></div></div>
    <div className={styles.libraryCandidateGrid}>{candidates.map(({ id, title, icon: Icon, note, covers }) => { const fit = canCover(covers); return <button type="button" key={id} className={styles.libraryCandidate} data-selected={selected === id} data-fit={fit} onClick={() => setSelected(id)}><span className={styles.libraryCandidateHead}><Icon size={18} /><strong>{title}</strong>{fit ? <Check size={17} /> : <X size={17} />}</span><span>{note}</span><small>覆盖 {covers.map(need => needLabels[need]).join(" · ")}</small></button>; })}</div>
    <div className={styles.libraryDecision} role="status"><ShieldCheck size={18} /><strong>{canCover(candidates.find(candidate => candidate.id === selected)?.covers ?? []) ? "当前方案能覆盖所选需求" : "当前方案缺一项能力"}</strong><span>你选中：{candidates.find(candidate => candidate.id === selected)?.title}。矩阵只说明教学用的能力覆盖，不替真实包做体积、性能或安全评分。</span></div>
  </div>;
}

export function LibraryTermPage(_props: BespokeTermPageProps) {
  return <Article slug="library" title="库" subtitle="Library · 把一组能力装进可调用的接口" sources={librarySources} hero={<LibraryHero />} sections={[
    ["library-definition-section", "库不是魔法，是别人写好的接口"],
    ["library-native-section", "先打开平台自带的抽屉"],
    ["library-interface-section", "你调用它，它才做事"],
    ["library-dependency-section", "一次导入会留下长期关系"],
    ["library-security-section", "可用还不等于值得引入"],
  ]} intro={<>“加一个库”听起来像多写一行 import。真正发生的是：项目把一份外部代码纳入安装、构建、运行和升级。<strong>先确认缺口，再选择一组恰好能被你负责的接口。</strong></>}>
    <ArticleSection id="library-definition-section" title="库不是魔法，是别人写好的接口">
      <p>你写页面时，经常不想重复处理日期、组件、网络请求或图表。库把一组已经写好的能力包装成接口，你的代码在需要的地方导入并调用。它不会因为躺在项目里就自动替你决定应用的入口和生命周期。</p>
      <p id="library-definition" className="vp-citation-target"><strong>库（library）是可复用代码与接口的集合。</strong>React 的文档把组件描述为可复用的 UI 片段；这类能力通常由应用代码主动组合和调用。库的名字不保证它只有一个函数，也不保证它适合每个项目，仍要看接口、边界和维护方式。<Cite id="library-definition" sources={librarySources} /></p>
      <p>把库想成工具抽屉：抽屉里有什么，不等于你今天就该把整套工具搬进房间。先说清楚要完成哪件事，再看平台本身是否已经有一把合适的工具。</p>
    </ArticleSection>
    <ArticleSection id="library-native-section" title="先打开平台自带的抽屉">
      <p id="library-native" className="vp-citation-target">浏览器和 Node.js 都能使用 JavaScript 的 <code>Intl.DateTimeFormat</code> 来格式化日期。它可以按语言环境选择年月日顺序，也可以指定时区、日历等选项。对“把一个日期按中文显示出来”这类需求，原生能力已经是可检查的起点。<Cite id="library-native" sources={librarySources} /></p>
      <p>点选下面的需求。只选“按中文显示日期”时，原生方案已经覆盖；加入“算两天后”，问题从显示变成日期运算，需要重新评估专用库或自己的小实现。实验没有偷偷给候选库打性能分，只把“能力缺口”摆在桌面上。</p>
      <LibraryLab />
      <p>你可以把这个判断写进任务：“请先用原生 Intl 试做；只有日期运算成为实际缺口，才提出引入库，并列出版本、许可证、漏洞与替换成本。”这样 AI 不会把安装依赖当成默认答案。</p>
    </ArticleSection>
    <ArticleSection id="library-interface-section" title="你调用它，它才做事">
      <p id="library-interface" className="vp-citation-target">库提供接口，应用决定何时调用、把什么数据传进去、如何处理返回值。UI 库可以提供组件，但页面是否显示、数据是否保存和错误怎么说，仍由应用的状态与业务代码决定。<Cite id="library-interface" sources={librarySources} /></p>
      <p>这也是库和框架常被放在一起比较的原因：库通常等你叫它；框架可能在自己的约定和生命周期里安排调用。不要因为两者都在 package.json 里，就把控制权方向混为一谈。</p>
      <ArticleAside title="一次调用要说清四件事"><p>输入是什么，接口承诺什么，返回值会落到哪里，失败由谁处理。库只负责它的接口边界，业务含义仍要在你的代码里写出来。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="library-dependency-section" title="一次导入会留下长期关系">
      <p id="library-dependency" className="vp-citation-target">把库写进 <code>dependencies</code>，意味着安装和生产运行需要它；写进 <code>devDependencies</code>，通常表示它只在开发、构建或测试阶段使用。package.json 让这些关系可重复安装，也让版本范围成为团队需要共同维护的约定。<Cite id="library-dependency" sources={librarySources} /></p>
      <p>关系会沿着时间留下来：升级可能改变接口，间接依赖可能带来新的版本，构建产物可能包含你只用到的一小部分。不要用一次成功安装证明长期可维护，应该把升级路径、锁定方式和删除办法一起想好。</p>
    </ArticleSection>
    <ArticleSection id="library-security-section" title="可用还不等于值得引入">
      <p id="library-security" className="vp-citation-target">npm 的审计报告用于发现依赖树里的已知安全问题，但“没有报告”也不等于适合你的功能、没有维护风险或可以忽略许可证。选择候选库时，至少核对真实使用范围、发布与维护状态、许可证、漏洞处理和替换成本。<Cite id="library-security" sources={librarySources} /></p>
      <p id="library-boundary" className="vp-citation-target">本页的矩阵是一个决策草图，不是对任何真实包的体积、性能、下载量或安全评分。库也不等于框架：它通常不接管应用主循环，更不会替你制定业务规则。<Cite id="library-boundary" sources={librarySources} /></p>
      <p>如果最后决定不引入库，也是一项完整的工程结论：记录为什么原生能力够用，什么时候需求变化会触发重新评估，以及谁负责再次检查依赖风险。</p>
    </ArticleSection>
  </Article>;
}
