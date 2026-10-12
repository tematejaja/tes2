#!/usr/bin/env python3
"""Síntesis y calibración de la narración con Google Cloud Text-to-Speech.

Solo usa la biblioteca estándar. Credenciales: variable de entorno GOOGLE_API_KEY (clave de API) o, si no existe,
`gcloud auth login` con GOOGLE_CLOUD_PROJECT como proyecto de cuota.

Uso (desde la carpeta narracion/):
  python3 sintetizar.py voces                       # lista voces es-US
  python3 sintetizar.py casting                     # E1 y C3 con 3 voces candidatas
  python3 sintetizar.py calibrar --voz es-US-Neural2-A [--rate 1.0]
  python3 sintetizar.py sintetizar --voz es-US-Neural2-A [--rate 1.0] [--bloques E0 C1]
"""
import argparse, base64, json, os, re, subprocess, sys, urllib.request, wave
from pathlib import Path

AQUI = Path(__file__).parent
SSML = AQUI / "ssml"
WAV = AQUI / "wav"
TP = AQUI / "timepoints"
BLOQUES = ["E0", "E1", "E2", "C1", "C2", "C3", "C4", "C5", "C6", "E9"]
CANDIDATAS = ["es-US-Neural2-A", "es-US-Chirp3-HD-Aoede", "es-US-Neural2-B"]
TASA_MINIMA = 2.3  # palabras/s exigidas por el plan (§8.2 paso 4)
PAUSAS_S = 20.75   # suma de <break> del Anexo B (§8.6)
V1 = "https://texttospeech.googleapis.com/v1"
V1B = "https://texttospeech.googleapis.com/v1beta1"


def token():
    out = subprocess.run(["gcloud", "auth", "print-access-token"],
                         capture_output=True, text=True)
    if out.returncode:
        out = subprocess.run(["gcloud", "auth", "application-default", "print-access-token"],
                             capture_output=True, text=True)
    if out.returncode:
        sys.exit("No hay credenciales: ejecute `gcloud auth login`.\n" + out.stderr)
    return out.stdout.strip()


def llamar(url, cuerpo=None):
    h = {"Content-Type": "application/json"}
    clave = os.environ.get("GOOGLE_API_KEY")
    if clave:  # clave de API: nunca se guarda en archivos del repositorio
        url += ("&" if "?" in url else "?") + "key=" + clave
    else:
        h["Authorization"] = f"Bearer {token()}"
        proyecto = os.environ.get("GOOGLE_CLOUD_PROJECT")
        if proyecto:
            h["x-goog-user-project"] = proyecto
    req = urllib.request.Request(url, data=None if cuerpo is None else json.dumps(cuerpo).encode(), headers=h)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")


def solo_texto(ssml):
    return re.sub(r"<[^>]+>", " ", ssml)


def palabras(ssml):
    return len(solo_texto(ssml).split())


def sintetizar_ssml(ssml, voz, rate, marcas=True):
    cuerpo = {
        "input": {"ssml": ssml},
        "voice": {"languageCode": "es-US", "name": voz},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000,
                        "speakingRate": rate, "pitch": 0.0},
    }
    if marcas:
        cuerpo["enableTimePointing"] = ["SSML_MARK"]
    r = llamar(f"{V1B}/text:synthesize", cuerpo)
    return base64.b64decode(r["audioContent"]), r.get("timepoints", [])


def guardar(nombre, audio, tps):
    WAV.mkdir(exist_ok=True); TP.mkdir(exist_ok=True)
    (WAV / f"{nombre}.wav").write_bytes(audio)
    (TP / f"{nombre}.json").write_text(json.dumps(tps, ensure_ascii=False, indent=1))


def duracion(wav_path):
    with wave.open(str(wav_path)) as w:
        return w.getnframes() / w.getframerate()


def leer(b, version="v01"):
    return (SSML / f"{b}_{version}.ssml").read_text()


def cmd_voces(_):
    r = llamar(f"{V1}/voices?languageCode=es-US")
    for v in sorted(r.get("voices", []), key=lambda v: v["name"]):
        print(v["name"], v.get("ssmlGender", ""), v.get("naturalSampleRateHertz", ""))


def cmd_casting(a):
    for voz in CANDIDATAS:
        for b in ("E1", "C3"):
            ssml = leer(b)
            try:
                audio, tps = sintetizar_ssml(ssml, voz, 1.0)
            except SystemExit as e:
                # Chirp 3 HD no admite SSML: se sintetiza texto plano.
                print(f"[{voz}] {b}: {e}; se reintenta sin SSML ni marcas")
                cuerpo = {"input": {"text": " ".join(solo_texto(ssml).split())},
                          "voice": {"languageCode": "es-US", "name": voz},
                          "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000}}
                audio, tps = base64.b64decode(llamar(f"{V1}/text:synthesize", cuerpo)["audioContent"]), []
            n = f"casting_{voz}_{b}"
            guardar(n, audio, tps)
            print(f"{n}: {duracion(WAV / (n + '.wav')):.1f} s")
    print("Escuche los archivos de wav/ a ciegas y puntúe 1–5 (plan §8.2).")


def cmd_calibrar(a):
    total, pal = 0.0, 0
    for b in BLOQUES:
        ssml = leer(b)
        audio, tps = sintetizar_ssml(ssml, a.voz, a.rate)
        n = f"{b}_calibracion_{a.voz}_{a.rate}"
        guardar(n, audio, tps)
        d = duracion(WAV / (n + ".wav"))
        total += d; pal += palabras(ssml)
        print(f"{b}: {d:.1f} s")
    tasa = pal / (total - PAUSAS_S)
    final = total + 19.8
    print(f"\nPalabras {pal} · audio {total:.1f} s · tasa efectiva {tasa:.2f} p/s")
    print(f"Duración proyectada del video (audio + remates + créditos): {int(final//60)}:{final%60:04.1f}")
    if tasa < TASA_MINIMA:
        print(f"NO CUMPLE: tasa < {TASA_MINIMA}. Suba --rate o aplique los recortes R1–R5 (plan §8.6).")
    elif not 190 <= final <= 230:
        print("Fuera de la banda 3:10–3:50: aplique los recortes de §8.6 antes de congelar el guion.")
    else:
        print("CUMPLE: puede congelar el guion (puerta G1).")


def cmd_sintetizar(a):
    for b in (a.bloques or BLOQUES):
        audio, tps = sintetizar_ssml(leer(b), a.voz, a.rate)
        guardar(f"{b}_v01", audio, tps)
        print(f"{b}_v01.wav {duracion(WAV / f'{b}_v01.wav'):.1f} s · {len(tps)} marcas")


p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
s = p.add_subparsers(dest="cmd", required=True)
s.add_parser("voces").set_defaults(f=cmd_voces)
s.add_parser("casting").set_defaults(f=cmd_casting)
for nombre, f in (("calibrar", cmd_calibrar), ("sintetizar", cmd_sintetizar)):
    q = s.add_parser(nombre); q.set_defaults(f=f)
    q.add_argument("--voz", default="es-US-Neural2-A"); q.add_argument("--rate", type=float, default=1.0)
    if nombre == "sintetizar":
        q.add_argument("--bloques", nargs="*")
a = p.parse_args(); a.f(a)
