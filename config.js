/* krane site settings: shared by krane.finance, /kredit and /finance.
   Change a value here, commit, and Vercel redeploys all three pages. */
window.KK_CONFIG = {
  // Where "Log in" sends people: the kranekredit platform front end.
  platformLoginUrl: "https://app.krane.finance/login",
  // Where kranefinance "Sign in" goes: the driver and partner app.
  financeLoginUrl: "https://app.krane.finance/finance/login",
  // Google Apps Script web app URL (see scripts/demo-requests.gs). Every demo request and
  // kranefinance application is added as a row in "Krane Discovery Call Tracker".
  // Until this is set, the forms ask people to email or call instead.
  demoEndpoint: "",
  // Calendly booking page. Shown as "Pick a time now" after someone requests a demo.
  bookingUrl: "https://calendly.com/madebydammy/kranekredit-discovery-call"
};
