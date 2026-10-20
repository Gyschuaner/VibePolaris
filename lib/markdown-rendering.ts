import { defaultSchema } from "rehype-sanitize";
import type { Root, Element } from "hast";

// Allow only a text color through HTML; arbitrary CSS never reaches the renderer.
export function safeTextColor(style: unknown): string | undefined {
  if (typeof style !== "string") return;
  const color = /^\s*color\s*:\s*([^;]+);?\s*$/i.exec(style)?.[1].trim();
  if (color && /^(?:#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8}|[a-z]{1,24}|(?:rgb|hsl)a?\([\d.%\s,+/-]+\))$/i.test(color)) return color;
}

export function rehypeTextColors() {
  return (tree: Root) => {
    function visit(node: Root | Element) {
      for (const child of node.children) {
        if (child.type !== "element") continue;
        const color = child.tagName === "span" ? safeTextColor(child.properties.style) : undefined;
        delete child.properties.style;
        if (color) child.properties.style = `color: ${color}`;
        visit(child);
      }
    }
    visit(tree);
  };
}

export const markdownSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "mark"],
  protocols: { ...defaultSchema.protocols, src: [...(defaultSchema.protocols?.src ?? []), "data"] },
  attributes: { ...defaultSchema.attributes, span: ["style"], code: [["className", /^language-[\w-]+$/]] },
};
