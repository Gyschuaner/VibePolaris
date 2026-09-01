import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const experienceDir = resolve(root, "content/zh/term-experiences");
const experienceFiles = readdirSync(experienceDir).filter((name) => name.endsWith(".json"));
const experiences = experienceFiles.flatMap((name) => JSON.parse(readFileSync(resolve(experienceDir, name), "utf8")));

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[a-z0-9_-]+/g, "x")
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

function grams(value, size = 2) {
  const result = new Set();
  if (value.length <= size) return new Set([value]);
  for (let index = 0; index <= value.length - size; index += 1) result.add(value.slice(index, index + size));
  return result;
}

function jaccard(left, right) {
  const a = grams(left);
  const b = grams(right);
  const intersection = [...a].filter((item) => b.has(item)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

const fields = {
  lead: (item) => item.lead,
  definition: (item) => item.definition,
  boundary: (item) => item.boundary,
  frames: (item) => item.frames.map((frame) => `${frame.label}${frame.note}`).join(""),
  quiz: (item) => `${item.quiz.question}${item.quiz.options.map((option) => option.label).join("")}`,
  prompt: (item) => `${item.prompt.title}${item.prompt.text}`,
};

const nearDuplicates = [];
for (const [field, read] of Object.entries(fields)) {
  for (let leftIndex = 0; leftIndex < experiences.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < experiences.length; rightIndex += 1) {
      const left = experiences[leftIndex];
      const right = experiences[rightIndex];
      const similarity = jaccard(normalize(read(left)), normalize(read(right)));
      if (similarity >= 0.72) nearDuplicates.push({ field, left: left.slug, right: right.slug, similarity: Number(similarity.toFixed(3)) });
    }
  }
}

const sceneFingerprints = new Map();
for (const experience of experiences) {
  const fingerprint = [
    experience.sceneKind,
    experience.actors.map((actor) => actor.label).join("|"),
    experience.frames.map((frame) => frame.label).join("|"),
    experience.actionLabel,
  ].join("::");
  const previous = sceneFingerprints.get(fingerprint);
  sceneFingerprints.set(fingerprint, previous ? [...previous, experience.slug] : [experience.slug]);
}

const duplicateScenes = [...sceneFingerprints.entries()]
  .filter(([, slugs]) => slugs.length > 1)
  .map(([fingerprint, slugs]) => ({ fingerprint, slugs }));

const coarseStructures = new Map();
for (const experience of experiences) {
  const signature = [experience.sceneKind, experience.frames.length, experience.actors.length, experience.edges.length].join("/");
  const previous = coarseStructures.get(signature);
  coarseStructures.set(signature, previous ? [...previous, experience.slug] : [experience.slug]);
}

const repeatedStructures = [...coarseStructures.entries()]
  .map(([signature, slugs]) => ({ signature, count: slugs.length, slugs }))
  .sort((left, right) => right.count - left.count);

const adjacentSceneKinds = [];
for (let index = 1; index < experiences.length; index += 1) {
  const previous = experiences[index - 1];
  const current = experiences[index];
  if (previous.sceneKind === current.sceneKind) {
    adjacentSceneKinds.push({ previous: previous.slug, current: current.slug, sceneKind: current.sceneKind });
  }
}

function controlKind(actionLabel) {
  if (/拖动|调整|改变|修改|移动|缩窄|收窄|调高|扩大|增删|回溯/.test(actionLabel)) return "range";
  if (/选择|切换|更换|开关|启停|筛选|勾选|比较|查看|探测|决定/.test(actionLabel)) return "select";
  return "step";
}

const controlKinds = Object.fromEntries(
  ["range", "select", "step"].map((kind) => [kind, experiences.filter((item) => controlKind(item.actionLabel) === kind).length]),
);

const sceneKinds = Object.fromEntries(
  [...new Set(experiences.map((item) => item.sceneKind))]
    .sort()
    .map((kind) => [kind, experiences.filter((item) => item.sceneKind === kind).length]),
);

const frameCounts = Object.fromEntries(
  [...new Set(experiences.map((item) => item.frames.length))]
    .sort((left, right) => left - right)
    .map((count) => [count, experiences.filter((item) => item.frames.length === count).length]),
);

const result = {
  experienceCount: experiences.length,
  uniqueSlugs: new Set(experiences.map((item) => item.slug)).size,
  sourceCoverage: experiences.filter((item) => item.sources?.length > 0).length,
  sceneKinds,
  frameCounts,
  duplicateSceneCount: duplicateScenes.length,
  duplicateScenes,
  largestCoarseStructure: repeatedStructures[0],
  adjacentSceneKindCount: adjacentSceneKinds.length,
  adjacentSceneKinds,
  controlKinds,
  nearDuplicatePairCount: nearDuplicates.length,
  nearDuplicates: nearDuplicates.sort((left, right) => right.similarity - left.similarity).slice(0, 120),
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

if (
  duplicateScenes.length > 0
  || result.uniqueSlugs !== experiences.length
  || adjacentSceneKinds.length > 0
  || repeatedStructures[0]?.count > 12
) process.exitCode = 1;
