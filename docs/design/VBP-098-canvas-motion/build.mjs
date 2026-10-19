import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const read = name => readFile(path.join(directory, name), "utf8");
const variants = [
  { key:"a", file:"a-expand.html", label:"A · 卡片展开", duration:540, description:"简述卡片从原位展开，成为完整的阅读页面。" },
  { key:"b", file:"b-focus.html", label:"B · 聚焦推近", duration:380, description:"视线向当前节点推近，再进入安静的阅读页面。" },
  { key:"c", file:"c-sheet.html", label:"C · 纸张铺开", duration:360, description:"全文像一张纸从下方铺开，画布轻轻退到后面。" }
];
const [template, styles, controller, trail, star] = await Promise.all([
  read("page.template"), read("preview.css"), read("controller.js"),
  readFile(path.resolve(directory, "../../..", "public/meteor-trail-frames.png")),
  readFile(path.resolve(directory, "../../..", "public/polaris-star-mask.png"))
]);
const css = styles.replace("__TRAIL__", `data:image/png;base64,${trail.toString("base64")}`).replace("__STAR__", `data:image/png;base64,${star.toString("base64")}`);
for (const variant of variants) {
  const motion = await read(`motion-${variant.key}.js`);
  assert.match(motion, /window\.motion\s*=/);
  const replacements = { LABEL:variant.label, KEY:variant.key, DURATION:variant.duration, DESCRIPTION:variant.description, CSS:css, MOTION:motion, CONTROLLER:controller };
  const html = template.replace(/__([A-Z]+)__/g, (_, key) => {
    assert.ok(key in replacements, `Unknown placeholder: ${key}`);
    return replacements[key];
  });
  assert.doesNotMatch(html, /__[A-Z]+__/);
  assert.equal((html.match(/data-key="[abc]"/g) ?? []).length, 3);
  assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)="https?:/i);
  await writeFile(path.join(directory, variant.file), html);
  if (variant.key === "a") await writeFile(path.join(directory, "index.html"), html);
}
console.log("Built A / B / C standalone motion previews; assets and scripts are embedded.");
