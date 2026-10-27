/* Settings live in /config.js */
const KK_CONFIG = window.KK_CONFIG || {};

/* ---------- Light and dark mode ---------- */
(function(){
  const root = document.documentElement;
  try { const t = localStorage.getItem("kk-theme"); if (t === "light" || t === "dark") root.setAttribute("data-theme", t); } catch (e) {}
  const isDark = () => root.getAttribute("data-theme") === "dark" || (root.getAttribute("data-theme") !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  const label = () => document.querySelectorAll(".theme-btn").forEach(b => b.setAttribute("aria-label", isDark() ? "Switch to light mode" : "Switch to dark mode"));
  document.querySelectorAll(".theme-btn").forEach(b => b.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark"; root.setAttribute("data-theme", next);
    try { localStorage.setItem("kk-theme", next); } catch (e) {}
    label();
  }));
  label();
})();

/* ---------- Login links ---------- */
document.querySelectorAll("[data-login]").forEach(a => {
  a.href = KK_CONFIG.platformLoginUrl; a.target = "_blank"; a.rel = "noopener";
});

document.querySelectorAll("[data-flogin]").forEach(a => { a.href = KK_CONFIG.financeLoginUrl; a.target = "_blank"; a.rel = "noopener"; });

/* ---------- Nav border on scroll ---------- */
const navs = document.querySelectorAll(".nav");
addEventListener("scroll", () => navs.forEach(n => n.classList.toggle("scrolled", scrollY > 60)), { passive: true });


/* ---------- Copy buttons and smooth in-page scrolling ---------- */
document.addEventListener("click", e => {
  const c = e.target.closest("[data-copy]");
  if (c) {
    const done = () => { c.textContent = "Copied"; setTimeout(() => c.textContent = "Copy", 1600); };
    const fallback = () => { const target = c.previousElementSibling; if (!target) return; const sel = getSelection(), rng = document.createRange(); rng.selectNodeContents(target); sel.removeAllRanges(); sel.addRange(rng); c.textContent = "Selected"; };
    try { navigator.clipboard.writeText(c.dataset.copy).then(done, fallback); } catch (err) { fallback(); }
    return;
  }
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href").slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (target) { e.preventDefault(); /top$/.test(id) ? scrollTo({ top: 0, behavior: "smooth" }) : target.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(null, "", "#" + id); }
});

/* ---------- Narration ticker ---------- */
const NARR = [
  ["PSTKDIRECTDEBITZAP","Paystack direct debit","Recurring obligation"],
  ["PAYSTACK CHECKOUT/BOLT","Bolt","Transport"],
  ["NIP/OPAY/ADEBAYO T/TRF","Transfer in, OPay","Income"],
  ["FLW*IKEDC PREPAID","IKEDC","Utilities"],
  ["MPT POS/CW/LEKKI PH1","Moniepoint POS","Cash withdrawal"],
  ["REMITA/SAL/OCT26/0417","Salary, Remita","Income"],
  ["PSTK*JUMIA NG","Jumia","Shopping"],
  ["MTN AIRTIME VTU/0803","MTN airtime","Telecoms"],
  ["FLW*DSTV MULTICHOICE","DStv","Subscriptions"],
  ["NIP/KUDA/RENT AUG","Rent transfer, Kuda","Housing"]
];
const track = document.getElementById("track");
if (track) {
const item = ([r,d,c]) => `<span class="tk"><span class="raw">${r}</span><span class="to" aria-hidden="true">→</span><span class="dec">${d}</span><span class="cat">${c}</span></span>`;
track.innerHTML = NARR.map(item).join("") + `<span aria-hidden="true" style="display:contents">${NARR.map(item).join("")}</span>`;
}

/* ---------- Score count-up (rest state is 742 in markup) ---------- */
(function(){
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const el = document.getElementById("score"), bar = document.getElementById("vbar");
  if (!el || !bar) return;
  const target = 742, from = 300, dur = 1300, t0 = performance.now() + 250;
  el.textContent = from; bar.style.height = "0%";
  requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.height = ((target-300)/600*100).toFixed(1) + "%"; }));
  function step(t){
    const p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (target - from) * e);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

