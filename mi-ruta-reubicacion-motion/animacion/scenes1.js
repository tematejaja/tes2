// ===== Escenas E0, E1, E2, C1 =====
const B = TL.blocks, M = TL.marks;
const P = {
  madre: { skin: C.skin2, cloth: '#B5483B', apron: '#F4EFE6', longhair: true },
  vecina: { skin: C.skin3, cloth: '#6A5A8C', poncho: '#C9A24A', hair: '#C8C8C8' },
  hijo: { skin: C.skin2, cloth: '#2F6DB5' }, hija: { skin: C.skin2, cloth: '#E0A83A', longhair: true },
  gestora: { skin: C.skin1, cloth: '#3A6EA5', vest: '#F2B233', hair: '#3a2a1a', longhair: true },
  gestor: { skin: C.skin3, cloth: '#3A6EA5', vest: '#F2B233' },
  prof: { skin: C.skin2, cloth: '#7A4FA8', vest: '#CFC1E8', hair: '#222', longhair: true },
  cliente: { skin: C.skin1, cloth: '#58626B', bag: '#C0603A' },
  enl1: { skin: C.skin1, cloth: '#5A6B7A', hair: '#222' }, enl2: { skin: C.skin2, cloth: '#6B5A7A', longhair: true }, enl3: { skin: C.skin3, cloth: '#5A7A6B' },
  del1: { skin: C.skin2, cloth: '#2E9E6A', longhair: true }, del2: { skin: C.skin3, cloth: '#D07A2D', cane: true, hair: '#999' },
  rec: { skin: C.skin1, cloth: '#2F7A8A', vest: '#9FD5DC', hair: '#444' },
};
const navyBg = () => rect(0, 0, W, H, { fill: C.navy });
const nameTag = (x, y, s, o = {}) => tag(x - (o.w ?? s.length * 9.5 + 30) / 2, y, s, { size: o.size ?? 22, fill: o.fill ?? C.ivory, w: o.w ?? s.length * (o.size ?? 22) * .54 + 36, center: true, ...o });

