# Auditoría independiente del video: tres vueltas

**Video final:** `render/mi_ruta_reubicacion_v5_final.mp4`. Duración 4:30,8, 1920×1080, 24 fps, −14 LUFS integrados, pico real ≈ −1,5 dBTP.

**Versión liviana:** `render/mi_ruta_reubicacion_v5_final_720p.mp4`.

**Guion:** `narracion/GUION_v3.md`, con voz `es-US-Neural2-A` a velocidad 0,98.

**Subtítulos:** `subtitulos/mi_ruta_es_v03.srt` y `.vtt`.

**Método:** cada vuelta la hizo un agente distinto, que no escribió el guion ni el código. Cada uno revisó:
- hojas de contacto del video ya codificado (un fotograma cada 2 s);
- fotogramas a resolución completa;
- guion, SSML, subtítulos, línea de tiempo y código de las escenas;
- el documento del prototipo;
- la medición de sonoridad (EBU R128).

Además, `animacion/qa_run.py` revisa de forma automática todos los fotogramas en busca de textos fuera de cuadro, textos que se pisan y textos que desbordan su recuadro.

**Decisión del usuario:** el prototipo ya fue conversado y validado con la comunidad y las entidades. Por eso el video dice "construimos y validamos con ellas y con la comunidad" y ya no "por validar". Se mantiene "piloto propuesto", sin logotipos ni insinuación de aval formal o compromisos institucionales. La primera auditoría recomendó revertir este cambio porque el documento fuente aún dice "diseño para validar". Se mantuvo por instrucción expresa del usuario.

## Vuelta 1, sobre el video v2 (35 hallazgos: 6 altos, 16 medios, 13 bajos)

**Principales correcciones aplicadas en la v3:**

| Tema | Corrección |
| --- | --- |
| Subtítulos | Ya no se parten a mitad de frase ni dejan palabras huérfanas. Ahora cortan por cláusulas y equilibran las líneas. |
| Solapamientos | Se corrigieron el rótulo del saldo sobre el subtítulo, el círculo que tapaba texto, la alerta que tapaba a la mamá, el cartel montado sobre la entrega y los rótulos fantasma del video original. |
| Gestora en C2 | "Responsable: gestora" pasó a "Gestiona la respuesta: gestora · Responde: entidad competente". |
| Narración | Se definieron la resiliencia y la "preparación entregada". La narración nombra el plan económico de transición, la mesa comunitaria, la entrega del caso, el receptor de continuidad y la atención pendiente. |
| Cierre | Se reordenó y vuelve a la mamá de la historia. |
| Música | Atenuada entre 8 y 10 dB, con normalización de sonoridad en dos pasadas. Se agregó un fundido final. |

## Vuelta 2, sobre el video v3 (verificación de la vuelta 1, más 19 hallazgos nuevos o persistentes)

**Principales correcciones aplicadas en la v4:**

| Tema | Corrección |
| --- | --- |
| Bocadillos | Un error de código anulaba la dirección del piquito y el tamaño de la letra. Corregido: cada globo apunta a quien habla. |
| Subtítulos | Se protegieron términos para que no se partan: "ficha de caracterización familiar", "doce meses", "nuestra historia", entre otros. |
| Seis condiciones | Las seis quedan verificadas antes de "Traslado efectivo". |
| Hoja de devolución | Más tiempo de lectura. |
| Sello del hito | Casillas previas al sello "Preparación entregada" y campana sincronizada con él. |
| Resiliencia | Definición fiel al documento: "que la familia pueda enfrentar el cambio y pedir apoyo". |
| Gestora de respaldo | Ahora es una figura femenina, como dice la narración. |
| "¿Cómo funciona?" | Marcos punteados de las tarjetas 2 y 3 para que la pantalla no quede vacía. |
| Cierre visual | Aparecen la vecina y los tres íconos del gancho. |
| Lenguaje | Se quitaron las muletillas "Y…". El enunciado sobre compromisos sin verificar quedó menos acusatorio. |
| Rótulos | Nombres coherentes en pantalla. |

## Vuelta 3, sobre el video v4 (veredicto: listo para entregar)

**Sin hallazgos altos.** Se aplicaron en la v5 los tres recomendados:
- fundido de C6 a E9;
- fundido final a negro, con la placa superior incluida;
- entrada desde el azul de E1 a E2.

También se aplicaron dos pulidos: las seis condiciones verificadas más tiempo en pantalla y la placa opaca sobre la interfaz de Street View.

**Pulido opcional que quedó sin aplicar:**
- Sustituir el lema en pantalla del cierre. Se conservó "Más que un traslado, un nuevo comienzo", que es la idea central del documento.
- Ajustar el brazo de la figura de la mesa técnica.
- Tres cortes de línea de subtítulo discutibles.
