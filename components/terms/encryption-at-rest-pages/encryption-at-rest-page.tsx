import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { encryptionAtRestSources } from "@/lib/encryption-at-rest-sources";
import { EncryptionAtRestHero } from "./encryption-at-rest-hero";
import { EncryptionAtRestLesson } from "./encryption-at-rest";

const sections: [string, string][] = [
  ["encryption-at-rest-definition-section", "静态到底指什么"],
  ["encryption-at-rest-envelope-section", "先加密数据，再把 DEK 包起来"],
  ["encryption-at-rest-threat-section", "被偷的是盘，还是拿到应用身份"],
  ["encryption-at-rest-lifecycle-section", "轮换与撤权让保护继续有效"],
];

export function EncryptionAtRestTermPage() {
  return <Article slug="encryption-at-rest" title="静态加密" subtitle="Encryption at Rest · 让存储介质拿到的是密文" sources={encryptionAtRestSources} sections={sections} hero={<EncryptionAtRestHero />} intro={<>硬盘、数据库快照和备份文件被复制时，你希望对方打开只看到一堆没有用的字节。但应用最终还得把账单还原给有权限的人。<strong>静态加密保护的是保存中的数据；密钥放在哪里、谁能调用解密、旧版本怎样轮换，决定了这层保护到底挡住谁。</strong></>}> 
    <ArticleSection id="encryption-at-rest-definition-section" title="静态到底指什么">
      <p id="ear-definition" className="vp-citation-target">静态加密是把保存在设备或存储系统里的信息转换成密文，并用加密和认证限制未经授权的读取。NIST 把它放进存储安全的语境里，讨论的对象包括电脑、手机、可移动介质和存储设备；它回答的是“东西落盘后，拿到介质的人能不能直接读”。<Cite id="ear-definition" sources={encryptionAtRestSources} /></p>
      <p id="ear-storage-levels" className="vp-citation-target">它不只等于“给数据库开一个开关”。NIST 区分整盘、卷、虚拟盘和文件/文件夹等方案；OWASP 也把应用层、数据库层、文件系统层和硬件层列在一起。选哪一层，要看数据在哪里、要挡住哪种攻击，以及应用是否需要在更早的地方就把内容变成密文。<Cite id="ear-storage-levels" sources={encryptionAtRestSources} /></p>
      <p id="ear-threat-model" className="vp-citation-target">先写威胁，才能知道“加密了”意味着什么。硬件层加密可以帮助应对服务器或硬盘被物理拿走，却不能自动保护已经被远程攻破的应用进程；数据库、备份、日志和导出文件也可能各有自己的保存路径。<Cite id="ear-threat-model" sources={encryptionAtRestSources} /></p>
      <p id="ear-layer-boundary" className="vp-citation-target">所以静态加密和传输加密不是同一把锁：前者覆盖写入磁盘、快照或对象存储的阶段，后者覆盖网络链路。数据一旦在应用进程里被解密，保护范围就到了端点；这也是为什么加密层次要和访问控制、审计一起设计。<Cite id="ear-layer-boundary" sources={encryptionAtRestSources} /></p>
      <p>首图先把数据库页和备份文件摆在一起，是为了提醒你：攻击者不一定从主库进来。把一个文件加密，却让同一份明文继续出现在导出目录或旧快照里，保护范围仍然会从另一条路径漏出去。</p>
    </ArticleSection>

    <ArticleSection id="encryption-at-rest-envelope-section" title="先加密数据，再把 DEK 包起来">
      <p id="ear-dek-kek" className="vp-citation-target">大批量数据通常不让中心密钥服务直接替每一行做加密。Google 的 envelope encryption 模型里，数据加密密钥（DEK）负责加密数据，密钥加密密钥（KEK）负责把 DEK 包起来；被包好的 DEK 可以靠近密文保存，KEK 留在集中式 KMS。<Cite id="ear-dek-kek" sources={encryptionAtRestSources} /></p>
      <p id="ear-encrypt-flow" className="vp-citation-target">写入一条账单时，可以先在应用侧生成 DEK，用它和带认证的对称模式加密数据，再调用 KMS 用 KEK 包住 DEK，最后把密文、wrapped DEK 和密钥版本一起保存。Google 给出的流程强调：不要把明文 DEK 存下来，KEK 也不会离开 KMS。<Cite id="ear-encrypt-flow" sources={encryptionAtRestSources} /></p>
      <p id="ear-authenticated" className="vp-citation-target">这里不只是为了让人看不懂内容。OWASP 建议使用带认证的加密模式，例如 AES-GCM 或 CCM；它们同时给出机密性和完整性，篡改后的密文不会被当成正常账单交给应用。算法、模式、随机数和库应交给维护中的实现，不要自己拼一套“更简单的加密”。<Cite id="ear-authenticated" sources={encryptionAtRestSources} /></p>
      <EncryptionAtRestLesson />
      <p id="ear-decrypt-flow" className="vp-citation-target">读取时顺序反过来：应用取回密文和 wrapped DEK，向 KMS 请求解开 DEK，再在受控进程里解密数据。Google 的流程把 KEK 仍留在 KMS；如果应用身份没有解密权限，读取应该停在密钥服务，而不是把密文当成明文继续跑。<Cite id="ear-decrypt-flow" sources={encryptionAtRestSources} /></p>
      <p>这样做的好处不是“钥匙永远不会被使用”，而是把每一步变成可观察的请求：哪一个主体在什么时候请求哪一把 KEK，哪条授权规则让它通过，哪次解密结果回到了哪个服务。数据和密钥各自有位置，日志才能告诉你发生过什么。</p>
    </ArticleSection>

    <ArticleSection id="encryption-at-rest-threat-section" title="被偷的是盘，还是拿到应用身份">
      <p id="ear-kms-hierarchy" className="vp-citation-target">KMS 不是一个放在数据库旁边的普通配置文件。AWS KMS 把逻辑 KMS key、硬件支持密钥和数据密钥放在层级里，密钥材料在 HSM 中管理；客户管理的 key 还可以配合 key policy、IAM policy 和 grant 控制使用、禁用和审计。<Cite id="ear-kms-hierarchy" sources={encryptionAtRestSources} /></p>
      <p id="ear-key-storage" className="vp-citation-target">密钥存储本身是难点。OWASP 建议使用 HSM、云 KMS 或专门的密钥保险库，不要把 key 硬编码进源码、提交到版本库，或把它和数据放在同一个容易同时泄露的地方。应用需要解密权限这一事实不能被“加密”两个字抹掉。<Cite id="ear-key-storage" sources={encryptionAtRestSources} /></p>
      <p id="ear-separation" className="vp-citation-target">分开存放的价值很具体：只拿到数据库的一方没有 KEK，只有 KMS 权限的一方也没有要还原的数据。OWASP 允许把加密后的 DEK 和密文放在一起，但要求 KEK 处在另一套保护边界；两者同时被一个攻击者拿到时，这层隔离就失效了。<Cite id="ear-separation" sources={encryptionAtRestSources} /></p>
      <p id="ear-kek-boundary" className="vp-citation-target">这也解释了首图的两个攻击分支。偷走磁盘的人看到密文，却没有 KMS grant；拿到仍有解密权限的应用身份的人，反而可能读出 100 条明文。静态加密降低的是某一类存储泄露的直接影响，不是应用层授权的替代品。<Cite id="ear-kek-boundary" sources={encryptionAtRestSources} /></p>
      <p id="ear-defense-depth" className="vp-citation-target">OWASP 把这称为纵深防御：即使密码学控制出现故障，应用仍要有访问控制、最小权限、审计和数据最小化等护栏。不要把“URL 参数加密了”“数据库有 TDE”当作授权已经完成的证据。<Cite id="ear-defense-depth" sources={encryptionAtRestSources} /></p>
    </ArticleSection>

    <ArticleSection id="encryption-at-rest-lifecycle-section" title="轮换与撤权让保护继续有效">
      <p id="ear-rotation" className="vp-citation-target">密钥不是生成一次就结束。OWASP 建议在疑似泄露、密码周期到期、接近算法使用上限或算法安全性发生变化时轮换；新数据使用新密钥，旧备份在需要恢复时仍可能需要旧 key。<Cite id="ear-rotation" sources={encryptionAtRestSources} /></p>
      <p id="ear-kms-lifecycle" className="vp-citation-target">AWS KMS 把启用、禁用、轮换和删除安排在 key 的生命周期里，并区分客户管理、AWS 管理和 AWS 拥有的 key。它们的可见性、控制权和审计能力不同；产品若需要自己控制轮换或追踪使用，就不能只看“默认已经加密”。<Cite id="ear-kms-lifecycle" sources={encryptionAtRestSources} /></p>
      <p id="ear-key-management" className="vp-citation-target">NIST SP 800-57 把密钥管理当作一组持续的工作：生成、保护、分发、使用、恢复、轮换和退役都要有规则。把 <code>key_id</code> 或版本写进数据记录，系统才知道旧快照该找哪把钥匙，也才能在事件发生时快速收窄解密范围。<Cite id="ear-key-management" sources={encryptionAtRestSources} /></p>
      <p>可以用三个问题复核一套静态加密：哪些保存副本真的被覆盖；数据密钥和密钥加密密钥分别由谁控制；应用身份被撤回或密钥轮换后，旧数据、新数据和恢复流程分别会发生什么。<strong>密文是起点，钥匙的去处和生命周期才是边界。</strong></p>
    </ArticleSection>
  </Article>;
}
