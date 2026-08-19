"""Command-line interface for the Fortune U Group Master AI Agent.

Examples
--------
python -m fug.cli status
python -m fug.cli ingest --name "Ravi" --phone 9490237465 --goal "Health insurance"
python -m fug.cli report daily
python -m fug.cli followups
python -m fug.cli content --platform youtube --topic "Term insurance basics"
python -m fug.cli seo
python -m fug.cli serve --port 8080
"""
from __future__ import annotations

import argparse
import json
import sys

from . import constants
from .config import get_settings
from .orchestrator import Orchestrator


def build_parser():
    p = argparse.ArgumentParser(prog="fug", description="Fortune U Group Master AI Agent CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("status", help="Show system status and BLOCKED integrations")

    ing = sub.add_parser("ingest", help="Capture a website lead")
    ing.add_argument("--name", required=True)
    ing.add_argument("--phone", required=True)
    ing.add_argument("--email", default="")
    ing.add_argument("--city", default="")
    ing.add_argument("--goal", default="Other")
    ing.add_argument("--message", default="")
    ing.add_argument("--source", default="WEBSITE_CONTACT")

    rpt = sub.add_parser("report", help="Daily/weekly report")
    rpt.add_argument("kind", nargs="?", default="daily", choices=["daily", "weekly"])

    sub.add_parser("followups", help="Process due follow-ups")

    con = sub.add_parser("content", help="Generate a content package")
    con.add_argument("--platform", default="website")
    con.add_argument("--topic", required=True)

    sub.add_parser("seo", help="Run a read-only SEO audit")

    sub.add_parser("inbound", help="Simulate an inbound WhatsApp message")
    # not fully wired; see --help of events

    sv = sub.add_parser("serve", help="Run the intake webhook server")
    sv.add_argument("--host", default="0.0.0.0")
    sv.add_argument("--port", type=int, default=None)
    return p


def _out(obj):
    print(json.dumps(obj, indent=2, default=str))


def main(argv=None):
    args = build_parser().parse_args(argv)
    settings = get_settings()
    orch = Orchestrator(settings)

    if args.cmd == "status":
        _out(orch.status_report())
    elif args.cmd == "ingest":
        result = orch.route({
            "type": "LEAD_CAPTURED",
            "payload": {
                "name": args.name, "mobile": args.phone, "email": args.email,
                "city": args.city, "goal": args.goal, "message": args.message,
                "source": args.source,
            },
        })
        _out(result)
    elif args.cmd == "report":
        _out(orch.route({"type": "REPORT_REQUEST", "payload": {"kind": args.kind}}))
    elif args.cmd == "followups":
        _out(orch.route({"type": "FOLLOWUP_DUE", "payload": {}}))
    elif args.cmd == "content":
        _out(orch.route({"type": "CONTENT_REQUEST", "payload": {"platform": args.platform, "topic": args.topic}}))
    elif args.cmd == "seo":
        _out(orch.route({"type": "SCHEDULED_TASK", "payload": {"task": "seo"}}))
    elif args.cmd == "serve":
        from .webhook import run_server
        port = args.port or settings.intake_port
        run_server(host=args.host, port=port, orchestrator=orch)
    return 0


if __name__ == "__main__":
    sys.exit(main())
