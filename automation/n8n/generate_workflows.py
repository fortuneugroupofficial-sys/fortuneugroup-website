#!/usr/bin/env python3
"""Generate importable n8n workflow JSON for the Fortune U Group system.

Output is written to ``../workflows/n8n/``. Each workflow is a small chain that
calls the FUG automation webhook/API. Credentials are never embedded — nodes
reference n8n *credential* entries you create in the n8n UI (e.g. the FUG
intake secret, WhatsApp OAuth, Meta, YouTube, Gemini) via placeholders.

Run:  python3 generate_workflows.py
"""
from __future__ import annotations

import json
import uuid
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "workflows" / "n8n"
OUT.mkdir(parents=True, exist_ok=True)


def nid(*parts: str) -> str:
    """Deterministic node id so regeneration is idempotent (stable diffs)."""
    key = ":".join(parts)
    return uuid.uuid5(uuid.NAMESPACE_DNS, key).hex[:24]


def webhook_node(name, path, http_method="POST"):
    return {
        "parameters": {"httpMethod": http_method, "path": path, "responseMode": "onReceived"},
        "id": nid(name),
        "name": name,
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2,
        "position": [0, 0],
    }


def schedule_node(name, rule):
    return {
        "parameters": {"rule": rule},
        "id": nid(name),
        "name": name,
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.2,
        "position": [0, 0],
    }


def manual_node(name="When clicking 'Execute'"):
    return {
        "parameters": {},
        "id": nid(name),
        "name": name,
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [0, 0],
    }


def http_request_node(name, url, method="POST", send_body=True, json_body=None, auth=None):
    body = json_body or {
        "type": "{{ $json.eventType }}",
        "payload": "={{ $json.payload }}",
    }
    params = {
        "method": method,
        "url": url,
        "sendBody": send_body,
        "specifyBody": "json",
        "jsonBody": json.dumps(body),
        "options": {},
    }
    if auth:
        params["authentication"] = "genericCredentialType"
        params["genericAuthType"] = auth
    return {
        "parameters": params,
        "id": nid(name),
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [0, 0],
    }


def if_node(name, condition_json):
    return {
        "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose"}, "conditions": [condition_json]}},
        "id": nid(name),
        "name": name,
        "type": "n8n-nodes-base.if",
        "typeVersion": 2.2,
        "position": [0, 0],
    }


def log_node(name):
    return {
        "parameters": {"content": "Workflow '{{ $workflow.name }}' executed.\nEvent: {{ $json.eventType }}\nStatus: {{ $json.status }}"},
        "id": nid(name),
        "name": name,
        "type": "n8n-nodes-base.noOp",
        "typeVersion": 1,
        "position": [0, 0],
    }


def build(name, active, nodes, connections, settings=None):
    return {
        "name": name,
        "nodes": nodes,
        "connections": connections,
        "settings": settings or {"executionOrder": "v1"},
        "active": active,
        "versionId": uuid.uuid5(uuid.NAMESPACE_DNS, "wf:" + name).hex,
        "pinData": {},
    }


FUG_URL = "https://{{your-domain}}/webhook/lead"  # replace with the FUG intake URL


# ---------------------------------------------------------------------------
# WF definitions
# ---------------------------------------------------------------------------
def wf01_lead_intake():
    nodes = [
        webhook_node("Website Lead", "book-consultation"),
        http_request_node("Send to FUG CRM", FUG_URL,
                          json_body={"type": "LEAD_CAPTURED", "payload": "={{ $json.body }}"}),
        if_node("Valid?", [{"leftValue": "={{ $json.status }}", "rightValue": "ok", "operator": {"type": "string", "operation": "equals"}}]),
        log_node("Log"),
    ]
    connections = {
        "Website Lead": {"main": [[{"node": "Send to FUG CRM", "type": "main", "index": 0}]]},
        "Send to FUG CRM": {"main": [[{"node": "Valid?", "type": "main", "index": 0}]]},
        "Valid?": {"main": [[{"node": "Log", "type": "main", "index": 0}], []]},
    }
    return build("WF-01 Website Lead Intake", True, nodes, connections)


