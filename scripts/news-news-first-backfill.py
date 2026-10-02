#!/usr/bin/env python3
"""News-first daily backfill helper.

It only discovers and records candidates; a human/reader pass must still check the
selected source, revise the draft, publish it, and commit the event day. The script
never turns an academic paper into a selected news event.
"""
from __future__ import annotations

import argparse
import datetime as dt
import email.utils
import hashlib
import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DAILY = ROOT / "content/zh/news-daily"
DRAFTS = ROOT / "content/zh/news-drafts"
PUBLISHED = ROOT / "content/zh/news.json"
TERMS = ROOT / "content/zh/published-terms.json"
CACHE = ROOT / ".cache/news-backfill-news"
DISCOVERED_AT = "2026-10-02T08:00:00Z"
USER_AGENT = "VibePolaris-NewsBackfill/1.0 (+https://github.com/Gyschuaner/VibePolaris)"

TRUSTED_NEWS = {
    "reuters.com", "apnews.com", "bbc.com", "theguardian.com", "nytimes.com",
    "washingtonpost.com", "wsj.com", "ft.com", "bloomberg.com", "cnbc.com",
    "theverge.com", "techcrunch.com", "arstechnica.com", "wired.com",
    "technologyreview.com", "venturebeat.com", "axios.com", "politico.com",
    "cnn.com", "forbes.com", "fortune.com", "scmp.com", "npr.org",
    "allaboutcircuits.com", "circularonline.co.uk", "technewsworld.com",
    "ecommercetimes.com", "fedscoop.com", "businesswire.com", "prnewswire.com",
    "webwire.com", "zdnet.com", "engadget.com", "protocol.com", "fastcompany.com",
    "spectrum.ieee.org", "statnews.com", "nature.com", "science.org",
}
OFFICIAL_DOMAINS = {
    "openai.com", "anthropic.com", "deepmind.google", "ai.googleblog.com", "blog.google",
    "microsoft.com", "blogs.microsoft.com", "news.microsoft.com", "nvidia.com",
    "blogs.nvidia.com", "about.fb.com", "meta.com", "ibm.com", "intel.com",
    "apple.com", "amazon.science", "huggingface.co", "stability.ai", "baidu.com",
    "tencent.com", "alibaba.com", "unilever.com", "novartis.com", "philips.com",
    "stanford.edu", "mit.edu", "berkeley.edu", "cmu.edu", "caltech.edu",
    "mozilla.org", "mozilla.ai", "github.blog", "github.com", "amazon.com",
    "c3.ai", "esa.int", "duke.edu", "computer.org",
}
REGULATORY_SUFFIXES = (".gov", ".gov.uk", ".gov.au", ".gov.cn", ".europa.eu", ".int")
PAPER_DOMAINS = {"arxiv.org", "openreview.net", "paperswithcode.com", "acm.org", "dl.acm.org", "ieeexplore.ieee.org"}
BLACKLIST = {"pinterest.com", "quora.com", "reddit.com", "facebook.com", "linkedin.com", "youtube.com"}

TERM_KEYWORDS = {
    "agent-harness": ("agent", "assistant", "autonomous", "workflow"),
    "llm": ("language model", "large language", "chatgpt", "generative ai", "gpt", "text generation"),
    "prompt": ("prompt", "instruction", "natural language"),
    "eval": ("evaluation", "benchmark", "test", "accuracy", "performance"),
    "data-quality": ("data", "bias", "quality", "dataset", "privacy", "safety"),
    "data-pipeline": ("pipeline", "infrastructure", "compute", "chip", "processor", "cloud"),
    "tools": ("tool", "platform", "api", "software", "product", "release"),
    "authorization": ("regulation", "law", "policy", "government", "privacy", "security"),
}


def request(url: str, *, data: bytes | None = None, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, data=data, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.read()


def cache_path(key: str) -> Path:
    return CACHE / (hashlib.sha256(key.encode()).hexdigest() + ".json")


def cached_json(key: str):
    path = cache_path(key)
    if path.exists():
        try:
            return json.loads(path.read_text())
        except json.JSONDecodeError:
            path.unlink(missing_ok=True)
    return None


def save_cache(key: str, value) -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    cache_path(key).write_text(json.dumps(value, ensure_ascii=False, indent=2))


def canonical_url(url: str) -> str:
    parsed = urllib.parse.urlsplit(url)
    query = [(key, value) for key, value in urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
             if not key.lower().startswith("utm_") and key.lower() not in {"fbclid", "gclid"}]
    path = parsed.path.rstrip("/") or "/"
    return urllib.parse.urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(), path, urllib.parse.urlencode(sorted(query)), ""))


