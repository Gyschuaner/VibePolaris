"use client";

import { Brain, Calculator, ChartLine, CheckCircle, FileText, GitBranch, LockSimple, ShieldCheck, Stack, User, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./AiAlignmentSignatureHeroes.module.css";

export function ChainOfThoughtSignatureHero() {
  const scene = useScene(4);
  const removedDiscount = scene.step >= 3;
  const total = removedDiscount ? 120 - 12 : 120 - 12 - 20;
  const labels = ["放入条件", "展开算式", "检查中间值", "删掉一项再看"];
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="思维链把退款计算的条件和中间值摊开" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.chainBoard}>
        <div className={styles.chainInputs}>
          <span>输入条件</span>
          <div className={styles.chainToken}><FileText size={16} />商品价 <b>¥120</b></div>
          <div className={styles.chainToken}><FileText size={16} />运费 <b>−¥12</b></div>
          <div className={styles.chainToken} data-removed={removedDiscount}><FileText size={16} />已用优惠 <b>−¥20</b></div>
        </div>
        <div className={styles.chainLedger}>
          <span>可审阅的中间账本</span>
          <div className={styles.chainFormula}><Calculator size={18} className={styles.icon} /><span>{scene.step === 0 ? "条件还没有展开" : removedDiscount ? "120 − 12 = 108" : "120 − 12 − 20 = 88"}</span><i>{scene.step < 2 ? "等待拆开每一项" : removedDiscount ? "优惠条件被拿掉" : "每一步都有输入"}</i></div>
          <div className={styles.chainResult}><span>退款结论</span><strong>{scene.step === 0 ? "?" : `¥${total}`}</strong>{scene.step >= 2 ? <CheckCircle size={19} className={styles.icon} /> : null}</div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "先把条件摆到同一张账本上，再谈最后的数字。" : removedDiscount ? "删掉一项后结果立刻变化；步骤让差异有地方可追。" : "中间算式变得可检查，但前提和外部证据仍要另行核对。"}</p></figcaption>
  </figure>;
}


export function SelfConsistencySignatureHero() {
  const scene = useScene(4);
  const labels = ["摆出同一道题", "采样三条路径", "只取最后答案", "加入共同误读"];
  const noisy = scene.step === 3;
  const counts = noisy ? { fortyTwo: 3, fortyThree: 0 } : { fortyTwo: scene.step < 2 ? 0 : 2, fortyThree: scene.step < 2 ? 0 : 1 };
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="自洽性采样把多条推理路径归并成答案票数" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.consistencyBoard}>
        <div className={styles.pathStack}>
          <span>同一个问题</span>
          {["路径 A · 42", "路径 B · 43", "路径 C · 42"].map((path, index) => <div className={styles.pathCard} key={path} data-visible={scene.step >= 1} data-noisy={noisy && index === 1}><GitBranch size={15} /><strong>{noisy && index === 1 ? "路径 B · 42" : path}</strong><small>{scene.step < 1 ? "等待采样" : index === 1 && noisy ? "共同读错单位" : "各自推理，最后交答案"}</small></div>)}
        </div>
        <div className={styles.voteBoard}>
          <span>答案归并，不比较文风</span>
          <div className={styles.voteBars}><div><b style={{ height: `${Math.max(8, counts.fortyTwo * 25)}%` }} /><strong>42 · {counts.fortyTwo} 票</strong></div><div><b style={{ height: `${Math.max(8, counts.fortyThree * 25)}%` }} /><strong>43 · {counts.fortyThree} 票</strong></div></div>
          <div className={styles.voteResult} data-warn={noisy}><ChartLine size={18} /><span>{scene.step < 2 ? "还没有答案" : noisy ? "多数也可能共享错误" : "路径共识：42"}</span>{noisy ? <WarningCircle size={18} /> : scene.step >= 2 ? <CheckCircle size={18} /> : null}</div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "先让路径各自走，不要把第一条写得更长就当成共识。" : noisy ? "票数只能说明路径一致；共同的错误前提仍要用外部检查拆开。" : "归并最后答案可以减少单一路径的偶然性，但要记录采样条件。"}</p></figcaption>
  </figure>;
}


