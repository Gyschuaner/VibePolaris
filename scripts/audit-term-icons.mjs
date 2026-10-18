import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const terms = [
  ...readJson("content/zh/terms.json"),
  ...fs.readdirSync(path.join(root, "content/zh/term-batches"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .flatMap((entry) => readJson(path.join("content/zh/term-batches", entry.name))),
];
const slugs = [...new Set(terms.map((term) => term.slug))];
const icons = readJson("content/zh/term-icons.json");
const glyphSource = fs.readFileSync(path.join(root, "components/terms/TermIcon.tsx"), "utf8");
const glyphKinds = [...glyphSource.matchAll(/case\s+"([^"\\]+)":/g)].map((match) => match[1]);
const duplicateGlyphCases = glyphKinds.filter((kind, index) => glyphKinds.indexOf(kind) !== index);
const mappedKinds = [...new Set(Object.values(icons))];
const missing = slugs.filter((slug) => !icons[slug]);
const extra = Object.keys(icons).filter((slug) => !slugs.includes(slug));
const missingGlyphs = mappedKinds.filter((kind) => !glyphKinds.includes(kind));
const extraGlyphs = glyphKinds.filter((kind) => !mappedKinds.includes(kind));
const groupedKinds = Object.entries(Object.entries(icons).reduce((groups, entry) => {
  const kind = entry[1];
  (groups[kind] ??= []).push(entry);
  return groups;
}, {}));
const duplicateKinds = groupedKinds
  .filter(([, entries]) => entries.length > 1)
  .map(([kind, entries]) => `${kind}: ${entries.map(([slug]) => slug).join(", ")}`);

console.log(`terms=${slugs.length} mapped=${Object.keys(icons).length} uniqueKinds=${mappedKinds.length} glyphCases=${new Set(glyphKinds).size}`);
if (missing.length || extra.length || missingGlyphs.length || extraGlyphs.length || duplicateKinds.length || duplicateGlyphCases.length) {
  if (missing.length) console.error(`missing: ${missing.join(", ")}`);
  if (extra.length) console.error(`extra: ${extra.join(", ")}`);
  if (missingGlyphs.length) console.error(`missing glyph cases: ${missingGlyphs.join(", ")}`);
  if (extraGlyphs.length) console.error(`extra glyph cases: ${extraGlyphs.join(", ")}`);
  if (duplicateKinds.length) console.error(`duplicate kinds: ${duplicateKinds.join("; ")}`);
  if (duplicateGlyphCases.length) console.error(`duplicate glyph cases: ${duplicateGlyphCases.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`coverage=${slugs.length}/${slugs.length}; glyphs=${mappedKinds.length}/${mappedKinds.length}; missing=0; extra=0; duplicateKinds=0`);
}
