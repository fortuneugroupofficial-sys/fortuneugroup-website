# Fortune U Group — Frontend Website

Premium financial-services / wealth-management website. **100% static React frontend**, deployable on Vercel free tier.

## Stack
- React 19 (CRA + CRACO) + Tailwind + Shadcn UI + Recharts + Sonner toasts
- React Router v7 (SPA)
- Lead capture → **Google Sheets** (Apps Script webhook) via `mode: "no-cors"` POST

## Pages
- Home, About, Services (8), Tools (SIP / Retirement / Goal / ELSS / EMI calculators), Blog (static, from `src/data/content.js`), Contact
- Floating WhatsApp + Call FABs on every page, header Call Now + WhatsApp, mutual-fund disclaimer in footer
- EN / TE bilingual toggle

## Forms
4 lead forms — Free Consultation, SIP Planning Request, Insurance Guidance, Contact — all POST to `REACT_APP_SHEETS_WEBHOOK` (when set). Falls back to console log + success toast in dev.

## Setup Google Sheets webhook
1. Create a Google Sheet with columns: `timestamp`, `type`, `name`, `mobile`, `email`, `city`, `financial_goal`, `monthly_income`, `sip_budget`, `goal_type`, `age`, `family_members`, `coverage_requirement`, `message`.
2. Tools → Extensions → **Apps Script**. Paste:
```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  const row = ["timestamp","type","name","mobile","email","city","financial_goal",
               "monthly_income","sip_budget","goal_type","age","family_members",
               "coverage_requirement","message"].map(k => data[k] || "");
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ok:true}));
}
```
3. Deploy → New deployment → **Web app** → Execute as *me*, Access *Anyone* → copy the `/exec` URL.
4. Paste it into `REACT_APP_SHEETS_WEBHOOK` (in `.env.local` and in Vercel env vars).

## Local development
```bash
cd frontend
yarn install
yarn start          # http://localhost:3000
yarn build          # production build → build/
```

## Deploy to Vercel (free)
1. Push this repo to GitHub.
2. https://vercel.com → **New Project** → import the repo.
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
   - **Install Command**: `yarn install`
4. **Environment Variables** (Settings → Environment Variables):
   - `REACT_APP_WHATSAPP_NUMBER` = `919533304441`
   - `REACT_APP_BUSINESS_EMAIL` = `fortuneugroupofficial@gmail.com`
   - `REACT_APP_SHEETS_WEBHOOK` = your Apps Script `/exec` URL
   - `REACT_APP_GA4_ID` = `G-XXXXXXXXXX` (optional)
5. Click **Deploy**.

A `vercel.json` is included in `frontend/` to rewrite all routes → `index.html` (required for SPA routing).

## Editing content
- **Blog posts / Testimonials / FAQs** → edit `frontend/src/data/content.js`, commit, push → Vercel auto-redeploys.
- **WhatsApp / Phone / Email** → change Vercel env vars + redeploy.
- **Translations** → `frontend/src/context/LangContext.jsx`.
