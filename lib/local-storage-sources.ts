import { source } from "./ai-stack-concept-sources";

export const localStorageSources = [
  source("WHATWG", "Web Storage", "https://html.spec.whatwg.org/multipage/webstorage.html", ["storage-origin", "storage-string", "storage-event"]),
  source("MDN", "Window: localStorage property", "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage", ["storage-origin", "storage-string", "storage-sync"]),
  source("MDN", "Window: storage event", "https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event", ["storage-event"]),
];
