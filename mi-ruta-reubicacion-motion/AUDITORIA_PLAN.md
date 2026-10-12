# Auditoría independiente del plan de animación
## Mi Ruta de Reubicación — registro de hallazgos y correcciones

**Objeto auditado:** `PLAN_ANIMACION.md` v1.0 (12/10/2026).
**Resultado:** `PLAN_ANIMACION.md` v1.1, que incorpora todas las correcciones.
**Método:**
- Un auditor independiente, que no participó en la redacción, leyó completos el documento del prototipo, el plan v1.0 y los 18 fotogramas del video de ubicación (uno por segundo).
- Recalculó con un script los conteos de palabras, las pausas SSML y los tiempos, y calculó los contrastes WCAG de la paleta.
- Revisó seis frentes: (A) fidelidad de fondo, (B) coherencia interna y aritmética, (C) narración y Google TTS, (D) forma y accesibilidad, (E) ética, derechos y privacidad, (F) completitud y producibilidad.
- Antes de corregir, se verificaron de forma independiente los hallazgos cuantitativos: pausas totales de 32,7 s en v1.0 y razones de contraste.
- Tras corregir, se hizo una verificación de cierre (ver el final de este documento).

**Resumen:** 31 hallazgos.

| Severidad | Cantidad |
| --- | --- |
| Crítica | 0 |
| Alta | 9 |
| Media | 13 |
| Baja | 9 |

Todos quedaron **corregidos** en v1.1. Dos se resolvieron con una decisión de diseño documentada (D1 y D2, al final).

---

## Hallazgos y correcciones

