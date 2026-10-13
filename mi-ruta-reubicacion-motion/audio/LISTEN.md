# Revisión de oído — capa de sonido v7

Video: `render/mi_ruta_reubicacion_v7_sonido.mp4` (sale de `out/final.mp4`). Yo no puedo escuchar: esto reporta lo que miden los scripts de `opus-sound-layer`. La escucha final la hace una persona.

## Cinco puntos para escuchar

| # | Timecode | Qué escuchar | Lo que muestran las mediciones |
| --- | --- | --- | --- |
| 1 | **0:34,1** — título "MI RUTA DE REUBICACIÓN" (héroe) | ¿Se percibe el golpe de madera grave cuando entra el título? ¿El corte de 0,4 s de la música antes del golpe suena intencional o como un hueco? | FAIL de cuerpo: la banda 125–250 Hz sube 2,4 dB (pide 3). El stem de efectos queda en unos −64 dB RMS frente a −15 dB de la voz, que retoma a los 0,2 s. |
| 2 | **2:31,4–2:34,4** — empalme de la música (fundido cruzado de Bach en la tarjeta "Etapa 3") | ¿Se nota que el preludio vuelve a empezar? ¿Hay salto de tempo o de armonía? | La QA de música no detecta caídas (mediana de −29,4 LUFS a corto plazo, sin dips). Las mediciones no pueden juzgar si el empalme suena musical. |
| 3 | **3:05,2** — sello "PREPARACIÓN ENTREGADA" (héroe) | ¿El golpe sordo acompaña al sello o se pierde bajo "la preparación entregada"? | FAIL de cuerpo: 2,7 dB (pide 3). Música en −50 dB durante el corte previo. Efectos a −52 dB RMS y voz a −21 dB en los 0,3 s siguientes. |
| 4 | **3:33,9** — tarjeta "Traslado efectivo" (héroe, sin voz) | ¿El corte de música y el golpe se sienten como una pausa con peso, o como un fallo de audio? | FAIL de cuerpo: 2,0 dB (pide 3). Es un momento sin voz: la música vuelve tras el corte a unos −32 dB y el golpe queda a −49 dB RMS. |
| 5 | **4:54,6** — créditos "MI RUTA DE REUBICACIÓN" (héroe final) y salida | ¿El golpe final se escucha antes del fundido a negro? ¿La música termina sin cortarse en seco? | Picture FAIL: el cue cae 1 fotograma antes del mayor cambio de imagen (7071 frente a 7072). Cuerpo de 2,8 dB (pide 3). En el gráfico ampliado, el golpe es claramente visible sobre el hueco de música. |

## Resultado de `qa.py` (después de 2 rondas de corrección; los umbrales no se tocaron)

- **Pasan:**
  - offset: 0 ms entre el MP4 y `mix.wav`;
  - loudness: −14,11 LUFS integrados;
  - true peak: −1,97 dBTP;
  - voice: la música queda 15,7 LU bajo la voz;
  - music: sin caídas no planificadas;
  - silence: sin silencios anómalos;
  - sync: todos los cues dentro de 1 fotograma.
- **16 FAIL:**
  - 4 de cuerpo en los héroes (entre 2,0 y 2,8 dB, piden 3);
  - 1 de imagen en `cr-titulo` (1 fotograma);
  - 11 de audibilidad en apoyos que quedan bajo una narración muy densa: `e0-demas`, `e0-icono2`, `e1-validado`, `etapa1`, `etapa4`, `etapa5`, `etapa6`, `c1-nogarantiza`, `c1-noobliga`, `c2-propuesta2`, `c3-hoja`.
- **19 avisos de imagen:** los apoyos `appear` caen 1 fotograma antes de que el cambio de imagen supere al local. No es un error de sincronía, porque los elementos entran con fundido.
- **Detalle completo:** `audio/qa_round2.txt`, `audio/qa-report.json`, `audio/qa.png` y `audio/qa_heroes_zoom.png` (acercamientos de ±1,5 s en cada héroe).

## Límites de la biblioteca en este entorno

Las grabaciones de Freesound (CDN) devolvieron 403 y Wikimedia devolvió 429. Por eso el kit quedó con 309 sonidos CC0 de Kenney, sin `thump`, `whoosh`, `riser` ni `shimmer`. Los héroes usan "madera grave + golpe sub" (Kenney Impact + Sci-fi low-frequency), en lugar de "thump+tap".
