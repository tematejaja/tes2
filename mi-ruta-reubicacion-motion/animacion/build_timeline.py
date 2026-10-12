#!/usr/bin/env python3
"""Construye timeline.json: inicio de cada bloque, marcas absolutas y subtítulos,
a partir de los audios reales (narracion/wav) y sus timepoints."""
import json, re, wave
from pathlib import Path
R = Path(__file__).resolve().parent.parent
BLOQUES = ["E0","E1","E2","C1","C2","C3","C4","C5","C6","E9"]
import os
V = os.environ.get("GUION_VERSION", "v02")
REMATE = dict(E0=0.3,E1=0.6,E2=0.5,C1=0.5,C2=0.5,C3=1.4,C4=1.4,C5=0.5,C6=0.8,E9=0.5)
CR = 10.0
tl = {"fps": 24, "blocks": {}, "marks": {}, "cues": []}
t = 0.0
for b in BLOQUES:
    w = wave.open(str(R/f"narracion/wav/{b}_{V}.wav")); dur = w.getnframes()/w.getframerate()
    tps = json.load(open(R/f"narracion/timepoints/{b}_{V}.json"))
    marks = [(m["markName"], m["timeSeconds"]) for m in tps]
    ssml = (R/f"narracion/ssml/{b}_{V}.ssml").read_text()
    # segmentos de texto entre marcas
    body = ssml.replace("<speak>","").replace("</speak>","")
    pieces = re.split(r'<mark name="([^"]+)"/>', body)
    segs = []
    for i in range(1, len(pieces), 2):
        txt = re.sub(r"<[^>]+>", " ", pieces[i+1]); txt = " ".join(txt.split())
        segs.append((pieces[i], txt))
    tl["blocks"][b] = {"start": t, "audio": dur, "end": t+dur+REMATE[b], "tail": REMATE[b]}
    names = [m[0] for m in marks]
    for k,(n,tm) in enumerate(marks):
        tl["marks"][n] = t + tm
    for k,(n,txt) in enumerate(segs):
        s = t + dict(marks)[n]
        e = t + (dict(marks)[segs[k+1][0]] if k+1 < len(segs) else dur)
        if txt: tl["cues"].append({"mark": n, "s": s, "e": e, "text": txt})
    t += dur + REMATE[b]
tl["cr_start"] = t; tl["total"] = t + CR
# partir cues largos en trozos <= 84 caracteres (2 líneas de 42) con tiempo proporcional
def trocear(txt, maxc=84):
    import math
    n = max(1, math.ceil(len(txt) / maxc)); tgt = len(txt) / n
    ws = txt.split(); out=[]; cur=""
    for w in ws:
        if cur and len(cur) + 1 + len(w) > maxc or (cur and len(cur) >= tgt * .92 and len(out) < n - 1): out.append(cur); cur=w
        else: cur = (cur+" "+w).strip()
    if cur: out.append(cur)
    return out
final = []
for c in tl["cues"]:
    parts = trocear(c["text"]); tot = sum(len(p) for p in parts); s = c["s"]
    # el cue termina 0.1 s antes de la siguiente voz o al acabar el audio de la frase
    dur = (c["e"] - c["s"])
    for p in parts:
        d = dur * len(p) / tot
        final.append({"s": round(s,3), "e": round(s+d-0.05,3), "text": p}); s += d
tl["cues"] = final
json.dump(tl, open(Path(__file__).parent/"timeline.json","w"), ensure_ascii=False, indent=1)
print("total %.1f s = %d:%04.1f" % (tl["total"], tl["total"]//60, tl["total"]%60))
for b,v in tl["blocks"].items(): print(b, round(v["start"],1), round(v["end"],1))
print("cr", round(tl["cr_start"],1), "cues", len(final))
# SRT / VTT
def f(x, sep):
    h=int(x//3600); m=int(x%3600//60); s=x%60
    return f"{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s-int(s))*1000)):03d}"
srt = "\n".join(f"{i+1}\n{f(c['s'],',')} --> {f(c['e'],',')}\n{c['text']}\n" for i,c in enumerate(final))
vtt = "WEBVTT\n\n" + "\n".join(f"{f(c['s'],'.')} --> {f(c['e'],'.')}\n{c['text']}\n" for c in final)
(R/"subtitulos").mkdir(exist_ok=True)
(R/f"subtitulos/mi_ruta_es_{V}.srt").write_text(srt); (R/f"subtitulos/mi_ruta_es_{V}.vtt").write_text(vtt)

open(Path(__file__).parent/"timeline.js","w").write("const TL = "+json.dumps(tl,ensure_ascii=False)+";\n")