| ID | Sev. | Hallazgo (v1.0) | Corrección aplicada (v1.1) | Dónde |
| --- | --- | --- | --- | --- |
| H01 | Alta | El presupuesto de duración omitía 32,7 s de pausas SSML y el efecto de `prosody`. Holgura real ≈ 1 s. Varios capítulos y beats no cabían y el audio de C1 se solapaba con C2. | La escaleta y los beats se recalcularon con un script sobre el SSML: palabras ÷ tasa × factor `prosody` + pausas + remate. Cada beat se ancla a su marca con tiempo nominal absoluto. Los tiempos se declaran provisionales hasta tener los timepoints reales. | §6, §7, §8.6 |
| H02 | Alta | Peor caso sin calcular: con una voz lenta se podía superar 4:00. Reglas de recorte inertes. El guion se congelaba antes de medir la voz. | Guion reducido de 443 a 425 palabras y pausas de 32,7 a 20,75 s. Tabla de escenarios: 2,2 / 2,3 / 2,5 / 2,8 palabras/s → 3:55 / 3:46 / 3:31 / 3:13. Se exige una calibración de ≥ 2,3 p/s en F0, antes de congelar el guion. Los recortes R1–R6 indican la edición concreta del SSML y su ahorro. | §8.2, §8.6, §13 |
| H03 | Alta | El caso familiar (P-01) se resolvía en la mesa técnica, ante los delegados. | C3 se divide en mesa técnica colectiva (asunto compartido) y espacio privado (madre, gestora, enlace). Se narra: "El caso de la familia se revisa aparte, con ella." | §7 C3, §2 |
| H04 | Alta | Se mezclaban las respuestas a propuestas, los estados de acción y los estados de compromiso. | Tres sistemas separados (§4.2 B, C y D), sin íconos ni etiquetas compartidos. Cadena visible `P-01 · Aceptada con ajustes → A-01 Confirmada / A-02 Solicitada`. Se añade la columna "Sin respuesta" con su propio ícono. | §4.2, §7 C3 |
| H05 | Alta | No se mostraba qué cambiaba por la propuesta (incidencia) ni la devolución ni la comprobación posterior. | Narración: "Su propuesta cambia el plan: se acepta con ajustes, y lo no viable se explica." El plan de la ficha se redibuja. Hoja de devolución con cinco campos. En C6, `P-01 · comprobada con el hogar ✓`. | §7 C3, C6 |
| H06 | Alta | Los contactos de 48–72 h y 2 semanas aparecían como hitos garantizados; faltaban los de 30/90/150/180 días. | Se eliminan las 48–72 h y las 2 semanas del video. El calendario muestra `Contactos: 30 · 90 · 150 · 180 días desde el ingreso`. | §7 C5, §2.2 |
| H07 | Alta | No se decía que el piloto complementa a las entidades. La ficha aparecía como actor y la gestora no se nombraba. La ejecución no tenía sujeto. | E1: "Complementa el acompañamiento institucional que ya existe." E2: "Cada hogar tiene una gestora identificable y una ficha…". C4: "cada entidad ejecuta lo ya confirmado, y el piloto acompaña y registra." | §7 E1, E2, C4 |
| H08 | Alta | Se proponía recortar, hacer push-in y "redibujar" la captura de Street View (riesgo para la atribución y de obra derivada). Había una menor identificable. | La captura se usa completa, sin zoom ni recorte, con la atribución de Google intacta. Fundido a una ilustración original, no calcada. Se verifican las condiciones de Google y Esri y se registran. Si hay personas identificables, se sustituye la toma (decisión en G2b). | §7 E0, §10.2, §12.4 |
| H09 | Alta | Se inventaba la distribución de los 350 hogares. | 350 puntos neutros, una leyenda con las tres situaciones sin proporciones y el texto "Distribución por conocer con la vinculación real". Narración: "…no de trescientos cincuenta traslados". | §7 E9 |
| H10 | Media | Los contrastes declarados (≥ 4.5:1) no se cumplían: ámbar 1,64, turquesa 1,46, gris 2,21 y verde 2,95 sobre marfil. | El texto de estado va siempre en tinta (14,3:1). Íconos con contorno de 2 px. Variantes oscuras para texto: `#1F7A50`, `#8A5A00`, `#B3261E` y `#5E6873`, todas ≥ 4,6:1. Turquesa prohibido como texto sobre fondo claro. | §4.2 |
| H11 | Media | Choques de paleta: Economía usaba el azul del paisaje; Vivienda se confundía con Crítica; el reloj se repetía; había doble codificación cromática en los hilos. | Hilos en pizarra neutra, sin color propio (el color es solo del estado). Rojo y ámbar reservados para estados. Ícono propio para "Sin respuesta". Prueba de daltonismo en F2. | §3.3, §4.2 |
| H12 | Media | E0: "viven familias… el reasentamiento ya ocurrió" era contradictorio, y la palabra "reasentamiento" sonaba sobre la calle real. | Nuevo texto: "Algunas ya fueron reasentadas; otras siguen aquí, con situaciones distintas." El fundido a la ilustración ocurre antes de esa frase. | §7 E0, Anexo B |
| H13 | Media | El rótulo `BELLA FLOR · PARTE ALTA` afirmaba una delimitación, el pie quedaba alterado y las coordenadas se redondeaban. | Rótulo `BELLA FLOR` con `Ámbito del piloto: parte alta · delimitación por validar`. Pie original textual. Coordenadas eliminadas. | §2.3, §10.2 |
| H14 | Media | La urgencia aparecía como atajo al final de la ruta y la ficha quedaba "en pausa". | Flecha perpendicular hacia un canal paralelo de emergencia. La ficha sigue en la ruta y se muestra la coordinación con registros separados. Se elimina la repetición "inmediato… de inmediato". | §7 C1 |
| H15 | Media | Tres tarjetas de opción simulaban una elección entre ofertas. | Una tarjeta `Opción disponible`. Aparte, "Propuesta de la familia · en evaluación" y "Autoconstrucción · propuesta comunitaria · requiere evaluación". | §7 C2 |
| H16 | Media | "Una mentora" sonaba a persona única y la resiliencia no se explicaba. | "…mesas de trabajo con la gestora como mentora". Rótulos con nombres exactos. En C1, el ícono de resiliencia se despliega en las cinco dimensiones. | §7 E2, C1 |
| H17 | Media | Frases ambiguas en voz alta (antecedentes de "le", "la" y "sus"), exceso de "se" impersonal y repetición de "resuelto". | Reescritura con sujetos explícitos ("la gestora", "cada entidad", "la entidad competente"), antecedentes claros ("que firma el recibido", "los ingresos") y sin repeticiones. | Anexo B |
| H18 | Media | Simplificaciones: escalar sin revisar antes, "cualquier caída" de ingresos, cierre con una simple "respuesta", y la promesa de que siempre hay respuesta motivada. | "Se revisa, se escala si hace falta". "Caen de forma importante" con rótulo "umbral de prueba". "Solo se cierra cuando la atención llega y la familia lo confirma", con la derivación mostrada como no-cierre. En §1.4: "si una respuesta no llega, el caso se escala". | §1.4, §7 C3, C5 |
| H19 | Media | No se diferenciaba el traslado efectivo ni los tres resultados del §13. | Remate C4→C5 con `Traslado efectivo · decidido y verificado por la entidad competente`, las llaves y el campo "Situación habitacional" separado de la etapa. En C6, tres etiquetas con "Atención pendiente" iluminada. | §4.7, §7 C4–C6 |
| H20 | Media | Textos sin tiempo de lectura (créditos de 98 palabras en 7 s, E9 sobrecargado, E2 simultáneo) y límites solo visuales. | Créditos en dos placas (18 y 12 palabras, 11 s). Fuentes y alcance en el documento adjunto (Anexo D). E9 reducido a 12 palabras. Revelado progresivo en E2 con el minimapa oculto. Límites clave narrados. | §5, §7 E2, E9, CR |
| H21 | Media | Detalles de TTS: Studio sin `<mark>`, Chirp 3 HD sin SSML, 48 kHz innecesarios, falta de `x-goog-user-project`, "SSML completo" y `prosody` combinado con `speakingRate`. | Tabla de voces con soporte de SSML y marcas. Flujo de síntesis por frase para voces sin marcas. `sampleRateHertz` 24000. Cabecera de proyecto de cuota. "Subconjunto SSML". Factor de `prosody` incluido en el cálculo. `<phoneme>` solo como plan B probado. | §8.2–§8.5 |
| H22 | Media | Producibilidad: sin storyboard, responsables, recursos, puerta comunitaria, registro de derechos, versiones ni plan B. Remotion era débil para personajes. | Storyboard de 26 cuadros, matriz RACI, estimación de 150–170 h, puerta G2b de validación con delegados, registros de derechos y versiones, plan B de voz. Flujo híbrido: Remotion para gráfica y AE o pose a pose para personajes. Animación ampliada a 10–12 días. | §7.0, §8.8, §12, §13 |
| H23 | Baja | El diagnóstico atribuía el pie Esri a todo el video y suponía rótulos editables. | Tabla corregida: Esri en 0–12 s y Google en 12–18 s. Rótulos quemados: re-render si existe el proyecto fuente; si no, enmascarado. | §10 |
| H24 | Baja | El sello de "punto D" duraba 1 s, se solapaba con el beat y usaba una sigla opaca. | Remate propio de 1,5 s sin voz. Rótulo "Preparación entregada"; "punto D" solo en el documento adjunto. | §7 C3 |
| H25 | Baja | Terminología no exacta: nombre del transversal, "Sin información" y nombres truncados en la ficha. | Nombres exactos ("Mesas de trabajo con acompañamiento de una mentora", "Sin información suficiente", nombres completos de dimensiones). Ficha ensanchada a 760 px. | §4.2, §4.7 |
| H26 | Baja | Objetivo de 3:35 frente a una escaleta de 3:39. | Unificado: nominal 3:31,5, calculado; banda 3:10–3:50. | §0, §6, §8.6 |
| H27 | Baja | Voz sintética declarada solo en créditos ilegibles; licencia "educativa" insuficiente para mensajería. | Rótulo "Narración con voz sintética" en E1. Licencia musical con difusión pública no comercial. Nota "no implican aval" en las fuentes. | §2.3, §9, Anexo D |
| H28 | Baja | La matriz de trazabilidad no cubría los textos en pantalla, y una frase de E0 estaba mal atribuida. | Anexo A2 añadido para los textos. Frase de E0 marcada como recurso narrativo con respaldo parcial (§2, §5). | Anexo A |
| H29 | Baja | Todas las condiciones previas al traslado aparecían verificadas. | "Cuidados" aparece primero como `En gestión · pendiente visible` y se verifica tras resolverse. | §7 C4 |
| H30 | Baja | Desfase en E0: se decía "Bella Flor" mientras se veía "Ciudad Bolívar". | Zoom re-temporizado a las marcas: 0–2,6 s Bogotá, 2,6–5,6 s Ciudad Bolívar, 5,6–10 s Bella Flor. | §7 E0, §10.2 |
| H31 | Baja | Ausencias menores: hogares ya reasentados, autoconstrucción, nombre de la mesa comunitaria. | Hogares ya reasentados en E0 (narración), en la mesa comunitaria y en la leyenda de E9. Autoconstrucción en C2. Mesa comunitaria rotulada en C1. | §7 |