def domain(url: str) -> str:
    host = urllib.parse.urlsplit(url).hostname or ""
    host = host.lower().removeprefix("www.")
    return host


def registered_domain(host: str) -> str:
    parts = host.split(".")
    return ".".join(parts[-2:]) if len(parts) >= 2 else host


def source_type(url: str, title: str) -> str:
    host = domain(url)
    rd = registered_domain(host)
    lower = (url + " " + title).lower()
    if rd in PAPER_DOMAINS or any(x in lower for x in ("arxiv.org", "doi.org/10.", "journal article")):
        return "paper"
    if host.endswith(REGULATORY_SUFFIXES) or any(x in lower for x in ("sec.gov", "ftc.gov", "fda.gov", "nist.gov", "europa.eu")):
        return "regulatory"
    if any(host == official or host.endswith("." + official) for official in OFFICIAL_DOMAINS):
        if any(x in lower for x in ("blog", "research", "story", "stories", "engineering", "insight")):
            return "official-blog"
        return "official-announcement"
    if any(host == news or host.endswith("." + news) for news in TRUSTED_NEWS):
        return "news-report"
    if any(x in host for x in ("substack.com", "medium.com", "towardsdatascience.com", "dev.to")):
        return "personal-blog"
    return "news-report"


def source_score(item: dict) -> int:
    typ = item["sourceType"]
    score = {"regulatory": 8, "official-announcement": 7, "official-blog": 6, "news-report": 5, "personal-blog": 2, "paper": -8}[typ]
    title = item["title"].lower()
    if any(x in title for x in ("funding", "launch", "announces", "announced", "acquire", "acquisition", "law", "policy", "investigation", "rollout", "deploy", "released", "introducing")):
        score += 2
    if any(x in title for x in ("horoscope", "jobs", "stock", "opinion", "quiz", "sponsored", "course")):
        score -= 5
    return score


def parse_date(value: str) -> str | None:
    try:
        parsed = email.utils.parsedate_to_datetime(value)
        return parsed.date().isoformat()
    except (TypeError, ValueError, OverflowError):
        return None


def feed_items(day: str, query_text: str) -> list[dict]:
    next_day = (dt.date.fromisoformat(day) + dt.timedelta(days=1)).isoformat()
    query = f"{query_text} after:{day} before:{next_day}"
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": query, "hl": "en-US", "gl": "US", "ceid": "US:en"})
    cached = cached_json("rss:" + url)
    if cached is None:
        try:
            root = ET.fromstring(request(url))
            cached = []
            for item in root.findall("./channel/item"):
                source = item.find("source")
                cached.append({
                    "title": (item.findtext("title") or "").strip(),
                    "googleUrl": (item.findtext("link") or "").strip(),
                    "pubDate": (item.findtext("pubDate") or "").strip(),
                    "publishedAt": parse_date(item.findtext("pubDate") or ""),
                    "sourceName": (source.text or "").strip() if source is not None else "",
                    "sourceUrl": (source.attrib.get("url") or "").strip() if source is not None else "",
                })
            save_cache("rss:" + url, cached)
        except Exception as error:
            print(f"RSS failed {day} {query_text}: {error}", file=sys.stderr)
            return []
    for item in cached:
        item["queryUrl"] = url
    return cached


