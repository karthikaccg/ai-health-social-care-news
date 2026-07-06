# CareZeno — AI in Health & Social Care News

A OneFootball-style news site for **AI and technology in Health and Social Care**, UK-first with a World section. Built with Next.js + Tailwind, statically exported and hosted on GitHub Pages.

## How it works

- `scripts/fetch-news.mjs` pulls live RSS feeds (Digital Health, HTN, Care Home Professional, Home Care Insight, GOV.UK DHSC, Healthcare IT News, MIT Tech Review, and targeted Google News UK/US queries), normalises and dedupes them into `data/news.json`.
- The Next.js app (`output: 'export'`) renders the home page and category pages from that JSON at build time.
- `.github/workflows/deploy.yml` rebuilds and redeploys the site on every push **and every 6 hours** (cron), so headlines stay fresh with no server.

## Categories

NHS & Digital Health · Social Care Tech · Policy & Regulation · Research & Innovation · Startups & Funding · World

## Local development

```bash
npm install
npm run fetch-news   # pull latest headlines into data/news.json
npm run dev          # http://localhost:3000
npm run build        # static export into out/ (runs fetch-news first)
```

All headlines link out to their original publishers.
