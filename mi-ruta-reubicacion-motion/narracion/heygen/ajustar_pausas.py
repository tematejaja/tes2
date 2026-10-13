#!/usr/bin/env python3
"""Ajuste de duración sin resintetizar: comprime los silencios internos largos de la voz HeyGen
y aplica un tempo global leve (rubberband, conserva el tono). Reasigna las marcas.
Entrada: heygen/crudo/{b}_{V}.wav + .json (salida directa de sintetizar_heygen.py).
Salida: wav/{b}_{V}.wav y timepoints/{b}_{V}.json.
Uso: GUION_VERSION=v04 TEMPO=1.025 python3 ajustar_pausas.py"""
import json, os, subprocess, wave
from pathlib import Path
import numpy as np

N = Path(__file__).resolve().parent.parent
V = os.environ.get("GUION_VERSION", "v04")
TEMPO = float(os.environ.get("TEMPO", "1.0"))
CAP = float(os.environ.get("CAP", "0.40"))          # silencio interno máximo (s)
SR = 24000
# pausas que se conservan más largas (marca que SIGUE a la pausa → tope en s)
LARGAS = {"E0_cbolivar": .75, "E0_bellaflor": .75, "E0_pregunta": .7, "E9_frase": .65, "E9_final": .65,
          "E1_titulo": .5, "C6_retorno": .5, "C6_llaves": .5}

def silencios(y):
    hop = 240; fr = len(y) // hop
    rms = np.sqrt(np.mean(y[:fr * hop].reshape(fr, hop) ** 2, axis=1)); sil = rms < 150
    out, i = [], 0
    while i < fr:
        if sil[i]:
            j = i
            while j < fr and sil[j]: j += 1
            out.append((i * hop, j * hop)); i = j
        else: i += 1
    return out

def bloque(b):
    w = wave.open(str(N / f"heygen/crudo/{b}_{V}.wav")); y = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
    marks = json.load(open(N / f"heygen/crudo/{b}_{V}.json"))
    mt = [(m["markName"], m["timeSeconds"] * SR) for m in marks]
    keep, cuts = [], []          # cuts: (posición original, muestras quitadas)
    cur = 0
    for a, z in silencios(y):
        if a < SR * .05 or z > len(y) - SR * .05: continue     # silencio inicial (lead) y final intactos
        nxt = [n for n, t in mt if a - SR * .1 <= t <= z + SR * .35]
        cap = max([LARGAS.get(n, CAP) for n in nxt] or [CAP])
        d = z - a; c = int(cap * SR)
        if d <= c: continue
        s0 = a + c // 2; s1 = z - (c - c // 2)
        keep.append(y[cur:s0]); cuts.append((s0, s1 - s0)); cur = s1
    keep.append(y[cur:]); y2 = np.concatenate(keep)
    def remap(t):
        return t - sum(n if p + n <= t else max(0, t - p) for p, n in cuts if p < t)
    pcm = np.clip(y2 * .92, -32768, 32767).astype(np.int16).tobytes()   # margen: rubberband puede sobrepasar el pico
    if abs(TEMPO - 1) > 1e-4:
        pcm = subprocess.run(["ffmpeg", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "pipe:0",
                              "-af", f"rubberband=tempo={TEMPO}:transients=smooth:window=standard", "-f", "s16le", "pipe:1"],
                             input=pcm, capture_output=True, check=True).stdout
    with wave.open(str(N / f"wav/{b}_{V}.wav"), "wb") as o:
        o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes(pcm)
    nm = [{"markName": n, "timeSeconds": round(remap(t) / SR / TEMPO, 4)} for n, t in mt]
    json.dump(nm, open(N / f"timepoints/{b}_{V}.json", "w"), indent=1)
    pw = N / f"heygen/crudo/{b}_{V}_palabras.json"
    if pw.exists():
        ws = [[w, round(remap(s0 * SR) / SR / TEMPO, 3), round(remap(e0 * SR) / SR / TEMPO, 3)] for w, s0, e0 in json.load(open(pw))]
        json.dump(ws, open(N / f"timepoints/{b}_{V}_palabras.json", "w"), ensure_ascii=False)
    d0, d1 = len(y) / SR, len(pcm) / 2 / SR
    print(f"{b}: {d0:6.2f} → {d1:6.2f} s ({sum(n for _, n in cuts)/SR:.2f} s de silencio menos)")
    return d1

if __name__ == "__main__":
    import sys
    tot = sum(bloque(b) for b in (sys.argv[1:] or "E0 E1 E2 C1 C2 C3 C4 C5 C6 E9".split()))
    print(f"TOTAL voz {tot:.1f} s")
