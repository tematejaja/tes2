// ===== C1 diagnóstico, C2 plan, C3 articulación =====
function sceneC1(t) {
  let g = t < M.C1_urgencia ? landscape(t * 8, 0) : navyBg();
  // A · la familia
  let a = landscape(t * 8, 0) + familyScene(t);
  a += G(t, M.C1_familia + .3, tag(520, 580, 'Familia ficticia', { size: 24, center: true, w: 240 }), {});
  a += G(t, M.C1_vecina, `${rect(225, 590, 270, 250, { r: 16, fill: 'none', stroke: C.teal, sw: 5, dash: '12 8' })}${tag(230, 540, 'Vecina: red de cuidado', { size: 24, fill: C.teal, w: 260 })}`, {});
  g += win(t, B.C1.start, M.C1_escucha, a, .01, .35);
  // B · escucha (visita y mesa comunitaria)
  let b = landscape(t * 8, 0) + houseBig(780, 835, 420, 330) + person(640, 830, 1.0, { ...P.madre, arm2: 30 }) + person(300, 830, 1.0, P.vecina) + person(400, 830, .62, P.hijo) + person(450, 830, .55, P.hija);
  const gx = lerp(1500, 930, eo(prog(t, M.C1_escucha - .2, M.C1_escucha + 1.4)));
  b += person(gx, 830, 1.0, { ...P.gestora, flip: true, arm2: 40 }) + G(t, M.C1_escucha + 1.0, tag(830, 590, 'Gestora social', { size: 22, center: true, w: 200 }), {});
  b += G(t, M.C1_escucha + 5.3, bubble(440, 300, 400, 84, 'Conservar a mis clientes', { tx: 610, size: 26 }), {});
  b += G(t, M.C1_escucha + 6.5, bubble(60, 430, 600, 84, 'Poder seguir trabajando desde casa', { tx: 580, size: 26 }), {});
  const ix = 1240, iy = 150;
  let ins = rect(ix, iy + 40, 620, 330, { r: 18, fill: C.ivory, stroke: C.ink, sw: 3 }) + `<ellipse cx="${ix + 310}" cy="${iy + 250}" rx="250" ry="38" fill="#8a6a4a" stroke="${C.ink}" stroke-width="3"/>`;
  [['#B5483B', C.skin2], ['#6A5A8C', C.skin3], ['#2F6DB5', C.skin1], ['#2E9E6A', C.skin2], ['#D07A2D', C.skin3]].forEach((c, i) => { ins += miniPerson(ix + 90 + i * 110, iy + 250, c[0], c[1], i === 2); });
  ins += tag(ix + 20, iy - 16, 'Mesa comunitaria · propuestas de vivienda', { size: 26, fill: C.teal });
  ins += G(t, M.C1_mesa + 2.6, bubble(ix + 60, iy + 56, 500, 54, 'Viviendas con espacio para trabajar', { tx: ix + 330, size: 24 }), {});
  b += G(t, M.C1_mesa - .1, ins, { dx: 60, dy: 0 });
  g += win(t, M.C1_escucha, M.C1_ficha, b);
  // C · ficha de caracterización
  const st = ['gestion', 'gestion', 'gestion', 'sin', 'atendida'];
  const rows = st.map((s, i) => t >= M.C1_dimensiones + .8 + i * .55 ? s : null);
  const f = ficha(0, 0, { rows, prior: true });
  let fg = f.svg;
  if (t >= M.C1_corrige + .2) fg += `<g transform="rotate(-3 380 ${f.h + 46})">${rect(200, f.h + 14, 380, 62, { r: 10, fill: '#fff', stroke: C.okd, sw: 5 })}${text(390, f.h + 56, 'REVISADA POR EL HOGAR ✓', { size: 27, weight: 800, fill: C.okd, anchor: 'middle' })}</g>`;
  let c = landscape(t * 8, .35) + scaled(1080, 140, .86, fg);
  c += G(t, M.C1_dimensiones, tag(90, 170, 'Resiliencia: cinco dimensiones', { size: 30, fill: C.teal }), { out: M.C1_nogarantiza });
  c += person(420, 830, 1.0, { ...P.madre, arm2: t > M.C1_corrige && t < M.C1_corrige + 1.8 ? 80 : 20 }) + person(720, 830, 1.0, { ...P.gestora, flip: true, arm2: 20 });
  c += G(t, M.C1_nogarantiza + 2.5, `${icon('casa', 120, 395, 40, C.crit)}${tag(160, 365, 'No garantiza vivienda', { size: 32 })}`, { dx: -40, dy: 0 });
  c += G(t, M.C1_nogarantiza + 4.1, `${icon('cruzx', 120, 487, 34, C.crit)}${tag(160, 457, 'No obliga a aceptar', { size: 32 })}`, { dx: -40, dy: 0 });
  g += win(t, M.C1_ficha, M.C1_urgencia, c);
  // D · protección urgente
  let d = navyBg() + stationsRow(470, 0);
  d += rect(110, 395, 440, 56, { r: 10, fill: C.ivory, stroke: C.ink, sw: 2 }) + text(330, 432, 'Ficha de caracterización familiar', { size: 22, weight: 800, anchor: 'middle' });
  d += line(160, 720, 1760, 720, { stroke: '#fff', sw: 6, dash: '18 12' }) + tag(250, 650, 'Canal de emergencia · autoridad competente', { size: 28 });
  const pp = eio(prog(t, M.C1_urgencia + .3, M.C1_urgencia + 1.5));
  d += line(160, 470, 160, lerp(470, 720, pp), { stroke: '#fff', sw: 8 }) + circ(160, lerp(470, 720, pp), 16, { fill: '#fff' });
  d += circ(160, 720, 40, { fill: C.ivory, stroke: '#fff', sw: 4 }) + icon('escudo', 160, 720, 54, C.okd);
  d += G(t, M.C1_urgencia + 1.6, `${line(330, 451, 330, 650, { stroke: C.teal, sw: 3, dash: '6 8' })}${text(360, 575, 'Se coordinan, con registros separados', { size: 26, weight: 600, fill: '#cfe3ea' })}`, {});
  d += text(960, 270, 'Riesgo inmediato para la vida', { size: 54, weight: 800, fill: '#fff', anchor: 'middle' });
  d += G(t, M.C1_urgencia + 1.0, text(960, 340, 'Canal de emergencia, sin esperar ninguna etapa', { size: 38, weight: 700, fill: C.teal, anchor: 'middle' }), {});
  g += win(t, M.C1_urgencia, undefined, d);
  return g;
}
function sceneC2(t) {
  let g = roomBg();
  let a = roomBg() + person(150, 830, 1.0, P.madre) + person(1780, 830, 1.0, { ...P.gestora, flip: true }) + tableTop(300, 720, 1320);
  a += G(t, M.C2_plan, text(960, 205, 'Plan de reubicación: las opciones reales', { size: 44, weight: 800, anchor: 'middle' }), {});
  a += G(t, M.C2_opciones + .2, `${rect(330, 260, 600, 440, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${text(630, 322, 'Cada opción se compara por', { size: 34, weight: 800, anchor: 'middle' })}` +
    [['moneda', 'Costo'], ['trabajo', 'Cercanía al trabajo'], ['puerta', 'Cercanía al colegio'], ['manos', 'Red de cuidado']].map((o, i) => `${rect(360 + (i % 2) * 280, 360 + Math.floor(i / 2) * 150, 260, 130, { r: 14, fill: '#fff', stroke: C.slate, sw: 2 })}${icon(o[0], 490 + (i % 2) * 280, 405 + Math.floor(i / 2) * 150, 50, C.roofb)}${text(490 + (i % 2) * 280, 465 + Math.floor(i / 2) * 150, o[1], { size: 23, weight: 700, anchor: 'middle' })}`).join(''), { dy: 30 });
  // la comunidad participa en la oferta de vivienda: sus propuestas se evalúan con la entidad competente
  const pt = M.C2_participa;
  a += G(t, pt + .1, tag(1000, 250, 'La comunidad participa en la oferta de vivienda', { size: 26, fill: C.teal }), { dy: 10 });
  a += G(t, pt + 1.2, `${circ(1070, 440, 46, { fill: C.ivory, stroke: C.ink, sw: 3 })}${icon('mesa', 1070, 440, 56, C.ink)}${text(1070, 520, 'Mesa', { size: 22, weight: 800, anchor: 'middle' })}${text(1070, 548, 'comunitaria', { size: 22, weight: 800, anchor: 'middle' })}`, { dy: 10 });
  a += G(t, pt + 2.8, `${arrow(1124, 440, 1172, 400, {})}${rect(1180, 330, 520, 100, { r: 16, fill: '#fff', stroke: C.ink, sw: 3 })}${text(1440, 372, 'Viviendas con espacio para trabajar', { size: 24, weight: 800, anchor: 'middle' })}${text(1440, 406, 'propuesta de la comunidad', { size: 21, weight: 600, fill: C.noned, anchor: 'middle' })}`, { dy: 10 });
  a += G(t, pt + 3.4, `${arrow(1124, 452, 1172, 490, {})}${rect(1180, 450, 520, 100, { r: 16, fill: '#fff', stroke: C.ink, sw: 3 })}${text(1440, 492, 'Autoconstrucción', { size: 24, weight: 800, anchor: 'middle' })}${text(1440, 526, 'propuesta de la comunidad', { size: 21, weight: 600, fill: C.noned, anchor: 'middle' })}`, { dy: 10 });
  a += G(t, pt + 4.6, `${arrow(1440, 556, 1440, 598, {})}${rect(1180, 604, 520, 76, { r: 16, fill: '#DDEBFA', stroke: C.roofb, sw: 3 })}${text(1440, 652, 'Se evalúan con la entidad competente', { size: 24, weight: 800, fill: C.roofb, anchor: 'middle' })}`, { dy: 10 });
  g += win(t, B.C2.start, M.C2_presupuesto, a, .01, .35);
  // plan económico de transición
  let b = roomBg(); const px = 360, py = 170, pw = 1200, ph = 600;
  b += rect(px, py, pw, ph, { r: 24, fill: C.ivory, stroke: C.ink, sw: 4 }) + text(960, py + 56, 'Plan económico de transición: saldo mensual del hogar', { size: 34, weight: 800, anchor: 'middle' });
  [['Hoy', 280, 200, false], ['En la nueva vivienda', 235, 215, false], ['Escenario adverso', 190, 245, true]].forEach(([n, inc, gas, adv], i) => {
    const gx = px + 160 + i * 340, k = eo(prog(t, M.C2_presupuesto + .4 + i * .5, M.C2_presupuesto + 1.4 + i * .5)), base = py + 430;
    b += `<g opacity="${adv ? .72 : 1}">${rect(gx, base - inc * k, 90, inc * k, { fill: C.roofb, stroke: C.ink, sw: 2, dash: adv ? '8 6' : undefined })}${rect(gx + 100, base - gas * k, 90, gas * k, { fill: C.brick, stroke: C.ink, sw: 2, dash: adv ? '8 6' : undefined })}</g>` + text(gx + 95, base + 40, n, { size: 26, weight: 800, anchor: 'middle' });
  });
  b += line(px + 100, py + 430, px + pw - 80, py + 430, { stroke: C.ink, sw: 3 }) + rect(px + 100, py + 90, 26, 26, { fill: C.roofb }) + text(px + 136, py + 112, 'Ingresos netos', { size: 24, weight: 600 }) + rect(px + 340, py + 90, 26, 26, { fill: C.brick }) + text(px + 376, py + 112, 'Gastos esenciales', { size: 24, weight: 600 });
  b += G(t, M.C2_saldo, `${rect(480, 680, 960, 62, { r: 16, fill: C.navy })}${text(960, 722, 'Saldo mensual = ingresos netos − gastos esenciales', { size: 32, weight: 800, fill: '#fff', anchor: 'middle' })}`, { dy: 10 });
  g += win(t, M.C2_presupuesto, M.C2_propuesta, b);
  // propuesta
  let c = roomBg() + person(260, 830, 1.0, { ...P.madre, arm2: 60 }) + person(1700, 830, 1.0, { ...P.gestora, flip: true });
  const full = 'Vivienda con espacio para su cocina'; const n = Math.floor(full.length * eo(prog(t, M.C2_propuesta + .4, M.C2_propuesta + 2.6)));
  c += G(t, M.C2_propuesta, `${rect(470, 230, 980, 440, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${text(510, 300, 'Propuesta de la familia', { size: 30, weight: 700, fill: C.noned })}${text(510, 370, full.slice(0, n), { size: 40, weight: 800 })}`, { dy: 20 });
  c += G(t, M.C2_propuesta + 2.9, text(510, 420, 'para seguir trabajando desde casa', { size: 32, weight: 600 }), { dy: 8 });
  c += G(t, M.C2_propuesta + 3.6, `${tag(510, 456, 'Código P-01', { size: 30, fill: C.teal })}${tag(820, 460, 'En evaluación', { size: 26, fill: '#FBE9B7', color: C.warnd })}`, { dy: 10 });
  c += G(t, M.C2_codigo, `${line(510, 548, 1410, 548, { stroke: C.slate, sw: 2 })}${tag(510, 570, 'Gestiona la respuesta: gestora', { size: 23 })}${tag(950, 570, 'Responde: entidad de vivienda', { size: 23 })}`, { dy: 10 });
  g += win(t, M.C2_propuesta, undefined, c);
  return g;
}
const COLS = ['Confirmada', 'Condicionada', 'Solicitada', 'Sin respuesta'], COLIC = ['check', 'candado', 'sobre', 'flechaup'];
function board(x, y, w, h, cards, title) {
  let g = rect(x, y, w, h, { r: 20, fill: '#fff', stroke: C.ink, sw: 4 }) + text(x + w / 2, y + 48, title, { size: 32, weight: 800, anchor: 'middle' });
  const cw = (w - 60) / 4;
  COLS.forEach((c, i) => { const cx = x + 30 + i * cw; g += rect(cx + 4, y + 70, cw - 8, h - 90, { r: 12, fill: '#F2EEE5' }) + icon(COLIC[i], cx + 30, y + 108, 30, C.ink) + text(cx + 56, y + 116, c, { size: 24, weight: 800 }); });
  for (const cd of cards) { const cx = x + 30 + cd.col * cw + 12, cy = y + 150 + cd.row * 76; g += rect(cx, cy, cw - 24, 62, { r: 8, fill: cd.fill ?? '#FFF1B8', stroke: C.ink, sw: 2 }) + (cd.t2 ? text(cx + (cw - 24) / 2, cy + 27, cd.t, { size: 19, weight: 700, anchor: 'middle' }) + text(cx + (cw - 24) / 2, cy + 50, cd.t2, { size: 19, weight: 600, anchor: 'middle' }) : text(cx + (cw - 24) / 2, cy + 40, cd.t, { size: 21, weight: 700, anchor: 'middle' })); }
  return g;
}
function sceneC3(t) {
  let g = roomBg();
  // mesa técnica con participación comunitaria
  let a = roomBg() + board(330, 140, 1260, 400, [{ col: 0, row: 0, t: 'Ruta de bus escolar' }, { col: 1, row: 0, t: 'Cuidado compartido', fill: '#DDEBFA' }, { col: 2, row: 0, t: 'Horario de transporte', fill: '#E3F3E6' }, { col: 1, row: 1, t: 'Viviendas con espacio', t2: 'para trabajar', fill: '#F6E3D0' }, { col: 2, row: 1, t: 'Autoconstrucción', t2: 'requiere estudios', fill: '#F6E3D0' }], 'Mesa técnica · asuntos colectivos: vivienda, transporte y cuidado');
  const lt = t - M.C3_mesa;
  a += person(340, 800, .8, { ...P.enl1, arm2: 70 }) + person(600, 800, .8, P.enl2) + person(860, 800, .8, P.enl3) + person(1100, 800, .8, { ...P.gestora, flip: true }) + person(1290, 800, .8, { ...P.del1, flip: true, arm2: lt > 2 && lt < 5 ? 155 : 14 }) + person(1470, 800, .8, { ...P.del2, flip: true });
  a += tableTop(240, 690, 1350);
  a += G(t, M.C3_entidades + .5, [[340, 'Entidad de', 'vivienda'], [600, 'Entidad de gestión', 'del riesgo'], [860, 'Entidad de', 'oferta social']].map(([x, l1, l2]) => `${rect(x - 112, 724, 224, 84, { r: 12, fill: C.ivory, stroke: C.ink, sw: 2 })}${text(x, 756, l1, { size: 20, weight: 700, anchor: 'middle' })}${text(x, 786, l2, { size: 20, weight: 700, anchor: 'middle' })}`).join('') + [['Gestora', 1100], ['Delegada', 1290], ['Delegado', 1470]].map(([n, x]) => `${rect(x - 66, 740, 132, 50, { r: 12, fill: C.ivory, stroke: C.ink, sw: 2 })}${text(x, 773, n, { size: 21, weight: 700, anchor: 'middle' })}`).join(''), {});
  a += G(t, M.C3_mesa + 3.0, bubble(1100, 560, 380, 64, 'Proponemos ajustar el horario', { tx: 1290, size: 22 }), { out: M.C3_privado - .4 });
  g += win(t, B.C3.start, M.C3_privado, a, .01, .35);
  // espacio privado
  let b = roomBg() + rect(380, 140, 1160, 660, { fill: '#D9D1BF', stroke: C.ink, sw: 6 }) + tag(420, 170, 'Espacio privado', { size: 38, fill: C.teal }) + icon('candado', 880, 205, 44, C.ink);
  b += rect(1380, 260, 130, 540, { fill: '#7B4A38', stroke: C.ink, sw: 4 }) + circ(1400, 540, 9, { fill: '#E8C27A' });
  b += person(680, 800, 1.0, { ...P.madre, arm2: 30 }) + person(960, 800, 1.0, { ...P.gestora, flip: true }) + person(1230, 800, 1.0, { ...P.enl1, flip: true }) + tag(1230 - 140, 520, 'Profesional autorizado', { size: 22, center: true, w: 280 }) + tag(960 - 80, 520, 'Gestora', { size: 22, center: true, w: 160 }) + tag(680 - 80, 520, 'Mamá', { size: 22, center: true, w: 160 });
  b += G(t, M.C3_privado + .8, text(960, 300, 'El caso de la familia se revisa con ella presente', { size: 34, weight: 800, anchor: 'middle' }), {});
  g += win(t, M.C3_privado, M.C3_incidencia, b);
  // respuesta a la propuesta y hoja de devolución
  let c = roomBg() + person(150, 830, .85, P.madre);
  c += rect(260, 160, 720, 270, { r: 20, fill: C.ivory, stroke: C.ink, sw: 4 }) + tag(285, 182, 'P-01', { size: 32, fill: C.teal }) + text(285, 290, 'Vivienda con espacio para su cocina', { size: 32, weight: 800 }) + text(285, 332, 'para seguir trabajando desde casa', { size: 28, weight: 600 });
  c += G(t, M.C3_incidencia + .3, chip(285, 356, 'Respuesta: aceptada con ajustes', { size: 26, fill: '#DDF3E6', stroke: C.okd, color: C.okd, sw: 3.5 }), { dy: 10 });
  c += G(t, M.C3_incidencia + 1.4, `${arrow(470, 432, 380, 500, {})}${arrow(770, 432, 850, 500, {})}${chip(190, 510, 'Compromiso A-01 · confirmado', { size: 24, fill: '#DDF3E6', stroke: C.okd })}${chip(700, 510, 'A-02 · solicitado', { size: 24, fill: '#EEF3FA', stroke: C.roofb })}`, { dy: 12 });
  c += G(t, M.C3_noviable, `${rect(260, 610, 360, 100, { r: 14, fill: '#FBE3E1', stroke: C.critd, sw: 3 })}${text(440, 655, 'Parte no viable', { size: 30, weight: 800, fill: C.critd, anchor: 'middle' })}${text(440, 690, 'con su explicación', { size: 23, weight: 700, fill: C.critd, anchor: 'middle' })}${arrow(626, 660, 760, 660, {})}${chip(770, 630, 'Alternativas', { size: 26 })}`, { dy: 12 });
  c += G(t, M.C3_hoja, `${rect(1110, 160, 660, 600, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${text(1440, 220, 'HOJA DE DEVOLUCIÓN', { size: 34, weight: 800, anchor: 'middle' })}` +
    [['Qué se decidió', 'Aceptada con ajustes'], ['Por qué', 'Razones de cada entidad'], ['Qué sigue', 'Siguiente paso y fecha'], ['Quién responde', 'Responsable']].map(([f, v], i) => `${line(1140, 255 + i * 122, 1740, 255 + i * 122, { stroke: C.slate, sw: 2 })}${text(1150, 300 + i * 122, f, { size: 30, weight: 800 })}${text(1150, 342 + i * 122, v, { size: 26, weight: 500, fill: C.noned })}`).join(''), { dx: 40, dy: 0 });
  g += win(t, M.C3_incidencia, M.C3_desacuerdo + 1.4, c);
  // desacuerdo y preparación entregada
  const ts = M.C3_sello - .15; const sa = eo(prog(t, ts, ts + .5));
  let d = roomBg() + `<g opacity="${F(1 - .65 * sa)}">` + board(330, 140, 1260, 330, [{ col: 0, row: 0, t: 'Ruta de bus escolar' }, { col: 0, row: 1, t: 'Cuidado compartido', fill: '#DDEBFA' }, { col: 1, row: 0, t: 'Horario de transporte', fill: '#E3F3E6' }, { col: 1, row: 1, t: 'Viviendas con espacio', t2: 'para trabajar', fill: '#F6E3D0' }, { col: 2, row: 0, t: 'Autoconstrucción', t2: 'requiere estudios', fill: '#F6E3D0' }], 'Lo demás sigue avanzando') + '</g>';
  [['Desacuerdo', 450, '#FBD6D2'], ['Revisión', 860, '#FFF1B8'], ['Nivel que decide', 1290, '#DDEBFA']].forEach(([n, x, f], i, arr) => {
    d += G(t, M.C3_desacuerdo + 1.5 + i * .8, `${rect(x - 165, 560, 330, 100, { r: 16, fill: f, stroke: C.ink, sw: 3.5 })}${text(x, 622, n, { size: 34, weight: 800, anchor: 'middle' })}`, { dy: 12 });
    if (i < 2) d += G(t, M.C3_desacuerdo + 2.1 + i * .8, arrow(x + 172, 610, arr[i + 1][1] - 172, 610, {}), {});
  });
  d += G(t, M.C3_desacuerdo + 2.6, text(960, 720, 'El caso se escala, pero no se congela', { size: 32, weight: 700, anchor: 'middle' }), { out: M.C3_entregada });
  d += G(t, M.C3_entregada + .2, [['Ficha al día ✓', 520], ['Plan de reubicación ✓', 960], ['Respuestas y pendientes ✓', 1400]].map(([s, x]) => tag(x - 170, 700, s, { size: 28, fill: '#DDF3E6', stroke: C.okd, color: C.okd, center: true, w: 340 })).join(''), { dy: 10 });
  if (sa > 0) d += rect(0, 0, W, H, { fill: C.navy, op: F(.55 * sa) }) + `<g opacity="${F(sa)}" transform="rotate(-4 960 470)">${rect(470, 400, 980, 140, { r: 14, fill: '#fff', stroke: C.okd, sw: 8 })}${text(960, 492, 'PREPARACIÓN ENTREGADA', { size: 64, weight: 800, fill: C.okd, anchor: 'middle', ls: 2 })}</g>`;
  g += win(t, M.C3_desacuerdo + 1.4, undefined, d);
  return g;
}
