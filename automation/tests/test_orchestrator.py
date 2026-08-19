import unittest

from fug.orchestrator import Orchestrator
from tests.helpers import make_settings


class OrchestratorTests(unittest.TestCase):
    def setUp(self):
        self.settings = make_settings()
        self.orch = Orchestrator(self.settings)

    def test_status_report_marks_blockers(self):
        report = self.orch.status_report()
        self.assertEqual(report["crm_backend"], "local_json")
        names = [b[0] for b in report["blockers"]]
        self.assertIn("WhatsApp", names)
        self.assertFalse(report["auto_publish"])

    def test_unknown_event_returns_error(self):
        result = self.orch.route({"type": "BOGUS", "payload": {}})
        self.assertEqual(result["status"], "error")

    def test_lead_captured_flow(self):
        result = self.orch.route({
            "type": "LEAD_CAPTURED",
            "payload": {
                "name": "Ravi Kumar", "mobile": "9490237465", "goal": "Health insurance",
                "message": "Need family cover", "source": "WEBSITE_CONTACT",
            },
        })
        self.assertEqual(result["status"], "ok")
        lead_id = result["result"]["lead_id"]
        lead = self.orch.crm.get_lead(lead_id)
        self.assertEqual(lead.status, "NEW")
        self.assertEqual(lead.service, "HEALTH_INSURANCE")
        # Acknowledgement recorded (dry-run) and interaction logged
        self.assertEqual(lead.whatsapp_status, "ACKNOWLEDGED")

    def test_duplicate_detection(self):
        payload = {"name": "Ravi", "mobile": "9490237465", "goal": "Term insurance"}
        r1 = self.orch.route({"type": "LEAD_CAPTURED", "payload": dict(payload)})
        r2 = self.orch.route({"type": "LEAD_CAPTURED", "payload": dict(payload)})
        self.assertEqual(r1["result"]["status"], "new")
        self.assertEqual(r2["result"]["status"], "duplicate")
        self.assertEqual(r1["result"]["lead_id"], r2["result"]["lead_id"])
        # History preserved
        lead = self.orch.crm.get_lead(r1["result"]["lead_id"])
        self.assertTrue(any("Duplicate" in n for n in lead.notes))

    def test_report_generation(self):
        self.orch.route({"type": "LEAD_CAPTURED", "payload": {"name": "Sita", "mobile": "9876543210", "goal": "Health"}})
        report = self.orch.route({"type": "REPORT_REQUEST", "payload": {"kind": "daily"}})
        self.assertEqual(report["status"], "ok")
        self.assertEqual(report["result"]["New Leads"], 1)

    def test_publish_is_approval_gated(self):
        result = self.orch.route({
            "type": "PUBLISH_REQUEST",
            "payload": {"platform": "youtube", "topic": "Term insurance basics"},
        })
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["result"]["status"], "blocked")
        self.assertIn("approval_id", result["result"])


if __name__ == "__main__":
    unittest.main()
