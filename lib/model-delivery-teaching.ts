export type RouteTask = 'extract' | 'analysis' | 'image';
export const routeTasks = { extract: '提取订单金额', analysis: '分析多项条款', image: '读取订单截图' };
const models = [
  { name: 'A', cost: 1, scores: { extract: 96, analysis: 76, image: null } },
  { name: 'B', cost: 3, scores: { extract: 97, analysis: 92, image: 94 } },
];
export function routeRequest(task: RouteTask, threshold: number, availableB: boolean) {
  const candidates = models.map(model => {
    const score = model.scores[task];
    const reason = model.name === 'B' && !availableB ? '当前不可用' : score === null ? '不支持图片输入' : score < threshold ? '离线分数未达门槛' : '满足本例条件';
    return { ...model, score, reason, eligible: reason === '满足本例条件' };
  });
  const chosen = candidates.filter(model => model.eligible).sort((a, b) => a.cost - b.cost)[0]?.name ?? null;
  return { task, threshold, candidates, chosen };
}
export type PrimaryOutcome = 'rate' | 'timeout' | 'auth' | 'success';
export type BackupOutcome = 'valid' | 'invalid' | 'unsupported' | 'none';
export const primaryLabels = { rate: 'HTTP 429 · 限流', timeout: '超时 · 未收到响应', auth: 'HTTP 401 · 身份验证失败', success: 'HTTP 200 · 金额字段正确' };
export function fallbackPolicy(primary: PrimaryOutcome, backup: BackupOutcome, limit: number) {
  const reason = primary === 'success' ? '主调用已经完成，不需要备用' : primary === 'auth' ? '本例停止切换，先修正身份验证' : limit < 2 ? '总尝试上限已到，不再调用' : backup === 'none' ? '没有可用备用模型' : backup === 'unsupported' ? '备用不支持所需结构化输出' : '允许一次备用调用';
  return { primary, backup, limit, reason, eligible: reason === '允许一次备用调用' };
}
export function callBackup(policy: ReturnType<typeof fallbackPolicy>) {
  const attempted = policy.eligible;
  const pass = attempted && policy.backup === 'valid';
  return { attempted, attempts: attempted ? 2 : 1, pass, response: attempted ? pass ? '{"amount":120}' : '{"total":120}' : '', label: attempted ? pass ? '备用字段检查通过' : '缺少 amount，任务仍未完成' : policy.reason };
}
