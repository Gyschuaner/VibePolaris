export type AiStackSource = { publisher: string; title: string; date: string; url: string; citations: string[] };
export const source = (publisher: string, title: string, url: string, citations: string[], date = ""): AiStackSource => ({ publisher, title, date, url, citations });
