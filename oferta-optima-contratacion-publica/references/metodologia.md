# Metodología para determinar una oferta óptima en contratación pública

Fecha: 12 de octubre de 2026.

## 1. Propósito y fundamento

El propósito es escoger un precio competitivo que preserve una rentabilidad aceptable. La decisión combina tres elementos: costo de ejecución, probabilidad de adjudicación y reglas de evaluación del proceso.

La base académica es la optimización de ofertas competitivas: Friedman (1956) plantea determinar ofertas óptimas utilizando patrones históricos de los competidores y la incertidumbre del costo; Gates (1967) desarrolla estrategias probabilísticas según la información sobre los participantes. Investigaciones posteriores incorporan simulación e incertidumbre.

Este documento propone una aplicación operativa de esos enfoques: estimar la utilidad esperada de distintos precios, simular escenarios cuando sea necesario e imponer un margen mínimo. La combinación concreta de restricciones y la política de margen son decisiones del negocio; no se presentan como una fórmula universal demostrada para todas las licitaciones.

La literatura respalda el enfoque analítico, pero no garantiza adjudicaciones ni una tasa de éxito determinada. Una metodología solo puede considerarse validada para un mercado concreto después de contrastarla con datos que no se usaron para construirla. Buena parte de los trabajos citados proviene de construcción: su traslado a suministros o servicios exige adaptar costos, competencia y reglas.

## 2. Elegir qué se quiere optimizar

Antes de calcular, se debe elegir uno de estos objetivos:

### A. Maximizar utilidad esperada con margen mínimo

Escoger el precio que produce el mayor resultado económico esperado entre las ofertas admisibles que cumplen la política de rentabilidad. Es el objetivo recomendado para rentabilidad sostenida a lo largo de varios procesos.

### B. Maximizar probabilidad de adjudicación con margen mínimo

Escoger el precio con mayor probabilidad de adjudicación entre las ofertas que respetan el piso de rentabilidad. Puede servir cuando la prioridad comercial es obtener un contrato, siempre dentro de límites económicos.

Los dos objetivos pueden producir precios diferentes. No se deben cambiar después de observar el resultado del cálculo para justificar una oferta preferida.

Además, se pueden imponer límites al riesgo de pérdida, a la inversión de capital de trabajo y a la capacidad operativa. Sus valores deben definirse antes de optimizar.

## 3. Definiciones y fórmulas básicas

Para un contrato a precio fijo, con ingreso neto equivalente al precio analizado:

- `p`: precio de la oferta, sobre una base tributaria y económica homogénea.
- `C`: costo completo de ejecución sobre esa misma base.
- `U(p) = p - C`: utilidad del contrato si se adjudica.
- `q(p)`: probabilidad de adjudicación con ese precio.
- `K`: costo incremental de preparar y presentar la oferta, incurrido gane o pierda.

Con costo determinístico:

```text
Utilidad esperada(p) = q(p) × (p - C) - K
```

Si `K` es igual para todos los precios, no modifica cuál precio maximiza la utilidad esperada. Sí afecta la decisión de participar. Los costos ya incurridos son costos hundidos: se documentan para evaluar el desempeño comercial, pero no se restan como costos futuros en la decisión actual.

Si los costos o ingresos son inciertos, la expresión general es:

```text
Utilidad esperada(p) = E[ I_adjudicación(p) × (R(p, escenario) - C(escenario)) ] - K
```

`I_adjudicación` vale 1 si se obtiene el contrato y 0 en caso contrario; `R` representa el ingreso económico correspondiente al escenario. Esta expresión permite que costos y adjudicación estén relacionados. Usar `q(p) × (p - E[C])` exige que esa simplificación sea justificable; por ejemplo, que el costo esperado condicionado a ganar coincida con el costo esperado utilizado.

En contratos por precios unitarios, cantidades variables o ingresos contingentes, `R` no necesariamente equivale al valor nominal de la propuesta. Se debe modelar el ingreso por cantidades y condiciones contractuales. Optimizar solo el total nominal puede dar una conclusión equivocada.

## 4. Margen mínimo y piso económico

### Margen sobre ventas

```text
m = (p - C) / p
piso = C / (1 - m_min)
```

### Recargo sobre el costo

```text
r = (p - C) / C
p = C × (1 + r)
m = r / (1 + r)
```

Un recargo del 15 % sobre costos no equivale a un margen del 15 % sobre ventas.

