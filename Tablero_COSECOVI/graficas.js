/* =====================================================================
   TABLERO COSECOVI ESCOM · GRÁFICAS (HTML y SVG, sin librerías)
   ===================================================================== */
(function () {
  const COL = { guinda: '#6e1538', guinda2: '#b06787', rojo: '#c62f3a', amar: '#e9b300', atencion: '#1e5f9e', canal: '#6b3fa0', cerrado: '#8a929c', A: '#b9a4ae' };

  /* Barras horizontales: items [{et, v, color?, icono?, on?}] */
  function barras(items, color, anchoEt) {
    const max = Math.max(1, ...items.map(i => i.v));
    return '<div style="--et:' + (anchoEt || 130) + 'px">' + items.map(i =>
      '<div class="barra' + (i.on ? ' on' : '') + '"><span class="et" title="' + i.et + '">' + (i.icono || '') + i.et + '</span>' +
      '<div class="riel"><div class="rel" style="width:' + (i.v / max * 100) + '%;background:' + (i.color || color || COL.guinda) + '"></div></div><span class="v">' + i.v + '</span></div>').join('') + '</div>';
  }

  /* Dona: partes [{et, v, color}] */
  function dona(partes, sub) {
    const tot = partes.reduce((s, p) => s + p.v, 0), r = 40, C = 2 * Math.PI * r; let off = 0;
    const arcos = partes.map(p => { const l = tot ? p.v / tot * C : 0; const a = '<circle r="' + r + '" cx="54" cy="54" fill="none" stroke="' + p.color + '" stroke-width="16" stroke-dasharray="' + l + ' ' + (C - l) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 54 54)"/>'; off += l; return a; }).join('');
    return '<div class="dona"><svg width="108" height="108" viewBox="0 0 108 108"><circle r="' + r + '" cx="54" cy="54" fill="none" stroke="#f1edef" stroke-width="16"/>' + arcos +
      '<text x="54" y="54" text-anchor="middle" font-size="19" font-weight="700" fill="#2a2326">' + tot + '</text><text x="54" y="69" text-anchor="middle" font-size="9.5" fill="#5f565b">' + (sub || 'reportes') + '</text></svg>' +
      '<ul>' + partes.map(p => '<li><i style="background:' + p.color + '"></i>' + p.et + '<b>' + p.v + ' · ' + (tot ? Math.round(p.v / tot * 1000) / 10 : 0) + ' %</b></li>').join('') + '</ul></div>';
  }

  /* Línea mensual con proyección punteada opcional
     serie [{mes:'2026-01', n}], proy [{mes, n}], resaltar ['2026-07'] */
  function linea(serie, opc) {
    opc = opc || {};
    const proy = opc.proy || [], todo = serie.concat(proy), W = opc.W || 520, H = opc.H || 180, pl = 30, pr = 14, pt = 20, pb = 26;
    if (!todo.length) return '<p class="nota">Sin datos en el periodo.</p>';
    const max = Math.max(5, Math.ceil(Math.max(...todo.map(d => d.n)) / 5) * 5);
    const x = i => todo.length === 1 ? (pl + W - pr) / 2 : pl + i * (W - pl - pr) / (todo.length - 1), y = v => pt + (1 - v / max) * (H - pt - pb);
    let g = '';
    for (let v = 0; v <= max; v += max / 4) g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#ece6e9"/><text x="' + (pl - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end" font-size="10" fill="#7a7075">' + Math.round(v) + '</text>';
    const pts = serie.map((d, i) => x(i) + ',' + y(d.n)).join(' ');
    const area = serie.length > 1 ? '<polygon points="' + pl + ',' + y(0) + ' ' + pts + ' ' + x(serie.length - 1) + ',' + y(0) + '" fill="' + COL.guinda + '" opacity=".07"/>' : '';
    const pPts = proy.length ? [serie.length - 1].concat(proy.map((_, i) => serie.length + i)).map(i => x(i) + ',' + y(todo[i].n)).join(' ') : '';
    const res = opc.resaltar || [];
    const puntos = todo.map((d, i) => { const esP = i >= serie.length, on = res.includes(d.mes) || (!res.length && i === serie.length - 1 && !esP);
      return '<circle cx="' + x(i) + '" cy="' + y(d.n) + '" r="' + (on ? 5 : 3.5) + '" fill="' + (on ? COL.guinda : '#fff') + '" stroke="' + COL.guinda + '" stroke-width="2"' + (esP ? ' stroke-dasharray="2 2"' : '') + '/>' +
        '<text x="' + x(i) + '" y="' + (y(d.n) - 9) + '" text-anchor="middle" font-size="10.5" font-weight="' + (on ? 700 : 500) + '" fill="' + (esP ? '#7a7075' : '#2a2326') + '">' + d.n + '</text>' +
        '<text x="' + x(i) + '" y="' + (H - 7) + '" text-anchor="middle" font-size="10.5" fill="#5f565b">' + M.u.mesCorto(d.mes) + '</text>'; }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img">' + g + area +
      (serie.length > 1 ? '<polyline points="' + pts + '" fill="none" stroke="' + COL.guinda + '" stroke-width="2.5"/>' : '') +
      (pPts ? '<polyline points="' + pPts + '" fill="none" stroke="' + COL.guinda + '" stroke-width="2" stroke-dasharray="6 5"/>' : '') + puntos + '</svg>' +
      (proy.length ? '<div class="leyenda" style="margin-top:4px"><span><i style="background:' + COL.guinda + ';border-radius:2px;height:3px;width:16px"></i>Histórico</span><span><i style="border-top:2px dashed ' + COL.guinda + ';border-radius:0;height:0;width:16px"></i>Proyección ' + proy.length + ' meses</span></div>' : '');
  }

  /* Columnas verticales: items [{et, v}], resalta la de mayor valor */
  function columnas(items) {
    const max = Math.max(1, ...items.map(i => i.v)), top = items.reduce((a, b) => b.v > a.v ? b : a, items[0]);
    return '<div class="columnas">' + items.map(i => '<div class="c' + (i === top && i.v ? ' on' : '') + '"><span class="v">' + i.v + '</span><div class="riel"><div class="rel" style="height:' + (i.v / max * 100) + '%"></div></div><span class="et">' + i.et + '</span></div>').join('') + '</div>';
  }

  /* Pares A/B para comparar periodos */
  function pares(filas, nA, nB) {
    const max = Math.max(1, ...filas.flatMap(f => [f.a, f.b]));
    const b = (v, c) => '<div style="height:12px;border-radius:3px;background:' + c + ';width:' + Math.max(v / max * 100, 4) + '%;color:#fff;font-size:10px;font-weight:700;text-align:right;padding-right:4px;line-height:12px">' + v + '</div>';
    return filas.map(f => '<div style="display:grid;grid-template-columns:140px 1fr;gap:8px;align-items:center;margin:9px 0;font-size:12px"><span>' + f.et + '</span><div style="display:grid;gap:3px">' + b(f.a, COL.A) + b(f.b, COL.guinda) + '</div></div>').join('') +
      '<div class="leyenda"><span><i style="background:' + COL.A + '"></i>' + nA + '</span><span><i style="background:' + COL.guinda + '"></i>' + nB + '</span></div>';
  }

  window.G = { COL, barras, dona, linea, columnas, pares };
})();
