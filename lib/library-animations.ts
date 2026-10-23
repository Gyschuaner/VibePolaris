import catalogue from "../content/library/animations.json" with { type: "json" };
import sources from "../content/library/animation-sources.json" with { type: "json" };

export const libraryAnimations = catalogue;
export type LibraryAnimation = typeof catalogue[number];
export const animationSources = sources;
export const animationGroups = [...new Set(catalogue.map(item => item.group))];
const bySlug = new Map(catalogue.map(item => [item.slug, item]));
export function libraryAnimation(slug: string) { return bySlug.get(slug); }
export function animationSource(item: LibraryAnimation) { return sources[item.source as keyof typeof sources]; }

const demoStyle = ".vp-motion-demo{display:grid;place-items:center;width:112px;height:84px;border-radius:16px;background:#92664f;color:#fff;font:600 16px/1.4 system-ui,sans-serif}";
export function animationCode(item: LibraryAnimation, css: string, format: string, speed = 1) {
  const className = `vp-motion-${item.slug}${item.kind === "element" ? " vp-motion-demo" : ""}`;
  const styles = `${css}\n${item.kind === "element" ? demoStyle : ""}`;
  const templateStyles = styles.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${");
  const label = item.kind === "element" ? "Motion" : "";
  const scale = Number((1 / speed).toFixed(3));
  if (format === "react") return `export default function MotionExample() {\n  return (<>\n    <style>{\`${templateStyles}\`}</style>\n    <div className="${className}" style={{ "--motion-scale": ${scale} }}${item.kind === "loader" ? ' role="status" aria-label="加载中"' : ""}>${label}</div>\n  </>);\n}\n`;
  return `<!doctype html>\n<html lang="zh-CN">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${item.name}</title>\n<style>\nbody{margin:0;min-height:100vh;display:grid;place-items:center;background:#21252b;color:#fff;font:16px system-ui,sans-serif}\n.motion-frame{width:min(260px,80vw);height:180px;display:grid;place-items:center}\n${styles}\n</style>\n<div class="motion-frame"><div class="${className}" style="--motion-scale:${scale}"${item.kind === "loader" ? ' role="status" aria-label="加载中"' : ""}>${label}</div></div>\n</html>\n`;
}
