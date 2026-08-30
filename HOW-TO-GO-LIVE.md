# fortuneugroup.in — లైవ్ ఎలా పెట్టాలి

> **అప్డేట్ (2026-08-30):** ఇప్పుడు live సైట్ `frontend/` లోని **React యాప్** (బ్రాంచ్ `arena/01a053e7-fortuneugroup-website` → `main` PR ద్వారా). Vercel ప్రాజెక్ట్ Root Directory → **frontend**. ఈ డాక్యుమెంట్ కింద ఉన్న వివరాలు పాత static వెర్షన్‌ను డిప్లాయ్ చేయాలనుకుంటే మాత్రమే — ప్రస్తుతం అవసరం లేదు.

ఇప్పుడు మార్పులు **ఈ వర్క్‌స్పేస్ ప్రివ్యూలో మాత్రమే** ఉన్నాయి.  
పాత సైట్ `www.fortuneugroup.in` ఇంకా Vercelలోని **పాత React యాప్**.

లైవ్ కావాలంటే ఈ ఫోల్డర్ `fortuneugroup-website` ని అదే Vercel ప్రాజెక్ట్‌కి డిప్లాయ్ చేయాలి.

---

## ఈజీ మార్గం (15 నిమిషాలు) — Vercel Dashboard

1. కంప్యూటర్‌లో `fortuneugroup-website` ఫోల్డర్ డౌన్‌లోడ్ / సేవ్ చేయండి  
   (లోపల `index.html`, `health.html`, `css`, `js`, `images` ఉండాలి)

2. బ్రౌజర్‌లో తెరవండి: https://vercel.com/login  
   ఏ అకౌంట్‌తో ఇప్పుడు `fortuneugroup.in` పెట్టారో **అదే అకౌంట్**.

3. ఆ ప్రాజెక్ట్ ఓపెన్ చేయండి (పేరు సాధారణంగా `fortuneugroup` లాంటిది).

4. **Deployments** → కొత్త డిప్లాయ్  
   లేదా ప్రాజెక్ట్ Settings కాకుండా హోమ్‌లో **Add New… → Project** కాదు —  
   **ఉన్న ప్రాజెక్ట్‌లోనే** అప్‌లోడ్ చేయండి, లేకపోతే డొమైన్ వేరు అవుతుంది.

5. సింపుల్‌గా:  
   Vercel → **Add New → Project** → **Upload** ఈ ఫోల్డర్.  
   Framework: **Other** (static HTML).  
   Root: ఫోల్డర్ రూట్ (అక్కడ `index.html` కనిపించాలి).

6. Deploy అయిన తర్వాత:  
   **Settings → Domains** → `fortuneugroup.in` మరియు `www.fortuneugroup.in`  
   ఈ **కొత్త** ప్రాజెక్ట్‌కి అసైన్ చేయండి.

7. 2–5 నిమిషాలు వేచి https://www.fortuneugroup.in/health.html చూడండి.  
   కొత్త హెల్త్ కాలిక్యులేటర్ + రంగు ఐకాన్లు కనిపిస్తే లైవ్ అయింది.

---

## GitHub ఉంటే

1. కొత్త repo: `fortuneugroup-website`  
2. ఈ ఫోల్డర్ ఫైళ్లు పుష్ చేయండి  
3. Vercel → Import Git Repository → Deploy  
4. Domainsలో `fortuneugroup.in` ఈ ప్రాజెక్ట్‌కి మార్చండి

---

## చెక్‌లిస్ట్

- [ ] `js/config.js`లో IRDAI, కంపెనీలు, Facebook లింక్ సరిగ్గా ఉన్నాయి  
- [ ] లైవ్‌లో Advisor / Loans / Demat లేవు  
- [ ] `/health.html` ఓపెన్ అవుతుంది  
- [ ] కుడి వైపు IG / YT / FB / WA ఐకాన్లు ఉన్నాయి  

పాత React డిప్లాయ్‌ను **unassign domain** చేయకపోతే పాత సైటే కనిపిస్తుంది.
