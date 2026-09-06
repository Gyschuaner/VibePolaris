import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { BespokeTermPageProps } from "./BespokeTermScaffold";
import { HarnessLesson } from "./HarnessLesson";
import { harnessSources } from "@/lib/harness-content";
import styles from "./AgentHarnessTermPage.module.css";

export function AgentHarnessTermPage({ related }: BespokeTermPageProps) {
  return <main className={styles.page} id="main-content">
    <header className={styles.meta}>
      <Link href="/" className={styles.back}><ArrowLeft size={15} />返回星图</Link>
      <span>Agent Harness<span className={styles.sep}>/</span>智能体运行框架</span>
    </header>
    <HarnessLesson />
    <footer className={styles.further}>
      <nav aria-label="继续理解">{related.slice(0, 3).map(item => <Link href={"/terms/" + item.slug} key={item.slug}>{item.zh}<ArrowUpRight size={13} /></Link>)}</nav>
      <details><summary>参考资料</summary>{harnessSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={13} /></a>)}</details>
    </footer>
  </main>;
}
