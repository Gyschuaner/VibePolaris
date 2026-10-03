import type { Root, RootContent } from "mdast";

// Transform Markdown text nodes only: code, existing links and external URLs
// keep their semantics. Only published routes supplied by the server can link.
export function remarkTermLinks(termNames: Record<string, string>) {
  return (tree: Root) => {
    function visit(node: Root | RootContent) {
      if (!("children" in node) || node.type === "link" || node.type === "linkReference") return;
      node.children = node.children.flatMap((child): RootContent[] => {
        if (child.type !== "text") { visit(child); return [child]; }
        const parts: RootContent[] = [];
        let cursor = 0;
        const pattern = /(^|[^\w/.:=-])(\/terms\/([a-z0-9]+(?:-[a-z0-9]+)*))(?=$|[^\w/#?%=&-])/g;
        for (const match of child.value.matchAll(pattern)) {
          const url = match[2];
          if (!termNames[url]) continue;
          const start = match.index! + match[1].length;
          if (start > cursor) parts.push({ type: "text", value: child.value.slice(cursor, start) });
          parts.push({ type: "link", url, children: [{ type: "text", value: termNames[url] }] });
          cursor = start + url.length;
        }
        if (!cursor) return [child];
        if (cursor < child.value.length) parts.push({ type: "text", value: child.value.slice(cursor) });
        return parts;
      }) as typeof node.children;
    }
    visit(tree);
  };
}
