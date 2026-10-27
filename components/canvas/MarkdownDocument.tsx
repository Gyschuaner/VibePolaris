import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import { memo } from "react";
import remarkGfm from "remark-gfm";
import remarkCjkFriendly from "remark-cjk-friendly/parseOnly";
import { remarkMark } from "remark-mark-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { safeNodeUrl } from "@/lib/canvas";
import { markdownSchema, rehypeFallbackTitle, rehypeTextColors, safeTextColor } from "@/lib/markdown-rendering";
import { MermaidDiagram } from "./MermaidDiagram";
import styles from "./CanvasWorkspace.module.css";

const languageNames = new Map(Object.entries({
  css: "CSS", html: "HTML", xml: "XML", svg: "SVG",
  js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript",
  jsx: "JSX", tsx: "TSX", py: "Python", python: "Python",
  json: "JSON", yaml: "YAML", yml: "YAML", toml: "TOML", sql: "SQL",
  sh: "Shell", shell: "Shell", bash: "Bash", zsh: "Zsh", powershell: "PowerShell",
  c: "C", cpp: "C++", "c++": "C++", cs: "C#", csharp: "C#", "c#": "C#",
  java: "Java", go: "Go", rust: "Rust", ruby: "Ruby", php: "PHP", swift: "Swift", kotlin: "Kotlin",
  md: "Markdown", markdown: "Markdown", text: "Text", txt: "Text", plaintext: "Text",
}));

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
      const language = code?.type === "element" && code.tagName === "code"
        ? (code.properties.className as string[] | undefined)?.find(name => name.startsWith("language-"))?.slice("language-".length) : undefined;
      if (language === "mermaid" && code?.type === "element") {
        return <MermaidDiagram source={code.children.map(child => child.type === "text" ? child.value : "").join("").replace(/\n$/, "")} />;
      }
      return language ? <div className={styles.codeBlock}>
        <span className={styles.codeLanguage}>{languageNames.get(language.toLowerCase()) ?? language}</span>
        <pre>{children}</pre>
      </div> : <pre>{children}</pre>;
    },
};

export const MarkdownDocument = memo(function MarkdownDocument({ markdown, fallbackTitle }: { markdown: string; fallbackTitle?: string }) {
  return <Markdown remarkPlugins={[remarkGfm, remarkCjkFriendly, remarkMark]} rehypePlugins={[rehypeRaw, rehypeTextColors, [rehypeSanitize, markdownSchema], [rehypeFallbackTitle, fallbackTitle], [rehypeHighlight, { detect: false, ignoreMissing: true, plainText: ["mermaid"] }]]} urlTransform={(url, key) => key === "src" && url.startsWith("data:") ? safeNodeUrl(url, true) : defaultUrlTransform(url)} components={components}>{markdown}</Markdown>;
});
