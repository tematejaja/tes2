#!/usr/bin/env python3
"""Guion v2: texto, marcas y pausas. Genera ssml/*_v02.ssml y GUION_v2.md, y estima la duración."""
from pathlib import Path
A = Path(__file__).parent
# Cada bloque: lista de (marca, texto, pausa_ms_después). Prefijo "~" en el texto = prosodia 92 %.
G = {
"E0": [("E0_bogota", "Bogotá.", 1300), ("E0_cbolivar", "Al sur, Ciudad Bolívar.", 1200),
       ("E0_bellaflor", "Y en la parte alta de Bella Flor, familias que levantaron aquí sus casas,", 0),
       ("E0_calle", "su trabajo y una red de vecinos.", 800),
       ("E0_pregunta", "Cuando a una de ellas le hablan de reubicarse, la pregunta no es solo a qué casa va a llegar.", 300),
       ("E0_demas", "~Es qué va a pasar con todo lo demás.", 0)],
"E1": [("E1_problema", "En un proceso así, lo que la familia cuenta y acuerda puede perderse:", 150),
       ("E1_equipos", "cambian los equipos,", 100), ("E1_preguntas", "se repiten las preguntas", 100),
       ("E1_compromisos", "y quedan compromisos sin verificar.", 500),
       ("E1_titulo", "Por eso proponemos Mi Ruta de Reubicación,", 100),
       ("E1_complementa", "un piloto que complementa lo que ya hacen las entidades del Distrito", 0),
       ("E1_validar", "y que construimos y validamos con ellas y con la comunidad.", 450),
       ("E1_idea", "~Más que un traslado, un nuevo comienzo.", 0)],
"E2": [("E2_como", "¿Cómo funciona? Con tres piezas.", 250),
       ("E2_gestora", "Una gestora social con nombre propio, que acompaña a cada hogar.", 250),
       ("E2_ficha", "Una ficha de caracterización familiar, que se actualiza en cada paso y pasa de un equipo a otro,", 0),
       ("E2_historia", "para que la familia no tenga que repetir su historia.", 250),
       ("E2_compromisos", "Y compromisos con responsable, fecha y prueba de cumplimiento.", 450),
       ("E2_ruta", "Todo ocurre en seis etapas,", 100),
       ("E2_resil", "atravesadas por la resiliencia, que se sigue en cinco dimensiones,", 0),
       ("E2_mesas", "y por mesas de trabajo donde la gestora hace de mentora.", 0)],
"C1": [("C1_familia", "Sigamos a una familia ficticia. La mamá prepara almuerzos y los vende en el barrio;", 100),
       ("C1_vecina", "mientras trabaja, una vecina le cuida a los niños.", 400),
       ("C1_escucha", "En la primera etapa, la gestora la visita y, sobre todo, la escucha: qué quiere conservar y qué propone.", 250),
       ("C1_ficha", "Con eso diligencia la ficha de caracterización,", 0),
       ("C1_dimensiones", "en cinco dimensiones: vivienda, economía, redes de cuidado, servicios y participación.", 250),
       ("C1_corrige", "La familia la revisa y la corrige.", 250),
       ("C1_nogarantiza", "Y queda claro que participar no garantiza una vivienda, ni obliga a aceptar una alternativa.", 400),
       ("C1_urgencia", "Eso sí: ante un riesgo inmediato para la vida, no se espera ninguna etapa; se activa el canal de emergencia.", 0)],
"C2": [("C2_plan", "En la segunda etapa se arma el plan de reubicación.", 200),
       ("C2_opciones", "Se comparan las opciones realmente disponibles: su costo y su cercanía al trabajo, al colegio y a la red de cuidado.", 250),
       ("C2_presupuesto", "También se calcula el saldo del hogar:", 100),
       ("C2_saldo", "ingresos netos menos gastos esenciales, hoy y en la nueva vivienda.", 300),
       ("C2_propuesta", "Y la familia propone seguir vendiendo almuerzos cerca de su nuevo hogar;", 100),
       ("C2_codigo", "la propuesta queda registrada, con alguien responsable de responderla.", 0)],
"C3": [("C3_entidades", "En la tercera etapa, las entidades responden.", 150),
       ("C3_mesa", "En la mesa técnica, con delegados de la comunidad, se revisan los asuntos colectivos, y cada entidad dice qué puede hacer y en qué plazo.", 250),
       ("C3_privado", "El caso de la familia, en cambio, se revisa aparte, con ella, para proteger su información.", 250),
       ("C3_incidencia", "Y su propuesta sí cambia el plan: se acepta con ajustes,", 0),
       ("C3_noviable", "y lo que no es viable se explica, con alternativas.", 250),
       ("C3_hoja", "Todo queda en una hoja de devolución: qué se decidió, por qué y qué sigue.", 250),
       ("C3_desacuerdo", "Si hay un desacuerdo, el caso no se congela: se escala a quien decide y lo demás sigue avanzando.", 250),
       ("C3_entregada", "Así, la preparación queda entregada.", 0)],
"C4": [("C4_ejecuta", "En la cuarta etapa, cada entidad cumple lo ya confirmado, y el piloto acompaña y registra.", 350),
       ("C4_nomudanza", "Pero ojo: ~preparación entregada no es mudanza.", 200),
       ("C4_condiciones", "Antes del traslado, la entidad competente verifica las condiciones: vivienda, servicios, economía del hogar y cuidado.", 350),
       ("C4_entrega", "Y frente a la familia, la gestora entrega la ficha al equipo siguiente,", 0),
       ("C4_confirma", "que confirma haberla recibido.", 0)],
"C5": [("C5_traslado", "Con el traslado hecho, llega la quinta etapa: el acompañamiento.", 300),
       ("C5_alerta", "Si los ingresos caen de forma importante, o falta lo básico, se activa una alerta,", 0),
       ("C5_tarjeta", "con responsable, acción y fecha.", 300),
       ("C5_nocierra", "Y no se cierra porque se envió un oficio o una remisión:", 100),
       ("C5_cierre", "se cierra cuando la ayuda llega y la familia lo confirma.", 0)],
"C6": [("C6_revisa", "En la sexta etapa, el cierre, se revisa con la familia qué se cumplió.", 200),
       ("C6_pendiente", "Lo pendiente, como la respuesta sobre el predio de origen, pasa a quien continuará, con fecha.", 600),
       ("C6_llaves", "~Porque entregar las llaves no significa que todo esté resuelto.", 0)],
"E9": [("E9_frase", "~De eso se trata: de que lo que una familia necesita antes de trasladarse se convierta en compromisos que alguien acompaña y comprueba después.", 600),
       ("E9_piloto", "Mi Ruta de Reubicación propone acompañar durante doce meses a trescientos cincuenta hogares de Bella Flor.", 150),
       ("E9_notraslados", "Acompañarlos, no trasladarlos a todos.", 600),
       ("E9_final", "Porque reubicarse no debería ser empezar de cero, ~sino volver a empezar, con alguien al lado.", 0)],
}
LEAD = {"E0": 800, "E1": 0, "E2": 0, "C1": 400, "C2": 400, "C3": 400, "C4": 400, "C5": 400, "C6": 400, "E9": 400}
def frag(txt):
    if "~" not in txt: return txt
    a, b = txt.split("~", 1); return (a + f'<prosody rate="92%">{b}</prosody>').strip()
