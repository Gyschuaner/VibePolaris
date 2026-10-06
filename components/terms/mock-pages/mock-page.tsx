import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { mockSources } from "@/lib/mock-sources";
import { MockSignatureHero as MockHero } from "../TestSecuritySignatureHeroes";
import { MockLesson } from "./mock";

const sections: [string, string][] = [
  ["mock-definition-section", "先认清：Mock 替代的是什么"],
  ["mock-control-section", "它怎样把难以触发的分支变得可控"],
  ["mock-boundary-section", "调用记录不是业务契约"],
  ["mock-fidelity-section", "替身撤下之后，真实度要在哪里补回来"],
];

export function MockTermPage() {
  return <Article slug="mock" title="模拟对象" subtitle="Mock · 借一副可控的替身，照出代码怎样依赖别人" sources={mockSources} sections={sections} hero={<MockHero />} intro={<>测试结账逻辑时，真的要每次请求支付平台吗？不必。但把依赖换成一个会说“成功”的空壳，也不代表支付世界真的如此。<strong>Mock 的价值是隔离和记录；它的边界是返回值与调用期待都由测试写下，可能和真实依赖渐渐分叉。</strong></>}>
    <ArticleSection id="mock-definition-section" title="先认清：Mock 替代的是什么">
      <p id="mock-definition" className="vp-citation-target">Fowler 把 Test Double 当作一个总称：测试时用替代物换掉生产对象。Mock 是其中一种会预先写好期待、记录收到的调用，并在验证阶段检查这些调用的替身；它不是“任何假数据”的统称。<Cite id="mock-definition" sources={mockSources} /></p>
      <p id="mock-kinds" className="vp-citation-target">同一篇词典还区分了几种角色：Stub 给出预设答案，Spy 记录怎样被调用，Fake 用一个更轻量但能工作的实现跑一段行为，Mock 则更关心“被测对象对协作者做了什么”。在支付例子里，Mock 可以回答 `charge` 被调用几次，Fake 更像一台小型支付机，回答授权和扣款后的状态。<Cite id="mock-kinds" sources={mockSources} /></p>
      <p>所以先问“我要看什么”比先问“用哪个库”更重要：结账如何处理 `declined`，适合给它一个可控回执；结账有没有把金额、幂等键交给正确的角色，才是交互断言要解决的问题。两个问题都叫“测试支付”，替身却承担着不同工作。</p>
      <p id="mock-state-behavior" className="vp-citation-target">Fowler 把验证分成两条路：状态验证看最后留下了什么，行为验证看协作者收到了哪些调用。Mock 天然偏向行为验证；它能把一条外部协作变成可读的期待，也会让测试更贴近实现过程。<Cite id="mock-state-behavior" sources={mockSources} /></p>
    </ArticleSection>
    <ArticleSection id="mock-control-section" title="它怎样把难以触发的分支变得可控">
      <p id="mock-control" className="vp-citation-target">Jest 的 mock function 可以替换实现、返回指定值，并持续记录调用。测试不需要连真实支付网络，就能让 `PaymentGateway` 这次返回 `declined`，确认订单保持 `pending`，再让下一次返回 `paid`，检查成功路径。<Cite id="mock-control" sources={mockSources} /></p>
      <MockLesson />
      <p id="mock-calls" className="vp-citation-target">调用记录里通常有参数、次数和返回结果。Jest 将这些信息挂在 mock 的调用和结果记录上；它们适合回答“金额和幂等键有没有交给正确的边界”，但不应该无条件升级为“内部必须永远只调用一次”。<Cite id="mock-calls" sources={mockSources} /></p>
      <p id="mock-async" className="vp-citation-target">异步依赖也可以被控制：Jest 支持为 Promise 设定 resolved 或 rejected 的结果。支付超时、网关拒绝这类真实环境里昂贵又不稳定的分支，正是 Mock 能帮单测稳定踩到的地方。<Cite id="mock-async" sources={mockSources} /></p>
      <p id="mock-reset" className="vp-citation-target">控制越方便，清理越不能省。Vitest 明确提醒每次测试前后清空或恢复 Mock 状态；如果上一个测试留下的调用记录滚进下一个测试，绿色和红色都失去解释力。<Cite id="mock-reset" sources={mockSources} /></p>
    </ArticleSection>
    <ArticleSection id="mock-boundary-section" title="调用记录不是业务契约">
      <p id="mock-choice" className="vp-citation-target">Fowler 认为，协作简单时可以使用真实对象并检查状态；协作昂贵、缓慢或难以操作时，替身更合适。选择不是“所有依赖都 Mock”或“永远不用 Mock”的站队，而是看这一次测试要保护的事实在哪里。<Cite id="mock-choice" sources={mockSources} /></p>
      <p id="mock-refactor" className="vp-citation-target">首图的旧断言要求 `charge()` 恰好一次。实现改成 `authorize()` 加 `capture()` 后，订单仍是 `paid`，Mock 却报告 `charge ×0`。这条红灯可能在提醒调用契约被破坏，也可能只是在保护已经被替换的内部形状；先把业务结果和调用期待分开看，才知道该修代码还是改测试。<Cite id="mock-refactor" sources={mockSources} /></p>
      <p id="mock-module" className="vp-citation-target">Vitest 同时提供 `vi.fn`、`vi.spyOn` 和 `vi.mock`：可以只观察一个函数、替换一个模块，或让整个模块变成受控版本。替换范围越大，越要问测试是否还在验证自己的行为，还是只在验证一组替身彼此配合。<Cite id="mock-module" sources={mockSources} /></p>
      <p>一个实用的判断是：如果为了让 Mock 工作，需要写出比被测逻辑还长的调用剧本，测试很可能已经开始复制实现。把断言退回公开行为，或者把依赖换成一个更小的 Fake，通常比继续加期待更诚实。</p>
    </ArticleSection>
    <ArticleSection id="mock-fidelity-section" title="替身撤下之后，真实度要在哪里补回来">
      <p id="mock-fidelity" className="vp-citation-target">Google Testing Blog 建议在不增加测试规模的前提下尽量保留真实度：能用真实实现就先用，做不到时用维护良好的 Fake，再不得已才用 Mock。Mock 不执行依赖的真实实现，速度快却可能和生产行为分叉。<Cite id="mock-fidelity" sources={mockSources} /></p>
      <p id="mock-contract" className="vp-citation-target">因此 Fake 或 Mock 都不能替代支付服务的契约验证。可以在单测里用 Mock 稳定覆盖拒绝和超时，在更高一层用 Fake、契约测试或集成测试确认 `authorize → capture` 的协议仍和真实服务对得上；两层证据回答的是不同问题。<Cite id="mock-contract" sources={mockSources} /></p>
      <p><strong>决定要不要 Mock，先问四句：</strong>真实依赖是否慢、贵或难以稳定触发；测试要保护最终状态还是协作行为；替身是否会比业务逻辑更复杂；真实度准备在哪一层补回？四句都能回答，Mock 才是一扇清楚的隔离门，不是一堵把现实挡在外面的墙。</p>
    </ArticleSection>
  </Article>;
}
