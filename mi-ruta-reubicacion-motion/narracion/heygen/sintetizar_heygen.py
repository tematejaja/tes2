#!/usr/bin/env python3
"""Síntesis de la narración con HeyGen (voz Camila Vega) a partir del guion vN.
HeyGen no admite marcas SSML: cada bloque se sintetiza entero (prosodia natural) y las marcas
se derivan de los tiempos por palabra (word_timestamps), alineando las palabras del audio con
las de cada segmento del guion. Donde la pausa natural es menor que la pausa diseñada se inserta
silencio. Salida cruda: heygen/crudo/{b}_{V}.wav (24 kHz mono) y .json (marcas, formato Google); luego ajustar_pausas.py.
Clave en la variable HEYGEN_API_KEY (nunca en el repositorio).
Uso: GUION_VERSION=v04 python3 sintetizar_heygen.py [BLOQUE ...]"""
import difflib, io, json, os, re, subprocess, sys, unicodedata, urllib.request, wave
from pathlib import Path
import numpy as np

N = Path(__file__).resolve().parent.parent
V = os.environ.get("GUION_VERSION", "v04")
VOICE = os.environ.get("HEYGEN_VOICE", "6ce26db0cb6f4e7881b85452619f7f19")  # Camila Vega
SPEED = float(os.environ.get("HEYGEN_SPEED", "1"))
KEY = os.environ["HEYGEN_API_KEY"]
SR = 24000
src = {"__file__": str(N / "guion.py")}
exec(compile((N / f"guion_v{V.lstrip('v').lstrip('0')}.py").read_text().split('if __name__ == "__main__":')[0], "guion", "exec"), src)
G, LEAD = src["G"], src["LEAD"]

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    return re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in w if unicodedata.category(c) != "Mn"))

CACHE = N / "heygen/cache"; CACHE.mkdir(exist_ok=True)
def tts(text):
    import hashlib
    h = hashlib.sha1(f"{VOICE}|{SPEED}|{text}".encode()).hexdigest()[:16]
    if (CACHE / f"{h}.json").exists():
        d = json.load(open(CACHE / f"{h}.json")); pcm = (CACHE / f"{h}.pcm").read_bytes()
        ws = [w for w in d["word_timestamps"] if not w["word"].strip().startswith("<")]
        return np.frombuffer(pcm, np.int16).astype(np.float32), ws
    r = urllib.request.Request("https://api.heygen.com/v3/voices/speech",
        data=json.dumps({"text": text, "voice_id": VOICE, "speed": SPEED}).encode(),
        headers={"X-Api-Key": KEY, "Content-Type": "application/json", "Accept": "application/json"})
    with urllib.request.urlopen(r, timeout=300) as f: d = json.load(f)
    d = d.get("data", d)
    with urllib.request.urlopen(d["audio_url"], timeout=300) as f: raw = f.read()
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-ac", "1", "-ar", str(SR), "-f", "s16le", "pipe:1"],
                         input=raw, capture_output=True, check=True).stdout
    json.dump({"word_timestamps": d["word_timestamps"]}, open(CACHE / f"{h}.json", "w")); (CACHE / f"{h}.pcm").write_bytes(pcm)
    ws = [w for w in d["word_timestamps"] if not w["word"].strip().startswith("<")]
    return np.frombuffer(pcm, np.int16).astype(np.float32), ws

def bloque(b):
    segs = [(m, t.replace("~", ""), p) for m, t, p in G[b]]
    text = " ".join(t for _, t, _ in segs)
    audio, ws = tts(text)
    # palabras del guion con su segmento
    gw, gs = [], []
    for k, (_, t, _) in enumerate(segs):
        for w in t.split():
            if norm(w): gw.append(norm(w)); gs.append(k)
    aw = [norm(w["word"]) for w in ws]
    sm = difflib.SequenceMatcher(None, gw, aw, autojunk=False)
    g2a = {}
    for a, bb, n in sm.get_matching_blocks():
        for i in range(n): g2a[a + i] = bb + i
    first, last = {}, {}
    for gi, k in enumerate(gs):
        if gi in g2a:
            first.setdefault(k, g2a[gi]); last[k] = g2a[gi]
    ratio = len(g2a) / max(1, len(gw))
    if ratio < .9 or len(first) != len(segs):
        raise SystemExit(f"{b}: alineación insuficiente ({ratio:.0%}, {len(first)}/{len(segs)} segmentos)")
    # construir audio con lead y pausas extra
    out = [np.zeros(int(SR * LEAD[b] / 1000), np.float32)]
    shift = LEAD[b] / 1000; cur = 0; marks = []; ins = 0.0; wt = []; wi = 0
    for k, (m, _, p) in enumerate(segs):
        st = ws[first[k]]["start"]
        if k == 0: st = max(0.0, st - .02)
        marks.append({"markName": m, "timeSeconds": round(shift + st, 4)})
        hasta = first[k + 1] if k + 1 < len(segs) else len(ws)
        while wi < hasta: wt.append([ws[wi]["word"], round(shift + ws[wi]["start"], 4), round(shift + ws[wi]["end"], 4)]); wi += 1
        if k + 1 < len(segs):
            e = ws[last[k]]["end"]; nx = ws[first[k + 1]]["start"]
            gap = max(0.0, nx - e); extra = max(0.0, p / 1000 - gap)
            if extra > .01:
                cut = int(SR * (e + min(gap, .08)))
                out.append(audio[cur:cut]); out.append(np.zeros(int(SR * extra), np.float32))
                cur = cut; shift += int(SR * extra) / SR; ins += extra
    out.append(audio[cur:])
    y = np.concatenate(out)
    # recortar silencio final a 0.15 s
    nz = np.nonzero(np.abs(y) > 200)[0]
    if len(nz): y = y[: min(len(y), nz[-1] + int(SR * .15))]
    with wave.open(str(N / f"heygen/crudo/{b}_{V}.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(np.clip(y, -32768, 32767).astype(np.int16).tobytes())
    json.dump(marks, open(N / f"heygen/crudo/{b}_{V}.json", "w"), indent=1)
    json.dump(wt, open(N / f"heygen/crudo/{b}_{V}_palabras.json", "w"), ensure_ascii=False)
    print(f"{b}: {len(y)/SR:6.2f} s (+{ins:.2f} s pausas) · alineación {ratio:.0%} · " + " ".join(f"{x['markName'].split('_',1)[1]}={x['timeSeconds']:.2f}" for x in marks), flush=True)
    return len(y) / SR

if __name__ == "__main__":
    tot = sum(bloque(b) for b in (sys.argv[1:] or list(G)))
    print(f"TOTAL voz {tot:.1f} s")