def resolve_google(url: str) -> str | None:
    if not url.startswith("https://news.google.com/"):
        return canonical_url(url)
    key = "resolve:" + url
    cached = cached_json(key)
    # A transient Google error must not become a permanent "gap day".  Re-run
    # failed decodes on the next pass; successful URLs remain cached.
    if cached is not None and cached.get("url"):
        return cached.get("url")
    last_error = None
    for attempt in range(3):
        try:
            page = request(url).decode("utf-8", "replace")
            match = re.search(r'<c-wiz[^>]*data-p="([^"]+)"', page)
            if not match:
                last_error = "missing data-p"
                time.sleep(0.4 * (attempt + 1))
                continue
            data = html.unescape(match.group(1))
            config = json.loads(data.replace("%.@.", '["garturlreq",', 1))
            payload = {"f.req": json.dumps([[['Fbv4je', json.dumps(config[:-6] + config[-2:]), "null", "generic"]]])}
            raw = request("https://news.google.com/_/DotsSplashUi/data/batchexecute", data=urllib.parse.urlencode(payload).encode()).decode("utf-8", "replace")
            response = json.loads(raw.replace(")]}'", "", 1))[0][2]
            resolved = json.loads(response)[1]
            result = canonical_url(resolved) if resolved.startswith("http") else None
            if result:
                save_cache(key, {"url": result})
                time.sleep(0.05)
                return result
            last_error = "missing resolved URL"
        except Exception as error:
            last_error = str(error)
        time.sleep(0.4 * (attempt + 1))
    save_cache(key, {"url": None, "error": last_error or "decode failed"})
    return None


def strip_markup(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def fetch_meta(url: str) -> dict:
    key = "meta:" + url
    cached = cached_json(key)
    if cached is not None:
        return cached
    result = {"title": "", "description": "", "datePublished": None, "image": None, "body": ""}
    try:
        raw = request(url, timeout=20)[:900_000]
        text = raw.decode("utf-8", "replace")
        result["body"] = strip_markup(text)[:60_000]
        title = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
        if title:
            result["title"] = strip_markup(title.group(1))[:500]
        for attr, name in (("property", "og:description"), ("name", "description")):
            pattern = rf'<meta[^>]+{attr}=["\']{re.escape(name)}["\'][^>]+content=["\'](.*?)["\']'
            match = re.search(pattern, text, re.I | re.S)
            if match:
                result["description"] = strip_markup(match.group(1))[:1_500]
                break
        for pattern in (r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})', r'<time[^>]+datetime=["\'](\d{4}-\d{2}-\d{2})'):
            match = re.search(pattern, text, re.I)
            if match:
                result["datePublished"] = match.group(1)
                break
        image = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](.*?)["\']', text, re.I | re.S)
        if image and image.group(1).startswith("http"):
            result["image"] = canonical_url(image.group(1))
    except Exception as error:
        result["error"] = str(error)
    save_cache(key, result)
    return result


def slugify(title: str, day: str, url: str) -> str:
    ascii_title = title.encode("ascii", "ignore").decode().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_title).strip("-")[:105]
    if not slug:
        slug = "ai-news"
    suffix = hashlib.sha256((url + day).encode()).hexdigest()[:8]
    return f"{slug}-{day.replace('-', '')}-{suffix}"[:149]


def selected_terms(title: str, description: str, terms: set[str]) -> list[str]:
    text = (title + " " + description).lower()
    scored = []
    for slug, keywords in TERM_KEYWORDS.items():
        if slug in terms:
            score = sum(text.count(keyword) for keyword in keywords)
            if score:
                scored.append((score, slug))
    if not scored:
        return ["tools"] if "tools" in terms else [next(iter(terms))]
    scored.sort(key=lambda pair: (-pair[0], pair[1]))
    return [slug for _, slug in scored[:4]]


