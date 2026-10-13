#!/usr/bin/env python3
"""Exporta la capa de sonido para sound-layer (mix.py) a partir de la línea de tiempo real.
Cada cue se calcula con las mismas expresiones de tiempo que usan las escenas (scenes_*.js, ui.js):
marcas de voz + desfases de G()/win(); nunca se escriben fotogramas a mano.
Escribe ../audio/cues.json, ../audio/vo.wav (narración) y ../audio/music.wav (Bach, Preludio n.º 1, CC0).
Uso (desde mi-ruta-reubicacion-motion/): python3 animacion/export_cues.py"""
import json, os, subprocess, wave
from pathlib import Path
import numpy as np

R = Path(__file__).resolve().parent.parent
A = R / "audio"; A.mkdir(exist_ok=True)
V = os.environ.get("GUION_VERSION", "v04")
TL = json.load(open(R / "animacion/timeline.json"))
M, B, TOTAL = TL["marks"], TL["blocks"], TL["total"]
SR = 48000
aud_end = lambda b: B[b]["start"] + B[b]["audio"]

# ---------- voz: los diez bloques en su lugar ----------
vo = np.zeros(int(TOTAL * SR) + SR, np.float32)
for b, v in B.items():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(R / f"narracion/wav/{b}_{V}.wav"), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32); s = int(v["start"] * SR); vo[s:s + len(x)] += x
vo = vo[: int(TOTAL * SR)]
with wave.open(str(A / "vo.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(vo, -1, 1) * 32767).astype(np.int16).tobytes())

# ---------- música: Preludio n.º 1 (Kimiko Ishizaka, CC0); fundido cruzado en la tarjeta de la etapa 3 ----------
src = R / "audio/music_src/bach_p1.flac"
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(src), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
p = np.frombuffer(raw, np.float32).reshape(-1, 2)
lead = int(np.argmax(np.abs(p).max(1) > 10 ** (-50 / 20)))       # la grabación empieza con ~1 s de silencio
p = p[max(0, lead - int(.02 * SR)):]
seam, xf = B["C3"]["start"], 3.0                       # la segunda vuelta entra con "Etapa 3"
n = int(TOTAL * SR); mus = np.zeros((n, 2), np.float32)
a_len = int((seam + xf / 2) * SR); a = p[:a_len].copy()
ramp = np.linspace(1, 0, int(xf * SR))[:, None]; a[-len(ramp):] *= ramp
mus[:a_len] += a
b0 = int((seam - xf / 2) * SR); bseg = p[: n - b0].copy()
bseg[: len(ramp)] *= ramp[::-1]; mus[b0:b0 + len(bseg)] += bseg
with wave.open(str(A / "music.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mus, -1, 1) * 32767).astype(np.int16).tobytes())

# ---------- cues (familia sonora: madera cálida + vidrio/tic suave; un archivo distinto por cue salvo motivos) ----------
K = lambda t, n: f"{t}/kenney-{n}"
WOOD = lambda n: K("tap", f"impact-impact-wood-{n}")
GLASS = K("chime", "interface-glass-001"); CLOTH = K("swish", "rpg-cloth1"); CARD = K("swish", "casino-card-slide-4")
SEL = lambda n: K("ui", f"interface-select-00{n}"); DROP = lambda n: K("pop", f"interface-drop-00{n}")
BOOM0, BOOM1 = K("boom", "scifi-low-frequency-explosion-000"), K("boom", "scifi-low-frequency-explosion-001")
cues = []
def cue(cid, t, sound, weight="support", visual="appear", pan=0.0, **kw):
    cues.append(dict(id=cid, t=round(t, 3), sound=sound, weight=weight, align="peak", pan=pan, visual=visual, **kw))

# E0 — gancho (tag '¿A qué casa…?' win(pregunta+.3); '¿Y todo lo demás?' win(demas); íconos G(demas+1.3+i*.9))
cue("e0-pregunta", M["E0_pregunta"] + .3, SEL(5))
cue("e0-demas", M["E0_demas"], DROP(2))
cue("e0-icono1", M["E0_demas"] + 1.3, DROP(3), pan=-.3)
cue("e0-icono2", M["E0_demas"] + 2.2, DROP(4), pan=.4)
# E1 — guía inexistente G(guia+1.6); título MI RUTA (héroe, el recorte arranca en tA); puertas G(complementa); validado G(validar)
cue("e1-noexiste", M["E1_guia"] + 1.6, SEL(2))
cue("e1-titulo", M["E1_titulo"] + .05, WOOD("heavy-003") + "+" + BOOM0, weight="hero", stop_before=True, build=True)
cue("e1-puertas", M["E1_complementa"], WOOD("medium-000"))
cue("e1-validado", M["E1_validar"], SEL(1))
# E2 — G(gestora+.5), G(ficha), G(historia) ✓, ruta (tR-.2, fundido eio), financiera (resil+5.1), mesas (+2.8)
cue("e2-gestora", M["E2_gestora"] + .5, WOOD("medium-002"), pan=-.4)
cue("e2-ficha", M["E2_ficha"], WOOD("medium-003"))
cue("e2-historia", M["E2_historia"], WOOD("light-003"))
cue("e2-ruta", M["E2_ruta"] - .2, CLOTH)
cue("e2-financiera", M["E2_resil"] + 5.1, WOOD("medium-004"), pan=.3)
cue("e2-todo", M["E2_mesas"] + 2.8, SEL(6))
# tarjetas de etapa (ui.js chapterCard: desliza desde la izquierda; C1 llega con "En la primera etapa")
for i, b in enumerate(("C1", "C2", "C3", "C4", "C5", "C6")):
    snd = {"C2": K("paper", "casino-cards-pack-open-2"), "C4": CARD, "C6": CARD}.get(b, CLOTH)
    cue(f"etapa{i+1}", (M["C1_escucha"] - .2 if b == "C1" else B[b]["start"]), snd, visual="move", pan=-.3)
# C1
cue("c1-conservar", M["C1_escucha"] + 5.3, DROP(2), pan=-.2)
cue("c1-propone", M["C1_escucha"] + 6.5, DROP(3), pan=-.4)
cue("c1-mesa", M["C1_mesa"] + 2.6, DROP(4), pan=.4)
cue("c1-revisada", M["C1_corrige"] + .2, WOOD("medium-001"))
cue("c1-nogarantiza", M["C1_nogarantiza"] + 2.5, K("tap", "impact-impact-plank-medium-003"), pan=-.4)
cue("c1-noobliga", M["C1_nogarantiza"] + 4.1, K("tap", "impact-impact-punch-medium-000"), pan=-.4)
# C2 (propuestas +2.8/+3.4, evaluación +4.6; P-01 +3.6)
cue("c2-propuesta1", M["C2_participa"] + 2.8, WOOD("medium-000"), pan=.3)
cue("c2-propuesta2", M["C2_participa"] + 3.4, WOOD("medium-002"), pan=.3)
cue("c2-evalua", M["C2_participa"] + 4.6, GLASS, pan=.3)
cue("c2-p01", M["C2_propuesta"] + 3.6, K("tap", "impact-impact-punch-medium-001"))
# C3 (aceptada G(incidencia+.3); hoja G(hoja); sello PREPARACIÓN ENTREGADA: héroe en ts = sello-.15)
cue("c3-aceptada", M["C3_incidencia"] + .3, GLASS)
cue("c3-hoja", M["C3_hoja"], CARD, pan=.4)
cue("c3-sello", M["C3_sello"] - .15 + .1, K("tap", "impact-impact-punch-medium-004") + "+" + BOOM1, weight="hero", stop_before=True, build=True)
# C4 (formación +4.3; recibido; traslado efectivo: héroe en A+.2…A+.6)
cue("c4-formacion", M["C4_finanzas"] + 4.3, SEL(3), pan=.2)
cue("c4-recibido", M["C4_confirma"], DROP(1), pan=.3)
cue("c4-traslado", aud_end("C4") + .3, WOOD("medium-001") + "+" + BOOM0, weight="hero", stop_before=True, build=True)
# C5 (alerta G(alerta+.3); cerrada ✓ cierre+1.15)
cue("c5-alerta", M["C5_alerta"] + .3, WOOD("heavy-003"), pan=-.3)
cue("c5-cerrada", M["C5_cierre"] + 1.15, GLASS, pan=-.3)
# C6 (cumplido revisa+3.9; receptor pendiente+2.9; llaves; socio medicion+6.4)
cue("c6-cumplido", M["C6_revisa"] + 3.9, SEL(4), pan=-.3)
cue("c6-receptor", M["C6_pendiente"] + 2.9, WOOD("medium-004"), pan=.4)
cue("c6-llaves", M["C6_llaves"] + .1, K("tap", "impact-impact-plate-heavy-001"))
cue("c6-socio", M["C6_medicion"] + 6.4, SEL(5), pan=.3)
# E9 (no de traslados; lema)
cue("e9-notraslados", M["E9_notraslados"], SEL(7))
cue("e9-lema", M["E9_final"] + 9.1, GLASS)
# créditos: "MI RUTA DE REUBICACIÓN" entra en fundido (sceneCR: eo(prog(lt,.5,1.0)) → mayor cambio al arrancar)
cue("cr-titulo", TL["cr_start"] + .5 + 1 / TL["fps"], K("tap", "impact-impact-plank-medium-003") + "+" + BOOM1, weight="hero", stop_before=True, build=True)

sheet = {"fps": TL["fps"], "duration_s": round(TOTAL, 3), "energy": "calm", "lufs": -14, "kit": "audio/kit",
         "music": {"file": "audio/music.wav", "start_s": 0, "loop": False, "fade_out_s": 3.0},
         "voice": [{"file": "audio/vo.wav", "start_s": 0}],
         "silence_ok": [[round(TOTAL - 1.0, 3), round(TOTAL, 3)]],
         "cues": sorted(cues, key=lambda c: c["t"])}
json.dump(sheet, open(A / "cues.json", "w"), ensure_ascii=False, indent=1)
print(len(cues), "cues;", sum(c["weight"] == "hero" for c in cues), "héroes; música", round(len(mus) / SR, 1), "s")
