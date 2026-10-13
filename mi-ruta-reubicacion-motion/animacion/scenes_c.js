// ===== C4 ejecución, C5 acompañamiento, C6 cierre, E9 final, créditos y control =====
const PROF = { color: '#7A4FA8', label: 'Profesional de acompañamiento' };
function sceneC4(t) {
  let g = roomBg();
  let a = roomBg() + text(960, 190, 'Cada entidad cumple lo ya confirmado', { size: 40, weight: 800, anchor: 'middle' });
  [['Entidad de vivienda', 'A-01 · confirmado', true], ['Entidad de oferta social', 'Acuerdo de cuidado · confirmado', true], ['Entidad de desarrollo económico', 'A-02 · solo solicitado', false]].forEach(([n, s, ok], i) => {
    const y = 240 + i * 165;
    a += rect(330, y, 1400, 140, { r: 18, fill: '#fff', stroke: C.ink, sw: 3 }) + text(360, y + 52, n, { size: 28, weight: 800 });
    const k = ok ? eo(prog(t, M.C4_ejecuta + .4 + i * .4, M.C4_ejecuta + 2.8 + i * .4)) : .1;
    a += rect(360, y + 80, 920, 28, { r: 14, fill: '#E4E8EA' }) + rect(360, y + 80, 920 * k, 28, { r: 14, fill: ok ? C.ok : C.none });
    a += chip(1310, y + 34, s, { size: 22, fill: ok ? '#DDF3E6' : '#ECEFF1', stroke: ok ? C.okd : C.noned });
    if (!ok) a += text(1310, y + 126, 'no se presenta como un hecho', { size: 21, weight: 600, fill: C.noned });
  });
  a += person(150, 830, 1.0, { ...P.gestora, arm2: 60 }) + G(t, M.C4_ejecuta + .8, tag(40, 590, 'Acompaña y registra', { size: 22 }), {});
  g += win(t, B.C4.start, M.C4_finanzas, a, .01, .35);
  // ejemplo: resiliencia financiera de la mamá antes del traslado
  const tf = M.C4_finanzas;
  let f = roomBg() + text(960, 200, 'Antes del traslado: resiliencia financiera', { size: 42, weight: 800, anchor: 'middle' });
  f += person(430, 830, 1.0, { ...P.madre, arm2: t > tf + 5.4 ? 70 : 20 }) + tag(430 - 150, 562, 'Mamá · cabeza de hogar', { size: 24, center: true, w: 300 });
  f += person(1730, 830, .95, { ...P.gestora, flip: true });
  f += rect(690, 270, 880, 440, { r: 24, fill: C.ivory, stroke: C.ink, sw: 4 }) + rect(690, 270, 880, 70, { r: 24, fill: C.navy }) + rect(690, 316, 880, 24, { fill: C.navy }) + text(1130, 318, 'RESILIENCIA FINANCIERA DEL HOGAR', { size: 28, weight: 800, fill: C.teal, anchor: 'middle', ls: 1 });
  [['birrete', 'Formación financiera', 'capacitación antes de mudarse', 4.3], ['banco', 'Primera cuenta bancaria', 'abierta a su nombre', 5.4]].forEach(([ic, s1, s2, dt], i) => {
    const y = 432 + i * 150;
    f += G(t, tf + dt, `${circ(780, y, 46, { fill: '#fff', stroke: C.ink, sw: 3 })}${icon(ic, 780, y, 54, C.roofb)}${text(850, y - 4, s1, { size: 34, weight: 800 })}${text(850, y + 36, s2, { size: 26, weight: 600, fill: C.noned })}${stIcon('atendida', 1500, y, 22)}`, { dx: 30, dy: 0 });
  });
  g += win(t, M.C4_finanzas, M.C4_nomudanza, f);
  // preparación entregada no es mudanza: condiciones previas
  let b = roomBg() + rect(380, 140, 1160, 680, { r: 24, fill: C.ivory, stroke: C.ink, sw: 4 });
  b += text(960, 205, 'Antes del traslado: condiciones verificadas', { size: 38, weight: 800, anchor: 'middle' });
  b += tag(960 - 300, 228, 'Preparación entregada ≠ mudanza', { size: 28, fill: '#FBE3E1', stroke: C.critd, color: C.critd, center: true, w: 600 });
  b += text(1500, 318, 'Verifica: entidad competente', { size: 22, weight: 800, fill: C.roofb, anchor: 'end' });
  const conds = ['Vivienda', 'Servicios y acceso', 'Economía del hogar', 'Cuidado', 'Logística del traslado', 'Quién sigue acompañando'];
  conds.forEach((c, i) => {
    const y = 380 + i * 66, t0 = M.C4_condiciones + .4 + i * .42, care = i === 3, done = care ? t > t0 + .7 : t > t0;
    b += text(450, y + 8, c, { size: 30, weight: 700 }) + line(430, y + 28, 1490, y + 28, { stroke: C.slate, sw: 2 });
    if (done) b += stIcon('atendida', 1330, y - 2, 19) + text(1362, y + 8, 'Verificada', { size: 25, weight: 700, fill: C.okd });
    else if (care && t > t0) b += tag(1150, y - 24, 'Pendiente visible', { size: 22, fill: '#FFF1B8', stroke: C.warnd });
  });
  g += win(t, M.C4_nomudanza, M.C4_entrega, b);
  // entrega del caso
  let c = roomBg() + G(t, M.C4_entrega, tag(960 - 220, 190, 'Entrega del caso, frente a la familia', { size: 32, fill: C.teal, center: true, w: 440 }), {});
  const mv = eio(prog(t, M.C4_entrega + .6, M.C4_entrega + 2.6)), fx = lerp(1040, 1310, mv);
  c += person(700, 830, 1.0, { ...P.madre, arm2: 25 }) + person(1010, 830, 1.0, { ...P.gestora, arm2: t < M.C4_entrega + 2.8 ? 70 : 14 }) + person(1420, 830, 1.0, { ...P.prof, flip: true, arm1: 40 });
  const kout = B.C4.start + B.C4.audio - .1;
  c += G(t, M.C4_entrega - .2, rect(fx - 135, 400, 270, 108, { r: 12, fill: C.ivory, stroke: C.ink, sw: 3 }) + text(fx, 440, 'Ficha de caracterización', { size: 20, weight: 800, anchor: 'middle' }) + text(fx, 466, 'familiar', { size: 20, weight: 800, anchor: 'middle' }) + circ(fx, 490, 10, { fill: t > M.C4_entrega + 2.2 ? '#7A4FA8' : C.roofb }), { out: kout, dy: 0 });
  c += G(t, M.C4_entrega + .3, tag(1420 - 170, 560, 'Profesional de acompañamiento', { size: 21, center: true, w: 340 }), { out: kout });
  c += G(t, M.C4_confirma, tag(1290, 300, 'Recibido ✓', { size: 36, fill: '#DDF3E6', stroke: C.okd, color: C.okd, sw: 4 }), { dy: -10, out: kout });
  c += G(t, M.C4_confirma + .5, `${rect(640, 470, 120, 74, { r: 10, fill: C.ivory, stroke: C.ink, sw: 3 })}${text(700, 514, 'Copia', { size: 24, weight: 800, anchor: 'middle' })}`, { dy: -10, out: kout });
  const ka = prog(t, B.C4.start + B.C4.audio + .2, B.C4.start + B.C4.audio + .6);
  if (ka > 0) c += `<g opacity="${F(ka)}">${rect(0, 0, W, H, { fill: C.navy, op: .5 })}${rect(620, 300, 680, 340, { r: 24, fill: 'rgba(19,32,43,.96)' })}${icon('llave', 960, 430, 150, C.teal)}${text(960, 555, 'Traslado efectivo', { size: 48, weight: 800, fill: '#fff', anchor: 'middle' })}${text(960, 600, 'condiciones verificadas por la entidad competente', { size: 24, weight: 600, fill: '#cfe3ea', anchor: 'middle' })}</g>`;
  g += win(t, M.C4_entrega, undefined, c);
  return g;
}
function sceneC5(t) {
  let g = landscape(t * 8, .12);
  g += rect(180, 260, 620, 575, { fill: '#C9CED2' }) + path('M180 260 H800 V835 H180Z', { stroke: C.ink, sw: 3 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) g += rect(220 + c * 145, 300 + r * 120, 90, 80, { fill: (r === 3 && c === 1) ? '#FFE9A8' : '#52687A', stroke: C.ink, sw: 2 });
  g += rect(450, 735, 100, 100, { fill: '#52687A', stroke: C.ink, sw: 2 });
  const conf = t > M.C5_cierre + 1.6 && t < M.C5_cierre + 3.2;
  g += person(1010, 830, 1.0, { ...P.madre, arm2: conf ? 140 : 25 }) + rect(1050, 775, 100, 12, { fill: '#6b4a32' }) + icon('olla', 1100, 750, 44, C.ink);
  const econ = t < M.C5_alerta + .3 ? 'atendida' : t < M.C5_cierre + .6 ? 'critica' : t < M.C5_cierre + 2.0 ? 'gestion' : 'atendida';
  const f = ficha(0, 0, { rows: ['atendida', econ, 'atendida', 'gestion', 'atendida'], resp: PROF, hab: 'reubicación definitiva', extra: ['Próximo contacto: fecha acordada'] });
  g += G(t, B.C5.start + .3, scaled(1110, 140, .8, f.svg), { dx: 60, dy: 0 });
  const bn = 1 - prog(t, M.C5_alerta - .4, M.C5_alerta + .1);
  if (bn > 0) g += `<g opacity="${F(bn)}">${rect(120, 150, 880, 96, { r: 14, fill: 'rgba(19,32,43,.94)' })}${text(560, 193, 'Traslado efectivo', { size: 36, weight: 800, fill: '#fff', anchor: 'middle' })}${text(560, 230, 'condiciones verificadas por la entidad competente', { size: 22, weight: 600, fill: '#cfe3ea', anchor: 'middle' })}</g>`;
  const closed = t > M.C5_cierre + 2.0;
  g += G(t, M.C5_alerta + .3, `${rect(110, 270, 790, 480, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${rect(110, 270, 790, 70, { r: 22, fill: closed ? '#DDF3E6' : '#FBE3E1', stroke: C.ink, sw: 4 })}${text(505, 318, closed ? 'ALERTA CERRADA ✓' : 'ALERTA ECONÓMICA', { size: 34, weight: 800, fill: closed ? C.okd : C.critd, anchor: 'middle' })}${text(140, 392, 'Caída importante del ingreso neto', { size: 26, weight: 700 })}${text(140, 428, 'o necesidad básica desatendida', { size: 26, weight: 700 })}`, { dy: 16 });
  [['Responsable', 'Profesional de acompañamiento'], ['Acción', 'Gestionar la atención con quien corresponda'], ['Fecha de revisión', 'Fecha acordada con la familia']].forEach((fl, i) => {
    g += G(t, M.C5_tarjeta + i * .5, `${line(130, 470 + i * 84, 880, 470 + i * 84, { stroke: C.slate, sw: 2 })}${text(140, 504 + i * 84, fl[0] + ':', { size: 24, weight: 800, fill: C.noned })}${text(140, 536 + i * 84, fl[1], { size: 24, weight: 600 })}`, { dy: 8 });
  });
  g += G(t, M.C5_nocierra, tag(110, 770, 'Oficio o remisión enviada: la alerta sigue abierta', { size: 22, fill: '#FFF1B8', stroke: C.warnd }), { dy: 8, out: M.C5_cierre + .8 });
  g += G(t, M.C5_cierre + 1.15, tag(110, 770, 'La ayuda llegó y la familia lo confirmó ✓', { size: 22, fill: '#DDF3E6', stroke: C.okd, color: C.okd }), { dy: 8 });
  return g;
}
function sceneC6(t) {
  let g = roomBg();
  let a = roomBg() + person(260, 830, .85, P.madre) + person(470, 830, .85, P.prof) + person(1640, 830, .85, { ...P.rec, flip: true }) + tag(470 - 175, 596, 'Profesional de acompañamiento', { size: 20, center: true, w: 350 });
  a += rect(140, 150, 600, 330, { r: 20, fill: C.ivory, stroke: C.okd, sw: 5 }) + text(440, 208, 'Cumplido ✓', { size: 42, weight: 800, fill: C.okd, anchor: 'middle' });
  a += G(t, M.C6_revisa + 3.9, chip(170, 245, 'Compromiso A-01 · verificado con el hogar', { size: 23, fill: '#DDF3E6', stroke: C.okd }), { dy: 10 });
  a += rect(790, 150, 650, 330, { r: 20, fill: C.ivory, stroke: C.warnd, sw: 5 }) + text(1115, 208, 'Pendiente', { size: 42, weight: 800, fill: C.warnd, anchor: 'middle' });
  a += G(t, M.C6_pendiente + .8, `${text(820, 272, 'Respuesta sobre el predio de origen', { size: 26, weight: 700 })}${text(820, 310, 'en evaluación por la autoridad competente', { size: 23, weight: 600, fill: C.noned })}`, { dy: 10 });
  a += G(t, M.C6_pendiente + 2.9, `${arrow(1445, 360, 1620, 560, {})}${tag(1640 - 160, 572, 'Receptor de continuidad', { size: 22, center: true, w: 320 })}${tag(1470, 214, 'Próxima acción: fecha', { size: 24 })}`, { dy: 10 });
  [['Preparación fortalecida', 0], ['Adaptación observada', 1], ['Atención pendiente', 2]].forEach(([n, i]) => { const on = i === 2 && t > M.C6_resultado + 1.2;
    a += G(t, M.C6_resultado + i * .3, `${rect(160 + i * 450, 510, 420, 70, { r: 14, fill: on ? '#FFF1B8' : '#F2EEE5', stroke: on ? C.warnd : C.noned, sw: on ? 5 : 2.5 })}${text(370 + i * 450, 556, n, { size: 28, weight: 800, fill: on ? C.warnd : C.noned, anchor: 'middle' })}`, { dy: 8 }); });
  g += win(t, B.C6.start, M.C6_llaves, a, .01, .35);
  let b = roomBg() + tableTop(560, 660, 800) + person(300, 830, .95, P.madre) + person(1640, 830, .95, { ...P.rec, flip: true });
  b += G(t, M.C6_llaves, icon('llave', 700, 615, 130, C.ink), { dy: -30 });
  const f = ficha(0, 0, { resp: { color: '#2F7A8A', label: 'Receptor de continuidad' }, hab: 'reubicación definitiva', extra: ['Pendiente: respuesta sobre el predio de origen', 'Próxima acción: fecha acordada'] });
  b += G(t, M.C6_llaves - .1, scaled(860, 150, .9, f.svg), { dy: 24 });
  g += win(t, M.C6_llaves, M.C6_retorno, b);
  // el gran reto: familias que no logran instalarse y vuelven al lugar de riesgo
  const tr = M.C6_retorno;
  let r = landscape(t * 8, .1);
  r += `<ellipse cx="1500" cy="650" rx="330" ry="150" fill="rgba(214,69,65,.12)" stroke="${C.critd}" stroke-width="5" stroke-dasharray="16 12"/>`;
  r += rect(150, 380, 460, 455, { fill: '#C9CED2', stroke: C.ink, sw: 3 });
  for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 3; cc++) r += rect(190 + cc * 140, 410 + rr * 105, 90, 72, { fill: '#52687A', stroke: C.ink, sw: 2 });
  r += rect(330, 735, 100, 100, { fill: '#52687A', stroke: C.ink, sw: 2 }) + tag(380 - 120, 326, 'Nueva vivienda', { size: 24, center: true, w: 240 });
  r += G(t, tr + 1.0, tag(1500 - 210, 470, 'Lugar de origen · zona de riesgo', { size: 24, fill: '#FBE3E1', stroke: C.critd, color: C.critd, center: true, w: 420 }), { dy: 8 });
  const wk = eio(prog(t, tr + 1.4, tr + 6.2)), wx = lerp(560, 1120, wk);
  r += G(t, tr + 1.2, `${path('M470 800 Q900 690 1330 720', { stroke: C.critd, sw: 5, dash: '14 10' })}${arrow(1300, 716, 1340, 722, { stroke: C.critd, sw: 5, head: 22 })}`, {});
  r += person(wx, 830, .9, { skin: C.skin3, cloth: '#5A7A6B', hair: '#222', arm2: 20 }) + person(wx + 70, 830, .9, { skin: C.skin1, cloth: '#7A5A3A', hair: '#3a2a1a', longhair: true }) + person(wx - 70, 830, .56, { skin: C.skin3, cloth: '#C0603A' });
  r += rect(260, 150, 1400, 116, { r: 18, fill: 'rgba(19,32,43,.94)' }) + text(960, 194, 'Un gran reto, según los actores del proceso', { size: 26, weight: 600, fill: '#cfe3ea', anchor: 'middle' }) + text(960, 246, 'Familias que no logran instalarse y vuelven al riesgo', { size: 40, weight: 800, fill: '#fff', anchor: 'middle' });
  r += G(t, tr + 5.0, tag(960 - 450, 290, 'En la etapa 5, el acompañamiento alerta si hay intención de regresar', { size: 24, center: true, w: 900 }), { dy: 8 });
  g += win(t, M.C6_retorno, M.C6_medicion, r);
  // medir el impacto y el valor del reasentamiento, con un socio académico
  const tm = M.C6_medicion;
  let z = roomBg() + text(960, 205, 'Medir el impacto y el valor del reasentamiento', { size: 44, weight: 800, anchor: 'middle' });
  z += rect(250, 262, 830, 470, { r: 22, fill: '#fff', stroke: C.ink, sw: 4 }) + text(290, 318, 'Seguimiento en el tiempo', { size: 28, weight: 800 });
  // momentos de medición (sin curvas de resultado: el documento pide no atribuir causalidad con un simple antes y después)
  z += line(400, 420, lerp(400, 960, eio(prog(t, tm + .3, tm + 1.6))), 420, { stroke: C.slate, sw: 8 });
  [['Antes', 420], ['Durante', 680], ['Después', 940]].forEach(([n, x], k) => {
    z += G(t, tm + .4 + k * .45, `${circ(x, 420, 36, { fill: '#fff', stroke: C.ink, sw: 3 })}${icon('lupa', x, 420, 40, C.ink)}${text(x, 494, n, { size: 26, weight: 800, anchor: 'middle' })}`, { dy: 8 });
    z += G(t, tm + 2.0 + k * .15, rect(x - 35, 540, 70, 44, { r: 10, fill: '#DDF3E6', stroke: C.okd, sw: 3 }), { dy: 6 });
    z += G(t, tm + 2.7 + k * .15, rect(x - 35, 610, 70, 44, { r: 10, fill: '#DDEBFA', stroke: C.roofb, sw: 3 }), { dy: 6 });
  });
  z += G(t, tm + 2.0, text(270, 571, 'Impacto', { size: 22, weight: 800, fill: C.okd }), {}) + G(t, tm + 2.7, text(270, 641, 'Valor', { size: 22, weight: 800, fill: C.roofb }), {});
  z += G(t, tm + 3.2, text(665, 706, 'Con método: un antes y un después no basta para probar causas', { size: 21, weight: 600, fill: C.noned, anchor: 'middle' }), {});
  z += G(t, tm + 2.0, `${rect(1130, 270, 560, 92, { r: 16, fill: '#DDF3E6', stroke: C.okd, sw: 3 })}${rect(1160, 300, 50, 32, { r: 8, fill: '#DDF3E6', stroke: C.okd, sw: 3 })}${text(1240, 326, 'Impacto en las familias', { size: 28, weight: 800, fill: C.okd })}`, { dx: 30, dy: 0 });
  z += G(t, tm + 2.7, `${rect(1130, 380, 560, 92, { r: 16, fill: '#DDEBFA', stroke: C.roofb, sw: 3 })}${rect(1160, 410, 50, 32, { r: 8, fill: '#DDEBFA', stroke: C.roofb, sw: 3 })}${text(1240, 436, 'Valor del proceso', { size: 28, weight: 800, fill: C.roofb })}`, { dx: 30, dy: 0 });
  z += G(t, tm + 4.4, `${rect(1130, 490, 560, 92, { r: 16, fill: '#FFF1B8', stroke: C.warnd, sw: 3 })}${text(1410, 548, 'Hoy no se mide de forma sistemática', { size: 25, weight: 800, fill: C.warnd, anchor: 'middle' })}`, { dx: 30, dy: 0 });
  z += G(t, tm + 6.4, `${rect(1130, 600, 560, 132, { r: 16, fill: C.ivory, stroke: C.ink, sw: 3 })}${circ(1200, 666, 40, { fill: '#fff', stroke: C.ink, sw: 3 })}${icon('birrete', 1200, 666, 50, C.roofb)}${text(1262, 656, 'Con un socio académico', { size: 28, weight: 800 })}${text(1262, 694, 'aliado que la propuesta busca sumar', { size: 22, weight: 600, fill: C.noned })}`, { dx: 30, dy: 0 });
  g += win(t, M.C6_medicion, undefined, z);
  g += rect(0, 0, W, H, { fill: C.navy, op: F(prog(t, B.C6.end - .45, B.C6.end - .05)) });
  return g;
}
function sceneE9(t) {
  let g = navyBg();
  // meta de acompañamiento
  let b = navyBg() + G(t, B.E9.start, text(960, 200, 'Meta: acompañar 200 hogares durante 12 meses', { size: 54, weight: 800, fill: '#fff', anchor: 'middle' }), { dy: 10 });
  const n = Math.floor(200 * eo(prog(t, M.E9_piloto + .6, M.E9_piloto + 3.2)));
  for (let i = 0; i < n; i++) b += circ(618 + (i % 20) * 36, 282 + Math.floor(i / 20) * 35, 12, { fill: C.slate });
  b += G(t, M.E9_piloto + 2.4, text(960, 665, 'Incluye hogares que siguen en el sector, en ruta de reasentamiento y ya reasentados · distribución por conocer', { size: 24, weight: 600, fill: '#cfe3ea', anchor: 'middle' }), { dy: 8 });
  b += G(t, M.E9_notraslados, text(960, 760, 'Meta de acompañamiento, no de traslados', { size: 48, weight: 800, fill: C.teal, anchor: 'middle' }), { dy: 10 });
  g += win(t, B.E9.start, M.E9_frase, b, .01, .4);
  // frase central
  let a = navyBg() + line(260, 330, 1660, 330, { stroke: C.teal, sw: 8 });
  ETAPAS.forEach((_, i) => { a += circ(260 + i * 280, 330, 20, { fill: C.teal, stroke: '#fff', sw: 3 }); });
  a += icon('casa', 150, 330, 70, '#cfe3ea') + icon('casa', 1770, 330, 70, C.teal) + text(150, 400, 'antes', { size: 24, weight: 700, fill: '#cfe3ea', anchor: 'middle' }) + text(1770, 400, 'después', { size: 24, weight: 700, fill: C.teal, anchor: 'middle' });
  a += G(t, M.E9_frase + .2, text(960, 520, 'Lo que una familia necesita antes de trasladarse', { size: 52, weight: 800, fill: '#fff', anchor: 'middle' }), { dy: 14 });
  a += G(t, M.E9_frase + 2.9, text(960, 600, 'se convierte en compromisos', { size: 52, weight: 800, fill: C.teal, anchor: 'middle' }), { dy: 14 });
  a += G(t, M.E9_frase + 5.0, text(960, 680, 'que alguien acompaña y comprueba después.', { size: 52, weight: 800, fill: '#fff', anchor: 'middle' }), { dy: 14 });
  g += win(t, M.E9_frase, M.E9_final, a);
  // cierre humano: la familia sigue adelante, acompañada
  let c = landscape(t * 14, 0) + rect(0, 0, W, H, { fill: '#F2B233', op: .10 });
  c += path('M-40 800 Q480 760 960 790 T1960 770', { stroke: C.teal, sw: 12 });
  c += rect(1530, 400, 360, 435, { fill: '#C9CED2', stroke: C.ink, sw: 3 });
  for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 3; cc++) c += rect(1560 + cc * 112, 430 + rr * 100, 76, 66, { fill: rr === 1 && cc === 0 ? '#FFE9A8' : '#52687A', stroke: C.ink, sw: 2 });
  c += rect(1660, 745, 90, 90, { fill: '#52687A', stroke: C.ink, sw: 2 }) + tag(1710 - 120, 346, 'Nueva vivienda', { size: 24, center: true, w: 240 });
  const k = prog(t, M.E9_final - .3, B.E9.end); const wx = lerp(560, 960, k);
  c += person(wx - 300, 830, 1.0, P.vecina) + person(wx, 830, 1.0, { ...P.madre, arm2: 18 }) + person(wx - 90, 830, .6, P.hijo) + person(wx + 110, 830, 1.0, { ...P.gestora, arm1: -12 }) + person(wx - 160, 830, .55, P.hija);
  [['olla', 'su trabajo', 560], ['manos', 'sus vecinos', 960], ['persona', 'quien le cuida a los niños', 1360]].forEach(([ic, s, x], i) => { c += G(t, M.E9_final + 2.2 + i * .5, `${circ(x, 440, 34, { fill: C.ivory, stroke: C.ink, sw: 3 })}${icon(ic, x, 440, 40, C.roofb)}${stIcon('atendida', x + 30, 412, 13)}${tag(x - 130, 484, s, { size: 24, center: true, w: 260 })}`, { dy: 10 }); });
  c += G(t, M.E9_final + 9.1, `${rect(470, 170, 980, 170, { r: 22, fill: 'rgba(19,32,43,.9)' })}${text(960, 240, 'Más que un traslado,', { size: 60, weight: 800, fill: '#fff', anchor: 'middle' })}${text(960, 312, 'un nuevo comienzo.', { size: 60, weight: 800, fill: C.teal, anchor: 'middle' })}`, { dy: 12 });
  g += win(t, M.E9_final - .3, undefined, c, .6);
  return g;
}
function sceneCR(t) {
  const lt = t - TL.cr_start; const a = eo(prog(lt, .5, 1.0));
  const L = [['MI RUTA DE REUBICACIÓN', 54, 800, C.teal], ['Equipo del proyecto · DGIP 2026', 34, 700, '#fff'], ['Imágenes: Esri y socios · Google Street View (abr. 2025), © Google', 26, 600, '#cfe3ea'], ['Narración: voz sintética de HeyGen · Música: producción propia', 26, 600, '#cfe3ea'], ['Validado con la comunidad y las entidades', 34, 800, C.teal]];
  let s = ''; L.forEach((l, i) => { s += text(960, 330 + i * 95, l[0], { size: l[1], weight: l[2], fill: l[3], anchor: 'middle' }); });
  let g = navyBg();
  if (lt < .7) g += `<g opacity="${F(1 - eo(prog(lt, 0, .7)))}">${sceneE9(TL.cr_start - .001)}</g>`;
  return g + `<g opacity="${F(a)}">${s}</g>` + rect(0, 0, W, H, { fill: '#000', op: F(prog(lt, 4.6, 5.5)) });
}
function frameSVG(t) {
  let blk = null; for (const b of Object.keys(B)) if (t >= B[b].start && t < B[b].end) blk = b;
  if (t >= TL.cr_start) blk = 'CR';
  const idx = { C1: 0, C2: 1, C3: 2, C4: 3, C5: 4, C6: 5 }; let g = '';
  const S = { E0: sceneE0, E1: sceneE1, E2: sceneE2, C1: sceneC1, C2: sceneC2, C3: sceneC3, C4: sceneC4, C5: sceneC5, C6: sceneC6, E9: sceneE9, CR: sceneCR };
  if (blk) g += S[blk](t);
  if (['E0', 'E2', 'C1', 'C2', 'C3', 'C4', 'C5'].includes(blk)) g += rect(0, 0, W, H, { fill: C.navy, op: F(prog(t, B[blk].end - .4, B[blk].end - .02)) });
  if (blk in idx) g += rect(0, 0, W, H, { fill: C.navy, op: F(1 - prog(t, B[blk].start, B[blk].start + .4)) });
  if (blk in idx) g += minimap(idx[blk], t) + chapterCard(t, idx[blk] + 1, blk);
  const fin = blk === 'CR' ? 1 - prog(t - TL.cr_start, 4.6, 5.5) : 1;
  g += `<g opacity="${F(fin)}">${topLabels(t)}</g>` + (blk === 'CR' ? '' : subtitles(t));
  return g;
}
const NBG = 240;
// Street View: zoom ×1.35 para dejar fuera de cuadro la interfaz del navegador (barra, controles, minimapa, pie);
// fundido de 0,3 s desde la vista satelital; difuminado suave (máscara radial) sobre las personas.
const SV_ZOOM = 'scale(1.35)', SV_XF = .3;
window.setFrame = async function (n) {
  const t = n / TL.fps; window.__t = t;
  const bg = document.getElementById('bg'), bg2 = document.getElementById('bg2'), bgx = document.getElementById('bgx');
  if (t < XF1 + .1) {
    const src = 'bg3/' + String(Math.min(n + 1, NBG)).padStart(5, '0') + '.jpg';
    const sv = t >= SV_START, xf = !sv && t >= SV_START - SV_XF;
    const svFirst = 'bg3/' + String(Math.round(SV_START * TL.fps) + 1).padStart(5, '0') + '.jpg';
    if (bg.getAttribute('src') !== src) bg.src = src;
    const s2 = xf ? svFirst : src; if (bg2.getAttribute('src') !== s2) bg2.src = s2;
    bg.style.display = 'block'; bg.style.transform = sv ? SV_ZOOM : 'none';
    bg2.style.display = (sv || xf) ? 'block' : 'none'; bg2.style.transform = SV_ZOOM;
    const a = xf ? (t - (SV_START - SV_XF)) / SV_XF : 1; bg2.style.opacity = a;
    if (xf) { if (bgx.getAttribute('src') !== svFirst) bgx.src = svFirst; bgx.style.display = 'block'; bgx.style.transform = SV_ZOOM; bgx.style.opacity = a; } else bgx.style.display = 'none';
    await Promise.all([bg, bg2, bgx].map(i => i.decode().catch(() => {})));
  } else { bg.style.display = 'none'; bg2.style.display = 'none'; bgx.style.display = 'none'; }
  const svg = document.getElementById('svg'); svg.innerHTML = frameSVG(t); fitTags(svg);
  return true;
};
