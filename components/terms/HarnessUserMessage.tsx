import { FileText, User } from "@phosphor-icons/react";
import intro from "@/content/zh/terms/agent-harness/lesson-intro.json";
import styles from "./HarnessLesson.module.css";

export function HarnessUserMessage() {
  return <div className={styles.userMessage}>
    <div className={styles.messageAuthor}><User size={18} aria-hidden="true" /><span>{intro.user}</span></div>
    <div className={styles.messageBody}>
      <div className={styles.attachment}><FileText size={22} aria-hidden="true" /><span>{intro.filename}</span></div>
      <p>{intro.message}</p>
    </div>
  </div>;
}
