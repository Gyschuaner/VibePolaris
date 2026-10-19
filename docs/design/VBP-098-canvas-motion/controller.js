"use strict";
const stage = document.getElementById("stage");
const canvas = document.getElementById("canvas"), card = document.getElementById("card");
const reader = document.getElementById("reader"), bar = document.getElementById("bar");
const title = document.getElementById("title"), body = document.getElementById("body");
const ghost = document.getElementById("ghost"), ghostTitle = document.getElementById("ghost-title");
const openButton = document.getElementById("open"), backButton = document.getElementById("back");
const resetButton = document.getElementById("reset"), slow = document.getElementById("slow");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const duration = Number(document.body.dataset.duration);
const elements = [canvas, card, reader, bar, title, body, ghost, ghostTitle];
let running = null;

slow.checked = new URL(location.href).searchParams.get("slow") === "1";
function updateLinks() {
  document.querySelectorAll(".variants a").forEach(link => {
    const url = new URL(link.getAttribute("href"), location.href);
    if (slow.checked) url.searchParams.set("slow", "1"); else url.searchParams.delete("slow");
    link.href = url.href;
    if (link.dataset.key === document.body.dataset.variant) link.setAttribute("aria-current", "page");
  });
}
updateLinks();
slow.addEventListener("change", updateLinks);

function settle(reading, focus = true) {
  const animations = running?.animations ?? [];
  running = null;
  stage.dataset.mode = reading ? "reading" : "canvas";
  canvas.hidden = reading; canvas.inert = reading;
  reader.hidden = !reading; reader.inert = !reading;
  ghost.hidden = true; ghostTitle.hidden = true;
  animations.forEach(animation => animation.cancel());
  elements.forEach(element => element.removeAttribute("style"));
  openButton.disabled = false; backButton.disabled = false;
  resetButton.disabled = false; slow.disabled = false;
  stage.removeAttribute("aria-busy");
  document.getElementById("status").textContent = reading ? "已打开全文。可返回画布。" : "已回到画布。点击打开全文体验动效。";
  if (focus) (reading ? backButton : openButton).focus({ preventScroll:true });
}

async function transition(opening) {
  if (running || (stage.dataset.mode === "reading") === opening) return;
  if (reduceMotion.matches) { settle(opening); return; }
  await document.fonts.ready;
  if (running) return;
  canvas.hidden = false; canvas.inert = true;
  reader.hidden = false; reader.inert = true;
  ghost.hidden = false; ghostTitle.hidden = false;
  openButton.disabled = true; backButton.disabled = true;
  resetButton.disabled = true; slow.disabled = true;
  stage.setAttribute("aria-busy", "true");
  const bounds = stage.getBoundingClientRect();
  const relative = element => {
    const r = element.getBoundingClientRect();
    return { x:r.x-bounds.x, y:r.y-bounds.y, width:r.width, height:r.height };
  };
  const animations = [];
  const operation = { opening, animations };
  running = operation;
  const rect = { card:relative(card), fromTitle:relative(card.querySelector("[data-card-title]")), toTitle:relative(title), width:bounds.width, height:bounds.height };
  try {
    window.motion({ stage, canvas, card, reader, bar, title, body, ghost, ghostTitle, duration, rect,
      animate(element, keyframes, options = {}) {
        const animation = element.animate(keyframes, { duration, fill:"both", easing:"cubic-bezier(.22,.75,.2,1)", ...options });
        animation.pause(); animation.currentTime = opening ? 0 : duration;
        animations.push(animation);
        return animation;
      }
    });
    animations.forEach(animation => {
      animation.playbackRate = (opening ? 1 : -1) / (slow.checked ? 4 : 1);
      animation.play();
    });
    await Promise.allSettled(animations.map(animation => animation.finished));
  } catch (error) {
    console.error("动效预览失败", error);
  } finally {
    if (running === operation) settle(opening);
  }
}

openButton.addEventListener("click", () => { document.getElementById("reader-scroll").scrollTop = 0; void transition(true); });
backButton.addEventListener("click", () => void transition(false));
resetButton.addEventListener("click", () => stage.dataset.mode === "reading" ? void transition(false) : openButton.focus({ preventScroll:true }));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && stage.dataset.mode === "reading") { event.preventDefault(); void transition(false); }
});
window.addEventListener("resize", () => { if (running) settle(running.opening, false); });
reduceMotion.addEventListener("change", () => { if (running) settle(running.opening); });
