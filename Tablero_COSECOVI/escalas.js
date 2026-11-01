/* =====================================================================
   VIOLENTÓMETRO Y ACOSÓMETRO (material de la Red de Género del IPN)
   Textos copiados tal cual del prototipo de Figma.
   ===================================================================== */
window.ESCALAS = {
  violentometro: {
    zonas: [
      { desde: 22, hasta: 30, color: 'rojo',  titulo: '¡Necesitas ayuda profesional!' },
      { desde: 12, hasta: 21, color: 'amar',  titulo: '¡Reacciona! ¡No te dejes destruir!' },
      { desde: 1,  hasta: 11, color: 'verde', titulo: '¡Ten cuidado! La violencia aumentará' }
    ],
    niveles: {
      1: 'Bromas hirientes', 2: 'Chantajear', 3: 'Mentir/engañar', 4: 'Ignorar/ley del hielo', 5: 'Celar', 6: 'Acechar/Stalkear redes sociales',
      7: 'Culpabilizar', 8: 'Descalificar', 9: 'Ridiculizar/ofender', 10: 'Humillar en público',
      11: 'Intimidar/amenazar', 12: 'Controlar/prohibir', 13: 'Destruir artículos personales', 14: 'Manosear', 15: 'Caricias agresivas',
      16: 'Golpear "jugando"', 17: 'Pellizcar/arañar', 18: 'Empujar/jalonear', 19: 'Cachetear', 20: 'Patear',
      21: 'Encerrar/aislar', 22: 'Sextorsión', 23: 'Amenazar con objetos o armas', 24: 'Difundir contenido íntimo sin consentimiento por medios digitales',
      25: 'Amenazar de muerte', 26: 'Forzar a una relación sexual', 27: 'Abuso sexual', 28: 'Violar', 29: 'Mutilar', 30: 'Asesinar (Homicidio/Feminicidio)'
    }
  },
  acosometro: {
    insignia: ['¡NO ES NO!', '#CeroToleranciaALaViolencia'],
    zonas: [
      { desde: 13, hasta: 17, color: 'rojo',  titulo: 'Conductas graves' },
      { desde: 7,  hasta: 12, color: 'amar',  titulo: 'Conductas reiteradas' },
      { desde: 1,  hasta: 6,  color: 'verde', titulo: 'Señales iniciales' }
    ],
    niveles: {
      1: 'Miradas lascivas', 2: 'Gestos y sonidos de naturaleza sexual', 3: 'Piropos o comentarios no deseados', 4: 'Bromas o preguntas sobre la vida sexual',
      5: 'Insinuaciones o proposiciones sexuales', 6: 'Mostrar material sexual no solicitado', 7: 'Fotografías o grabaciones del cuerpo sin consentimiento',
      8: 'Mensajes, llamadas o cartas de naturaleza sexual no deseados', 9: 'Contacto físico innecesario y no deseado', 10: 'Acercamientos invasivos',
      11: 'Presión para aceptar invitaciones o citas', 12: 'Acecho o persecución', 13: 'Amenazas o represalias por rechazar conductas sexuales',
      14: 'Presión para tener relaciones sexuales', 15: 'Tocamientos sin consentimiento', 16: 'Intento de violación', 17: 'Violación'
    }
  }
};
