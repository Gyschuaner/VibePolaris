import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const baseTerms = readJson("content/zh/terms.json");
const batchFiles = readdirSync(new URL("../content/zh/term-batches/", import.meta.url))
  .filter((name) => name.endsWith(".json"));
const batches = batchFiles.flatMap((name) => readJson(`content/zh/term-batches/${name}`));
const allTerms = [...baseTerms, ...batches];
const researchFiles = readdirSync(new URL("../content/zh/term-research/", import.meta.url))
  .filter((name) => name.endsWith(".json"));
const researchCards = researchFiles.flatMap((name) => readJson(`content/zh/term-research/${name}`));
const experienceFiles = readdirSync(new URL("../content/zh/term-experiences/", import.meta.url))
  .filter((name) => name.endsWith(".json"));
const experiences = experienceFiles.flatMap((name) => readJson(`content/zh/term-experiences/${name}`));
const demoTypes = new Set(["flow", "state", "comparison", "hierarchy", "lifecycle", "queue", "branch", "request"]);
const categories = new Set(["前端", "后端", "AI·Agent", "技术栈", "Git", "产品与设计"]);
const sceneKinds = new Set(["route", "pipeline", "transform", "compare", "layers", "tree", "network", "timeline", "queue", "state-machine", "memory", "contract", "branch", "loop", "matrix", "spectrum", "assembly", "terminal"]);
const actorIcons = new Set(["browser", "server", "database", "file", "code", "user", "robot", "brain", "gear", "package", "git", "shield", "key", "cloud", "clock", "queue", "search", "chart", "layout", "component", "message", "network", "memory", "spark"]);

test("核心词库保持在约 300 条且标识唯一", () => {
  assert.ok(allTerms.length >= 290 && allTerms.length <= 310, `当前共有 ${allTerms.length} 条`);
  assert.equal(new Set(allTerms.map((term) => term.slug)).size, allTerms.length, "slug 不能重复");
  assert.equal(new Set(allTerms.map((term) => term.zh)).size, allTerms.length, "中文名不能重复");
  for (const term of allTerms) {
    assert.match(term.slug, /^[a-z0-9-]+$/);
    assert.ok(categories.has(term.cat), `${term.slug} 分类无效`);
  }
});

test("迁移底稿保留完整字段、旧三步演示和项目检查", () => {
  for (const term of allTerms) {
    for (const key of ["question", "definition", "boundary", "demoTitle", "quizQuestion", "correctText", "wrongText", "promptTitle", "prompt"]) {
      assert.ok(typeof term[key] === "string" && term[key].trim(), `${term.slug} 缺少 ${key}`);
    }
    assert.ok(demoTypes.has(term.demoType), `${term.slug} 动画类型无效`);
    assert.equal(term.demoSteps?.length, 3, `${term.slug} 必须有三步动画`);
    assert.equal(term.quizOptions?.length, 3, `${term.slug} 必须有三个检查选项`);
    assert.ok(term.relatedSlugs?.length >= 2 && term.relatedSlugs.length <= 4, `${term.slug} 相关词数量无效`);
    for (const step of term.demoSteps) {
      assert.ok(step.label && step.value && step.note, `${term.slug} 动画步骤不完整`);
      assert.notEqual(step.note, term.definition, `${term.slug} 动画不能直接重复定义`);
    }
  }
});

