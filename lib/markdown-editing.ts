export type MarkdownFormat = "bold" | "italic" | "strike" | "highlight" | "code" | "link" | "codeblock" | "mermaid" | "color" | "indent" | "outdent";
export type MarkdownEdit = { from: number; to: number; text: string; start: number; end: number };

export function formatMarkdown(value: string, start: number, end: number, format: MarkdownFormat, color = "#a33a32"): MarkdownEdit {
  const selected = value.slice(start, end);
  function replace(from: number, to: number, text: string, selectionStart: number, selectionEnd = selectionStart) {
    return { from, to, text, start: selectionStart, end: selectionEnd };
  }
  function wrap(left: string, right = left) {
    if (selected.startsWith(left) && selected.endsWith(right) && selected.length >= left.length + right.length) {
      const text = selected.slice(left.length, -right.length);
      return replace(start, end, text, start, start + text.length);
    }
    if (value.slice(start - left.length, start) === left && value.slice(end, end + right.length) === right) {
      return replace(start - left.length, end + right.length, selected, start - left.length, end - left.length);
    }
    return replace(start, end, left + selected + right, start + left.length, end + left.length);
  }
  if (format === "bold") return wrap("**");
  if (format === "italic") return wrap("*");
  if (format === "strike") return wrap("~~");
  if (format === "highlight") return wrap("==");
  if (format === "code") {
    const wrapped = /^(`+)([^]*?)\1$/.exec(selected);
    if (wrapped) return wrap(wrapped[1]);
    const fence = "`".repeat(Math.max(0, ...(selected.match(/`+/g) ?? []).map(run => run.length)) + 1);
    return wrap(fence);
  }
  if (format === "color") return wrap(`<span style="color: ${color}">`, "</span>");
  if (format === "link") {
    const label = selected || "链接文字", text = `[${label}](https://)`;
    const at = start + (selected ? label.length + 3 : 1);
    return replace(start, end, text, at, at + (selected ? 8 : label.length));
  }
  if (format === "codeblock" || format === "mermaid") {
    const fence = "`".repeat(Math.max(2, ...(selected.match(/`+/g) ?? []).map(run => run.length)) + 1);
    const before = start > 0 && value[start - 1] !== "\n" ? "\n" : "";
    const after = end < value.length && value[end] !== "\n" ? "\n" : "";
    const opening = `${before}${fence}${format === "mermaid" ? "mermaid" : ""}\n`;
    const body = selected || (format === "mermaid" ? "flowchart LR\n  A[开始] --> B[完成]" : "");
    return replace(start, end, `${opening}${body}\n${fence}${after}`, start + opening.length, start + opening.length + body.length);
  }
  const from = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = value.indexOf("\n", end > start && value[end - 1] === "\n" ? end - 1 : end);
  const to = lineEnd < 0 ? value.length : lineEnd;
  const lines = value.slice(from, to).split("\n");
  const changes = lines.map(line => format === "indent" ? 2 : -(line.match(/^( {1,2}|\t)/)?.[0].length ?? 0));
  const text = lines.map((line, index) => format === "indent" ? "  " + line : line.slice(-changes[index])).join("\n");
  return replace(from, to, text, Math.max(from, start + changes[0]), Math.max(from, end + changes.reduce((sum, change) => sum + change, 0)));
}

export function markdownShortcut(key: string, shift: boolean): MarkdownFormat | null {
  if (key === "b" && !shift) return "bold";
  if (key === "i" && !shift) return "italic";
  if (key === "k" && !shift) return "link";
  if (key === "h" && shift) return "highlight";
  if (key === "x" && shift) return "strike";
  if (key === "`" || key === "~") return shift ? "codeblock" : "code";
  return null;
}
