#!/usr/bin/env python3
"""Lista voces en español de HeyGen y genera muestras con la frase del gancho.
Clave en la variable HEYGEN_API_KEY (nunca en el repositorio).
Uso: python3 voces_heygen.py listar | python3 voces_heygen.py muestras VOICE_ID [VOICE_ID ...]"""
import json, os, sys, urllib.request
from pathlib import Path
API = "https://api.heygen.com"; KEY = os.environ["HEYGEN_API_KEY"]
FRASE = ("Cuando a una de estas familias le hablan de reubicarse, la pregunta no es solo a qué casa va a llegar. "
         "Es qué va a pasar con todo lo demás: su trabajo, sus vecinos, quien le cuida a los niños.")
def req(path, body=None):
    r = urllib.request.Request(API + path, data=None if body is None else json.dumps(body).encode(),
        headers={"X-Api-Key": KEY, "Content-Type": "application/json", "Accept": "application/json"})
    with urllib.request.urlopen(r, timeout=120) as f: return json.load(f)
def listar():
    voces, tok = [], None
    while True:
        q = "/v3/voices?language=Spanish&limit=100" + (f"&token={tok}" if tok else "")
        d = req(q); data = d.get("data", d)
        items = data.get("voices") or data.get("items") or data if isinstance(data, (list, dict)) else []
        if isinstance(items, dict): items = items.get("voices", [])
        voces += items; tok = (data.get("next_token") if isinstance(data, dict) else None)
        if not tok: break
    # priorizar acentos latinoamericanos / colombianos
    def score(v):
        s = json.dumps(v, ensure_ascii=False).lower()
        return (("colomb" in s) * 3 + any(k in s for k in ("latin", "latam", "mexic", "es-419", "es-co", "es-mx")) * 2 + ("natural" in s or "conversational" in s))
    voces.sort(key=score, reverse=True)
    Path(__file__).with_name("voces_es.json").write_text(json.dumps(voces, ensure_ascii=False, indent=1))
    for v in voces[:40]:
        print(score(v), v.get("voice_id") or v.get("id"), "|", v.get("name"), "|", v.get("gender"), "|", v.get("language"), "|", v.get("accent") or v.get("locale") or "", "|", v.get("preview_audio") or v.get("preview_audio_url") or "")
def muestras(ids):
    out = Path(__file__).with_name("muestras"); out.mkdir(exist_ok=True)
    for i, vid in enumerate(ids, 1):
        try:
            d = req("/v1/audio/text_to_speech", {"text": FRASE, "voice_id": vid, "speed": 1.0})
        except Exception as e:
            print(vid, "error:", e); continue
        url = json.dumps(d)
        u = (d.get("data") or {}).get("audio_url") or (d.get("data") or {}).get("url")
        if u: urllib.request.urlretrieve(u, out / f"{i:02d}_{vid}.mp3"); print("ok", vid)
        else: print(vid, "respuesta:", url[:300])
if __name__ == "__main__":
    listar() if sys.argv[1] == "listar" else muestras(sys.argv[2:])