/* ---------- Tabs (suite + code) ---------- */
function tabs(listSel){
  const list = document.querySelector(listSel); if (!list) return;
  const btns = [...list.querySelectorAll('[role="tab"]')];
  const select = b => btns.forEach(x => {
    const on = x === b; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
    document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
  });
  btns.forEach((b,i) => {
    b.addEventListener("click", () => select(b));
    b.addEventListener("keydown", e => {
      const k = e.key; let j = null;
      if (k === "ArrowDown" || k === "ArrowRight") j = (i + 1) % btns.length;
      if (k === "ArrowUp" || k === "ArrowLeft") j = (i - 1 + btns.length) % btns.length;
      if (j !== null){ e.preventDefault(); select(btns[j]); btns[j].focus(); }
    });
  });
}
document.querySelectorAll(".suite__tabs").forEach((el, i) => { el.dataset.tabset = i; tabs(`.suite__tabs[data-tabset="${i}"]`); }); tabs(".code__tabs");

/* ---------- Modals ---------- */
let lastFocus = null;
function openModal(id){
  lastFocus = document.activeElement;
  const m = document.getElementById(id); m.hidden = false; document.body.style.overflow = "hidden";
  const f = m.querySelector("input,select,textarea,button:not(.x)"); f && f.focus();
}
function closeModal(m){ m.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus && lastFocus.focus(); }
document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("click", e => { if (e.target === m || e.target.closest("[data-close]")) closeModal(m); });
});
addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modal:not([hidden])").forEach(closeModal); });

/* ---------- Storage backends ---------- */
const store = { mode: "none", db: null, uid: null, user: null };
const capsReady = (async () => {
  if (window.claude && typeof window.claude.use === "function") {
    try {
      const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
      if (db && user) {
        const uid = await user.id();
        store.db = db; store.user = user;
        if (uid) { store.uid = uid; store.mode = "db"; }
        if (await user.canEdit()) initAdmin();
      }
    } catch (e) { /* fall through */ }
  }
  if (store.mode === "none" && KK_CONFIG.demoEndpoint) store.mode = "endpoint";
})();

function newId(){ return "dr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

async function saveRequest(rec){
  await capsReady;
  if (store.mode === "db") {
    await store.db.doc(`requests/${store.uid}/log/${rec.id}`).set(rec);
    await store.db.doc(`requests/${store.uid}`).set({ lastAt: rec.submittedAt, lastEmail: rec.email });
    return;
  }
  if (store.mode === "endpoint") {
    // Apps Script web apps accept a simple text/plain POST without CORS preflight.
    await fetch(KK_CONFIG.demoEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(rec) });
    return;
  }
  throw new Error("not_connected");
}

/* ---------- Demo form ---------- */
const form = document.getElementById("demo-form");
const done = document.getElementById("demo-done");
const ferr = document.getElementById("form-err");
document.querySelectorAll("[data-demo]").forEach(b => b.addEventListener("click", e => {
  e.preventDefault();
  form.hidden = false; done.hidden = true; ferr.hidden = true;
  const want = b.getAttribute("data-interest");
  if (want) document.getElementById("f-interest").value = want;
  openModal("demo");
}));

function validate(){
  let ok = true;
  [["f-name", v => v.trim().length > 1], ["f-email", v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())], ["f-company", v => v.trim().length > 1], ["f-type", v => !!v]]
    .forEach(([id, test]) => { const el = document.getElementById(id); const good = test(el.value); el.closest(".field").classList.toggle("invalid", !good); if (!good && ok) { el.focus(); } ok = ok && good; });
  return ok;
}
form.addEventListener("input", e => { const f = e.target.closest(".field"); f && f.classList.remove("invalid"); });
form.addEventListener("submit", async e => {
  e.preventDefault(); ferr.hidden = true;
  if (!validate()) return;
  if (!document.getElementById("f-consent").checked) { ferr.textContent = "Tick the box so we can store your request and contact you."; ferr.hidden = false; return; }
  const fd = new FormData(form);
  const rec = {
    id: newId(), submittedAt: new Date().toISOString(),
    name: fd.get("name").trim(), email: fd.get("email").trim(), company: fd.get("company").trim(),
    role: (fd.get("role")||"").trim(), lenderType: fd.get("lenderType"), monthlyApplications: fd.get("volume") || "",
    phone: (fd.get("phone")||"").trim(), interest: fd.get("interest"), notes: (fd.get("notes")||"").trim(),
    status: "New", source: "kranekredit.com"
  };
  const btn = document.getElementById("f-submit"); btn.disabled = true; btn.textContent = "Sending request";
  try {
    await saveRequest(rec);
    form.reset(); form.hidden = true; done.hidden = false;
    document.getElementById("done-ref").textContent = "Reference " + rec.id;
    const book = document.getElementById("book-link");
    if (KK_CONFIG.bookingUrl) { book.href = KK_CONFIG.bookingUrl + (KK_CONFIG.bookingUrl.includes("?") ? "&" : "?") + "name=" + encodeURIComponent(rec.name) + "&email=" + encodeURIComponent(rec.email); book.hidden = false; done.querySelector("p").textContent = "Pick a time for your discovery call now, or our credit team will reach out within two working days."; book.focus(); }
    else { done.querySelector("button").focus(); }
  } catch (err) {
    ferr.textContent = err && err.message === "not_connected"
      ? "Demo requests aren't connected on this copy of the site yet. Email founders@krane.finance and we'll book you in."
      : "We couldn't send your request. Check your connection and try again, or email founders@krane.finance.";
    ferr.hidden = false;
  } finally { btn.disabled = false; btn.textContent = "Request a demo"; }
});


