#!/usr/bin/env python3
"""Recorre el video cada N fotogramas y lista problemas de maquetación. Uso: qa_run.py [paso=6]"""
import sys, json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
A = Path(__file__).resolve().parent; CH = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
paso = int(sys.argv[1]) if len(sys.argv) > 1 else 6
tl = json.load(open(A / "timeline.json")); n = int(tl["total"] * 24)
agg = {}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CH, args=["--no-sandbox", "--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto((A / "scene.html").as_uri())
    for f in range(0, n, paso):
        pg.evaluate(f"setFrame({f})")
        for kind, s in pg.evaluate("qaFrame()"):
            k = (kind, s); agg.setdefault(k, []).append(f / 24)
    b.close()
for (kind, s), ts in sorted(agg.items(), key=lambda x: x[1][0]):
    print(f"{kind:15s} {ts[0]:6.1f}–{ts[-1]:6.1f}s ({len(ts):3d})  {s[:110]}")
print("ERRORES JS:", errs[:5]); print("TOTAL hallazgos únicos:", len(agg))
