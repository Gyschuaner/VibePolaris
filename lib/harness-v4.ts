export type HarnessScenario = "success" | "retry" | "denied";
export type HarnessMode = "model" | "harness";

export type HarnessContextRow = { role: string; text: string; callId?: string };
export type HarnessTraceRow = { who: string; what: string; value: string };

export type HarnessFrame = {
  phase: string;
  title: string;
  description: string;
  insight: string;
  active: "model" | "harness" | "tool";
  edge: "hm" | "mh" | "ht" | "th" | null;
  modelCalls: number;
  toolCalls: number;
  modelText: string;
  toolText: string;
  runtimeText: string;
  context: HarnessContextRow[];
  trace: HarnessTraceRow[];
  latest: string;
  environment: string;
  fileVisible: boolean;
  fileLines: string[];
  toolExecuted: boolean;
  denied: boolean;
  missing: boolean;
  status: string;
  final: boolean;
  outcome?: string;
};

export type HarnessState = {
  scenario: HarnessScenario;
  mode: HarnessMode;
  step: number;
  playing: boolean;
  speed: 1 | 1.5 | 2;
  replyComplete: boolean;
};

type ScenarioMeta = { label: string; status: string };

export const harnessTask = "帮我修好这个服务。";
export const harnessScenarios: Record<HarnessScenario, ScenarioMeta> = {
  success: { label: "检查通过", status: "已验证完成" },
  retry: { label: "测试失败", status: "修正后通过" },
  denied: { label: "未获写入授权", status: "等待授权" },
};

const rules = "这是隔离的教学项目。允许读取日志与源码；修改需要授权；必须运行测试后才能报告修复。所有工具和返回值均为模拟。";
const tools = "read_file(path)：读文件；edit_file(path, old, new)：修改文件；run_checks()：在隔离环境启动服务并检查响应。";
const log = 'File "app.py", line 1\n  def health_check()\n                    ^\nSyntaxError: expected \':\'';