/* ---------- kranefinance applications ---------- */
const aform = document.getElementById("apply-form"), adone = document.getElementById("apply-done"), aerr = document.getElementById("apply-err");
document.querySelectorAll("[data-apply]").forEach(b => b.addEventListener("click", e => {
  e.preventDefault(); aform.hidden = false; adone.hidden = true; aerr.hidden = true;
  if (b.dataset.segment) document.getElementById("a-seg").value = b.dataset.segment;
  openModal("apply");
}));
aform.addEventListener("input", e => { const f = e.target.closest(".field"); f && f.classList.remove("invalid"); });
aform.addEventListener("submit", async e => {
  e.preventDefault(); aerr.hidden = true; let ok = true;
  [["a-seg", v => !!v], ["a-name", v => v.trim().length > 1], ["a-phone", v => v.replace(/\D/g, "").length >= 10], ["a-email", v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())]]
    .forEach(([id, test]) => { const el = document.getElementById(id), good = test(el.value); el.closest(".field").classList.toggle("invalid", !good); if (!good && ok) el.focus(); ok = ok && good; });
  if (!ok) return;
  if (!document.getElementById("a-consent").checked) { aerr.textContent = "Tick the box so we can store your details and call you."; aerr.hidden = false; return; }
  const fd = new FormData(aform);
  const rec = { id: newId(), submittedAt: new Date().toISOString(), source: "kranefinance",
    name: fd.get("name").trim(), phone: fd.get("phone").trim(), email: (fd.get("email") || "").trim(), company: (fd.get("company") || "").trim(),
    role: fd.get("segment"), lenderType: "", monthlyApplications: "", city: fd.get("city"), interest: fd.get("vehicle"), notes: (fd.get("notes") || "").trim(), status: "New" };
  const btn = document.getElementById("a-submit"); btn.disabled = true; btn.textContent = "Sending";
  try {
    await saveRequest(rec);
    aform.reset(); aform.hidden = true; adone.hidden = false;
    document.getElementById("apply-ref").textContent = "Reference " + rec.id;
    adone.querySelector("button").focus();
  } catch (err) {
    aerr.textContent = err && err.message === "not_connected"
      ? "Applications aren't connected on this copy of the site yet. Call 01-700-2000 or email sales@krane.finance."
      : "We couldn't send your details. Check your connection and try again, or call 01-700-2000.";
    aerr.hidden = false;
  } finally { btn.disabled = false; btn.textContent = "Send"; }
});

/* ---------- Admin: request log + Excel export ---------- */
let adminRows = [];
const COLS = [["submittedAt","Submitted (UTC)"],["source","Site"],["city","City"],["name","Name"],["email","Work email"],["company","Company"],["role","Role"],["lenderType","Lender type"],["monthlyApplications","Monthly applications"],["phone","Phone"],["interest","Interested in"],["notes","Notes"],["status","Status"],["id","Reference"]];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

