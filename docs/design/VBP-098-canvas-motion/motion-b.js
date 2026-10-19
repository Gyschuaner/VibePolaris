window.motion = ({ canvas, card, reader, bar, body, duration, rect, animate }) => {
  const focus = rect.fromTitle;
  const origin = `${focus.x + focus.width / 2}px ${focus.y + focus.height / 2}px`;
  const ease = "cubic-bezier(.18,.68,.24,1)";
  const timing = { duration, easing: "linear" };

  canvas.style.transformOrigin = origin;
  reader.style.transformOrigin = origin;

  animate(canvas, [
    { offset: 0, transform: "scale(1)", opacity: 1, easing: ease },
    { offset: 0.42, transform: "scale(1.22)", opacity: 0.62, easing: ease },
    { offset: 0.78, transform: "scale(1.30)", opacity: 0, easing: ease },
    { offset: 1, transform: "scale(1.32)", opacity: 0 },
  ], timing);

  animate(card, [
    { offset: 0, opacity: 1 },
    { offset: 0.16, opacity: 1, easing: ease },
    { offset: 0.52, opacity: 0 },
    { offset: 1, opacity: 0 },
  ], timing);

  animate(reader, [
    { offset: 0, transform: "scale(.966)", opacity: 0, easing: ease },
    { offset: 0.20, transform: "scale(.978)", opacity: 0, easing: ease },
    { offset: 0.72, transform: "scale(.999)", opacity: 1, easing: ease },
    { offset: 1, transform: "scale(1)", opacity: 1 },
  ], timing);

  animate(body, [
    { offset: 0, transform: "translateY(6px)", opacity: 0 },
    { offset: 0.46, transform: "translateY(6px)", opacity: 0, easing: ease },
    { offset: 1, transform: "translateY(0)", opacity: 1 },
  ], timing);

  animate(bar, [
    { offset: 0, opacity: 0 },
    { offset: 0.46, opacity: 0, easing: ease },
    { offset: 1, opacity: 1 },
  ], timing);
};
