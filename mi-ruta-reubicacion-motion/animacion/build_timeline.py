#!/usr/bin/env python3
"""Construye timeline.json: inicio de cada bloque, marcas absolutas y subtítulos,
a partir de los audios reales (narracion/wav) y sus timepoints."""
import json, re, wave
from pathlib import Path
R = Path(__file__).resolve().parent.parent
BLOQUES = ["E0","E1","E2","C1","C2","C3","C4","C5","C6","E9"]
import os
V = os.environ.get("GUION_VERSION", "v04")
REMATE = dict(E0=0.3,E1=0.4,E2=0.4,C1=0.4,C2=0.4,C3=0.7,C4=1.4,C5=0.4,C6=0.5,E9=2.0)
CR = 5.6
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
STOP = {"nos","me","te","les","se","lo","los","la","las","una","un","de","del","que","sobre","no","y","o","a","al","en","con","por","para","su","sus","el","le","cada","es","entre","sin"}
PROT = ["durante doce meses", "técnicas y comunitarias", 'doscientos hogares', 'resiliencia financiera', 'primera cuenta bancaria', 'socio académico', 'oferta de vivienda', 'formación financiera', 'gastos esenciales', 'ingresos netos', 'nuevo hogar', 'lugar de riesgo', 'mesas de trabajo', 'descripción pública', 'paso a paso', 'cabeza de hogar', 'ficha de caracterización familiar', 'ficha de caracterización', 'preparación entregada', 'entidad competente', 'receptor de continuidad', 'doce meses', 'trescientos cincuenta hogares', 'una casa nueva', 'nuestra historia', 'Mi Ruta de Reubicación', 'mesa comunitaria', 'mesa técnica', 'plan económico de transición', 'hoja de devolución', 'canal de emergencia', 'atención pendiente', 'Bella Flor', 'Ciudad Bolívar', 'la mamá', 'gestora social', 'nuevo hogar', 'nueva vivienda']
def dentro(ws, k):
    """True si cortar antes de ws[k] parte un término protegido."""
    low = " ".join(ws).lower(); pos = len(" ".join(ws[:k]))
    for p in PROT:
        for m in __import__("re").finditer(__import__("re").escape(p.lower()), low):
            if m.start() < pos < m.end(): return True
    return False
def partir(txt, maxc):
    """Parte en dos cerca de la mitad, sin dejar al final de la primera parte una palabra átona."""
    ws = txt.split(); best = None
    for k in range(1, len(ws)):
        a = " ".join(ws[:k]); b = " ".join(ws[k:])
        if max(len(a), len(b)) > maxc * 1.25: continue
        pen = abs(len(a) - len(b)) + (50 if min(len(a), len(b)) < 16 else 0) + (60 if ws[k-1].lower().strip(",;:") in STOP else 0) - (25 if ws[k-1][-1] in ",;:" else 0) + (200 if dentro(ws, k) else 0) + (40 if ws[k].lower() in ("que", "de") else 0)
        if best is None or pen < best[0]: best = (pen, a, b)
    return [best[1], best[2]] if best else [txt]
def trocear(txt, maxc=84):
    import re
    if len(txt) <= maxc: return [txt]
    out = []
    for parte in [p.strip() for p in re.split(r"(?<=[;:])\s+", txt) if p.strip()]:
        if len(parte) <= maxc: out.append(parte); continue
        cur = ""
        for c in [c.strip() for c in re.split(r"(?<=,)\s+", parte) if c.strip()]:
            if cur and len(cur) + 1 + len(c) > maxc: out.append(cur); cur = c
            else: cur = (cur + " " + c).strip()
        if cur: out.append(cur)
    res = []
    for o in out:
        res += trocear(" ".join(partir(o, maxc)[0:1]), maxc) + trocear(" ".join(partir(o, maxc)[1:]), maxc) if len(o) > maxc else [o]
    # unir trozos muy cortos con el vecino
    fin = []
    for r in res:
        if fin and (len(r) < 18 or len(fin[-1]) < 18) and len(fin[-1]) + 1 + len(r) <= maxc + 10: fin[-1] += " " + r
        else: fin.append(r)
    return fin
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
