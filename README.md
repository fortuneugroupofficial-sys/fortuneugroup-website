# Fortune U Group

Public website for [fortuneugroup.in](https://www.fortuneugroup.in/)

Static HTML (no React). Health insurance calculator, IRDAI disclosures, social dock.

## Local preview

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

## Deploy on Vercel

1. Import this GitHub repo in [vercel.com](https://vercel.com/new)
2. Framework: **Other**
3. Output: leave empty (static root)
4. Assign domains `fortuneugroup.in` and `www.fortuneugroup.in`

Licence and insurer names: edit `js/config.js`.
