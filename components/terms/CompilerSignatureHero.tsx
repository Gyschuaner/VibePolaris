"use client";

import { BracketsCurly, Cpu, FileCode, TreeStructure } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function CompilerSignatureHero() {
  const scene = useScene(4);
  const labels = ["解析源码", "生成中间表示", "产出目标代码", "运行验证"];
  const runtimeReady = scene.step === 3;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="编译器用源代码、语法树、中间表示和运行回执展示每一层的边界" caption={runtimeReady ? "运行时拿到目标代码并得到 5；这说明本例成功走完一条路径，仍不替代真实环境和业务验收。" : scene.step === 2 ? "中间表示保留了程序结构，但它仍不是已经运行的结果。" : "把不同层的对象叠起来，能看见编译改变表示，运行时才消费产物。"}>
    <div className={styles.compilerBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="FRONTEND DESK / REPRESENTATIONS" title="把 add(2, 3) 交给编译链" status={runtimeReady ? "RUNTIME 5" : scene.step === 2 ? "TARGET READY" : "INSPECTING"} />
      <div className={styles.compilerDesk}>
        <div className={styles.sourceCard} data-visible={scene.step >= 0}><FileCode size={21} /><span>源代码</span><code>add(2, 3)</code><small>人写的形式</small></div>
        <div className={styles.treeCard} data-visible={scene.step >= 1}><TreeStructure size={22} /><span>语法树</span><strong>Call(add, 2, 3)</strong><small>结构已检查</small></div>
        <div className={styles.irCard} data-visible={scene.step >= 2}><BracketsCurly size={22} /><span>中间表示</span><code>{scene.step >= 2 ? "%1 = add 2, 3" : "等待树"}</code><small>给后续优化或目标代码使用</small></div>
        <div className={styles.compilerProof}><Cpu size={20} /><span>{runtimeReady ? "运行时回执" : scene.step >= 2 ? "目标代码可继续生成" : "尚未到运行时"}</span><strong>{runtimeReady ? "add(2, 3) → 5" : scene.step >= 2 ? "target code ready" : "等待产物"}</strong></div>
      </div>
    </div>
  </SignatureFrame>;
}
