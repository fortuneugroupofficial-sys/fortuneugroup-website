import unittest

from fug import normalizers


class NormalizerTests(unittest.TestCase):
    def test_phone_national(self):
        self.assertEqual(normalizers.normalize_phone("9490237465"), "919490237465")

    def test_phone_with_country_code(self):
        self.assertEqual(normalizers.normalize_phone("+91 94902 37465"), "919490237465")

    def test_phone_invalid(self):
        self.assertIsNone(normalizers.normalize_phone("123"))

    def test_email(self):
        self.assertEqual(normalizers.normalize_email("  Foo@Bar.COM "), "foo@bar.com")

    def test_dedup_key_prefers_phone(self):
        key = normalizers.dedup_key(phone="9490237465", email="a@b.com")
        self.assertEqual(key, "phone:919490237465")

    def test_service_guess(self):
        self.assertEqual(normalizers.guess_service("I want health insurance"), "HEALTH_INSURANCE")
        self.assertEqual(normalizers.guess_service("SIP investment"), "SIP_MUTUAL_FUNDS")


if __name__ == "__main__":
    unittest.main()
