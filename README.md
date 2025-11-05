# OneTeenOneTree.org — Starter

Minimal Next.js (App Router) + NextAuth (Google) + Tailwind scaffold.

## Pages
- `/` Home
- `/pledge` (requires Google sign-in; currently stores nothing, just acknowledges)
- `/about`
- `/blog` (fetches Campus Unmuted RSS; set `CAMPUS_UNMUTED_RSS` in `.env`)
- `/leaderboard` (static placeholder; later wire to real DB)

## Quick start

```bash
pnpm i # or npm i / yarn
cp .env.example .env.local
# set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET and NEXTAUTH_SECRET
pnpm dev
```

## Deploy
- Vercel → import repo → add env vars from `.env.example`.
- Point your `.org` DNS to Vercel.