def ssml(b):
    s = "<speak>\n" + (f'  <break time="{LEAD[b]}ms"/>\n' if LEAD[b] else "")
    for m, t, p in G[b]:
        s += f'  <mark name="{m}"/>{frag(t)}' + (f' <break time="{p}ms"/>' if p else "") + "\n"
    return s + "</speak>\n"
if __name__ == "__main__":
    tot = pau = 0; md = ["# Guion de narración v2\n", "Texto plano por bloque (las marcas sincronizan la animación).\n"]
    for b in G:
        (A / f"ssml/{b}_v02.ssml").write_text(ssml(b))
        w = sum(len(t.replace("~", "").split()) for _, t, _ in G[b]); p = (LEAD[b] + sum(x[2] for x in G[b])) / 1000
        tot += w; pau += p; print(f"{b}: {w} palabras, {p:.2f} s pausas")
        md.append(f"\n## {b}\n\n" + " ".join(t.replace("~", "") for _, t, _ in G[b]) + "\n")
    (A / "GUION_v2.md").write_text("".join(md))
    for r in (2.6, 2.75, 2.9):
        d = tot / r + pau + 7 + 10; print(f"a {r} p/s: voz {tot/r:.0f}s · total ≈ {int(d//60)}:{d%60:04.1f}")
    print("TOTAL", tot, "palabras;", round(pau, 2), "s de pausas")
