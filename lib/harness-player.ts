export type HarnessPlayer = { mode: "with" | "without"; step: number; playing: boolean };
export type HarnessAction =
  | { type: "mode"; mode: HarnessPlayer["mode"] }
  | { type: "select"; step: number }
  | { type: "reset" | "next" }
  | { type: "play" | "tick"; reduced?: boolean };

export const initialHarnessPlayer: HarnessPlayer = { mode: "with", step: 0, playing: false };
export function harnessPlayer(state: HarnessPlayer, action: HarnessAction): HarnessPlayer {
  const last = state.mode === "with" ? 4 : 1;
  switch (action.type) {
    case "mode": return { mode: action.mode, step: 0, playing: false };
    case "select": return { mode: "with", step: Math.max(1, Math.min(action.step, 4)), playing: false };
    case "reset": return { ...state, step: 0, playing: false };
    case "next": return { ...state, step: Math.min(state.step + 1, last), playing: false };
    case "play":
      if (state.playing) return { ...state, playing: false };
      if (action.reduced) return { ...state, step: last, playing: false };
      return { ...state, step: state.step === last ? 0 : state.step, playing: true };
    case "tick": {
      if (!state.playing) return state;
      const step = action.reduced ? last : Math.min(state.step + 1, last);
      return { ...state, step, playing: step < last };
    }
  }
}

export async function copyHarnessText(text: string, clipboard?: Pick<Clipboard, "writeText">): Promise<"copied" | "failed"> {
  try { if (!clipboard) return "failed"; await clipboard.writeText(text); return "copied"; }
  catch { return "failed"; }
}
