#!/usr/bin/env python3
"""Mezcla de audio: voz TTS (audios reales) + pad ambiental generativo + efectos suaves.
Todo el material sonoro no vocal se sintetiza aquí (sin licencias externas)."""
import json, subprocess, wave, numpy as np
from pathlib import Path
R = Path(__file__).resolve().parent.parent; A = Path(__file__).parent
SR = 48000
tl = json.load(open(A / "timeline.json")); N = int((tl["total"] + 1.0) * SR)

def leer(p):
    w = wave.open(str(p)); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    return x
voz = np.zeros(N, np.float32)
for b, v in tl["blocks"].items():
    tmp = A / f"_tmp_{b}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(R / f"narracion/wav/{b}_v01.wav"), "-ar", str(SR), "-ac", "1", str(tmp)], check=True)
    x = leer(tmp); s = int(v["start"] * SR); voz[s:s + len(x)] += x; tmp.unlink()
# --- pad ambiental: progresión lenta Am – F – C – G, 8 s por acorde
rng = np.random.default_rng(3)
def nota(f, dur, a=2.5, r=3.0, amp=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    env = np.minimum(1, t / a) * np.minimum(1, (dur - t) / r)
    y = (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.003 * t) + .2 * np.sin(2 * np.pi * f * .5 * t)) * env
    return y.astype(np.float32) * amp
acordes = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 261.6, 329.6], [196.0, 246.9, 293.7]]
mus = np.zeros(N, np.float32); k = 0; t0 = 0.0
while t0 < tl["total"]:
    for f in acordes[k % 4]:
        y = nota(f, 10.5, amp=.11); s = int(t0 * SR); e = min(N, s + len(y)); mus[s:e] += y[:e - s]
    # arpegio suave (pluck): solo desde el motivo de la ruta (E1) en adelante
    if t0 >= tl["blocks"]["E1"]["start"] - 1:
        for j, f in enumerate(acordes[k % 4] * 2):
            ts = t0 + 1.0 + j * 1.3; s = int(ts * SR)
            if s >= N: break
            n = int(1.6 * SR); tt = np.arange(n) / SR; y = np.sin(2 * np.pi * f * 2 * tt) * np.exp(-tt * 2.6) * .045
            e = min(N, s + n); mus[s:e] += y[:e - s].astype(np.float32)
    t0 += 8.0; k += 1
# intro más tenue y salida con fundido
fade_in = np.minimum(1, np.arange(N) / (3 * SR)); fade_out = np.minimum(1, (N - np.arange(N)) / (4 * SR))
mus *= fade_in * fade_out
# ducking según la envolvente de la voz
def mm(x, n):
    c = np.cumsum(np.insert(x.astype(np.float64), 0, 0)); h = n // 2
    i = np.arange(len(x)); lo = np.clip(i - h, 0, len(x)); hi = np.clip(i + h, 0, len(x))
    return ((c[hi] - c[lo]) / np.maximum(1, hi - lo)).astype(np.float32)
env = mm(np.abs(voz), int(.25 * SR))
duck = 1 - .72 * np.clip(env / .03, 0, 1); duck = mm(duck, int(.3 * SR))
mus *= duck.astype(np.float32)
# --- efectos suaves anclados a las marcas
sfx = np.zeros(N, np.float32)
def campana(t, f=880, amp=.12, dec=3.0):
    s = int(t * SR); n = int(2.2 * SR); tt = np.arange(n) / SR
    y = (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt * dec) * amp
    e = min(N, s + n); sfx[s:e] += y[:e - s].astype(np.float32)
def pulso(t, f=110, amp=.2):
    s = int(t * SR); n = int(1.0 * SR); tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 4) * amp
    e = min(N, s + n); sfx[s:e] += y[:e - s].astype(np.float32)
M = tl["marks"]; B = tl["blocks"]
campana(13.9, 660, .10)                                  # la línea nace
for b in ("C1", "C2", "C3", "C4", "C5", "C6"): campana(B[b]["start"] + .05, 523, .08)   # cambio de etapa
campana(M["C1_corrige"] + .2, 784, .10)                  # ficha revisada
pulso(M["C1_urgencia"] + .6, 98, .22)                    # canal de emergencia
campana(M["C3_ajustes"] + .3, 988, .09)                  # propuesta aceptada con ajustes
campana(B["C3"]["start"] + B["C3"]["audio"], 587, .12)   # preparación entregada
campana(M["C4_confirma"] + .6, 880, .10)                 # recibido
pulso(M["C5_alerta"] + .3, 98, .22)                      # alerta
campana(M["C5_cierre"] + 3.6, 1046, .11)                 # alerta cerrada con confirmación
campana(M["C6_llaves"] + .1, 440, .10)                   # llaves
mix = voz * 1.0 + mus * 1.0 + sfx
pico = np.max(np.abs(mix)); mix = mix / max(1, pico / .89)
st = np.stack([mix, mix], 1)
out = A / "mezcla.wav"
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("mezcla", out, round(N / SR, 1), "s")