Ejemplo: con costo de $80 millones y margen mínimo sobre ventas del 15 %:

```text
piso = 80 / 0,85 = $94,117647 millones
```

El piso se redondea hacia arriba a la unidad permitida. Si el máximo admisible queda por debajo del piso, no existe una oferta factible bajo esos supuestos. Se revisan costos o condiciones justificadamente, o se decide no participar.

Este piso protege el margen respecto al costo usado para calcularlo. No garantiza el margen real si hay sobrecostos. Con incertidumbre se puede exigir adicionalmente:

```text
P(margen real < m_min | adjudicación) ≤ beta
P(utilidad real < 0 | adjudicación) ≤ alfa
```

`alfa` y `beta` son tolerancias definidas por el negocio. Un piso calculado con un percentil conservador del costo es una alternativa práctica; su nivel y pertinencia deben justificarse y comprobarse mediante simulación.

## 5. Variables que deben reunirse

### 5.1. Costos e ingresos

| Variable | Qué registrar | Cómo afecta el cálculo |
|---|---|---|
| Cantidades y alcance | Unidades, entregables, especificaciones y obligaciones | Determinan el volumen real de ejecución |
| Costos directos | Personal, insumos, equipos, subcontratos, transporte y logística | Forman el costo operativo |
| Administración e indirectos | Supervisión, estructura y costos atribuibles | Evitan sobreestimar utilidad; no duplicar rubros |
| Garantías y seguros | Primas, vigencias, coberturas y posibles costos de extensión | Incrementan el costo contractual |
| Tributos y cargas | IVA, impuestos, tasas y otras cargas realmente aplicables | Requieren tratamiento coherente de ingreso y costo |
| Retenciones | Naturaleza, recuperación y momento de aplicación | Pueden afectar caja sin ser un costo definitivo |
| Pagos | Anticipos, hitos, plazos, amortizaciones y posibles retrasos | Determinan necesidades de financiación |
| Capital de trabajo | Déficit acumulado máximo de caja y recursos disponibles | Puede limitar la factibilidad de la oferta |
| Financiación | Tasas, comisiones, plazo y utilización del crédito | Reduce la utilidad económica |
| Variación de precios | Inflación, divisas y ajustes contractuales | Genera escenarios de costo e ingreso |
| Riesgos de ejecución | Probabilidad e impacto de eventos concretos | Permiten estimar sobrecostos sin provisiones arbitrarias |
| Capacidad y oportunidad | Equipos, personal, contratos simultáneos y alternativas | Permiten evaluar restricciones y costo de oportunidad |
| Preparación de oferta | Trabajo, estudios y gastos incrementales de participar | Influye en la conveniencia de participar |

No sumar IVA recaudado como utilidad ni tratar automáticamente toda retención como gasto. Para el modelo económico se debe definir una base neta coherente; para evaluar la propuesta se utiliza la base exacta que ordene el pliego. Ambas se conectan mediante una conversión explícita.

Si se descuentan flujos para calcular valor presente, documentar la tasa y evitar contar dos veces el mismo costo financiero. Una contingencia agregada tampoco debe duplicar riesgos ya modelados individualmente.

### 5.2. Reglas del proceso

| Variable | Información necesaria |
|---|---|
| Presupuesto y topes | Máximo total, límites por ítem y tratamiento de impuestos |
| Admisibilidad | Requisitos, condiciones de rechazo y documentos exigidos |
| Evaluación económica | Fórmula exacta, base de cálculo, correcciones y redondeos |
| Evaluación no económica | Puntajes propios y posibles puntajes de competidores |
| Ofertas incluidas | Cuáles participan en las medias y en la clasificación |
| Desempate | Orden y condiciones de los criterios aplicables |
| Método variable | Mecanismo de selección y momento en que se conoce |
| Adjudicación | Una o varias adjudicaciones, lotes y límites de asignación |
| Procedimiento | Oferta cerrada, subasta u otro mecanismo |
| Versiones | Pliego definitivo y adendas vigentes utilizadas |

Las fórmulas de medias o menor valor no son intercambiables. Un documento modelo de una entidad no sustituye el pliego vigente de la licitación concreta. En subastas con rondas y decisiones sucesivas se requiere un modelo dinámico; el precio único de oferta cerrada no describe toda la estrategia.

### 5.3. Competencia e históricos

