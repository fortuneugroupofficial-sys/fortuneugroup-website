import unittest

from fug.agents.seo_agent import SEOAgent
from fug.crm import Crm
from tests.helpers import make_settings, REPO_ROOT


class SEOTests(unittest.TestCase):
    def setUp(self):
        self.settings = make_settings()
        self.crm = Crm(self.settings)
        self.obs = __import__("fug.observability", fromlist=["Observability"]).Observability(self.crm)
        self.agent = SEOAgent(self.crm, self.obs, str(REPO_ROOT))

    def test_audit_runs_on_real_site(self):
        audit = self.agent.audit("test")
        self.assertGreaterEqual(audit["pages_audited"], 5)
        self.assertGreaterEqual(len(audit["issues"]), 0)


if __name__ == "__main__":
    unittest.main()
