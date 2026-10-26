/**
 * kranekredit: demo request log
 * Appends every "Request a demo" submission to a Google Sheet.
 * The sheet downloads as Excel any time: File > Download > Microsoft Excel (.xlsx).
 *
 * Setup (5 minutes):
 * 1. Create a Google Sheet named "kranekredit demo requests".
 * 2. Extensions > Apps Script. Paste this file. Save.
 * 3. Deploy > New deployment > Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 4. Copy the web app URL into KK_CONFIG.demoEndpoint in index.html.
 * 5. Optional: set NOTIFY_EMAIL to get an email for each new request.
 */

const SHEET_NAME = "Demo requests";
const NOTIFY_EMAIL = "founders@krane.finance"; // set to "" to turn off

const COLUMNS = [
  ["submittedAt", "Submitted (UTC)"],
  ["name", "Name"],
  ["email", "Work email"],
  ["company", "Company"],
  ["role", "Role"],
  ["lenderType", "Lender type"],
  ["monthlyApplications", "Monthly applications"],
  ["phone", "Phone"],
  ["interest", "Interested in"],
  ["notes", "Notes"],
  ["status", "Status"],
  ["source", "Source"],
  ["id", "Reference"]
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const rec = JSON.parse(e.postData.contents || "{}");
    if (!rec.email || !rec.name || !rec.company) {
      return out({ ok: false, error: "missing_fields" });
    }
    const sheet = getSheet();
    sheet.appendRow(COLUMNS.map(([k]) => clean(rec[k])));
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "New kranekredit demo request: " + clean(rec.company),
        COLUMNS.map(([k, label]) => label + ": " + clean(rec[k])).join("\n")
      );
    }
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS.map(c => c[1]));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
  }
  return sheet;
}

// Stops spreadsheet formula injection from form input.
function clean(v) {
  const s = v == null ? "" : String(v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
