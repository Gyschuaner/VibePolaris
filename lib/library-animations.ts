import catalogue from "../content/library/animations.json" with { type: "json" };
import sources from "../content/library/animation-sources.json" with { type: "json" };

export const libraryAnimations = catalogue;
export type LibraryAnimation = typeof catalogue[number];
export const animationSources = sources;
export const animationGroups = [...new Set(catalogue.map(item => item.group))];
export const animationCollections = [
  { name: "入场与退场", description: "让内容自然出现、离开。", groups: ["入场", "退场"] },
  { name: "强调与空间", description: "吸引注意，表达层次变化。", groups: ["强调", "空间变换"] },
  { name: "加载等待", description: "为正在进行的操作提供反馈。", groups: ["圆环加载", "圆点加载", "条形加载", "线条加载", "文字加载", "趣味加载", "图形加载"] },
  { name: "进度与骨架", description: "呈现完成进度，预留内容位置。", groups: ["进度加载", "骨架屏"] },
];
export const animationsByGroup = new Map(animationGroups.map(group => [group, catalogue.filter(item => item.group === group)]));
const bySlug = new Map(catalogue.map(item => [item.slug, item]));
export function libraryAnimation(slug: string) { return bySlug.get(slug); }
export function animationSource(item: LibraryAnimation) { return sources[item.source as keyof typeof sources]; }
export function animationPoster(item: LibraryAnimation) { return `/library/posters/${item.slug}-${item.previewVersion}.jpg`; }
export function animationStylesheet(item: LibraryAnimation) { return `/library/animations/${item.slug}.css?v=${item.previewVersion}`; }

const demoStyle = ".vp-motion-demo{display:grid;place-items:center;width:112px;height:84px;border-radius:16px;background:#92664f;color:#fff;font:600 16px/1.4 system-ui,sans-serif}";
export function animationCode(item: LibraryAnimation, css: string, format: string, speed = 1) {
  const className = `vp-motion-${item.slug}${item.kind === "element" ? " vp-motion-demo" : ""}`;
  const styles = `${css}\n${item.kind === "element" ? demoStyle : ""}`;
  const templateStyles = styles.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${");
  const label = item.label;
  const scale = Number((1 / speed).toFixed(3));
  if (format === "react") return `export default function MotionExample() {\n  return (<>\n    <style>{\`${templateStyles}\`}</style>\n    <div className="${className}" style={{ "--motion-scale": ${scale} }}${item.kind === "loader" ? ' role="status" aria-label="加载中"' : ""}>${label}</div>\n  </>);\n}\n`;
  return `<!doctype html>\n<html lang="zh-CN">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${item.name}</title>\n<style>\nbody{margin:0;min-height:100vh;display:grid;place-items:center;background:#21252b;color:#fff;font:16px system-ui,sans-serif}\n.motion-frame{width:min(260px,80vw);height:180px;display:grid;place-items:center}\n${styles}\n</style>\n<div class="motion-frame"><div class="${className}" style="--motion-scale:${scale}"${item.kind === "loader" ? ' role="status" aria-label="加载中"' : ""}>${label}</div></div>\n</html>\n`;
}
