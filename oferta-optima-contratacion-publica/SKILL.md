---
name: oferta-optima-contratacion-publica
description: Determina el precio de una oferta óptima en licitaciones y contratación pública (menor precio, medias, puntajes). Calcula piso económico y margen mínimo, estima la probabilidad de adjudicación, simula con Monte Carlo y reporta utilidad esperada, riesgo, caja y sensibilidad. Usar cuando el usuario hable de preparar, fijar o evaluar el precio de una oferta o propuesta económica en una licitación, pliego, concurso o proceso de contratación, de margen mínimo, de probabilidad de ganar una licitación o de estrategia de ofertas competitivas (competitive bidding).
---

# Oferta óptima en contratación pública

Metodología para escoger un precio competitivo que preserve una rentabilidad aceptable, combinando costo de ejecución, probabilidad de adjudicación y reglas de evaluación del proceso. Es una aplicación operativa de Friedman (1956) y Gates (1967), con simulación e incertidumbre. **No es una fórmula universal ni garantiza adjudicaciones**; la política de margen y las restricciones son decisiones del negocio.

Documento completo (fórmulas, tablas de variables, ejemplo, validación, referencias): `references/metodologia.md`. Léelo cuando necesites el detalle de una sección. Calculadora de apoyo: `scripts/calcular_oferta.py`.

## Flujo de trabajo

Responde en el idioma del usuario (por defecto español). Pide al usuario lo que falte; **un dato faltante no es cero**: clasifica cada dato como observado, estimado, supuesto o pendiente.

1. **Fijar el objetivo antes de calcular** (no cambiarlo después de ver el resultado):
   - A. Maximizar utilidad esperada con margen mínimo (recomendado para rentabilidad sostenida).
   - B. Maximizar probabilidad de adjudicación con margen mínimo.
   - Definir también margen mínimo, tolerancias `alfa`/`beta` de riesgo, límite de caja y capacidad operativa.
2. **Extraer las reglas del pliego vigente** (con adendas): presupuesto y topes, admisibilidad, fórmula económica exacta (redondeos, qué ofertas entran en las medias), puntajes no económicos, desempate, método variable, tipo de procedimiento (oferta cerrada vs. subasta). Un pliego modelo no sustituye al pliego del proceso.
3. **Construir el costo** `C` desagregado: directos, indirectos, garantías/seguros, tributos y retenciones (base neta coherente, sin sumar IVA como utilidad), pagos y caja, financiación, variación de precios, riesgos concretos, preparación de oferta `K`. No duplicar contingencias ni financiación.
4. **Región factible**: piso `C / (1 - m_min)` (redondeado hacia arriba a la unidad permitida), máximo admisible, límites por ítem, capacidad. Si máximo < piso → no hay oferta factible: revisar costos con justificación o no participar.
5. **Históricos comparables**: incluir **todas** las ofertas (también las perdedoras), reglas, admisibilidad y resultado; no usar solo precios ganadores. Normalizar (oferta/presupuesto, oferta/costo propio) sin llamarlo margen del competidor.
6. **Probabilidad de adjudicación** `q(p)`:
   - Menor precio: `q(p) = Π_j [1 - F_j(p)]` solo si los rivales participan, son admisibles, independientes y sin empates; si no, ampliar el modelo.
   - Puntajes: reproducir el evaluador del pliego por escenario (la propia oferta entra en las medias si el pliego lo dice; no fijar una media rival constante).
   - Método incierto: reportar resultados por método y sensibilidad, sin asignar probabilidades iguales por defecto.