def wf02_lead_validation():
    nodes = [
        manual_node(),
        if_node("Phone present & 12 digits", [{"leftValue": "={{ $json.phone.length }}", "rightValue": 12, "operator": {"type": "number", "operation": "equals"}}]),
        http_request_node("Send validated lead to FUG", FUG_URL,
                          json_body={"type": "LEAD_CAPTURED", "payload": "={{ $json }}"}),
        log_node("Valid lead forwarded"),
        log_node("Invalid lead rejected"),
    ]
    connections = {
        "When clicking 'Execute'": {"main": [[{"node": "Phone present & 12 digits", "type": "main", "index": 0}]]},
        "Phone present & 12 digits": {
            "main": [
                [{"node": "Send validated lead to FUG", "type": "main", "index": 0}],
                [{"node": "Invalid lead rejected", "type": "main", "index": 0}],
            ]
        },
        "Send validated lead to FUG": {"main": [[{"node": "Valid lead forwarded", "type": "main", "index": 0}]]},
    }
    return build("WF-02 Lead Validation", True, nodes, connections)


def wf03_dedup():
    nodes = [
        manual_node(),
        http_request_node("Check duplicate", FUG_URL, json_body={"type": "LEAD_CAPTURED", "payload": "={{ $json }}"}),
        log_node("Dedup result"),
    ]
    connections = {
        "When clicking 'Execute'": {"main": [[{"node": "Check duplicate", "type": "main", "index": 0}]]},
        "Check duplicate": {"main": [[{"node": "Dedup result", "type": "main", "index": 0}]]},
    }
    return build("WF-03 Lead Deduplication", True, nodes, connections)


def wf04_nocodb_sync():
    nodes = [
        manual_node(),
        http_request_node("Sync to NocoDB", FUG_URL,
                          json_body={"type": "LEAD_CAPTURED", "payload": "={{ $json }}"}),
        log_node("CRM synced"),
    ]
    connections = {
        "When clicking 'Execute'": {"main": [[{"node": "Sync to NocoDB", "type": "main", "index": 0}]]},
        "Sync to NocoDB": {"main": [[{"node": "CRM synced", "type": "main", "index": 0}]]},
    }
    return build("WF-04 NocoDB CRM Sync", True, nodes, connections)


def wf05_whatsapp_new_lead():
    nodes = [
        schedule_node("Every 5 min", {"interval": [{"field": "minutes", "minutesInterval": 5}]}),
        http_request_node("Send ack via FUG", FUG_URL,
                          json_body={"type": "LEAD_CAPTURED", "payload": "={{ $json }}"}),
        log_node("Ack sent"),
    ]
    connections = {
        "Every 5 min": {"main": [[{"node": "Send ack via FUG", "type": "main", "index": 0}]]},
        "Send ack via FUG": {"main": [[{"node": "Ack sent", "type": "main", "index": 0}]]},
    }
    return build("WF-05 WhatsApp New Lead", True, nodes, connections)


def wf06_whatsapp_followup():
    nodes = [
        schedule_node("Every hour", {"interval": [{"field": "hours", "hoursInterval": 1}]}),
        http_request_node("Process due follow-ups", FUG_URL,
                          json_body={"type": "FOLLOWUP_DUE", "payload": {}}),
        log_node("Follow-up run"),
    ]
    connections = {
        "Every hour": {"main": [[{"node": "Process due follow-ups", "type": "main", "index": 0}]]},
        "Process due follow-ups": {"main": [[{"node": "Follow-up run", "type": "main", "index": 0}]]},
    }
    return build("WF-06 WhatsApp Follow-up", True, nodes, connections)


def wf07_content():
    nodes = [
        manual_node(),
        http_request_node("Generate content", FUG_URL,
                          json_body={"type": "CONTENT_REQUEST", "payload": "={{ $json }}"}),
        log_node("Content drafted"),
    ]
    connections = {
        "When clicking 'Execute'": {"main": [[{"node": "Generate content", "type": "main", "index": 0}]]},
        "Generate content": {"main": [[{"node": "Content drafted", "type": "main", "index": 0}]]},
    }
    return build("WF-07 Content Generation", True, nodes, connections)


def wf08_youtube():
    nodes = [
        manual_node(),
        http_request_node("Publish via FUG", FUG_URL,
                          json_body={"type": "PUBLISH_REQUEST", "payload": "={{ $json }}"}),
        log_node("YouTube publish result"),
    ]
    connections = {
        "When clicking 'Execute'": {"main": [[{"node": "Publish via FUG", "type": "main", "index": 0}]]},
        "Publish via FUG": {"main": [[{"node": "YouTube publish result", "type": "main", "index": 0}]]},
    }
    return build("WF-08 YouTube Publishing", False, nodes, connections)


def wf09_instagram():
    return build("WF-09 Instagram Publishing", False, wf08_youtube()["nodes"], wf08_youtube()["connections"])


def wf10_facebook():
    return build("WF-10 Facebook Publishing", False, wf08_youtube()["nodes"], wf08_youtube()["connections"])


