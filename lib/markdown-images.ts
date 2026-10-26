import type { MarkdownEdit } from "./markdown-editing";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Definition, Nodes } from "mdast";
import { safeNodeUrl } from "./canvas.ts";

export const MARKDOWN_IMAGE_ACCEPT = "image/png,image/jpeg,image/gif,image/webp,image/avif";
const DOCUMENT_LIMIT = 10 * 1024 * 1024;
type MarkdownImage = { name: string; source: string };
export type MarkdownImageRange = { from: number; to: number; source: string; alt: string; title?: string | null };

function parseMarkdownImages(markdown: string) {
  const tree = fromMarkdown(markdown), definitions = new Map<string, Definition>(), images: MarkdownImageRange[] = [];
  function collect(node: Nodes) {
    if (node.type === "definition") definitions.set(node.identifier.toUpperCase(), node);
    if ("children" in node) node.children.forEach(collect);
  }
  function visit(node: Nodes) {
    if (node.type === "image" || node.type === "imageReference") {
      const image = node.type === "image" ? node : definitions.get(node.identifier.toUpperCase());
      const source = safeNodeUrl(image?.url ?? "", true);
      if (source && node.position?.start.offset !== undefined && node.position.end.offset !== undefined) images.push({ from: node.position.start.offset, to: node.position.end.offset, source, alt: node.alt || "图片", title: image?.title });
    }
    if ("children" in node) node.children.forEach(visit);
  }
  collect(tree); visit(tree); return { images, definitions: [...definitions.values()] };
}

export function markdownImageRanges(markdown: string): MarkdownImageRange[] {
  return parseMarkdownImages(markdown).images;
}

export function prepareOrganizeImages(markdown: string) {
  const { images, definitions } = parseMarkdownImages(markdown);
  const prefix = `vp-image:${crypto.randomUUID()}:`;
  const replacements = images.map((image, index) => {
    const alt = image.alt.replace(/[\\[\]]/g, "\\$&");
    const title = image.title ? ` "${image.title.replace(/[\\"]/g, "\\$&")}"` : "";
    const label = image.alt.replace(/--|[<>\r\n]/g, " ").slice(0, 120);
    return { ...image, marker: `<!-- ${prefix}${index} ${label} -->`, original: `![${alt}](<${image.source}>${title})` };
  });
  const edits = replacements.map(image => ({ from: image.from, to: image.to, text: image.marker }));
  // Reference definitions can carry the same large data URL as an inline image.
  for (const definition of definitions) {
    if (definition.url.startsWith("data:image/") && definition.position?.start.offset !== undefined && definition.position.end.offset !== undefined
      && images.some(image => image.source === definition.url)) {
      edits.push({ from: definition.position.start.offset, to: definition.position.end.offset, text: "" });
    }
  }
  let prepared = markdown;
  for (const edit of edits.sort((a, b) => b.from - a.from)) prepared = prepared.slice(0, edit.from) + edit.text + prepared.slice(edit.to);
  return {
    markdown: prepared,
    restore(value: string, complete = false) {
      for (const image of replacements) {
        let found = false;
        value = value.replaceAll(image.marker, () => {
          if (found) return "";
          found = true; return image.original;
        });
      }
      if (!complete || !images.length) return value;
      const present = markdownImageRanges(value).map(image => image.source), missing: string[] = [];
      for (const image of replacements) {
        const index = present.indexOf(image.source);
        if (index < 0) missing.push(image.original);
        else present.splice(index, 1);
      }
      return missing.length ? `${value.trimEnd()}\n\n${missing.join("\n\n")}` : value;
    },
  };
}

export async function readMarkdownImages(files: File[]): Promise<MarkdownImage[]> {
  if (files.some(file => !MARKDOWN_IMAGE_ACCEPT.split(",").includes(file.type) || file.size > 5 * 1024 * 1024)) {
    throw new Error("请选择 5 MB 以内的 PNG、JPEG、GIF、WebP 或 AVIF 图片。");
  }
  async function dataUrl(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reader.onabort = () => reject(new Error("图片读取失败，请重试。"));
      reader.readAsDataURL(blob);
    });
  }
  const images: MarkdownImage[] = [];
  let total = 0;
  // Decode one file at a time so a multi-image paste does not spike memory.
  for (const file of files) {
    let source = await dataUrl(file);
    const image = new Image(); image.src = source;
    try { await image.decode(); } catch { throw new Error("图片无法读取，请换一张有效图片。"); }
    if (file.size >= 200_000 && ["image/png", "image/jpeg"].includes(file.type)) {
      const bytes = file.type === "image/png" ? new Uint8Array(await file.arrayBuffer()) : undefined;
      // Keep animated PNGs intact, along with GIF/WebP/AVIF animations.
      const animated = bytes?.some((byte, index) => byte === 97 && bytes[index + 1] === 99 && bytes[index + 2] === 84 && bytes[index + 3] === 76);
      if (!animated) {
        const canvas = document.createElement("canvas"), scale = Math.min(1, 2560 / image.naturalWidth);
        try {
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", .92));
            if (blob?.type === "image/webp" && blob.size < file.size) source = await dataUrl(blob);
          }
        } catch { /* Keep the original if this browser cannot encode the image. */ }
        finally { canvas.width = canvas.height = 0; }
      }
    }
    total += source.length;
    if (total > DOCUMENT_LIMIT) throw new Error("插入图片后的 Markdown 不能超过 10 MB，请减少图片或缩小后再试。");
    images.push({ name: file.name, source });
  }
  return images;
}

export function insertMarkdownImages(value: string, at: number, images: MarkdownImage[]): MarkdownEdit {
  const body = images.map(image => {
    const label = (image.name.replace(/\.[^.]+$/, "").replace(/[\r\n]/g, " ").slice(0, 120) || "图片").replace(/[\\[\]]/g, "\\$&");
    return `![${label}](<${image.source}>)`;
  }).join("\n\n");
  const before = at === 0 || value.slice(0, at).endsWith("\n\n") ? "" : value[at - 1] === "\n" ? "\n" : "\n\n";
  const after = value.slice(at).startsWith("\n\n") ? "" : value[at] === "\n" ? "\n" : "\n\n";
  const text = before + body + after;
  if (new TextEncoder().encode(value).length + new TextEncoder().encode(text).length > DOCUMENT_LIMIT) {
    throw new Error("插入图片后的 Markdown 不能超过 10 MB，请减少图片或缩小后再试。");
  }
  return { from: at, to: at, text, start: at + text.length, end: at + text.length };
}
