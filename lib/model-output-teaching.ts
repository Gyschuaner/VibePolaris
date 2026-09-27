export type StreamKind = 'normal' | 'error' | 'empty';
export type StreamEvent = { type: 'created' | 'delta' | 'text-done' | 'complete' | 'error'; text: string };
const deltas: StreamEvent[] = ['订单 A102 ', '已发货，', '预计 ', '明天送达。'].map(text => ({ type: 'delta', text }));
export function streamEvents(kind: StreamKind): StreamEvent[] {
  const created: StreamEvent = { type: 'created', text: '响应已建立' };
  if (kind === 'error') return [created, ...deltas.slice(0, 2), { type: 'error', text: '连接中断' }];
  if (kind === 'empty') return [created, { type: 'complete', text: '响应完成' }];
  return [created, ...deltas, { type: 'text-done', text: '文字片段结束' }, { type: 'complete', text: '响应完成' }];
}
export function receiveEvents(events: StreamEvent[], count: number, cancelled = false) {
  const received = events.slice(0, count), last = received.at(-1);
  const complete = !cancelled && last?.type === 'complete';
  return { text: received.filter(e => e.type === 'delta').map(e => e.text).join(''), received, complete,
    terminal: cancelled || complete || last?.type === 'error',
    status: cancelled ? '已取消，保留部分文字' : last?.type === 'error' ? '已中断，回答未完成' : complete ? '响应已完成' : last?.type === 'text-done' ? '文字结束，仍等待响应完成' : '接收中' };
}

export type OutputMode = 'instruction' | 'json' | 'schema';
export type OutputEnd = 'normal' | 'truncated' | 'refused' | 'empty';
export const outputCandidates = ['{"amount":120}', '{"amount":999}', '{"amount":"120"}', '{}'];
// ponytail: this fixed one-field teaching schema is not a general JSON Schema validator.
export function amountShape(value: unknown): value is { amount: number } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && Object.keys(value).length === 1 && 'amount' in value && Number.isInteger(value.amount);
}
export function constrainedCandidate(mode: OutputMode, index: number) { return mode !== 'schema' || index < 2; }
export function attemptOutput(mode: OutputMode, index: number, end: OutputEnd) {
  if (end === 'normal' && !constrainedCandidate(mode, index)) return { text: '', parsed: false, shape: false, fact: false, status: '候选被格式约束排除，没有生成此结果' };
  if (end === 'refused') return { text: '', parsed: false, shape: false, fact: false, status: '请求被拒绝，没有正常结构化结果' };
  const text = end === 'empty' ? '' : end === 'truncated' ? '{"amount":' : mode === 'instruction' ? `金额说明：${outputCandidates[index]}` : outputCandidates[index];
  try {
    const value: unknown = JSON.parse(text), shape = amountShape(value), fact = shape && value.amount === 120;
    return { text, parsed: true, shape, fact, status: fact ? '格式与本例资料一致' : shape ? '格式合规，金额与资料不符' : 'JSON 可解析，字段不符合要求' };
  } catch { return { text, parsed: false, shape: false, fact: false, status: end === 'truncated' ? '输出截断，未得到完整 JSON' : end === 'empty' ? '没有输出内容' : '自然语言说明不能直接作为 JSON 读取' }; }
}

export type FunctionRequest = { call_id: string; name: string; arguments: string; allowed: boolean };
export function functionRequest(name: string, args: string, allowed: boolean): FunctionRequest { return { call_id: 'call_01', name, arguments: args, allowed }; }
export function executeFunction(request: FunctionRequest) {
  const stopped = (reason: string) => ({ executions: 0, pass: false, call_id: request.call_id, response: '', reason });
  if (request.name !== 'get_order') return stopped('函数未注册，没有执行');
  let args: unknown;
  try { args = JSON.parse(request.arguments); } catch { return stopped('参数不是完整 JSON，没有执行'); }
  if (typeof args !== 'object' || args === null || Array.isArray(args) || Object.keys(args).length !== 1 || !('order_id' in args) || typeof args.order_id !== 'string' || !/^A\d{3}$/.test(args.order_id)) return stopped('要求唯一字段 order_id，值为 A 加三位数字，没有执行');
  if (!request.allowed) return stopped('没有订单查询权限，没有执行');
  // A fixed local record; no network or real customer data.
  const found = args.order_id === 'A102';
  return { executions: 1, pass: found, call_id: request.call_id, response: found ? '{"order_id":"A102","status":"shipped"}' : '{"error":"order_not_found"}', reason: found ? '查询已执行，返回订单记录' : '查询已执行，但未找到订单' };
}
