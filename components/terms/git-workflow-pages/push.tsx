import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite, GitHero } from "../GitConceptPageShared";
import { pushSources } from "@/lib/git-concept-sources/push";
import { GitWorkflowLesson } from "../git-workflow-lessons/GitWorkflowLessonShared";

const sections: [string, string][] = [
  ["push-meaning", "push 发送的是什么"],
  ["push-gate", "远程先检查，再决定是否前进"],
  ["push-boundary", "推送成功仍不是合并完成"],
];

export function PushTermPage() {
  return <GitArticle
    slug="push"
    title="推送"
    subtitle="Push · 请求远程引用接受本地历史"
    sources={pushSources}
    sections={sections}
    hero={<GitHero trigger="本地提交正常，为什么 push 仍可能被远程拒绝？" change="可达提交对象 → refspec 目标 → 远程闸门与引用" proof="push 发送本地缺少的对象并请求更新目标引用；远程接受后分支才前进，工作区和拉取请求仍是后续步骤" />}
    intro={<>Git push 不是把当前文件夹“上传到服务器”，而是把本地可达的提交对象发送给远程，并请求远程把某个引用从旧提交移动到新提交。远程会检查历史关系、权限、钩子和分支保护；请求被接受，远程分支才会改变。</>}
  >
    <ArticleSection id="push-meaning" title="push 发送的是什么">
      <p>假设工作区里有一行尚未提交的修改，本地分支已经提交到 C，而远程功能分支还停在 B。执行 <code>git push origin feature</code> 时，未提交的那一行不会被单独发送；Git 只会计算远程缺少的、从 C 可达的对象，并把请求指向 <code>feature</code> 这个远程引用。</p>
      <p id="push-objects" className="vp-citation-target">push 会先通过协议协商，把远程没有的对象传给接收端；对象传输成功并不自动意味着远程引用已经更新，引用更新还要经过接收端的检查。<Cite id="push-objects" sources={pushSources} /></p>
      <p id="push-refspec" className="vp-citation-target">命令里的 refspec 决定“哪个本地引用要更新哪个远程引用”。显式写出远程名和分支，能让读者看到这次请求的目标，避免把功能分支误写到主分支。<Cite id="push-refspec" sources={pushSources} /></p>
      <GitWorkflowLesson slug="push" />
    </ArticleSection>

    <ArticleSection id="push-gate" title="远程先检查，再决定是否前进">
      <p id="push-fast-forward" className="vp-citation-target">如果远程目标仍是本地提交的祖先，更新可以快进：远程引用从 B 前进到 C，不需要覆盖远程已有历史。若远程已经在另一条线上，普通 push 会因非快进而拒绝，要求先 fetch 并明确处理分叉。<Cite id="push-fast-forward" sources={pushSources} /></p>
      <p id="push-receive" className="vp-citation-target">远程接收端可以运行接收钩子和其他仓库规则，在引用写入前检查提交、权限或策略；因此“对象已经传到远端”与“远程分支已经接受”是两个可分开的状态。<Cite id="push-receive" sources={pushSources} /></p>
      <p id="push-protection" className="vp-citation-target">托管平台还可以保护主分支，要求拉取请求、必需检查或审批，禁止直接强推。此时被拒不是网络失败，而是目标引用的协作规则在生效。<Cite id="push-protection" sources={pushSources} /></p>
      <p>演示把这条闸门保留在远程一侧：快进时远程指针从 B 变 C；远程已前进或分支受保护时，指针停在原处，并把下一步写成“先更新、评审或取得权限”，而不是伪造一个成功状态。</p>
    </ArticleSection>

    <ArticleSection id="push-boundary" title="推送成功仍不是合并完成">
      <p id="push-ref" className="vp-citation-target">远程分支引用的移动是一个可检查的结果：可以在远程页面或再次 fetch 后确认它是否指向目标提交。引用更新不等于把提交合入主分支，也不等于把工作区变成远程状态。<Cite id="push-ref" sources={pushSources} /></p>
      <p id="push-default" className="vp-citation-target">默认推送行为还会受到仓库配置和当前分支上游关系影响。团队脚本应明确目标和验证结果，不要把“命令退出码为 0”扩展成“已经合并、检查通过并上线”。<Cite id="push-default" sources={pushSources} /></p>
      <p><strong>读者判断：</strong>先检查本地提交和未提交修改，再确认远程名、目标 ref 和远程最新状态；push 被拒时区分非快进、权限、保护规则和认证问题。只有远程引用确实前进后，才进入拉取请求、代码评审和 CI；最终是否合并由那些协作步骤决定。</p>
    </ArticleSection>
  </GitArticle>;
}
