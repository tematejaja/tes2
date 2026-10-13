# Animación: cómo regenerar el video

El video se dibuja fotograma a fotograma con Chromium (Playwright). Cada escena es una función del
tiempo `t` en `scenes*.js`, anclada a las marcas reales de la voz (`timeline.json`).

```bash
pip install playwright pillow numpy        # Chromium: usar el instalado (PLAYWRIGHT_BROWSERS_PATH)
python3 build_timeline.py                  # tiempos reales + subtítulos (.srt/.vtt en ../subtitulos)
# fondo del prólogo a partir del video de ubicación (re-temporizado a las marcas de la voz):
mkdir -p bg && ffmpeg -i Bellaflor_ubicacion_con_Street_View.mp4 -filter_complex "[0:v]split=4[a][b][c][d];[a]trim=0:5,setpts=(PTS-STARTPTS)*3.0/5,fps=24[s1];[b]trim=5:10,setpts=(PTS-STARTPTS)*3.11/5,fps=24[s2];[c]trim=10:12,setpts=(PTS-STARTPTS)*4.2/2,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:vsbmc=1[s3];[d]trim=12.4:15.7,setpts=PTS-STARTPTS,fps=24[s4];[s1][s2][s3][s4]concat=n=4:v=1:a=0[v]" -map "[v]" -frames:v 327 -q:v 2 bg/%05d.jpg
python3 render_frames.py 0 4718 frames 4   # ~6 min con 4 núcleos
python3 build_audio.py                     # voz + pad ambiental + efectos -> mezcla.wav
ffmpeg -framerate 24 -i frames/f_%05d.jpg -i mezcla.wav -t 196.599 -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
  -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart ../render/mi_ruta_reubicacion_v1.mp4
```

- Muestras sueltas para revisar: `python3 render_frames.py --muestras 22 46 70` (segundos) → `muestras/`.
- Créditos y textos de pantalla: `scenes3.js` (función `sceneCR` para los créditos; el nombre real del equipo
  sustituye a "Equipo del proyecto · DGIP 2026").
- Si cambia la voz o un texto: regenerar los audios y luego `build_timeline.py` y volver a renderizar.
  Voz actual (v04, HeyGen · Camila Vega; clave en `HEYGEN_API_KEY`, nunca en el repositorio):
  ```bash
  cd ../narracion && python3 guion_v4.py                                   # ssml/*_v04.ssml (texto entre marcas) y GUION_v4.md
  GUION_VERSION=v04 HEYGEN_SPEED=1.05 python3 heygen/sintetizar_heygen.py  # crudo: heygen/crudo/*_v04.wav + marcas por palabra
  GUION_VERSION=v04 TEMPO=1.025 CAP=0.38 python3 heygen/ajustar_pausas.py  # silencios ≤ 0,38 s + tempo leve → wav/ y timepoints/
  ```
  El bloque E9 se sintetizó a velocidad 1,0, en una pasada previa con el mismo texto.
