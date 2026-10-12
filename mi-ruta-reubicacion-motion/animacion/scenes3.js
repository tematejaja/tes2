// ===== Escenas C5, C6, E9, créditos y render principal =====
const PROF = { color: '#7A4FA8', label: 'Profesional de acompañamiento' };
function sceneC5(t) {
  const lt = t - B.C5.start; let g = landscape(t * 8, .12);
  const mA = M.C5_alerta, mT = M.C5_tarjeta, mC = M.C5_cierre;
  // edificio genérico (no identificable)
  g += rect(180, 260, 620, 575, { fill: '#C9CED2', stroke: C.ink, sw: 3 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) g += rect(220 + c * 145, 300 + r * 120, 90, 80, { fill: (r === 3 && c === 1) ? '#FFE9A8' : '#52687A', stroke: C.ink, sw: 2 });
  g += rect(450, 735, 100, 100, { fill: '#52687A', stroke: C.ink, sw: 2 });
  g += person(900, 830, 1.0, { ...P.madre, arm2: t > mC + 2.4 && t < mC + 3.8 ? 140 : 25 });
  g += rect(960, 775, 110, 12, { fill: '#6b4a32' }) + icon('olla', 1015, 750, 44, C.ink);
  let eco = 'sin';
  const econ = t < mA ? 'atendida' : t < M.C5_cierre + .4 ? 'critica' : t < M.C5_cierre + 1.7 ? 'gestion' : 'atendida';
  const rows = ['atendida', econ, 'atendida', 'gestion', 'atendida'];
  const f = ficha(1090, 140, { rows, resp: PROF, hab: 'reubicación definitiva', extra: ['Próximo contacto: fecha acordada'] });
  g += G(t, B.C5.start + .3, f.svg, { dx: 60, dy: 0 });
  // banner de traslado efectivo (continúa desde C4)
  const bn = 1 - prog(lt, 3.2, 3.8);
  if (bn > 0) g += `<g opacity="${F(bn)}">${rect(120, 140, 880, 96, { r: 14, fill: 'rgba(19,32,43,.94)' })}${text(560, 183, 'Traslado efectivo', { size: 36, weight: 800, fill: '#fff', anchor: 'middle' })}${text(560, 220, 'condiciones verificadas por la entidad competente', { size: 22, weight: 600, fill: '#cfe3ea', anchor: 'middle' })}</g>`;
  // alerta
  const closed = t > mC + 2.4;
  const hdrFill = closed ? '#DDF3E6' : '#FBE3E1', hdrCol = closed ? C.okd : C.critd;
  g += G(t, mA + .3, `${rect(110, 280, 780, 470, { r: 22, fill: C.ivory, stroke: C.ink, sw: 4 })}${rect(110, 280, 780, 70, { r: 22, fill: hdrFill, stroke: C.ink, sw: 4 })}${text(500, 328, closed ? 'ALERTA CERRADA' : 'ALERTA · ECONOMÍA', { size: 34, weight: 800, fill: hdrCol, anchor: 'middle' })}`, { dy: 16 });
  g += G(t, mA + .6, `${text(140, 405, 'Caída relevante del ingreso neto (umbral de prueba)', { size: 26, weight: 700 })}${text(140, 442, 'o necesidad básica desatendida', { size: 26, weight: 700 })}`, { dy: 8 });
  const fields = [['Responsable', 'Profesional de acompañamiento'], ['Acción', 'Gestionar atención con el actor competente'], ['Fecha de revisión', 'fecha acordada']];
  fields.forEach((fl, i) => { g += G(t, mT + i * .6, `${line(130, 490 + i * 78, 870, 490 + i * 78, { stroke: C.slate, sw: 2 })}${text(140, 530 + i * 78 - 6, fl[0] + ':', { size: 24, weight: 800, fill: C.noned })}${text(140, 556 + i * 78 - 4, fl[1], { size: 24, weight: 600 })}`, { dy: 8 }); });
  g += G(t, mC + .3, `${tag(110, 770, 'Derivación (no cierra la alerta)', { size: 22, fill: '#FFF1B8', stroke: C.warnd, w: 430 })}`, { dy: 8, out: mC + 3.4 });
  g += G(t, mC + 1.8, `${tag(570, 770, 'Atención recibida ✓', { size: 22, fill: '#DDF3E6', stroke: C.okd, color: C.okd, w: 290 })}`, { dy: 8 });
  return g;
}
function sceneC6(t) {
  const lt = t - B.C6.start; let g = roomBg();
  const b2 = M.C6_llaves - B.C6.start;
  if (lt < b2 - .2) {
    g += person(260, 830, .85, P.madre) + person(500, 830, .85, { ...P.prof, flip: false }) + person(1640, 830, .85, { ...P.rec, flip: true });
    g += rect(140, 150, 600, 340, { r: 20, fill: C.ivory, stroke: C.okd, sw: 5 }) + text(440, 208, 'Cumplido ✓', { size: 42, weight: 800, fill: C.okd, anchor: 'middle' });
    g += G(t, B.C6.start + .7, `${chip(170, 250, 'A-01 · verificada con el hogar ✓', { size: 24, fill: '#DDF3E6', stroke: C.okd, w: 540 })}`, { dy: 10 });
    g += rect(790, 150, 650, 340, { r: 20, fill: C.ivory, stroke: C.warnd, sw: 5 }) + text(1115, 208, 'Pendiente', { size: 42, weight: 800, fill: C.warnd, anchor: 'middle' });
    g += G(t, M.C6_revisa + .7, `${text(820, 270, 'Respuesta sobre el predio de origen', { size: 26, weight: 700 })}${text(820, 308, 'en evaluación por autoridad competente', { size: 24, weight: 600, fill: C.noned })}`, { dy: 10 });
    g += G(t, M.C6_pendiente, `${arrow(1440, 330, 1580, 420, { stroke: C.ink })}${nameTag(1640, 560, 'Receptor de continuidad', { w: 330 })}${tag(1480, 220, 'Próxima acción: fecha', { size: 26, fill: C.ivory, w: 360 })}`, { dy: 10 });
    const st = [['Preparación fortalecida', 0], ['Adaptación observada', 1], ['Atención pendiente', 2]];
    st.forEach(([n, i]) => { const on = i === 2 && t > M.C6_pendiente + 1.2; g += G(t, M.C6_pendiente + .5 + i * .3, `${rect(260 + i * 480, 560, 440, 74, { r: 14, fill: on ? '#FFF1B8' : '#F2EEE5', stroke: on ? C.warnd : C.noned, sw: on ? 5 : 2.5 })}${text(480 + i * 480, 608, n, { size: 29, weight: 800, fill: on ? C.warnd : C.noned, anchor: 'middle' })}`, { dy: 8 }); });
  } else {
    g += tableTop(560, 640, 800);
    g += G(t, M.C6_llaves, `${icon('llave', 700, 600, 130, C.ink)}`, { dy: -30 });
    const f = ficha(850, 150, { rows: null, prior: false, resp: { color: '#2F7A8A', label: 'Receptor de continuidad' }, hab: 'reubicación definitiva', extra: ['Pendiente: respuesta sobre el predio de origen', 'Próxima acción: fecha acordada'] });
    g += G(t, M.C6_llaves - .1, f.svg, { dy: 24 });
    g += person(300, 830, .95, P.madre) + person(1640, 830, .95, { ...P.rec, flip: true });
  }
  return g;
}
function sceneE9(t) {
  const lt = t - B.E9.start; let g = navyBg();
  const a2 = M.E9_piloto - B.E9.start;
  const sw = 1 - prog(lt, a2 - .5, a2 + .1);
  if (sw > 0) {
    let s = '';
    s += line(260, 330, 1660, 330, { stroke: C.teal, sw: 8 });
    ETAPAS.forEach((_, i) => { const x = 260 + i * 280; s += circ(x, 330, 20, { fill: C.teal, stroke: '#fff', sw: 3 }); });
    s += icon('casa', 150, 330, 70, '#cfe3ea') + icon('casa', 1770, 330, 70, C.teal);
    s += G(t, M.E9_frase, text(960, 520, 'Lo que la familia necesita antes de trasladarse', { size: 54, weight: 800, fill: '#fff', anchor: 'middle' }), { dy: 14 });
    s += G(t, M.E9_frase + 2.4, text(960, 600, 'se convierte en compromisos', { size: 54, weight: 800, fill: C.teal, anchor: 'middle' }), { dy: 14 });
    s += G(t, M.E9_frase + 4.5, text(960, 680, 'que se acompañan y se comprueban después.', { size: 54, weight: 800, fill: '#fff', anchor: 'middle' }), { dy: 14 });
    g += `<g opacity="${F(sw)}">${s}</g>`;
  }
  const o2 = eo(prog(lt, a2 - .3, a2 + .5));
  if (o2 > 0) {
    let s = '';
    s += G(t, M.E9_piloto + .2, text(960, 190, 'Meta: 350 hogares acompañados · 12 meses', { size: 58, weight: 800, fill: '#fff', anchor: 'middle' }), { dy: 10 });
    const n = Math.floor(350 * eo(prog(t, M.E9_piloto + .6, M.E9_piloto + 3.4)));
    for (let i = 0; i < n; i++) s += circ(380 + (i % 35) * 32, 280 + Math.floor(i / 35) * 34, 11, { fill: C.slate });
    const leg = ['en el sector, situación por aclarar', 'en ruta institucional de reasentamiento', 'ya reasentado'];
    s += G(t, M.E9_piloto + 1.0, leg.map((l, i) => tag([210, 790, 1500][i], 660, l, { size: 24, fill: C.ivory, w: l.length * 13 + 36 })).join(''), { dy: 10 });
    s += G(t, M.E9_notraslados - .3, text(960, 800, 'Distribución por conocer con la vinculación real', { size: 40, weight: 800, fill: C.teal, anchor: 'middle' }), { dy: 10 });
    g += `<g opacity="${F(o2)}">${s}</g>`;
  }
  return g;
}
function sceneCR(t) {
  const lt = t - TL.cr_start; let g = navyBg();
  const p1 = lt < 6.4;
  const L = p1 ? [['Imágenes: Esri, Vantor, Earthstar Geographics y GIS User Community', 30, 600], ['Imagen de calle: Google Street View (abr. 2025), © Google', 30, 600], ['Narración: voz sintética, Google Cloud Text-to-Speech', 30, 600], ['Música: pad ambiental generado para este video (producción propia)', 30, 600]]
    : [['MI RUTA DE REUBICACIÓN', 58, 800], ['Equipo del proyecto · DGIP 2026', 38, 600], ['Fuentes y alcance: ver documento adjunto', 32, 600], ['Piloto propuesto · por validar', 40, 800]];
  const ts = p1 ? lt : lt - 6.4; const a = eo(prog(ts, 0, .5)) * (p1 ? 1 - prog(lt, 5.9, 6.4) : 1) * (p1 ? 1 : 1 - prog(lt, 10.9, 11.0));
  let s = '';
  L.forEach((l, i) => { s += text(960, 360 + i * 100, l[0], { size: l[1], weight: l[2], fill: (!p1 && (i === 0 || i === 3)) ? C.teal : '#fff', anchor: 'middle' }); });
  return g + `<g opacity="${F(a)}">${s}</g>`;
}
function frameSVG(t) {
  let g = '';
  let blk = null; for (const b of Object.keys(B)) if (t >= B[b].start && t < B[b].end) blk = b;
  if (t >= TL.cr_start) blk = 'CR';
  const idx = { C1: 0, C2: 1, C3: 2, C4: 3, C5: 4, C6: 5 };
  switch (blk) {
    case 'E0': g += sceneE0(t); break; case 'E1': g += sceneE1(t); break; case 'E2': g += sceneE2(t); break;
    case 'C1': g += sceneC1(t) + chapterCard(t, 1, 'C1'); break; case 'C2': g += sceneC2(t) + chapterCard(t, 2, 'C2'); break;
    case 'C3': g += sceneC3(t) + chapterCard(t, 3, 'C3'); break; case 'C4': g += sceneC4(t) + chapterCard(t, 4, 'C4'); break;
    case 'C5': g += sceneC5(t) + chapterCard(t, 5, 'C5'); break; case 'C6': g += sceneC6(t) + chapterCard(t, 6, 'C6'); break;
    case 'E9': g += sceneE9(t); break; case 'CR': g += sceneCR(t); break;
  }
  // transiciones suaves entre bloques (fundido corto)
  if (blk in idx) g += minimap(idx[blk]);
  // fundido a negro/navy al inicio de bloques de ilustración distintos
  g += topLabels(t) + (blk === 'CR' ? '' : subtitles(t));
  return g;
}
// Control de fotograma (llamado por Playwright)
window.setFrame = async function (n) {
  const t = n / TL.fps; window.__t = t;
  const bg = document.getElementById('bg'), bg2 = document.getElementById('bg2');
  if (t < 13.8) {
    const k = Math.min(n + 1, 323); const src = 'bg/' + String(k).padStart(5, '0') + '.jpg';
    if (bg.getAttribute('src') !== src) { bg.src = src; bg2.src = src; }
    bg.style.display = 'block';
    // desenfoque de las personas en la toma de Street View
    bg2.style.display = (t >= 10.3 && t < 13.8) ? 'block' : 'none';
    await Promise.all([bg.decode().catch(() => {}), bg2.decode().catch(() => {})]);
  } else { bg.style.display = 'none'; bg2.style.display = 'none'; }
  document.getElementById('svg').innerHTML = frameSVG(t);
  return true;
};