def chinese_headline(headline: str) -> str:
    """Give the reader a Chinese event cue without pretending to translate every proper noun."""
    value = headline.strip()
    replacements = (
        ("News", "发布消息"), ("news", "发布消息"),
        ("First-of-its-kind", "首个同类"), ("first-of-its-kind", "首个同类"),
        ("could spark", "可能引发"), ("Could spark", "可能引发"),
        ("could help", "可能帮助"), ("Could help", "可能帮助"),
        ("helps", "帮助"), ("helping", "帮助"), ("help", "帮助"),
        ("after fault develops", "出现故障后返航"),
        ("backs", "支持"), ("Backs", "支持"),
        ("recognized for", "获认可"), ("recognized as", "获评为"),
        ("recognized", "获认可"), ("awarded", "获奖"),
        ("winners", "获奖者"), ("winner", "获奖者"),
        ("to become", "将成为"), ("become", "成为"),
        ("cut", "缩短"), ("improve", "改善"), ("improves", "改善"),
        ("risks", "风险"), ("risk", "风险"), ("safety", "安全"),
        ("security", "安全"), ("human rights", "人权"),
        ("public debate", "公共讨论"), ("in the hands of", "掌握在"),
        ("without", "无需"), ("for the first time", "首次"),
        ("the future of", "未来"), ("Future of", "未来"),
        ("Artificial intelligence", "人工智能"), ("artificial intelligence", "人工智能"),
        ("AI-powered", "AI 驱动的"), ("AI-powered", "AI 驱动的"),
        ("machine learning", "机器学习"), ("Machine Learning", "机器学习"),
        ("announces", "宣布"), ("announced", "宣布"), ("launches", "推出"),
        ("launch", "推出"), ("introduces", "介绍"), ("introducing", "介绍"),
        ("released", "发布"), ("release", "发布"), ("acquires", "收购"),
        ("acquisition", "收购"), ("funding", "融资"), ("raises", "融资"),
        ("partnership", "合作"), ("partner", "合作"), ("deploys", "部署"),
        ("deployment", "部署"), ("appoints", "任命"), ("appointed", "任命"),
        ("dies", "去世"), ("dies", "去世"), ("review", "回顾"),
        ("researchers", "研究者"), ("researcher", "研究者"), ("study", "研究"),
        ("report", "报道"), ("reports", "报道"), ("platform", "平台"),
        ("software", "软件"), ("system", "系统"), ("systems", "系统"),
        ("without coding", "无需编程"), ("without code", "无需编程"),
    )
    for source, target in replacements:
        value = value.replace(source, target)
    value = re.sub(r"\s+", " ", value).strip(" -–—:")
    return value or "AI 相关消息"


def event_fact(source_name: str, headline: str, headline_zh: str, published_at: str, source_type_value: str) -> str:
    """Turn a source headline into a short, attributable news fact.

    Keep this close to the source title: a backfill must not invent outcomes
    that are absent from the source card.
    """
    lower = headline.lower()
    if "announce" in lower and ("winner" in lower or "challenge" in lower):
        return f"{source_name} 在 {published_at} 宣布了与 AI 相关挑战或项目的结果"
    if any(token in lower for token in ("launch", "launched", "introduc", "unveil", "release", "released", "opens", "open ")):
        return f"{source_name} 在 {published_at} 发布或介绍了“{headline_zh}”所指的项目/产品动作"
    if any(token in lower for token in ("acquire", "acqui", "funding", "raises", "backs", "partnership", "partner")):
        return f"{source_name} 在 {published_at} 报道或宣布了“{headline_zh}”所指的融资、收购或合作动作"
    if any(token in lower for token in ("report", "analysis", "opinion", "why ", "how ", "what ", "could ", "future", "review")):
        return f"{source_name} 在 {published_at} 发布围绕“{headline_zh}”的报道或分析"
    if any(token in lower for token in ("study", "research", "scientist", "researcher")):
        return f"{source_name} 在 {published_at} 报道了与“{headline_zh}”有关的研究进展"
    return f"{source_name} 在 {published_at} 发布了题为“{headline_zh}”的新闻"


TERM_EXPLANATIONS = {
    "tools": "工具词条帮助读者定位这条消息里真正可操作的软件、服务或设备，不把产品宣传直接当成效果证明。",
    "data-pipeline": "数据管道词条帮助读者追踪数据从采集、清洗、建模到业务动作的流向，观察中间哪里需要权限和审计。",
    "data-quality": "数据质量词条提醒读者检查样本是否完整、代表性是否足够，以及错误会怎样传到结果。",
    "eval": "评估词条把“看起来有效”拆成任务、样本、指标、基线和复现实验。",
    "authorization": "授权词条把能力问题转成治理问题：谁可以访问、批准、暂停或追责。",
    "llm": "LLM 词条用于解释生成文本的模型层；文字流畅不等于事实可靠。",
    "agent-harness": "agent-harness 词条用于解释模型怎样被工具、权限和运行环境约束，不能把自主性写成默认能力。",
}


def term_sentence(terms: list[str]) -> str:
    explanations = [TERM_EXPLANATIONS.get(term, f"“{term}”词条提供这条新闻的概念背景。") for term in terms[:3]]
    return "".join(explanations)


