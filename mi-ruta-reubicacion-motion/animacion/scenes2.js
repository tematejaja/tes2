// ===== Escenas C2, C3, C4 =====
const roomBg = () => rect(0, 0, W, H, { fill: '#E9E3D6' }) + rect(0, 0, W, 130, { fill: '#DDD5C4' }) + rect(0, 800, W, 280, { fill: '#B9AD96' }) + rect(0, 800, W, 6, { fill: 'rgba(0,0,0,.15)' });
function tableTop(x, y, w) { return rect(x, y, w, 22, { fill: '#8a6a4a', stroke: C.ink, sw: 3, r: 4 }) + rect(x + 30, y + 22, 18, 100, { fill: '#6b4a32' }) + rect(x + w - 48, y + 22, 18, 100, { fill: '#6b4a32' }); }
function chip(x, y, s, o = {}) { return tag(x, y, s, { size: o.size ?? 26, fill: o.fill ?? C.ivory, stroke: o.stroke ?? C.ink, color: o.color ?? C.ink, sw: o.sw ?? 2.5, dash: o.dash, w: o.w, center: o.center }); }

function sceneC2(t) {
  const lt = t - B.C2.start; let g = landscape(t * 8, .3);
  const b2 = M.C2_presupuesto - B.C2.start, b3 = M.C2_propuesta - B.C2.start;
  if (lt < b2 - .3) {
    g = roomBg();
    g += person(150, 830, 1.0, P.madre) + person(1780, 830, 1.0, { ...P.gestora, flip: true });
    g += tableTop(300, 700, 1320);
    // una sola opción disponible
    g += G(t, M.C2_opciones + .4, `${rect(330, 250, 600, 440, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${text(630, 310, 'Opción disponible', { size: 40, weight: 800, anchor: 'middle' })}` +
      [['moneda', 'Costos'], ['bus', 'Transporte'], ['trabajo', 'Cercanía al trabajo'], ['manos', 'Red de cuidado']].map((o, i) => `${rect(360 + (i % 2) * 280, 350 + Math.floor(i / 2) * 150, 260, 130, { r: 14, fill: '#fff', stroke: C.slate, sw: 2 })}${icon(o[0], 490 + (i % 2) * 280, 395 + Math.floor(i / 2) * 150, 54, C.roofb)}${text(490 + (i % 2) * 280, 455 + Math.floor(i / 2) * 150, o[1], { size: 24, weight: 700, anchor: 'middle' })}`).join(''), { dy: 30 });
    g += G(t, M.C2_opciones + 2.4, `${rect(1000, 250, 560, 140, { r: 18, fill: '#EDEAE2', stroke: C.noned, sw: 3, dash: '10 8' })}${text(1280, 305, 'Propuesta de la familia', { size: 32, weight: 800, fill: C.noned, anchor: 'middle' })}${text(1280, 350, 'en evaluación', { size: 28, weight: 600, fill: C.noned, anchor: 'middle' })}`, { dy: 24 });
    g += G(t, M.C2_opciones + 3.4, `${rect(1000, 430, 560, 200, { r: 18, fill: '#EDEAE2', stroke: C.noned, sw: 3, dash: '10 8' })}${text(1280, 485, 'Autoconstrucción', { size: 32, weight: 800, fill: C.noned, anchor: 'middle' })}${text(1280, 530, 'propuesta comunitaria', { size: 26, weight: 600, fill: C.noned, anchor: 'middle' })}${text(1280, 572, 'requiere evaluación', { size: 26, weight: 600, fill: C.noned, anchor: 'middle' })}`, { dy: 24 });
  } else if (lt < b3 - .3) {
    g = roomBg();
    const px = 360, py = 170, pw = 1200, ph = 600;
    g += rect(px, py, pw, ph, { r: 24, fill: C.ivory, stroke: C.ink, sw: 4 });
    g += text(960, py + 56, 'Saldo mensual del hogar', { size: 38, weight: 800, anchor: 'middle' });
    const groups = [['Hoy', 280, 200, false], ['Esperado', 235, 215, false], ['Escenario adverso', 190, 245, true]];
    groups.forEach(([n, inc, gas, adv], i) => {
      const gx = px + 160 + i * 340, k = eo(prog(lt, b2 + .3 + i * .55, b2 + 1.3 + i * .55));
      const base = py + 470;
      g += `<g opacity="${adv ? .72 : 1}">${rect(gx, base - inc * k, 90, inc * k, { fill: C.roofb, stroke: C.ink, sw: 2, dash: adv ? '8 6' : undefined })}${rect(gx + 100, base - gas * k, 90, gas * k, { fill: C.brick, stroke: C.ink, sw: 2, dash: adv ? '8 6' : undefined })}</g>`;
      g += text(gx + 95, base + 40, n, { size: 28, weight: 800, anchor: 'middle' });
    });
    g += line(px + 100, py + 470, px + pw - 80, py + 470, { stroke: C.ink, sw: 3 });
    g += rect(px + 100, py + 90, 26, 26, { fill: C.roofb }) + text(px + 136, py + 112, 'Ingresos netos', { size: 24, weight: 600 }) + rect(px + 340, py + 90, 26, 26, { fill: C.brick }) + text(px + 376, py + 112, 'Gastos esenciales', { size: 24, weight: 600 });
    g += G(t, M.C2_presupuesto + 1.6, `${rect(480, 800, 960, 70, { r: 16, fill: C.navy })}${text(960, 848, 'Saldo mensual = ingresos netos − gastos esenciales', { size: 36, weight: 800, fill: '#fff', anchor: 'middle' })}`, { dy: 20 });
  } else {
    g = roomBg() + person(260, 830, 1.0, { ...P.madre, arm2: 60 }) + person(1700, 830, 1.0, { ...P.gestora, flip: true });
    const full = 'Seguir vendiendo cerca del nuevo hogar'; const n = Math.floor(full.length * eo(prog(t, M.C2_propuesta + .4, M.C2_propuesta + 2.6)));
    g += G(t, M.C2_propuesta, `${rect(520, 250, 880, 360, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${tag(550, 280, 'P-01', { size: 40, fill: C.teal, color: C.ink })}${text(550, 410, 'Propuesta de la familia:', { size: 30, weight: 600, fill: C.noned })}${text(550, 470, full.slice(0, n), { size: 40, weight: 800 })}`, { dy: 20 });
    g += G(t, M.C2_propuesta + 2.6, `${line(550, 520, 1370, 520, { stroke: C.slate, sw: 2 })}${text(550, 575, 'Responsable:', { size: 30, weight: 600 })}${circ(790, 566, 20, { fill: C.roofb, stroke: C.ink, sw: 2.5 })}${circ(790, 560, 8, { fill: C.ivory })}${text(825, 576, 'Gestora', { size: 32, weight: 800 })}${tag(1080, 534, 'En evaluación', { size: 26, fill: '#FBE9B7', color: C.warnd, sw: 2.5 })}`, { dy: 10 });
  }
  return g;
}
const COLS = ['Confirmada', 'Condicionada', 'Solicitada', 'Sin respuesta'];
const COLIC = ['check', 'candado', 'sobre', 'flechaup'];
function board(x, y, w, h, cards, o = {}) {
  let g = rect(x, y, w, h, { r: 20, fill: '#fff', stroke: C.ink, sw: 4 });
  g += text(x + w / 2, y + 48, o.title ?? 'Transporte y cuidado compartidos', { size: 34, weight: 800, anchor: 'middle' });
  const cw = (w - 60) / 4;
  COLS.forEach((c, i) => {
    const cx = x + 30 + i * cw;
    g += rect(cx + 4, y + 70, cw - 8, h - 90, { r: 12, fill: '#F2EEE5' }) + icon(COLIC[i], cx + 30, y + 108, 30, C.ink) + text(cx + 56, y + 116, c, { size: 24, weight: 800 });
  });
  for (const cd of cards) {
    const cx = x + 30 + cd.col * cw + 12 + (cd.dx ?? 0), cy = y + 150 + cd.row * 80 + (cd.dy ?? 0);
    g += rect(cx, cy, cw - 24, 64, { r: 8, fill: cd.fill ?? '#FFF1B8', stroke: C.ink, sw: 2 }) + text(cx + (cw - 24) / 2, cy + 40, cd.t, { size: 21, weight: 700, anchor: 'middle' });
  }
  return g;
}
function sceneC3(t) {
  const lt = t - B.C3.start; let g = roomBg();
  const b2 = M.C3_privado - B.C3.start, b3 = M.C3_incidencia - B.C3.start, b4 = M.C3_desacuerdo - B.C3.start;
  const cardsA = [{ col: 0, row: 0, t: 'Ruta de bus escolar' }, { col: 1, row: 0, t: 'Cuidado compartido', fill: '#DDEBFA' }, { col: 2, row: 0, t: 'Horario de transporte', fill: '#E3F3E6' }];
  if (lt < b2 - .2) {
    g += board(330, 140, 1260, 400, cardsA);
    const pp = [[P.enl1, 340, ['Entidad de', 'vivienda']], [P.enl2, 600, ['Entidad de gestión', 'del riesgo']], [P.enl3, 860, ['Entidad de', 'oferta social']]];
    const arm = (k) => (lt > 3 + k * 1.5 && lt < 4.4 + k * 1.5) ? 150 : 14;
    g += person(340, 800, .8, { ...pp[0][0], arm2: 70 }) + person(600, 800, .8, pp[1][0]) + person(860, 800, .8, pp[2][0]);
    g += person(1100, 800, .8, { ...P.gestora, flip: true }) + person(1290, 800, .8, { ...P.del1, flip: true, arm2: lt > 3.2 && lt < 6.0 ? 155 : 14 }) + person(1470, 800, .8, { ...P.del2, flip: true });
    g += tableTop(260, 690, 1330);
    pp.forEach(([_, x, n]) => { g += G(t, B.C3.start + 1.0, `${rect(x - 105, 726, 210, 82, { r: 12, fill: C.ivory, stroke: C.ink, sw: 2 })}${text(x, 757, n[0], { size: 20, weight: 700, anchor: 'middle' })}${text(x, 786, n[1], { size: 20, weight: 700, anchor: 'middle' })}`, { out: M.C3_privado - 0.3 }); });
    g += G(t, B.C3.start + 1.0, [['Gestora', 1100], ['Delegada', 1290], ['Delegado', 1470]].map(([n, x]) => `${rect(x - 62, 740, 124, 48, { r: 12, fill: C.ivory, stroke: C.ink, sw: 2 })}${text(x, 772, n, { size: 21, weight: 700, anchor: 'middle' })}`).join(''), { out: M.C3_privado - 0.3 });
  } else if (lt < b3 - .2) {
    // espacio privado
    g += rect(380, 120, 1160, 680, { r: 0, fill: '#D9D1BF', stroke: C.ink, sw: 6 });
    g += tag(420, 150, 'Espacio privado', { size: 40, fill: C.teal, color: C.ink }) + icon('candado', 860, 192, 46, C.ink);
    g += rect(1380, 260, 130, 540, { fill: '#7B4A38', stroke: C.ink, sw: 4 }) + circ(1400, 540, 9, { fill: '#E8C27A' });
    g += person(680, 800, 1.0, { ...P.madre, arm2: 30 }) + person(960, 800, 1.0, { ...P.gestora, flip: true }) + person(1230, 800, 1.0, { ...P.enl1, flip: true });
    g += G(t, M.C3_privado + .8, text(960, 250, 'El caso familiar se revisa con la familia', { size: 38, weight: 800, anchor: 'middle', fill: C.ink }), {});
  } else if (lt < b4 - .2) {
    g += person(150, 830, .85, P.madre);
    g += rect(260, 170, 700, 280, { r: 20, fill: C.ivory, stroke: C.ink, sw: 4 }) + tag(285, 195, 'P-01', { size: 34, fill: C.teal, color: C.ink }) + text(285, 300, 'Seguir vendiendo cerca del', { size: 32, weight: 800 }) + text(285, 342, 'nuevo hogar', { size: 32, weight: 800 });
    g += G(t, M.C3_incidencia, chip(285, 372, 'Aceptada con ajustes', { size: 28, fill: '#DDF3E6', stroke: C.okd, color: C.okd, sw: 3.5 }), { dy: 10 });
    g += G(t, M.C3_ajustes, `${arrow(480, 452, 400, 520, { stroke: C.ink })}${arrow(700, 452, 780, 520, { stroke: C.ink })}${chip(250, 530, 'A-01 · Confirmada', { size: 26, fill: '#DDF3E6', stroke: C.okd })}${chip(620, 530, 'A-02 · Solicitada', { size: 26, fill: '#EEF3FA', stroke: C.roofb })}${chip(250, 620, 'Actividad de alimentos · con ajustes', { size: 23, fill: '#FFF1B8' })}`, { dy: 14 });
    g += G(t, M.C3_noviable, `${rect(260, 700, 360, 100, { r: 14, fill: '#FBE3E1', stroke: C.critd, sw: 3 })}${text(440, 745, 'No viable', { size: 30, weight: 800, fill: C.critd, anchor: 'middle' })}${text(440, 780, 'con explicación', { size: 24, weight: 700, fill: C.critd, anchor: 'middle' })}${bubble(700, 600, 190, 64, 'Razón', 0, { tx: 720, size: 26 })}${arrow(626, 750, 790, 750, { stroke: C.ink })}${chip(800, 718, 'Alternativas', { size: 26 })}`, { dy: 14 });
    g += G(t, M.C3_noviable + .15, `${rect(1120, 170, 640, 620, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${text(1440, 230, 'HOJA DE DEVOLUCIÓN', { size: 34, weight: 800, anchor: 'middle' })}` +
      ['Decisión', 'Razón', 'Siguiente paso', 'Responsable', 'Fecha de revisión'].map((f, i) => `${line(1150, 270 + i * 100, 1730, 270 + i * 100, { stroke: C.slate, sw: 2 })}${text(1160, 320 + i * 100, f, { size: 30, weight: 700 })}${line(1160, 342 + i * 100, 1480 - (i % 2) * 90, 342 + i * 100, { stroke: C.slate, sw: 8 })}`).join(''), { dx: 40, dy: 0 });
  } else {
    // el tablero sigue avanzando; un desacuerdo se revisa y se escala
    const k = lt - b4;
    const mv = (a, b0) => eio(prog(k, a, a + 1.4));
    const cards = [{ col: 0, row: 0, t: 'Ruta de bus escolar' }, { col: 1 + (k > 5.5 ? -1 : 0), row: 0, t: 'Cuidado compartido', fill: '#DDEBFA' }, { col: 2 - (k > 3.8 ? 1 : 0), row: 1, t: 'Horario de transporte', fill: '#E3F3E6' },
      { col: 2, row: 0, t: 'Desacuerdo', fill: '#FBD6D2', dy: 0 }];
    g += board(330, 120, 1260, 330, cards.slice(0, 3));
    const stages = [['Desacuerdo', 450, '#FBD6D2'], ['Revisión', 860, '#FFF1B8'], ['Nivel que decide', 1290, '#DDEBFA']];
    stages.forEach(([n, x, f], i) => { g += G(t, M.C3_desacuerdo + .3 + i * .9, `${rect(x - 160, 560, 320, 100, { r: 16, fill: f, stroke: C.ink, sw: 3.5 })}${text(x, 622, n, { size: 34, weight: 800, anchor: 'middle' })}`, { dy: 12 }); if (i < 2) g += G(t, M.C3_desacuerdo + 1.0 + i * .9, arrow(x + 170, 610, stages[i + 1][1] - 170, 610, { stroke: C.ink }), {}); });
    g += G(t, M.C3_desacuerdo + 3.0, `${arrow(1290, 555, 1290, 470, { stroke: C.ink })}${text(1290, 700, 'escala si hace falta', { size: 26, weight: 600, fill: C.noned, anchor: 'middle' })}`, {});
    g += G(t, M.C3_desacuerdo + 4.6, text(960, 760, 'Lo demás sigue avanzando', { size: 38, weight: 800, anchor: 'middle' }), {});
    // sello preparación entregada
    const sa = eo(prog(lt, B.C3.audio - .2, B.C3.audio + .5));
    if (sa > 0) g += `<g opacity="${F(sa)}" transform="rotate(-5 960 440)">${rect(500, 370, 920, 130, { r: 14, fill: 'rgba(255,255,255,.96)', stroke: C.okd, sw: 8 })}${text(960, 452, 'PREPARACIÓN ENTREGADA', { size: 62, weight: 800, fill: C.okd, anchor: 'middle', ls: 2 })}</g>`;
  }
  return g;
}
// ===== C4 =====
function sceneC4(t) {
  const lt = t - B.C4.start; let g = roomBg();
  const b2 = M.C4_nomudanza - B.C4.start, b3 = M.C4_entrega - B.C4.start;
  if (lt < b2 - .2) {
    const lanes = [['Entidad de vivienda', 'A-01 · Gestión documental', true], ['Entidad de gestión del riesgo', 'Acuerdo de cuidado', true], ['Entidad de oferta social', 'A-02 · Solicitada', false]];
    lanes.forEach(([n, a, ok], i) => {
      const y = 190 + i * 170;
      g += rect(300, y, 1400, 140, { r: 18, fill: '#fff', stroke: C.ink, sw: 3 }) + text(330, y + 55, n, { size: 28, weight: 800 });
      const k = ok ? eo(prog(lt, .8 + i * .5, 4.8 + i * .5)) : .12;
      g += rect(330, y + 80, 1000, 28, { r: 14, fill: '#E4E8EA' }) + rect(330, y + 80, 1000 * k, 28, { r: 14, fill: ok ? C.ok : C.none });
      g += chip(1330, y + 30, a, { size: 22, fill: ok ? '#DDF3E6' : '#ECEFF1', stroke: ok ? C.okd : C.noned, w: 350, center: true });
      if (!ok) g += text(1360, y + 125, 'solo solicitada: no avanza', { size: 22, weight: 600, fill: C.noned });
    });
    g += person(150, 830, 1.0, { ...P.gestora, arm2: 60 }) + G(t, B.C4.start + 1.0, nameTag(150, 590, 'Acompaña y registra', { w: 250, size: 20 }), {});
  } else if (lt < b3 - .2) {
    g += rect(380, 120, 1160, 690, { r: 24, fill: C.ivory, stroke: C.ink, sw: 4 });
    g += text(960, 190, 'Condiciones previas al traslado', { size: 40, weight: 800, anchor: 'middle' });
    g += G(t, M.C4_nomudanza, `${tag(600, 215, 'Preparación entregada · No autoriza la mudanza', { size: 28, fill: '#FBE3E1', stroke: C.critd, color: C.critd, w: 720 })}`, { dy: 8 });
    const conds = ['Solución habitacional', 'Servicios y acceso', 'Economía', 'Cuidados', 'Logística', 'Continuidad'];
    conds.forEach((c, i) => {
      const y = 330 + i * 72, t0 = M.C4_nomudanza + .8 + i * 1.0; const careGap = i === 3;
      const done = careGap ? t > M.C4_nomudanza + 5.0 : t > t0;
      g += text(460, y + 8, c, { size: 32, weight: 700 }) + line(440, y + 28, 1480, y + 28, { stroke: C.slate, sw: 2 });
      if (done) g += stIcon('atendida', 1340, y - 2, 20) + text(1380, y + 8, 'Verificada', { size: 26, weight: 700, fill: C.okd });
      else if (careGap && t > t0) g += tag(1130, y - 26, 'Cuidados · pendiente visible', { size: 22, fill: '#FFF1B8', stroke: C.warnd, w: 330 });
    });
    const hy = clamp((t - M.C4_nomudanza - .6) / 5.4) * 360 + 330;
    g += G(t, M.C4_nomudanza + .4, `${icon('persona', 1490, hy - 14, 40, C.roofb)}${text(1490, hy + 24, 'Entidad', { size: 18, weight: 800, fill: C.roofb, anchor: 'middle' })}${text(1490, hy + 44, 'competente', { size: 18, weight: 800, fill: C.roofb, anchor: 'middle' })}`, { dy: 0, dur: .3 });
  } else {
    const mv = eio(prog(lt, b3 + .6, b3 + 2.6)); const fx = lerp(1040, 1310, mv);
    g += person(700, 830, 1.0, { ...P.madre, arm2: 25 }) + person(1010, 830, 1.0, { ...P.gestora, arm2: lt < b3 + 2.8 ? 70 : 14 }) + person(1420, 830, 1.0, { ...P.prof, flip: true, arm1: 40 });
    const own = lt > b3 + 2.2 ? '#7A4FA8' : C.roofb;
    g += rect(fx - 85, 400, 170, 108, { r: 12, fill: C.ivory, stroke: C.ink, sw: 3 }) + text(fx, 444, 'H-0000', { size: 26, weight: 800, anchor: 'middle' }) + circ(fx, 476, 14, { fill: own, stroke: C.ink, sw: 2 });
    g += G(t, M.C4_entrega - .3, `${tag(880, 220, 'Encuentro de transición', { size: 34, fill: C.teal, color: C.ink })}`, { out: M.C4_confirma + 1.4 });
    g += G(t, M.C4_confirma, tag(1290, 450, 'Recibido ✓', { size: 36, fill: '#DDF3E6', stroke: C.okd, color: C.okd, sw: 4 }), { dy: -10 });
    g += G(t, M.C4_confirma + .5, `${rect(645, 470, 110, 74, { r: 10, fill: C.ivory, stroke: C.ink, sw: 3 })}${text(700, 514, 'Copia', { size: 24, weight: 800, anchor: 'middle' })}`, { dy: -10 });
    g += G(t, M.C4_confirma + .9, tag(1290, 360, 'Contacto: equipo siguiente', { size: 22, fill: C.ivory }), { dy: -10 });
    // remate: llaves
    const ka = prog(lt, B.C4.audio - .3, B.C4.audio + .6);
    if (ka > 0) g += `<g opacity="${F(ka)}">${rect(680, 300, 560, 340, { r: 24, fill: 'rgba(19,32,43,.94)' })}${icon('llave', 960, 440, 150, C.teal)}${text(960, 560, 'Traslado efectivo', { size: 46, weight: 800, fill: '#fff', anchor: 'middle' })}${text(960, 604, 'condiciones verificadas por la entidad competente', { size: 24, weight: 600, fill: '#cfe3ea', anchor: 'middle' })}</g>`;
  }
  return g;
}