test("全部 300 条词条均有独立研究卡、权威来源与唯一分镜", () => {
  const expectedSlugs = new Set(allTerms.map((term) => term.slug));
  const researchSlugs = new Set(researchCards.map((card) => card.slug));
  const signatures = new Set();

  assert.equal(researchCards.length, expectedSlugs.size, "逐页研究卡应覆盖全部正式词条");
  assert.equal(researchSlugs.size, researchCards.length, "研究卡 slug 不能重复");

  for (const slug of expectedSlugs) {
    assert.ok(researchSlugs.has(slug), `${slug} 缺少逐页研究卡`);
  }

  for (const card of researchCards) {
    for (const key of ["mechanism", "misconception", "demoSignature", "rewriteRisk"]) {
      assert.ok(typeof card[key] === "string" && card[key].trim(), `${card.slug} 缺少 ${key}`);
    }
    assert.ok(Array.isArray(card.sourceUrls) && card.sourceUrls.length >= 1 && card.sourceUrls.length <= 3, `${card.slug} 来源数量无效`);
    assert.ok(card.sourceUrls.every((url) => /^https:\/\//.test(url)), `${card.slug} 来源必须使用 HTTPS`);
    assert.match(card.demoSignature, /[2-7]\s*(?:帧|frames?)/i, `${card.slug} 分镜帧数必须在 2–7`);
    assert.ok(!signatures.has(card.demoSignature), `${card.slug} 与其他词条使用了相同分镜`);
    signatures.add(card.demoSignature);
  }
});

test("除四个专属页面外，每个词条都有可验证的独立互动体验", () => {
  const specialSlugs = new Set(["component", "css", "html", "javascript"]);
  const expectedSlugs = new Set(allTerms.filter((term) => !specialSlugs.has(term.slug)).map((term) => term.slug));
  const experienceSlugs = new Set(experiences.map((experience) => experience.slug));
  const fingerprints = new Set();

  assert.equal(experiences.length, expectedSlugs.size, "互动体验应覆盖全部非专属词条");
  assert.equal(experienceSlugs.size, experiences.length, "互动体验 slug 不能重复");

  for (const slug of expectedSlugs) assert.ok(experienceSlugs.has(slug), `${slug} 缺少独立互动体验`);
  for (const experience of experiences) {
    assert.ok(expectedSlugs.has(experience.slug), `${experience.slug} 不应落入通用互动体验`);
    assert.ok(sceneKinds.has(experience.sceneKind), `${experience.slug} 动画结构无效`);
    assert.ok(experience.actors.length >= 2 && experience.actors.length <= 8, `${experience.slug} 演示对象数量无效`);
    assert.ok(experience.frames.length >= 2 && experience.frames.length <= 7, `${experience.slug} 动画帧数无效`);
    assert.ok(experience.sources.length >= 1 && experience.sources.length <= 3, `${experience.slug} 来源数量无效`);
    assert.ok(experience.sources.every((source) => /^https:\/\//.test(source.url)), `${experience.slug} 来源必须使用 HTTPS`);
    assert.equal(experience.quiz.options.length, 3, `${experience.slug} 判断题选项数量无效`);
    assert.equal(experience.quiz.options.filter((option) => option.correct).length, 1, `${experience.slug} 判断题必须只有一个正确答案`);

    const actorIds = new Set(experience.actors.map((actor) => actor.id));
    const edgeIds = new Set(experience.edges.map((edge) => edge.id));
    assert.equal(actorIds.size, experience.actors.length, `${experience.slug} 演示对象 id 重复`);
    assert.equal(edgeIds.size, experience.edges.length, `${experience.slug} 连线 id 重复`);
    assert.ok(experience.actors.every((actor) => /^[a-z0-9-]+$/.test(actor.id)), `${experience.slug} 演示对象 id 格式无效`);
    assert.ok(experience.edges.every((edge) => /^[a-z0-9-]+$/.test(edge.id)), `${experience.slug} 连线 id 格式无效`);
    assert.ok(experience.actors.every((actor) => actorIcons.has(actor.icon)), `${experience.slug} 使用了未知图标`);
    for (const edge of experience.edges) {
      assert.ok(actorIds.has(edge.from) && actorIds.has(edge.to), `${experience.slug} 连线引用了不存在的对象`);
    }
    for (const frame of experience.frames) {
      const actorRefs = [...frame.activeIds, ...frame.doneIds, ...frame.mutedIds, ...Object.keys(frame.values)];
      assert.ok(actorRefs.every((id) => actorIds.has(id)), `${experience.slug} 分镜引用了不存在的对象`);
      assert.ok(frame.activeEdgeIds.every((id) => edgeIds.has(id)), `${experience.slug} 分镜引用了不存在的连线`);
    }

    const fingerprint = [
      experience.sceneKind,
      experience.actors.map((actor) => actor.label).join("|"),
      experience.frames.map((frame) => frame.label).join("|"),
      experience.actionLabel,
    ].join("::");
    assert.ok(!fingerprints.has(fingerprint), `${experience.slug} 与其他页面使用了同一套对象和分镜`);
    fingerprints.add(fingerprint);
  }
});

test("所有人工关联的词条都能打开", () => {
  const slugs = new Set(allTerms.map((term) => term.slug));
  const incoming = new Map(allTerms.map((term) => [term.slug, 0]));
  for (const term of allTerms) {
    for (const relatedSlug of term.relatedSlugs) {
      assert.notEqual(relatedSlug, term.slug, `${term.slug} 不能关联自己`);
      assert.ok(slugs.has(relatedSlug), `${term.slug} 关联了不存在的 ${relatedSlug}`);
      incoming.set(relatedSlug, incoming.get(relatedSlug) + 1);
    }
  }
  for (const [slug, count] of incoming) {
    assert.ok(count > 0, `${slug} 没有其他词条可以进入`);
  }
});

test("词条正文避开常见模板化表达", () => {
  const text = JSON.stringify(allTerms);
  for (const pattern of [
    /赋能/g,
    /一站式/g,
    /全方位/g,
    /颠覆性/g,
    /不仅仅是/g,
    /让我们(?:一起|来)/g,
    /在这个.{0,12}时代/g,
    /真正的价值/g,
    /无论你是.{0,24}还是/g,
  ]) {
    assert.equal(text.match(pattern)?.length ?? 0, 0, `发现模板化表达：${pattern}`);
  }
});
