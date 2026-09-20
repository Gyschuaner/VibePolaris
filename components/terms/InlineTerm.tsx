"use client";

import Link from "next/link";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, X } from "@phosphor-icons/react";

export function InlineTerm({ title, english, description, href, children }: {
  title: string;
  english?: string;
  description: string;
  href?: string;
  children: ReactNode;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (!open || !trigger.current || !panel.current) return;
    const card = panel.current;
    const anchor = trigger.current.getBoundingClientRect();
    const { width, height } = card.getBoundingClientRect();
    const gap = 12;
    const edge = 16;
    const roomRight = anchor.right + gap + width <= window.innerWidth - edge;
    const roomLeft = anchor.left - gap - width >= edge;
    const left = roomRight ? anchor.right + gap : roomLeft ? anchor.left - gap - width : anchor.left;
    const top = roomRight || roomLeft ? anchor.top - gap
      : anchor.bottom + gap + height <= window.innerHeight - edge ? anchor.bottom + gap : anchor.top - gap - height;
    card.style.left = `${Math.max(edge, Math.min(left, window.innerWidth - width - edge))}px`;
    card.style.top = `${Math.max(edge, Math.min(top, window.innerHeight - height - edge))}px`;

    function dismiss(event: Event) {
      if (event.target === window || (event.target instanceof Node && event.target.contains(trigger.current))) card.hidePopover();
    }
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  return (
    <span className="vp-inline-term">
      <button ref={trigger} type="button" className="vp-term-trigger" popoverTarget={id} aria-haspopup="dialog" aria-expanded={open}>{children}</button>
      <span ref={panel} id={id} popover="auto" role="dialog" aria-labelledby={`${id}-title`} className="vp-term-card" onToggle={(event) => setOpen(event.newState === "open")}>
        <span className="vp-term-card-heading"><span className="brand-star-only" aria-hidden="true" /><strong id={`${id}-title`}>{title}</strong><button type="button" popoverTarget={id} popoverTargetAction="hide" aria-label={`关闭${title}解释`}><X size={16} aria-hidden="true" /></button></span>
        {english && <span className="vp-term-card-english">{english}</span>}
        <span className="vp-term-card-description">{description}</span>
        {href && <Link href={href} className="vp-term-card-link" onClick={() => panel.current?.hidePopover()}>阅读完整词条<ArrowUpRight size={15} aria-hidden="true" /></Link>}
      </span>
    </span>
  );
}
