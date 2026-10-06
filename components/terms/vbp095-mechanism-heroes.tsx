"use client";

import { useScene } from "./HarnessStoryScenes";
import { MechanismFrame } from "./ConceptMechanismHeroRuntime";
import styles from "./vbp095-mechanism-heroes.module.css";

const sitemapLabels = ["先看平铺", "建立分组", "接回孤立页", "映射导航"];
const sitemapCaptions = [
  "页面都在清单里，却没有关系；先看见缺口。",
  "按用户任务分出订单和账户，层级开始有骨架。",
  "优惠说明回到订单这一支，孤立入口变成可解释的关系。",
  "主导航只露出一级栏目，详情仍留在树里。",
];
export function SitemapMechanismHero() {
  const scene = useScene(sitemapLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="一张孤立页面怎样找到任务归属" labels={sitemapLabels} caption={sitemapCaptions[step]}>
    <div className={styles.sitemapScene} data-step={step}>
      <div className={styles.sitemapRoot}><small>{step === 0 ? "页面清单" : "根节点"}</small><strong>{step === 0 ? "12 个页面" : "网站"}</strong></div>
      <div className={styles.sitemapBranch} data-active={step >= 1}><small>一级栏目</small><strong>订单</strong><span>列表 · 详情 · 退货{step >= 2 ? " · 优惠说明" : ""}</span></div>
      <div className={styles.sitemapBranch} data-active={step >= 1}><small>一级栏目</small><strong>账户</strong><span>资料 · 地址 · 安全</span></div>
      <div className={styles.sitemapOrphan} data-docked={step >= 2}><strong>优惠说明</strong><small>{step >= 2 ? "订单下" : "待归属"}</small></div>
      <div className={styles.sitemapNav} data-on={step >= 3}>主导航：订单 · 账户</div>
    </div>
  </MechanismFrame>;
}

const tokenLabels = ["看引用", "浅色映射", "深色映射", "暴露硬编码"];
const tokenCaptions = [
  "组件先引用 color.action 这个用途名，不直接押上一种绿色。",
  "浅色主题只把语义名映射到 moss-900，按钮和链接一起换。",
  "深色主题换到 lime-500，组件仍读同一个名字。",
  "链接偷偷保留旧色值，关系断开，对比度问题终于显形。",
];
export function DesignTokenMechanismHero() {
  const scene = useScene(tokenLabels.length);
  const step = scene.step;
  const dark = step >= 2;
  const broken = step === 3;
  return <MechanismFrame scene={scene} title="主题变化沿语义令牌扩散" labels={tokenLabels} caption={tokenCaptions[step]}>
    <div className={styles.tokenScene} data-step={step}>
      <div className={styles.tokenCanvas} data-theme={dark ? "dark" : "light"}>
        <div className={styles.tokenCenter}><small>语义用途</small><strong>color.action</strong><span>{step === 0 ? "待映射" : dark ? "lime-500" : "moss-900"}</span></div>
        <div className={styles.tokenConsumer} data-role="button"><strong>按钮</strong><small>跟随映射</small></div>
        <div className={styles.tokenConsumer} data-role="link" data-broken={broken}><strong>链接</strong><small>{broken ? "旧值 · 脱离" : "跟随映射"}</small></div>
      </div>
      <div className={styles.tokenMapping}><small>现在看关系</small><strong>{broken ? "一个组件没有换" : dark ? "映射换了，组件同步" : "组件消费用途"}</strong><p>{broken ? "色值改名不等于建立主题系统。" : "基础值变化集中在语义层。"}</p></div>
    </div>
  </MechanismFrame>;
}

const hierarchyLabels = ["同权竞争", "降低噪音", "建立顺序", "窄屏保持"];
const hierarchyCaptions = [
  "标题、金额、说明、按钮和标签同样响，第一眼没有落点。",
  "先把说明和装饰压低，主要任务才有机会浮上来。",
  "标题定方向，金额帮判断，提交接住动作；注意力有了顺序。",
  "窗口变窄只重排位置，任务优先级仍然不变。",
];
export function VisualHierarchyMechanismHero() {
  const scene = useScene(hierarchyLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="注意力怎样从一团噪音收成一条路" labels={hierarchyLabels} caption={hierarchyCaptions[step]}>
    <div className={styles.hierarchyScene} data-step={step}>
      <div className={styles.hierarchyCard} data-mode={step === 3 ? "narrow" : "desktop"}>
        <div className={styles.hierarchyCardHead}><span>申请资料</span><span>{step === 3 ? "窄屏" : "桌面"}</span></div>
        <div className={styles.hierarchyItem} data-level={step === 0 ? "primary" : step >= 2 ? "hero" : "primary"}><small>标题</small><strong>提交报销申请</strong></div>
        <div className={styles.hierarchyItem} data-level={step === 0 ? "primary" : step >= 2 ? "primary" : "primary"}><small>内容</small><strong>本月差旅 · ¥1,280</strong></div>
        <div className={styles.hierarchyItem} data-level={step <= 0 ? "primary" : "quiet"}><small>说明</small><span>月底前上传发票</span></div>
        <div className={styles.hierarchyItem} data-level={step <= 0 ? "primary" : "quiet"}><small>标签</small><span>推荐 · 热门 · 新</span></div>
        <div className={styles.hierarchyItem} data-level={step >= 2 ? "primary" : "primary"}><small>动作</small><strong>提交申请</strong></div>
        <i className={styles.hierarchySpotlight} aria-hidden="true" />
      </div>
      <div className={styles.hierarchyReadout}><small>注意力读数</small><strong>{step === 0 ? "五个竞争焦点" : step === 1 ? "三个焦点" : step === 2 ? "标题 → 内容 → 提交" : "顺序没有换"}</strong><p>{step === 3 ? "列宽变窄，重要性仍由相对差异表达。" : "颜色、大小和分组一起决定眼睛先落在哪里。"}</p><span>{step >= 2 ? "任务可预测" : "继续调层级"}</span></div>
    </div>
  </MechanismFrame>;
}

const feedbackLabels = ["待提交", "已接收", "已保存", "失败保留", "继续重试"];
const feedbackCaptions = [
  "输入还在表单里，保存按钮等待一个明确动作。",
  "请求已经接住，按钮暂时锁住，输入没有消失。",
  "结果贴回编辑区，保存时间让成功变成可核对的事实。",
  "失败也留在原任务旁边，用户知道内容还在。",
  "重试沿原来的输入继续，不必从空白表单重新开始。",
];
export function FeedbackMechanismHero() {
  const scene = useScene(feedbackLabels.length);
  const step = scene.step;
  const failure = step === 3;
  return <MechanismFrame scene={scene} title="一次保存怎样把结果留在原位置" labels={feedbackLabels} caption={feedbackCaptions[step]}>
    <div className={styles.feedbackScene} data-step={step}>
      <div className={styles.feedbackForm}><div className={styles.feedbackField}><small>邮箱</small><strong>hello@example.com</strong><span>未保存的修改</span></div><span className={styles.feedbackButton} aria-hidden="true">{step === 0 ? "保存" : step === 1 ? "保存中…" : step === 2 ? "已保存" : "重试保存"}</span></div>
      <div className={styles.feedbackStatus} data-state={failure ? "failure" : "ok"} role="status"><small>{failure ? "请求结果" : "系统状态"}</small><strong>{failure ? "保存失败" : step === 2 ? "已保存 · 14:32" : step === 1 ? "系统已接收" : step === 4 ? "再次尝试" : "还有修改"}</strong><p>{failure ? "内容仍在，下一步是重试。" : step === 1 ? "正在把修改送出。" : step === 2 ? "结果贴着输入留下。" : "状态和动作在同一块区域。"}</p></div>
    </div>
  </MechanismFrame>;
}

const loadingLabels = ["100ms 直达", "2s 守住结构", "8s 显示完成量", "超时停止"];
const loadingCaptions = [
  "短请求直接落到新内容，不闪出一层多余等待。",
  "结构已知就保留列表位置，等待不会把页面推来推去。",
  "任务变长且能估计时，进度和取消入口一起出现。",
  "超过上限后停止等待，错误和重试比永远转圈更诚实。",
];
export function LoadingStateMechanismHero() {
  const scene = useScene(loadingLabels.length);
  const step = scene.step;
  const progress = step === 2 ? "60%" : step === 3 ? "停止" : "—";
  return <MechanismFrame scene={scene} title="同一个请求变慢后，界面何时换挡" labels={loadingLabels} caption={loadingCaptions[step]}>
    <div className={styles.loadingScene} data-step={step}>
      <div className={styles.loadingTrack}>{loadingLabels.map((label, index) => <div className={styles.loadingTick} data-on={index <= step} key={label}><i aria-hidden="true" /><span>{label}</span></div>)}</div>
      <div className={styles.loadingEvidence}><div><strong>{step === 0 ? "列表已更新" : step === 1 ? "5 行占位" : step === 2 ? "后台处理" : "连接超时"}</strong><small>{step === 0 ? "不打断" : step === 1 ? "位置保留" : step === 2 ? "可取消" : "重试可见"}</small></div><div className={styles.loadingBar}><i style={{ width: progress === "60%" ? "60%" : "0%" }} /></div></div>
    </div>
  </MechanismFrame>;
}

const microLabels = ["按下响应", "确认收藏", "进入撤销", "失败回到可信值"];
const microCaptions = [
  "先给即时按下反馈，但数量仍标成处理中，不能抢先宣布成功。",
  "服务端确认后星标填充，计数从 24 变成 25，状态留在按钮旁。",
  "再次点击是撤销请求，图标会回到轮廓，但仍等待结果确认。",
  "请求失败时回到已确认的数量，并提供重试，而不是保留假成功。",
];
export function MicrointeractionMechanismHero() {
  const scene = useScene(microLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="一枚星标怎样把触发和结果绑在一起" labels={microLabels} caption={microCaptions[step]}>
    <div className={styles.microScene} data-step={step}>
      <div className={styles.microControl}><div className={styles.microStar} aria-hidden="true">{step === 1 || step === 2 ? "★" : "☆"}</div><strong>{step === 0 ? "收藏中…" : step === 1 ? "已收藏" : step === 2 ? "取消中…" : "已收藏"}</strong><small>轻微变化只解释这一件事</small></div>
      <div className={styles.microLedger}><div data-on={step >= 0}><span>请求</span><strong>{step === 0 ? "pending" : step === 2 ? "undo" : step === 3 ? "failed" : "confirmed"}</strong></div><div data-on={step === 1 || step === 3}><span>收藏数</span><strong>{step === 1 || step === 3 ? "25" : step === 2 ? "24" : "24→?"}</strong></div><p>{step === 3 ? "失败：恢复服务端值 · 重试" : "反馈贴着触发点出现"}</p></div>
    </div>
  </MechanismFrame>;
}

const motionLabels = ["连续性", "开启偏好", "短淡入替代", "结果一致"];
const motionCaptions = [
  "完整动效用一条短轨迹把当前焦点带到新页面。",
  "用户偏好开启后，大幅位移和缩放退出表现预算。",
  "新标题原位淡入，状态仍然发生，路径不再横跨屏幕。",
  "两种模式到达同一个 URL、标题和焦点。",
];
export function ReducedMotionMechanismHero() {
  const scene = useScene(motionLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="两条表现路径，最后落在同一个结果" labels={motionLabels} caption={motionCaptions[step]}>
    <div className={styles.motionScene} data-step={step}>
      <div className={styles.motionLane} data-mode="full"><small>完整动效</small><strong>流星曲线 + 轻缩放</strong><i className={styles.motionRoute} /><i className={styles.motionOrb} /><span>路径更长，终点相同</span></div>
      <div className={styles.motionLane} data-mode="reduced"><small>减少动态</small><strong>原位淡入</strong><i className={styles.motionRoute} /><i className={styles.motionOrb} /><span>少位移，保留结果</span></div>
      <div className={styles.motionResult}>/terms/css · 标题焦点一致</div>
    </div>
  </MechanismFrame>;
}

const relationalLabels = ["保留列", "连接匹配", "过滤结果"];
const relationalCaptions = [
  "先挑结果需要的列，客户和订单仍各自保留自己的记录。",
  "customers.id 对上 orders.customer_id，关系由键表达，不靠两张表的视觉位置。",
  "再加 customer_id=7 和 amount>100，结果只留下可解释的三行。",
];
export function RelationalDatabaseMechanismHero() {
  const scene = useScene(relationalLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="两张表怎样只合出相关的事实" labels={relationalLabels} caption={relationalCaptions[step]}>
    <div className={styles.relationalScene} data-step={step}>
      <div className={styles.relationalTables}>
        <div className={styles.relationalTable} data-on={step >= 0}><div className={styles.relationalTableHead}><strong>customers</strong><span>id</span></div><small>7 · 阿青</small><small>8 · 小周</small><small>9 · 叶子</small></div>
        <div className={styles.relationalJoin} data-on={step >= 1}><strong>id = customer_id</strong><span>JOIN</span></div>
        <div className={styles.relationalTable} data-on={step >= 0}><div className={styles.relationalTableHead}><strong>orders</strong><span>customer_id</span></div><small data-match={step >= 2 ? "true" : "false"}>o-19 · 7 · ¥180</small><small data-match="false">o-22 · 8 · ¥40</small><small data-match={step >= 2 ? "true" : "false"}>o-23 · 7 · ¥220</small><small data-match="false">o-24 · 9 · ¥210</small><small data-match={step >= 2 ? "true" : "false"}>o-31 · 7 · ¥160</small></div>
      </div>
      <div className={styles.relationalResult} data-on={step >= 2}><span>customer_id=7 · amount&gt;100</span><strong>{step >= 2 ? "3 rows" : "待过滤"}</strong></div>
    </div>
  </MechanismFrame>;
}

const nosqlLabels = ["读一个用户", "改共享价格", "选择模型"];
const nosqlCaptions = [
  "profile 文档把常一起读取的资料放在一处，一次读取就得到完整对象。",
  "若价格复制进 120 个订单，一次共享变化会把更新范围放大。",
  "NoSQL 选择的是访问路径和取舍，不是给所有 JSON 贴上‘更快’的标签。",
];
export function NosqlMechanismHero() {
  const scene = useScene(nosqlLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="访问模式怎样决定数据放在哪里" labels={nosqlLabels} caption={nosqlCaptions[step]}>
    <div className={styles.nosqlScene} data-step={step}>
      <div className={styles.nosqlDocument}><div className={styles.nosqlDocumentHead}><strong>{step === 0 ? "profile 文档" : "订单聚合"}</strong><span>user:7</span></div><div className={styles.nosqlJson}><span><b>name</b><i>阿青</i></span><span><b>recentOrders</b><i>3 items</i></span><span data-shared={step >= 1}><b>price</b><i>{step >= 1 ? "120 × 120" : "120"}</i></span></div></div>
      <div className={styles.nosqlCopies}><small>共享字段更新面</small><strong>{step === 0 ? "1 次读取" : step === 1 ? "120 个副本" : "按查询选模型"}</strong><div className={styles.nosqlFan}>{Array.from({ length: 8 }, (_, index) => <i key={index} data-on={step >= 1} />)}</div><p>{step === 1 ? "聚合换来短读取，也带来复制维护。" : "先列出系统真正执行的读取和写入。"}</p></div>
    </div>
  </MechanismFrame>;
}

const rowLabels = ["创建未提交", "B 看旧快照", "A 提交", "C 看新快照"];
const rowCaptions = [
  "A 为 id=7 创建 balance=80 的新版本，但它还没有对其他事务开放。",
  "B 在 A 提交前建立快照，所以仍然读到已提交的 100。",
  "A 提交 v2；B 的既有快照不自动改写，仍然看见 100。",
  "提交后开始的事务 C 看到 80；变化来自可见版本，不是换了第三行。",
];
export function RowMechanismHero() {
  const scene = useScene(rowLabels.length);
  const step = scene.step;
  return <MechanismFrame scene={scene} title="同一逻辑行怎样保留不同事务的可见版本" labels={rowLabels} caption={rowCaptions[step]}>
    <div className={styles.rowScene} data-step={step}>
      <div className={styles.rowRecord}><div className={styles.rowRecordHead}><strong>orders · id=7</strong><span>逻辑身份不变</span></div><div className={styles.rowVersion} data-on={step >= 0}><small>B</small><strong>balance = 100</strong><span>已提交</span></div><div className={styles.rowVersion} data-on={step >= 1}><small>A</small><strong>balance = 80</strong><span>{step >= 2 ? "已提交" : "未提交"}</span></div></div>
      <div className={styles.rowReadout}><small>{step >= 3 ? "事务 C 新快照" : "读取者看到"}</small><strong>{step === 0 ? "100" : step === 1 ? "B 仍看 100" : step === 2 ? "B 仍看 100" : "C 看 80"}</strong><p>{step >= 2 ? "提交边界改变可见版本，不是把‘第三行’换了。" : "位置不是身份，快照才解释读到了什么。"}</p></div>
    </div>
  </MechanismFrame>;
}
