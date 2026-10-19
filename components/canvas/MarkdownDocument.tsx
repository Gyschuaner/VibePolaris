import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./CanvasWorkspace.module.css";

export function MarkdownDocument({ markdown }: { markdown: string }) {
  return <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
    a: ({ href, children }) => <a href={href} target={href?.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer">{children}</a>,
    table: ({ children }) => <div className={styles.table}><table>{children}</table></div>,
  }}>{markdown}</Markdown>;
}
