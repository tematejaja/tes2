#!/usr/bin/env python3
"""Dibuja fotogramas con Chromium (Playwright). Uso: render_frames.py DESDE HASTA [SALIDA] [PROCESOS]
Con --muestras t1 t2 ... guarda solo esos instantes en segundos (para revisión)."""
import sys, os, json, multiprocessing as mp
from pathlib import Path
from playwright.sync_api import sync_playwright
AQUI = Path(__file__).resolve().parent
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
def trabajo(args):
    ids, out = args
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None, args=["--no-sandbox", "--allow-file-access-from-files", "--font-render-hinting=none"])
        pg = b.new_page(viewport={"width": 1920, "height": 1080})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto((AQUI / "scene.html").as_uri())
        for n in ids:
            pg.evaluate(f"setFrame({n})")
            pg.screenshot(path=str(Path(out) / f"f_{n:05d}.jpg"), type="jpeg", quality=92)
        if errs: print("ERRORES JS:", errs[:3], flush=True)
        b.close()
if __name__ == "__main__":
    if sys.argv[1] == "--muestras":
        out = AQUI / "muestras"; out.mkdir(exist_ok=True)
        tl = json.load(open(AQUI / "timeline.json")); ids = [int(float(x) * 24) for x in sys.argv[2:]]
        trabajo((ids, out)); sys.exit()
    a, b = int(sys.argv[1]), int(sys.argv[2]); out = Path(sys.argv[3] if len(sys.argv) > 3 else AQUI / "frames"); out.mkdir(exist_ok=True, parents=True)
    n = int(sys.argv[4]) if len(sys.argv) > 4 else 4
    ids = list(range(a, b)); chunks = [ids[i::n] for i in range(n)]
    with mp.Pool(n) as pool: pool.map(trabajo, [(c, out) for c in chunks])
