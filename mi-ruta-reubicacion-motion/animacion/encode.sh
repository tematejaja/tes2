#!/usr/bin/env bash
# Codifica frames/ + mezcla.wav → ../render/NOMBRE.mp4 (1080p) y NOMBRE_720p.mp4, audio a −14 LUFS (dos pasadas).
# Uso: ./encode.sh mi_ruta_reubicacion_v6
set -euo pipefail
cd "$(dirname "$0")"
NOMBRE="$1"
T=$(python3 -I -c "import json;print(json.load(open('timeline.json'))['total'])")
M=$(ffmpeg -v info -nostats -i mezcla.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | python3 -I -c "
import sys,json;s=sys.stdin.read();d=json.loads(s[s.rindex('{'):s.rindex('}')+1])
print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -framerate 24 -start_number 0 -i frames/f_%05d.jpg -i mezcla.wav -t "$T" \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:$M:linear=true,aresample=48000" \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -profile:v high -r 24 -c:a aac -b:a 256k -movflags +faststart "../render/$NOMBRE.mp4"
ffmpeg -v error -y -i "../render/$NOMBRE.mp4" -vf scale=1280:720 -c:v libx264 -preset medium -crf 25 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart "../render/${NOMBRE}_720p.mp4"
ls -la "../render/$NOMBRE.mp4" "../render/${NOMBRE}_720p.mp4"
ffprobe -v error -show_entries format=duration -of compact "../render/$NOMBRE.mp4"
ffmpeg -v info -nostats -i "../render/$NOMBRE.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2
