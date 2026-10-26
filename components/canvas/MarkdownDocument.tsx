import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import { memo } from "react";
import remarkGfm from "remark-gfm";
import { remarkMark } from "remark-mark-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { safeNodeUrl } from "@/lib/canvas";
import { markdownSchema, rehypeFallbackTitle, rehypeTextColors, safeTextColor } from "@/lib/markdown-rendering";
import { MermaidDiagram } from "./MermaidDiagram";
import styles from "./CanvasWorkspace.module.css";

// Stable component types keep a diagram mounted while surrounding prose changes.
const components: Components = {
    // User images include embedded data URLs and must stay directly exportable.
    // eslint-disable-next-line @next/next/no-img-element
    img: ({ src, alt, title }) => <img src={src} alt={alt ?? ""} title={title} loading="lazy" decoding="async" />,
    a: ({ href, children }) => <a href={href} target={href?.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer">{children}</a>,
    table: ({ children }) => <div className={styles.table}><table>{children}</table></div>,
    span: ({ style, children, className }) => <span className={className} style={style?.color ? { color: safeTextColor(`color: ${style.color}`) } : undefined}>{children}</span>,
    pre: ({ node, children }) => {
      const code = node?.children[0];
      if (code?.type === "element" && code.tagName === "code" && (code.properties.className as string[] | undefined)?.includes("language-mermaid")) {
        return <MermaidDiagram source={code.children.map(child => child.type === "text" ? child.value : "").join("").replace(/\n$/, "")} />;
      }
      return <pre>{children}</pre>;
    },
};

export const MarkdownDocument = memo(function MarkdownDocument({ markdown, fallbackTitle }: { markdown: string; fallbackTitle?: string }) {
  return <Markdown remarkPlugins={[remarkGfm, remarkMark]} rehypePlugins={[rehypeRaw, rehypeTextColors, [rehypeSanitize, markdownSchema], [rehypeFallbackTitle, fallbackTitle], [rehypeHighlight, { detect: false, ignoreMissing: true, plainText: ["mermaid"] }]]} urlTransform={(url, key) => key === "src" && url.startsWith("data:") ? safeNodeUrl(url, true) : defaultUrlTransform(url)} components={components}>{markdown}</Markdown>;
});
