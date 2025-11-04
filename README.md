# Aiaxcart Premium Shop (Next.js 14 + Supabase)

Pastel‑pink, simple, and **ready to deploy**.

## What’s inside
- `/` Welcome (only buttons to Admin / Owner — no guest access shown in nav)
- `/login` Preset buttons (Admin/Owner) + manual email/password
- `/owner` Add stocks (product dropdown, account type, term, optional creds, qty, price)
- `/admin` Pick a stock → Get Account (decrement) or Record Sale (buyer name/email/social/amount)
- `/admin/records` Buyer records with pagination filters (search email / filter by product)

## 1) Supabase
Paste **supabase.sql** in SQL Editor → RUN.

> **Heads up:** If your hosted project already exists, run the script again whenever the app complains about missing columns (e.g. `stocks.quantity`). The SQL file is idempotent and will safely add any new fields, triggers, or RPCs the UI expects.

## 2) Environment
`.env.local` is included with your values (you can also add these in Vercel project settings).

## 3) Install & run
```bash
npm i
npm run dev
```
or deploy to Vercel and set the same env vars.

Tip: Turn on RLS + policies later when you’re ready.
