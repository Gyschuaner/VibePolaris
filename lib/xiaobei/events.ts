export const CONTEXT_WINDOW = 256_000;
export const CONTEXT_WARNING = 175_000;
export type ActivityState = "running" | "complete" | "error" | "stopped";
export type TextBlock = { kind: "text"; id: string; text: string; phase?: "commentary" | "answer" };
export type ActivityBlock = { kind: "think" | "tool"; id: string; text: string; state: ActivityState; startedAt: number; finishedAt?: number; name?: string; summary?: string; input?: string; output?: string };
export type ChatBlock = TextBlock | ActivityBlock;
export type AgentEvent =
  | { type: "status"; text: string }
  | { type: "delta"; id: string; text: string }
  | { type: "text_end"; id: string; phase: "commentary" | "answer" }
  | { type: "think"; id: string; text?: string; state: ActivityState; timestamp: number }
  | { type: "tool"; id: string; name: string; summary: string; input: string; output?: string; state: ActivityState; timestamp: number }
  | { type: "context"; tokens: number; estimated: boolean; inputTokens?: number }
  | { type: "balance"; credits: number }
  | { type: "error"; text: string; status?: number }
  | { type: "done" };

// IDs identify streaming fragments; insertion order preserves text between tool rounds.
export function applyEvent(blocks: ChatBlock[], event: AgentEvent): ChatBlock[] {
  if (!["delta", "text_end", "think", "tool"].includes(event.type) || !("id" in event)) return blocks;
  const previous = blocks.find(block => block.id === event.id);
  let next: ChatBlock;
  if (event.type === "delta") next = { kind: "text", id: event.id, text: (previous?.text || "") + event.text };
  else if (event.type === "text_end") {
    if (!previous || previous.kind !== "text") return blocks;
    next = { ...previous, phase: event.phase };
  } else if (event.type === "think" || event.type === "tool") {
    const activity = previous?.kind !== "text" ? previous : undefined;
    next = { ...activity, kind: event.type, id: event.id, text: (activity?.text || "") + (event.type === "think" ? event.text || "" : ""), state: event.state,
      startedAt: activity?.startedAt ?? event.timestamp, finishedAt: event.state === "running" ? undefined : event.timestamp,
      ...(event.type === "tool" ? { name: event.name, summary: event.summary, input: event.input, output: event.output } : {}),
    };
  } else return blocks;
  return previous ? blocks.map(block => block.id === event.id ? next : block) : [...blocks, next];
}

export function finishActivities(blocks: ChatBlock[], state: "error" | "stopped", timestamp = Date.now()): ChatBlock[] {
  return blocks.map(block => block.kind !== "text" && block.state === "running" ? { ...block, state, finishedAt: timestamp } : block);
}
