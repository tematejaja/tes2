// ===== Verificación automática de maquetación (se ejecuta en el navegador) =====
window.qaFrame = function () {
  const svg = document.getElementById('svg'); const out = [];
  const R = el => el.getBoundingClientRect();
  const texts = [...svg.querySelectorAll('text')].filter(t => t.textContent.trim() && +getComputedStyle(t).opacity !== 0);
  const vis = el => { let e = el; while (e && e !== svg) { const o = e.getAttribute && e.getAttribute('opacity'); if (o !== null && +o < .5) return false; e = e.parentNode; } return true; };
  const T = texts.filter(vis).filter(t => !t.closest('[data-qa=skip]')).map(t => ({ s: t.textContent.trim(), r: R(t), sub: !!t.closest('#subs') }));
  // 1) texto fuera del cuadro
  for (const t of T) if (t.r.left < -2 || t.r.right > 1922 || t.r.top < -2 || t.r.bottom > 1082) out.push(['FUERA', t.s]);
  // 2) textos que se pisan entre sí (incluye subtítulos tapando contenido)
  for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
    const a = T[i].r, b = T[j].r; const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (w > 4 && h > 4) { const ar = Math.min(a.width * a.height, b.width * b.height); if (w * h > .18 * ar) out.push(['PISA', T[i].s + ' ⟷ ' + T[j].s]); }
  }
  // 3) texto que desborda el recuadro que lo contiene (recuadros con borde)
  const boxes = [...svg.querySelectorAll('rect[stroke]')].filter(vis).map(r => ({ r: R(r) })).filter(b => b.r.width < 1880 && b.r.width > 40);
  for (const t of T) {
    if (t.sub) continue;
    const cx = (t.r.left + t.r.right) / 2, cy = (t.r.top + t.r.bottom) / 2;
    const cont = boxes.filter(b => cx > b.r.left && cx < b.r.right && cy > b.r.top && cy < b.r.bottom).sort((a, b) => a.r.width * a.r.height - b.r.width * b.r.height)[0];
    if (cont && (t.r.left < cont.r.left - 1 || t.r.right > cont.r.right + 1)) out.push(['DESBORDA', t.s]);
  }
  // 4) recuadros cortados por el borde del cuadro
  for (const b of boxes) if (b.r.left < -2 || b.r.right > 1922 || b.r.bottom > 1082 || b.r.top < -2) out.push(['RECUADRO_FUERA', `${Math.round(b.r.left)},${Math.round(b.r.top)} ${Math.round(b.r.width)}x${Math.round(b.r.height)}`]);
  return out;
};
