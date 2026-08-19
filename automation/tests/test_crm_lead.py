import unittest

from fug import normalizers
from fug.config import get_settings
from fug.crm import Crm
from fug.models import Lead
from tests.helpers import make_settings


class CrmLeadTests(unittest.TestCase):
    def setUp(self):
        self.settings = make_settings()
        self.crm = Crm(self.settings)

    def test_backend_is_local_when_no_nocodb(self):
        self.assertEqual(self.crm.backend_name, "local_json")

    def test_upsert_and_get_lead(self):
        lead = Lead(name="Ravi", phone=normalizers.normalize_phone("9490237465"), source="WEBSITE_CONTACT")
        self.crm.upsert_lead(lead)
        fetched = self.crm.get_lead(lead.lead_id)
        self.assertEqual(fetched.name, "Ravi")
        self.assertEqual(fetched.phone, "919490237465")
        self.assertEqual(fetched.dedup_key, "phone:919490237465")

    def test_find_by_dedup(self):
        lead = Lead(name="A", phone="9490237465")
        self.crm.upsert_lead(lead)
        dup = self.crm.find_by_dedup("phone:919490237465")
        self.assertIsNotNone(dup)
        self.assertEqual(dup.lead_id, lead.lead_id)

    def test_update_lead_status(self):
        lead = Lead(name="B", phone="9490237465")
        self.crm.upsert_lead(lead)
        updated = self.crm.update_lead(lead.lead_id, {"status": "QUALIFIED"})
        self.assertEqual(updated.status, "QUALIFIED")

    def test_lead_validate(self):
        good = Lead(name="Ravi", phone="9490237465")
        self.assertEqual(good.validate(), [])
        bad = Lead(name="", phone="")
        self.assertIn("invalid_name", bad.validate())
        self.assertIn("invalid_phone", bad.validate())


if __name__ == "__main__":
    unittest.main()