def wf11_seo():
    nodes = [
        schedule_node("Weekly", {"interval": [{"field": "weeks", "weeksInterval": 1}]}),
        http_request_node("Run SEO audit", FUG_URL,
                          json_body={"type": "SCHEDULED_TASK", "payload": {"task": "seo"}}),
        log_node("Audit done"),
    ]
    connections = {
        "Weekly": {"main": [[{"node": "Run SEO audit", "type": "main", "index": 0}]]},
        "Run SEO audit": {"main": [[{"node": "Audit done", "type": "main", "index": 0}]]},
    }
    return build("WF-11 SEO Audit", True, nodes, connections)


def wf12_analytics():
    nodes = [
        schedule_node("Daily", {"interval": [{"field": "days", "daysInterval": 1}]}),
        http_request_node("Generate report", FUG_URL,
                          json_body={"type": "REPORT_REQUEST", "payload": {"kind": "daily"}}),
        log_node("Report"),
    ]
    connections = {
        "Daily": {"main": [[{"node": "Generate report", "type": "main", "index": 0}]]},
        "Generate report": {"main": [[{"node": "Report", "type": "main", "index": 0}]]},
    }
    return build("WF-12 Analytics", True, nodes, connections)


def wf13_error_monitoring():
    nodes = [
        schedule_node("Every 15 min", {"interval": [{"field": "minutes", "minutesInterval": 15}]}),
        http_request_node("Process open errors", FUG_URL,
                          json_body={"type": "WORKFLOW_FAILURE", "payload": {}}),
        log_node("Errors processed"),
    ]
    connections = {
        "Every 15 min": {"main": [[{"node": "Process open errors", "type": "main", "index": 0}]]},
        "Process open errors": {"main": [[{"node": "Errors processed", "type": "main", "index": 0}]]},
    }
    return build("WF-13 Error Monitoring", True, nodes, connections)


def wf14_master_orchestrator():
    nodes = [
        webhook_node("Master Inbox", "master"),
        if_node("Is approval decision?", [{"leftValue": "={{ $json.type }}", "rightValue": "APPROVAL_DECIDED", "operator": {"type": "string", "operation": "equals"}}]),
        log_node("Route to approval"),
    ]
    connections = {
        "Master Inbox": {"main": [[{"node": "Is approval decision?", "type": "main", "index": 0}]]},
        "Is approval decision?": {"main": [[{"node": "Route to approval", "type": "main", "index": 0}], []]},
    }
    return build("WF-14 Master AI Orchestrator", True, nodes, connections)


def wf15_approval_queue():
    nodes = [
        manual_node(),
        if_node("Approved?", [{"leftValue": "={{ $json.approved }}", "rightValue": True, "operator": {"type": "boolean", "operation": "equals"}}]),
        http_request_node("Notify approval", FUG_URL,
                          json_body={"type": "APPROVAL_DECIDED", "payload": "={{ $json }}"}),
        log_node("Decision recorded"),
    ]
    connections = {
        "When clicking 'Execute'": {"main": [[{"node": "Approved?", "type": "main", "index": 0}]]},
        "Approved?": {"main": [[{"node": "Notify approval", "type": "main", "index": 0}], []]},
        "Notify approval": {"main": [[{"node": "Decision recorded", "type": "main", "index": 0}]]},
    }
    return build("WF-15 Human Approval Queue", True, nodes, connections)


GENERATORS = {
    "WF-01 Website Lead Intake": wf01_lead_intake,
    "WF-02 Lead Validation": wf02_lead_validation,
    "WF-03 Lead Deduplication": wf03_dedup,
    "WF-04 NocoDB CRM Sync": wf04_nocodb_sync,
    "WF-05 WhatsApp New Lead": wf05_whatsapp_new_lead,
    "WF-06 WhatsApp Follow-up": wf06_whatsapp_followup,
    "WF-07 Content Generation": wf07_content,
    "WF-08 YouTube Publishing": wf08_youtube,
    "WF-09 Instagram Publishing": wf09_instagram,
    "WF-10 Facebook Publishing": wf10_facebook,
    "WF-11 SEO Audit": wf11_seo,
    "WF-12 Analytics": wf12_analytics,
    "WF-13 Error Monitoring": wf13_error_monitoring,
    "WF-14 Master AI Orchestrator": wf14_master_orchestrator,
    "WF-15 Human Approval Queue": wf15_approval_queue,
}


def main():
    for name, gen in GENERATORS.items():
        wf = gen()
        slug = name.lower().replace(" ", "-").replace("/", "-")
        (OUT / f"{slug}.json").write_text(json.dumps(wf, indent=2), encoding="utf-8")
        print(f"wrote {slug}.json")


if __name__ == "__main__":
    main()
