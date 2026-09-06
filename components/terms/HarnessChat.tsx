"use client";

import { useEffect, useState } from "react";
import intro from "@/content/zh/terms/agent-harness/lesson-intro.json";
import { HarnessUserMessage } from "./HarnessUserMessage";
import styles from "./HarnessLesson.module.css";

export function HarnessChat({ reduced }: { reduced: boolean }) {
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnswered(true), reduced ? 0 : 650);
    return () => clearTimeout(timer);
  }, [reduced]);

  return <>
    <div className={`${styles.scene} ${styles.chatScene}`}>
      <div className={styles.model}>
        <h3>{intro.model}</h3>
        <div className={styles.characterWrap}><div className={styles.modelIcon}><span className={styles.claudeIcon} aria-hidden="true" /></div></div>
      </div>
      <div className={styles.conversation}>
        <HarnessUserMessage />
        <div className={styles.chatReply} aria-live="polite">
          <div className={styles.messageAuthor}>{intro.model}</div>
          {answered ? <p>{intro.chatReply}</p> : <div className={styles.typing} role="status" aria-label={intro.chatPending}><i /><i /><i /></div>}
        </div>
      </div>
    </div>
    <p className={styles.chatBoundary}>{intro.chatBoundary}</p>
  </>;
}
