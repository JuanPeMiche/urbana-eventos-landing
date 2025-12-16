/**
 * ========================================
 * GOOGLE ADS CONVERSION TRACKING CONFIG
 * ========================================
 * 
 * Este archivo centraliza toda la configuración de conversiones de Google Ads.
 * 
 * INSTRUCCIONES PARA AGREGAR CONVERSIONES:
 * 1. Pegar el script global de Google Tag en index.html (buscar "GOOGLE ADS CONVERSION TRACKING")
 * 2. Reemplazar los valores "AW-XXXX/YYY" abajo por los send_to reales que te pase Google Ads
 * 3. Cada sección tiene su propia configuración para WhatsApp y Email
 * 
 * NAMING CONVENTION:
 * - Section keys: casamientos, cumpleanos-privados, cumpleanos-infantiles, eventos-empresariales, despedidas-de-ano
 * - Channels: wpp (WhatsApp), mail (Email)
 */

// ============================================================
// REEMPLAZAR ESTOS VALORES CON LOS send_to REALES DE GOOGLE ADS
// ============================================================
export const GOOGLE_CONVERSIONS: Record<string, {
  wpp: { send_to: string };
  mail: { send_to: string };
}> = {
  // Campaña: Casamientos
  // Reemplazar AW-XXXX/casamientos_wpp y AW-XXXX/casamientos_mail por los valores reales
  'casamientos': {
    wpp: { send_to: 'AW-XXXX/casamientos_wpp' },
    mail: { send_to: 'AW-XXXX/casamientos_mail' },
  },

  // Campaña: Cumpleaños Privados (de 15 y adultos)
  // Reemplazar AW-XXXX/cumpleanos_privados_wpp y AW-XXXX/cumpleanos_privados_mail
  'cumpleanos-privados': {
    wpp: { send_to: 'AW-XXXX/cumpleanos_privados_wpp' },
    mail: { send_to: 'AW-XXXX/cumpleanos_privados_mail' },
  },

  // Campaña: Cumpleaños Infantiles
  // Reemplazar AW-XXXX/cumpleanos_infantiles_wpp y AW-XXXX/cumpleanos_infantiles_mail
  'cumpleanos-infantiles': {
    wpp: { send_to: 'AW-XXXX/cumpleanos_infantiles_wpp' },
    mail: { send_to: 'AW-XXXX/cumpleanos_infantiles_mail' },
  },

  // Campaña: Eventos Empresariales
  // Reemplazar AW-XXXX/eventos_empresariales_wpp y AW-XXXX/eventos_empresariales_mail
  'eventos-empresariales': {
    wpp: { send_to: 'AW-XXXX/eventos_empresariales_wpp' },
    mail: { send_to: 'AW-XXXX/eventos_empresariales_mail' },
  },

  // Campaña: Despedidas de Año
  // Reemplazar AW-XXXX/despedidas_de_ano_wpp y AW-XXXX/despedidas_de_ano_mail
  'despedidas-de-ano': {
    wpp: { send_to: 'AW-XXXX/despedidas_de_ano_wpp' },
    mail: { send_to: 'AW-XXXX/despedidas_de_ano_mail' },
  },

  // Conversión genérica (para WhatsApp flotante o formulario sin sección específica)
  // Reemplazar AW-XXXX/general_wpp y AW-XXXX/general_mail
  'general': {
    wpp: { send_to: 'AW-XXXX/general_wpp' },
    mail: { send_to: 'AW-XXXX/general_mail' },
  },
};

// Tipo para secciones válidas
export type TrackingSection = keyof typeof GOOGLE_CONVERSIONS;
export type TrackingChannel = 'wpp' | 'mail';

/**
 * Dispara una conversión de Google Ads
 * 
 * @param section - La sección/campaña (ej: 'casamientos', 'cumpleanos-privados')
 * @param channel - El canal de contacto ('wpp' para WhatsApp, 'mail' para Email)
 * 
 * EJEMPLO DE USO:
 * trackConversion('casamientos', 'wpp'); // Dispara conversión de WhatsApp para Casamientos
 * trackConversion('eventos-empresariales', 'mail'); // Dispara conversión de Email para Empresariales
 */
export function trackConversion(section: TrackingSection, channel: TrackingChannel): void {
  const config = GOOGLE_CONVERSIONS[section];
  
  if (!config) {
    console.warn(`[Google Ads Tracking] Sección no configurada: "${section}". Agregala en GOOGLE_CONVERSIONS.`);
    return;
  }

  const channelConfig = config[channel];
  if (!channelConfig) {
    console.warn(`[Google Ads Tracking] Canal no configurado para "${section}": "${channel}"`);
    return;
  }

  const sendTo = channelConfig.send_to;

  // Verificar si gtag está disponible
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // Si el send_to todavía tiene el placeholder, solo logueamos
    if (sendTo.startsWith('AW-XXXX')) {
      console.log(`[Google Ads Tracking] Conversión (placeholder): section="${section}", channel="${channel}", send_to="${sendTo}"`);
      console.log(`[Google Ads Tracking] ⚠️ Reemplazar "${sendTo}" con el valor real de Google Ads`);
    } else {
      // Disparar conversión real
      (window as any).gtag('event', 'conversion', {
        send_to: sendTo,
      });
      console.log(`[Google Ads Tracking] ✓ Conversión disparada: section="${section}", channel="${channel}", send_to="${sendTo}"`);
    }
  } else {
    // gtag no disponible (desarrollo o falta el script)
    console.log(`[Google Ads Tracking] gtag no disponible. Conversión pendiente: section="${section}", channel="${channel}", send_to="${sendTo}"`);
  }
}

/**
 * Helper para generar el conversion name legible
 * Útil para identificar conversiones en los logs
 */
export function getConversionName(section: TrackingSection, channel: TrackingChannel): string {
  const channelLabel = channel === 'wpp' ? 'WhatsApp' : 'Email';
  const sectionLabels: Record<string, string> = {
    'casamientos': 'Casamientos',
    'cumpleanos-privados': 'Cumpleaños Privados',
    'cumpleanos-infantiles': 'Cumpleaños Infantiles',
    'eventos-empresariales': 'Eventos Empresariales',
    'despedidas-de-ano': 'Despedidas de Año',
    'general': 'General',
  };
  return `${sectionLabels[section] || section} - ${channelLabel}`;
}

/**
 * Lista todas las conversiones configuradas (útil para debugging)
 */
export function listAllConversions(): void {
  console.log('[Google Ads Tracking] Conversiones configuradas:');
  Object.entries(GOOGLE_CONVERSIONS).forEach(([section, channels]) => {
    console.log(`  ${section}:`);
    console.log(`    - WhatsApp: ${channels.wpp.send_to}`);
    console.log(`    - Email: ${channels.mail.send_to}`);
  });
}
