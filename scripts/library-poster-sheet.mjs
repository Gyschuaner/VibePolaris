// Render the real effects at a paused, visible frame for browser screenshot capture.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const items = JSON.parse(readFileSync("content/library/animations.json", "utf8"));
const port = Number(process.argv[2] || 3123);
createServer((request, response) => {
  const batch = Number(new URL(request.url, `http://127.0.0.1:${port}`).searchParams.get("batch") || 0);
  if (!Number.isInteger(batch) || batch < 0 || batch >= Math.ceil(items.length / 16)) { response.writeHead(404).end(); return; }
  const page = items.slice(batch * 16, (batch + 1) * 16);
  const css = page.map(item => readFileSync(`public/library/animations/${item.slug}.css`, "utf8")).join("\n");
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Animation poster sheet ${batch + 1}</title>
  <style>
  *{box-sizing:border-box}body{margin:0;background:#FCFAF3;font:600 17px/1.4 system-ui,sans-serif;color:#171A15}
  main{display:grid;grid-template-columns:repeat(4,280px)}
  .poster{width:280px;height:180px;display:grid;place-items:center;overflow:hidden;isolation:isolate;background:#FCFAF3}
  .element{display:grid;place-items:center;width:112px;height:84px;border-radius:16px;background:#9A6248;color:#FCFAF3}
  ${css}
  </style><main>${page.map(item => `<div class="poster" data-slug="${item.slug}" data-group="${item.group}" data-file="${item.slug}-${item.previewVersion}.jpg"><div data-motion-opt-in="true" class="vp-motion-${item.slug}${item.kind === "element" ? " element" : ""}" style="--color-1:${item.group === "骨架屏" ? "#FCFAF3" : "#171A15"};--color-2:#9A6248">${item.label}</div></div>`).join("")}</main>
  <script>
  for (const frame of document.querySelectorAll('.poster')) {
    const object = frame.firstElementChild;
    const animations = object.getAnimations({subtree:true});
    const preferred = ({'loaders-rect10':.75,'loaders-rect14':.18,'loaders-text09':.27})[frame.dataset.slug] ?? (frame.dataset.group === '入场' ? .82 : frame.dataset.group === '退场' ? .18 : .38);
    const box = frame.getBoundingClientRect();
    for (const phase of [preferred, .5, .65, .35, .85, .15, .95, .05, .01, .99]) {
      for (const animation of animations) {
        animation.pause();
        const timing = animation.effect.getTiming();
        animation.currentTime = timing.delay + Number(timing.duration) * phase;
      }
      const rect = object.getBoundingClientRect();
      const width = Math.min(rect.right, box.right) - Math.max(rect.left, box.left);
      const height = Math.min(rect.bottom, box.bottom) - Math.max(rect.top, box.top);
      if (!object.classList.contains('element') || (width >= rect.width * .95 && height >= rect.height * .95 && Number(getComputedStyle(object).opacity) >= .35)) {
        frame.dataset.phase = phase;
        break;
      }
    }
  }
  document.body.dataset.ready = 'true';
  </script></html>`);
}).listen(port, "127.0.0.1", () => console.log(`Poster sheet: http://127.0.0.1:${port}/?batch=0 (16 frames per batch)`));
