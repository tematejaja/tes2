#!/usr/bin/env python3
"""Muestras de voz con Chatterbox (MIT): modelo multilingüe base y ajuste latinoamericano.
Requiere acceso a huggingface.co. Uso: python3 muestras_chatterbox.py [voz_referencia.wav]"""
import sys, torch, torchaudio as ta
from pathlib import Path
from huggingface_hub import snapshot_download
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
OUT = Path(__file__).parent / "muestras"; OUT.mkdir(exist_ok=True)
FRASE = ("Cuando a una de estas familias le hablan de reubicarse, la pregunta no es solo a qué casa va a llegar. "
         "Es qué va a pasar con todo lo demás: su trabajo, sus vecinos, quien le cuida a los niños.")
ref = sys.argv[1] if len(sys.argv) > 1 else None
torch.set_num_threads(4)
modelos = {"base": None, "latam": "ResembleAI/Chatterbox-Multilingual-es-mx-latam"}
for nombre, repo in modelos.items():
    try:
        m = ChatterboxMultilingualTTS.from_pretrained("cpu") if repo is None else ChatterboxMultilingualTTS.from_local(Path(snapshot_download(repo)), "cpu")
    except Exception as e:
        print(nombre, "no disponible:", str(e)[:200]); continue
    for ex, cfg in ((0.5, 0.5), (0.7, 0.35)):
        w = m.generate(FRASE, language_id="es", audio_prompt_path=ref, exaggeration=ex, cfg_weight=cfg)
        f = OUT / f"chatterbox_{nombre}_exp{ex}_cfg{cfg}.wav"; ta.save(str(f), w, m.sr); print("ok", f)
