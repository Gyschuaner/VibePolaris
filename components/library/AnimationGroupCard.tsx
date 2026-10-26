"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { swapFeatured, type LibraryAnimation } from "@/lib/library-animations";
import { libraryHref, type LibraryCategory } from "@/lib/library";
import { AnimationPreview } from "./AnimationPreview";
import styles from "./Library.module.css";

export function AnimationGroupCard({ group, effects, category, query, sort, filterGroup, active, setHovered, setFocused }: { group: string; effects: LibraryAnimation[]; category: LibraryCategory; query: string; sort: string; filterGroup: string; active: string; setHovered: (slug: string) => void; setFocused: (slug: string) => void }) {
  const [slots, setSlots] = useState<readonly LibraryAnimation[]>(effects);
  const canvases = useRef(new Map<string, HTMLDivElement>());
  const previous = useRef(new Map<string, DOMRect>());
  const transitions = useRef<Animation[]>([]);
  const keyboardSelection = useRef(false);
  const detailLink = useRef<HTMLAnchorElement>(null);

  function select(index: number, keyboard: boolean) {
    // Keep the same preview nodes so the animation continues while its slot changes.
    previous.current = new Map([...canvases.current].map(([slug, node]) => [slug, node.getBoundingClientRect()]));
    transitions.current.forEach(animation => animation.cancel());
    keyboardSelection.current = keyboard;
    setHovered(keyboard ? "" : slots[0].slug);
    setFocused(keyboard ? slots[index].slug : "");
    setSlots(current => swapFeatured(current, index));
  }

  useLayoutEffect(() => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      transitions.current = [];
      for (const [slug, before] of previous.current) {
        const canvas = canvases.current.get(slug);
        if (!canvas) continue;
        const after = canvas.getBoundingClientRect();
        const x = before.x + before.width / 2 - after.x - after.width / 2;
        const y = before.y + before.height / 2 - after.y - after.height / 2;
        if (Math.abs(x) + Math.abs(y) + Math.abs(before.width - after.width) < .5) continue;
        transitions.current.push(canvas.animate([
          { transform: `translate(${x}px,${y}px) scale(${before.width / 280})` },
          { transform: `scale(${after.width / 280})` },
        ], { duration: 700, easing: "cubic-bezier(.22,.61,.36,1)" }));
      }
    }
    previous.current.clear();
    if (keyboardSelection.current) { detailLink.current?.focus({ preventScroll: true }); keyboardSelection.current = false; }
  }, [slots]);

  useLayoutEffect(() => () => transitions.current.forEach(animation => animation.cancel()), []);

  return <section className={styles.animationGroup} aria-label={`${group}，${effects.length} 个动画`}>
    <h2>{group}</h2>
    <div className={styles.groupStage} role="group" aria-label={`${group}动画预览`}>
      {slots.map((item, index) => <div key={item.slug} className={styles.animationSlot} data-featured={index === 0} data-slot={index} onMouseEnter={() => setHovered(item.slug)} onMouseLeave={() => setHovered("")} onFocus={event => { if (event.target.matches(":focus-visible")) setFocused(item.slug); }} onBlur={() => setFocused("")} style={{ gridRow: index === 0 ? `1 / span ${Math.max(slots.length - 1, 4)}` : index } as CSSProperties}>
        <div className={styles.swapCanvas} ref={node => { if (node) canvases.current.set(item.slug, node); else canvases.current.delete(item.slug); }}>
          <AnimationPreview item={item} decorative active={active === item.slug} speed={.6} loop />
        </div>
        {index === 0 ? <Link ref={detailLink} prefetch={false} className={styles.featuredControl} href={libraryHref(category, query, sort, item.slug, 1, filterGroup)} aria-label={`查看${item.name}详情`}><ArrowUpRight size={20} aria-hidden /></Link> : <button className={styles.miniControl} type="button" aria-label={`预览${item.name}`} title={item.name} onClick={event => select(index, event.detail === 0)} />}
      </div>)}
    </div>
    <span className={styles.srOnly} role="status">当前预览：{slots[0].name}</span>
  </section>;
}
