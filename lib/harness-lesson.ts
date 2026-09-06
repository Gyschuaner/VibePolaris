export const lessonTask = "读一下 todo.txt，告诉我还有哪两件事没做。";
export const todoItems = [
  { text: "买咖啡", done: true },
  { text: "寄快递", done: false },
  { text: "给绿植浇水", done: false },
] as const;

export const lessonSteps = [
  { title: "模型知道文件里有什么吗？", beats: [0], note: "现在还不知道", fileNote: "知道文件名\n≠ 读过内容" },
  { title: "先把任务和工具说明交给模型", beats: [500, 450, 0], note: "这就是本次输入", fileNote: "文件内容\n还没送来" },
  { title: "模型提出一个读取请求", beats: [520, 400, 0], note: "请求 ≠ 已执行", fileNote: "还没打开" },
  { title: "工具真正打开文件", beats: [500, 650, 500, 0], note: "结果先回到 Harness", fileNote: "工具在这里读文件" },
  { title: "把读取结果交回模型", beats: [450, 600, 0], note: "这次多了文件内容！", fileNote: "" },
  { title: "现在可以根据文件回答了", beats: [550, 450, 0], note: "答案来自刚读到的内容", fileNote: "" },
] as const;

export type LessonState = { step: number; beat: number; revision: number };
export type LessonAction =
  | { type: "next"; reduced: boolean }
  | { type: "previous" | "replay" | "settle" }
  | { type: "tick"; revision: number };
export const initialLesson: LessonState = { step: 0, beat: 0, revision: 0 };
export function isSettled(state: LessonState) {
  return state.beat === lessonSteps[state.step].beats.length - 1;
}
export function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  if (action.type === "replay") return { ...initialLesson, revision: state.revision + 1 };
  if (action.type === "previous") {
    if (state.step === 0) return state;
    const step = state.step - 1;
    return { step, beat: lessonSteps[step].beats.length - 1, revision: state.revision + 1 };
  }
  if (action.type === "settle") return { ...state, beat: lessonSteps[state.step].beats.length - 1 };
  if (action.type === "tick") {
    if (action.revision !== state.revision || isSettled(state)) return state;
    return { ...state, beat: state.beat + 1 };
  }
  if (action.type !== "next" || !isSettled(state) || state.step === lessonSteps.length - 1) return state;
  const step = state.step + 1;
  return { step, beat: action.reduced ? lessonSteps[step].beats.length - 1 : 0, revision: state.revision + 1 };
}
export function lessonView(state: LessonState) {
  return {
    fileRead: state.step > 3 || (state.step === 3 && state.beat >= 1),
    toolReturned: state.step > 3 || (state.step === 3 && state.beat >= 2),
    modelHasFile: state.step > 4 || (state.step === 4 && state.beat >= 1),
    answered: state.step === 5 && state.beat >= 1,
    notes: isSettled(state),
  };
}
