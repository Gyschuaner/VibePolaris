"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, SpeakerHigh } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import type { Term } from "@/lib/content";
import { TermIcon } from "./TermIcon";
import type { TermExperience } from "@/lib/term-experiences";

type TermExperiencePageProps = {
  term: Term;
  experience: TermExperience;
  previous: Term;
  next: Term;
  related: Term[];
  hero: ReactNode;
};

function CopyAction({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return <button className="term-experience-copy" type="button" onClick={copy}>{copied ? "已复制" : label}</button>;
}

function TeachingCitation({ term, experience, indices }: { term: Term; experience: TermExperience; indices: number[] }) {
  const uniqueIndices = [...new Set(indices)];
  if (!uniqueIndices.length) return null;
  return <sup className="vp-citation term-experience-citation">{uniqueIndices.map((index) => {
    const source = experience.sources[index - 1];
    return source ? <a href={`#term-source-${term.slug}-${index}`} key={index} aria-label={`参考来源 ${index}：${source.label}`}>[{index}]</a> : null;
  })}</sup>;
}

export function TermExperiencePage({ term, experience, previous, next, related, hero }: TermExperiencePageProps) {
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const selectedOption = quizAnswer === null ? null : experience.quiz.options[quizAnswer];
  const markdown = useMemo(() => [
    `# ${term.zh}${term.en ? ` — ${term.en}` : ""}`,
    "",
    experience.definition,
    "",
    experience.boundary,
    "",
    `关键结论：${experience.insight}`,
  ].join("\n"), [experience, term.en, term.zh]);

  function pronounce() {
    if (!term.en || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.en);
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="term-story-page term-experience-page">
      <Link className="term-page-step term-page-step-prev" href={`/terms/${previous.slug}`} aria-label={`上一个术语：${previous.zh}`} title={`上一个：${previous.zh}`}><ArrowLeft size={24} /></Link>
      <Link className="term-page-step term-page-step-next" href={`/terms/${next.slug}`} aria-label={`下一个术语：${next.zh}`} title={`下一个：${next.zh}`}><ArrowRight size={24} /></Link>

      <div className="term-story-shell">
        <div className="term-story-tools">
          <Link href="/">星图</Link><span aria-hidden="true">/</span><Link href={`/?cat=${encodeURIComponent(term.cat)}`}>{term.cat}</Link><span aria-hidden="true">/</span><span>{term.zh}</span>
          <CopyAction text={markdown} label="复制为 Markdown" />
        </div>

        <div className="term-motion-header"><header className="term-story-header">
          <span className="brand-star-only term-route-star term-story-star" data-route-star-target aria-hidden="true" />
          <h1>{term.zh}<TermIcon slug={term.slug} size={44} /></h1>
          {term.en ? <span className="term-story-en">{term.en}</span> : null}
          {term.en ? <button className="term-speak" type="button" onClick={pronounce} aria-label={`朗读 ${term.en}`} title="朗读术语"><SpeakerHigh size={22} /></button> : null}
        </header>{hero}</div>

        <section className="term-question" aria-labelledby={`${term.slug}-question`}><span>常见问题</span><p id={`${term.slug}-question`}>{experience.lead}</p></section>

        <section className="term-story-intro" aria-labelledby={`${term.slug}-definition`}>
          <h2 id={`${term.slug}-definition`}>{experience.definition}</h2>
          <p>{experience.boundary}</p>
        </section>

        {experience.teaching.length ? (
          <section className="term-teaching" aria-labelledby={`${term.slug}-teaching-heading`}>
            <div className="term-section-heading"><span>拆开看</span><h2 id={`${term.slug}-teaching-heading`}>先把关键关系讲清楚</h2></div>
            <div className="term-teaching-grid">
              {experience.teaching.map((lesson) => (
                <article key={lesson.id}>
                  <h3>{lesson.title}</h3>
                  <p id={`${term.slug}-${lesson.id}`} className="vp-citation-target">{lesson.body}<TeachingCitation term={term} experience={experience} indices={lesson.sourceIndices} /></p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <p className="term-motion-insight">{experience.insight}</p>

        <section className="term-quiz term-experience-quiz" aria-labelledby={`${term.slug}-quiz-heading`}>
          <div className="term-section-heading"><span>02</span><h2 id={`${term.slug}-quiz-heading`}>判断边界</h2></div>
          <fieldset>
            <legend>{experience.quiz.question}</legend>
            {experience.quiz.options.map((option, index) => (
              <label className={quizAnswer === index ? "is-selected" : ""} key={option.label}>
                <input type="radio" name={`${term.slug}-quiz`} checked={quizAnswer === index} onChange={() => setQuizAnswer(index)} />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {selectedOption ? <p className={`term-quiz-result${selectedOption.correct ? " is-correct" : ""}`} aria-live="polite">{selectedOption.correct ? experience.quiz.success : experience.quiz.retry}</p> : null}
        </section>

        <section className="term-prompt-card" aria-labelledby={`${term.slug}-prompt-heading`}>
          <div><span>可直接复制</span><h2 id={`${term.slug}-prompt-heading`}>{experience.prompt.title}</h2></div>
          <p>{experience.prompt.text}</p>
          <CopyAction text={experience.prompt.text} label="复制提示词" />
        </section>

        <section className="term-learning-path term-experience-learning" aria-labelledby={`${term.slug}-learning-heading`}>
          <div className="term-section-heading"><span>03</span><h2 id={`${term.slug}-learning-heading`}>继续理解</h2></div>
          <div className="term-related-orbit term-related-orbit-wide"><span>相关概念</span><div>{related.slice(0, 4).map((item) => <Link key={item.slug} href={`/terms/${item.slug}`}><span className="brand-star-only term-related-star" aria-hidden="true" />{item.zh}{item.en ? <small>{item.en}</small> : null}</Link>)}</div></div>
          <div className="term-external-learning"><span>核对来源</span><div>{experience.sources.map((source, index) => <a id={`term-source-${term.slug}-${index + 1}`} href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><strong>{source.label}</strong><small>{source.note}</small></span><ArrowUpRight size={16} /></a>)}</div></div>
        </section>
      </div>
    </main>
  );
}
