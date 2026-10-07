export type TokenizationMode = "bpe" | "word";

export type TeachingToken = {
  text: string;
  id: number;
  kind: "word" | "space" | "symbol" | "subword";
};

type TokenSample = {
  label: string;
  bpe: TeachingToken[];
  word: TeachingToken[];
};

const samples: Record<string, TokenSample> = {
  "CSS 很好用": {
    label: "CSS 很好用",
    bpe: [
      { text: "CSS", id: 804, kind: "word" },
      { text: " ", id: 220, kind: "space" },
      { text: "很", id: 4281, kind: "subword" },
      { text: "好", id: 1773, kind: "subword" },
      { text: "用", id: 3912, kind: "subword" },
    ],
    word: [
      { text: "CSS", id: 804, kind: "word" },
      { text: " ", id: 220, kind: "space" },
      { text: "很好用", id: 19348, kind: "word" },
    ],
  },
  "CSS很好用": {
    label: "CSS很好用",
    bpe: [
      { text: "CSS", id: 804, kind: "word" },
      { text: "很", id: 4281, kind: "subword" },
      { text: "好", id: 1773, kind: "subword" },
      { text: "用", id: 3912, kind: "subword" },
    ],
    word: [
      { text: "CSS", id: 804, kind: "word" },
      { text: "很好用", id: 19348, kind: "word" },
    ],
  },
  "雨天 CSS": {
    label: "雨天 CSS",
    bpe: [
      { text: "雨", id: 17384, kind: "subword" },
      { text: "天", id: 1246, kind: "subword" },
      { text: " ", id: 220, kind: "space" },
      { text: "CSS", id: 804, kind: "word" },
    ],
    word: [
      { text: "雨天", id: 38244, kind: "word" },
      { text: " ", id: 220, kind: "space" },
      { text: "CSS", id: 804, kind: "word" },
    ],
  },
};

export function teachingSample(text: string, mode: TokenizationMode): TeachingToken[] {
  const sample = samples[text] ?? samples["CSS 很好用"];
  return sample[mode].map((token) => ({ ...token }));
}

export function teachingSampleLabel(text: string): string {
  return samples[text]?.label ?? samples["CSS 很好用"].label;
}

export function teachingTokenCount(text: string, mode: TokenizationMode): number {
  return teachingSample(text, mode).length;
}

export const teachingTexts = Object.keys(samples);
