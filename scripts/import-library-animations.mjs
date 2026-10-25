// Reproduce the curated catalogue from the three pinned, read-only source checkouts.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import postcss from "postcss";

const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error("Usage: node scripts/import-library-animations.mjs <source-checkouts>");
const sources = {
  animate: { name: "Animate.css 4.1.1", repo: "https://github.com/animate-css/animate.css", revision: "4aa415199dd4ed7d877d10343e745e8bbb4b7a0c" },
  magic: { name: "Magic Animations", repo: "https://github.com/miniMAC/magic", revision: "f26d3c3beaf3017c90fb27ac6f67168fac26de06" },
  loaders: { name: "CSS Loaders", repo: "https://github.com/vineethtrv/css-loader", revision: "e9078959e48c39b97613f333c14aac1c3d765c1f" },
};
const out = "public/library/animations";
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync("content/library", { recursive: true });
for (const [key, source] of Object.entries(sources)) {
  const root = path.join(sourceRoot, key);
  if (execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim() !== source.revision) throw new Error(`Wrong revision: ${key}`);
  source.license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
  if (!source.license.includes("Permission is hereby granted")) throw new Error(`Review license: ${key}`);
  fs.writeFileSync(`${out}/${key}-LICENSE.txt`, source.license);
}
fs.writeFileSync("public/library/posters-LICENSE.txt", "Static preview frames derived from the following CSS animation sources.\n\n"+Object.values(sources).map(source => `${source.name}\n${source.repo}/tree/${source.revision}\n\n${source.license}`).join("\n\n"));

