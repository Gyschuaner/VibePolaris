window.motion = ({ canvas, reader, bar, body, ghost, rect, duration, animate }) => {
  const start = `translateY(${rect.height * 0.28}px)`;
  const timing = { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };

  ghost.style.background = "#F7F8F6";
  ghost.style.opacity = "1";
  reader.style.background = "transparent";
  canvas.style.transformOrigin = "50% 50%";

  animate(canvas, [
    { transform: "scale(1)", opacity: 1 },
    { transform: "scale(0.97)", opacity: 0.62 },
  ], timing);

  animate(ghost, [
    {
      transform: start,
      backgroundColor: "#F7F8F6",
      opacity: 0,
      borderRadius: "18px 18px 0 0",
      boxShadow: "0 -10px 32px rgba(23, 26, 21, 0.1)",
    },
    { opacity: 1, offset: 0.16 },
    {
      transform: "translateY(0px)",
      backgroundColor: "#EEF0EE",
      opacity: 1,
      borderRadius: "0px 0px 0 0",
      boxShadow: "0 0 0 rgba(23, 26, 21, 0)",
    },
  ], timing);

  animate(reader, [
    { transform: start },
    { transform: "translateY(0px)" },
  ], timing);

  animate(reader, [
    { opacity: 0 },
    { opacity: 1, offset: 0.14 },
    { opacity: 1 },
  ], { duration, easing: "linear" });

  animate(body, [
    { opacity: 0 },
    { opacity: 0, offset: 0.24 },
    { opacity: 1, offset: 0.82 },
    { opacity: 1 },
  ], { duration, easing: "linear" });

  animate(bar, [
    { opacity: 0 },
    { opacity: 0, offset: 0.24 },
    { opacity: 1, offset: 0.82 },
    { opacity: 1 },
  ], { duration, easing: "linear" });
};
