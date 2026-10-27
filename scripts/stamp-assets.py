"""Refresh the ?v= version stamps on shared files in all three pages.

Run after changing assets/site.css, assets/site.js or config.js:
    python3 scripts/stamp-assets.py
Browsers then fetch the new files straight away instead of a cached copy.
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ["/assets/site.css", "/assets/site.js", "/config.js"]
PAGES = ["index.html", "kredit/index.html", "finance/index.html"]

def stamp(path):
    return hashlib.sha1((ROOT / path.lstrip("/")).read_bytes()).hexdigest()[:8]

versions = {f: stamp(f) for f in FILES}
for page in PAGES:
    p = ROOT / page
    s = p.read_text()
    for f, v in versions.items():
        s = re.sub(re.escape(f) + r'(\?v=[0-9a-f]+)?"', f'{f}?v={v}"', s)
    p.write_text(s)
print("Stamped:", ", ".join(f"{f}?v={v}" for f, v in versions.items()))