---

## Decisiones de diseño documentadas

**D1 · "Lo confirmado se separa de lo solicitado" (idea del capítulo 3 en §20).**
Para respetar el límite de duración, esta idea no se narra en C3. Se cubre así:
- en C3, con las columnas `Confirmada · Condicionada · Solicitada · Sin respuesta` del tablero y la cadena `A-01 Confirmada / A-02 Solicitada`;
- en C4, con la narración "cada entidad ejecuta **lo ya confirmado**", mientras las acciones solo solicitadas quedan en gris.

Así la idea se ve en C3 y se escucha en C4.

**D2 · Comprobación temprana tras el traslado (48–72 h y 2 semanas).**
El prototipo condiciona esos contactos a su integración en la agenda financiada o a una financiación previa (§12). Se excluyen del video para no presentarlos como prestación garantizada.

---

## Verificación de cierre

Tras redactar la v1.1 se verificó lo siguiente:

- **Recalculado con el script de presupuesto:**
  - 425 palabras y 20,75 s de pausas.
  - Duración nominal: 3:31,5.
  - Escenarios: 3:13 a 2,8 p/s, 3:46 a 2,3 p/s y 3:55 a 2,2 p/s, todos dentro de 2:00–4:00.
  - Tiempos de marca de §7 coherentes con el Anexo B.
  - Distribución 25 / 61 / 14 %.
- **Contrastes recalculados:** las variantes oscuras sobre marfil dan entre 4,63 y 5,71:1.
- **Verificación independiente final:** el resultado se detalla en el apartado "Resultado de la verificación independiente final", más abajo.