| Variable | Qué conviene registrar |
|---|---|
| Identidad del proceso | Identificador, entidad, objeto, fecha y sector |
| Comparabilidad | Alcance, región, tamaño, duración y procedimiento |
| Número de oferentes | Presentados, admisibles y efectivamente evaluados |
| Identidad de participantes | Empresas y estructuras plurales, sin duplicar integrantes |
| Todas las ofertas | Valores iniciales y corregidos, ítems cuando sean relevantes |
| Puntajes | Económicos, técnicos y totales |
| Admisibilidad observada | Rechazos y causas verificadas |
| Resultado | Adjudicatario, desempate, cancelación o declaratoria desierta |
| Variables de mercado | Fecha, ubicación, condiciones de suministro y demanda |
| Fuente | Documento, enlace, versión y fecha de extracción |

El conjunto mínimo útil debe incluir ofertas perdedoras y reglas de evaluación, además de las adjudicadas. Usar únicamente precios ganadores introduce un sesgo importante.

Cada dato debe clasificarse como observado, estimado, supuesto o pendiente. Un dato faltante no equivale a cero. No hay un número universal de procesos que asegure suficiencia: depende de comparabilidad, diversidad, cambios del mercado y precisión requerida.

## 6. Estimar la probabilidad de adjudicación

### 6.1. Menor precio

En el caso básico, se gana si la oferta propia es admisible y resulta menor que todas las ofertas rivales admisibles, considerando desempates.

Si `F_j(p)` es la distribución acumulada de la oferta del rival `j`, todos esos rivales participan y sus ofertas son independientes, sin empates:

```text
q(p) = producto_j [1 - F_j(p)]
```

Es una simplificación condicionada a esos supuestos. No representa indistintamente a Friedman y Gates: sus formas de combinar probabilidades difieren. La participación incierta, habilitación, correlación y empates requieren ampliar el modelo.

Las ofertas pueden estar correlacionadas por insumos, condiciones de mercado y características comunes del contrato. Por ello, multiplicar probabilidades individuales sin revisar independencia puede producir resultados engañosos.

### 6.2. Evaluación por puntajes

Se debe reproducir el evaluador del pliego para cada escenario:

```text
puntaje_total = puntaje_económico + demás_puntajes
```

Cuando el puntaje económico depende de una media, la propia oferta debe incluirse si así lo establece el pliego. Cambiar el precio propio cambia también la referencia. No se calcula una media rival fija y luego se supone que permanecerá igual.

La probabilidad de adjudicación se estima contando escenarios en los que se obtiene la mejor clasificación tras aplicar admisibilidad y desempates. Maximizar solo puntaje económico puede fallar si otro participante obtiene ventaja técnica.

Si el método de evaluación aún es desconocido, se analizan escenarios para cada método. Una distribución probabilística para combinarlos debe estar fundamentada. Sin ese fundamento, reportar resultados por método y sensibilidad; no asignar automáticamente probabilidades iguales.

### 6.3. Normalizar datos históricos

Para comparar procesos de distinto tamaño se pueden analizar razones como:

```text
oferta / presupuesto oficial
oferta / costo propio reconstruido del proceso
```

Son referencias diferentes. El presupuesto oficial no equivale al costo real, y los costos internos de los rivales generalmente no son observables. No llamar margen del competidor a una razón calculada contra el presupuesto o contra nuestro costo.

La normalización no corrige por sí sola diferencias de alcance, región, inflación, tributación o reglas. Estas deben controlarse mediante selección de comparables o variables explicativas.

## 7. Procedimiento de cálculo

1. **Fijar el objetivo:** utilidad esperada o probabilidad de adjudicación; definir margen y tolerancias.
2. **Extraer las reglas:** convertir el pliego vigente en condiciones y fórmulas verificables.
3. **Construir el costo:** desagregar rubros y proyectar flujo de caja; identificar incertidumbre.
4. **Calcular la región factible:** piso económico, máximo admisible, límites por ítem y capacidad.
5. **Seleccionar históricos comparables:** conservar fuentes, faltantes y criterios de exclusión.
6. **Estimar competencia:** participantes, ofertas, habilitación y puntajes; contrastar supuestos.
7. **Generar precios candidatos:** explorar el intervalo factible con una malla y refinar cerca de las mejores zonas.
8. **Evaluar cada precio:** calcular resultados analíticamente o mediante escenarios simulados.
9. **Descartar candidatos que incumplen restricciones:** incluida caja y riesgo condicionado a ganar.
10. **Seleccionar y reportar:** precio recomendado, rango cercano, incertidumbre y factores sensibles.
11. **Validar antes de usar:** probar evaluador y predicciones con procesos reservados.
12. **Actualizar después del resultado:** registrar ofertas observadas y, si se ejecuta, costos reales.

