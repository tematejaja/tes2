# Narración: cómo ejecutar el casting y la calibración (fase F0)

Los 10 bloques SSML de `ssml/` son copia exacta del Anexo B de `PLAN_ANIMACION.md` (425 palabras, 20,75 s de pausas).
Si cambia un texto, regenere el archivo, recalcule §6 y §8.6 y use un nuevo número de versión (`_v02`).

## Requisitos
- Python 3.9 o superior (solo biblioteca estándar) y `gcloud` con la sesión iniciada: `gcloud auth login`.
- API *Cloud Text-to-Speech* habilitada en su proyecto, indicado así: `export GOOGLE_CLOUD_PROJECT=su-proyecto`.

## Pasos
```bash
cd mi-ruta-reubicacion-motion/narracion
python3 sintetizar.py voces                              # confirme los nombres reales de voz es-US
python3 sintetizar.py casting                            # E1 y C3 con 3 candidatas -> wav/casting_*.wav
python3 sintetizar.py calibrar --voz es-US-Neural2-A     # mide la tasa y proyecta la duración
python3 sintetizar.py sintetizar --voz es-US-Neural2-A   # genera wav/ y timepoints/ de cada bloque
```

- Los nombres de la lista `CANDIDATAS` del script son un punto de partida; la voz Chirp 3 HD (`es-US-Chirp3-HD-*`) puede tener otro nombre en su cuenta. Corríjala con la salida de `voces`.
- Las voces sin SSML (Chirp 3 HD) se sintetizan como texto plano y no devuelven marcas: use el flujo "una frase por archivo" del plan §8.5, paso 5.
- `calibrar` imprime si la tasa alcanza 2,3 palabras/s y si la duración proyectada queda entre 3:10 y 3:50. Si cumple, se puede congelar el guion (puerta G1).
- Los `.wav` y `.json` generados quedan en `wav/` y `timepoints/`. Escuche los de casting a ciegas y puntúe de 1 a 5 (§8.2).
- Este script se validó solo sin conexión (SSML bien formado, el script compila). Aún no se ha ejecutado contra la API de Google.
