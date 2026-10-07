import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const baseTerms = readJson("content/zh/terms.json");
const batchFiles = readdirSync(new URL("../content/zh/term-batches/", import.meta.url))
  .filter((name) => name.endsWith(".json"));
const batches = batchFiles.flatMap((name) => readJson(`content/zh/term-batches/${name}`));
const allTerms = [...baseTerms, ...batches];
const publishedSlugs = readJson("content/zh/published-terms.json");
const researchFiles = readdirSync(new URL("../content/zh/term-research/", import.meta.url))
  .filter((name) => name.endsWith(".json"));
const researchCards = researchFiles.flatMap((name) => readJson(`content/zh/term-research/${name}`));
const experienceFiles = readdirSync(new URL("../content/zh/term-experiences/", import.meta.url))
  .filter((name) => name.endsWith(".json"));
const experiences = experienceFiles.flatMap((name) => readJson(`content/zh/term-experiences/${name}`));
const demoTypes = new Set(["flow", "state", "comparison", "hierarchy", "lifecycle", "queue", "branch", "request"]);
const categories = new Set(["前端", "后端", "AI·Agent", "技术栈", "Git", "产品与设计"]);
const sceneKinds = new Set(["route", "pipeline", "transform", "compare", "layers", "tree", "network", "timeline", "queue", "state-machine", "memory", "contract", "branch", "loop", "matrix", "spectrum", "assembly", "terminal", "magnet-drawer", "overlay-film", "triage-dial", "relay-band", "memory-drawer"]);
const actorIcons = new Set(["browser", "server", "database", "file", "code", "user", "robot", "brain", "gear", "package", "git", "shield", "key", "cloud", "clock", "queue", "search", "chart", "layout", "component", "message", "network", "memory", "spark"]);

test("公开词条与已完成升级清单一致", () => {
  const rollout = readFileSync(new URL("../docs/design/concept-rollout.md", import.meta.url), "utf8").split("## 既有词条逐项覆盖")[1];
  const coveredSlugs = [...rollout.matchAll(/^\| ([a-z0-9][a-z0-9-]*) \| [^|]+ \| [^|]+ \| ([^|]+) \|$/gm)]
    .filter(([, slug, status]) => slug !== "slug" && status.trim() !== "待处理")
    .map(([, slug]) => slug);
  const termPage = readFileSync(new URL("../app/terms/[slug]/page.tsx", import.meta.url), "utf8");
  const articlePages = termPage.match(/const articleTermPages = \{([\s\S]*?)\n\} satisfies/)?.[1] ?? "";

  const knownSlugs = new Set(allTerms.map((term) => term.slug));
  assert.ok(publishedSlugs.every((slug) => knownSlugs.has(slug)), "公开清单只能包含词库中的 slug");
  assert.ok(coveredSlugs.every((slug) => publishedSlugs.includes(slug)), "覆盖索引不能公开不存在的词条");
  assert.ok(articlePages.includes("quantization: QuantizationTermPage") && articlePages.includes("'model-card': ModelCardTermPage"), "本批十条必须接入专属详情路由");
  assert.equal(new Set(publishedSlugs).size, publishedSlugs.length, "公开词条不能重复");
});

test("核心词库保持在扩展目标范围内且标识唯一", () => {
  assert.ok(allTerms.length >= 290, `当前共有 ${allTerms.length} 条`);
  assert.equal(new Set(allTerms.map((term) => term.slug)).size, allTerms.length, "slug 不能重复");
  assert.equal(new Set(allTerms.map((term) => term.zh)).size, allTerms.length, "中文名不能重复");
  for (const term of allTerms) {
    assert.match(term.slug, /^[a-z0-9-]+$/);
    assert.ok(categories.has(term.cat), `${term.slug} 分类无效`);
  }
});

test("迁移底稿保留完整字段、可变长度演示和项目检查", () => {
  for (const term of allTerms) {
    for (const key of ["question", "definition", "boundary", "demoTitle", "quizQuestion", "correctText", "wrongText", "promptTitle", "prompt"]) {
      assert.ok(typeof term[key] === "string" && term[key].trim(), `${term.slug} 缺少 ${key}`);
    }
    assert.ok(demoTypes.has(term.demoType), `${term.slug} 动画类型无效`);
    assert.ok(Array.isArray(term.demoSteps) && term.demoSteps.length >= 1, `${term.slug} 至少需要一个演示状态`);
    assert.equal(term.quizOptions?.length, 3, `${term.slug} 必须有三个检查选项`);
    assert.ok(term.relatedSlugs?.length >= 2 && term.relatedSlugs.length <= 8, `${term.slug} 相关词数量无效`);
    for (const step of term.demoSteps) {
      assert.ok(step.label && step.value && step.note, `${term.slug} 动画步骤不完整`);
      assert.notEqual(step.note, term.definition, `${term.slug} 动画不能直接重复定义`);
    }
  }
});