En propuestas por ítems se optimiza un vector de precios sujeto a límites y a ingreso por cantidades. Una malla de totales solo sirve si existe una regla justificada para distribuir ese total entre ítems.

## 8. Simulación de Monte Carlo

La simulación consiste en generar escenarios plausibles y aplicar exactamente la misma regla de adjudicación a cada uno. Es una herramienta de cálculo; no sustituye la calidad de los datos.

Para cada precio candidato y escenario:

1. Generar participantes y su admisibilidad.
2. Generar ofertas rivales y otros puntajes manteniendo dependencias relevantes.
3. Generar costos e ingresos inciertos, incluyendo factores comunes con la competencia cuando correspondan.
4. Aplicar evaluación, correcciones y desempates.
5. Registrar adjudicación, utilidad, margen y necesidad de caja.

Con `S` escenarios y `G` adjudicaciones:

```text
q_estimado = G / S
utilidad_esperada = suma_s [I_s × (R_s - C_s)] / S - K
riesgo_pérdida_al_ganar = escenarios_ganados_con_utilidad_negativa / G
riesgo_margen_al_ganar = escenarios_ganados_con_margen_inferior_al_mínimo / G
```

Si `G = 0`, los riesgos condicionados no se estiman con esa muestra; no se reportan como cero.

Conviene usar los mismos escenarios aleatorios para comparar precios y guardar la semilla para reproducibilidad. Aumentar la cantidad de simulaciones hasta que probabilidades y selección sean estables. El error Monte Carlo aproximado de una proporción, bajo escenarios independientes, es `raíz[q × (1-q) / S]`; esto no incluye errores de datos, ajuste ni especificación del modelo.

Registrar por separado incertidumbre del mercado y error de simulación. Simular millones de veces un modelo mal calibrado no lo vuelve confiable.

## 9. Ejemplo ilustrativo

Supuestos: costo completo fijo de $80 millones, margen mínimo sobre ventas del 15 %, costo incremental de ofertar de $1 millón y adjudicación por menor precio. Las probabilidades se asignan exclusivamente para explicar el cálculo; no son estimaciones de un mercado real.

| Precio, millones | Utilidad si gana | Margen sobre ventas | Probabilidad supuesta | Utilidad esperada neta |
|---:|---:|---:|---:|---:|
| 90 | 10 | 11,11 % | 80 % | 7 |
| 95 | 15 | 15,79 % | 65 % | 8,75 |
| 100 | 20 | 20,00 % | 50 % | 9 |
| 105 | 25 | 23,81 % | 30 % | 6,50 |
| 110 | 30 | 27,27 % | 20 % | 5 |

La oferta de $90 millones se descarta por margen. Entre los candidatos mostrados, $100 millones maximiza utilidad esperada y $95 millones maximiza probabilidad de adjudicación respetando el margen. Ninguno se puede declarar óptimo sobre todos los precios posibles sin explorar también los valores intermedios.

La diferencia entre $95 y $100 millones es pequeña en utilidad esperada. Si las probabilidades son inciertas, resulta más razonable reportar un rango de decisión y sensibilidad que atribuir precisión injustificada a un único precio.

## 10. Validación y sensibilidad

### Validar el evaluador

Reconstruir procesos históricos con ofertas conocidas y comprobar puntajes, clasificación y desempates contra resultados oficiales. Resolver discrepancias antes de estimar una oferta nueva.

### Validar las probabilidades

Separar datos por tiempo: ajustar con procesos anteriores y evaluar con posteriores. Evitar usar información que solo estuvo disponible después de presentar la oferta. Revisar si grupos con probabilidades similares presentan frecuencias de adjudicación compatibles, cuando exista una muestra suficiente y comparable.

La reconstrucción de precios alternativos en procesos pasados es contrafactual: permite estudiar qué habría ocurrido manteniendo las ofertas observadas, pero no demuestra cómo habrían reaccionado los rivales bajo otra estrategia repetida.

### Validar costos y resultado económico

Comparar costos estimados y reales de contratos ejecutados, explicando diferencias de alcance. Revisar margen realizado, pérdidas, caja y costos de preparación. La tasa de adjudicación sola no demuestra éxito económico.

### Sensibilidad mínima