export function ConstitutionalAiSignatureHero() {
  const scene = useScene(4);
  const labels = ["放入候选回答", "挂上原则卡", "写出批评", "改写并留痕"];
  const revised = scene.step === 3;
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="宪法式 AI 用原则卡批评并改写候选回答" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.constitutionBoard}>
        <div className={styles.principleCards}>
          <span>可审阅的原则卡</span>
          <div className={styles.principleCard} data-active={scene.step >= 1}><ShieldCheck size={16} /><strong>帮助用户</strong><small>回答要解决实际问题</small></div>
          <div className={styles.principleCard} data-active={scene.step >= 1}><ShieldCheck size={16} /><strong>不泄露隐私</strong><small>不要带出他人的订单</small></div>
        </div>
        <div className={styles.answerCard} data-revised={revised}>
          <span>候选回答</span><FileText size={19} className={styles.icon} />
          <strong>{revised ? "我可以解释流程，但不会展示他人的订单信息。" : "我把上一位客户的订单也贴给你参考。"}</strong>
          <small>{scene.step < 2 ? "等待按原则检查" : revised ? "修订后 · 保留可帮助部分" : "违反隐私原则"}</small>
        </div>
        <div className={styles.critiqueNote} data-visible={scene.step >= 2} data-good={revised}>
          {revised ? <CheckCircle size={18} /> : <WarningCircle size={18} />}<strong>{scene.step < 2 ? "还没有批评" : revised ? "批评已落实" : "指出：泄露他人信息"}</strong><small>{scene.step < 2 ? "先让原则成为判断依据" : revised ? "仍需独立评测和人工治理" : "不是把整段回答都删掉"}</small>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "原则卡先把“什么算合适”写得具体，避免只剩一句口号。" : revised ? "批评、改写和剩余风险都被留下；原则不是权限系统或自动正确的法律。" : "先指出哪条原则被触犯，再谈怎样改写，不能把模型自评当成证明。"}</p></figcaption>
  </figure>;
}


export function RlhfSignatureHero() {
  const scene = useScene(4);
  const labels = ["摆出两个回答", "人类做比较", "奖励尺学到偏好", "换一题再核对"];
  const proxy = scene.step === 3;
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="RLHF 把人类对回答的比较变成奖励代理" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.preferenceBoard}>
        <div className={styles.preferencePair}>
          <span>同一个请求 · 写给人看</span>
          <div className={styles.preferenceCard} data-picked={scene.step >= 1} data-muted={scene.step >= 1}><User size={16} /><strong>A · 礼貌但漏了日期</strong><small>{scene.step >= 1 ? "未选" : "候选回答"}</small></div>
          <div className={styles.preferenceCard} data-picked={scene.step >= 1} data-winner={scene.step >= 1}><User size={16} /><strong>B · 说明限制和日期</strong><small>{scene.step >= 1 ? "人类偏好" : "候选回答"}</small></div>
        </div>
        <div className={styles.rewardBoard}>
          <span>奖励模型 · 只是代理尺</span>
          <div className={styles.rewardDial} data-active={scene.step >= 2}><ChartLine size={20} /><strong>{scene.step < 2 ? "—" : proxy ? "0.91" : "0.78"}</strong><small>{scene.step < 2 ? "等待比较" : proxy ? "语气很顺，但要换测试" : "更偏向 B"}</small></div>
          <div className={styles.rewardNotice} data-warn={proxy}>{proxy ? <WarningCircle size={17} /> : scene.step >= 2 ? <CheckCircle size={17} /> : <User size={17} />}<span>{scene.step < 2 ? "人的判断还没有进入尺子" : proxy ? "奖励高，不代表事实已核验" : "比较被转成训练信号"}</span></div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "先让人比较具体回答，奖励模型才知道这批任务里的“更好”长什么样。" : proxy ? "奖励是代理目标；换题、换标注标准和独立事实检查仍然必要。" : "偏好被压成一把可训练的尺，但它不等于完整的人类价值。"}</p></figcaption>
  </figure>;
}


