"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Cube, FileCode } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ContainerImageLesson() {
  const scene = useScene(4);
  const [written, setWritten] = useState(false);
  const [destroyed, setDestroyed] = useState(false);
  useEffect(() => {
    if (scene.step === 0 || scene.step === 1) { setWritten(false); setDestroyed(false); }
    if (scene.step === 2) { setWritten(true); setDestroyed(false); }
    if (scene.step === 3) { setWritten(false); setDestroyed(true); }
  }, [scene.step]);
  const writeB = () => { setWritten(true); setDestroyed(false); scene.seek(2); };
  const removeB = () => { setWritten(false); setDestroyed(true); scene.seek(3); };
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="容器镜像分层演示">
    <Caption scene={scene} labels={["构建镜像", "启动三个实例", "只修改 B", "删除并新建 B2"]} titles={["不可变模板", "共享只读层", "实例层独立变化", "同一摘要创建新实例"]} copy={["基础层 80 MB + 应用层 12 MB = 92 MB；镜像摘要固定。", "A、B、C 都引用同一份 92 MB 只读层，各自只增加临时可写层。", written ? "B 的可写层多了 /tmp/note 2 MB，A、C 和镜像摘要没有变化。" : "点击“在 B 写入”，把一个变化放进 B 的实例层。", "B 的临时写层被删除；只要镜像仍在本地或仓库，就能用同一摘要创建 B2。"]} />
    <div className={styles.choices} role="group" aria-label="操作容器实例"><button type="button" onClick={writeB} aria-pressed={written}><FileCode size={16} />在 B 写入 /tmp/note</button><button type="button" onClick={removeB} aria-pressed={destroyed}>删除 B 并创建 B2</button></div>
    <div className={styles.layers} aria-label="镜像层与容器层">
      <div className={styles.layerStack}><span>base · 80 MB</span><span>app · 12 MB</span><small>image@sha256:demo…（演示用缩写） · 92 MB</small></div>
      <ArrowRight size={20} aria-hidden="true" />
      <div className={styles.contract}><div><Cube size={25} /><h3>容器 A</h3><p>写层 +0 MB</p></div>{destroyed ? <div data-active="true"><Cube size={25} /><h3>容器 B2</h3><p>新写层 +0 MB</p></div> : <div data-active={written}><Cube size={25} /><h3>容器 B</h3><p>{written ? "写层 +2 MB" : "写层 +0 MB"}</p></div>}<div><Cube size={25} /><h3>容器 C</h3><p>写层 +0 MB</p></div></div>
    </div>
    <p className={styles.inputExample}><strong>可观察证据</strong>{destroyed ? "B 的临时写层消失，B2 以同一 image@sha256:demo…（演示用缩写） 创建；这不是 docker restart，后者会保留原实例层。" : "只读层可复用；每个实例的写入互不共享。"}</p>
  </div>;
}
