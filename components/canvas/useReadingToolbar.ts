import { useRef, useState } from "react";

export function useReadingToolbar(key: string, enabled: boolean, locked: boolean) {
  const bar = useRef<HTMLElement>(null);
  const position = useRef({ key: "", top: 0 });
  const [state, setState] = useState({ key, hidden: false });
  if (state.key !== key) setState({ key, hidden: false });
  const hidden = enabled && !locked && state.key === key && state.hidden;
  function show() { setState(previous => previous.hidden ? { key, hidden: false } : previous); }
  function onScroll(top: number) {
    top = Math.max(0, top);
    if (position.current.key !== key) position.current = { key, top: 0 };
    const focused = document.activeElement;
    const interacting = bar.current?.querySelector(":popover-open") || (focused && bar.current?.contains(focused) && focused.matches(":focus-visible"));
    if (!enabled || locked || interacting) {
      position.current.top = top;
      show();
      return;
    }
    // Scrolling only hides the toolbar; revealing it is an explicit action.
    const delta = top - position.current.top;
    if (Math.abs(delta) < 16) return;
    if (delta > 0 && top >= 56) setState(previous => previous.hidden ? previous : { key, hidden: true });
    position.current.top = top;
  }
  return { bar, hidden, show, onScroll };
}
