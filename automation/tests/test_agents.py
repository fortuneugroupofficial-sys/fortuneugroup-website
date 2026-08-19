import unittest

from fug import templates
from fug.approvals import ApprovalService
from fug.crm import Crm
from fug.models import Lead
from fug.orchestrator import Orchestrator
from tests.helpers import make_settings


class TemplateTests(unittest.TestCase):
    def test_all_templates_render(self):
        for name in templates.all_template_names():
            text = templates.render(name, {"name": "Ravi", "service": "Health insurance"})
            self.assertTrue(text)

    def test_sequence(self):
        self.assertEqual(templates.resolve_sequence(1), "followup_1")
        self.assertEqual(templates.resolve_sequence(3), "final_followup")
        self.assertIsNone(templates.resolve_sequence(4))


class WhatsAppAgentTests(unittest.TestCase):
    def setUp(self):
        self.settings = make_settings()
        self.orch = Orchestrator(self.settings)
        self.wa = self.orch.whatsapp_agent

    def _lead(self, phone="9490237465"):
        return Lead(name="Ravi", phone=phone)

    def test_ack_dry_run(self):
        lead = self._lead()
        out = self.wa.acknowledge(lead, "e1")
        self.assertEqual(out["status"], "sent")
        self.assertEqual(lead.whatsapp_status, "ACKNOWLEDGED")

    def test_opt_out_respected(self):
        lead = self._lead()
        lead.opted_out = True
        out = self.wa.acknowledge(lead, "e1")
        self.assertEqual(out["status"], "skipped")

    def test_inbound_optout(self):
        lead = self._lead()
        out = self.wa.handle_inbound(lead, "please stop messaging me", "e1")
        self.assertEqual(out["status"], "opted_out")
        self.assertTrue(lead.opted_out)

    def test_inbound_human_handoff(self):
        lead = self._lead()
        out = self.wa.handle_inbound(lead, "this is a complaint, I want the manager", "e1")
        self.assertEqual(out["status"], "human_handoff")


class FollowUpTests(unittest.TestCase):
    def setUp(self):
        self.settings = make_settings()
        self.orch = Orchestrator(self.settings)

    def test_followup_sequence_and_inactive(self):
        # Capture a lead
        res = self.orch.route({"type": "LEAD_CAPTURED", "payload": {"name": "Ravi", "mobile": "9490237465"}})
        lead_id = res["result"]["lead_id"]
        lead = self.orch.crm.get_lead(lead_id)
        # 3 follow-ups
        for expected in (1, 2, 3):
            lead = self.orch.crm.get_lead(lead_id)
            out = self.orch.whatsapp_agent.follow_up(lead, "e")
            self.assertEqual(out["status"], "sent")
            self.assertEqual(out["step"], expected)
        # max reached -> skip
        lead = self.orch.crm.get_lead(lead_id)
        out = self.orch.whatsapp_agent.follow_up(lead, "e")
        self.assertEqual(out["status"], "skipped")
        self.assertEqual(out["reason"], "max_followups_reached")


class ApprovalTests(unittest.TestCase):
    def test_requires_human_by_default(self):
        settings = make_settings()
        crm = Crm(settings)
        appr = ApprovalService(crm, auto_publish=False)
        req = appr.create_request("content", "topic", "summary", {}, requires_human=True)
        self.assertEqual(req["state"], "DRAFT")
        self.assertTrue(appr.pending())

    def test_auto_publish_skips_human(self):
        settings = make_settings()
        crm = Crm(settings)
        appr = ApprovalService(crm, auto_publish=True)
        req = appr.create_request("content", "topic", "summary", {}, requires_human=False)
        self.assertEqual(req["state"], "APPROVED")


if __name__ == "__main__":
    unittest.main()
