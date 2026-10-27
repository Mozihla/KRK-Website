# krane.finance

The krane website: the parent site and its two product sites, as one static Vercel project.

| URL | Page | File |
|---|---|---|
| `krane.finance` | krane (parent) | `index.html` |
| `krane.finance/kredit` | kranekredit | `kredit/index.html` |
| `krane.finance/finance` | kranefinance | `finance/index.html` |

No build step. Each page is plain HTML, CSS and JavaScript.

```
config.js                  shared settings: log-in URLs, Calendly link, request log endpoint
vercel.json                clean URLs, /Kredit and /Finance redirects, caching
assets/                    site.css and site.js, shared by all three pages
fonts/                     Neulis Alt and Nacelle, woff2 (Nacelle licence in fonts/)
img/                       krane, kranekredit, kranefinance, kranead and getkrane lockups
scripts/demo-requests.gs   Google Apps Script that logs form submissions to the tracker sheet
```

## Deploy on Vercel

1. Vercel → **Add New → Project** → import this repository.
2. Framework Preset: **Other**. Leave Build Command and Output Directory empty.
3. Deploy. Every push to `main` redeploys; pull requests get preview URLs.

## Connect the domain

In the Vercel project: **Settings → Domains → add `krane.finance`** (and `www.krane.finance`, set to redirect to the apex).

Your email runs on the domain's MX records, the website on its A/CNAME records. Add only the records Vercel shows you. If you move nameservers to Vercel, copy every existing MX and TXT record (SPF, DKIM, DMARC) across first, or email will stop.

## Settings (`config.js`)

| Setting | What it does |
|---|---|
| `platformLoginUrl` | Every kranekredit "Log in" button |
| `financeLoginUrl` | Every kranefinance "Sign in" button |
| `bookingUrl` | Calendly page shown after a demo request |
| `demoEndpoint` | Where form submissions are sent (see below). Empty means forms ask people to email or call |

## Turn on the request log

1. Open **Krane Discovery Call Tracker** in the **Krane Discovery Calls** Drive folder.
2. Extensions → Apps Script. Paste `scripts/demo-requests.gs`. Save.
3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
4. Paste the web app URL into `demoEndpoint` in `config.js`. Commit and push.

Each submission becomes a row on the **Demo requests** tab (Stage: New), and an email goes to founders@krane.finance.

## Before going public

- Every sample score, plan price, swap station and table is labelled "Sample". Replace with real figures as they exist.
- Integrations say "designed for", not "integrates with", until they're live.
- Advisors and energy partners are named only with their approval.
- "Within 24 hours" and "up to 36 months" on kranefinance carry over from the previous site. Confirm they still hold.
- Confirm the Neulis Alt licence covers web use. Nacelle is OFL.
