"use client";

import { ArrowRight, Browser, GitBranch, ShieldCheck, Train, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["拆出路径", "命中规则", "允许进入", "留下 returnTo", "驶入 404"];
const captions = [
  "路由器把地址拆成静态段、动态参数和查询串；查询串不会变成路径层级。",
  "products/42 命中 products/:id，42 被放进参数结果。",
  "匹配成功后还要经过访问检查；允许时才把参数交给目标页面。",
  "没有登录时，路由可以把目标地址保存成 returnTo，先送去登录分支。",
  "unknown/42 没有命中规则，车辆驶入 404；权限和取数都还没开始。",
];

export function RoutingHero() {
  const scene = useScene(labels.length);
  const [loggedIn, setLoggedIn] = useState(true);
  const step = scene.step;
  const denied = step === 3 || (!loggedIn && step >= 2 && step < 4);
  const notFound = step === 4;
  return <MechanismFrame scene={scene} title="URL 车厢怎样驶入正确分支" labels={labels} caption={captions[step]}>
    <div className={styles.routingScene}>
      <div className={styles.routingAddress}>
        <div className={styles.routingAddressHead}><Browser size={15} />ADDRESS BAR</div>
        <div className={styles.routingCars}><i>{notFound ? "unknown" : "products"}</i><ArrowRight size={13} /><i>{notFound ? "42" : ":id = 42"}</i><i data-query="true">?tab=stock</i></div>
        <button type="button" aria-pressed={loggedIn} onClick={() => { setLoggedIn(value => !value); scene.seek(2); }}><ShieldCheck size={14} />{loggedIn ? "session · allowed" : "session · missing"}</button>
      </div>
      <div className={styles.routingMap}>
        <div className={styles.routingMapHead}><GitBranch size={15} />ROUTE SWITCH</div>
        <div className={styles.routingTrack}>
          <div className={styles.routingLane} data-hit={step >= 1 && !notFound} data-fail={false}><Train size={14} /><strong>products/:id</strong><small>{step >= 1 && !notFound ? "id=42" : "待匹配"}</small></div>
          <div className={styles.routingLane} data-hit={denied} data-fail={denied}><ShieldCheck size={14} /><strong>{denied ? "login" : "auth check"}</strong><small>{denied ? "returnTo 保存" : loggedIn ? "通过" : "待检查"}</small></div>
          <div className={styles.routingLane} data-hit={notFound} data-fail={notFound}><WarningCircle size={14} /><strong>404</strong><small>{notFound ? "无匹配" : "备用轨道"}</small></div>
        </div>
      </div>
      <div className={styles.routingProof} role="status">{notFound || denied ? <WarningCircle size={16} /> : <Train size={16} />}<strong>{notFound ? "没有规则就没有页面" : denied ? "匹配成功，授权仍失败" : step >= 2 ? "参数交给目标页面" : "路由器正在拆车厢"}</strong><span>{notFound ? "404 是匹配结果" : denied ? "路由不替你授权" : "地址、规则和结果各自有位置"}</span></div>
    </div>
  </MechanismFrame>;
}