export function DirectPreferenceOptimizationSignatureHero() {
  const scene = useScene(4);
  const labels = ["放入成对回答", "看参考模型", "移动相对概率", "换坏标签试试"];
  const badLabel = scene.step === 3;
  const chosen = badLabel ? "套话很多" : "说明限制";
  const rejected = badLabel ? "事实更完整" : "只给结论";
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="DPO 对照 chosen、rejected、参考模型和当前策略的相对概率" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.dpoBoard}>
        <div className={styles.dpoPairs}>
          <span>偏好数据 · 不是绝对真理</span>
          <div className={styles.dpoAnswer} data-chosen={scene.step >= 1} data-bad={badLabel}><CheckCircle size={16} /><strong>chosen · {chosen}</strong><small>{badLabel ? "标签把讨喜当成更好" : "标注者选中"}</small></div>
          <div className={styles.dpoAnswer} data-rejected={scene.step >= 1} data-bad={badLabel}><WarningCircle size={16} /><strong>rejected · {rejected}</strong><small>{badLabel ? "更可靠却被拒" : "相对被拒"}</small></div>
        </div>
        <div className={styles.dpoProbabilities}>
          <div className={styles.dpoModelHead}><Brain size={18} /><span>相对概率</span></div>
          <div className={styles.dpoProbability}><span>reference</span><i style={{ width: `${scene.step < 2 ? 52 : 44}%` }} /><b>{scene.step < 2 ? "0.52" : "0.44"}</b></div>
          <div className={styles.dpoProbability} data-policy="true"><span>policy</span><i style={{ width: `${scene.step < 2 ? 55 : badLabel ? 78 : 71}%` }} /><b>{scene.step < 2 ? "0.55" : badLabel ? "0.78" : "0.71"}</b></div>
          <div className={styles.dpoVerdict} data-warn={badLabel}>{badLabel ? <WarningCircle size={17} /> : <ChartLine size={17} />}<span>{scene.step < 2 ? "等待相对比较" : badLabel ? "错误偏好也会被放大" : "chosen 相对提高"}</span></div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "DPO 先把一对回答和参考模型摆在同一张相对尺上。" : badLabel ? "链路更短不会替你判断标签；坏的偏好会被很有效地学进去。" : "它省去显式奖励模型，但仍然需要高质量偏好、参考基线和训练外评测。"}</p></figcaption>
  </figure>;
}


export function RedTeamingSignatureHero() {
  const scene = useScene(4);
  const labels = ["圈定授权范围", "点亮一个入口", "放入对抗变体", "留下回归证据"];
  const tested = scene.step >= 2;
  const fixed = scene.step === 3;
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="红队测试在授权范围内检查多个产品入口并留下回归证据" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.redTeamBoard}>
        <div className={styles.surfaceGrid}>
          <span>测试面 · 只看已授权资产</span>
          {["聊天入口", "上传文件", "检索资料", "工具调用"].map((label, index) => <div className={styles.surfaceTile} key={label} data-active={scene.step === 1 && index === 0 || tested && index === 0} data-tested={tested && index === 0}><ShieldCheck size={15} /><strong>{label}</strong><small>{scene.step === 0 ? "待选" : index === 0 ? fixed ? "已修复 · 回归" : tested ? "复现 2 次" : "可探测" : "范围外不触碰"}</small></div>)}
        </div>
        <div className={styles.scopeLog}>
          <div className={styles.scopeSeal} data-ok={scene.step >= 0}><ShieldCheck size={19} /><span>授权范围</span><strong>沙盒 · 无真实副作用</strong></div>
          <div className={styles.redEvidence} data-visible={tested} data-fixed={fixed}><Stack size={18} /><span>{tested ? fixed ? "回归记录已补齐" : "发现可复现缺口" : "尚未放入样例"}</span><small>{tested ? fixed ? "原样例 + 2 个变体" : "输入、版本、工具回执" : "先写成功标准"}</small></div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 1 ? "红队先把授权、成功标准和停止条件写在边界里。" : fixed ? "修复后要用原样例和变体回归；一张截图不能代表系统安全。" : tested ? "发现要带着版本、约束和影响回到修复，而不是只收藏一个漂亮的攻击。" : "只有被选中的入口才进入测试，范围外的真实系统保持不动。"}</p></figcaption>
  </figure>;
}


