from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import re
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ----- Setup -----
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"

app = FastAPI(title="Fortune U Group API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fortune_u")


# ----- Helpers -----
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def gen_id() -> str:
    return str(uuid.uuid4())


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text)
    return text[:80]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorized")
    return user


# ----- Models -----
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ConsultationLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=gen_id)
    name: str
    mobile: str
    email: EmailStr
    city: str
    financial_goal: str
    type: Literal["consultation"] = "consultation"
    status: Literal["new", "contacted", "converted", "closed"] = "new"
    created_at: str = Field(default_factory=now_iso)


class SIPLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=gen_id)
    name: str
    mobile: str
    monthly_income: float
    sip_budget: float
    goal_type: str
    type: Literal["sip"] = "sip"
    status: Literal["new", "contacted", "converted", "closed"] = "new"
    created_at: str = Field(default_factory=now_iso)


class InsuranceLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=gen_id)
    name: str
    mobile: str
    age: int
    family_members: int
    coverage_requirement: str
    type: Literal["insurance"] = "insurance"
    status: Literal["new", "contacted", "converted", "closed"] = "new"
    created_at: str = Field(default_factory=now_iso)


class ContactIn(BaseModel):
    name: str
    mobile: str
    email: EmailStr
    message: str


class Contact(ContactIn):
    id: str = Field(default_factory=gen_id)
    status: Literal["new", "read", "responded"] = "new"
    created_at: str = Field(default_factory=now_iso)


class BlogIn(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    cover_image: Optional[str] = None
    author: str = "Fortune U Team"
    published: bool = True


class Blog(BlogIn):
    id: str = Field(default_factory=gen_id)
    slug: str
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class TestimonialIn(BaseModel):
    name: str
    role: str
    content: str
    rating: int = 5
    avatar: Optional[str] = None
    published: bool = True


class Testimonial(TestimonialIn):
    id: str = Field(default_factory=gen_id)
    created_at: str = Field(default_factory=now_iso)


class FAQIn(BaseModel):
    question: str
    answer: str
    order: int = 0
    published: bool = True


class FAQ(FAQIn):
    id: str = Field(default_factory=gen_id)
    created_at: str = Field(default_factory=now_iso)


# ----- Auth Routes -----
@api_router.post("/auth/login")
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user["role"]},
    }


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return current


# ----- Lead Routes (public) -----
@api_router.post("/leads/consultation")
async def create_consultation_lead(payload: dict):
    lead = ConsultationLead(**payload)
    await db.leads.insert_one(lead.model_dump())
    return {"success": True, "id": lead.id, "message": "Thank you! We will contact you soon."}


@api_router.post("/leads/sip")
async def create_sip_lead(payload: dict):
    lead = SIPLead(**payload)
    await db.leads.insert_one(lead.model_dump())
    return {"success": True, "id": lead.id, "message": "Thank you! Our SIP advisor will reach out."}


@api_router.post("/leads/insurance")
async def create_insurance_lead(payload: dict):
    lead = InsuranceLead(**payload)
    await db.leads.insert_one(lead.model_dump())
    return {"success": True, "id": lead.id, "message": "Thank you! Insurance guidance request received."}


@api_router.post("/contact")
async def create_contact(payload: ContactIn):
    c = Contact(**payload.model_dump())
    await db.contacts.insert_one(c.model_dump())
    return {"success": True, "id": c.id, "message": "Thanks! We will get back to you."}


# ----- Public Content -----
@api_router.get("/blogs")
async def list_blogs(category: Optional[str] = None, q: Optional[str] = None):
    query = {"published": True}
    if category and category.lower() != "all":
        query["category"] = category
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.blogs.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs


@api_router.get("/blogs/{slug}")
async def get_blog(slug: str):
    doc = await db.blogs.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return doc


@api_router.get("/testimonials")
async def list_testimonials():
    return await db.testimonials.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(50)


@api_router.get("/faqs")
async def list_faqs():
    return await db.faqs.find({"published": True}, {"_id": 0}).sort("order", 1).to_list(100)


# ----- Admin Routes -----
@api_router.get("/admin/leads")
async def admin_list_leads(_: dict = Depends(get_current_admin)):
    return await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api_router.patch("/admin/leads/{lead_id}")
async def admin_update_lead(lead_id: str, payload: dict, _: dict = Depends(get_current_admin)):
    allowed = {k: v for k, v in payload.items() if k in {"status"}}
    if not allowed:
        raise HTTPException(status_code=400, detail="No valid fields")
    res = await db.leads.update_one({"id": lead_id}, {"$set": allowed})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True}


