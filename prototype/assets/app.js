/* VibePolaris 交互原型脚本 — 纯原生 JS，零运行时 AI / 零外部依赖 */

/* ---------- 主题：明暗模式与品牌配色分层持久化 ---------- */
(function () {
  var root = document.documentElement;
  var palettes = {
    moss: { label: '苔藓编辑', themeColor: '#F5F3E8' },
    sprout: { label: '嫩芽墨色', themeColor: '#F8F7F1' },
    pomelo: { label: '柚皮橄榄', themeColor: '#F7F3E8' }
  };

  function safePalette(name) { return palettes[name] ? name : 'moss'; }
  function updateThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute('content', root.dataset.theme === 'dark' ? '#10150F' : palettes[safePalette(root.dataset.palette)].themeColor);
  }
  function setPalette(name, persist) {
    var next = safePalette(name);
    root.dataset.palette = next;
    if (persist !== false) {
      try { localStorage.setItem('vp-palette', next); } catch (e) {}
    }
    updateThemeColor();
    root.dispatchEvent(new CustomEvent('vp:palettechange', { detail: { palette: next } }));
    return next;
  }

  setPalette(root.dataset.palette || 'moss', false);
  window.VP_THEME = {
    palettes: palettes,
    getPalette: function () { return safePalette(root.dataset.palette); },
    setPalette: setPalette
  };

  var btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', function () {
    var cur = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = cur;
    try { localStorage.setItem('vp-theme', cur); } catch (e) {}
    updateThemeColor();
  });
  updateThemeColor();
})();

