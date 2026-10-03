export type GitSource = { publisher: string; title: string; date: string; url: string; citations: string[] };

export const source = (publisher: string, title: string, url: string, citations: string[], date = ""): GitSource => ({ publisher, title, date, url, citations });
