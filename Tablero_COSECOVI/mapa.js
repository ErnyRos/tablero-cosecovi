/* =====================================================================
   TABLERO COSECOVI ESCOM · PLANO ESQUEMÁTICO (SVG, funciona sin internet)
   No está a escala. Las coordenadas de cada lugar viven en datos.js.
   ===================================================================== */
(function () {
  const W = 1000, H = 600;
  const calle = (x, y, w, h) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fff" stroke="#d9d6d8"/>';
  const txt = (x, y, t, o) => '<text x="' + x + '" y="' + y + '" font-size="' + ((o && o.fs) || 15) + '" fill="' + ((o && o.c) || '#7d7378') + '" text-anchor="' + ((o && o.a) || 'middle') + '"' + (o && o.rot ? ' transform="rotate(' + o.rot + ' ' + x + ' ' + y + ')"' : '') + (o && o.b ? ' font-weight="700"' : '') + '>' + t + '</text>';
  const edif = (x, y, w, h, t, f) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + (f || '#ddd7da') + '" stroke="#c4bbc0"/>' + txt(x + w / 2, y + h / 2 + 5, t, { fs: 14, c: '#5f565b', b: 1 });

  /* Calle como banda con borde (puntos de una polilínea) */
  const via = (pts, ancho, color) => '<polyline points="' + pts + '" fill="none" stroke="#cfcacd" stroke-width="' + (ancho + 3) + '" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<polyline points="' + pts + '" fill="none" stroke="' + (color || '#fff') + '" stroke-width="' + ancho + '" stroke-linejoin="round" stroke-linecap="round"/>';
  const manzana = (x, y, w, h, f) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="' + (f || '#e3e1df') + '"/>';
  const poli = (pts, f, st) => '<polygon points="' + pts + '" fill="' + f + '"' + (st ? ' stroke="' + st + '"' : '') + '/>';

  /* Edificio girado (el plantel real está inclinado ~35°) */
  const edifR = (cx, cy, w, h, ang, t, f, fs) => '<g transform="translate(' + cx + ',' + cy + ') rotate(' + ang + ')"><rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="3" fill="' + (f || '#d9d2d5') + '" stroke="#c4bbc0"/>' +
    (t ? '<text x="0" y="4" font-size="' + (fs || 10.5) + '" font-weight="700" fill="#5f565b" text-anchor="middle">' + t + '</text>' : '') + '</g>';

  /* Geometría trazada sobre OpenStreetMap (zoom 17, centro 19.5040, -99.1472). Norte arriba. 100 m ≈ 81 unidades. */
  function base() {
    let m = '<rect width="' + W + '" height="' + H + '" fill="#f2efe9"/>' +
      '<defs><pattern id="rayas" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#e6e2e4"/><line x1="0" y1="0" x2="0" y2="8" stroke="#d6d0d3" stroke-width="3"/></pattern>' +
      '<radialGradient id="cr"><stop offset="0" stop-color="#c62f3a" stop-opacity=".75"/><stop offset="1" stop-color="#c62f3a" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="ca"><stop offset="0" stop-color="#f0a400" stop-opacity=".8"/><stop offset="1" stop-color="#f0b400" stop-opacity="0"/></radialGradient></defs>';
    /* Usos de suelo del entorno */
    m += poli('0,0 760,0 512,94 362,150 175,206 0,269', '#ebe6ee') +                       // colonias al norte (Torres Lindavista, Hectómetro)
         poli('0,300 60,270 160,560 0,600', '#ece7ef') +                                    // Col. Hectómetro Vallejo (poniente)
         poli('250,240 380,185 420,300 360,420 270,420', '#f0e6ee') +                       // manzana entre Eje Central y Neptuno
         poli('587,62 790,30 870,40 875,181 690,181 600,128', '#ddd6d9') +                  // Plaza Torres Lindavista
         poli('900,0 1000,0 1000,240 900,230', '#e9e4e6') +                                 // Centro de Investigación en Computación (norte)
         poli('420,380 690,330 1000,270 1000,600 330,600', '#f7f2dc') +                     // Unidad Profesional Zacatenco (sur y oriente)
         poli('75,487 287,470 300,600 75,600', '#f7f2dc');                                  // Colegio de Bachilleres Pl. 2
    m += edifR(672, 272, 44, 80, -15, '', '#9fd8b8') + edifR(745, 300, 56, 82, -15, '', '#9fd8b8') + edifR(640, 368, 50, 58, -15, '', '#9fd8b8') +   // canchas
         edifR(718, 420, 70, 52, -15, '', '#e2e2e2') + edifR(866, 500, 55, 115, -12, 'Tiro con arco', '#9fd8b8', 9);
    m += edifR(462, 418, 70, 46, -20, 'CIC', '#ddd6d9') + edifR(530, 446, 46, 30, -20, 'CIDETEC', '#ddd6d9', 9) + edifR(412, 495, 66, 36, -20, 'CENDI', '#ddd6d9', 9) +
         edifR(610, 520, 90, 70, -20, 'Composta', '#efe0ea', 9);
    /* Vialidades reales */
    m += via('-20,276 175,206 362,150 512,94 650,44 790,-6', 40) +                          // Av. Miguel Othón de Mendizábal
         '<polyline points="-20,256 175,186 362,130 512,74 650,24" fill="none" stroke="#bfe3c4" stroke-width="9" opacity=".9"/>' +  // camellón
         via('512,98 600,146 675,194 775,224 875,244 1010,252', 30) +                        // Av. Juan de Dios Bátiz
         via('362,156 390,240 400,281 337,312 250,350', 14) +                                // Calle Neptuno
         via('70,40 137,225 225,412 315,610', 30, '#f8dca9') + via('105,30 172,222 258,405 345,610', 22, '#f8dca9') +  // Av. Lázaro Cárdenas (Eje Central)
         via('662,219 600,360 550,500', 12) +                                                // vialidad interna al oriente
         via('431,362 520,395 600,425', 10) +                                                // Corredor Computacional IPN
         via('962,0 875,244', 12) +                                                          // Calle María Luisa Stampa Ortigoza
         '<polyline points="875,256 790,380 750,462 800,600" fill="none" stroke="#b05080" stroke-width="2.5" stroke-dasharray="7 6" opacity=".7"/>';  // Trotapista / ciclovía IPN
    /* Plantel ESCOM (límite del predio) */
    m += poli('519,125 669,200 644,312 552,381 500,369 431,312 462,225', '#fbf6e4', '#6e1538').replace('/>', ' stroke-width="3" stroke-dasharray="1 0"/>');
    m += edifR(548, 180, 62, 22, 35, 'Gestión Escolar', '#d9d2d5', 9) + edifR(586, 194, 26, 18, 35, '', '#d9d2d5') +
         edifR(500, 256, 66, 22, 55, 'Edificio 1', '#d9d2d5', 9.5) + edifR(553, 283, 66, 22, 55, 'Edificio 2', '#d9d2d5', 9.5) +
         edifR(528, 226, 30, 46, 35, '', '#e9f0dc') +                                       // explanada (áreas verdes)
         edifR(526, 305, 60, 20, 35, 'Laboratorios', '#d9d2d5', 9) + edifR(497, 330, 52, 18, 35, 'Edificio 3', '#d9d2d5', 9) + edifR(530, 350, 52, 18, 35, 'Edificio 4', '#d9d2d5', 9) +
         edifR(466, 344, 30, 24, 35, '', '#9fd8b8') + edifR(437, 306, 18, 18, 0, '', '#e0d8c0') +
         edifR(623, 270, 30, 92, 18, '', 'url(#rayas)');
    /* Radios de consideración: 200 m y 500 m alrededor de ESCOM */
    m += '<circle cx="545" cy="270" r="162" fill="none" stroke="#6e1538" stroke-width="1.6" stroke-dasharray="4 5" opacity=".55"/>' +
         '<circle cx="545" cy="270" r="406" fill="none" stroke="#6e1538" stroke-width="2" stroke-dasharray="9 7" opacity=".5"/>' +
         txt(545, 102, '200 m', { fs: 11, c: '#6e1538', b: 1 }) + txt(545, 462, '← radio de 500 m →', { fs: 10, c: '#6e1538', b: 1 });
    /* Nombres de calles y referencias reales */
    m += txt(300, 160, 'Av. Miguel Othón de Mendizábal', { rot: -19, fs: 12.5, c: '#4f474b', b: 1 }) +
         txt(790, 222, 'Av. Juan de Dios Bátiz', { rot: 7, fs: 12.5, c: '#4f474b', b: 1 }) + txt(600, 140, 'Av. Juan de Dios Bátiz', { rot: 30, fs: 11, c: '#4f474b' }) +
         txt(375, 205, 'Calle Neptuno', { rot: 73, fs: 11.5, c: '#4f474b' }) + txt(300, 322, 'Calle Neptuno', { rot: -25, fs: 11.5, c: '#4f474b' }) +
         txt(214, 330, 'Eje Central Lázaro Cárdenas', { rot: 66, fs: 11.5, c: '#7a5a1e', b: 1 }) +
         txt(515, 402, 'Corredor Computacional IPN', { rot: 20, fs: 10.5, c: '#5f565b' }) +
         txt(905, 120, 'María Luisa Stampa Ortigoza', { rot: -70, fs: 9.5, c: '#5f565b' }) +
         txt(782, 410, 'Trotapista IPN', { rot: -60, fs: 9.5, c: '#a3245f' }) +
         txt(735, 120, 'Plaza Torres Lindavista', { fs: 12, c: '#8a8085', b: 1 }) +
         
         txt(300, 80, 'Col. Torres Lindavista', { fs: 11, c: '#9a9195' }) + txt(232, 450, 'Col. Hectómetro Vallejo', { fs: 10.5, c: '#9a9195' }) +
         txt(180, 540, 'Colegio de Bachilleres 2', { fs: 11, c: '#8a8085' }) + txt(790, 360, 'Unidad Profesional Zacatenco', { fs: 11, c: '#8a8a70', b: 1 }) +
         txt(575, 236, 'ESCOM', { fs: 13, c: '#6e1538', b: 1 });
    m += '<g transform="translate(330,175)"><rect x="-34" y="-10" width="68" height="19" rx="9" fill="#fff" stroke="#d24f8a"/>' + txt(0, 4, 'Metrobús', { fs: 10, c: '#a3245f', b: 1 }) + '</g>' +
         '<g transform="translate(318,455)"><rect x="-58" y="-11" width="116" height="20" rx="10" fill="#fff" stroke="#f0a400"/>' + txt(0, 3, '↓ Metro Politécnico', { fs: 10, c: '#7a5a1e', b: 1 }) + '</g>';
    /* Norte, escala y fuente */
    m += '<g transform="translate(208,82)"><circle r="17" fill="#fff" stroke="#bdb3b8"/><path d="M0,-11 L6,6 L0,2 L-6,6Z" fill="#2a2326"/>' + txt(0, -20, 'N', { fs: 11, c: '#2a2326', b: 1 }) + '</g>' +
         '<g transform="translate(770,458)"><rect x="-6" y="-24" width="105" height="30" rx="4" fill="#fff" opacity=".85"/><line x1="0" y1="-6" x2="81" y2="-6" stroke="#5f565b" stroke-width="2"/><line x1="0" y1="-10" x2="0" y2="-2" stroke="#5f565b" stroke-width="2"/><line x1="81" y1="-10" x2="81" y2="-2" stroke="#5f565b" stroke-width="2"/></g>' +
         txt(810, 445, '100 m', { fs: 10.5, c: '#5f565b' }) +
         txt(872, 64, 'Trazado sobre OpenStreetMap', { a: 'end', fs: 10, c: '#8a8085' });
    return m;
  }

  /* lista: reportes ya filtrados. opc: {modo:'calor'|'puntos', etiquetas, sel, alSeleccionar(lug)} */
  function plano(cont, lista, opc) {
    opc = opc || {};
    const L = M.DATOS.lugares, grupos = {};
    lista.forEach(r => { (grupos[r.lug] = grupos[r.lug] || []).push(r); });
    const ids = Object.keys(grupos).filter(id => L[id].x !== null);
    const digitales = lista.filter(r => L[r.lug].x === null).length;
    let capa = '';
    ids.forEach(id => {
      const rs = grupos[id], n = rs.length, rojo = rs.filter(r => r.semaforo === 'Rojo').length >= n / 2, l = L[id];
      if (opc.modo === 'calor') capa += '<circle cx="' + l.x + '" cy="' + l.y + '" r="' + (26 + 11 * Math.sqrt(n)) + '" fill="url(#' + (rojo ? 'cr' : 'ca') + ')"/>';
    });
    ids.sort((a, b) => grupos[a].length - grupos[b].length).forEach(id => {
      const rs = grupos[id], n = rs.length, rojo = rs.filter(r => r.semaforo === 'Rojo').length >= n / 2, l = L[id], on = opc.sel === id;
      const r = opc.modo === 'calor' ? 7 : 8 + Math.min(4, n / 3);
      capa += '<g class="pt" data-lug="' + id + '" style="cursor:pointer">' +
        (on ? '<circle cx="' + l.x + '" cy="' + l.y + '" r="' + (r + 4) + '" fill="none" stroke="#2a2326" stroke-width="2"/>' : '') +
        (rojo ? '<circle cx="' + l.x + '" cy="' + l.y + '" r="' + r + '" fill="#c62f3a" stroke="#fff" stroke-width="2"/>' + '<text x="' + l.x + '" y="' + (l.y + r * .42) + '" font-size="' + (opc.modo === 'calor' ? r * 1.3 : r * 1.05) + '" font-weight="900" fill="#fff" text-anchor="middle">' + (opc.modo === 'calor' ? '!' : n) + '</text>'
          : '<path d="M' + l.x + ' ' + (l.y - r - 1) + ' L' + (l.x + r + 2) + ' ' + (l.y + r - 1) + ' L' + (l.x - r - 2) + ' ' + (l.y + r - 1) + 'Z" fill="#e9b300" stroke="#fff" stroke-width="1.5"/><text x="' + l.x + '" y="' + (l.y + r - 2) + '" font-size="' + (opc.modo === 'calor' ? r * .9 : r * .95) + '" font-weight="900" fill="#3a2a00" text-anchor="middle">' + (opc.modo === 'calor' ? '▲' : n) + '</text>') +
        (opc.etiquetas && l.ambito === 'Externo' ? (() => { const pz = l.nombre.split(',')[0].split(' · '), corto = (({ ipn: 'Plaza Torres Lindavista', mab: 'Neptuno, barda poniente', jdb: 'Bátiz, paradero', mmz: 'Mendizábal, paradero', wma: 'Eje Central, área verde' })[id] || (pz.length > 2 ? pz[0] + ' · ' + pz[2] : pz[0])) + ' · ' + n, w = corto.length * 6 + 16;
          /* Posición de la etiqueta por lugar para que no se encimen */
          const P = { gob: 'arriba', e1a: 'izq', e1p: 'izq', e2a: 'der', e2p: 'der', exp: 'arribaIzq', e3p: 'izq', e4p: 'abajo', caf: 'izq', est: 'der', acc: 'der', dep: 'der', jdb: 'arriba', mmz: 'arriba', nep: 'izq', mab: 'izq', wma: 'der', ipn: 'arriba' }[id] || (l.x > 760 ? 'izq' : 'der');
          const x0 = P === 'izq' || P === 'arribaIzq' ? l.x - r - 4 - w : P === 'arriba' || P === 'abajo' ? l.x - w / 2 : l.x + r + 4;
          const y0 = P === 'arriba' || P === 'arribaIzq' ? l.y - r - 24 : P === 'abajo' ? l.y + r + 4 : l.y - 10;
          return '<g transform="translate(' + x0 + ',' + y0 + ')"><rect width="' + w + '" height="20" rx="10" fill="#fff" stroke="#bdb3b8" opacity=".95"/><text x="8" y="14" font-size="10.5" font-weight="700" fill="#2a2326">' + corto + '</text></g>'; })() : '') +
        '<title>' + l.nombre + ': ' + n + ' incidentes</title></g>';
    });
    cont.innerHTML = '<svg viewBox="180 50 700 420" width="100%" style="display:block;border-radius:8px">' + base() + capa + '</svg>' +
      (digitales ? '<p class="nota" style="margin:6px 2px 0">' + UI.ICON.alerta + digitales + ' incidentes por medio digital no se ubican en el plano.</p>' : '');
    cont.querySelectorAll('.pt').forEach(g => g.onclick = () => opc.alSeleccionar && opc.alSeleccionar(g.dataset.lug));
    return { lugares: ids.length, digitales, grupos };
  }

  window.MAPA = { plano };
})();
