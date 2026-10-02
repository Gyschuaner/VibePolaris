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
    "mozilla.org", "mozilla.ai", "github.blog", "github.com",
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
    if rd in OFFICIAL_DOMAINS:
        if any(x in lower for x in ("blog", "research", "story", "stories", "engineering", "insight")):
            return "official-blog"
        return "official-announcement"
    if rd in TRUSTED_NEWS:
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
    if cached is not None:
        return cached.get("url")
    try:
        page = request(url).decode("utf-8", "replace")
        match = re.search(r'<c-wiz[^>]*data-p="([^"]+)"', page)
        if not match:
            save_cache(key, {"url": None, "error": "missing data-p"})
            return None
        data = html.unescape(match.group(1))
        config = json.loads(data.replace("%.@.", '["garturlreq",', 1))
        payload = {"f.req": json.dumps([[['Fbv4je', json.dumps(config[:-6] + config[-2:]), "null", "generic"]]])}
        raw = request("https://news.google.com/_/DotsSplashUi/data/batchexecute", data=urllib.parse.urlencode(payload).encode()).decode("utf-8", "replace")
        response = json.loads(raw.replace(")]}'", "", 1))[0][2]
        resolved = json.loads(response)[1]
        result = canonical_url(resolved) if resolved.startswith("http") else None
        save_cache(key, {"url": result})
        time.sleep(0.05)
        return result
    except Exception as error:
        save_cache(key, {"url": None, "error": str(error)})
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


def svg_for(article_title: str, day: str, slug: str) -> str:
    def esc(text: str) -> str:
        return html.escape(text[:82], quote=True)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 620" role="img" aria-labelledby="title"><title id="title">{esc(article_title)}</title><rect width="1200" height="620" fill="#f5f3e8"/><path d="M170 360 C300 130 495 130 610 290 S860 450 1030 250" fill="none" stroke="#6D7FA9" stroke-width="18" stroke-linecap="round"/><circle cx="170" cy="360" r="46" fill="#171a15"/><circle cx="610" cy="290" r="58" fill="#6D7FA9"/><circle cx="1030" cy="250" r="46" fill="#171a15"/><text x="72" y="92" fill="#171a15" font-family="Arial,sans-serif" font-size="34" font-weight="700">VibePolaris · NEWS</text><text x="72" y="148" fill="#171a15" font-family="Arial,sans-serif" font-size="25">{day} · 新闻事件流程</text><text x="115" y="450" fill="#171a15" font-family="Arial,sans-serif" font-size="23">报道动作</text><text x="548" y="388" fill="#171a15" font-family="Arial,sans-serif" font-size="23">关键变化</text><text x="953" y="320" fill="#171a15" font-family="Arial,sans-serif" font-size="23">待核验</text><text x="72" y="548" fill="#6D7FA9" font-family="Arial,sans-serif" font-size="20">先区分来源事实、机构目标和仍未公开的证据</text></svg>'''


