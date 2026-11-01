/* =====================================================================
   TABLERO COSECOVI ESCOM · CABECERA, PERIODO GLOBAL, ROLES Y PERMISOS
   - Rol: sale del usuario que inició sesión (localStorage); sin sesión se regresa al login
   - Periodo global: ?desde=2026-01&hasta=2026-12 (mes o rango de meses)
   - Zona global: ?zona=Accesos
   Los parámetros viajan entre pestañas para no perder el filtro (HU-12).
   ===================================================================== */
(function () {
  const s = p => '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  const ICON = {
    doc: s('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    ruta: s('<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4"/>'),
    escudo: s('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'),
    escudoOk: s('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
    grafica: s('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    candado: s('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    buscar: s('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
    filtro: s('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    alerta: s('<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 18h.01"/>'),
    reloj: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    carpeta: s('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    enviar: s('<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>'),
    check: s('<path d="M20 6L9 17l-5-5"/>'),
    usuario: s('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    usuarios: s('<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a7 7 0 0 1 4 6.5"/>'),
    comparar: s('<path d="M8 3v18M16 3v18M3 8h5M16 16h5"/>'),
    mapa: s('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
    tendencia: s('<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>'),
    calendario: s('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    descarga: s('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
    mas: s('<path d="M12 5v14M5 12h14"/>'),
    corazon: s('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
    ojo: s('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    salir: s('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
    flecha: s('<path d="M5 12h14M13 6l6 6-6 6"/>')
  };

  /* Pestañas (7) */
  const VISTAS = [
    { id: 'general',         nombre: 'Vista general',                    archivo: '1_vista_general.html' },
    { id: 'delito',          nombre: 'Análisis por delito',              archivo: '2_analisis_delito.html' },
    { id: 'violentometro',   nombre: 'Violentómetro y Acosómetro',       archivo: '3_violentometro.html' },
    { id: 'recomendaciones', nombre: 'Recomendaciones',                  archivo: '4_recomendaciones.html' },
    { id: 'reportes',        nombre: 'Reportes',                         archivo: '5_reportes.html' },
    { id: 'inspeccion',      nombre: 'Inspección de casos particulares', archivo: '6_inspeccion.html' },
    { id: 'auditoria',       nombre: 'Bitácora automática',              archivo: '7_bitacora_automatica.html' }
  ];
  /* Permisos por rol. Presidente: todo (consulta, captura, canaliza, cierra y bitácora automática). Coordinador: todo menos la bitácora automática. Vocal: Agregar reporte, Inspección (solo consulta) y Violentómetro. */
  const ROLES = {
    presidente:  { nombre: 'Presidente',     clave: 'PRES-01',  vistas: VISTAS.map(v => v.id), captura: true, gestiona: true },
    coordinador: { nombre: 'Coordinador',    clave: 'COORD-01', vistas: VISTAS.map(v => v.id).filter(i => i !== 'auditoria'), captura: true, gestiona: true },
    vocal:       { nombre: 'Vocal de apoyo', clave: 'VOC-01',   vistas: ['reportes', 'inspeccion', 'violentometro'], captura: true, gestiona: false }
  };

  const P = new URLSearchParams(location.search);
  /* Sin sesión iniciada no se entra: regresa al inicio de sesión */
  const SES = M.sesion();
  if (!SES || !ROLES[SES.rol]) { location.replace('../index.html'); throw new Error('Sin sesión'); }
  const MESES = M.MESES_DATOS, ULT = MESES[MESES.length - 1];
  const estado = {
    rol: SES.rol,
    desde: MESES.includes(P.get('desde')) ? P.get('desde') : MESES[0],
    hasta: MESES.includes(P.get('hasta')) ? P.get('hasta') : ULT,
    zona: M.ZONAS.includes(P.get('zona')) ? P.get('zona') : ''
  };
  if (estado.desde > estado.hasta) estado.hasta = estado.desde;
  const ROL = Object.assign({}, ROLES[estado.rol], { clave: SES.usuario });
  const oyentes = [];

  function query() {
    const q = new URLSearchParams();
    if (estado.desde !== MESES[0] || estado.hasta !== ULT) { q.set('desde', estado.desde); q.set('hasta', estado.hasta); }
    if (estado.zona) q.set('zona', estado.zona);
    const t = q.toString(); return t ? '?' + t : '';
  }
  function sincronizar() {
    history.replaceState(null, '', location.pathname + query());
    document.querySelectorAll('.cab-tab').forEach(a => a.href = a.dataset.archivo + query());
  }

  function aviso(txt) {
    let a = document.querySelector('.aviso');
    if (!a) { a = document.createElement('div'); a.className = 'aviso'; document.body.appendChild(a); }
    a.textContent = txt; a.classList.add('ver'); clearTimeout(a._t); a._t = setTimeout(() => a.classList.remove('ver'), 2800);
  }

  /* Barra de periodo: mes o rango de meses, atajos 1/3/6/12 y zona */
  function barraPeriodo() {
    const opt = sel => MESES.map(m => '<option value="' + m + '"' + (m === sel ? ' selected' : '') + '>' + M.u.nombreMes(m) + '</option>').join('');
    const esMes = estado.desde === estado.hasta;
    const n = M.mesesEntre(estado.desde, estado.hasta).length;
    return '<div class="periodo"><div class="periodo-in">' +
      '<span class="et">PERIODO</span>' +
      '<div class="seg" id="g-modo"><button data-m="mes" class="' + (esMes ? 'on' : '') + '">Mes</button><button data-m="rango" class="' + (esMes ? '' : 'on') + '">Rango de meses</button></div>' +
      '<div class="grupo" id="g-mes"' + (esMes ? '' : ' hidden') + '><select id="g-unmes" aria-label="Mes">' + opt(estado.hasta) + '</select></div>' +
      '<div class="grupo" id="g-rango"' + (esMes ? ' hidden' : '') + '>Desde <select id="g-desde" aria-label="Desde">' + opt(estado.desde) + '</select> hasta <select id="g-hasta" aria-label="Hasta">' + opt(estado.hasta) + '</select></div>' +
      '<div class="atajos" id="g-atajos">' + [1, 3, 6, 12].map(k => '<button data-k="' + k + '" class="' + ((estado.hasta === ULT && (k === n || (k === 12 && n === MESES.length))) ? 'on' : '') + '">' + k + (k === 1 ? ' mes' : '') + '</button>').join('') + '</div>' +
      '<span class="et" style="margin-left:8px">ZONA</span><select id="g-zona" aria-label="Zona"><option value="">Todas las zonas</option>' + M.ZONAS.map(z => '<option' + (z === estado.zona ? ' selected' : '') + '>' + z + '</option>').join('') + '</select>' +
      '<span class="actual"><span class="punto-verde"></span>Actualizado: 31 dic 2026</span>' +
      '</div></div>';
  }
  function cambiarPeriodo(desde, hasta, zona) {
    estado.desde = desde; estado.hasta = hasta < desde ? desde : hasta; if (zona !== undefined) estado.zona = zona;
    const vieja = document.querySelector('.periodo'); vieja.insertAdjacentHTML('afterend', barraPeriodo()); vieja.remove();
    enlazarPeriodo(); sincronizar(); oyentes.forEach(f => f(filtroGlobal()));
  }
  function enlazarPeriodo() {
    const $ = id => document.getElementById(id);
    $('g-modo').querySelectorAll('button').forEach(b => b.onclick = () => {
      if (b.dataset.m === 'mes') cambiarPeriodo(estado.hasta, estado.hasta);
      else { const i = MESES.indexOf(estado.hasta); cambiarPeriodo(MESES[Math.max(0, i - 2)], estado.hasta); }
    });
    $('g-unmes').onchange = e => cambiarPeriodo(e.target.value, e.target.value);
    $('g-desde').onchange = e => cambiarPeriodo(e.target.value, $('g-hasta').value);
    $('g-hasta').onchange = e => cambiarPeriodo($('g-desde').value, e.target.value);
    $('g-zona').onchange = e => cambiarPeriodo(estado.desde, estado.hasta, e.target.value);
    $('g-atajos').querySelectorAll('button').forEach(b => b.onclick = () => {
      const k = +b.dataset.k, i = MESES.length - k;
      if (i < 0) aviso('Hay datos desde enero de 2026.');
      cambiarPeriodo(MESES[Math.max(0, i)], ULT);
    });
  }
  const filtroGlobal = () => ({ desde: estado.desde, hasta: estado.hasta, zona: estado.zona });

  /* Dibuja cabecera + barra de periodo; devuelve true si el rol puede ver la vista */
  function cabecera(vista) {
    const tabs = ROL.vistas.map(id => {
      const v = VISTAS.find(x => x.id === id);
      const nombre = (estado.rol === 'vocal' && id === 'reportes') ? 'Agregar reporte' : v.nombre;
      return '<a class="cab-tab' + (id === vista ? ' activa' : '') + '" data-archivo="' + v.archivo + '" href="' + v.archivo + query() + '"><span>' + nombre + '</span></a>';
    }).join('');
    document.body.insertAdjacentHTML('afterbegin',
      '<header class="cab"><div class="cab-top"><div class="cab-logo">IPN</div>' +
      '<div class="cab-txt"><small>COSECOVI · ESCOM · IPN</small><strong>Tablero de seguridad</strong></div>' +
      '<div class="cab-der"><div class="cab-rol">' + ICON.usuario + '<b>' + ROL.nombre + '</b> · ' + ROL.clave + '</div>' +
      '<a class="cab-salir" href="../index.html">Cerrar sesión</a></div></div>' +
      '<nav class="cab-tabs">' + tabs + '</nav></header>' + barraPeriodo());
    document.body.insertAdjacentHTML('beforeend', '<footer class="pie"><span>Comisión de Seguridad y Contra la Violencia · ESCOM</span><span>Información ficticia para fines de visualización · <a href="#" id="restablecer">Restablecer prototipo</a></span></footer>');
    document.getElementById('restablecer').onclick = e => { e.preventDefault(); M.restablecer(); location.reload(); };
    document.querySelector('.cab-salir').onclick = () => { M.evento(ROL.clave, 'Cierre de sesión', '—', 'Salida voluntaria'); M.sesion(null); };
    /* La sesión expira a los 15 min sin actividad */
    let tInact; const reinicia = () => { clearTimeout(tInact); tInact = setTimeout(() => { M.evento(ROL.clave, 'Sesión expirada', '—', '15 min sin actividad', 'Cerrada'); M.sesion(null); location.href = '../index.html?expirada=1'; }, 15 * 60 * 1000); };
    ['click', 'keydown', 'mousemove', 'scroll'].forEach(ev => document.addEventListener(ev, reinicia, { passive: true })); reinicia();
    enlazarPeriodo();
    const ok = ROL.vistas.includes(vista);
    if (!ok) {
      const v = VISTAS.find(x => x.id === vista);
      M.evento(ROL.clave, 'Intento de abrir vista', v.nombre, 'Vista fuera del rol', 'Denegado');
      document.querySelector('.pagina').innerHTML = '<div class="tarjeta denegado"><div class="ico">' + ICON.candado + '</div><h1>Acceso denegado</h1>' +
        '<p>Tu rol (' + ROL.nombre + ') no tiene permiso para abrir la vista ' + v.nombre + '.</p>' +
        '<p class="nota" style="justify-content:center">' + ICON.escudo + ' El intento quedó registrado en la bitácora automática.</p></div>';
    }
    if (ok) { M.evento(ROL.clave, 'Apertura de vista', VISTAS.find(x => x.id === vista).nombre, 'Periodo ' + M.u.nombrePeriodo(estado.desde, estado.hasta) + (estado.zona ? ' · ' + estado.zona : '')); rastrear(VISTAS.find(x => x.id === vista).nombre); }
    return ok;
  }

  /* ---------- Rastreo detallado para la bitácora automática ----------
     Registra cada clic en botones, enlaces, pestañas, filas, puntos del mapa
     y cada cambio de filtro o campo, con usuario, rol, fecha y hora.
     Los campos con datos sensibles se registran sin su valor. */
  const SENSIBLES = ['desc', 'pers', 'f-persona', 'qexp', 'calle', 'entre', 'ref', 'col', 'm-que', 'm-ac', 'pwd'];
  const limpio = t => (t || '').replace(/\s+/g, ' ').trim().slice(0, 70);
  function etiquetaCampo(el) {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
    const c = el.closest('.campo'), l = (el.labels && el.labels[0]) || (c && c.querySelector('label'));
    return limpio(l ? l.textContent.replace('Dato cifrado', '') : el.id || el.name || el.type);
  }
  function rastrear(nombreVista) {
    document.addEventListener('click', e => {
      if (e.target.matches('input')) return;
      const el = e.target.closest('button, a, tr.clic, .pt, .barra, label.canal, label.interruptor');
      if (!el || el.matches('input') || el.classList.contains('cab-salir') || el.id === 'restablecer') return;
      let accion = 'Clic en botón', det = limpio(el.innerText || el.textContent);
      if (el.classList.contains('cab-tab')) accion = 'Cambio de pestaña';
      else if (el.tagName === 'A') accion = 'Clic en enlace';
      else if (el.matches('tr.clic')) { accion = 'Selección en tabla'; det = el.dataset.id; }
      else if (el.matches('.pt')) { accion = 'Clic en punto del mapa'; det = M.DATOS.lugares[el.dataset.lug].nombre; }
      else if (el.matches('.barra')) accion = 'Clic en gráfica';
      else if (el.matches('label')) accion = 'Clic en casilla';
      if (el.disabled) accion += ' (deshabilitado)';
      M.evento(ROL.clave, accion, nombreVista, det || '(sin texto)');
    }, true);
    document.addEventListener('change', e => {
      const el = e.target; if (!el.matches('select, input, textarea')) return;
      let val = el.tagName === 'SELECT' ? (el.selectedOptions[0] || {}).text : el.type === 'checkbox' ? (el.checked ? 'activado' : 'desactivado') : el.value;
      if (SENSIBLES.includes(el.id)) val = '(valor no registrado por privacidad)';
      M.evento(ROL.clave, el.closest('.periodo') ? 'Cambio de periodo o zona' : el.closest('.panel') ? 'Cambio de filtro' : 'Captura de campo', nombreVista, etiquetaCampo(el) + ': ' + (val === '' ? 'vacío / todos' : limpio(val)));
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input[type=text], input:not([type])') && !SENSIBLES.includes(e.target.id) && e.target.value) M.evento(ROL.clave, 'Búsqueda', nombreVista, etiquetaCampo(e.target) + ': ' + limpio(e.target.value)); }, true);
  }

  /* Encabezado de cada vista (estilo del prototipo) */
  function encabezado(icono, kicker, titulo, sub, derecha) {
    return '<div class="enc"><div><div class="kicker">' + ICON[icono] + kicker + '</div><h1>' + titulo + '</h1><p>' + sub + '</p></div>' +
      '<div class="enc-der">' + (derecha || '') + '</div></div>';
  }
  const restringida = () => '<span class="chip-restr">' + ICON.candado + 'Vista restringida · ' + ROL.nombre + '</span>';

  /* Piezas reutilizables */
  const claseFase = f => f === 'Cerrado' ? 'f-cerrado' : f === 'Canalizado' ? 'f-canalizado' : 'f-atencion';
  const chipFase = f => '<span class="chip ' + claseFase(f) + '">' + f + '</span>';
  const chipNivel = n => '<span class="chip np ' + (n === 'Alto' ? 'n-alto' : n === 'Medio' ? 'n-medio' : 'n-bajo') + '">' + (n === 'Alto' ? '<span class="ic-rojo">!</span>' : n === 'Medio' ? '<span class="ic-amar">▲</span>' : '') + n + '</span>';
  const icSem = s => s === 'Rojo' ? '<span class="ic-rojo">!</span>' : '<span class="ic-amar">▲</span>';
  const sem = (s, txt) => '<span class="sem">' + icSem(s) + (txt || s) + '</span>';
  const kpi = (ico, cls, tit, val, sub, borde) => '<div class="tarjeta kpi ' + (borde || '') + '"><div class="kpi-ico ' + cls + '">' + ICON[ico] + '</div><div><small>' + tit + '</small><b>' + val + '</b>' + (sub ? '<em>' + sub + '</em>' : '') + '</div></div>';
  const panelTit = (k, t, ico) => '<div class="panel-tit"><div class="ico">' + ICON[ico || 'filtro'] + '</div><div><small>' + k + '</small><span>' + t + '</span></div></div>';
  const opts = (arr, sel, todos) => (todos ? '<option value="">' + todos + '</option>' : '') + arr.map(x => { const v = Array.isArray(x) ? x[0] : x, t = Array.isArray(x) ? x[1] : x; return '<option value="' + v + '"' + (v === sel ? ' selected' : '') + '>' + t + '</option>'; }).join('');
  const tarjetaG = (kick, tit, cuerpo, extra, sub) => '<section class="tarjeta"><div class="tit"><div><small>' + kick + '</small><h2>' + tit + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (extra || '') + '</div><div class="cuerpo">' + cuerpo + '</div></section>';
  function modal(titulo, cuerpo, acciones) {
    const v = document.createElement('div'); v.className = 'velo';
    v.innerHTML = '<div class="modal"><h3>' + titulo + '<button class="x" data-cerrar>×</button></h3><div class="cuerpo">' + cuerpo + '</div><div class="acciones">' + (acciones || '') + '</div></div>';
    document.body.appendChild(v);
    v.addEventListener('click', e => { if (e.target === v || e.target.hasAttribute('data-cerrar')) v.remove(); });
    return v;
  }
  function paginar(cont, total, porPag, pag, alCambiar) {
    const n = Math.max(1, Math.ceil(total / porPag));
    let h = '<button ' + (pag === 1 ? 'disabled' : '') + ' data-p="' + (pag - 1) + '">‹</button>';
    for (let i = 1; i <= n; i++) h += '<button class="' + (i === pag ? 'on' : '') + '" data-p="' + i + '">' + i + '</button>';
    h += '<button ' + (pag === n ? 'disabled' : '') + ' data-p="' + (pag + 1) + '">›</button>';
    cont.innerHTML = h; cont.querySelectorAll('button').forEach(b => b.onclick = () => alCambiar(+b.dataset.p));
  }

  /* Enlace a otra pestaña conservando periodo, zona y rol; null si el rol no la puede abrir */
  function enlace(vista, extra) {
    if (!ROL.vistas.includes(vista)) return null;
    const v = VISTAS.find(x => x.id === vista), q = new URLSearchParams(query().slice(1));
    Object.keys(extra || {}).forEach(k => { if (extra[k] !== undefined && extra[k] !== '') q.set(k, extra[k]); });
    const t = q.toString(); return v.archivo + (t ? '?' + t : '');
  }
  const ir = (vista, extra, texto, cls) => { const h = enlace(vista, extra); return h ? '<a class="' + (cls || 'ir') + '" href="' + h + '">' + texto + '</a>' : ''; };

  window.UI = {
    enlace, ir,
    ICON, ROL, rol: estado.rol, cabecera, encabezado, restringida, filtroGlobal, alCambiarPeriodo: f => oyentes.push(f), aviso,
    chipFase, chipNivel, claseFase, icSem, sem, kpi, panelTit, opts, tarjetaG, modal, paginar,
    periodoTexto: () => M.u.nombrePeriodo(estado.desde, estado.hasta) + (estado.zona ? ' · ' + estado.zona : '')
  };
})();