test("全部正式词条均有独立研究卡、权威来源与唯一分镜", () => {
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
    assert.ok(Array.isArray(card.sourceUrls) && card.sourceUrls.length >= 1, `${card.slug} 来源数量无效`);
    assert.ok(card.sourceUrls.every((url) => /^https:\/\//.test(url)), `${card.slug} 来源必须使用 HTTPS`);
    assert.ok(card.demoSignature.trim(), `${card.slug} 分镜签名不能为空`);
    assert.ok(!signatures.has(card.demoSignature), `${card.slug} 与其他词条使用了相同分镜`);
    signatures.add(card.demoSignature);
  }
});

test("本批十条专属页逐条对齐研究、体验与非流程视觉约束", () => {
  const slugs = ["quantization", "knowledge-distillation", "mixture-of-experts", "speculative-decoding", "beam-search", "confidence-calibration", "data-contamination", "out-of-distribution", "parameter-efficient-fine-tuning", "model-card"];
  const flowKinds = new Set(["pipeline", "route", "loop"]);
  const flowCount = experiences.filter((experience) => flowKinds.has(experience.sceneKind)).length;

  assert.ok(flowCount / experiences.length <= 0.2, "流程箭头只能占少数体验");
  assert.deepEqual(experiences.filter((experience) => slugs.includes(experience.slug) && experience.edges.length > 0).map((experience) => experience.slug), ["speculative-decoding"], "本批只有需要有序验收的概念保留关系线");
  for (const slug of slugs) {
    const card = researchCards.find((item) => item.slug === slug);
    const experience = experiences.find((item) => item.slug === slug);
    assert.ok(card && card.sourceUrls.length >= 4 && new Set(card.sourceUrls).size === card.sourceUrls.length, `${slug} 研究卡应保留四条以上不同来源`);
    assert.ok(experience && experience.sources.length >= 4 && new Set(experience.sources.map((source) => source.url)).size === experience.sources.length, `${slug} 体验台账应保留四条以上不同来源`);
    assert.ok(experience.frames.length >= 4, `${slug} 专属体验应有足够的观察阶段`);
    assert.ok(!/本页的独立演示把概念的对象、条件和结果分开/.test(experience.definition), `${slug} 不能使用通用占位定义`);
  }
});

test("除专属页面外，每个词条都有可验证的独立互动体验", () => {
  const specialSlugs = new Set(["component", "css", "html", "javascript", "grounding", "citation", "structured-output", "eval", "benchmark", "grader", "reranking", "model-routing", "quantization", "knowledge-distillation", "mixture-of-experts", "speculative-decoding", "beam-search", "confidence-calibration", "data-contamination", "out-of-distribution", "parameter-efficient-fine-tuning", "model-card"]);
  const expectedSlugs = new Set(allTerms.filter((term) => !specialSlugs.has(term.slug)).map((term) => term.slug));
  const genericExperiences = experiences.filter((experience) => !specialSlugs.has(experience.slug));
  const experienceSlugs = new Set(genericExperiences.map((experience) => experience.slug));
  const fingerprints = new Set();

  assert.equal(genericExperiences.length, expectedSlugs.size, "互动体验应覆盖全部非专属词条");
  assert.equal(experienceSlugs.size, genericExperiences.length, "互动体验 slug 不能重复");

  for (const slug of expectedSlugs) assert.ok(experienceSlugs.has(slug), `${slug} 缺少独立互动体验`);
  for (const experience of genericExperiences) {
    assert.ok(expectedSlugs.has(experience.slug), `${experience.slug} 不应落入通用互动体验`);
    assert.ok(sceneKinds.has(experience.sceneKind), `${experience.slug} 动画结构无效`);
    assert.ok(experience.actors.length >= 2 && experience.actors.length <= 8, `${experience.slug} 演示对象数量无效`);
    assert.ok(experience.frames.length >= 2 && experience.frames.length <= 7, `${experience.slug} 动画帧数无效`);
    assert.ok(experience.sources.length >= 1, `${experience.slug} 来源数量无效`);
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
      const actorRefs = [...frame.activeIds, ...frame.doneIds, ...frame.mutedIds, ...Object.keys(frame.values ?? {})];
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
  assert.ok([...incoming].some(([, count]) => count === 0), "保留没有入边的根词条，避免把关联图强行做成闭环");
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
