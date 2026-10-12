// ===== E0 (gancho), E1 (problema y propuesta), E2 (tres piezas y ruta) =====
const XF0 = 12.0, XF1 = 12.6;   // fundido de la imagen real a la ilustración
function sceneE0(t) {
  let g = '';
  if (t < XF1 + .1) {
    const lab = t < M.E0_cbolivar - .15 ? ['BOGOTÁ · COLOMBIA', 'LOCALIZACIÓN TERRITORIAL'] : t < M.E0_bellaflor - .15 ? ['CIUDAD BOLÍVAR', 'LOCALIZACIÓN TERRITORIAL'] : t < M.E0_calle ? ['BELLA FLOR', 'Ámbito del piloto: parte alta · delimitación por validar'] : null;
    if (lab) { const wide = lab[1].length > 30; g += rect(30, 24, wide ? 780 : 660, 140, { r: 12, fill: C.navy }) + rect(30, 24, 10, 140, { fill: C.teal }) + text(64, 88, lab[0], { size: 54, weight: 800, fill: '#fff' }) + text(64, 134, lab[1], { size: wide ? 28 : 26, weight: 500, fill: '#9FB4C2' }); }
    if (t >= M.E0_calle) g += rect(192, 78, 356, 176, { fill: C.navy, r: 10 }) + text(370, 150, 'Google Street View', { size: 30, weight: 700, fill: '#fff', anchor: 'middle' }) + text(370, 192, 'Imagen de calle · abr. 2025', { size: 24, weight: 500, fill: '#9FB4C2', anchor: 'middle' });
  }
  const a = eio(prog(t, XF0, XF1));
  if (a > 0) {
    let il = landscape(t * 8, 0) + familyScene(t);
    // la pregunta del gancho
    il += win(t, M.E0_pregunta + .3, M.E0_demas, `${rect(560, 160, 800, 96, { r: 18, fill: C.ivory, stroke: C.ink, sw: 3 })}${text(960, 224, '¿A qué casa va a llegar?', { size: 52, weight: 800, anchor: 'middle' })}`);
    il += win(t, M.E0_demas, undefined, `${rect(520, 160, 880, 96, { r: 18, fill: C.teal, stroke: C.ink, sw: 3 })}${text(960, 224, '¿Y todo lo demás?', { size: 56, weight: 800, anchor: 'middle' })}`);
    const items = [['olla', 'su trabajo', 520, 340], ['manos', 'sus vecinos', 1440, 340], ['persona', 'el cuidado de los niños', 300, 470], ['trabajo', 'el colegio y los servicios', 1560, 470]];
    items.forEach(([ic, s, x, y], i) => { il += G(t, M.E0_demas + .4 + i * .35, `${circ(x, y, 34, { fill: C.ivory, stroke: C.ink, sw: 3 })}${icon(ic, x, y, 40, C.roofb)}${tag(x - 100, y + 44, s, { size: 24, w: 200, center: true })}`, { dy: 10 }); });
    g += `<g opacity="${F(a)}">${il}</g>`;
  }
  return g;
}
function sceneE1(t) {
  let g = navyBg();
  const tA = M.E1_titulo;
  // --- el problema: lo que puede perderse en el camino
  let p = navyBg() + text(960, 210, 'Lo que puede perderse en el camino', { size: 50, weight: 800, fill: '#fff', anchor: 'middle' });
  const xs = [380, 960, 1540];
  xs.forEach((x, i) => { p += rect(x - 210, 330, 420, 280, { r: 22, fill: '#1E3140', stroke: '#4a6273', sw: 3 }) + icon('persona', x - 60, 420, 56, '#cfe3ea') + icon('persona', x + 60, 420, 56, '#cfe3ea') + text(x, 520, ['Equipo de hoy', 'Otro equipo', 'Un tercer equipo'][i], { size: 30, weight: 700, fill: '#fff', anchor: 'middle' }); });
  // la ficha viaja y pierde hojas
  const k = eio(prog(t, M.E1_equipos - .4, M.E1_preguntas + .6)); const fx = lerp(380, 1540, k);
  p += rect(fx - 70, 560, 140, 90, { r: 10, fill: C.ivory, stroke: C.ink, sw: 3 }) + text(fx, 615, 'Ficha', { size: 26, weight: 800, anchor: 'middle' });
  for (let i = 0; i < 5; i++) { const t0 = M.E1_equipos + i * .45; const q = prog(t, t0, t0 + 1.6); if (q > 0 && q < 1) { const px = lerp(380, 1540, eio(prog(t0, M.E1_equipos - .4, M.E1_preguntas + .6))) + i * 14; p += `<g opacity="${F(1 - q)}" transform="translate(${F(px)},${F(640 + q * 160)}) rotate(${F(q * 140 - 30)})">${rect(-24, -16, 48, 32, { fill: '#fff', stroke: C.ink, sw: 2 })}</g>`; } }
  p += win(t, M.E1_preguntas, tA, xs.map((x, i) => bubble(x - 205, 244, 410, 66, '¿Cuántos viven en la casa?', 0, { tx: x - 40, size: 25 })).join(''), .3, .3);
  p += win(t, M.E1_compromisos, tA, `${rect(560, 680, 800, 120, { r: 16, fill: C.ivory, stroke: C.ink, sw: 3 })}${text(600, 728, 'Compromiso acordado', { size: 30, weight: 800 })}${text(600, 772, '¿Quién verifica que se cumplió?', { size: 28, weight: 600, fill: C.critd })}${text(1300, 760, '?', { size: 70, weight: 800, fill: C.critd, anchor: 'middle' })}`);
  g += win(t, B.E1.start, tA, p, .4, .35);
  // --- la propuesta
  if (t >= tA - .05) {
    let q = landscape(t * 8, 0) + rect(0, 0, W, H, { fill: C.navy, op: .62 });
    const tw = eio(prog(t, tA, tA + 2.2));
    q += `<clipPath id="ct"><rect x="0" y="0" width="${F(W * tw)}" height="${H}"/></clipPath>`;
    q += `<g clip-path="url(#ct)">${text(960, 300, 'MI RUTA DE REUBICACIÓN', { size: 108, weight: 800, fill: '#fff', anchor: 'middle', ls: 3 })}</g>`;
    q += line(0, 350, 1920 * Math.min(1, tw * 1.05), 350, { stroke: C.teal, sw: 10 });
    const doors = [['Vivienda', 'casa'], ['Gestión del riesgo', 'escudo'], ['Oferta social', 'manos']];
    doors.forEach(([n, ic], i) => { const x = 560 + i * 400; q += G(t, M.E1_complementa + i * .4, `${line(960, 350, x, 450, { stroke: C.teal, sw: 4, dash: '10 8' })}${rect(x - 135, 450, 270, 180, { r: 18, fill: C.ivory, stroke: C.ink, sw: 3 })}${icon('puerta', x, 512, 66, C.ink)}${icon(ic, x + 70, 486, 34, C.roofb)}${text(x, 600, n, { size: 26, weight: 700, anchor: 'middle' })}`, { dy: 24, out: M.E1_idea }); });
    q += G(t, M.E1_complementa + 1.4, text(960, 690, 'Complementa a las entidades; no las reemplaza', { size: 34, weight: 700, fill: '#cfe3ea', anchor: 'middle' }), { out: M.E1_idea });
    q += G(t, M.E1_validar, tag(560, 730, 'Piloto propuesto · por validar con la comunidad y las entidades', { size: 28, fill: C.teal, center: true, w: 800 }), { out: M.E1_idea });
    q += G(t, M.E1_idea + .1, `${text(1060, 560, 'Más que un traslado,', { size: 74, weight: 800, fill: '#fff', anchor: 'middle' })}${text(1060, 650, 'un nuevo comienzo.', { size: 74, weight: 800, fill: C.teal, anchor: 'middle' })}`, { dy: 20 });
    const open = eo(prog(t, M.E1_idea, M.E1_idea + 1.8));
    q += G(t, M.E1_idea - .1, `<g>${rect(180, 450, 200, 300, { fill: '#FFE9A8', r: 6 })}<g transform="translate(180,450) scale(${F(1 - .75 * open)},1)">${rect(0, 0, 200, 300, { fill: C.brickd, r: 6 })}${circ(170, 160, 8, { fill: '#e8c27a' })}</g></g>`, { dur: .3 });
    q += G(t, tA + .4, tag(40, 770, 'Narración con voz sintética', { size: 24, fill: 'rgba(244,239,230,.95)' }), { out: tA + 4.4 });
    g += `<g opacity="${F(eo(prog(t, tA - .05, tA + .35)))}">${q}</g>`;
  }
  return g;
}
function sceneE2(t) {
  let g = t < M.E2_ruta ? roomBg() : navyBg();
  const tR = M.E2_ruta;
  // --- tres piezas
  let p = roomBg() + text(960, 205, '¿Cómo funciona? Tres piezas que trabajan juntas', { size: 46, weight: 800, anchor: 'middle' });
  const cx = [390, 960, 1530], cw = 520, cy = 250, chh = 560;
  const card = (i, title, title2) => rect(cx[i] - cw / 2, cy, cw, chh, { r: 24, fill: C.ivory, stroke: C.ink, sw: 4 }) + rect(cx[i] - cw / 2, cy, cw, 70, { r: 24, fill: C.navy }) + rect(cx[i] - cw / 2, cy + 46, cw, 24, { fill: C.navy }) + text(cx[i], cy + 47, title, { size: title.length > 30 ? 23 : 30, weight: 800, fill: C.teal, anchor: 'middle' }) + (title2 ? text(cx[i], cy + 112, title2, { size: 28, weight: 800, anchor: 'middle' }) : '');
  p += G(t, M.E2_gestora, card(0, '1 · Gestora social', '') + person(cx[0], 640, .95, { ...P.gestora, arm2: 40 }) + person(cx[0] + 150, 640, .7, P.gestor) + tag(cx[0] + 150 - 70, 652, 'respaldo', { size: 20, center: true, w: 140 }) +
    text(cx[0], 730, 'Con nombre propio', { size: 28, weight: 700, anchor: 'middle' }) + text(cx[0], 772, 'acompaña a cada hogar', { size: 26, weight: 500, anchor: 'middle' }), { dy: 24 });
  const k = eio(prog(t, M.E2_ficha + 1.0, M.E2_ficha + 3.0)); const fx = lerp(cx[1] - 140, cx[1] + 140, k);
  p += G(t, M.E2_ficha, card(1, '2 · Ficha de caracterización familiar', '') + circ(cx[1] - 170, 440, 40, { fill: C.roofb, stroke: C.ink, sw: 3 }) + text(cx[1] - 170, 512, 'Equipo 1', { size: 22, weight: 700, anchor: 'middle' }) + circ(cx[1] + 170, 440, 40, { fill: '#7A4FA8', stroke: C.ink, sw: 3 }) + text(cx[1] + 170, 512, 'Equipo 2', { size: 22, weight: 700, anchor: 'middle' }) +
    rect(fx - 56, 400, 112, 80, { r: 8, fill: '#fff', stroke: C.ink, sw: 3 }) + line(fx - 36, 425, fx + 36, 425, { stroke: C.slate, sw: 5 }) + line(fx - 36, 445, fx + 26, 445, { stroke: C.slate, sw: 5 }) + line(fx - 36, 465, fx + 16, 465, { stroke: C.slate, sw: 5 }) +
    text(cx[1], 600, 'Se actualiza en cada paso', { size: 26, weight: 700, anchor: 'middle' }) + text(cx[1], 640, 'y pasa de un equipo a otro', { size: 26, weight: 500, anchor: 'middle' }), { dy: 24 });
  p += G(t, M.E2_historia, tag(cx[1] - 220, 690, 'La familia no repite su historia ✓', { size: 24, fill: '#DDF3E6', stroke: C.okd, color: C.okd, center: true, w: 440 }), { dy: 8 });
  p += G(t, M.E2_compromisos, card(2, '3 · Compromisos', '') + [['persona', 'Responsable'], ['calendario', 'Fecha'], ['check', 'Prueba de cumplimiento']].map(([ic, s], i) => `${circ(cx[2] - 180, 400 + i * 110, 34, { fill: '#fff', stroke: C.ink, sw: 3 })}${icon(ic, cx[2] - 180, 400 + i * 110, 38, C.roofb)}${text(cx[2] - 126, 410 + i * 110, s, { size: 28, weight: 700 })}`).join(''), { dy: 24 });
  g += win(t, B.E2.start, tR, p, .4, .35);
  // --- la ruta: seis etapas y dos componentes transversales
  if (t >= tR - .35) {
    let m = navyBg() + `<g transform="translate(0,-110)">`;
    const xs = ETAPAS.map((_, i) => 160 + i * 320); const draw = prog(t, tR, tR + 1.6);
    m += line(160, 520, lerp(160, 1760, draw), 520, { stroke: C.teal, sw: 10 });
    ETAPAS.forEach((n, i) => { const lw = n.split(' '), h = Math.ceil(lw.length / 2);
      m += G(t, tR + i * .27, `${circ(xs[i], 520, 30, { fill: C.teal, stroke: '#fff', sw: 4 })}${text(xs[i], 531, String(i + 1), { size: 32, weight: 800, fill: C.ink, anchor: 'middle' })}${text(xs[i], 585, lw.slice(0, h).join(' '), { size: 28, weight: 700, fill: '#fff', anchor: 'middle' })}${text(xs[i], 618, lw.slice(h).join(' '), { size: 28, weight: 700, fill: '#fff', anchor: 'middle' })}`, { dy: 10, dur: .35 }); });
    m += G(t, M.E2_resil - .1, text(160, 680, 'RESILIENCIA · cinco dimensiones', { size: 30, weight: 800, fill: C.teal, ls: 1 }), { dy: 6 });
    m += DIMS.map((d, i) => G(t, M.E2_resil + i * .2, `${icon(d[1], 190, 715 + i * 38, 28, C.slate)}${text(225, 724 + i * 38, d[0], { size: 23, weight: 600, fill: '#cfe3ea' })}${line(600, 715 + i * 38, lerp(600, 1760, eio(prog(t, M.E2_resil + i * .2, M.E2_resil + 1.3 + i * .2))), 715 + i * 38, { stroke: C.slate, sw: 5 })}`, { dy: 6 })).join('');
    m += G(t, M.E2_mesas, `${line(160, 395, 1760, 395, { stroke: C.slate, sw: 5, dash: '14 10' })}${circ(300, 395, 36, { fill: C.ivory, stroke: C.ink, sw: 3 })}${icon('mesa', 300, 395, 50, C.ink)}${circ(420, 395, 26, { fill: C.roofb, stroke: '#fff', sw: 3 })}${circ(420, 388, 10, { fill: C.ivory })}${text(160, 340, 'MESAS DE TRABAJO CON ACOMPAÑAMIENTO DE UNA MENTORA', { size: 30, weight: 800, fill: C.teal, ls: 1 })}`, { dy: -10 });
    g += `<g opacity="${F(eo(prog(t, tR - .05, tR + .35)))}">${m}</g></g>`;
  }
  return g;
}
