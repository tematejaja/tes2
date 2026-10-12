// ===== Paisaje, ficha, minimapa, rótulos y subtítulos =====
let _seed = 7; const rnd = () => (_seed = (_seed * 16807) % 2147483647) / 2147483647;
const HOUSES = [];
for (let layer = 0; layer < 2; layer++) {
  let x = -200;
  while (x < 2900) {
    const w = 90 + rnd() * 70, h = 70 + rnd() * 90;
    HOUSES.push({ layer, x, w, h, brick: [C.brick, C.brickd, '#A87558', '#7B4A38', '#C08E6A'][Math.floor(rnd() * 5)],
      roof: [C.roofb, C.roofr, '#8A97A3', '#2F6DB5', '#B5483B', '#3E8A72'][Math.floor(rnd() * 6)], win: rnd() > .35, off: rnd() * 40 });
    x += w * (.8 + rnd() * .35);
  }
}
function house(hs, x, by, k = 1) {
  const w = hs.w * k, h = hs.h * k;
  let g = rect(x, by - h, w, h, { fill: hs.brick });
  g += path(`M${x - 6} ${by - h} L${x + w + 6} ${by - h} L${x + w} ${by - h - 14 * k} L${x} ${by - h - 20 * k}Z`, { fill: hs.roof });
  if (hs.win) g += rect(x + w * .15, by - h * .7, w * .22, h * .22, { fill: '#243442' });
  g += rect(x + w * .55, by - h * .45, w * .24, h * .45, { fill: '#3a2c26' });
  return g;
}
function landscape(camx = 0, dim = 0) {
  let g = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky1}"/><stop offset="1" stop-color="${C.sky2}"/></linearGradient></defs>`;
  g += rect(0, 0, W, H, { fill: 'url(#sky)' });
  g += path(`M0 520 Q300 380 620 470 T1240 420 T1920 440 V860 H0Z`, { fill: C.hill1 });
  g += path(`M0 600 Q420 480 860 560 T1920 520 V860 H0Z`, { fill: C.hill2 });
  for (const hs of HOUSES) {
    const px = hs.layer === 0 ? camx * .25 : camx * .55;
    const x = hs.x - px;
    if (x < -260 || x > W + 60) continue;
    const by = hs.layer === 0 ? 640 - Math.max(0, x) * .05 + hs.off * .3 : 760 - Math.max(0, x) * .06 + hs.off * .2;
    g += house(hs, x, by, hs.layer === 0 ? .72 : 1);
  }
  // postes y cableado
  for (let i = 0; i < 6; i++) {
    const px = ((i * 420 + 150) - camx * .8) % 2520; const x = px < -60 ? px + 2520 : px;
    if (x > -40 && x < W + 40) g += line(x, 330, x, 800, { stroke: '#4b4540', sw: 9 }) + line(x - 60, 372, x + 60, 372, { stroke: '#4b4540', sw: 5 });
  }
  g += path(`M-20 372 Q300 440 560 372 T1120 380 T1700 372 T2100 380`, { stroke: '#38312d', sw: 2 });
  g += rect(0, 835, W, 245, { fill: C.ground });
  g += rect(0, 835, W, 8, { fill: 'rgba(0,0,0,.14)' });
  if (dim) g += rect(0, 0, W, H, { fill: C.navy, op: dim });
  return g;
}
const DIMS = [['Vivienda y entorno', 'casa'], ['Economía y medios de vida', 'olla'], ['Redes y cuidados', 'manos'], ['Servicios y acceso', 'cruz'], ['Participación y confianza', 'globo']];
// ficha familiar. o: rows(5 estados|null), resp{color,label}, hab, prior(bool), contacts, seals[], foot[], title
function ficha(x, y, o = {}) {
  const w = 760; let cy = 0; let g = '';
  const rows = o.rows, pr = o.prior;
  const h = 186 + (pr ? 96 : 0) + (rows ? 5 * 62 + 24 : 0) + ((o.extra || []).length * 44) + (o.contacts ? 70 : 0) + 64;
  g += rect(x + 8, y + 10, w, h, { r: 22, fill: 'rgba(0,0,0,.22)' });
  g += rect(x, y, w, h, { r: 22, fill: C.ivory, stroke: C.ink, sw: 3 });
  g += rect(x, y, w, 50, { r: 22, fill: C.navy }) + rect(x, y + 28, w, 22, { fill: C.navy });
  g += text(x + 28, y + 35, 'FICHA DE CARACTERIZACIÓN FAMILIAR', { size: 22, weight: 800, fill: C.teal, ls: 1 });
  y += 36;
  g += text(x + 28, y + 46, 'Hogar H-0000 · caso ilustrativo', { size: 26, weight: 800 });
  const rc = o.resp?.color ?? C.roofb;
  g += text(x + 28, y + 88, 'Responsable:', { size: 24, weight: 600 }) + circ(x + 228, y + 80, 15, { fill: rc, stroke: C.ink, sw: 2.5 }) + circ(x + 228, y + 75, 6, { fill: C.ivory }) +
    text(x + 254, y + 88, o.resp?.label ?? 'Gestora social', { size: 24, weight: 700 });
  g += text(x + 28, y + 126, 'Situación habitacional: ' + (o.hab ?? 'sin traslado'), { size: 22, weight: 600, fill: C.noned });
  cy = y + 150;
  if (pr) {
    g += line(x + 20, cy, x + w - 20, cy, { stroke: C.slate, sw: 2 });
    g += text(x + 28, cy + 36, 'Prioridades:', { size: 24, weight: 800 });
    g += text(x + 190, cy + 36, '• Seguir vendiendo comida', { size: 24, weight: 500 }) + text(x + 190, cy + 72, '• Conservar el apoyo de cuidado', { size: 24, weight: 500 });
    cy += 96;
  }
  if (rows) {
    g += line(x + 20, cy, x + w - 20, cy, { stroke: C.slate, sw: 2 });
    DIMS.forEach(([name, ic], i) => {
      const ry = cy + 36 + i * 62, st = rows[i];
      g += icon(ic, x + 48, ry - 8, 34, C.ink) + text(x + 84, ry, name, { size: 24, weight: 600 });
      if (st) {
        g += stIcon(st, x + 510, ry - 8, 15);
        if (st === 'sin') g += text(x + 538, ry - 10, 'Sin información', { size: 19, weight: 600, fill: C.noned }) + text(x + 538, ry + 12, 'suficiente', { size: 19, weight: 600, fill: C.noned });
        else g += text(x + 538, ry, STTXT[st], { size: 22, weight: 700, fill: { atendida: C.okd, gestion: C.warnd, critica: C.critd }[st] });
      }
    });
    cy += 5 * 62 + 24;
  }
  for (const e of (o.extra || [])) { g += text(x + 28, cy + 32, e, { size: 23, weight: 600 }); cy += 44; }
  if (o.contacts) { g += line(x + 20, cy + 4, x + w - 20, cy + 4, { stroke: C.slate, sw: 2 }) + icon('calendario', x + 46, cy + 36, 30) + text(x + 76, cy + 31, 'Contactos programados: 30 · 90 · 150 · 180 días', { size: 20, weight: 600 }) + text(x + 76, cy + 55, 'desde el ingreso al piloto', { size: 20, weight: 600 }); cy += 70; }
  g += line(x + 20, y + h - 88, x + w - 20, y + h - 88, { stroke: C.slate, sw: 2 });
  g += text(x + 28, y + h - 54, o.foot ?? 'Propuestas · Compromisos · Próximo contacto', { size: 21, weight: 600, fill: C.noned });
  return { svg: g, h };
}
const ETAPAS = ['Diagnóstico y caracterización', 'Plan de reubicación', 'Articulación institucional', 'Ejecución', 'Acompañamiento', 'Cierre y seguimiento'];
function minimap(cur) {
  let g = rect(30, 24, 560, 96, { r: 16, fill: 'rgba(19,32,43,.82)' });
  for (let i = 0; i < 6; i++) {
    const x = 70 + i * 90;
    if (i < 5) g += line(x + 17, 62, x + 73, 62, { stroke: i < cur ? C.teal : '#4a5b69', sw: 4 });
    const on = i === cur;
    g += circ(x, 62, on ? 19 : 14, { fill: on ? C.teal : (i < cur ? '#2c8f80' : '#33434f'), stroke: on ? '#fff' : 'none', sw: 3 });
    g += text(x, 69, String(i + 1), { size: on ? 21 : 17, weight: 800, fill: on ? C.ink : '#fff', anchor: 'middle' });
  }
  g += text(60, 108, ETAPAS[cur], { size: 20, weight: 700, fill: '#fff' });
  return g;
}
function topLabels(t) {
  let g = rect(1290, 22, 490, 48, { r: 12, fill: 'rgba(19,32,43,.88)' }) + text(1535, 55, 'PILOTO PROPUESTO · POR VALIDAR', { size: 22, weight: 800, fill: C.teal, anchor: 'middle', ls: 1 });
  const ilus = (t >= 12.3 && t < TL.blocks.E9.start) || (t >= TL.marks.E9_final - .3 && t < TL.cr_start);
  if (ilus) g += rect(1290, 76, 490, 44, { r: 12, fill: 'rgba(244,239,230,.94)', stroke: C.ink, sw: 2 }) + text(1535, 106, 'RECREACIÓN ILUSTRADA · FAMILIA FICTICIA', { size: 19, weight: 800, anchor: 'middle', ls: .5 });
  return g;
}
function wrapLines(s, max = 44) {
  const ws = s.split(' '); const out = []; let cur = '';
  for (const w of ws) { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) out.push(cur); return out;
}
function subtitles(t) {
  const c = TL.cues.find(c => t >= c.s && t < c.e + .05); if (!c) return '';
  const ls = wrapLines(c.text); const n = ls.length;
  const widest = Math.max(...ls.map(l => l.length)); const bw = Math.min(1700, widest * 25.5 + 70), bh = n * 58 + 26;
  const x = W / 2 - bw / 2, y = 986 - bh;
  let g = '<g id="subs">' + rect(x, y, bw, bh, { r: 14, fill: 'rgba(19,32,43,.78)' });
  ls.forEach((l, i) => { g += text(W / 2, y + 52 + i * 58, l, { size: 46, weight: 700, fill: '#fff', anchor: 'middle' }); });
  return g + '</g>';
}
// tarjeta de capítulo: aparece al inicio del bloque
function chapterCard(t, i, b) {
  const lt = t - TL.blocks[b].start; if (lt < 0 || lt > 2.2) return '';
  const a = eo(prog(lt, 0, .35)) * (1 - prog(lt, 1.8, 2.2));
  const dx = (1 - eo(prog(lt, 0, .5))) * -80;
  let g = rect(0, 0, W, H, { fill: C.navy, op: F(.62 * a) }) + `<g data-qa="skip" opacity="${F(a)}" transform="translate(${F(dx)},0)">`;
  g += rect(0, 300, 1130, 150, { r: 0, fill: 'rgba(19,32,43,.92)' }) + rect(0, 300, 14, 150, { fill: C.teal });
  g += text(70, 358, `ETAPA ${i}`, { size: 28, weight: 700, fill: C.teal, ls: 4 });
  g += text(70, 416, ETAPAS[i - 1].toUpperCase(), { size: 54, weight: 800, fill: '#fff', ls: 2 });
  return g + '</g>';
}
