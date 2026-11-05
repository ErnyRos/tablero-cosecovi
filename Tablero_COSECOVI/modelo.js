/* =====================================================================
   TABLERO COSECOVI ESCOM · MODELO (CÁLCULOS SOBRE datos.js)
   Catálogos, filtros, métricas, ruta del caso, Acuerdo y bitácora.
   Ninguna cifra se escribe a mano en las vistas: todo sale de aquí.
   ===================================================================== */
(function () {
  const D = window.DATOS;

  /* ---------- Catálogos ---------- */
  const TIPOS = ['Robo sin violencia', 'Robo con violencia', 'Extorsión', 'Acoso', 'Ciberacoso', 'Consumo de alcohol o drogas', 'Violencia (riña o agresión)'];
  const CORTO = { 'Consumo de alcohol o drogas': 'Delitos contra la salud', 'Violencia (riña o agresión)': 'Violencia' };
  const GRUPOS = {
    'Robos con o sin violencia': ['Robo sin violencia', 'Robo con violencia'],
    'Extorsión': ['Extorsión'], 'Acoso': ['Acoso'], 'Ciberacoso': ['Ciberacoso'],
    'Delitos contra la salud': ['Consumo de alcohol o drogas'], 'Violencia': ['Violencia (riña o agresión)']
  };
  const DESC_GRUPO = {
    'Robos con o sin violencia': 'Reportes de sustracción de pertenencias con o sin uso de fuerza dentro del plantel y en su entorno inmediato.',
    'Extorsión': 'Amenazas para obtener dinero o bienes, por llamada, mensajes o de forma presencial en el entorno del plantel.',
    'Acoso': 'Conductas de hostigamiento o acoso hacia integrantes de la comunidad en espacios físicos del plantel.',
    'Ciberacoso': 'Hostigamiento por medios digitales: grupos escolares, redes sociales o correo institucional.',
    'Delitos contra la salud': 'Consumo o posesión de alcohol, drogas u otras sustancias dentro del plantel o en su perímetro.',
    'Violencia': 'Riñas o agresiones físicas entre integrantes de la comunidad o con personas externas.'
  };
  const ZONAS = ['Accesos', 'Entorno exterior', 'Interior del plantel', 'Estacionamiento', 'Explanada', 'Área deportiva', 'Medios digitales'];
  const FASES = ['En atención COSECOVI', 'Canalizado', 'Cerrado'];
  const DESTINOS = { DG: 'COSECOVI Dirección General', CT: 'Consejo Técnico (Comisión de Honor)', SSC: 'SSC' };
  const DESTINO_CORTO = { DG: 'Dirección General', CT: 'Consejo Técnico', SSC: 'SSC' };
  const AFECTADOS = ['Alumno', 'Profesor', 'Personal', 'Externo'];
  /* Cómo ocurrió: la modalidad depende del tipo de la taxonomía (el Qué).
     Así no se repite lo que ya dice el tipo, por ejemplo «robo sin violencia» + «sin violencia». */
  const MODOS_TIPO = {
    'Robo sin violencia': ['Descuido o distracción', 'Pertenencia sin vigilancia', 'Sustracción de vehículo o autopartes', 'Otro'],
    'Robo con violencia': ['Amenaza verbal', 'Uso de fuerza física', 'Con arma', 'Otro'],
    'Extorsión': ['Llamada telefónica', 'Mensajes o redes sociales', 'Presencial', 'Otro'],
    'Acoso': ['Verbal', 'No verbal (gestos o miradas)', 'Físico', 'Otro'],
    'Ciberacoso': ['Grupo escolar de mensajería', 'Correo institucional', 'Redes sociales', 'Difusión de contenido', 'Otro'],
    'Consumo de alcohol o drogas': ['Consumo', 'Posesión', 'Distribución', 'Otro'],
    'Violencia (riña o agresión)': ['Riña entre personas', 'Agresión física', 'Con arma u objeto', 'Otro']
  };
  const MODOS = [...new Set(Object.values(MODOS_TIPO).flat())];
  const FRANJAS = ['00–03', '03–06', '06–09', '09–12', '12–15', '15–18', '18–21', '21–24'];
  const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const MES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const USUARIOS = { 'PRES-01': 'Presidente', 'COORD-01': 'Coordinador', 'VOC-01': 'Vocal de apoyo', 'VOC-02': 'Vocal de apoyo', Sistema: 'Sistema' };
  const EDIFICIOS = ['Edificio 1', 'Edificio 2', 'Edificio 3', 'Edificio 4', 'Edificio de Gobierno'];
  const PISOS = ['Planta baja', 'Piso 1', 'Piso 2', 'Piso 3'];
  const ESPACIOS = ['Aula 1001', 'Aula 2001', 'Aula 3001', 'Aula 4001', 'Lab. Ciencia de Datos 1', 'Lab. Ciencia de Datos 2', 'Lab. Redes y Circuitos', 'Lab. IA', 'Lab. Sistemas', 'Pasillo', 'Ventanillas'];

  /* Meses con datos: ene–dic 2026 */
  const MESES_DATOS = [];
  for (let m = 1; m <= 12; m++) MESES_DATOS.push('2026-' + String(m).padStart(2, '0'));

  /* ---------- Utilidades de fecha ---------- */
  const dos = n => String(n).padStart(2, '0');
  const aFecha = (f, h) => new Date(f + 'T' + (h || '00:00') + ':00');
  const sumaMin = (d, m) => new Date(d.getTime() + m * 60000);
  const iso = d => d.getFullYear() + '-' + dos(d.getMonth() + 1) + '-' + dos(d.getDate());
  const hhmm = d => dos(d.getHours()) + ':' + dos(d.getMinutes());
  const fmtF = f => { const d = typeof f === 'string' ? aFecha(f) : f; return dos(d.getDate()) + ' ' + MES_C[d.getMonth()] + ' ' + d.getFullYear(); };
  const fmtFC = f => { const d = typeof f === 'string' ? aFecha(f) : f; return dos(d.getDate()) + ' ' + MES_C[d.getMonth()]; };
  const fmtFH = d => fmtF(d) + ', ' + hhmm(d);
  const fmtDur = m => m < 60 ? m + ' min' : (Math.round(m / 6) / 10) + ' h';
  const nombreMes = ym => MESES[+ym.slice(5, 7) - 1] + ' ' + ym.slice(0, 4);
  const mesCorto = ym => MES_C[+ym.slice(5, 7) - 1];
  const nombrePeriodo = (desde, hasta) => desde === hasta ? nombreMes(desde) : MES_C[+desde.slice(5) - 1] + ' — ' + MES_C[+hasta.slice(5) - 1] + ' ' + hasta.slice(0, 4);
  const franjaDe = h => Math.floor(+h.slice(0, 2) / 3);
  const diaDe = f => (aFecha(f).getDay() + 6) % 7;
  const pct = (a, b) => b ? Math.round(a / b * 1000) / 10 : 0;
  const corto = t => CORTO[t] || t;
  const grupoDe = t => Object.keys(GRUPOS).find(g => GRUPOS[g].includes(t));

  /* ---------- Reportes (copia de trabajo: la captura agrega aquí en memoria) ---------- */
  const REPORTES = D.reportes.map(r => Object.assign({}, r));

  /* ---------- Memoria de la sesión del prototipo ----------
     Lo que el usuario captura o modifica (reportes nuevos, canalizaciones,
     cierres, eventos de la bitácora) se guarda en localStorage para que
     siga ahí al pasar de una pestaña a otra y al cerrar y volver a abrir el
     navegador. Solo se borra con «Restablecer prototipo» (pie de página). */
  const CLAVE = 'cosecovi_prototipo_v2';  /* cambia la versión si cambian los datos base */
  let S = { nuevos: [], cambios: {}, eventos: [], canales: null };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(CLAVE)) || {}); } catch (e) {}
  const guardarS = () => { try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) {} };
  S.nuevos.forEach(r => REPORTES.push(Object.assign({}, r)));
  Object.keys(S.cambios).forEach(cos => { const r = REPORTES.find(x => x.cos === cos); if (r) Object.assign(r, S.cambios[cos]); });
  /* Fecha y hora reales del equipo: todo lo que hacen los usuarios se registra con ellas */
  const ahora = () => new Date();
  function agregarReporte(r) { REPORTES.push(r); S.nuevos.push(r); guardarS(); }
  function modificar(cos, campos) { const r = REPORTES.find(x => x.cos === cos); Object.assign(r, campos); S.cambios[cos] = Object.assign(S.cambios[cos] || {}, campos); guardarS(); return r; }
  /* Los eventos se releen antes de escribir para no perder lo registrado en otra pestaña */
  const releerEventos = () => { try { const g = JSON.parse(localStorage.getItem(CLAVE)); if (g && Array.isArray(g.eventos) && g.eventos.length >= S.eventos.length) S.eventos = g.eventos; } catch (e) {} };
  function evento(usuario, accion, objeto, detalle, resultado) { releerEventos(); S.eventos.push({ d: new Date().toISOString(), usuario, accion, objeto: objeto || '—', detalle: detalle || '', resultado: resultado || 'Correcto' }); guardarS(); }
  function preferencia(k, v) { if (v === undefined) return S[k]; S[k] = v; guardarS(); }
  /* Sesión iniciada: el rol sale del usuario que entró, no del enlace */
  const CLAVE_SES = 'cosecovi_sesion';
  function sesion(v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(CLAVE_SES));
      if (v === null) localStorage.removeItem(CLAVE_SES); else localStorage.setItem(CLAVE_SES, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function restablecer() { try { localStorage.removeItem(CLAVE); } catch (e) {} }
  const expedientesDe = r => r.exps;

  /* Filtro general: periodo (ym desde/hasta), zona y criterios {campo: valor} */
  function filtrar(f) {
    f = f || {};
    return REPORTES.filter(r => {
      const ym = r.fecha.slice(0, 7);
      if (f.desde && ym < f.desde) return false;
      if (f.hasta && ym > f.hasta) return false;
      if (f.zona && r.zona !== f.zona) return false;
      if (f.lug && r.lug !== f.lug) return false;
      if (f.tipo && r.tipo !== f.tipo) return false;
      if (f.grupo && !GRUPOS[f.grupo].includes(r.tipo)) return false;
      if (f.semaforo && r.semaforo !== f.semaforo) return false;
      if (f.nivel && r.nivel !== f.nivel) return false;
      if (f.ambito && r.ambito !== f.ambito) return false;
      if (f.afectado && r.afectado !== f.afectado) return false;
      if (f.modo && r.modo !== f.modo) return false;
      if (f.fase && r.fase !== f.fase) return false;
      if (f.destino && (!r.canal || r.canal[0] !== f.destino)) return false;
      if (f.atencion && r.at[0] !== f.atencion) return false;
      if (f.franja !== undefined && f.franja !== '' && franjaDe(r.hora) !== +f.franja) return false;
      if (f.horaDesde && r.hora < f.horaDesde) return false;
      if (f.horaHasta && r.hora > f.horaHasta) return false;
      if (f.persona && !r.involucrado.toLowerCase().includes(f.persona.toLowerCase())) return false;
      return true;
    });
  }

  const contar = (lista, fn, claves) => { const c = {}; (claves || []).forEach(k => c[k] = 0); lista.forEach(r => { const k = fn(r); c[k] = (c[k] || 0) + 1; }); return c; };
  const mayor = obj => Object.keys(obj).reduce((a, b) => obj[b] > (obj[a] || -1) ? b : a, Object.keys(obj)[0]);

  /* Índice de riesgo (cálculo documentado, no es un modelo de ML)
     General: 100 × peso medio del semáforo (rojo = 1, amarillo = 0.6).
     Por delito: 100 × peso del semáforo × (0.5 + 0.5 × frecuencia / frecuencia del grupo más alto). */
  function indiceGeneral(lista) {
    if (!lista.length) return 0;
    return Math.round(100 * lista.reduce((s, r) => s + (r.semaforo === 'Rojo' ? 1 : .6), 0) / lista.length);
  }
  function indiceGrupo(grupo, lista) {
    const n = g => lista.filter(r => GRUPOS[g].includes(r.tipo)).length;
    const max = Math.max(1, ...Object.keys(GRUPOS).map(n));
    const peso = GRUPOS[grupo].some(t => ['Robo sin violencia', 'Robo con violencia', 'Extorsión', 'Acoso', 'Ciberacoso'].includes(t)) ? 1 : .6;
    return n(grupo) ? Math.round(100 * peso * (.5 + .5 * n(grupo) / max)) : 0;
  }
  const nivelIndice = i => i >= 70 ? 'Alto' : i >= 40 ? 'Medio' : 'Bajo';

  function metricas(lista) {
    const n = lista.length;
    const cerr = lista.filter(r => r.cierre), canal = lista.filter(r => r.canal);
    const franjas = contar(lista, r => FRANJAS[franjaDe(r.hora)], FRANJAS);
    const fc = mayor(franjas);
    const zonas = contar(lista, r => r.zona);
    const zonasTop = Object.keys(zonas).sort((a, b) => zonas[b] - zonas[a]).slice(0, 3);
    return {
      total: n,
      expedientes: new Set(lista.flatMap(expedientesDe)).size,
      rojos: lista.filter(r => r.semaforo === 'Rojo').length,
      amarillos: lista.filter(r => r.semaforo === 'Amarillo').length,
      alto: lista.filter(r => r.nivel === 'Alto').length,
      medio: lista.filter(r => r.nivel === 'Medio').length,
      enAtencion: lista.filter(r => r.fase === FASES[0]).length,
      canalizado: lista.filter(r => r.fase === FASES[1]).length,
      cerrado: cerr.length,
      pctCierre: pct(cerr.length, n),
      canalizados: canal.length,
      porDestino: { DG: canal.filter(r => r.canal[0] === 'DG').length, CT: canal.filter(r => r.canal[0] === 'CT').length, SSC: canal.filter(r => r.canal[0] === 'SSC').length },
      inmediata: lista.filter(r => r.at[0] === 'Inmediata').length,
      programada: lista.filter(r => r.at[0] === 'Programada').length,
      primeraAtencionH: n ? Math.round(lista.reduce((s, r) => s + r.at[1], 0) / n / 6) / 10 : 0,
      cierreDias: cerr.length ? Math.round(cerr.reduce((s, r) => s + (aFecha(r.cierre) - aFecha(r.fecha)) / 864e5, 0) / cerr.length * 10) / 10 : 0,
      interno: lista.filter(r => r.ambito === 'Interno').length,
      externo: lista.filter(r => r.ambito === 'Externo').length,
      franjas, franjaCritica: n ? fc : '—', franjaCriticaN: n ? franjas[fc] : 0,
      zonas, zonasTop, zonasReportadas: Object.keys(zonas).length,
      indice: indiceGeneral(lista)
    };
  }

  /* Serie mensual dentro de un rango */
  function mesesEntre(desde, hasta) { return MESES_DATOS.filter(m => m >= desde && m <= hasta); }
  function serieMensual(lista, desde, hasta) {
    return mesesEntre(desde, hasta).map(m => ({ mes: m, n: lista.filter(r => r.fecha.startsWith(m)).length }));
  }
  /* Proyección lineal simple de k meses */
  function proyeccion(serie, k) {
    const n = serie.length; if (n < 2) return [];
    const xs = serie.map((_, i) => i), ys = serie.map(s => s.n);
    const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
    const b = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / (xs.reduce((s, x) => s + (x - mx) ** 2, 0) || 1);
    const a = my - b * mx;
    const out = []; let [y, m] = serie[n - 1].mes.split('-').map(Number);
    for (let i = 1; i <= k; i++) { m++; if (m > 12) { m = 1; y++; } out.push({ mes: y + '-' + dos(m), n: Math.max(0, Math.round((a + b * (n - 1 + i)) * 10) / 10) }); }
    return out;
  }

  /* ---------- Textos cifrados de ejemplo (descripción y Acuerdo) ---------- */
  const ACCION = {
    'Robo sin violencia': 'Aviso a seguridad interna y revisión de cámaras de la zona',
    'Robo con violencia': 'Acompañamiento a la persona afectada para presentar la denuncia y aviso al jefe de cuadrante de la SSC',
    'Extorsión': 'Orientación para no realizar pagos, bloqueo del número y difusión del protocolo de reporte seguro',
    'Acoso': 'Aplicación del protocolo de la Red de Género y medidas de protección para la persona afectada',
    'Ciberacoso': 'Resguardo de la evidencia digital y aviso a la Red de Género',
    'Consumo de alcohol o drogas': 'Valoración por el servicio médico y aviso a la familia',
    'Violencia (riña o agresión)': 'Separación de las partes, valoración médica y mediación'
  };
  const ACCION_CORTA = {
    'Robo sin violencia': 'Aviso a seguridad y revisión de cámaras', 'Robo con violencia': 'Acompañamiento a denuncia y aviso a la SSC',
    'Extorsión': 'Orientación y protocolo de reporte seguro', 'Acoso': 'Protocolo de la Red de Género', 'Ciberacoso': 'Resguardo de evidencia y Red de Género',
    'Consumo de alcohol o drogas': 'Servicio médico y aviso a la familia', 'Violencia (riña o agresión)': 'Separación de las partes y mediación'
  };
  function descripcion(r) {
    if (r.clave === 'validado') return 'Un alumno presentó síntomas de intoxicación por consumo de una sustancia en el pasillo del piso 2 del Edificio 2; un compañero dio aviso a la coordinación. La persona estaba consciente y con dificultad para respirar.';
    return 'La persona afectada, de tipo ' + r.afectado.toLowerCase() + ', refiere un hecho de ' + corto(r.tipo).toLowerCase() + ' en ' + r.lugar + ' (modalidad: ' + r.modo.toLowerCase() + '). Se registra lo que comentó y una descripción general del hecho.';
  }
  function pasosAcuerdo(r) {
    const t0 = aFecha(r.fecha, r.hora), at = sumaMin(t0, r.at[1]), p = [];
    if (r.clave === 'validado') {
      p.push([fmtFH(at), 'Coordinación de COSECOVI', 'Se activa el protocolo de actuación y la coordinación acude al Edificio 2, piso 2.']);
      p.push([fmtFH(sumaMin(at, 8)), 'Servicio médico', 'Primeros auxilios para resguardar la vida de la persona y solicitud de ambulancia.']);
      p.push([fmtFH(sumaMin(at, 33)), 'Subdirección de Extensión', 'Traslado en ambulancia y aviso a la familia.']);
    } else {
      p.push([fmtFH(at), 'Coordinación de COSECOVI', 'Primera atención ' + r.at[0].toLowerCase() + ': entrevista con la persona afectada y registro del hecho.']);
      p.push([fmtFH(sumaMin(at, 30)), 'Coordinación de COSECOVI', ACCION[r.tipo] + '.']);
    }
    if (r.canal) {
      p.push([fmtF(r.canal[2]), DESTINOS[r.canal[0]], 'Se turna el caso con el oficio ' + r.canal[1] + '.']);
      if (r.canal[3]) p.push([fmtF(r.canal[3][0]), DESTINOS[r.canal[0]], r.canal[3][1]]);
    }
    return p;
  }
  function acuerdo(r) {
    if (!r.cierre) return null;
    const med = [];
    if (r.med_al) med.push('alumno: ' + r.med_al.toLowerCase());
    if (r.med_prof) med.push('profesor: ' + r.med_prof.toLowerCase());
    const firma = r.tipo === 'Violencia (riña o agresión)' ? ' Se firmó un compromiso de convivencia entre las partes.' : '';
    return { pasos: pasosAcuerdo(r), medidas: med.length ? 'Medidas para el ' + med.join('; para el ') + '.' : 'Sin medidas para personas de la comunidad.', firma, sesion: r.sesion, fecha: r.cierre };
  }

  /* ---------- Ruta del caso (lo que era la Bitácora de seguimiento) ---------- */
  function ruta(r) {
    const ev = [], t0 = aFecha(r.fecha, r.hora), reg = sumaMin(t0, 1);
    ev.push({ d: reg, tipo: 'registro', titulo: 'Registro del reporte ' + r.cos, usuario: r.registra, cos: r.cos, detalle: corto(r.tipo) + ' · ' + r.lugar + ' · Afectado: ' + r.afectado });
    r.exps.forEach((e, i) => {
      const nuevo = i === 0 && !r.liga;
      ev.push({ d: sumaMin(reg, 1), tipo: 'liga', cos: r.cos, usuario: nuevo ? 'Sistema' : r.registra,
        titulo: nuevo ? 'Expediente ' + e + ' creado automáticamente' : 'Reporte ligado al expediente ' + e,
        detalle: nuevo ? 'Todo reporte nuevo abre su expediente.' : 'Misma persona o mismo caso; el reporte anterior no se modifica.' });
    });
    ev.push({ d: sumaMin(t0, r.at[1]), tipo: 'atencion', cos: r.cos, usuario: 'COORD-01', titulo: 'Primera atención · ' + r.at[0], detalle: 'Tiempo de respuesta: ' + fmtDur(r.at[1]) + ' desde que COSECOVI conoció el hecho.' });
    if (r.clave === 'validado') pasosAcuerdo(r).slice(1, 3).forEach((p, i) => ev.push({ d: sumaMin(t0, r.at[1] + (i ? 33 : 8)), tipo: 'accion', cos: r.cos, usuario: 'COORD-01', titulo: p[1], detalle: p[2] }));
    if (r.canal) {
      ev.push({ d: aFecha(r.canal[2], '10:00'), tipo: 'canal', cos: r.cos, usuario: 'COORD-01', titulo: 'Canalizado a ' + DESTINOS[r.canal[0]], detalle: 'Oficio ' + r.canal[1] + ' · Fase: En atención COSECOVI → Canalizado' });
      if (r.canal[3]) ev.push({ d: aFecha(r.canal[3][0], '12:00'), tipo: 'respuesta', cos: r.cos, usuario: 'COORD-01', titulo: 'Respuesta de ' + DESTINOS[r.canal[0]], detalle: r.canal[3][1] });
      else if (!r.cierre) ev.push({ d: null, tipo: 'pendiente', cos: r.cos, usuario: '', titulo: 'Respuesta de la instancia pendiente', detalle: 'No se puede cerrar hasta registrar la respuesta de ' + DESTINOS[r.canal[0]] + '.' });
    }
    if (r.cierre) ev.push({ d: aFecha(r.cierre, '13:00'), tipo: 'cierre', cos: r.cos, usuario: 'COORD-01', titulo: 'Caso cerrado · Acuerdo COSECOVI', detalle: acuerdo(r).medidas + acuerdo(r).firma + ' ' + r.sesion + '.' });
    return ev;
  }
  function rutaDe(lista) {
    const ev = lista.flatMap(ruta);
    return ev.filter(e => e.d).sort((a, b) => a.d - b.d).concat(ev.filter(e => !e.d));
  }
  const reportesDeExp = e => REPORTES.filter(r => r.exps.includes(e));
  function expedientes(lista) {
    const ids = [...new Set(lista.flatMap(expedientesDe))];
    return ids.map(id => { const rs = reportesDeExp(id); return { id, reportes: rs, ultimo: rs[rs.length - 1] }; });
  }


  /* ---------- Motor de recomendaciones (reglas documentadas, no es un modelo de ML) ----------
     Cada recomendación corresponde a uno o más grupos de delito. Sus acciones se activan con los
     casos y expedientes reales del periodo: cada una muestra el dato que la sustenta. Una acción sin
     casos que la activen se muestra como acción base, sin evidencia en el periodo. */
  const nomLug = r => (D.lugares[r.lug] ? D.lugares[r.lug].nombre : r.lugar).split(',')[0].split(' · ')[0];
  function evidencia(rs) {
    const ex = expedientes(rs), abiertos = rs.filter(r => r.fase !== 'Cerrado');
    const top = (fn, lista) => { const c = contar(lista || rs, fn), k = mayor(c); return k ? [k, c[k]] : ['—', 0]; };
    const noct = rs.filter(r => r.hora >= '18:00' || r.hora < '06:00');
    const fr = contar(rs, r => FRANJAS[franjaDe(r.hora)]), frK = mayor(fr);
    return {
      rs, casos: rs.length, expedientes: ex.length, abiertos: abiertos.length, abiertosL: abiertos,
      enAtencion: rs.filter(r => r.fase === 'En atención COSECOVI').length,
      canalizados: rs.filter(r => r.canal).length, sinRespuesta: rs.filter(r => r.canal && !r.canal[3] && r.fase !== 'Cerrado').length,
      reincidencia: ex.filter(e => e.reportes.length > 1).length,
      lugar: top(nomLug), modo: top(r => r.modo), afectado: top(r => r.afectado),
      franja: frK ? [frK, fr[frK]] : ['—', 0], nocturnos: noct.length, lugarNoct: top(nomLug, noct),
      externos: rs.filter(r => r.ambito === 'Externo').length, internos: rs.filter(r => r.ambito === 'Interno').length,
      digitales: rs.filter(r => r.zona === 'Medios digitales').length, ssc: rs.filter(r => r.canal && r.canal[0] === 'SSC').length,
      salud: rs.filter(r => r.tipo === 'Consumo de alcohol o drogas').length
    };
  }
  const nc = n => n + (n === 1 ? ' caso' : ' casos');
  const REC = [
    { id: 'robos', grupos: ['Robos con o sin violencia'], titulo: 'Robos con o sin violencia', sem: 'Rojo', sub: 'Prioridad en accesos, estacionamiento y trayectos sobre Av. Juan de Dios Bátiz.',
      acc: [['Reforzar vigilancia en horarios críticos.', E => E.casos && 'Franja ' + E.franja[0] + ' h: ' + E.franja[1] + ' de ' + nc(E.casos) + '; lugar con más casos: ' + E.lugar[0] + ' (' + nc(E.lugar[1]) + ').'],
        ['Mejorar la iluminación de la zona.', E => E.nocturnos && nc(E.nocturnos) + ' entre 18:00 y 06:00, sobre todo en ' + E.lugarNoct[0] + '.'],
        ['Realizar campañas de prevención de robo.', E => E.casos && 'Afectado más frecuente: ' + E.afectado[0].toLowerCase() + ' (' + nc(E.afectado[1]) + '); modalidad principal: ' + E.modo[0].toLowerCase() + '.'],
        ['Coordinar acciones con el jefe de cuadrante de la SSC.', E => E.externos && nc(E.externos) + ' fuera del plantel; ' + E.ssc + ' ya canalizados a la SSC.']] },
    { id: 'extorsion', grupos: ['Extorsión'], titulo: 'Extorsión', sem: 'Rojo', sub: 'Atención a reportes telefónicos, digitales y presenciales en el entorno del plantel.',
      acc: [['Difundir los canales institucionales de denuncia.', E => E.casos && nc(E.casos) + ' en ' + E.expedientes + ' expedientes durante el periodo.'],
        ['Impulsar campañas de concientización sobre riesgos.', E => E.casos && 'Modalidad más común: ' + E.modo[0].toLowerCase() + ' (' + nc(E.modo[1]) + ').'],
        ['Solicitar apoyo de la Oficina del Abogado General.', E => E.reincidencia && E.reincidencia + ' expedientes con más de un reporte.'],
        ['Escalar el caso a la autoridad competente.', E => E.abiertos && nc(E.abiertos) + ' sin cerrar, ' + E.sinRespuesta + ' canalizados sin respuesta.']] },
    { id: 'acoso', grupos: ['Acoso', 'Ciberacoso'], titulo: 'Acoso / Ciberacoso', sem: 'Rojo', sub: 'Acciones de atención confidencial para espacios físicos y canales digitales.',
      acc: [['Activar los protocolos de la Red de Género.', E => E.enAtencion && nc(E.enAtencion) + ' en atención COSECOVI.'],
        ['Difundir el Violentómetro y el Acosómetro.', E => E.casos && nc(E.casos) + ', ' + E.digitales + ' por medios digitales.'],
        ['Canalizar a las instancias correspondientes del IPN.', E => E.canalizados && E.canalizados + ' canalizados, ' + E.sinRespuesta + ' en espera de respuesta.'],
        ['Dar seguimiento y acompañamiento a la persona afectada.', E => E.abiertos && nc(E.abiertos) + ' abiertos; afectado más frecuente: ' + E.afectado[0].toLowerCase() + '.']] },
    { id: 'salud', grupos: ['Delitos contra la salud', 'Violencia'], titulo: 'Delitos contra la salud / Violencia', sem: 'Amarillo', sub: 'Prevención focalizada en áreas comunes, estacionamiento y perímetro escolar.',
      acc: [['Aplicar estrategias de prevención y concientización.', E => E.casos && nc(E.casos) + ' en ' + E.expedientes + ' expedientes durante el periodo.'],
        ['Realizar campañas sobre consumo de sustancias.', E => E.salud && nc(E.salud) + ' de consumo de alcohol o drogas.'],
        ['Mantener monitoreo en zonas de riesgo.', E => E.casos && 'Lugar con más casos: ' + E.lugar[0] + ' (' + nc(E.lugar[1]) + '); franja ' + E.franja[0] + ' h.'],
        ['Coordinar acciones con seguridad interna.', E => E.internos && nc(E.internos) + ' dentro del plantel.']] }
  ];
  const recDeTipo = t => REC.find(x => x.grupos.includes(grupoDe(t)));
  /* Aplica el motor a una lista de casos: una entrada por recomendación, ordenadas por casos abiertos */
  function recomendar(lista) {
    return REC.map(x => {
      const E = evidencia(lista.filter(r => x.grupos.includes(grupoDe(r.tipo))));
      const acciones = x.acc.map(a => ({ texto: a[0], sustento: a[1](E) || '' }));
      const prioridad = !E.casos ? 'Sin casos' : x.sem === 'Rojo' ? (E.abiertos ? 'Alta' : 'Media') : (E.abiertos ? 'Media' : 'Seguimiento');
      return Object.assign({}, x, { E, acciones, activas: acciones.filter(a => a.sustento).length, prioridad });
    }).sort((a, b) => b.E.abiertos - a.E.abiertos || b.E.casos - a.E.casos);
  }
  /* Siguiente acción sugerida para un caso concreto, según su recomendación y su fase */
  function siguienteAccion(r) {
    const x = recDeTipo(r.tipo), n = r.exps.map(e => reportesDeExp(e).length).reduce((a, b) => a + b, 0);
    if (r.fase === 'Cerrado') return 'Caso cerrado con su Acuerdo COSECOVI.';
    if (r.canal && !r.canal[3]) return 'Dar seguimiento al oficio ' + r.canal[1] + ' con ' + DESTINO_CORTO[r.canal[0]] + '.';
    if (r.canal && r.canal[3]) return 'Ya respondió ' + DESTINO_CORTO[r.canal[0]] + ': registrar el cierre con su Acuerdo COSECOVI en la próxima sesión.';
    if (n > 1) return 'Revisar en sesión por reincidencia (' + n + ' reportes en el expediente). ' + x.acc[x.id === 'extorsion' ? 2 : 3][0];
    return x.acc[0][0];
  }

  /* ---------- Bitácora automática (auditoría) ---------- */
  function auditoria() {
    const A = [];
    const add = (d, u, accion, objeto, detalle, res) => A.push({ d, usuario: u, rol: USUARIOS[u], accion, objeto: objeto || '—', detalle: detalle || '', resultado: res || 'Correcto' });
    const login = (d, u) => add(d, u, 'Inicio de sesión', '—', 'Contraseña y código de verificación en dos pasos');
    D.reportes.forEach(r => {  /* datos originales; lo hecho en la sesión llega por S.eventos */
      const t0 = aFecha(r.fecha, r.hora), reg = sumaMin(t0, 1);
      login(sumaMin(reg, -4), r.registra);
      add(reg, r.registra, 'Alta de reporte', r.cos, r.liga ? 'Ligado a ' + r.exps[0] : 'Expediente ' + r.exps[0] + ' creado automáticamente');
      if (r.exps.length > 1) add(sumaMin(reg, 2), r.registra, 'Liga a expediente', r.cos, 'Ligado también a ' + r.exps.slice(1).join(', '));
      add(sumaMin(t0, r.at[1] + 3), 'COORD-01', 'Registro de primera atención', r.cos, r.at[0] + ' · ' + fmtDur(r.at[1]));
      if (r.canal) {
        add(aFecha(r.canal[2], '10:02'), 'COORD-01', 'Cambio de fase', r.cos, 'En atención COSECOVI → Canalizado · ' + r.canal[1]);
        if (r.canal[3]) add(aFecha(r.canal[3][0], '12:03'), 'COORD-01', 'Registro de respuesta de instancia', r.cos, DESTINOS[r.canal[0]]);
      }
      if (r.cierre) add(aFecha(r.cierre, '13:04'), 'COORD-01', 'Cambio de fase', r.cos, (r.canal ? 'Canalizado' : 'En atención COSECOVI') + ' → Cerrado');
    });
    MESES_DATOS.forEach((m, i) => {
      const ult = new Date(2026, i + 1, 0).getDate();
      add(aFecha(m + '-' + dos(ult), '18:10'), 'COORD-01', 'Exportación', 'Reportes', 'Reporte mensual ' + nombreMes(m).toLowerCase() + ' · PDF');
      add(aFecha(m + '-' + dos(ult), '18:11'), 'COORD-01', 'Exportación', 'Reportes', 'Reporte mensual ' + nombreMes(m).toLowerCase() + ' · Excel');
      login(aFecha(m + '-' + dos(ult - 1), '17:55'), 'PRES-01');
      add(aFecha(m + '-' + dos(ult - 1), '17:58'), 'PRES-01', 'Consulta', 'Inspección de casos particulares', 'Ficha de caso');
      [7, 14, 21, 28].forEach(d => add(aFecha(m + '-' + dos(d), '03:00'), 'Sistema', 'Respaldo completo semanal', 'Base de datos', 'Cifrado AES-256'));
    });
    add(aFecha('2026-03-04', '12:02'), 'VOC-02', 'Intento de abrir vista', 'Vista general', 'Vista fuera del rol', 'Denegado');
    add(aFecha('2026-05-19', '10:50'), 'VOC-01', 'Intento de abrir vista', 'Recomendaciones', 'Vista fuera del rol', 'Denegado');
    add(aFecha('2026-08-11', '11:30'), 'COORD-01', 'Intento de abrir vista', 'Bitácora automática', 'Vista fuera del rol', 'Denegado');
    add(aFecha('2026-06-16', '07:52'), 'VOC-02', 'Inicio de sesión', '—', '5 intentos fallidos; cuenta bloqueada', 'Bloqueado');
    add(aFecha('2026-07-21', '13:40'), 'VOC-02', 'Sesión expirada', '—', '15 min sin actividad', 'Cerrada');
    add(aFecha('2026-07-15', '10:20'), 'COORD-01', 'Corrección de reporte', (D.reportes.find(r => r.clave === 'validado') || {}).cos, 'Espacio: Pasillo piso 1 → Pasillo piso 2');
    add(aFecha('2026-09-24', '09:12'), 'COORD-01', 'Corrección de reporte', D.reportes.filter(r => r.clave === 'acoso_prof').pop().cos, 'Tipo de afectado: Personal → Alumno');
    releerEventos();
    S.eventos.forEach((e, i) => A.push({ i: i + 1, d: new Date(e.d), usuario: e.usuario, rol: USUARIOS[e.usuario] || 'Sistema', accion: e.accion, objeto: e.objeto, detalle: e.detalle, resultado: e.resultado, sesion: true }));
    /* El historial sintético solo llega hasta hoy: nada de la bitácora puede tener fecha futura */
    const hoy = new Date();
    return A.filter(e => e.sesion || e.d <= hoy).sort((a, b) => (b.d - a.d) || ((b.i || 0) - (a.i || 0)));
  }

  const CASO_VALIDADO = (D.reportes.find(r => r.clave === 'validado') || D.reportes[0]).cos;
  window.M = {
    CASO_VALIDADO,
    sesion, agregarReporte, modificar, evento, preferencia, restablecer, ahora,
    DATOS: D, REPORTES, TIPOS, GRUPOS, DESC_GRUPO, ZONAS, FASES, DESTINOS, DESTINO_CORTO, AFECTADOS, MODOS, MODOS_TIPO, FRANJAS, DIAS, MESES_DATOS,
    EDIFICIOS, PISOS, ESPACIOS, USUARIOS, ACCION_CORTA,
    filtrar, contar, mayor, metricas, indiceGeneral, indiceGrupo, nivelIndice, serieMensual, proyeccion, mesesEntre,
    descripcion, acuerdo, ruta, rutaDe, expedientes, reportesDeExp, auditoria, grupoDe, corto, REC, recomendar, recDeTipo, siguienteAccion,
    u: { aFecha, sumaMin, iso, hhmm, fmtF, fmtFC, fmtFH, fmtDur, nombreMes, mesCorto, nombrePeriodo, franjaDe, diaDe, pct, dos }
  };
})();