@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, _: dict = Depends(get_current_admin)):
    await db.leads.delete_one({"id": lead_id})
    return {"success": True}


@api_router.get("/admin/contacts")
async def admin_list_contacts(_: dict = Depends(get_current_admin)):
    return await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api_router.delete("/admin/contacts/{cid}")
async def admin_delete_contact(cid: str, _: dict = Depends(get_current_admin)):
    await db.contacts.delete_one({"id": cid})
    return {"success": True}


# Blogs admin
@api_router.get("/admin/blogs")
async def admin_list_blogs(_: dict = Depends(get_current_admin)):
    return await db.blogs.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.post("/admin/blogs")
async def admin_create_blog(payload: BlogIn, _: dict = Depends(get_current_admin)):
    blog = Blog(**payload.model_dump(), slug=slugify(payload.title) + "-" + uuid.uuid4().hex[:6])
    await db.blogs.insert_one(blog.model_dump())
    return blog.model_dump()


@api_router.put("/admin/blogs/{bid}")
async def admin_update_blog(bid: str, payload: BlogIn, _: dict = Depends(get_current_admin)):
    update = payload.model_dump()
    update["updated_at"] = now_iso()
    res = await db.blogs.update_one({"id": bid}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True}


@api_router.delete("/admin/blogs/{bid}")
async def admin_delete_blog(bid: str, _: dict = Depends(get_current_admin)):
    await db.blogs.delete_one({"id": bid})
    return {"success": True}


# Testimonials admin
@api_router.get("/admin/testimonials")
async def admin_list_testimonials(_: dict = Depends(get_current_admin)):
    return await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.post("/admin/testimonials")
async def admin_create_testimonial(payload: TestimonialIn, _: dict = Depends(get_current_admin)):
    t = Testimonial(**payload.model_dump())
    await db.testimonials.insert_one(t.model_dump())
    return t.model_dump()


@api_router.put("/admin/testimonials/{tid}")
async def admin_update_testimonial(tid: str, payload: TestimonialIn, _: dict = Depends(get_current_admin)):
    res = await db.testimonials.update_one({"id": tid}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True}


@api_router.delete("/admin/testimonials/{tid}")
async def admin_delete_testimonial(tid: str, _: dict = Depends(get_current_admin)):
    await db.testimonials.delete_one({"id": tid})
    return {"success": True}


# FAQs admin
@api_router.get("/admin/faqs")
async def admin_list_faqs(_: dict = Depends(get_current_admin)):
    return await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(500)


@api_router.post("/admin/faqs")
async def admin_create_faq(payload: FAQIn, _: dict = Depends(get_current_admin)):
    f = FAQ(**payload.model_dump())
    await db.faqs.insert_one(f.model_dump())
    return f.model_dump()


@api_router.put("/admin/faqs/{fid}")
async def admin_update_faq(fid: str, payload: FAQIn, _: dict = Depends(get_current_admin)):
    res = await db.faqs.update_one({"id": fid}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True}


@api_router.delete("/admin/faqs/{fid}")
async def admin_delete_faq(fid: str, _: dict = Depends(get_current_admin)):
    await db.faqs.delete_one({"id": fid})
    return {"success": True}


# Analytics
@api_router.get("/admin/analytics")
async def admin_analytics(_: dict = Depends(get_current_admin)):
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    converted = await db.leads.count_documents({"status": "converted"})
    contacts = await db.contacts.count_documents({})
    blogs = await db.blogs.count_documents({})
    testimonials = await db.testimonials.count_documents({})
    by_type = {
        "consultation": await db.leads.count_documents({"type": "consultation"}),
        "sip": await db.leads.count_documents({"type": "sip"}),
        "insurance": await db.leads.count_documents({"type": "insurance"}),
    }
    # Last 7 days lead trend
    trend = []
    for i in range(6, -1, -1):
        day_start = (datetime.now(timezone.utc) - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        count = await db.leads.count_documents({
            "created_at": {"$gte": day_start.isoformat(), "$lt": day_end.isoformat()}
        })
        trend.append({"date": day_start.strftime("%b %d"), "count": count})
    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "converted_leads": converted,
        "contacts": contacts,
        "blogs": blogs,
        "testimonials": testimonials,
        "by_type": by_type,
        "trend": trend,
    }