/* ---------- 流星品牌标识：首次进入一次，悬停/聚焦轻量重播 ---------- */
(function () {
  var marks = Array.prototype.slice.call(document.querySelectorAll('[data-logo-motion]'));
  if (!marks.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function replay(mark) {
    mark.classList.remove('is-arriving');
    void mark.offsetWidth;
    mark.classList.add('is-arriving');
  }

  marks.forEach(function (mark) {
    var link = mark.closest('a');
    if (mark.dataset.logoMotion === 'intro') requestAnimationFrame(function () { replay(mark); });
    if (!link) return;
    link.addEventListener('pointerenter', function () { replay(mark); });
    link.addEventListener('focus', function () { replay(mark); });
  });
})();

/* ---------- 首页技术领域：数量可增减，点击切换展开状态 ---------- */
(function () {
  var grid = document.querySelector('.domain-grid');
  if (!grid) return;
  var domains = Array.prototype.slice.call(grid.querySelectorAll('.domain'));

  function activate(target) {
    domains.forEach(function (domain) {
      var active = domain === target;
      var trigger = domain.querySelector('.domain-trigger');
      var detail = domain.querySelector('.domain-detail');
      domain.classList.toggle('is-active', active);
      if (trigger) trigger.setAttribute('aria-expanded', String(active));
      if (detail) detail.hidden = !active;
    });
  }

  domains.forEach(function (domain) {
    var trigger = domain.querySelector('.domain-trigger');
    if (trigger) trigger.addEventListener('click', function () { activate(domain); });
  });
})();

/* ---------- 页脚年份动态 ---------- */
(function () {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ---------- 首发 20 条术语数据（构建时动态生成的前身） ---------- */
window.VP_TERMS = [
  // 前端 4
  { zh: '组件', en: '组件', slug: 'component', cat: '前端', stage: '起步', say: '就是页面里可以重复使用的那一块，比如导航栏、按钮这些。', alias: '控件 积木 模块 重复的部分' },
  { zh: '状态', en: 'State', slug: 'state', cat: '前端', stage: '起步', say: '提交按钮点下去先显示保存中，成功或失败后再更新提示。', alias: '数据变化 界面跟着变' },
  { zh: '响应式布局', en: 'Responsive', slug: 'responsive', cat: '前端', stage: '进阶', say: '手机上打开别要左右滑，栏目要自己排成一列。', alias: '适配手机 手机友好 自适应' },
  { zh: '表单', en: 'Form', slug: 'form', cat: '前端', stage: '起步', say: '帮我做个注册页，用户填完信息点提交那种。', alias: '填写 注册 提交 输入' },
  // 后端 3
  { zh: 'API 接口', en: '', slug: 'api', cat: '后端', stage: '进阶', say: '就是两个系统之间的传话通道，按规则说就能拿到想要的数据。', alias: '接口 对接 前后端通信 webhook' },
  { zh: '数据库', en: 'Database', slug: 'database', cat: '后端', stage: '起步', say: '用户填的东西得存下来，下次打开还在，不能刷新就没了。', alias: '存储 存数据 表 数据库索引 持久化' },
  { zh: '认证', en: 'Authentication', slug: 'auth', cat: '后端', stage: '进阶', say: '要登录才能进自己的页面，没登录的跳到登录页。', alias: '登录 权限 鉴权 token 会话' },
  // AI·Agent 5
  { zh: '大模型', en: 'LLM', slug: 'llm', cat: 'AI·Agent', stage: '起步', say: '就是背后那个会读心又会给代码的 AI 大脑，换脑子回答风格不一样。', alias: '模型 模型选择 chatgpt claude deepseek gemini ai 大脑' },
  { zh: '提示词', en: 'Prompt', slug: 'prompt', cat: 'AI·Agent', stage: '起步', say: '告诉 AI 你要什么、怎么做的指令，写得越清楚，回答越靠谱。', alias: '指令 描述 说法 话术' },
  { zh: '上下文', en: 'Context', slug: 'context', cat: 'AI·Agent', stage: '进阶', say: 'AI 得知道你前面说了什么、项目长什么样，才不会答非所问。', alias: '记忆 上文 背景信息 上下文窗口' },
  { zh: 'Token', en: '', slug: 'token', cat: 'AI·Agent', stage: '进阶', say: 'AI 按字收费按字记事，太长会截断，这个计数单位就是 token。', alias: '字数 计费 截断 额度' },
  { zh: '智能体', en: 'Agent', slug: 'agent', cat: 'AI·Agent', stage: '熟练', say: '让它自己去查资料、写代码、跑测试，一步不用我盯着。', alias: '自动化 ai 干活 工作流 代理' },
  // 技术栈 3
  { zh: '框架与库', en: 'Framework & Library', slug: 'framework', cat: '技术栈', stage: '进阶', say: '别每次从零搭脚手架，用成熟的地基，别人踩过的坑别再踩。', alias: 'react vue nextjs 库 包 npm 脚手架' },
  { zh: '静态站点与服务器渲染', en: 'SSG / SSR', slug: 'ssg-ssr', cat: '技术栈', stage: '熟练', say: '内容提前烤好还是现烤？打开速度、SEO、能不能动态，全看这个选择。', alias: '渲染方式 静态 动态 服务端 预渲染' },
  { zh: '部署与托管', en: 'Deploy & Hosting', slug: 'deploy', cat: '技术栈', stage: '起步', say: '做完的网站要放到公网让人访问，还要有个域名。', alias: '上线 发布 域名 vercel cloudflare 服务器' },
  // Git 2
  { zh: '仓库与提交', en: 'Repo & Commit', slug: 'repo-commit', cat: 'Git', stage: '起步', say: '代码要能存档，改坏了能回到上一个存档点。', alias: '存档 git 版本 历史 回滚' },
  { zh: '分支', en: 'Branch', slug: 'branch', cat: 'Git', stage: '进阶', say: '新功能先在分叉上做，做好了再合回主线，别把主线弄坏。', alias: '合并 merge 主线 分叉 pull request pr' },
  // 产品与设计 3
  { zh: 'MVP', en: '', slug: 'mvp', cat: '产品与设计', stage: '起步', say: '先做一个能用的最小版本上线试试，别一上来就想做全能产品。', alias: '最小可用 第一版 先上线 小步快跑' },
  { zh: '用户流程', en: 'User Flow', slug: 'user-flow', cat: '产品与设计', stage: '进阶', say: '从进来第一步到完成目标，每一步点什么、跳到哪，先画清楚。', alias: '路径 步骤 转化 跳转' },
  { zh: '线框图', en: 'Wireframe', slug: 'wireframe', cat: '产品与设计', stage: '起步', say: '先别管好不好看，把页面上有哪几块、摆在哪定下来。', alias: '草图 原型 布局 排版' },
];

window.VP_CATS = ['前端', '后端', 'AI·Agent', '技术栈', 'Git', '产品与设计'];

/* ---------- 术语浏览页：分类 / 阶段 / 关键词过滤 ---------- */
(function () {
  var grid = document.getElementById('termGrid');
  if (!grid) return;

  var state = { cat: '全部', stage: '全部', q: '' };
  var params = new URLSearchParams(location.search);
  if (params.get('q')) state.q = params.get('q').trim();
  if (params.get('cat')) state.cat = params.get('cat');
  var input = document.getElementById('termSearch');
  if (state.q && input) input.value = state.q;

  var activeEl = null;
  document.querySelectorAll('.cat-item').forEach(function (x) { if (x.dataset.cat === state.cat) activeEl = x; });
  if (activeEl) document.querySelectorAll('.cat-item').forEach(function (x) { x.classList.toggle('active', x === activeEl); });

  function match(t) {
    if (state.cat !== '全部' && t.cat !== state.cat) return false;
    if (state.stage !== '全部' && t.stage !== state.stage) return false;
    if (state.q) {
      var hay = (t.zh + ' ' + t.en + ' ' + t.say + ' ' + t.alias + ' ' + t.cat).toLowerCase();
      return state.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
    }
    return true;
  }

  function render() {
    var list = window.VP_TERMS.filter(match);
    var cnt = document.getElementById('gridCount');
    if (cnt) cnt.textContent = '共 ' + list.length + ' 条';
    var html = list.length ? list.map(function (t) {
      var en = t.en && t.en !== t.zh ? '<span class="en">' + t.en + '</span>' : '';
      return '<a class="t-item" href="term-detail.html?slug=' + t.slug + '">' +
        '<div class="t-name">' + t.zh + en + '</div>' +
        '<div class="say">' + t.say + '</div>' +
        '<div class="meta"><span class="tag">' + t.cat + '</span><span class="stage">' + t.stage + '</span></div></a>';
    }).join('') : '<div class="empty">没搜到 —— 换个大白话说法试试，比如「点一下弹出来的小框」。</div>';
    grid.innerHTML = html;
  }

  document.querySelectorAll('.cat-item').forEach(function (el) {
    el.addEventListener('click', function () {
      state.cat = el.dataset.cat;
      document.querySelectorAll('.cat-item').forEach(function (x) { x.classList.toggle('active', x === el); });
      render();
    });
  });
  var sel = document.getElementById('stageSel');
  if (sel) sel.addEventListener('change', function () { state.stage = sel.value; render(); });
  if (input) input.addEventListener('input', function () { state.q = input.value.trim(); render(); });

  render();
  if (state.q && input) input.focus();
})();

/* ---------- 详情页：按 slug 填充 + 复制按钮 ---------- */
(function () {
  var nameEl = document.getElementById('dName');
  if (!nameEl) return;

  var params = new URLSearchParams(location.search);
  var slug = params.get('slug') || 'component';
  var t = window.VP_TERMS.find(function (x) { return x.slug === slug; }) || window.VP_TERMS[0];

  var en = t.en && t.en !== t.zh ? '<span class="en">' + t.en + '</span>' : '';
  nameEl.innerHTML = t.zh + en;
  document.getElementById('dCat').textContent = t.cat;
  document.getElementById('dCrumbName').textContent = t.zh;
  document.getElementById('dChip').textContent = t.cat;
  document.getElementById('dStage').textContent = t.stage + ' · Stage ' + ({'起步':1,'进阶':2,'熟练':3}[t.stage] || 1);
  document.getElementById('dSay').textContent = t.say;
  document.getElementById('dDef').innerHTML =
    '<strong>' + t.zh + '</strong>：' + t.say +
    '在这个页面里，你能看到它的准确叫法、什么时候该用它，以及一段可以直接复制给 AI 的说法。' +
    '想深入了解可以看看旁边的 <a class="inline" href="terms.html?q=' + encodeURIComponent(t.alias.split(' ')[0]) + '">同类概念</a>。';
  document.getElementById('dPrompt').textContent =
    '【目标】' + t.say + '\n【约束】用现在项目已有的做法，不要引入新的依赖。\n【验收】改完后说明改了哪些文件、怎么自测。';

  document.querySelectorAll('.roadmap .stop').forEach(function (el) {
    el.classList.toggle('on', el.dataset.stop === t.stage);
  });
})();

/* ---------- 复制 Prompt ---------- */
document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var target = document.querySelector(btn.getAttribute('data-copy'));
    if (!target) return;
    var text = target.textContent;
    function done() {
      var old = btn.textContent;
      btn.textContent = '已复制 ✓';
      setTimeout(function () { btn.textContent = old; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove(); done();
    }
  });
});

/* ---------- 工具导航筛选 ---------- */
(function () {
  var rows = document.querySelectorAll('.toolrow');
  if (!rows.length) return;
  document.querySelectorAll('.fchip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.fchip').forEach(function (c) { c.classList.toggle('on', c === chip); });
      var f = chip.dataset.f;
      rows.forEach(function (r) {
        r.style.display = (f === '全部' || r.dataset.tags.indexOf(f) >= 0) ? '' : 'none';
      });
    });
  });
})();
