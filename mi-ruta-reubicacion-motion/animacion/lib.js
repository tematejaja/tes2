// ===== Utilidades, paleta y primitivas =====
const W = 1920, H = 1080;
const C = { navy:'#13202B', teal:'#3CDFC2', ivory:'#F4EFE6', ink:'#1B2026', slate:'#C9D3DC',
  brick:'#93624A', brickd:'#682C1E', roofb:'#2F6DB5', roofr:'#B5483B', ok:'#2E9E6A', warn:'#F2B233',
  crit:'#D64541', none:'#9AA4AE', okd:'#1F7A50', warnd:'#8A5A00', critd:'#B3261E', noned:'#5E6873',
  white:'#FFFFFF', skin1:'#E0B08C', skin2:'#B97A56', skin3:'#8A5A3C', sky1:'#CFDCE6', sky2:'#EEF1EE',
  hill1:'#9DB3A0', hill2:'#7E9C86', ground:'#6E7F6B' };
const clamp = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - x, 3);
const eio = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
const lerp = (a, b, x) => a + (b - a) * x;
const F = n => (Math.round(n * 100) / 100);
// grupo que aparece (opacidad + desplazamiento) entre a y, opcionalmente, desaparece a partir de b
function G(t, a, inner, o = {}) {
  const dur = o.dur ?? .45, dy = o.dy ?? 16, dx = o.dx ?? 0;
  let op = eo(prog(t, a, a + dur));
  if (o.out !== undefined) op *= 1 - prog(t, o.out, o.out + (o.outdur ?? .35));
  if (op <= 0.003) return '';
  const k = 1 - eo(prog(t, a, a + dur));
  return `<g opacity="${F(op)}" transform="translate(${F(dx*k)},${F(dy*k)})">${inner}</g>`;
}
function text(x, y, s, o = {}) {
  const size = o.size ?? 36, w = o.weight ?? 600, fill = o.fill ?? C.ink, anchor = o.anchor ?? 'start';
  const ls = o.ls ? ` letter-spacing="${o.ls}"` : '';
  return `<text x="${F(x)}" y="${F(y)}" font-family="Inter,sans-serif" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}"${ls}>${s}</text>`;
}
function rect(x, y, w, h, o = {}) {
  return `<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}" rx="${o.r ?? 0}" fill="${o.fill ?? 'none'}"` +
    (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 2}"` : '') + (o.dash ? ` stroke-dasharray="${o.dash}"` : '') +
    (o.op !== undefined ? ` opacity="${o.op}"` : '') + '/>';
}
function circ(x, y, r, o = {}) {
  return `<circle cx="${F(x)}" cy="${F(y)}" r="${F(r)}" fill="${o.fill ?? 'none'}"` + (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 2}"` : '') + (o.dash ? ` stroke-dasharray="${o.dash}"` : '') + '/>';
}
function line(x1, y1, x2, y2, o = {}) {
  return `<line x1="${F(x1)}" y1="${F(y1)}" x2="${F(x2)}" y2="${F(y2)}" stroke="${o.stroke ?? C.ink}" stroke-width="${o.sw ?? 3}" stroke-linecap="round"` + (o.dash ? ` stroke-dasharray="${o.dash}"` : '') + '/>';
}
function path(d, o = {}) {
  return `<path d="${d}" fill="${o.fill ?? 'none'}"` + (o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 2}" stroke-linecap="round" stroke-linejoin="round"` : '') + (o.op !== undefined ? ` opacity="${o.op}"` : '') + '/>';
}
function arrow(x1, y1, x2, y2, o = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = o.head ?? 16, col = o.stroke ?? C.ink;
  return line(x1, y1, x2, y2, { stroke: col, sw: o.sw ?? 4, dash: o.dash }) +
    path(`M${F(x2)} ${F(y2)} L${F(x2 - s*Math.cos(a - .5))} ${F(y2 - s*Math.sin(a - .5))} L${F(x2 - s*Math.cos(a + .5))} ${F(y2 - s*Math.sin(a + .5))}Z`, { fill: col });
}
// etiqueta redondeada con texto
function tag(x, y, s, o = {}) {
  const size = o.size ?? 30, pad = o.pad ?? 22, w = o.w ?? (s.length * size * .56 + pad * 2), h = size + 24;
  return `<g class="tag" data-pad="${pad}" data-center="${o.center ? 1 : 0}" data-min="${o.min ?? 0}">${rect(x, y, w, h, { r: o.r ?? 14, fill: o.fill ?? C.ivory, stroke: o.stroke ?? C.ink, sw: o.sw ?? 2.5 })}` +
    text(x + (o.center ? w / 2 : pad), y + h / 2 + size * .36, s, { size, weight: o.weight ?? 700, fill: o.color ?? C.ink, anchor: o.center ? 'middle' : 'start' }) + '</g>';
}
// ===== Iconos (centrados en x,y; tamaño s) =====
function icon(name, x, y, s = 40, col = C.ink) {
  const k = s / 40; const T = `transform="translate(${F(x)},${F(y)}) scale(${F(k)})"`;
  const st = `fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;
  const sh = {
    casa: `<path d="M-18 2 L0 -18 L18 2 M-13 -2 V18 H13 V-2" ${st}/>`,
    olla: `<path d="M-16 -4 H16 V12 Q16 18 10 18 H-10 Q-16 18 -16 12Z M-20 -4 H20 M-6 -12 Q0 -20 6 -12" ${st}/><circle cx="0" cy="7" r="4" fill="${col}"/>`,
    manos: `<circle cx="-9" cy="-9" r="6" ${st}/><circle cx="9" cy="-9" r="6" ${st}/><path d="M-20 16 Q-20 2 -9 2 Q0 2 0 10 Q0 2 9 2 Q20 2 20 16" ${st}/>`,
    cruz: `<path d="M-6 -16 H6 V-6 H16 V6 H6 V16 H-6 V6 H-16 V-6 H-6Z" ${st}/>`,
    globo: `<path d="M-18 -14 H18 V8 H0 L-10 18 V8 H-18Z" ${st}/>`,
    escudo: `<path d="M0 -18 L16 -11 V3 Q16 14 0 20 Q-16 14 -16 3 V-11Z" ${st}/><path d="M-6 2 L-1 7 L8 -5" ${st}/>`,
    llave: `<circle cx="-9" cy="0" r="9" ${st}/><path d="M0 0 H20 M14 0 V8 M20 0 V8" ${st}/>`,
    bus: `<rect x="-17" y="-14" width="34" height="24" rx="5" ${st}/><path d="M-17 -2 H17" ${st}/><circle cx="-9" cy="14" r="3.5" fill="${col}"/><circle cx="9" cy="14" r="3.5" fill="${col}"/>`,
    moneda: `<circle r="16" ${st}/><path d="M0 -9 V9 M-5 -5 Q0 -9 5 -5 M-5 5 Q0 9 5 5" ${st}/>`,
    trabajo: `<rect x="-17" y="-8" width="34" height="24" rx="4" ${st}/><path d="M-6 -8 V-14 H6 V-8" ${st}/>`,
    mesa: `<ellipse cx="0" cy="-2" rx="20" ry="9" ${st}/><path d="M0 7 V18 M-10 18 H10" ${st}/>`,
    puerta: `<rect x="-12" y="-18" width="24" height="36" rx="3" ${st}/><circle cx="6" cy="2" r="2" fill="${col}"/>`,
    sobre: `<rect x="-18" y="-12" width="36" height="24" rx="3" ${st}/><path d="M-18 -10 L0 4 L18 -10" ${st}/>`,
    reloj: `<circle r="16" ${st}/><path d="M0 -8 V0 L7 4" ${st}/>`,
    candado: `<rect x="-12" y="-4" width="24" height="20" rx="4" ${st}/><path d="M-7 -4 V-10 Q-7 -17 0 -17 Q7 -17 7 -10 V-4" ${st}/>`,
    check: `<path d="M-14 0 L-5 10 L15 -12" ${st}/>`,
    cruzx: `<path d="M-12 -12 L12 12 M12 -12 L-12 12" ${st}/>`,
    flechaup: `<path d="M0 16 V-14 M-10 -4 L0 -14 L10 -4" ${st}/>`,
    persona: `<circle cx="0" cy="-10" r="8" ${st}/><path d="M-14 18 Q-14 2 0 2 Q14 2 14 18" ${st}/>`,
    calendario: `<rect x="-16" y="-12" width="32" height="30" rx="4" ${st}/><path d="M-16 -3 H16 M-8 -17 V-9 M8 -17 V-9" ${st}/>`,
    lupa: `<circle cx="-4" cy="-4" r="11" ${st}/><path d="M4 4 L16 16" ${st}/>`,
  };
  return `<g ${T}>${sh[name] || ''}</g>`;
}
// icono de estado (atendida / gestion / critica / sin)
function stIcon(state, x, y, r = 18) {
  const ink = C.ink;
  if (state === 'atendida') return circ(x, y, r, { fill: C.ok, stroke: ink, sw: 2.5 }) + path(`M${x-r*.45} ${y} L${x-r*.1} ${y+r*.38} L${x+r*.5} ${y-r*.35}`, { stroke: '#fff', sw: 3.5 });
  if (state === 'gestion') return circ(x, y, r, { fill: '#fff', stroke: ink, sw: 2.5 }) + path(`M${x} ${y-r} A${r} ${r} 0 0 1 ${x} ${y+r}Z`, { fill: C.warn });
  if (state === 'critica') return path(`M${x} ${y-r} L${x+r*1.1} ${y+r*.85} L${x-r*1.1} ${y+r*.85}Z`, { fill: C.crit, stroke: ink, sw: 2.5 }) + text(x, y + r*.58, '!', { size: r * 1.15, weight: 800, fill: '#fff', anchor: 'middle' });
  return circ(x, y, r, { fill: '#fff', stroke: C.noned, sw: 2.5, dash: '4 4' }) + text(x, y + r*.4, '?', { size: r * 1.1, weight: 800, fill: C.noned, anchor: 'middle' });
}
const STTXT = { atendida: 'Atendida', gestion: 'En gestión', critica: 'Crítica', sin: 'Sin información suficiente' };
// ===== Personas =====
// o: skin, cloth, hair, pants, arm1, arm2 (grados desde la vertical hacia abajo), apron, vest, poncho, cane, flip, tag
function person(x, fy, s, o = {}) {
  const sk = o.skin ?? C.skin2, cl = o.cloth ?? C.roofb, hr = o.hair ?? '#2A1E1A', pn = o.pants ?? '#2F3A46';
  const a1 = (o.arm1 ?? 12) * Math.PI / 180, a2 = (o.arm2 ?? -12) * Math.PI / 180;
  const sx = o.flip ? -1 : 1;
  const sh1 = [-26, -128], sh2 = [26, -128], L = 64;
  const hand = (sh, a) => [sh[0] + L * Math.sin(a), sh[1] + L * Math.cos(a)];
  const h1 = hand(sh1, a1), h2 = hand(sh2, a2);
  let g = `<g transform="translate(${F(x)},${F(fy)}) scale(${F(s*sx)},${F(s)})">`;
  g += `<ellipse cx="0" cy="2" rx="38" ry="8" fill="rgba(0,0,0,.13)"/>`;
  g += rect(-20, -62, 17, 62, { fill: pn, r: 6 }) + rect(3, -62, 17, 62, { fill: pn, r: 6 });
  g += rect(-24, -4, 21, 9, { fill: '#222', r: 4 }) + rect(3, -4, 21, 9, { fill: '#222', r: 4 });
  g += line(sh1[0], sh1[1], h1[0], h1[1], { stroke: cl, sw: 17 }) + line(sh2[0], sh2[1], h2[0], h2[1], { stroke: cl, sw: 17 });
  g += rect(-33, -142, 66, 88, { fill: cl, r: 22 });
  if (o.poncho) g += path(`M-44 -128 L44 -128 L52 -52 L-52 -52Z`, { fill: o.poncho, op: .95 });
  if (o.apron) g += rect(-22, -112, 44, 58, { fill: o.apron, r: 8 });
  if (o.vest) g += rect(-33, -142, 20, 88, { fill: o.vest, r: 10 }) + rect(13, -142, 20, 88, { fill: o.vest, r: 10 }) + line(-33, -90, 33, -90, { stroke: '#fff', sw: 4 });
  g += circ(h1[0], h1[1], 9, { fill: sk }) + circ(h2[0], h2[1], 9, { fill: sk });
  g += rect(-8, -158, 16, 18, { fill: sk, r: 5 });
  g += circ(0, -178, 25, { fill: sk });
  g += path(`M-26 -182 Q-24 -210 0 -210 Q26 -210 26 -182 Q16 -196 0 -194 Q-16 -196 -26 -182Z`, { fill: hr });
  if (o.longhair) g += rect(-27, -190, 11, 44, { fill: hr, r: 6 }) + rect(16, -190, 11, 44, { fill: hr, r: 6 });
  if (o.cane) g += line(h2[0], h2[1] + 4, h2[0] + 4, 0, { stroke: '#5a4634', sw: 6 });
  if (o.bag) g += rect(h1[0] - 16, h1[1] - 4, 32, 36, { fill: o.bag, r: 6 });
  g += '</g>';
  return g;
}
function bubble(x, y, w, h, s, o = {}) {
  const tx = o.tx ?? x + 40;
  return `<g>${path(`M${x+16} ${y} H${x+w-16} Q${x+w} ${y} ${x+w} ${y+16} V${y+h-16} Q${x+w} ${y+h} ${x+w-16} ${y+h} H${tx+30} L${tx} ${y+h+26} L${tx+6} ${y+h} H${x+16} Q${x} ${y+h} ${x} ${y+h-16} V${y+16} Q${x} ${y} ${x+16} ${y}Z`, { fill: C.ivory, stroke: C.ink, sw: 2.5 })}` +
    text(x + w / 2, y + h / 2 + (o.size ?? 28) * .36, s, { size: o.size ?? 28, weight: 700, anchor: 'middle' }) + '</g>';
}

// Ajusta el ancho de cada rótulo a su texto real (evita textos que desbordan su recuadro)
function fitTags(root) {
  for (const g of root.querySelectorAll('g.tag')) {
    const r = g.querySelector('rect'), t = g.querySelector('text'); if (!r || !t) continue;
    const pad = +g.dataset.pad, w = Math.max(+g.dataset.min, t.getComputedTextLength() + 2 * pad);
    if (g.dataset.center === '1') { const cx = +t.getAttribute('x'); r.setAttribute('x', cx - w / 2); }
    r.setAttribute('width', w);
  }
}