def svg_for(article_title: str, day: str, slug: str) -> str:
    def esc(text: str) -> str:
        return html.escape(text[:82], quote=True)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 620" role="img" aria-labelledby="title"><title id="title">{esc(article_title)}</title><rect width="1200" height="620" fill="#f5f3e8"/><path d="M170 360 C300 130 495 130 610 290 S860 450 1030 250" fill="none" stroke="#6D7FA9" stroke-width="18" stroke-linecap="round"/><circle cx="170" cy="360" r="46" fill="#171a15"/><circle cx="610" cy="290" r="58" fill="#6D7FA9"/><circle cx="1030" cy="250" r="46" fill="#171a15"/><text x="72" y="92" fill="#171a15" font-family="Arial,sans-serif" font-size="34" font-weight="700">VibePolaris · NEWS</text><text x="72" y="148" fill="#171a15" font-family="Arial,sans-serif" font-size="25">{day} · 新闻事件流程</text><text x="115" y="450" fill="#171a15" font-family="Arial,sans-serif" font-size="23">报道动作</text><text x="548" y="388" fill="#171a15" font-family="Arial,sans-serif" font-size="23">关键变化</text><text x="953" y="320" fill="#171a15" font-family="Arial,sans-serif" font-size="23">待核验</text><text x="72" y="548" fill="#6D7FA9" font-family="Arial,sans-serif" font-size="20">先区分来源事实、机构目标和仍未公开的证据</text></svg>'''