7. **Evaluar precios candidatos**: malla en el intervalo factible y refinamiento en las mejores zonas. Con costo determinístico: `UE(p) = q(p)·(p - C) - K`; con incertidumbre: `E[I_adj(p)·(R - C)] - K`. En precios unitarios o cantidades variables, modelar el ingreso real, no el total nominal; en ofertas por ítems optimizar un vector de precios.
8. **Monte Carlo** cuando haga falta: mismos escenarios para todos los precios, semilla guardada, `q = G/S`, riesgos condicionados a ganar (`G = 0` → no estimable, nunca “cero”), error MC `√(q(1-q)/S)` reportado aparte de la incertidumbre del modelo.
9. **Descartar** candidatos que incumplen margen, riesgo de pérdida/margen al ganar, caja o capacidad.
10. **Validar y reportar** (ver abajo). Tras el resultado, recomendar registrar ofertas observadas y costos reales.

Para cálculos numéricos usa `scripts/calcular_oferta.py` (piso económico, recargo↔margen, tabla de candidatos con utilidad esperada, Monte Carlo para menor precio):

```bash
python3 <ruta-del-skill>/scripts/calcular_oferta.py --help
python3 <ruta-del-skill>/scripts/calcular_oferta.py piso --costo 80 --margen-min 0.15
python3 <ruta-del-skill>/scripts/calcular_oferta.py tabla --costo 80 --margen-min 0.15 --k 1 \
    --puntos 90:0.80 95:0.65 100:0.50 105:0.30 110:0.20
python3 <ruta-del-skill>/scripts/calcular_oferta.py montecarlo --costo 80 --margen-min 0.15 --k 1 \
    --rivales-normal 100:8 98:6 105:10 --paso 0.5 --n 20000 --semilla 1
```

## Reglas que no se deben violar

- Margen sobre ventas ≠ recargo sobre costo: `m = (p-C)/p`, `r = (p-C)/C`, `m = r/(1+r)`, `piso = C/(1-m_min)`.
- Costos ya incurridos son hundidos: no restarlos de la decisión actual. `K` no cambia qué precio es óptimo, sí si participar.
- El piso protege el margen solo respecto al costo usado; con incertidumbre exigir `P(margen real < m_min | gana) ≤ beta` y `P(utilidad real < 0 | gana) ≤ alfa`.
- No asumir que el precio más bajo maximiza la adjudicación; no tratar a todos los oferentes presentados como admisibles; no confundir mejor puntaje económico con adjudicación.
- Costos de rivales no son observables; no presentarlos como datos.
- Una probabilidad estimada no es garantía. No afirmar validación empírica de una adaptación operativa. Si pequeñas variaciones cambian la recomendación, reportar fragilidad y dar rangos.
- Con pocos datos, trabajar con escenarios y rangos explícitos, no con probabilidades precisas. Si el ejemplo usa probabilidades supuestas, decirlo.
- Si es una subasta con rondas, advertir que se requiere un modelo dinámico.

## Validación y sensibilidad mínima

Validar el evaluador reconstruyendo procesos históricos; validar probabilidades con partición temporal (ajustar con anteriores, probar con posteriores; la reconstrucción de precios alternativos es contrafactual); validar costos contra ejecutados. Sensibilidad mínima: aumento de costo y retraso de pagos; entrada de participantes/competidor agresivo; diferencias de habilitación y puntaje técnico; método económico incierto; correlación entre ofertas; cambios de margen mínimo y tolerancias.

## Entregable

Informe con estos campos: **objetivo**; **oferta recomendada** (precio o vector, base tributaria); **rango alternativo** y razones; **costo estimado** (central, desglose, escenarios); **margen** (definición, estimación, piso); **probabilidad de adjudicación** (estimación, supuestos, incertidumbre); **utilidad esperada** (alcance de costos); **riesgo de ejecución** condicionado a ganar; **caja** (déficit máximo, financiación); **sensibilidad**; **trazabilidad** (datos, fuentes, versiones, fórmulas, semilla); **limitaciones**. Incluir la comparación con no participar y con otras oportunidades que usen los mismos recursos; utilidad esperada positiva no hace factible una oferta que excede la capacidad financiera u operativa.

Si el usuario aporta pocos datos, entrega primero el piso económico, la región factible y la lista de datos pendientes antes de recomendar un precio.
