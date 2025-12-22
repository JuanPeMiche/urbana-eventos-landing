/**
 * ========================================
 * CONSTANTES GLOBALES DE CONTACTO
 * ========================================
 * 
 * Centraliza todos los datos de contacto del sitio.
 * Modificar aquí para actualizar en TODAS las páginas.
 */

// ============================================================
// DATOS DE CONTACTO - MODIFICAR AQUÍ PARA ACTUALIZAR TODO EL SITIO
// ============================================================
export const CONTACT_PHONE = '59897979905';
export const CONTACT_PHONE_DISPLAY = '+598 97 979 905';
export const CONTACT_EMAIL = 'afrutos.seguridad@gmail.com';

// URLs de WhatsApp
export const WHATSAPP_BASE_URL = `https://wa.me/${CONTACT_PHONE}`;

/**
 * Genera un URL de WhatsApp con mensaje prellenado
 * @param serviceTag - Etiqueta del servicio (ej: "Casamientos", "Cumpleaños")
 * @param nombre - Nombre del cliente (opcional)
 * @param telefono - Teléfono del cliente (opcional)
 */
export function getWhatsAppUrl(
  serviceTag: string = 'Home',
  nombre?: string,
  telefono?: string
): string {
  let message = `Hola, vengo desde Urbana Eventos. Servicio: ${serviceTag}.`;
  
  if (nombre) {
    message += ` Nombre: ${nombre}.`;
  }
  if (telefono) {
    message += ` Tel: ${telefono}.`;
  }
  
  message += ' Quisiera información sobre salones.';
  
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * Mapeo de rutas a etiquetas de servicio para tracking y emails
 */
export const SERVICE_TAGS: Record<string, string> = {
  '/': 'Home',
  '/cumpleanos': 'Cumpleaños',
  '/cumpleanos-infantiles': 'Cumpleaños infantiles',
  '/casamientos': 'Casamientos',
  '/eventos-empresariales': 'Eventos empresariales',
  '/despedidas-de-ano': 'Despedidas de año',
};

/**
 * Obtiene el serviceTag basado en la ruta actual
 */
export function getServiceTagFromPath(path: string): string {
  return SERVICE_TAGS[path] || 'Home';
}