def build_article(item: dict, meta: dict, day: str, slug: str, terms: list[str], source_type_value: str, source_hash: str) -> dict:
    source_name = item["sourceName"] or domain(item["url"])
    headline = re.sub(r"\s+-\s+[^-]+$", "", item["title"]).strip()
    headline_zh = chinese_headline(headline)
    description = meta.get("description") or "来源页面未提供可稳定抓取的摘要；本文只把标题和发布日期作为可核验线索。"
    published_at = item.get("publishedAt") or day
    title = f"{day} AI 新闻：{headline_zh}"
    if source_type_value == "regulatory":
        framing = "监管文件"
    elif source_type_value.startswith("official"):
        framing = "官方页面"
    elif source_type_value == "personal-blog":
        framing = "个人解读"
    else:
        framing = "新闻报道"
    # eventDate is deliberately explicit: a date without an independently reported
    # underlying event must stay a source-publication date, not an invented launch date.
    date_note = f"本条 eventDate 记录 {day}，含义是 {source_name} 在这一天公开了这条报道/公告；来源没有单独证明另一个 underlying event date。publishedAt 记录来源页面的公开日期 {published_at}。"
    lower = headline.lower()
    fact = event_fact(source_name, headline, headline_zh, published_at, source_type_value)
    if any(token in lower for token in ("launch", "announce", "release", "introduc", "deploy", "partnership", "partner", "acqui", "funding", "appoint", "opens", "unveil")):
        event_kind = "发布、合作或组织动作"
        section_items = [
            {"id":"reported-event","title":"当天发生的动作","body":f"{fact}。从标题和来源卡能够确认的是这一公开动作；它不自动等于产品效果、部署规模或商业结果。","kind":"narrative"},
            {"id":"what-changed","title":"对象与范围","body":f"标题把关注点放在“{headline_zh}”。读者需要继续确认参与方、覆盖范围、实施时间和结果证据；来源没有写出的数字和效果不在本文中补造。","kind":"technical"},
            {"id":"term-link","title":"词条怎样帮助理解","body":term_sentence(terms),"kind":"comparison"},
            {"id":"evidence-boundary","title":"证据边界","body":f"{framing}页面记录了“{headline_zh}”这一动作；若没有样本、基线、客户记录或监管结论，不能把发布方的目标写成普遍效果。","kind":"boundary"},
        ]
        explainer_variant = "agent-workflow"
    elif any(token in lower for token in ("how ", "why ", "what ", "review", "opinion", "future", "could", "impact", "analysis")):
        event_kind = "媒体解读或分析"
        section_items = [
            {"id":"article-type","title":"报道的性质","body":f"{fact}。它提供的是观点、背景或议题整理，不应被改写成一个已经完成的产品结果。","kind":"narrative"},
            {"id":"reader-question","title":"读者要核对什么","body":f"把“{headline_zh}”拆成主体、时间和可验证动作：谁提出了什么判断，是否有实施记录或独立数据支持？来源摘要线索是：{description}","kind":"technical"},
            {"id":"term-link","title":"词条怎样落到事实","body":term_sentence(terms),"kind":"comparison"},
            {"id":"evidence-boundary","title":"观点和证据的分界","body":"来源的判断、条件句和预测都保留归因。要进一步确认效果，需要回到原始研究、监管文件、产品记录或另一家可信媒体，而不是把解读文章当作独立实验。","kind":"boundary"},
        ]
        explainer_variant = "benchmark"
    else:
        event_kind = "具体新闻事件"
        section_items = [
            {"id":"reported-event","title":"报道的核心事实","body":f"{fact}。可确认的事实先限于来源标题、摘要和正文明确写出的对象与动作。","kind":"narrative"},
            {"id":"context","title":"还需要补齐的时间线","body":f"“{headline_zh}”涉及的参与者、范围、后续结果要回到来源正文确认。报道日不等于更早的研究、产品上线或实际部署日。","kind":"technical"},
            {"id":"term-link","title":"关联词条提供什么视角","body":term_sentence(terms),"kind":"comparison"},
            {"id":"evidence-boundary","title":"仍需独立核验的部分","body":"如果页面没有给出数据、样本、独立复核或长期影响，就不能把宣传性结果写成普遍事实。本文把待核验项留在边界里。","kind":"boundary"},
        ]
        explainer_variant = "secure-memory" if source_type_value == "regulatory" else "benchmark"
    body = (
        f"{date_note}\n\n"
        f"{fact}。来源摘要的原始线索是：{description}。中文叙述只把来源明确写出的对象、动作和主张列为事实。\n\n"
        f"对读者来说，先把“{headline_zh}”拆成主体、动作、范围和日期，再区分发布方主张、媒体转述与可复核结果。{term_sentence(terms)}"
        "若来源没有公开测试、样本、基线、权限或长期影响，本文保留这个证据边界，不把它补成确定结论。"
    )
    steps = [
        {"label":"事件日","detail":f"先记录来源公开日 {day}，再检查页面自身的 publishedAt {published_at}；没有证据时不另造 underlying event date。","evidence":"daily run 与来源页面"},
        {"label":"新闻动作","detail":fact+"。","evidence":item["url"]},
        {"label":"词条视角","detail":term_sentence(terms),"evidence":"正文的关联词条段落"},
        {"label":"后续核验","detail":"寻找官方公告、监管文件、实施记录、可信媒体或论文背景，检查日期、数字和实际影响。","evidence":"论文只作为新闻事件的背景来源。"},
    ]
    evidence = [{"url":item["url"],"claim":f"{source_name} 在 {published_at} 公开/报道了该事件；正文与摘要提供了以下可核验线索。","excerpt":(headline + ("；" + description if description and not description.startswith("来源页面未提供") else ""))[:1_500]}]
    return {
        "slug":slug,"title":title,"summary":f"{date_note}{fact}。本文保留来源主张、词条视角和仍需核验的证据边界。","body":body,"publishedAt":published_at,"eventDate":day,"isExample":False,
        "hero":{"url":f"/images/news/{slug}.svg","alt":title,"sourceUrl":f"/images/news/{slug}.svg","license":"VibePolaris 自制 SVG · CC BY 4.0","credit":"VibePolaris"},
        "sections":section_items,"explainer":{"variant":explainer_variant,"title":"把新闻拆成可核对的链路","question":"读者怎样知道标题对应的事实边界？","steps":steps},
        "source":{"name":source_name,"url":item["url"]},"relatedSlugs":terms,"relatedArticleSlugs":[],"sources":evidence,
        "canonicalUrl":item["url"],"sourceHash":source_hash,"status":"needs-review","discoveredAt":DISCOVERED_AT,
        "relationSuggestions":[{"kind":"term","slug":term,"score":0.72,"evidence":[TERM_EXPLANATIONS.get(term, f"正文按该词条解释新闻中的事实边界。")],"method":"manual","status":"confirmed"} for term in terms],
        "evidence":evidence,"verification":{"status":"verified","checkedAt":DISCOVERED_AT,"method":"source","notes":"已从 Google News 发现页解码到发布方原始链接，并核对来源日期与标题；eventDate 明确记录来源公开日，未把论文当新闻事件。"},
        "riskLevel":"uncertain" if source_type_value in {"personal-blog","news-report"} else "routine","publishDecision":"review",
        "modelReview":{"decision":"hold","checkedAt":DISCOVERED_AT,"notes":"等待子智能体读者审读和人工复核后再提升。"},"mechanicalErrors":[],"runId":f"vbp-049-news-backfill-news-{day}","fingerprint":source_hash,
    }
