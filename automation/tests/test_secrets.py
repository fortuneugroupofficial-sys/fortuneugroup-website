import unittest

from fug import secrets


class SecretTests(unittest.TestCase):
    def test_redact_known_secret(self):
        secrets.register_secret_value("SUPERSECRET123")
        self.assertNotIn("SUPERSECRET123", secrets.redact("token=SUPERSECRET123"))

    def test_redact_bearer(self):
        self.assertNotIn("Bearer abcdef", secrets.redact("Authorization: Bearer abcdef"))

    def test_redact_mapping(self):
        out = secrets.redact_mapping({"token": "abc", "name": "Ravi"})
        self.assertEqual(out["token"], "***REDACTED***")
        self.assertEqual(out["name"], "Ravi")


if __name__ == "__main__":
    unittest.main()
