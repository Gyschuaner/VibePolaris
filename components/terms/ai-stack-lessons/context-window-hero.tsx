"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, ArrowRight, CalendarBlank, Check, ChatCircleText, Clock, MapPin, Suitcase, Warning } from "@phosphor-icons/react";
import styles from "../AiStackCoreConcepts.module.css";

export function ContextWindowHero() {
  const ref = useRef<HTMLElement>(null);
  const [replay, setReplay] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = false;
    const update = () => {
      element.dataset.playing = String(visible && playing && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(true);
      update();
    }, { rootMargin: "-80px 0px -40px 0px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [playing, replay]);

  return <figure ref={ref} className={styles.contextWindowHero} data-playing={playing} aria-label="一段周末出游聊天如何挤满上下文窗口，再经过整理继续请求">
    <div className={styles.contextHeroHeading}><span>周末出游计划 · 一轮请求</span><strong>可用 16k</strong></div>
    <div key={replay} className={styles.contextHeroScene}>
      <div className={styles.contextHeroPile} aria-label="聊天里逐渐累积的内容">
        <div className={styles.contextHeroCard} data-order="1"><CalendarBlank size={18} aria-hidden="true" /><span>周六出发</span></div>
        <div className={styles.contextHeroCard} data-order="2"><MapPin size={18} aria-hidden="true" /><span>海边民宿地址</span></div>
        <div className={styles.contextHeroCard} data-order="3"><ChatCircleText size={18} aria-hidden="true" /><span>旧天气闲聊 · 10k</span></div>
        <div className={styles.contextHeroCard} data-order="4"><Clock size={18} aria-hidden="true" /><span>周日 17:00 前到家</span></div>
      </div>
      <ArrowRight className={styles.contextHeroArrow} size={26} aria-hidden="true" />
      <div className={styles.contextHeroWindow}>
        <div className={styles.contextHeroWindowTitle}><Suitcase size={18} aria-hidden="true" /><span>模型这轮真正看到的内容</span></div>
        <div className={styles.contextHeroMeter} aria-label="上下文使用量从 13k 增长到 17k，再整理为 14k"><span className={styles.contextHeroMeterFill} /></div>
        <div className={styles.contextHeroWindowMeta}><span>输入 + 回答预留</span><strong>13k → 17k</strong></div>
        <div className={styles.contextHeroCut}><span>超出 1k</span><Warning size={16} aria-hidden="true" /></div>
      </div>
    </div>
    <div className={styles.contextHeroOutcomes}>
      <div className={styles.contextHeroWarning}><Warning size={18} aria-hidden="true" /><span>旧闲聊还在，但它把关键约束挤出了本轮输入。</span></div>
      <div className={styles.contextHeroSaved}><Check size={18} aria-hidden="true" /><span>整理后保留：周日 17:00 前到家 · 14k / 16k</span></div>
    </div>
    <figcaption>窗口不是抽屉：放不下时，拿掉哪一张卡，会直接改变模型能据此作答的条件。</figcaption>
    <button type="button" className={styles.contextHeroReplay} onClick={() => { setReplay(value => value + 1); setPlaying(true); }} aria-label="重播上下文窗口首图"><ArrowCounterClockwise size={16} /> 重播</button>
  </figure>;
}
