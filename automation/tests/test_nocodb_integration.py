"""Offline integration tests for the NocoDB integration layer.

Exercises :class:`fug.nocodb.NocoDBClient` and the CRM facade against the
NocoDB REST *contract stub* (test double). A live NocoDB connection is BLOCKED
here (no credentials), so this verifies the integration code path itself.
"""
import unittest
from pathlib import Path

from fug.config import Settings
from fug.crm import Crm
from fug.nocodb import NocoDBClient
from fug.orchestrator import Orchestrator
from tests.nocodb_stub import NocoDBStub

REPO = Path(__file__).resolve().parents[2]
SCHEMA = __import__("json").load(open(Path(__file__).resolve().parents[1] / "nocodb" / "schema.json"))

API_TOKEN = "fug_test_api_token_0000000000000000"  # test-only, not a real secret


class NocoDBIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.stub = NocoDBStub(expected_token=API_TOKEN, db_name="fug_crm")
        port = cls.stub.start()
        cls.stub.serve()
        cls.url = f"http://127.0.0.1:{port}"
        import tempfile

        cls.settings = Settings(
            data_dir=tempfile.mkdtemp(prefix="fug-noco-"),
            dry_run=True,
            auto_publish=False,
            nocodb_url=cls.url,
            nocodb_api_token=API_TOKEN,
            nocodb_db_name="fug_crm",
        )

    @classmethod
    def tearDownClass(cls):
        cls.stub.stop()

    def test_01_read_only_connectivity(self):
        client = NocoDBClient(self.url, API_TOKEN, "fug_crm")
        status = client.check_connection()
        self.assertTrue(status["connected"])

    def test_02_create_13_tables_from_schema(self):
        client = NocoDBClient(self.url, API_TOKEN, "fug_crm")
        result = client.ensure_tables(SCHEMA)
        self.assertEqual(len(result["created"]), 13, "all 13 tables should be created")
        self.assertEqual(len(client.list_tables()), 13)

    def test_03_idempotent_table_creation(self):
        client = NocoDBClient(self.url, API_TOKEN, "fug_crm")
        result = client.ensure_tables(SCHEMA)
        self.assertEqual(result["created"], [], "no tables should be re-created")
        self.assertEqual(len(result["present"]), 13)

    def test_04_crm_backend_is_nocodb(self):
        crm = Crm(self.settings)
        self.assertEqual(crm.backend_name, "nocodb")

    def test_05_dry_run_lead_creation_via_orchestrator(self):
        orch = Orchestrator(self.settings)
        result = orch.route({
            "type": "LEAD_CAPTURED",
            "payload": {
                "name": "TEST-User-Noco",
                "mobile": "9490237465",
                "goal": "Health insurance",
                "source": "WEBSITE_CONTACT",
                "message": "TEST record — no real contact",
            },
        })
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["result"]["status"], "new")
        lead_id = result["result"]["lead_id"]
        # Verify it exists in the NocoDB (stub) Leads table.
        client = NocoDBClient(self.url, API_TOKEN, "fug_crm")
        rows = client.list_rows("Leads")
        matching = [r for r in rows if r.get("lead_id") == lead_id]
        self.assertEqual(len(matching), 1, "lead row must exist in NocoDB Leads")
        self.assertEqual(matching[0]["name"], "TEST-User-Noco")
        self.assertEqual(matching[0]["phone"], "919490237465")

    def test_06_duplicate_detection(self):
        orch = Orchestrator(self.settings)
        payload = {"name": "TEST-Dup", "mobile": "9876543210", "goal": "Term insurance"}
        r1 = orch.route({"type": "LEAD_CAPTURED", "payload": dict(payload)})
        r2 = orch.route({"type": "LEAD_CAPTURED", "payload": dict(payload)})
        self.assertEqual(r1["result"]["status"], "new")
        self.assertEqual(r2["result"]["status"], "duplicate")
        self.assertEqual(r1["result"]["lead_id"], r2["result"]["lead_id"])


if __name__ == "__main__":
    unittest.main()