function sceneE0(t) {
  let g = '';
  if (t < 13.7) {
    // rótulo propio que tapa el rótulo quemado del video
    const lab = t < M.E0_cbolivar - .15 ? ['BOGOTÁ · COLOMBIA', 'LOCALIZACIÓN TERRITORIAL'] : t < M.E0_bellaflor - .15 ? ['CIUDAD BOLÍVAR', 'LOCALIZACIÓN TERRITORIAL'] : t < 10.3 ? ['BELLA FLOR', 'Ámbito del piloto: parte alta · delimitación por validar'] : null;
    if (lab) g += rect(30, 24, lab[1].length > 30 ? 780 : 660, 140, { r: 12, fill: C.navy }) + rect(30, 24, 10, 140, { fill: C.teal }) + text(64, 88, lab[0], { size: 54, weight: 800, fill: '#fff' }) + text(64, 134, lab[1], { size: lab[1].length > 30 ? 28 : 26, weight: 500, fill: '#9FB4C2' });
    if (t >= 10.3) g += rect(192, 78, 356, 176, { fill: C.navy, r: 10 }) + text(370, 150, 'Google Street View', { size: 30, weight: 700, fill: '#fff', anchor: 'middle' }) + text(370, 192, 'Imagen de calle · abr. 2025', { size: 24, weight: 500, fill: '#9FB4C2', anchor: 'middle' });
  }
  const a = eio(prog(t, 12.9, 13.7));
  if (a > 0) {
    let il = landscape(t * 8, 0) ;
    // familias: casas con marcadores; algunas "ya reasentadas" (contorno punteado) y otras que siguen
    const k = prog(t, B.E0.start + 13.6, B.E0.start + 16.5);
    // punto turquesa que se estira en la línea de ruta
    const x = lerp(960, 1920, eio(prog(t, 15.2, 19.2))), x0 = lerp(960, 0, eio(prog(t, 15.2, 19.2)));
    il += line(x0, 600, x, 600, { stroke: C.teal, sw: 10 });
    const pulse = 1 + .25 * Math.sin(t * 6);
    il += circ(960, 600, 20 * pulse, { fill: C.teal, stroke: '#fff', sw: 5 });
    g += `<g opacity="${F(a)}">${il}</g>`;
  }
  return g;
}
function sceneE1(t) {
  const lt = t - B.E1.start; let g = landscape(t * 8, 0) + rect(0, 0, W, H, { fill: C.navy, op: .62 });
  const tw = eio(prog(lt, .2, 3.0));
  g += `<clipPath id="ct"><rect x="0" y="0" width="${F(W * tw)}" height="${H}"/></clipPath>`;
  g += `<g clip-path="url(#ct)">${text(960, 330, 'MI RUTA DE REUBICACIÓN', { size: 108, weight: 800, fill: '#fff', anchor: 'middle', ls: 3 })}</g>`;
  g += line(0, 380, 1920 * Math.min(1, tw * 1.05), 380, { stroke: C.teal, sw: 10 });
  g += G(t, M.E1_validar, text(960, 452, 'Piloto propuesto · por validar', { size: 44, weight: 700, fill: C.teal, anchor: 'middle' }), { out: M.E1_idea + .1 });
  // narración con voz sintética (4 s)
  g += G(t, B.E1.start + .4, tag(40, 760, 'Narración con voz sintética', { size: 24, fill: 'rgba(244,239,230,.95)' }), { out: B.E1.start + 4.4 });
  // el piloto se conecta con las entidades (sin aval): puertas rotuladas por función
  const doors = [['Vivienda', 'casa'], ['Gestión del riesgo', 'escudo'], ['Oferta social', 'manos']];
  doors.forEach(([n, ic], i) => {
    const x = 560 + i * 400, a0 = M.E1_complementa + i * .45;
    g += G(t, a0, `${line(960, 480, x, 560, { stroke: C.teal, sw: 4, dash: '10 8' })}${rect(x - 125, 560, 250, 190, { r: 18, fill: C.ivory, stroke: C.ink, sw: 3 })}${icon('puerta', x, 625, 70, C.ink)}${icon(ic, x + 65, 600, 34, C.roofb)}${text(x, 715, n, { size: 26, weight: 700, anchor: 'middle' })}`, { dy: 24, out: M.E1_idea + .1 });
  });
  g += G(t, M.E1_complementa + 1.0, text(960, 800, 'conecta, no reemplaza', { size: 32, weight: 600, fill: '#cfe3ea', anchor: 'middle' }), { out: M.E1_idea + .1 });
  // idea central
  const o = eio(prog(t, M.E1_idea + .2, M.E1_idea + 1.4));
  g += G(t, M.E1_idea + .1, `${rect(560, 560, 800, 150, { r: 20, fill: 'rgba(0,0,0,0)' })}${text(960, 600, 'Más que un traslado,', { size: 76, weight: 800, fill: '#fff', anchor: 'middle' })}${text(960, 690, 'un nuevo comienzo.', { size: 76, weight: 800, fill: C.teal, anchor: 'middle' })}`, { dy: 20 });
  // puerta que se abre hacia la luz
  const open = eo(prog(t, M.E1_idea, M.E1_idea + 1.8));
  g += G(t, M.E1_idea - .1, `<g>${rect(150, 520, 200, 300, { fill: '#FFE9A8', r: 6 })}<g transform="translate(150,520) scale(${F(1 - .75 * open)},1)">${rect(0, 0, 200, 300, { fill: C.brickd, r: 6 })}${circ(170, 160, 8, { fill: '#e8c27a' })}</g></g>`, { dur: .3 });
  return g;
}
function sceneE2(t) {
  const lt = t - B.E2.start; let g = '';
  const mapIn = prog(t, M.E2_ruta - .5, M.E2_ruta + .3);
  if (mapIn < 1) {
    g += landscape(t * 8, .15);
    // gestora y respaldo
    g += person(330, 830, 1.0, { ...P.gestora, arm2: lt > M.E2_ficha - B.E2.start && lt < 4.4 ? 60 : 14 });
    g += person(160, 830, .9, { ...P.gestor, arm1: 8 });
    g += G(t, B.E2.start + .1, nameTag(330, 470, 'Gestora social · mentora de referencia', { w: 460 }), { out: M.E2_ruta });
    g += G(t, B.E2.start + .5, nameTag(160, 520, 'respaldo', { w: 130 }), { out: M.E2_ruta });
    g += person(1700, 830, 1.0, { ...P.prof, flip: true, arm1: 40 });
    // la ficha pasa de una mano a otra
    const mv = eio(prog(lt, 3.2, 5.0)); const fx = lerp(420, 930, mv);
    const resp = lt > 4.6 ? { color: '#7A4FA8', label: 'Profesional de acompañamiento' } : { color: C.roofb, label: 'Gestora social' };
    const f = ficha(fx, 150, { resp, contacts: true, rows: null, prior: false, foot: 'Propuestas · Acciones · Próximo contacto' });
    g += G(t, M.E2_ficha, f.svg, { dy: 30 });
    // globo "1, 2, 3…" tachado
    g += G(t, M.E2_historia, `${bubble(1280, 560, 330, 100, 'Mi historia: 1, 2, 3…', 0, { tx: 1560, size: 28 })}${line(1296, 574, 1596, 646, { stroke: C.crit, sw: 10 })}${line(1596, 574, 1296, 646, { stroke: C.crit, sw: 10 })}`, { dy: 16 });
    if (mapIn > 0) g = `<g opacity="${F(1 - mapIn)}">${g}</g>`;
  }
  if (mapIn > 0) {
    let m = navyBg();
    const xs = ETAPAS.map((_, i) => 160 + i * 320); const Y0 = -120;
    const draw = prog(t, M.E2_ruta, M.E2_ruta + 1.9);
    m += `<g transform="translate(0,${Y0})">`;
    m += line(160, 520, lerp(160, 1760, draw), 520, { stroke: C.teal, sw: 10 });
    ETAPAS.forEach((n, i) => {
      const a0 = M.E2_ruta + i * .32; const lw = n.split(' ');
      const half = Math.ceil(lw.length / 2), l1 = lw.slice(0, half).join(' '), l2 = lw.slice(half).join(' ');
      m += G(t, a0, `${circ(xs[i], 520, 30, { fill: C.teal, stroke: '#fff', sw: 4 })}${text(xs[i], 531, String(i + 1), { size: 32, weight: 800, fill: C.ink, anchor: 'middle' })}${text(xs[i], 585, l1, { size: 28, weight: 700, fill: '#fff', anchor: 'middle' })}${text(xs[i], 618, l2, { size: 28, weight: 700, fill: '#fff', anchor: 'middle' })}`, { dy: 10, dur: .35 });
    });
    // resiliencia: cinco hilos
    const ks = DIMS.map((d, i) => G(t, M.E2_resil + i * .22, `${icon(d[1], 200, 705 + i * 40, 30, C.slate)}${text(240, 714 + i * 40, d[0], { size: 24, weight: 600, fill: '#cfe3ea' })}${line(600, 705 + i * 40, lerp(600, 1760, eio(prog(t, M.E2_resil + i * .22, M.E2_resil + 1.4 + i * .22))), 705 + i * 40, { stroke: C.slate, sw: 5 })}`, { dy: 6 })).join('');
    m += G(t, M.E2_resil - .1, text(160, 665, 'RESILIENCIA · cinco dimensiones', { size: 30, weight: 800, fill: C.teal, ls: 1 }), { dy: 6 }) + ks;
    // mesas de trabajo con mentora
    m += G(t, M.E2_mesas, `${line(160, 395, 1760, 395, { stroke: C.slate, sw: 5, dash: '14 10' })}${circ(300, 395, 36, { fill: C.ivory, stroke: C.ink, sw: 3 })}${icon('mesa', 300, 395, 50, C.ink)}${circ(420, 395, 26, { fill: C.roofb, stroke: '#fff', sw: 3 })}${circ(420, 388, 10, { fill: C.ivory })}${text(160, 335, 'MESAS DE TRABAJO CON ACOMPAÑAMIENTO DE UNA MENTORA', { size: 30, weight: 800, fill: C.teal, ls: 1 })}`, { dy: -10 });
    m += '</g>';
    g += `<g opacity="${F(mapIn)}">${m}</g>`;
  }
  return g;
}
// ===== C1 =====
function houseBig(x, by, w, h, withSign = true) {
  let g = rect(x, by - h, w, h, { fill: C.brick }) + path(`M${x - 18} ${by - h} L${x + w + 18} ${by - h} L${x + w} ${by - h - 36} L${x} ${by - h - 50}Z`, { fill: C.roofb });
  for (let r = 0; r < 6; r++) g += line(x, by - h + 55 + r * 46, x + w, by - h + 55 + r * 46, { stroke: C.brickd, sw: 2, }); 
  g += rect(x + w * .1, by - h * .72, w * .24, h * .26, { fill: '#243442', r: 4 }) + rect(x + w * .58, by - h * .6, w * .28, h * .6, { fill: '#2b1f1a', r: 4 });
  if (withSign) g += rect(x + w * .1, by - h * .93, w * .4, 44, { fill: C.ivory, stroke: C.ink, sw: 2, r: 6 }) + text(x + w * .3, by - h * .93 + 31, 'COMIDAS', { size: 28, weight: 800, anchor: 'middle' });
  return g;
}
function sceneC1(t) {
  const lt = t - B.C1.start; let g = '';
  const m1 = M.C1_escucha - B.C1.start, m2 = M.C1_dimensiones - B.C1.start, m3 = M.C1_nogarantiza - B.C1.start, m4 = M.C1_urgencia - B.C1.start;
  if (lt < m4 - .3) {
    const dim = lt >= m2 - .3 ? .35 : 0;
    g += landscape(t * 8, dim);
    // casa y familia
    g += houseBig(780, 835, 420, 330);
    g += person(1290, 830, 1.0, P.cliente);
    g += person(640, 830, 1.0, { ...P.madre, arm2: lt > m2 + 3 && lt < m3 ? 78 : 30 });
    g += rect(560, 760, 120, 14, { fill: '#6b4a32' }) + rect(572, 774, 10, 56, { fill: '#6b4a32' }) + rect(660, 774, 10, 56, { fill: '#6b4a32' }) + icon('olla', 620, 735, 46, C.ink);
    g += person(300, 830, 1.0, P.vecina) + person(400, 830, .62, P.hijo) + person(450, 830, .55, P.hija);
    g += G(t, B.C1.start + .8, nameTag(520, 580, 'Familia ficticia', { w: 230 }), { out: B.C1.start + 6.4 });
    // escucha
    if (lt >= m1 - .2) {
      const gx = lerp(-120, 520, eo(prog(lt, m1 - .2, m1 + 1.6)));
      g += person(gx, 830, 1.0, { ...P.gestora, arm2: 55 }) + G(t, M.C1_escucha + .4, nameTag(520, 590, 'Gestora social', { w: 220 }), { out: M.C1_dimensiones });
      g += G(t, M.C1_escucha + 1.2, bubble(420, 330, 360, 90, 'Conservar mis clientes', 0, { tx: 640, size: 26 }), { out: M.C1_dimensiones });
      g += G(t, M.C1_escucha + 2.4, bubble(220, 450, 420, 90, 'No perder el apoyo de la vecina', 0, { tx: 300, size: 24 }), { out: M.C1_dimensiones });
      // inserto: mesa comunitaria
      const ix = 1240, iy = 150;
      let ins = rect(ix, iy + 40, 620, 330, { r: 18, fill: C.ivory, stroke: C.ink, sw: 3 }) + tag(ix + 20, iy - 20, 'Mesa comunitaria', { size: 26, fill: C.teal, color: C.ink });
      ins += ellipse_table(ix + 310, iy + 250);
      const cs = [['#B5483B', C.skin2, 0], ['#6A5A8C', C.skin3, 0], ['#2F6DB5', C.skin1, 1], ['#2E9E6A', C.skin2, 0], ['#D07A2D', C.skin3, 0]];
      cs.forEach((c, i) => { const px = ix + 90 + i * 110; ins += miniPerson(px, iy + 250, c[0], c[1], i === 2 ? 130 : 0); });
      ins += G(t, M.C1_escucha + 3.0, bubble(ix + 230, iy + 70, 260, 60, 'Propongo…', 0, { tx: ix + 330, size: 24 }), {});
      g += G(t, M.C1_escucha + .5, ins, { dx: 60, dy: 0, out: M.C1_dimensiones - .2 });
    }
  }
  if (lt >= m2 - .3 && lt < m4 - .3) {
    // ficha con las cinco dimensiones
    const st = ['gestion', 'gestion', 'gestion', 'sin', 'atendida'];
    const rows = st.map((s, i) => t >= M.C1_dimensiones + i * .35 ? s : null);
    const f = ficha(1050, 150, { rows, prior: true, extra: t >= M.C1_corrige ? ['Revisada por el hogar ✓'] : [] });
    let fg = f.svg;
    if (t >= M.C1_corrige) fg += `<g transform="rotate(-6 1500 ${150 + f.h - 92})">${rect(1390, 150 + f.h - 122, 330, 56, { r: 10, fill: 'none', stroke: C.okd, sw: 5 })}${text(1555, 150 + f.h - 83, 'REVISADA POR EL HOGAR ✓', { size: 24, weight: 800, fill: C.okd, anchor: 'middle' })}</g>`;
    g += G(t, M.C1_dimensiones - .2, fg, { dx: 80, dy: 0 });
    g += G(t, M.C1_dimensiones, tag(110, 190, 'Resiliencia: cinco dimensiones', { size: 30, fill: C.teal, color: C.ink }), { out: M.C1_nogarantiza });
    g += person(430, 830, 1.0, { ...P.madre, arm2: t > M.C1_corrige && t < M.C1_corrige + 1.8 ? 80 : 20 });
    g += person(700, 830, 1.0, { ...P.gestora, flip: true, arm2: 20 });
    g += G(t, M.C1_nogarantiza, `${tag(100, 380, 'No garantiza vivienda', { size: 34, fill: C.ivory })}${tag(100, 470, 'No obliga a aceptar', { size: 34, fill: C.ivory })}${icon('casa', 70, 412, 40, C.crit)}${icon('cruzx', 70, 502, 34, C.crit)}`, { dx: -40, dy: 0 });
  }
  if (lt >= m4 - .5) {
    let r = navyBg(); const a = eo(prog(lt, m4 - .5, m4 + .2)); const xs = ETAPAS.map((_, i) => 160 + i * 320);
    r += line(160, 470, 1760, 470, { stroke: C.teal, sw: 10 });
    xs.forEach((x, i) => { r += circ(x, 470, i === 0 ? 30 : 22, { fill: i === 0 ? C.teal : '#33434f', stroke: '#fff', sw: 3 }) + text(x, 480, String(i + 1), { size: i === 0 ? 30 : 24, weight: 800, fill: i === 0 ? C.ink : '#fff', anchor: 'middle' }); });
    // ficha pequeña que sigue en la ruta
    r += rect(240, 395, 170, 56, { r: 10, fill: C.ivory, stroke: C.ink, sw: 2 }) + text(325, 432, 'H-0000', { size: 26, weight: 800, anchor: 'middle' });
    // canal paralelo
    r += line(160, 720, 1760, 720, { stroke: '#fff', sw: 6, dash: '18 12' });
    r += tag(250, 650, 'Canal de emergencia · autoridad competente', { size: 28, fill: C.ivory });
    const pp = eio(prog(lt, m4 + .3, m4 + 1.6));
    r += line(160, 470, 160, lerp(470, 720, pp), { stroke: '#fff', sw: 8 }) + circ(160, lerp(470, 720, pp), 16, { fill: '#fff' });
    r += circ(160, 720, 40, { fill: C.ivory, stroke: '#fff', sw: 4 }) + icon('escudo', 160, 720, 54, C.okd);
    r += G(t, M.C1_urgencia + 1.4, `${line(325, 451, 325, 650, { stroke: C.teal, sw: 3, dash: '6 8' })}${text(360, 570, 'coordinación · registros separados', { size: 26, weight: 600, fill: '#cfe3ea' })}`, {});
    r += text(960, 270, 'Riesgo inmediato → canal de emergencia', { size: 54, weight: 800, fill: '#fff', anchor: 'middle' });
    r += G(t, M.C1_urgencia + 1.2, text(960, 340, 'Sin esperar ficha, mesa ni acuerdo', { size: 40, weight: 700, fill: C.teal, anchor: 'middle' }), {});
    g += `<g opacity="${F(a)}">${r}</g>`;
  }
  return g;
}
function ellipse_table(cx, cy) { return `<ellipse cx="${cx}" cy="${cy}" rx="250" ry="38" fill="#8a6a4a" stroke="${C.ink}" stroke-width="3"/>`; }
function miniPerson(x, y, cloth, skin, arm) {
  return `<g>${circ(x, y - 108, 20, { fill: skin })}${rect(x - 24, y - 86, 48, 72, { r: 18, fill: cloth })}${line(x + 20, y - 76, x + (arm ? 36 : 28), y - (arm ? 130 : 40), { stroke: cloth, sw: 12 })}${circ(x + (arm ? 36 : 28), y - (arm ? 134 : 36), 8, { fill: skin })}</g>`;
}
