"""Fortune U Group backend API tests."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://sip-launch-1.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@fortuneugroup.in"
ADMIN_PASSWORD = "Fortune@2026"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def token(s):
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# Health
def test_health(s):
    r = s.get(f"{BASE_URL}/api/", timeout=15)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# Public content seeded
def test_seeded_testimonials(s):
    r = s.get(f"{BASE_URL}/api/testimonials", timeout=15)
    assert r.status_code == 200
    assert len(r.json()) >= 4


def test_seeded_faqs(s):
    r = s.get(f"{BASE_URL}/api/faqs", timeout=15)
    assert r.status_code == 200
    assert len(r.json()) >= 7


def test_seeded_blogs(s):
    r = s.get(f"{BASE_URL}/api/blogs", timeout=15)
    assert r.status_code == 200
    assert len(r.json()) >= 6


def test_blog_filter_category(s):
    r = s.get(f"{BASE_URL}/api/blogs", params={"category": "SIP Investing"}, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    assert all(b["category"] == "SIP Investing" for b in data)


def test_blog_search_q(s):
    r = s.get(f"{BASE_URL}/api/blogs", params={"q": "retirement"}, timeout=15)
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_blog_detail_by_slug(s):
    blogs = s.get(f"{BASE_URL}/api/blogs", timeout=15).json()
    slug = blogs[0]["slug"]
    r = s.get(f"{BASE_URL}/api/blogs/{slug}", timeout=15)
    assert r.status_code == 200
    assert r.json()["slug"] == slug


# Public lead forms
def test_lead_consultation(s):
    r = s.post(f"{BASE_URL}/api/leads/consultation", json={
        "name": "TEST_User", "mobile": "9999999999", "email": "test_cons@example.com",
        "city": "Hyderabad", "financial_goal": "Retirement"
    }, timeout=15)
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_lead_sip(s):
    r = s.post(f"{BASE_URL}/api/leads/sip", json={
        "name": "TEST_SIP", "mobile": "9999999998", "monthly_income": 100000,
        "sip_budget": 10000, "goal_type": "Wealth"
    }, timeout=15)
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_lead_insurance(s):
    r = s.post(f"{BASE_URL}/api/leads/insurance", json={
        "name": "TEST_INS", "mobile": "9999999997", "age": 30,
        "family_members": 4, "coverage_requirement": "1Cr"
    }, timeout=15)
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_contact_form(s):
    r = s.post(f"{BASE_URL}/api/contact", json={
        "name": "TEST_Contact", "mobile": "9999999996",
        "email": "test_contact@example.com", "message": "Hello team"
    }, timeout=15)
    assert r.status_code == 200
    assert r.json()["success"] is True


# Auth
def test_login_success(s):
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200
    j = r.json()
    assert "token" in j and j["user"]["role"] == "admin"


def test_login_invalid(s):
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=15)
    assert r.status_code == 401


def test_auth_me(s, auth_headers):
    r = s.get(f"{BASE_URL}/api/auth/me", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_admin_leads_unauthorized(s):
    r = s.get(f"{BASE_URL}/api/admin/leads", timeout=15)
    assert r.status_code == 401


# Admin list endpoints
@pytest.mark.parametrize("path", [
    "/api/admin/leads", "/api/admin/contacts", "/api/admin/blogs",
    "/api/admin/testimonials", "/api/admin/faqs", "/api/admin/analytics"
])
def test_admin_lists(s, auth_headers, path):
    r = s.get(f"{BASE_URL}{path}", headers=auth_headers, timeout=20)
    assert r.status_code == 200


# Blog CRUD round-trip
def test_blog_crud(s, auth_headers):
    create = s.post(f"{BASE_URL}/api/admin/blogs", headers=auth_headers, json={
        "title": "TEST_Blog Title", "excerpt": "TEST excerpt", "content": "content",
        "category": "SIP Investing", "published": True
    }, timeout=20)
    assert create.status_code == 200
    bid = create.json()["id"]
    upd = s.put(f"{BASE_URL}/api/admin/blogs/{bid}", headers=auth_headers, json={
        "title": "TEST_Blog Updated", "excerpt": "u", "content": "u",
        "category": "SIP Investing", "published": True
    }, timeout=20)
    assert upd.status_code == 200
    d = s.delete(f"{BASE_URL}/api/admin/blogs/{bid}", headers=auth_headers, timeout=20)
    assert d.status_code == 200


def test_testimonial_crud(s, auth_headers):
    c = s.post(f"{BASE_URL}/api/admin/testimonials", headers=auth_headers, json={
        "name": "TEST_T", "role": "Tester", "content": "Great", "rating": 5, "published": True
    }, timeout=20)
    assert c.status_code == 200
    tid = c.json()["id"]
    u = s.put(f"{BASE_URL}/api/admin/testimonials/{tid}", headers=auth_headers, json={
        "name": "TEST_T2", "role": "Tester", "content": "Great", "rating": 5, "published": True
    }, timeout=20)
    assert u.status_code == 200
    d = s.delete(f"{BASE_URL}/api/admin/testimonials/{tid}", headers=auth_headers, timeout=20)
    assert d.status_code == 200


def test_faq_crud(s, auth_headers):
    c = s.post(f"{BASE_URL}/api/admin/faqs", headers=auth_headers, json={
        "question": "TEST_Q?", "answer": "A", "order": 99, "published": True
    }, timeout=20)
    assert c.status_code == 200
    fid = c.json()["id"]
    u = s.put(f"{BASE_URL}/api/admin/faqs/{fid}", headers=auth_headers, json={
        "question": "TEST_Q2?", "answer": "A2", "order": 99, "published": True
    }, timeout=20)
    assert u.status_code == 200
    d = s.delete(f"{BASE_URL}/api/admin/faqs/{fid}", headers=auth_headers, timeout=20)
    assert d.status_code == 200


def test_lead_status_update(s, auth_headers):
    # Get any lead and update its status
    leads = s.get(f"{BASE_URL}/api/admin/leads", headers=auth_headers, timeout=15).json()
    if not leads:
        pytest.skip("No leads")
    lid = leads[0]["id"]
    r = s.patch(f"{BASE_URL}/api/admin/leads/{lid}", headers=auth_headers, json={"status": "contacted"}, timeout=15)
    assert r.status_code == 200
