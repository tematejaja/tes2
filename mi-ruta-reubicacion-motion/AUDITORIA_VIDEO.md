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

---

# Versión v6: voz HeyGen y comentarios del equipo

## Vuelta 1, sobre el video v6 (veredicto: listo con ajustes)

Auditoría independiente sobre `render/mi_ruta_reubicacion_v6.mp4`.
- **Método:** 299 fotogramas a 1 fps; luminancia de los 7.175 fotogramas; EBU R128 y `silencedetect`; tiempos por palabra frente a lo que aparece en pantalla; cortes de subtítulos recalculados con el código real.
- **Comentarios del equipo:** 6 de 7 cumplían; el 5 (participación en la oferta de vivienda) era parcial.
- **Restricciones:** ningún "350" residual, duración de 4:58,97 y audio en −14,0 LUFS / −1,5 dBTP.

| # | Severidad | Hallazgo | Corrección aplicada en v6_final |
| --- | --- | --- | --- |
| 1 | ALTA | Destello de un fotograma al iniciar C1, C2, C4 y C5: la capa de la tarjeta de capítulo entraba desde 0. | La capa oscura empieza opaca. Fundido a azul al final de E0, E2 y C1–C5, y entrada desde azul en las seis etapas. |
| 2 | MEDIA | Cortes de escena clara a azul (E0→E1 y "Tres piezas"→ruta). | Fundido a azul al final de E0. El fondo beige de E2 se mantiene hasta que la ruta termina de entrar. |
| 3 | MEDIA | Interfaz del navegador visible en Street View (barra, minimapa con "Expand", controles, pie) y difuminado de bordes duros. | Zoom ×1,35 durante Street View, que deja fuera de cuadro toda la interfaz. El rótulo propio tapa la tarjeta de dirección e incluye "© Google". Difuminado con máscara radial suave y fundido de 0,3 s desde el satélite. |
| 4 | MEDIA | La familia que "vuelve al riesgo" era la protagonista, y el cierre ocurría sobre el barrio de origen. | En el retorno aparece una familia genérica. En el cierre, la familia camina hacia el edificio "Nueva vivienda". |
| 5 | MEDIA | Las propuestas colectivas de vivienda no volvían a aparecer (comentario 5 parcial). | La mesa técnica pasa a "asuntos colectivos: vivienda, transporte y cuidado", con "Viviendas con espacio para trabajar" (condicionada) y "Autoconstrucción · requiere estudios" (solicitada). Lo mismo en el tablero "Lo demás sigue avanzando". |
| 6 | MEDIA | Elementos que aparecían de 3 a 5,5 s antes de nombrarse. | Resincronizados con los tiempos reales por palabra: tarjeta y gestora de respaldo (E2), globos de la mamá, "No garantiza" / "No obliga" (C1), compromiso, predio y receptor (C6). |
| 7 | BAJA | Cortes de línea de subtítulos ("nos / advirtieron", "técnicas / y comunitarias"). | "nos", "me", "te" y "les" pasan a palabras átonas; "técnicas y comunitarias" queda protegido; se penalizan las líneas de menos de 16 caracteres (en la pantalla y en SRT/VTT). |
| 9 | BAJA | Coherencia del caso. | "Parte no viable". A-02 pasa a "Entidad de desarrollo económico" (§4 del documento). "Cada opción se compara por" en lugar de "Opción disponible". |
| 10 | BAJA | El lema entraba sobre "no sea empezar de cero". | Entra con "con alguien al lado". La cola de E9 sube a 2,0 s. |
| 11 | BAJA | Tiempos de lectura cortos. | "Recibido ✓" dura unos 1,7 s. Tarjetas de capítulo de 2,0 s. Créditos legibles unos 3,6 s. Cola de C4 de 1,4 s para "Traslado efectivo". |
| 12 | BAJA | Términos. | "Ficha de caracterización familiar" en E1 y en C1 (urgencia). "Capacitación antes de mudarse". La mentora se explica: "Gestora como mentora: orienta y devuelve los acuerdos". |
| 13 | BAJA | Medición: un antes y un después podía leerse como prueba causal. | Se muestran solo momentos de medición, sin curvas, con la nota "Con método: un antes y un después no basta para probar causas". |
| 14 | BAJA | La tarjeta de etapa 1 caía sobre la presentación de la familia. | La tarjeta de C1 llega con "En la primera etapa…". |
| 15 | BAJA | Minimapa poco legible a 720p. | Textos de 21 y 23 px. |
| 8, 16 | BAJA | Escala "200 m" bajo el subtítulo, y ritmo denso. | Sin cambios: la escala es parte del video fuente y no hay margen de duración, porque el tope es de 5:00. |

Duración resultante: 4:59,7.
