import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { dockerfileSources } from "@/lib/dockerfile-sources";
import { DockerfileHero } from "./dockerfile-hero";
import { DockerfileLesson } from "./dockerfile";

const sections: [string, string][] = [
  ["dockerfile-definition-section", "每行指令都在改变构建输入"],
  ["dockerfile-cache-section", "顺序决定哪些层能复用"],
  ["dockerfile-stage-section", "构建工具不必住进运行时"],
  ["dockerfile-context-section", "发送给构建器的东西也有边界"],
];

export function DockerfileTermPage() {
  return <Article slug="dockerfile" title="Dockerfile" subtitle="Dockerfile · 把构建顺序写成可复用的层" sources={dockerfileSources} sections={sections} hero={<DockerfileHero />} intro={<>Dockerfile 看起来像一串 shell 命令，真正留下来的却是镜像层、缓存键和运行时边界。<strong>每个指令都会读取输入并留下结果，顺序决定下一次构建能复用什么。</strong>写它是在安排一条构建轨迹：依赖、源码、产物和 context 各自应该站在哪一层。</>}> 
    <ArticleSection id="dockerfile-definition-section" title="每行指令都在改变构建输入">
      <p id="docker-instruction" className="vp-citation-target">Dockerfile 由 <code>FROM</code>、<code>COPY</code>、<code>RUN</code>、<code>ENV</code>、<code>CMD</code> 等指令组成。构建器按顺序读取它们，每一步都以之前的结果作为输入，最后形成可运行的镜像。<Cite id="docker-instruction" sources={dockerfileSources} /></p>
      <p id="docker-layer" className="vp-citation-target">把每行想成一层会让缓存和变化变得可见：依赖安装层不应该因为一个源码文件变动就失效，源码复制层也不该被误当成“整个镜像重新从零开始”。<Cite id="docker-layer" sources={dockerfileSources} /></p>
      <p>首图把同一个 Dockerfile 拆成指令、层和产物三段，读者能看见“命令顺序”怎样成为“下一次构建的选择题”，而不是只看到一个已经完成的镜像标签。</p>
      <DockerfileLesson />
    </ArticleSection>

    <ArticleSection id="dockerfile-cache-section" title="顺序决定哪些层能复用">
      <p id="docker-cache" className="vp-citation-target">构建缓存会比较当前步骤和它依赖的输入；命中后可以复用已有结果，失效后通常还会影响后面的步骤。把变化慢的 manifest 先复制，再安装依赖，通常比先复制整个源码更容易保住缓存。<Cite id="docker-cache" sources={dockerfileSources} /></p>
      <p id="docker-invalidation" className="vp-citation-target">缓存失效不是错误，它是输入变化的证据。排查慢构建时，先找哪条指令失效、为什么失效，再决定是否要改顺序；不要用一个巨大的 cache-bust 把所有层一起打掉。<Cite id="docker-invalidation" sources={dockerfileSources} /></p>
      <p id="docker-order" className="vp-citation-target">依赖清单、安装命令和源码复制的排列有不同的变化频率。让高频变化靠后，能减少重复安装；让真正需要一起变化的输入保持在同一边界，缓存才不会为了数字而变得脆弱。<Cite id="docker-order" sources={dockerfileSources} /></p>
    </ArticleSection>

    <ArticleSection id="dockerfile-stage-section" title="构建工具不必住进运行时">
      <p id="docker-stage" className="vp-citation-target">多阶段构建用多个 <code>FROM</code> 给构建和运行划出不同舞台。build 阶段可以安装编译器和开发依赖，runtime 阶段只从前一阶段复制产物。<Cite id="docker-stage" sources={dockerfileSources} /></p>
      <p id="docker-runtime" className="vp-citation-target">运行镜像更小、攻击面更窄只是结果，不是多阶段的唯一理由。真正要说明的是：哪些工具只为构建服务，哪些文件是运行时必需，以及复制边界是否把配置和权限一起带对。<Cite id="docker-runtime" sources={dockerfileSources} /></p>
      <p><strong>可以这样检查层：</strong>改变一个源文件，确认依赖层命中；改变 lockfile，确认安装层确实重跑；构建 runtime 镜像并查看它不含编译工具；再把失败步骤定位到具体指令，而不是只看最后一行“build failed”。</p>
    </ArticleSection>

    <ArticleSection id="dockerfile-context-section" title="发送给构建器的东西也有边界">
      <p id="docker-context" className="vp-citation-target">Docker build context 是构建器可以读取的输入集合。发送整个仓库会增加上传、扫描和误带入的成本；在 context 外的文件即使写进 Dockerfile，也不能被 <code>COPY</code> 取到。<Cite id="docker-context" sources={dockerfileSources} /></p>
      <p id="docker-ignore" className="vp-citation-target"><code>.dockerignore</code> 可以从 context 里排除 node_modules、日志、构建产物和本地秘密。它不是安全边界的替代品，但能减少无用输入、缩短发送时间，也让构建意图更容易复查。<Cite id="docker-ignore" sources={dockerfileSources} /></p>
      <p><strong>最后问一句：</strong>这行 Dockerfile 是在描述运行时需要，还是在掩盖构建上下文太大的问题？把问题留在它所属的边界里，镜像才会既可复现又能解释。</p>
    </ArticleSection>
  </Article>;
}
