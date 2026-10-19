window.motion = (ctx) => {
  const { stage, canvas, card, reader, bar, title, body, ghost, ghostTitle, rect, duration, animate } = ctx;
  const sourceTitle = card.querySelector('[data-card-title]');
  const cardStyle = getComputedStyle(card);
  const fromStyle = getComputedStyle(sourceTitle);
  const toStyle = getComputedStyle(title);
  const stageStyle = getComputedStyle(stage);
  const curve = 'cubic-bezier(.22,1,.36,1)';
  const timing = { duration, easing: 'linear' };
  const scaleX = rect.card.width / rect.width;
  const scaleY = rect.card.height / rect.height;
  const radius = parseFloat(cardStyle.borderTopLeftRadius) || 0;
  const fontScale = parseFloat(fromStyle.fontSize) / parseFloat(toStyle.fontSize);
  // The line boxes differ slightly; align the glyphs before moving the title.
  const startY = rect.fromTitle.y + (parseFloat(fromStyle.lineHeight) - parseFloat(toStyle.lineHeight) * fontScale) / 2;
  const fromTransform = `translate(${rect.fromTitle.x}px, ${startY}px) scale(${fontScale})`;
  const toTransform = `translate(${rect.toTitle.x}px, ${rect.toTitle.y}px) scale(1)`;

  Object.assign(ghost.style, {
    left: '0', top: '0', width: `${rect.width}px`, height: `${rect.height}px`,
    transformOrigin: '0 0', pointerEvents: 'none', zIndex: '2'
  });
  Object.assign(ghostTitle.style, {
    left: '0', top: '0', width: `${rect.toTitle.width}px`, margin: '0',
    fontFamily: toStyle.fontFamily, fontSize: toStyle.fontSize,
    fontWeight: toStyle.fontWeight, fontStyle: toStyle.fontStyle,
    lineHeight: toStyle.lineHeight, letterSpacing: toStyle.letterSpacing,
    textAlign: toStyle.textAlign, whiteSpace: toStyle.whiteSpace,
    transformOrigin: '0 0', pointerEvents: 'none', zIndex: '5'
  });
  ghostTitle.textContent = title.textContent;
  reader.style.opacity = '1';
  reader.style.backgroundColor = 'transparent';

  animate(ghost, [
    {
      transform: `translate(${rect.card.x}px, ${rect.card.y}px) scale(${scaleX}, ${scaleY})`,
      borderRadius: `${radius / scaleX}px / ${radius / scaleY}px`,
      backgroundColor: cardStyle.backgroundColor,
      boxShadow: cardStyle.boxShadow
    },
    {
      transform: 'translate(0, 0) scale(1, 1)', borderRadius: '0px',
      backgroundColor: stageStyle.getPropertyValue('--bg').trim() || '#EEF0EE',
      boxShadow: '0 0 0 0 rgba(23, 26, 21, 0)'
    }
  ], { duration, easing: curve });
  animate(ghost, [
    { opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1 }
  ], timing);
  animate(canvas, [
    { opacity: 1 }, { opacity: 0, offset: 0.72 }, { opacity: 0 }
  ], timing);
  animate(sourceTitle, [{ opacity: 0 }, { opacity: 0 }], timing);
  animate(ghostTitle, [
    { transform: fromTransform, fontWeight: fromStyle.fontWeight, color: fromStyle.color, easing: curve },
    { transform: toTransform, fontWeight: toStyle.fontWeight, color: toStyle.color, offset: 0.78 },
    { transform: toTransform, fontWeight: toStyle.fontWeight, color: toStyle.color }
  ], timing);
  animate(ghostTitle, [
    { opacity: 1 }, { opacity: 1, offset: 0.78 },
    { opacity: 0, offset: 0.92 }, { opacity: 0 }
  ], timing);
  animate(title, [
    { opacity: 0 }, { opacity: 0, offset: 0.78 },
    { opacity: 1, offset: 0.92 }, { opacity: 1 }
  ], timing);
  animate(body, [
    { opacity: 0, transform: 'translateY(10px)' },
    { opacity: 0, transform: 'translateY(10px)', offset: 0.5, easing: curve },
    { opacity: 1, transform: 'translateY(0)' }
  ], timing);
  animate(bar, [
    { opacity: 0, transform: 'translateY(4px)' },
    { opacity: 0, transform: 'translateY(4px)', offset: 0.55, easing: curve },
    { opacity: 1, transform: 'translateY(0)' }
  ], timing);
};