function buildFrames(variant: HarnessScenario): HarnessFrame[] {
  const denied = variant === "denied";
  const retry = variant === "retry";
  const frames: HarnessFrame[] = [];
  let modelCalls = 0;
  let toolCalls = 0;
  let currentCall = "";
  let currentRequest = "";
  let latest = "";
  let environment = "服务启动失败";
  let modelText = "等待你的任务";
  let toolText = "还没有工具运行";
  let runtimeText = "接住任务，保存状态";
  const context: HarnessContextRow[] = [{ role: "user", text: harnessTask }];
  const trace: HarnessTraceRow[] = [];

  const push = (
    phase: string,
    title: string,
    description: string,
    insight: string,
    active: HarnessFrame["active"],
    edge: HarnessFrame["edge"],
    who: string,
    what: string,
    value: string,
    extras: Partial<HarnessFrame> = {},
  ) => {
    trace.push({ who, what, value });
    frames.push({
      phase,
      title,
      description,
      insight,
      active,
      edge,
      modelCalls,
      toolCalls,
      modelText,
      toolText,
      runtimeText,
      context: context.map((item) => ({ ...item })),
      trace: trace.map((item) => ({ ...item })),
      latest,
      environment,
      fileVisible: Boolean(latest),
      fileLines: latest
        ? latest.includes("SyntaxError")
          ? ["server.log", "SyntaxError: 缺少冒号"]
          : latest.split("\n").slice(0, 3)
        : [],
      toolExecuted: toolCalls > 0,
      denied: false,
      missing: false,
      status: "教学模拟",
      final: false,
      ...extras,
    });
  };

  const ask = (phase: string, request: string, title: string, description: string, insight: string) => {
    if (!modelCalls) context.push({ role: "system", text: rules }, { role: "tools", text: tools });
    modelCalls += 1;
    currentCall = `call_${modelCalls}`;
    currentRequest = request;
    context.push({ role: "assistant", text: request, callId: currentCall });
    modelText = title;
    runtimeText = "调用模型";
    push(phase, title, description, insight, "model", "mh", "Model → Harness", "模型提出下一步", request);
  };

  const act = (phase: string, title: string, description: string, allowed = true) => {
    if (allowed) toolCalls += 1;
    toolText = allowed ? "正在执行这次请求" : "修改被阻止";
    runtimeText = allowed ? "检查通过，调用工具" : "未获授权，不调度修改";
    push(
      phase,
      title,
      description,
      allowed ? "工具调用已开始。" : "读取权限不包含写入权限。",
      allowed ? "tool" : "harness",
      allowed ? "ht" : null,
      allowed ? "Harness → Tool" : "Harness",
      allowed ? "执行工具" : "拦截修改请求",
      currentRequest,
      { denied: !allowed },
    );
  };

  const observe = (
    phase: string,
    result: string,
    title: string,
    description: string,
    insight: string,
    nextEnvironment?: string,
    blocked = false,
  ) => {
    latest = result;
    if (nextEnvironment) environment = nextEnvironment;
    context.push({ role: blocked ? "runtime" : "tool", text: result, callId: currentCall });
    toolText = blocked ? "本次没有执行修改" : "本次结果已返回";
    runtimeText = "保存工具结果";
    push(
      phase,
      title,
      description,
      insight,
      "harness",
      blocked ? null : "th",
      blocked ? "Harness" : "Tool → Harness",
      blocked ? "返回拒绝原因" : "收集执行结果",
      result,
      { denied: blocked },
    );
  };

  const finish = (phase: string, status: string, answer: string, description: string) => {
    modelCalls += 1;
    modelText = answer;
    runtimeText = "结束本轮任务";
    context.push({ role: "assistant", text: answer });
    push(phase, status, description, "报告包含修改和检查结果。", "model", "mh", "Model → User", status, answer, {
      status,
      final: true,
      outcome: answer,
    });
  };

  push(
    "收到任务",
    "收到修复请求",
    "用户提出修复任务。日志还没有读入，目前只知道服务启动失败。",
    "验收条件：服务启动成功，健康检查返回正常响应。",
    "harness",
    null,
    "User → Harness",
    "接收任务",
    harnessTask,
  );
  ask(
    "看日志",
    'read_file("server.log")',
    "请求读取日志",
    "Harness 把任务和可用工具的说明交给模型。模型选择 read_file，参数是 server.log。文件还没有被打开。",
    "等工具执行后，才会有日志内容。",
  );
  act("看日志", "执行读取", "Harness 确认 read_file 可用，并检查路径和读取权限。检查通过后，文件工具打开 server.log。");
  observe(
    "看日志",
    log,
    "日志返回语法错误",
    "日志指向 app.py 第一行：函数定义缺少冒号。Harness 把这条报错保存下来，加入下一次发给模型的输入。",
    "这份日志将在下一次调用时交给模型。",
  );
  ask(
    "查代码",
    'read_file("app.py")',
    "请求查看源码",
    "模型读到报错后，请求查看 app.py。它需要知道出错那一行实际写了什么。",
    "这次请求依据的是刚刚返回的报错。",
  );
  act("查代码", "读取 app.py", "Harness 检查新的路径，调用文件工具读取 app.py。");
  observe(
    "查代码",
    retry ? "def health_check()\n    return healty" : 'def health_check()\n    return "ok"',
    "返回源码",
    "函数定义末尾确实没有冒号。现在日志和源码都已读到，可以针对这一行提出修改。",
    "已执行两次读取，尚未修改文件。",
  );
  ask(
    "做修改",
    'edit_file("app.py", "def health_check()", "def health_check():")',
    "请求补上冒号",
    "模型用 edit_file 提出修改，把 def health_check() 换成 def health_check():。这条请求还需要经过写入权限检查。",
    "文件内容暂时没有变化。",
  );
  act(
    "做修改",
    denied ? "写入未获授权" : "执行修改",
    denied
      ? "这个分支只允许读取。Harness 拒绝写入请求，编辑工具没有运行。"
      : "演示设定已授权修改 app.py。Harness 核对补丁的目标和参数，编辑工具随后写入文件。",
    !denied,
  );
  if (denied) {
    observe(
      "做修改",
      "PermissionDenied: app.py 的写入操作未获授权",
      "记录权限错误",
      "Harness 保存拒绝原因。模型下一次会看到这个错误，以及之前读到的日志和源码。",
      "本轮停止在权限边界，不能把等待授权写成修复成功。",
      "已读取两个文件，没有写入。",
      true,
    );
    finish(
      "给出结论",
      "等待授权",
      "已找到缺少冒号的问题。尚未修改，需要写入授权。",
      "模型说明找到的问题，等待写入授权。本轮到这里停止，服务仍未修复。",
    );
    return frames;
  }
  observe(
    "做修改",
    "Applied: app.py\n- def health_check()\n+ def health_check():",
    "补丁已写入",
    "编辑工具确认 app.py 已更新。服务还没有重新检查，暂时不知道能否启动。",
    "接下来需要运行检查。",
    "代码已修改，尚未验证",
  );
  ask(
    "做测试",
    "run_checks()",
    "请求运行检查",
    "模型请求 run_checks()。这个工具在隔离环境中启动服务，再访问 /health，检查是否返回正常响应。",
    "run_checks 是演示中约定的检查工具。",
  );
  act("做测试", "执行检查", "Harness 调用检查工具，等待启动和接口请求的结果。");
  observe(
    "做测试",
    retry ? "Syntax check: PASS\nGET /health → HTTP 500\nNameError: healty 未定义" : "Syntax check: PASS\nGET /health → HTTP 200\nResponse: ok",
    retry ? "接口仍返回错误" : "健康检查通过",
    retry
      ? "语法检查通过了，但接口返回 HTTP 500。报错显示 healty 没有定义，Harness 把这个新错误交回模型。"
      : "服务返回 HTTP 200，响应内容为 ok，满足本例的检查条件。Harness 保存检查结果。",
    retry ? "需要根据新的错误继续排查。" : "本例的健康检查通过。",
    retry ? "服务检查仍失败" : "服务响应正常",
  );
  if (retry) {
    ask(
      "继续修正",
      'edit_file("app.py", "return healty", "return \\"ok\\"")',
      "请求修改返回值",
      "根据测试错误和读到的源码，模型提出把 return healty 改成 return \"ok\"。",
      "这次改的是返回值，不再重复补冒号。",
    );
    act("继续修正", "写入返回值修改", "Harness 确认修改仍在授权范围内，调用编辑工具。");
    observe(
      "继续修正",
      'Applied: app.py\n- return healty\n+ return "ok"',
      "第二处补丁已写入",
      "工具确认写入成功。服务尚未复测，运行状态还不能更新为正常。",
      "等待复测。",
      "第二处已修改，等待复测",
    );
    ask("再次测试", "run_checks()", "请求复测", "模型再次请求 run_checks()，检查修改后的服务。", "验收条件没有改变。");
    act("再次测试", "执行复测", "Harness 调用同一个检查工具，等待这次运行的结果。");
    observe(
      "再次测试",
      "Syntax check: PASS\nGET /health → HTTP 200\nResponse: ok",
      "复测通过",
      "健康检查返回 HTTP 200 和 ok。Harness 保存本次结果，模型下一次调用时能看到它。",
      "最后一次检查通过。",
      "服务响应正常",
    );
  }
  finish(
    "给出结论",
    retry ? "修正后通过" : "已验证完成",
    "服务已修复，启动与响应检查通过。",
    retry
      ? "模型报告两处修改和最后一次检查的结果。Harness 结束本轮，保留执行记录。"
      : "模型根据检查结果报告完成。Harness 结束循环，保存执行记录。",
  );
  return frames;
}

