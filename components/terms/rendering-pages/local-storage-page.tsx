import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { localStorageSources } from "@/lib/local-storage-sources";
import { LocalStorageHero } from "./local-storage-hero";

const sections: [string, string][] = [
  ["local-storage-definition-section", "先问清楚数据属于哪个 origin"],
  ["local-storage-event-section", "同源页面能听到变化"],
  ["local-storage-boundary-section", "字符串盒不是数据库"],
];

export function LocalStorageTermPage() {
  return <Article slug="local-storage" title="本地存储" subtitle="localStorage · 浏览器里按 origin 留住小片段偏好" sources={localStorageSources} sections={sections} hero={<LocalStorageHero />} intro={<>localStorage 是浏览器提供的一只同步键值盒。<strong>它按 origin 隔离、把值保存成字符串，并允许同源文档感知变化</strong>；适合记住偏好，不适合承担敏感数据或复杂事务。</>}>
    <ArticleSection id="local-storage-definition-section" title="先问清楚数据属于哪个 origin">
      <p id="storage-origin" className="vp-citation-target">浏览器按 origin（协议、主机和端口的组合）分开 localStorage。<Cite id="storage-origin" sources={localStorageSources} />同一站点的两个页面可以看到同一个盒子，换到另一个 origin 就是另一份数据。</p>
      <p id="storage-string" className="vp-citation-target">键和值都以字符串保存；写入对象时，JavaScript 会先把它转成字符串，想保留结构就要显式 JSON.stringify 和 JSON.parse。<Cite id="storage-string" sources={localStorageSources} /></p>
    </ArticleSection>
    <ArticleSection id="local-storage-event-section" title="同源页面能听到变化">
      <p id="storage-event" className="vp-citation-target">一个文档修改 localStorage 后，其他同源文档可以收到 storage 事件，得知哪个键、旧值和新值发生变化。<Cite id="storage-event" sources={localStorageSources} />这是一种浏览器通知，不是把写入动作变成可靠消息队列。</p>
      <p>上面的钥匙罐演示把标签页和 origin 分开：A 写入时，同源的 B 才能听到变化；换到另一个 origin，页面拿到的是另一只罐子。</p>
    </ArticleSection>
    <ArticleSection id="local-storage-boundary-section" title="字符串盒不是数据库">
      <p id="storage-sync" className="vp-citation-target">localStorage 的读写接口是同步的，频繁处理大字符串会占用主线程。<Cite id="storage-sync" sources={localStorageSources} />它还受浏览器容量和隐私策略影响，不应作为唯一持久化来源。</p>
      <p>登录令牌、密码等敏感信息不应该因为“留在浏览器里”就直接放进 localStorage。先判断数据的敏感度、生命周期、是否需要跨设备同步，再决定用服务器会话、Cookie、IndexedDB 或其他存储。</p>
    </ArticleSection>
  </Article>;
}