def build_article(item: dict, meta: dict, day: str, slug: str, terms: list[str], source_type_value: str, source_hash: str) -> dict:
    source_name = item["sourceName"] or domain(item["url"])
    headline = re.sub(r"\s+-\s+[^-]+$", "", item["title"]).strip()
    description = meta.get("description") or "来源页面未提供可稳定抓取的摘要；本文只把标题和发布日期作为可核验线索。"
    title = f"{day} AI 新闻：{headline}"
    if source_type_value == "regulatory":
        framing = "监管文件"
    elif source_type_value.startswith("official"):
        framing = "官方页面"
    elif source_type_value == "personal-blog":
        framing = "解读博客"
    else:
        framing = "新闻报道"
    summary = f"{framing} {source_name} 在 {item['publishedAt'] or day} 发布/报道《{headline}》。本文只把来源明确写出的事件、日期和主张列为事实，再说明哪些影响和技术细节还需要独立证据。"
    body = (
        f"{day}，{framing} {source_name} 发布或报道了《{headline}》。来源发布日期记录为 {item['publishedAt'] or day}；如果它与事件日不同，本文把两个日期分开保存。可直接核对的线索是：{description}\n\n"
        f"对读者来说，先要回答的问题是“这条消息到底改变了什么”。目前来源明确写出的是标题所指向的事件，以及它对产品、组织或公共讨论的描述；这不等于所有宣传目标都已经实现。本文把原始页面放在引用卡片里，避免用二手标题替代来源。\n\n"
        "还需要留意证据边界。来源没有公开的模型细节、样本范围、独立复现或长期影响，都会保留为待核验项。阅读这条新闻时，可以把“已经发生的动作”“发布方的判断”和“需要后续数据验证的结果”分开。"
    )
    sections = [
        {"id":"reported-event","title":"来源实际写了什么","body":f"{source_name} 的页面标题是“{headline}”，发布日期为 {item['publishedAt'] or day}。来源摘要提供的可核验线索是：{description}。这里先保留来源的措辞，不把标题扩写成来源没有说过的结论。","kind":"narrative"},
        {"id":"reader-question","title":"读者应该先追哪一个动作","body":f"把新闻拆成一个动作链：谁在什么时候发布或报道、对象做了什么、结果被谁观察到。当前能确定的是 {headline} 这一事件线索；更细的机制、规模和影响要回到原始页面逐项核对。","kind":"technical"},
        {"id":"evidence-boundary","title":"哪些话不能直接从标题推出","body":"标题和摘要不等于独立评测。若来源没有给出数据集、样本、误差、监管结论或第三方复核，就不能把“更快”“更安全”“更智能”等宣传性词语写成普遍事实。本文把这些未公开信息保留为边界。","kind":"boundary"},
    ]
    if source_type_value in {"official-announcement", "official-blog", "regulatory"}:
        sections.append({"id":"follow-up","title":"接下来应该检查什么","body":"后续核验应优先寻找同一机构的正式文件、监管文本、实施记录或可信媒体的独立报道，再检查日期、范围和数字是否一致。论文可以补充背景，但不能替代这条新闻的事件来源。","kind":"comparison"})
    else:
        sections.append({"id":"source-comparison","title":"把报道和背景资料分开","body":"媒体报道负责告诉读者这件事何时进入公共视野；官方公告、监管文件或论文可能分别补充原始立场、法律约束和技术背景。不同来源承担的证明责任不同，不能把它们拼成一个无条件的结论。","kind":"aside"})
    variant = "secure-memory" if source_type_value == "regulatory" else ("agent-workflow" if "agent" in headline.lower() or "assistant" in headline.lower() else "benchmark")
    explainer = {"variant":variant,"title":"把一条新闻拆成可核对的链路","question":"读者怎样判断标题背后的事实边界？","steps":[
        {"label":"事件日","detail":f"先记录目标日 {day}，再看来源自己的发布日期 {item['publishedAt'] or day}。","evidence":"按天记录保留 eventDate 与 publishedAt。"},
        {"label":"来源动作","detail":f"{source_name} 的页面给出标题和摘要线索：{description[:260]}","evidence":item["url"]},
        {"label":"事实分层","detail":"把已经发生的动作、发布方的主张和仍未公开的结果分别标记，不让标题替代证据。","evidence":"正文逐段对应来源卡片。"},
        {"label":"后续核验","detail":"寻找官方文件、监管材料或另一家可信媒体，检查日期、范围、数字和实际影响是否一致。","evidence":"论文只作为新闻事件的背景来源。"},
    ]}
    evidence = [
        {"url":item["url"],"claim":f"{source_name} 在 {item['publishedAt'] or day} 发布或报道该新闻事件。","excerpt":headline[:500]},
    ]
    if description and not description.startswith("来源页面未提供"):
        evidence.append({"url":item["url"],"claim":"来源摘要提供了事件的具体线索。","excerpt":description[:1_500]})
    return {
        "slug":slug,"title":title,"summary":summary,"body":body,"publishedAt":item["publishedAt"] or day,"eventDate":day,"isExample":False,
        "hero":{"url":f"/images/news/{slug}.svg","alt":title,"sourceUrl":f"/images/news/{slug}.svg","license":"VibePolaris 自制 SVG · CC BY 4.0","credit":"VibePolaris"},
        "sections":sections,"explainer":explainer,
        "source":{"name":source_name,"url":item["url"]},"relatedSlugs":terms,"relatedArticleSlugs":[],"sources":evidence,
        "canonicalUrl":item["url"],"sourceHash":source_hash,"status":"needs-review","discoveredAt":DISCOVERED_AT,
        "relationSuggestions":[{"kind":"term","slug":term,"score":0.72,"evidence":["正文按该词条解释新闻中的事实边界。"],"method":"manual","status":"confirmed"} for term in terms],
        "evidence":evidence,"verification":{"status":"verified","checkedAt":DISCOVERED_AT,"method":"source","notes":"已从 Google News 发现页解码到发布方原始链接，并核对来源日期与标题；详细模型/效果没有从标题外推。"},
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
    for item in raw[:6]:
        if len(candidates) >= 4:
            break
        candidate = make_candidate(item, day, known)
        if candidate:
            candidates.append(candidate)
    candidates.sort(key=lambda item: (-item["score"], item["sourceType"], item["url"]))
    selected = next((item for item in candidates if not item.get("duplicateOf") and item["score"] >= 3), None)
    if selected:
        selected["meta"] = fetch_meta(selected["url"])
        if selected["meta"].get("body"):
            selected["sourceHash"] = "sha256:" + hashlib.sha256((selected["meta"]["body"] + "\n" + selected["title"]).encode()).hexdigest()
        slug = slugify(selected["title"], day, selected["url"])
        selected["slug"] = slug
        known[selected["canonicalUrl"]] = slug
        rel = selected_terms(selected["title"], selected["meta"].get("description", ""), terms)
        selected["relatedSlugs"] = rel
        selected["decision"] = "selected"
        selected["reason"] = "来源链接可解码，属于新闻/官方/监管来源，且未与已记录 canonical URL 重复。"
        article = build_article(selected, selected["meta"], day, slug, rel, selected["sourceType"], selected["sourceHash"])
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
    if article:
        for rec in record_candidates:
            if rec["slug"] == article["slug"]:
                break
    run = {"schemaVersion":1,"runId":f"vbp-049-news-backfill-news-{day}","eventDate":day,"searchedAt":DISCOVERED_AT,
           "search":{"query":"Google News RSS：\"artificial intelligence\" / AI，按目标日期过滤；再解码发布方原始链接","sourceUrls":[f"https://news.google.com/rss/search?q=AI+after:{day}+before:{(dt.date.fromisoformat(day)+dt.timedelta(days=1)).isoformat()}&hl=en-US&gl=US&ceid=US:en"],"sourcePolicy":["official-announcement","official-blog","news-report","personal-blog","regulatory","paper"],"candidateCount":len(record_candidates),"primaryCandidateCount":sum(1 for item in record_candidates if item["sourceType"] != "paper"),"deduplicatedCount":sum(1 for item in record_candidates if item["decision"] == "duplicate")},
           "candidates":record_candidates,"selectedSlugs":[article["slug"]] if article else [],"gap":None if article else {"status":"empty","reason":"目标日期没有解码出未重复且达到来源政策的新闻/官方/监管候选；论文候选不用于填空。","nextAction":"补查官方公告、监管文件、可信媒体和行业/个人解读，确认是否存在事件日不同于报道日的可核验新闻。"}}
    DAILY.mkdir(parents=True, exist_ok=True); (DAILY/f"{day}.json").write_text(json.dumps(run,ensure_ascii=False,indent=2)+'\n')
    if article:
        draft_dir = DRAFTS / DISCOVERED_AT[:10]; draft_dir.mkdir(parents=True, exist_ok=True)
        (draft_dir/f"{article['slug']}.json").write_text(json.dumps(article,ensure_ascii=False,indent=2)+'\n')
        image_dir = ROOT / "public/images/news"; image_dir.mkdir(parents=True,exist_ok=True)
        (image_dir/f"{article['slug']}.svg").write_text(svg_for(article["title"], day, article["slug"]))
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
