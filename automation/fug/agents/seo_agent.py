"""SEO AGENT.

Performs a read-only audit of the website's static HTML files. Checks page
titles, meta descriptions, H1/H2 structure, internal links, sitemap,
robots.txt and schema markup.

IMPORTANT: this agent only *reports* and *recommends*. It never applies
high-impact SEO changes without approval.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, List

from ..secrets import redact

_H1 = re.compile(r"<h1[^>]*>(.*?)</h1>", re.S | re.I)
_H2 = re.compile(r"<h2[^>]*>(.*?)</h2>", re.S | re.I)
_TITLE = re.compile(r"<title[^>]*>(.*?)</title>", re.S | re.I)
_DESC = re.compile(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', re.S | re.I)
_LINKS = re.compile(r'<a[^>]+href=["\']([^"\'#]+)["\']', re.I)
_SCHEMA = re.compile(r'application/ld\+json', re.I)


class SEOAuditIssue:
    __slots__ = ("page", "check", "severity", "recommendation", "status")

    def __init__(self, page, check, severity, recommendation, status="OPEN"):
        self.page = page
        self.check = check
        self.severity = severity
        self.recommendation = recommendation
        self.status = status

    def to_dict(self) -> dict:
        return {
            "page": self.page,
            "check": self.check,
            "severity": self.severity,
            "recommendation": self.recommendation,
            "status": self.status,
        }


class SEOAgent:
    def __init__(self, crm, observability, site_root: str):
        self.crm = crm
        self.obs = observability
        self.site_root = Path(site_root)

    def _html_files(self) -> List[Path]:
        return sorted(p for p in self.site_root.glob("*.html"))

    def audit(self, execution_id: str = "") -> Dict[str, object]:
        issues: List[SEOAuditIssue] = []
        pages = self._html_files()
        for path in pages:
            html = path.read_text(encoding="utf-8")
            name = path.name
            title = _TITLE.search(html)
            if not title or not title.group(1).strip():
                issues.append(SEOAuditIssue(name, "page_title", "HIGH", "Add a unique <title> tag"))
            elif len(title.group(1).strip()) > 60:
                issues.append(SEOAuditIssue(name, "page_title_length", "LOW",
                                            "Shorten title to under ~60 characters"))
            desc = _DESC.search(html)
            if not desc or not desc.group(1).strip():
                issues.append(SEOAuditIssue(name, "meta_description", "HIGH",
                                            "Add a unique meta description"))
            elif not (50 <= len(desc.group(1).strip()) <= 160):
                issues.append(SEOAuditIssue(name, "meta_desc_length", "LOW",
                                            "Meta description should be ~50-160 chars"))
            h1 = _H1.findall(html)
            if len(h1) != 1:
                issues.append(SEOAuditIssue(name, "h1_structure", "MEDIUM",
                                            "Each page should have exactly one H1"))
            h2 = _H2.findall(html)
            if not h2:
                issues.append(SEOAuditIssue(name, "h2_structure", "LOW",
                                            "Add H2 headings to structure content"))
            if not _SCHEMA.search(html):
                issues.append(SEOAuditIssue(name, "schema_markup", "MEDIUM",
                                            "Add JSON-LD schema (e.g. FinancialService)"))

        sitemap = self.site_root / "sitemap.xml"
        robots = self.site_root / "robots.txt"
        if not sitemap.exists():
            issues.append(SEOAuditIssue("sitemap.xml", "sitemap", "MEDIUM",
                                        "Create sitemap.xml listing all public pages"))
        if not robots.exists():
            issues.append(SEOAuditIssue("robots.txt", "robots", "MEDIUM",
                                        "Create robots.txt allowing crawlers and referencing sitemap"))

        internal_links = self._broken_internal_links(pages)
        for page, target in internal_links:
            issues.append(SEOAuditIssue(page, "broken_internal_link", "HIGH",
                                        f"Broken internal link -> {target}"))

        audit_id = self.crm.add_row(
            "Tasks", f"seo-{execution_id or 'audit'}", {
                "audit_id": f"seo-{execution_id or 'audit'}",
                "pages_audited": len(pages),
                "open_issues": len(issues),
                "severity_counts": {"HIGH": 0, "MEDIUM": 0, "LOW": 0},
            }
        )
        audit = {
            "audit_id": f"seo-{execution_id or 'audit'}",
            "pages_audited": len(pages),
            "issues": [i.to_dict() for i in issues],
        }
        self.obs.log_event(
            "WF-11 SEO Audit", "SEO_AUDIT", execution_id, "COMPLETE",
            result={"issues": len(issues)},
        )
        return audit

    def _broken_internal_links(self, pages: List[Path]) -> List[tuple]:
        """Find internal hrefs that point to a missing local file."""
        names = {p.name for p in pages}
        broken = []
        for path in pages:
            html = path.read_text(encoding="utf-8")
            for href in _LINKS.findall(html):
                if href.startswith(("http", "mailto:", "tel:", "//", "?")):
                    continue
                target = href.split("?")[0].split("#")[0].lstrip("/")
                if target == "" or target.endswith("/"):
                    continue
                base = target.split("/")[-1]
                if not base or base == "index.html":
                    continue
                if not (self.site_root / base).exists() and base not in names:
                    broken.append((path.name, href))
        return broken