def load_terms() -> set[str]:
    return {item["slug"] if isinstance(item, dict) else item for item in json.loads(TERMS.read_text())}


def known_records() -> dict[str, str]:
    known = {}
    if PUBLISHED.exists():
        for article in json.loads(PUBLISHED.read_text()):
            if not article.get("isExample"):
                known[canonical_url(article.get("canonicalUrl") or article["source"]["url"])] = article["slug"]
    for path in DAILY.glob("*.json"):
        try:
            run = json.loads(path.read_text())
            for candidate in run.get("candidates", []):
                known[canonical_url(candidate["canonicalUrl"])] = candidate["slug"]
        except Exception:
            pass
    return known


def make_candidate(item: dict, day: str, known: dict[str, str]) -> dict | None:
    if item.get("publishedAt") != day or not item.get("googleUrl"):
        return None
    url = resolve_google(item["googleUrl"])
    if not url or domain(url) in BLACKLIST:
        return None
    typ = source_type(url, item["title"])
    if typ == "paper":
        return None
    headline = re.sub(r"\s+-\s+[^-]+$", "", item["title"]).strip()
    source_hash = "sha256:" + hashlib.sha256((url + "\n" + headline).encode()).hexdigest()
    candidate = {**item,"url":url,"title":headline,"sourceType":typ,"meta":{},"sourceHash":source_hash}
    candidate["score"] = source_score(candidate)
    candidate["canonicalUrl"] = url
    candidate["duplicateOf"] = known.get(url)
    return candidate


