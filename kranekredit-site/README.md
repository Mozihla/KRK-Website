# kranekredit landing page

A single static page. Host the folder as-is on Vercel, Netlify, Cloudflare Pages or any web server.

```
index.html          the page (all CSS and JS inline)
fonts/              Neulis Alt and Nacelle, from the krane design system
img/                kranekredit lockups (ink and white)
demo-requests.gs    Google Apps Script that logs demo requests to a sheet
```

## Two settings to change

At the top of the `<script>` in `index.html`:

```js
const KK_CONFIG = {
  platformLoginUrl: "https://app.krane.finance/login",  // every "Log in" button
  demoEndpoint: ""                                      // your Apps Script web app URL
};
```

1. **Log in to platform.** Set `platformLoginUrl` to the platform front end's sign-in route. Every log-in button on the page uses it.
2. **Request a demo.** Follow the setup steps at the top of `demo-requests.gs`, then paste the web app URL into `demoEndpoint`. Each submission becomes a row in the Google Sheet (download it as .xlsx any time), and an email goes to founders@krane.finance.

Until `demoEndpoint` is set, the hosted page tells visitors to email founders@krane.finance instead of failing silently.

## Fields captured

Submitted time, name, work email, company, role, lender type, monthly applications, phone, interest (demo, API access, pilot, partnership), notes, status, source, reference ID.

## Before going public (brand book 5.4)

- Every sample score, signal and table on the page is labelled "Sample".
- Integrations read "Designed for", not "integrates natively", until they are live.
- Market figures carry their source line.
- Advisors are not named. Add names only with their approval.
- Confirm the Neulis Alt web licence covers self-hosting before launch. Nacelle is OFL (licence in fonts/).