const words = { bounce: "弹跳", flash: "闪烁", pulse: "脉冲", rubberBand: "橡皮筋", shake: "摇晃", shakeX: "水平抖动", shakeY: "垂直抖动", headShake: "摇头", swing: "摇摆", tada: "欢呼", wobble: "晃动", jello: "果冻", heartBeat: "心跳", hinge: "铰链脱落", jackInTheBox: "弹出盒子", magic: "魔法消散", swap: "旋转换位", flip: "立体翻转" };
const families = { back: "回弹", bounce: "弹跳", fade: "淡变", flip: "翻转", lightSpeed: "光速滑动", rotate: "旋转", roll: "卷动", zoom: "缩放", slide: "滑动", puff: "模糊缩放", vanish: "虚化", boing: "弹性扭动", bomb: "爆破", twister: "旋风", foolish: "折叠旋转", hole: "旋涡", swash: "弹性缩放", space: "空间缩放", perspective: "透视翻折", open: "开合翻折", tin: "金属弹跳" };
function displayName(name) {
  if (words[name]) return words[name];
  const family = Object.keys(families).sort((a,b) => b.length-a.length).find(key => name.startsWith(key));
  if (!family) throw new Error(`Missing name: ${name}`);
  const tail = name.slice(family.length), action = tail.includes("Return") ? "复位" : tail.includes("In") ? "入场" : tail.includes("Out") ? "退场" : "";
  const direction = tail.replace(/Return|Big|In|Out/g, "").replace(/Bottom|Down/g, "下").replace(/Top|Up/g, "上").replaceAll("Left", "左").replaceAll("Right", "右").replaceAll("X", "X 轴").replaceAll("Y", "Y 轴");
  return `${families[family]} · ${action}${direction ? action ? `（${direction}）` : direction : ""}${tail.includes("Big") ? " · 大幅" : ""}`;
}
const catalogue = [], hashes = new Set();
function add(source, relative, name, group, kind, title) {
  const raw = fs.readFileSync(path.join(sourceRoot, source, relative), "utf8");
  const content = raw.match(/\/\*\s*@content:\s*("(?:\\.|[^"\\])*")\s*\*\//)?.[1];
  const label = kind === "element" ? "Motion" : content ? JSON.parse(content) : "";
  if (typeof label !== "string" || label.length > 80 || /[<>&{}]/.test(label)) throw new Error(`Invalid text content: ${relative}`);
  const ast = postcss.parse(raw.replace(/\/\* @Hide \*\/[\s\S]*?\/\* @HideEnds \*\//g, ""));
  const slug = `${source}-${name.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`;
  const className = `vp-motion-${slug}`;
  const keys = new Map();
  ast.walkAtRules(rule => {
    if (/keyframes$/.test(rule.name)) keys.set(rule.params, `${className}-${rule.params}`);
    else throw new Error(`Unexpected rule in ${relative}: ${rule.name}`);
  });
  if (!keys.size || /url\(|<\/style|@import/.test(raw)) throw new Error(`Invalid motion: ${relative}`);
  ast.walkComments(comment => comment.remove());
  ast.walkAtRules(rule => { rule.params = keys.get(rule.params); });
  ast.walkRules(rule => {
    if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
    rule.selector = rule.selector.replace(/\.animated(?=\.)/g, "").replaceAll(kind === "loader" ? ".loader" : `.${name}`, `.${className}`);
    if (!rule.selector.startsWith(`.${className}`)) throw new Error(`Unscoped selector: ${rule.selector}`);
  });
  ast.walkDecls(decl => {
    if (/^(?:-webkit-)?animation(?:-|$)/.test(decl.prop)) {
      for (const [key, value] of keys) decl.value = decl.value.replace(new RegExp(`(?<![\\w-])${key}(?![\\w-])`, "g"), value);
      decl.value = decl.value.replace(/(?<![\w-])(-?(?:\d*\.)?\d+)(ms|s)\b/g, (_, n, unit) => `calc(${n}${unit} * var(--motion-scale, 1))`);
    }
  });
  // Detect identical source effects even when their upstream names differ.
  const signature = ast.toString().replaceAll(className, "motion").replace(/motion-[\w-]+/g, "keyframe").replace(/#[\da-f]{3,8}\b/gi, "color").replace(/\s/g, "");
  const hash = createHash("sha256").update(signature).digest("hex");
  if (hashes.has(hash)) return false;
  hashes.add(hash);
  let css = ast.toString();
  if (kind !== "loader") css = `.${className}{--animate-duration:calc(1s * var(--motion-scale, 1));animation-duration:var(--animate-duration);animation-fill-mode:both;}\n${css}`;
  css += `\n@media(prefers-reduced-motion:reduce){.${className}:not([data-motion-opt-in=true]),.${className}:not([data-motion-opt-in=true])::before,.${className}:not([data-motion-opt-in=true])::after{animation:none!important}}\n`;
  const upstream = sources[source];
  const sourceUrl = `${upstream.repo}/blob/${upstream.revision}/${relative}`;
  const header = `/*\n${upstream.license}\nSource: ${sourceUrl}\nVibePolaris: namespaced selectors/keyframes, playback scale, reduced-motion support.\n*/\n`;
  fs.writeFileSync(`${out}/${slug}.css`, header+css);
  const previewVersion = createHash("sha256").update(header+css+"poster-v1"+label).digest("hex").slice(0, 12);
  catalogue.push({ slug, name: title || displayName(name), english: name, group, kind, source, sourceUrl, label, previewVersion });
  return true;
}

for (const file of fs.readdirSync(path.join(sourceRoot, "animate/source"), { recursive: true }).filter(f => f.endsWith(".css") && f.split("/").length === 2).sort()) {
  const name = path.basename(file, ".css"), family = file.split("/")[0];
  const group = family.endsWith("entrances") || /In/.test(name) ? "入场" : family.endsWith("exits") || /Out|hinge/.test(name) ? "退场" : "强调";
  add("animate", `source/${file}`, name, group, "element");
}
for (const file of fs.readdirSync(path.join(sourceRoot, "magic/assets/scss"), { recursive: true }).filter(f => f.endsWith(".scss") && f.split("/").length === 2).sort()) {
  const name = path.basename(file, ".scss").replace(/^_/, "");
  add("magic", `assets/scss/${file}`, name, /In|Return/.test(name) ? "入场" : /Out|magic/.test(name) ? "退场" : "空间变换", "element");
}
const loaderGroups = { circle: "圆环加载", bubble: "圆点加载", rect: "条形加载", line: "线条加载", progress: "进度加载", text: "文字加载", objects: "趣味加载", graph: "图形加载", skeleton: "骨架屏" };
const queues = Object.keys(loaderGroups).map(group => fs.readdirSync(path.join(sourceRoot, `loaders/src/loaders/${group}`)).filter(f => f.endsWith(".module.css")).sort().map(file => ({ group, file })));
while (catalogue.length < 300) {
  let added = false;
  for (const queue of queues) {
    const next = queue.shift();
    if (!next || catalogue.length >= 300) continue;
    const name = path.basename(next.file, ".module.css"), index = name.match(/\d+$/)[0];
    added = add("loaders", `src/loaders/${next.group}/${next.file}`, name, loaderGroups[next.group], "loader", `${loaderGroups[next.group]} · ${index}`) || added;
  }
  if (!added) throw new Error("Not enough distinct animations");
}
// Alternate groups so the first page presents a useful range of effects.
const groups = Map.groupBy(catalogue, item => item.group), ordered = [];
while (ordered.length < catalogue.length) for (const queue of groups.values()) if (queue.length) ordered.push(queue.shift());
fs.writeFileSync("content/library/animations.json", JSON.stringify(ordered, null, 2)+"\n");
fs.writeFileSync("content/library/animation-sources.json", JSON.stringify(Object.fromEntries(Object.entries(sources).map(([key,{license,...source}])=>[key,source])),null,2)+"\n");
console.log(JSON.stringify({ total: ordered.length, sources: Object.fromEntries(Object.keys(sources).map(key => [key, ordered.filter(item => item.source===key).length])) }));