- Aumento del costo y retraso de pagos.
- Entrada de participantes y presencia de un competidor agresivo.
- Diferencias de habilitación y puntaje técnico.
- Cambio de método económico si permanece incierto.
- Correlación entre ofertas y errores en comparables.
- Cambios en margen mínimo y tolerancias de riesgo.

Si pequeñas variaciones alteran sustancialmente la oferta recomendada, reportar fragilidad del resultado. Sin datos suficientes, trabajar con escenarios y rangos explícitos; no afirmar probabilidades precisas.

## 11. Resultado que debe entregar el cálculo

| Campo | Contenido |
|---|---|
| Objetivo | Criterio de optimización elegido |
| Oferta recomendada | Precio o vector de precios y base tributaria |
| Rango alternativo | Precios con desempeño parecido y razones para escoger |
| Costo estimado | Valor central, desglose y escenarios |
| Margen | Definición, estimación y piso exigido |
| Probabilidad de adjudicación | Estimación, supuestos e incertidumbre |
| Utilidad esperada | Resultado neto con alcance de costos definido |
| Riesgo de ejecución | Pérdida y margen insuficiente condicionados a ganar |
| Caja | Déficit máximo y financiación requerida |
| Sensibilidad | Variables que más cambian la decisión |
| Trazabilidad | Datos, fuentes, versiones, fórmulas y semilla |
| Limitaciones | Faltantes, comparabilidad y validación disponible |

La decisión de participar también debe comparar el resultado incremental con no participar y con otras oportunidades que consuman los mismos recursos. Una utilidad esperada positiva no vuelve factible una oferta que supera la capacidad financiera u operativa.

## 12. Errores que se deben evitar

- Elegir un descuento fijo sobre presupuesto sin conocer costos y competencia.
- Suponer que el precio más bajo siempre maximiza adjudicación.
- Confundir margen sobre ventas con recargo sobre costo.
- Considerar únicamente el precio ganador histórico.
- Tratar todos los oferentes presentados como admisibles.
- Omitir la propia oferta en una media que debe incluirla.
- Confundir probabilidad de mejor puntaje económico con probabilidad de adjudicación.
- Duplicar financiación, contingencias o cargas.
- Tratar costos rivales no observados como datos conocidos.
- Interpretar una probabilidad estimada como garantía.
- Presentar una adaptación operativa como validación empírica ya realizada.

## 13. Referencias y alcance de respaldo

1. **Friedman, L. (1956). A Competitive-Bidding Strategy. Operations Research, 4(1), 104–112.** Base del enfoque de oferta óptima apoyado en patrones históricos de competencia e incertidumbre de costo. [Artículo original](https://pubsonline.informs.org/doi/abs/10.1287/opre.4.1.104).
2. **Gates, M. (1967). Bidding Strategies and Probabilities. Journal of the Construction Division, 93(1), 75–110.** Estrategias probabilísticas según número e identidad de participantes. [Artículo original](https://ascelibrary.org/doi/10.1061/JCCEAZ.0000192).
3. **Hosny, O. y Elhakeem, A. Simulating the winning bid: A generalized approach for optimum markup estimation.** Respalda el uso de seguimiento del comportamiento rival, adaptación al proceso y simulación para estimar margen óptimo. [Artículo original](https://www.sciencedirect.com/science/article/abs/pii/S0926580511001750).
4. **Chapman, C. B., Ward, S. C. y Bennell, J. A. (2000). Incorporating uncertainty in competitive bidding. International Journal of Project Management, 18, 337–347.** Respalda incorporar incertidumbre y equilibrar adjudicación con rentabilidad y riesgo. [Artículo original](https://www.sciencedirect.com/science/article/abs/pii/S0263786300000132).
5. **Colombia Compra Eficiente. Modelo de pliego para contrato de suministro, 2016.** Ejemplo oficial de evaluación económica mediante medias y menor valor. Se cita para ilustrar mecanismos, no como catálogo obligatorio vigente para todos los procesos. [Documento oficial](https://www.colombiacompra.gov.co/wp-content/uploads/2024/08/20160322_pliegocondiciones_contratosuministro.pdf).

Las fuentes académicas se identificaron mediante sus fichas y resúmenes públicos. Este documento no reproduce ni afirma haber auditado integralmente los textos completos de acceso restringido. Las fórmulas básicas y el procedimiento operativo se explicitan para distinguir el fundamento publicado de las decisiones particulares de implementación.
