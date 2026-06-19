# Fortune U Group — Product Requirements

## Original Problem
Premium, modern, responsive Financial Services & Wealth Management Website for Fortune U Group (India) — fortuneugroup.in. Tagline: "Financial Education → Financial Planning → Financial Freedom". Blue + Green + White scheme, mobile-first, SEO, EN+TE bilingual toggle, WhatsApp + lead generation focus, calculators, blog, admin panel.

## User Personas
- Salaried Employees
- Business Owners
- Families (financial planning)
- First-Time Investors
- Professionals
- Retirement Planners

## Architecture
- **Backend:** FastAPI + Motor (MongoDB). JWT auth (Bearer + localStorage). bcrypt hashing. Single-file `/app/backend/server.py`. Routes prefixed `/api`.
- **Frontend:** React (CRA) + react-router-dom v7 + Tailwind CSS + Shadcn UI + recharts + sonner. Fonts: Outfit (display) + Plus Jakarta Sans (body). Colors: Navy `#0A2540`, Green `#10B981`, Surface white.
- **Hosting:** Kubernetes (supervisor). REACT_APP_BACKEND_URL routed via ingress.

## Completed (Feb 2026 — v1)
- Hero / About / Services (8 services bento grid) / Tools (SIP, Retirement, Goal calculators with sliders + recharts) / Blog (categories + search + featured + detail by slug) / Contact (form + Google Map iframe).
- Lead generation forms — Free Consultation, SIP Planning Request, Insurance Guidance (all wired to /api/leads/*).
- Floating WhatsApp FAB on all public pages with prefilled message.
- Language toggle context (EN/TE) — header nav + hero strings translated.
- Admin Panel: Login → Dashboard (stats + 7-day lead trend + by-type bars) → Leads (status mgmt + delete) → Contacts → Blogs CRUD → Testimonials CRUD → FAQs CRUD.
- Auto-seeded admin user, 4 testimonials, 7 FAQs, 6 sample blog posts on startup.
- SEO meta tags, Open Graph, JSON-LD FinancialService schema in `public/index.html`.
- Legal disclaimer in footer.

## Test Credentials
- Admin: `admin@fortuneugroup.in` / `Fortune@2026`
- Auth endpoint: POST /api/auth/login → returns JWT (stored as localStorage `fu_admin_token`).

## Backlog
### P0 (next)
- Replace placeholder office address + Google Map embed once final address is provided.
- Full i18n: extend Telugu dictionary to every page string (currently nav + hero only) — wire each page through `useLang().t()`.

### P1
- Lead notification email via Resend / SendGrid on form submission.
- Blog rich-text editor in admin (currently plain textarea).
- Image upload via object storage for blog covers/testimonial avatars.
- Pagination on blog list and admin leads.

### P2
- Tax-saving (ELSS) Calculator, EMI Calculator, Step-up SIP Calculator.
- Investor onboarding flow + KYC document upload.
- WhatsApp Business API auto-replies for booked consultations.
- Razorpay / Stripe to collect advisory engagement fees.
- Sitemap.xml + robots.txt + per-page meta + analytics (GA4 / Plausible).
