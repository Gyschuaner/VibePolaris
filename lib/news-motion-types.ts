export const newsMotionScenes = [
  "ribbon", "press", "sieve", "stencil", "gate", "seal", "rewind", "receipt",
  "ledger", "quota", "lens", "hourglass", "balance", "lanes", "router", "loom",
  "fold", "ensemble", "patch", "footprint", "border", "docking", "camera", "robot",
  "canvas", "depth", "triage", "wave", "circuit", "bridge", "licence", "cart", "brake",
] as const;

export type NewsMotionScene = typeof newsMotionScenes[number];
export type NewsMotionMood = "paper" | "blueprint" | "pressroom" | "slate" | "studio" | "ledger";

/** Authored per article. These fields describe objects in one continuous scene, never numbered steps. */
export type NewsMotionDesign = {
  scene: NewsMotionScene;
  mood: NewsMotionMood;
  title: string;
  subject: string;
  source: string;
  target: string;
  actor: string;
  action: string;
  result: string;
  items: string[];
  boundary?: string;
  duration: number;
  preview: number;
  voiceMode?: "transcribe" | "duplex" | "synthesize" | "pipeline";
  triageMode?: "text" | "signal";
  /** Editorial rationale, kept out of the reader-facing component. */
  rationale: string;
  values?: { before: number; after: number; unit: string; label: string };
};

export type NewsMotionSceneProps = {
  design: NewsMotionDesign;
  progress: number;
  width: number;
  height: number;
  id: string;
};