@api_router.get("/")
async def root():
    return {"service": "Fortune U Group API", "status": "ok"}


# ----- App setup -----
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.leads.create_index("created_at")
    await db.blogs.create_index("slug", unique=True)

    # Seed admin
    email = os.environ["ADMIN_EMAIL"].lower().strip()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one({
            "id": gen_id(),
            "email": email,
            "password_hash": hash_password(password),
            "name": "Fortune U Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Seeded admin user: %s", email)
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one(
            {"email": email}, {"$set": {"password_hash": hash_password(password)}}
        )
        logger.info("Updated admin password for %s", email)

    # Seed content if empty
    if await db.testimonials.count_documents({}) == 0:
        seed_testimonials = [
            {"name": "Ramesh Kumar", "role": "Software Engineer, Hyderabad", "content": "Fortune U Group helped me start my first SIP. In 3 years, my portfolio has crossed 8 lakhs. Their goal-based approach is brilliant.", "rating": 5, "published": True},
            {"name": "Priya Sharma", "role": "Business Owner, Bangalore", "content": "The retirement planning session opened my eyes. Disciplined investing combined with expert guidance — exactly what every Indian family needs.", "rating": 5, "published": True},
            {"name": "Anil Reddy", "role": "Doctor, Chennai", "content": "Transparent, patient and educative. They taught me 'why' to invest before 'where'. My children's education corpus is on track.", "rating": 5, "published": True},
            {"name": "Lakshmi Devi", "role": "Homemaker, Vijayawada", "content": "I was scared of mutual funds. Fortune U made it simple. Now I run 3 SIPs for our home, my child's education and retirement.", "rating": 5, "published": True},
        ]
        for t in seed_testimonials:
            await db.testimonials.insert_one(Testimonial(**t).model_dump())

    if await db.faqs.count_documents({}) == 0:
        faqs = [
            ("What is SIP?", "SIP (Systematic Investment Plan) is a disciplined way of investing a fixed amount in mutual funds at regular intervals. It uses the power of compounding and rupee-cost averaging to build long-term wealth.", 1),
            ("How much SIP should I start?", "A common thumb rule is 20–30% of monthly income. You can begin with as little as ₹500/month. Our goal calculator helps you compute the exact SIP required for your goal.", 2),
            ("What are Mutual Funds?", "Mutual funds pool money from many investors and invest in equities, bonds and other instruments through professional fund managers. They are regulated by SEBI and offer diversification at low cost.", 3),
            ("How does Goal-Based Investing work?", "You define a goal (home, education, retirement), its time horizon and target amount. We then map it to the right mix of mutual funds and an appropriate SIP — and track it for you.", 4),
            ("Why is Retirement Planning important?", "With rising life expectancy and inflation, building a retirement corpus is non-negotiable. Starting early and compounding for 20–30 years can convert a small SIP into a multi-crore corpus.", 5),
            ("How does Health Insurance help?", "Health insurance shields your savings from sudden medical expenses. We help you choose the right family floater or individual plan based on age, lifestyle and coverage needs.", 6),
            ("Why do I need Term Insurance?", "Term insurance provides a large life cover at low premiums — protecting your family's financial future in case of unforeseen events. It is the cheapest pure-risk life cover.", 7),
        ]
        for q, a, o in faqs:
            await db.faqs.insert_one(FAQ(question=q, answer=a, order=o).model_dump())

    if await db.blogs.count_documents({}) == 0:
        sample_blogs = [
            {"title": "The Power of Starting SIP Early — A 25-Year Lesson", "category": "SIP Investing", "excerpt": "Why a ₹5,000 SIP started at age 25 beats a ₹15,000 SIP started at 40. The math of compounding explained simply.", "content": "Compounding is the eighth wonder of the world. When you start a SIP early, every rupee gets more years to grow. Consider two investors: Anita starts a ₹5,000 SIP at 25 and stops at 35 (just 10 years of investing). Bala starts a ₹5,000 SIP at 35 and continues until 60 (25 years). Assuming 12% annual returns, Anita's corpus at 60 will be around ₹2 crore while Bala's will be around ₹95 lakhs — even though Bala invested more than twice as long.\n\nThe secret? Time, not timing.\n\nIf you are reading this in your 20s or 30s, start today — even ₹1,000/month. The earlier you begin, the harder your money works for you.", "cover_image": "https://images.unsplash.com/photo-1647510283846-ed174cc84a78?crop=entropy&cs=srgb&fm=jpg&q=85"},
            {"title": "How to Choose the Right Mutual Fund for Your Goal", "category": "Mutual Funds", "excerpt": "Equity, debt, hybrid — a simple decision framework based on time horizon, risk appetite and goal.", "content": "Every mutual fund category serves a specific purpose. For long-term goals (10+ years) like retirement or child education, equity mutual funds (large-cap, flexi-cap, mid-cap) are ideal. For medium-term goals (3–5 years), hybrid funds balance risk and return. For short-term goals (under 3 years), debt funds and liquid funds protect capital.\n\nA simple rule: 100 minus your age = percentage in equity. So at 30, keep 70% in equity, 30% in debt. As you near a goal, gradually shift from equity to debt — this is called goal-based rebalancing.\n\nAt Fortune U Group, we never push schemes. We start with your goal and reverse-engineer the right portfolio.", "cover_image": "https://images.pexels.com/photos/7947754/pexels-photo-7947754.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
            {"title": "Retirement Planning: Building a ₹5 Crore Corpus", "category": "Retirement Planning", "excerpt": "A step-by-step roadmap to retire comfortably — even on a middle-class income.", "content": "Retiring with ₹5 crore sounds impossible — until you do the math. A monthly SIP of ₹15,000 for 30 years at 12% CAGR grows to ~₹5.3 crore. That's it.\n\nThe three pillars of retirement planning are: (1) Start early — every year of delay costs you lakhs. (2) Increase SIP by 10% every year — match it to your salary hike. (3) Stay invested through market cycles — corrections are opportunities, not threats.\n\nAdd EPF, NPS and a small allocation to debt funds for stability. Review every year with your planner. That's the entire formula.", "cover_image": "https://images.unsplash.com/photo-1758518729841-308509f69a7f?crop=entropy&cs=srgb&fm=jpg&q=85"},
            {"title": "Why Term Insurance is the First Insurance You Should Buy", "category": "Term Insurance", "excerpt": "₹1 crore cover for less than ₹1,000/month. Why every earning member needs term insurance.", "content": "Term insurance is pure life cover — no investment, no maturity benefit. You pay a small premium, and if something happens to you, your family receives a large sum assured. For a healthy 30-year-old non-smoker, ₹1 crore cover costs about ₹800–1,200/month.\n\nRule of thumb: cover should be 15–20× your annual income. Buy as early as possible — premiums lock in at your current age and health. Always opt for claim settlement ratio above 95% and choose a 'till age 60 or 65' tenure.", "cover_image": "https://images.pexels.com/photos/5402587/pexels-photo-5402587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
            {"title": "Health Insurance: Individual vs Family Floater Plans", "category": "Health Insurance", "excerpt": "Which plan suits your family? A clear comparison with real examples.", "content": "Individual plans offer separate cover for each member — higher premium but no shared sum insured. Family floater plans share one large sum insured across the family — cheaper but the entire cover is exhausted if one member has a major claim.\n\nOur recommendation: parents above 55 should have individual plans; younger families can start with a family floater of at least ₹10 lakh and add a super top-up of ₹50 lakh for affordability. Always check the day-care procedure list, room-rent capping and claim settlement ratio before buying.", "cover_image": "https://images.pexels.com/photos/4308058/pexels-photo-4308058.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
            {"title": "Goal-Based Investing — The Modern Approach to Wealth", "category": "Personal Finance", "excerpt": "Stop investing randomly. Map every rupee to a life goal.", "content": "Most Indians invest reactively — a tax-saver in March, a recurring deposit when a neighbour suggests one. Goal-based investing flips the script. List your life goals: 1) Emergency fund (6 months expenses), 2) Child's school fees in 5 years, 3) Home down-payment in 7 years, 4) Retirement in 25 years.\n\nFor each goal, compute target amount adjusted for inflation, decide the asset mix, and run dedicated SIPs. This gives clarity, removes anxiety during market falls, and ensures every rupee has a purpose.", "cover_image": "https://images.unsplash.com/photo-1621831337128-35676ca30868?crop=entropy&cs=srgb&fm=jpg&q=85"},
        ]
        for b in sample_blogs:
            blog = Blog(**b, slug=slugify(b["title"]) + "-" + uuid.uuid4().hex[:6])
            await db.blogs.insert_one(blog.model_dump())

    logger.info("Startup complete.")


@app.on_event("shutdown")
async def shutdown():
    client.close()
