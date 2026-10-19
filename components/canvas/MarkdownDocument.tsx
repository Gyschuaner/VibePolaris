import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { safeNodeUrl } from "@/lib/canvas";
import styles from "./CanvasWorkspace.module.css";

export function MarkdownDocument({ markdown }: { markdown: string }) {
  return <Markdown remarkPlugins={[remarkGfm]} skipHtml urlTransform={(url, key) => key === "src" && url.startsWith("data:") ? safeNodeUrl(url, true) : defaultUrlTransform(url)} components={{
    a: ({ href, children }) => <a href={href} target={href?.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer">{children}</a>,
    table: ({ children }) => <div className={styles.table}><table>{children}</table></div>,
  }}>{markdown}</Markdown>;
}