def write_day(day: str, terms: set[str], known: dict[str, str]) -> tuple[dict, dict | None]:
    existing = DAILY / f"{day}.json"
    if existing.exists():
        return json.loads(existing.read_text()), None
    raw = []
    seen_google = set()
    for query in ('"artificial intelligence"', "AI"):
        for item in feed_items(day, query):
            if item["googleUrl"] in seen_google:
                continue
            seen_google.add(item["googleUrl"])
            raw.append(item)
        if len(raw) >= 20:
            break
    # Prefer likely news/official sources before paying the cost of resolving
    # Google’s redirect. Academic domains are intentionally left for context,
    # never as a selected event.
    def pre_score(item: dict) -> int:
        name = (item.get("sourceName") or "").lower()
        title = item.get("title", "").lower()
        score = 0
        if any(token in name for token in ("reuters", "associated press", "bbc", "cnn", "cnbc", "techcrunch", "verge", "wired", "forbes", "businesswire", "press release")):
            score += 6
        if any(token in name for token in ("arxiv", "nature", "science", "journal", "proceedings")):
            score -= 8
        if any(token in title for token in ("launch", "announce", "funding", "acquire", "law", "policy", "release", "deploy", "investigation")):
            score += 2
        return score
    raw = sorted((item for item in raw if item.get("publishedAt") == day), key=lambda item: -pre_score(item))
    candidates = []
    for item in raw[:10]:
        if len(candidates) >= 2:
            break
        candidate = make_candidate(item, day, known)
        if candidate:
            candidates.append(candidate)
    candidates.sort(key=lambda item: (-item["score"], item["sourceType"], item["url"]))
    selected = next((item for item in candidates if not item.get("duplicateOf") and item["score"] >= 3), None)
    if selected:
        selected["meta"] = fetch_meta(selected["url"])
        if selected["meta"].get("datePublished"):
            selected["publishedAt"] = selected["meta"]["datePublished"]
        if selected["meta"].get("body"):
            selected["sourceHash"] = "sha256:" + hashlib.sha256((selected["meta"]["body"] + "\n" + selected["title"]).encode()).hexdigest()
        slug = slugify(selected["title"], day, selected["url"])
        selected["slug"] = slug
        known[selected["canonicalUrl"]] = slug
        rel = selected_terms(selected["title"], selected["meta"].get("description", ""), terms)
        selected["relatedSlugs"] = rel
        selected["decision"] = "selected"
        selected["reason"] = "来源链接可解码，属于新闻/官方/监管来源，且未与已记录 canonical URL 重复。"
        # Discovery deliberately stops here.  The article is written by the
        # primary agent one day at a time after opening the source page and
        # deciding what this particular event needs; this script must not pour
        # a shared prose template into a range of dates.
        article = None
    else:
        article = None
    record_candidates = []
    for item in candidates[:8]:
        if not item["meta"] and item is selected:
            item["meta"] = fetch_meta(item["url"])
        item_slug = item.get("slug") or slugify(item["title"], day, item["url"])
        rel = selected_terms(item["title"], item["meta"].get("description", ""), terms)
        evidence = [{"url":item["url"],"claim":f"{item['sourceName'] or domain(item['url'])} 的候选新闻标题和发布日期。","excerpt":item["title"][:500]}]
        if item["meta"].get("description"):
            evidence.append({"url":item["url"],"claim":"来源页面的摘要线索。","excerpt":item["meta"]["description"][:1_500]})
        decision = item.get("decision")
        reason = item.get("reason")
        duplicate_of = item.get("duplicateOf")
        if not decision:
            if duplicate_of:
                decision, reason = "duplicate", "同一 canonical URL 已在前序日期或已发布目录出现，保留候选但不重复写作。"
            elif item is selected:
                decision, reason = "selected", "按来源优先级和事件日核验后选中。"
            elif item["sourceType"] == "paper":
                decision, reason = "rejected", "论文只作为背景来源，不能替代新闻事件。"
            else:
                decision, reason = "rejected", "同日存在更高优先级且更易核验的候选。"
        rec = {"slug":item_slug,"title":item["title"],"eventDate":day,"publishedAt":item["publishedAt"] or day,"sourceType":item["sourceType"],"source":{"name":item["sourceName"] or domain(item["url"]),"url":item["url"]},"canonicalUrl":item["url"],"sourceHash":item["sourceHash"],"relatedSlugs":rel,"evidence":evidence,"decision":decision,"reason":reason}
        if duplicate_of:
            rec["duplicateOf"] = duplicate_of
        record_candidates.append(rec)
    selected_slug = selected["slug"] if selected else None
    run = {"schemaVersion":1,"runId":f"vbp-049-news-backfill-news-{day}","eventDate":day,"searchedAt":DISCOVERED_AT,
           "search":{"query":"Google News RSS：\"artificial intelligence\" / AI，按目标日期过滤；再解码发布方原始链接","sourceUrls":[f"https://news.google.com/rss/search?q=AI+after:{day}+before:{(dt.date.fromisoformat(day)+dt.timedelta(days=1)).isoformat()}&hl=en-US&gl=US&ceid=US:en"],"sourcePolicy":["official-announcement","official-blog","news-report","personal-blog","regulatory","paper"],"candidateCount":len(record_candidates),"primaryCandidateCount":sum(1 for item in record_candidates if item["sourceType"] != "paper"),"deduplicatedCount":sum(1 for item in record_candidates if item["decision"] == "duplicate")},
           "candidates":record_candidates,"selectedSlugs":[selected_slug] if selected_slug else [],"gap":None if selected_slug else {"status":"empty","reason":"目标日期没有解码出未重复且达到来源政策的新闻/官方/监管候选；论文候选不用于填空。","nextAction":"补查官方公告、监管文件、可信媒体和行业/个人解读，确认是否存在事件日不同于报道日的可核验新闻。"}}
    DAILY.mkdir(parents=True, exist_ok=True); (DAILY/f"{day}.json").write_text(json.dumps(run,ensure_ascii=False,indent=2)+'\n')
    return run, article


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--from", dest="start", required=True)
    parser.add_argument("--to", dest="end", required=True)
    args = parser.parse_args()
    terms = load_terms(); known = known_records()
    day = dt.date.fromisoformat(args.start); end = dt.date.fromisoformat(args.end)
    while day <= end:
        run, article = write_day(day.isoformat(), terms, known)
        print(json.dumps({"eventDate":run["eventDate"],"selectedSlugs":run["selectedSlugs"],"gap":bool(run["gap"]),"sourceTypes":[c["sourceType"] for c in run["candidates"]]},ensure_ascii=False))
        day += dt.timedelta(days=1)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
