# Fortune U Group

Public website for [fortuneugroup.in](https://www.fortuneugroup.in/)

## What is live

`frontend/` is the **React app deployed on Vercel** (www.fortuneugroup.in).
Pages: Home, About, Services, Health Insurance, Tools (calculators), Blog, Contact, Disclosure, Privacy Policy, Terms & Conditions.

The static HTML files at the repo root (`index.html`, `health.html`, `css/`, `js/`, `images/`) are a compliance-first static build kept for reference / possible future migration. They are **not** deployed.

## Local preview

```bash
cd frontend
npm ci
npm start          # http://localhost:3000
```

## Production build

```bash
cd frontend
npm run build      # output in frontend/build
```

## Deploy on Vercel

1. Import this GitHub repo in [vercel.com](https://vercel.com/new)
2. Root Directory: **frontend**
3. Framework: **Create React App** (or Other)
4. Assign domains `fortuneugroup.in` and `www.fortuneugroup.in`

### Environment variables (optional)

- `REACT_APP_GA4_ID` — Google Analytics 4 id. Falls back to `G-5P0R5EM9C6` (already set in `frontend/public/index.html`).
- `REACT_APP_WHATSAPP_NUMBER` / `REACT_APP_BUSINESS_EMAIL` — defaults are in `frontend/src/lib/api.js`.

## Lead capture

Forms post to n8n webhooks (`https://n8n.fortuneugroup.in/webhook/...`) — see `frontend/src/lib/api.js`.
If a webhook is down, the UI now shows an error instead of a false success.

## Content / compliance notes

- AMFI ARN is **not yet allotted**: the site says "post-ARN" for mutual fund distribution and does not claim to be a SEBI-registered Investment Adviser (see `frontend/src/pages/Disclosure.jsx`).
- Insurance appointments: IRDAI ref `LIC0159665T`; Life: LIC, HDFC Life; Health: Care Health, Niva Bupa, Tata AIG, ICICI Lombard.
- Do not add "Advisor", "Demat", "Loans" or "Credit Cards" wording — it is deliberately excluded.