export function JailbreakSignatureHero() {
  const scene = useScene(4);
  const labels = ["放入正常请求", "改变包装类别", "检查边界是否松动", "记录安全回归"];
  const pressure = scene.step >= 1;
  const blocked = scene.step === 3;
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="越狱测试用抽象的包装类别检查安全边界，不展示危险载荷" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.jailbreakBoard}>
        <div className={styles.jailRequest} data-pressure={pressure}><Brain size={19} className={styles.icon} /><span>受控测试输入</span><strong>{pressure ? "包装类别：角色 / 编码 / 多轮" : "普通任务请求"}</strong><small>{pressure ? "只记录类别，不显示危险句子" : "先建立安全基线"}</small></div>
        <div className={styles.boundaryDial} data-blocked={blocked}><div className={styles.dialRing}><i /><i /><i /><ShieldCheck size={23} /></div><strong>{blocked ? "仍然拦住" : scene.step < 2 ? "观察中" : "边界受压"}</strong><small>{blocked ? "策略 + 权限 + 过滤" : "不同模型和上下文会变化"}</small></div>
        <div className={styles.jailChecks}>
          <div data-on={scene.step >= 2}><LockSimple size={16} /><span>模型行为</span><b>{scene.step >= 2 ? "拒答 / 改写" : "待测"}</b></div>
          <div data-on={scene.step >= 3}><CheckCircle size={16} /><span>回归记录</span><b>{blocked ? "原样例 + 变体" : "未完成"}</b></div>
          <div data-warn={pressure && !blocked}><WarningCircle size={16} /><span>工具权限</span><b>{pressure && !blocked ? "另需闸门" : "最小授权"}</b></div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 1 ? "先有一条正常基线，才知道包装变化后究竟松动了哪一层。" : blocked ? "安全结论来自跨版本、跨语言和多轮回归；测试类别不等于可滥用载荷。" : "越狱研究的是行为边界，输入来源、过滤和工具权限还要分别检查。"}</p></figcaption>
  </figure>;
}


export function ModelSpecSignatureHero() {
  const scene = useScene(4);
  const labels = ["收到用户愿望", "叠开发者约束", "遇到安全冲突", "检查真实权限"];
  const conflict = scene.step >= 2;
  const allowed = scene.step === 3;
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label="模型规范把指令层级和真实工具权限分开" data-step={scene.step}>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>
      <div className={styles.modelSpecBoard}>
        <div className={styles.specLayers}>
          <span>行为规范 · 谁的要求更优先</span>
          <div className={styles.specLayer} data-active={scene.step >= 0}><span>用户</span><strong>帮我导出客户名单</strong><small>愿望进入上下文</small></div>
          <div className={styles.specLayer} data-active={scene.step >= 1}><span>应用</span><strong>只处理已授权记录</strong><small>产品约束进入上下文</small></div>
          <div className={styles.specLayer} data-active={conflict} data-danger={conflict}><span>安全</span><strong>{conflict ? "隐私边界不能被绕过" : "等待冲突判断"}</strong><small>{conflict ? "规范给出行为方向" : "先看优先级"}</small></div>
        </div>
        <div className={styles.permissionGate} data-allowed={allowed}>
          {allowed ? <CheckCircle size={23} /> : <LockSimple size={23} />}
          <span>工具权限</span><strong>{allowed ? "只读沙盒 · 允许" : "未授权 · 不执行"}</strong><small>{allowed ? "规范和权限同时满足" : "规范不能凭空开门"}</small>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{scene.step < 2 ? "规范先帮助解释指令冲突，读者能看到规则怎样影响行为目标。" : allowed ? "最后仍要经过真实工具授权；这两把锁同时满足，动作才可以发生。" : "模型规范不是权限系统，不能因为文字上“应该允许”就读取或发送真实数据。"}</p></figcaption>
  </figure>;
}
