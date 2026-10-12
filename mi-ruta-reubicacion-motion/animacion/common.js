// ===== Elementos comunes de las escenas v2 =====
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
const nameTag = (x, y, s, o = {}) => tag(x - 100, y, s, { size: o.size ?? 22, fill: o.fill ?? C.ivory, w: 200, center: true, ...o });
const roomBg = () => rect(0, 0, W, H, { fill: '#E9E3D6' }) + rect(0, 0, W, 130, { fill: '#DDD5C4' }) + rect(0, 800, W, 280, { fill: '#B9AD96' }) + rect(0, 800, W, 6, { fill: 'rgba(0,0,0,.15)' });
const tableTop = (x, y, w) => rect(x, y, w, 22, { fill: '#8a6a4a', stroke: C.ink, sw: 3, r: 4 }) + rect(x + 30, y + 22, 18, 100, { fill: '#6b4a32' }) + rect(x + w - 48, y + 22, 18, 100, { fill: '#6b4a32' });
const chip = (x, y, s, o = {}) => tag(x, y, s, { size: o.size ?? 26, fill: o.fill ?? C.ivory, stroke: o.stroke ?? C.ink, color: o.color ?? C.ink, sw: o.sw ?? 2.5, center: o.center, w: o.w });
// ventana de un tramo: aparece en a y desaparece al llegar a b (sin encimarse con el siguiente)
function win(t, a, b, inner, fi = .35, fo = .3) {
  const op = eo(prog(t, a, a + fi)) * (b === undefined ? 1 : 1 - prog(t, b - fo, b));
  return op > .003 ? `<g opacity="${F(op)}">${inner}</g>` : '';
}
const scaled = (x, y, k, inner) => `<g transform="translate(${x},${y}) scale(${k})">${inner}</g>`;
function houseBig(x, by, w, h, sign = true) {
  let g = rect(x, by - h, w, h, { fill: C.brick }) + path(`M${x - 18} ${by - h} L${x + w + 18} ${by - h} L${x + w} ${by - h - 36} L${x} ${by - h - 50}Z`, { fill: C.roofb });
  for (let r = 0; r < 6; r++) g += line(x, by - h + 55 + r * 46, x + w, by - h + 55 + r * 46, { stroke: C.brickd, sw: 2 });
  g += rect(x + w * .1, by - h * .72, w * .24, h * .26, { fill: '#243442', r: 4 }) + rect(x + w * .58, by - h * .6, w * .28, h * .6, { fill: '#2b1f1a', r: 4 });
  if (sign) g += rect(x + w * .1, by - h * .93, w * .44, 44, { fill: C.ivory, stroke: C.ink, sw: 2, r: 6 }) + text(x + w * .32, by - h * .93 + 31, 'ALMUERZOS', { size: 26, weight: 800, anchor: 'middle' });
  return g;
}
function familyScene(t, o = {}) {
  let g = houseBig(780, 835, 420, 330);
  g += person(1290, 830, 1.0, P.cliente);
  g += person(640, 830, 1.0, { ...P.madre, arm2: 30 });
  g += rect(560, 760, 120, 14, { fill: '#6b4a32' }) + rect(572, 774, 10, 56, { fill: '#6b4a32' }) + rect(660, 774, 10, 56, { fill: '#6b4a32' }) + icon('olla', 620, 735, 46, C.ink);
  g += person(300, 830, 1.0, P.vecina) + person(400, 830, .62, P.hijo) + person(450, 830, .55, P.hija);
  return g;
}
function miniPerson(x, y, cloth, skin, arm) {
  return `<g>${circ(x, y - 108, 20, { fill: skin })}${rect(x - 24, y - 86, 48, 72, { r: 18, fill: cloth })}${line(x + 20, y - 76, x + (arm ? 36 : 28), y - (arm ? 130 : 40), { stroke: cloth, sw: 12 })}${circ(x + (arm ? 36 : 28), y - (arm ? 134 : 36), 8, { fill: skin })}</g>`;
}
function stationsRow(y, cur = -1, labels = false) {
  let g = line(160, y, 1760, y, { stroke: C.teal, sw: 10 });
  ETAPAS.forEach((n, i) => {
    const x = 160 + i * 320, on = i === cur;
    g += circ(x, y, on ? 30 : 22, { fill: on || cur < 0 ? C.teal : '#33434f', stroke: '#fff', sw: 3 }) + text(x, y + 10, String(i + 1), { size: on ? 30 : 24, weight: 800, fill: on || cur < 0 ? C.ink : '#fff', anchor: 'middle' });
  });
  return g;
}