async function loadRequests(){
  const db = store.db; const rows = [];
  const users = await db.collection("requests").get();
  for (const u of users.docs) {
    const log = await db.collection(`requests/${u.id}/log`).get();
    log.docs.forEach(d => { const v = d.data(); if (v) rows.push(v); });
  }
  rows.sort((a,b) => String(b.submittedAt).localeCompare(String(a.submittedAt)));
  return rows;
}
function renderAdmin(){
  const body = document.getElementById("admin-body");
  document.getElementById("admin-count").textContent = adminRows.length;
  if (!adminRows.length) { body.innerHTML = '<p class="admin-empty">No demo requests yet. New requests from the form appear here, and you can export them to Excel.</p>'; return; }
  const fmt = iso => { try { return new Date(iso).toLocaleString("en-GB",{timeZone:"Africa/Lagos",day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) + " WAT"; } catch(e){ return iso; } };
  body.innerHTML = `<div class="tablewrap"><table><thead><tr><th>Submitted</th><th>Site</th><th>Name</th><th>Phone</th><th>Email</th><th>Company</th><th>Type</th><th>Interested in</th></tr></thead><tbody>${
    adminRows.map(r => `<tr><td class="mono" style="font-weight:400">${esc(fmt(r.submittedAt))}</td><td>${esc(r.source === "kranefinance" ? "kranefinance" : "kranekredit")}</td><td>${esc(r.name)}</td><td>${esc(r.phone)}</td><td>${esc(r.email)}</td><td>${esc(r.company)}</td><td>${esc(r.role || r.lenderType)}</td><td>${esc(r.interest)}</td></tr>`).join("")
  }</tbody></table></div>`;
}
async function refreshAdmin(){
  const msg = document.getElementById("admin-msg"); msg.hidden = true;
  try { adminRows = await loadRequests(); renderAdmin(); }
  catch(e){ msg.textContent = "Couldn't load requests. Try Refresh."; msg.hidden = false; }
}
function initAdmin(){
  const pill = document.getElementById("admin-pill"); pill.hidden = false;
  pill.addEventListener("click", () => { openModal("admin"); refreshAdmin(); });
  document.getElementById("admin-refresh").addEventListener("click", refreshAdmin);
  document.getElementById("admin-export").addEventListener("click", exportXlsx);
  refreshAdmin();
}
async function exportXlsx(){
  const msg = document.getElementById("admin-msg"); msg.hidden = true;
  const say = t => { msg.textContent = t; msg.hidden = false; };
  if (!window.XLSX) return say("The Excel exporter didn't load. Refresh the page and try again.");
  const dl = window.claude && await claude.use("downloads");
  if (!dl) return say("Downloads aren't available in this view.");
  const data = [COLS.map(c => c[1])].concat(adminRows.map(r => COLS.map(([k]) => r[k] ?? "")));
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = COLS.map(([k]) => ({ wch: k === "notes" ? 48 : k === "email" ? 30 : 20 }));
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Demo requests");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const stamp = new Date().toISOString().slice(0,10);
  try { await dl.save({ filename: `kranekredit-demo-requests-${stamp}.xlsx`, data: new Uint8Array(buf) }); say(`Exported ${adminRows.length} request${adminRows.length === 1 ? "" : "s"}.`); }
  catch(e){ if (e && e.code !== "declined") say("The export didn't save. Try again in a moment."); }
}

/* ---------- Product switcher ---------- */
(function(){
  const sw = document.querySelector(".sw"); if (!sw) return;
  const btn = sw.querySelector(".sw__btn"), menu = sw.querySelector(".sw__menu");
  const items = () => [...menu.querySelectorAll("a.sw__item, .sw__foot")];
  const place = () => {
    const r = btn.getBoundingClientRect(), w = menu.offsetWidth, vw = document.documentElement.clientWidth;
    menu.style.top = Math.round(r.bottom + 12) + "px";
    menu.style.left = Math.round(Math.max(16, Math.min(r.left - 160, vw - w - 16))) + "px";
  };
  const open = (focusFirst) => { menu.hidden = false; place(); btn.setAttribute("aria-expanded", "true"); if (focusFirst) (menu.querySelector('a.sw__item:not([aria-current])') || items()[0]).focus(); };
  const close = (refocus) => { if (menu.hidden) return; menu.hidden = true; btn.setAttribute("aria-expanded", "false"); if (refocus) btn.focus(); };
  btn.addEventListener("click", e => { e.stopPropagation(); menu.hidden ? open(false) : close(false); });
  btn.addEventListener("keydown", e => { if (e.key === "ArrowDown") { e.preventDefault(); open(true); } });
  menu.addEventListener("keydown", e => {
    const list = items(), i = list.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    if (e.key === "Escape") { e.preventDefault(); close(true); }
    if (e.key === "Tab") close(false);
  });
  document.addEventListener("click", e => { if (!sw.contains(e.target)) close(false); });
  addEventListener("resize", () => { if (!menu.hidden) place(); });
  addEventListener("scroll", () => { if (!menu.hidden) place(); }, { passive: true });
  addEventListener("keydown", e => { if (e.key === "Escape") close(true); });
})();
