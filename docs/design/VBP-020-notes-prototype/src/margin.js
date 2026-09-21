import { rangeForAnchor } from './anchors';

// Coordinates are recomputed from the text, never persisted as screen pixels.
export function placeMarginNotes(article, container, notes) {
  if (!article || !container) return;
  const cards = [...container.querySelectorAll('[data-note-id]')];
  if (matchMedia('(max-width: 860px)').matches) {
    container.style.minHeight = '';
    cards.forEach(card => { card.style.top = ''; });
    return;
  }
  const base = container.getBoundingClientRect().top;
  const positioned = cards.map(card => {
    const note = notes.find(item => item.id === card.dataset.noteId);
    const range = note?.anchor && rangeForAnchor(article, note.anchor);
    const target = range?.getClientRects()[0];
    if (!target) return null;
    const body = card.querySelector('.note-body');
    let inset;
    if (body.tagName === 'TEXTAREA') {
      const style = getComputedStyle(body);
      inset = body.getBoundingClientRect().top - card.getBoundingClientRect().top + Math.max(0, (parseFloat(style.lineHeight) - parseFloat(style.fontSize) * 1.2) / 2);
    } else {
      const text = document.createRange(); text.selectNodeContents(body);
      inset = text.getClientRects()[0].top - card.getBoundingClientRect().top;
    }
    return { card, desired: target.top - base - inset, textY: target.top - base };
  }).filter(Boolean).sort((a, b) => a.textY - b.textY);
  let bottom = -44;
  for (const { card, desired, textY } of positioned) {
    const top = Math.max(desired, bottom + 44, 36);
    card.style.top = `${top}px`;
    card.style.setProperty('--link-top', `${textY - top + 10}px`);
    card.style.setProperty('--link-rise', `${Math.max(0, top - desired)}px`);
    card.dataset.offset = String(Math.round(top - desired));
    bottom = top + card.offsetHeight;
  }
  container.style.minHeight = `${Math.max(article.getBoundingClientRect().bottom - base, bottom + 24, 120)}px`;
}
