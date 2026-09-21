# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed prototype scope (2026-09-21)
- User selected the first displayed image: margin annotations, reference/selected-margin-notes.png.
- Notes stay in the current browser; no server storage, account, telemetry containing notes, or automatic sync.
- This folder is an isolated interactive preview, not the production website. Use actual IndexedDB persistence here, with clearly labelled example notes and local JSON backup.
- Preserve the mist/clay theme and existing brand assets. The reader remains the primary surface; the right rail switches between contents and annotations.
- Latest user feedback: desktop annotations belong alongside the exact source line, not in a stacked sidebar list. Derive positions from text ranges after layout; scroll with the document. Preserve source order, displace only colliding cards, and connect displaced cards to their source. Unanchored quick notes belong in My Notes. This decision overrides the original image's stacked second card.
