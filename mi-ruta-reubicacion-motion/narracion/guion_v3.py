#!/usr/bin/env python3
"""Guion v2: texto, marcas y pausas. Genera ssml/*_v02.ssml y GUION_v2.md, y estima la duración."""
from pathlib import Path
A = Path(__file__).parent
# Cada bloque: lista de (marca, texto, pausa_ms_después). Prefijo "~" en el texto = prosodia 92 %.
G = {
"E0": [("E0_bogota", "Bogotá.", 800), ("E0_cbolivar", "Al sur, Ciudad Bolívar.", 800),
       ("E0_bellaflor", "Y en la parte alta de Bella Flor, familias que levantaron aquí sus casas y su vida.", 700),
       ("E0_pregunta", "Cuando a una de ellas le hablan de reubicarse, la pregunta no es solo a qué casa va a llegar.", 300),
       ("E0_demas", "~Es qué va a pasar con todo lo demás: su trabajo, sus vecinos, quien le cuida a los niños.", 0)],
"E1": [("E1_problema", "En un proceso así, lo que la familia cuenta y acuerda puede perderse:", 150),
       ("E1_equipos", "cambian los equipos,", 100), ("E1_preguntas", "se repiten las preguntas", 100),
       ("E1_compromisos", "y hay compromisos que se quedan sin verificar.", 500),
       ("E1_titulo", "Por eso proponemos Mi Ruta de Reubicación:", 100),
       ("E1_complementa", "un piloto que complementa lo que ya hacen las entidades del Distrito,", 0),
       ("E1_validar", "y que construimos y validamos con ellas y con la comunidad.", 0)],
"E2": [("E2_como", "¿Cómo funciona? Con tres piezas.", 250),
       ("E2_gestora", "Primero, una gestora social con nombre propio, y otra de respaldo.", 300),
       ("E2_ficha", "Segundo, una ficha de caracterización familiar que pasa de un equipo a otro,", 0),
       ("E2_historia", "para que la familia no repita su historia.", 300),
       ("E2_compromisos", "Y tercero, compromisos con responsable, fecha y prueba de cumplimiento.", 450),
       ("E2_ruta", "Todo esto avanza en seis etapas.", 250),
       ("E2_resil", "En todas hay dos apoyos: la resiliencia, o sea, que la familia pueda enfrentar el cambio y pedir apoyo;", 150),
       ("E2_mesas", "y las mesas de trabajo, donde la gestora acompaña como mentora.", 0)],
"C1": [("C1_familia", "Sigamos a una familia ficticia. La mamá prepara almuerzos y los vende en el barrio;", 100),
       ("C1_vecina", "mientras trabaja, una vecina le cuida a los niños.", 400),
       ("C1_escucha", "En la primera etapa, diagnóstico y caracterización, la gestora escucha a la familia: qué quiere conservar y qué propone.", 250),
       ("C1_mesa", "En la mesa comunitaria, los vecinos también proponen.", 300),
       ("C1_ficha", "Con eso llena la ficha de caracterización familiar,", 0),
       ("C1_dimensiones", "en cinco dimensiones: vivienda, economía, redes de cuidado, servicios y participación.", 250),
       ("C1_corrige", "La familia la revisa y la corrige.", 250),
       ("C1_nogarantiza", "Desde el primer día, ella sabe que participar no le garantiza vivienda, ni la obliga a aceptar una alternativa.", 400),
       ("C1_urgencia", "Si hay un riesgo inmediato para la vida, se activa el canal de emergencia, sin esperar ninguna etapa.", 0)],
"C2": [("C2_plan", "En la segunda etapa se arma el plan de reubicación.", 200),
       ("C2_opciones", "Se comparan las opciones reales, aunque sea una sola: costo y cercanía al trabajo, al colegio y a la red de cuidado.", 300),
       ("C2_presupuesto", "Luego se hace un plan económico de transición:", 100),
       ("C2_saldo", "ingresos netos menos gastos esenciales, hoy y en la nueva vivienda.", 300),
       ("C2_propuesta", "La familia propone seguir vendiendo sus almuerzos cerca del nuevo hogar,", 0),
       ("C2_codigo", "y la gestora se encarga de que le respondan.", 0)],
"C3": [("C3_entidades", "En la tercera etapa, articulación institucional, responden las entidades.", 200),
       ("C3_mesa", "En la mesa técnica, con delegados de la comunidad, cada entidad dice qué puede hacer y cuándo.", 300),
       ("C3_privado", "El caso de cada familia se revisa aparte, con ella presente.", 300),
       ("C3_incidencia", "Aquí la propuesta de la mamá sí cambia el plan: se acepta con ajustes;", 0),
       ("C3_noviable", "lo que no es viable se le explica, con alternativas.", 250),
       ("C3_hoja", "Todo queda por escrito en una hoja de devolución.", 300),
       ("C3_desacuerdo", "Si hay desacuerdo, el caso se escala, pero no se congela.", 400),
       ("C3_entregada", "Con la ficha, el plan y las respuestas listos, se marca un hito: ~la preparación entregada.", 0)],
"C4": [("C4_ejecuta", "En la cuarta etapa, ejecución, cada entidad cumple lo que confirmó, y el piloto acompaña.", 350),
       ("C4_nomudanza", "Pero ojo: ~preparación entregada no es mudanza.", 250),
       ("C4_condiciones", "Antes del traslado, la entidad competente verifica las condiciones.", 350),
       ("C4_entrega", "Luego, en la entrega del caso, la gestora pasa la ficha al equipo siguiente,", 0),
       ("C4_confirma", "que confirma haberla recibido.", 0)],
"C5": [("C5_traslado", "Ya en la nueva vivienda llega la quinta etapa: el acompañamiento.", 300),
       ("C5_alerta", "Si meses después los ingresos de la mamá bajan mucho, se activa una alerta,", 0),
       ("C5_tarjeta", "con responsable, acción y fecha.", 300),
       ("C5_nocierra", "La alerta no se cierra con un oficio o una remisión,", 0),
       ("C5_cierre", "sino cuando la ayuda llega y la familia lo confirma.", 0)],
"C6": [("C6_revisa", "En la sexta etapa, cierre y seguimiento, se revisa con la familia qué se cumplió.", 250),
       ("C6_pendiente", "Lo pendiente, como el futuro del predio donde vivían, pasa a un receptor de continuidad.", 300),
       ("C6_resultado", "El caso cierra con atención pendiente, pero con alguien que sigue.", 500),
       ("C6_llaves", "~Porque entregar las llaves no significa que todo esté resuelto.", 0)],
"E9": [("E9_piloto", "Mi Ruta de Reubicación propone acompañar durante doce meses a trescientos cincuenta hogares de Bella Flor:", 150),
       ("E9_notraslados", "una meta de acompañamiento, no de traslados.", 600),
       ("E9_frase", "~Lo que una familia necesita antes de trasladarse se convierte en compromisos que alguien acompaña y comprueba después.", 600),
       ("E9_final", "Para que la mamá de nuestra historia no tenga que escoger entre una casa nueva y todo lo demás; ~para que reubicarse no sea empezar de cero, sino seguir adelante, con alguien al lado.", 0)],
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
    tot = pau = 0; md = ["# Guion de narración v3\n", "Texto plano por bloque (las marcas sincronizan la animación).\n"]
    for b in G:
        (A / f"ssml/{b}_v03.ssml").write_text(ssml(b))
        w = sum(len(t.replace("~", "").split()) for _, t, _ in G[b]); p = (LEAD[b] + sum(x[2] for x in G[b])) / 1000
        tot += w; pau += p; print(f"{b}: {w} palabras, {p:.2f} s pausas")
        md.append(f"\n## {b}\n\n" + " ".join(t.replace("~", "") for _, t, _ in G[b]) + "\n")
    (A / "GUION_v3.md").write_text("".join(md))
    for r in (2.6, 2.75, 2.9):
        d = tot / r + pau + 7 + 6; print(f"a {r} p/s: voz {tot/r:.0f}s · total ≈ {int(d//60)}:{d%60:04.1f}")
    print("TOTAL", tot, "palabras;", round(pau, 2), "s de pausas")
