"use client";

import { BracketsCurly, Cpu, FileCode, TreeStructure } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function CompilerSignatureHero() {
  const scene = useScene(4);
  const labels = ["读入源代码", "长出语法树", "压成中间表示", "停在错误位置"];
  const error = scene.step === 3;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="编译器用源代码、语法树和中间表示的分层检查展示错误停在哪一层" caption={error ? "错误停在语法树这一层，运行时根本还没有拿到可执行的产物。" : scene.step === 2 ? "中间表示保留了程序结构，但它仍不是已经运行的结果。" : "把不同层的对象叠起来，能看见编译改变表示，运行时才消费产物。"}>
    <div className={styles.compilerBoard} data-stage={scene.step} data-error={error}>
      <BoardHeader eyebrow="FRONTEND DESK / REPRESENTATIONS" title="把 add(2, 3) 交给编译链" status={error ? "PARSE ERROR" : scene.step === 3 ? "STOPPED" : "INSPECTING"} />
      <div className={styles.compilerDesk}>
        <div className={styles.sourceCard} data-visible={scene.step >= 0}><FileCode size={21} /><span>源代码</span><code>add(2, 3)</code><small>人写的形式</small></div>
        <div className={styles.treeCard} data-visible={scene.step >= 1} data-error={error}><TreeStructure size={22} /><span>语法树</span><strong>{error ? "缺少 )" : "Call(add, 2, 3)"}</strong><small>{error ? "解析到此停止" : "结构已检查"}</small></div>
        <div className={styles.irCard} data-visible={scene.step >= 2}><BracketsCurly size={22} /><span>中间表示</span><code>{scene.step >= 2 ? "%1 = add 2, 3" : "等待树"}</code><small>给后续优化或目标代码使用</small></div>
        <div className={styles.compilerProof} data-error={error}><Cpu size={20} /><span>{error ? "运行时未启动" : scene.step >= 2 ? "目标代码可继续生成" : "尚未到运行时"}</span></div>
      </div>
    </div>
  </SignatureFrame>;
}