export const harnessStory: Record<HarnessScenario, HarnessFrame[]> = {
  success: buildFrames("success"),
  retry: buildFrames("retry"),
  denied: buildFrames("denied"),
};

const validScenario = (value: string): value is HarnessScenario => value in harnessStory;
const clamp = (value: unknown, max: number) => Math.max(0, Math.min(max, Math.trunc(Number(value) || 0)));

export function createHarnessState(options: Partial<HarnessState> = {}): HarnessState {
  const scenario = options.scenario && validScenario(options.scenario) ? options.scenario : "success";
  const mode: HarnessMode = options.mode === "model" ? "model" : "harness";
  return {
    scenario,
    mode,
    step: clamp(options.step, harnessStory[scenario].length - 1),
    playing: mode === "harness" && options.playing === true,
    speed: options.speed === 1.5 || options.speed === 2 ? options.speed : 1,
    replyComplete: false,
  };
}

type HarnessAction =
  | { type: "next" }
  | { type: "previous" }
  | { type: "seek"; step: number }
  | { type: "reset" }
  | { type: "scenario"; value: string }
  | { type: "mode"; value: HarnessMode }
  | { type: "play"; reduced?: boolean }
  | { type: "pause" }
  | { type: "tick" }
  | { type: "speed" }
  | { type: "reply-complete"; step: number };

export function harnessReducer(state: HarnessState, action: HarnessAction): HarnessState {
  const max = harnessStory[state.scenario].length - 1;
  const awaitingReply = harnessStory[state.scenario][state.step].edge === "mh" && !state.replyComplete;
  switch (action.type) {
    case "reply-complete":
      return action.step === state.step && !state.replyComplete ? { ...state, replyComplete: true } : state;
    case "next":
      return awaitingReply ? state : { ...state, step: Math.min(max, state.step + 1), playing: false, replyComplete: false };
    case "previous":
      return { ...state, step: Math.max(0, state.step - 1), playing: false, replyComplete: false };
    case "seek":
      return { ...state, step: clamp(action.step, max), playing: false, replyComplete: false };
    case "reset":
      return { ...state, step: 0, playing: false, replyComplete: false };
    case "scenario":
      return validScenario(action.value) ? { ...state, scenario: action.value, step: 0, playing: false, replyComplete: false } : state;
    case "mode":
      return { ...state, mode: action.value, step: 0, playing: false, replyComplete: false };
    case "play":
      if (state.mode === "model") return state;
      if (action.reduced) return { ...state, step: max, playing: false };
      return { ...state, step: state.step === max ? 0 : state.step, playing: !state.playing, replyComplete: state.step === max ? false : state.replyComplete };
    case "pause":
      return { ...state, playing: false };
    case "tick":
      return !state.playing || awaitingReply ? state : { ...state, step: Math.min(max, state.step + 1), playing: state.step < max - 1, replyComplete: false };
    case "speed":
      return { ...state, speed: state.speed === 1 ? 1.5 : state.speed === 1.5 ? 2 : 1 };
    default:
      return state;
  }
}

export function harnessFrame(state: HarnessState) {
  const frames = harnessStory[state.scenario];
  return { ...frames[clamp(state.step, frames.length - 1)], total: frames.length };
}

export function harnessChapters(state: HarnessState) {
  let previous = "";
  const chapters: Array<{ name: string; step: number }> = [];
  harnessStory[state.scenario].forEach((frame, step) => {
    if (frame.phase !== previous) {
      chapters.push({ name: frame.phase, step });
      previous = frame.phase;
    }
  });
  return chapters;
}
