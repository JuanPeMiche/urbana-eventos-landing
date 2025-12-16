/**
 * Hook para manejar scroll automático basado en parámetro URL
 * 
 * EJEMPLO DE USO:
 * URL: https://tudominio.com/?section=casamientos
 * El sitio hará scroll automático a #casamientos al cargar
 * 
 * Secciones válidas:
 * - casamientos
 * - cumpleanos-privados
 * - cumpleanos-infantiles
 * - eventos-empresariales
 * - despedidas-de-ano
 * - contacto
 * - servicios
 */

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Mapeo de section param a ID del elemento
const SECTION_ID_MAP: Record<string, string> = {
  'casamientos': 'casamientos',
  'cumpleanos-privados': 'cumpleanos-privados',
  'cumpleanos-infantiles': 'cumpleanos-infantiles',
  'eventos-empresariales': 'eventos-empresariales',
  'despedidas-de-ano': 'despedidas-de-ano',
  'contacto': 'contacto',
  'servicios': 'servicios',
  'cotizar': 'cotizar',
};

export function useUrlSection() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const section = searchParams.get('section');
    
    if (section) {
      const elementId = SECTION_ID_MAP[section] || section;
      
      // Pequeño delay para asegurar que el DOM esté listo
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log(`[URL Section] Scrolled to #${elementId}`);
        } else {
          console.warn(`[URL Section] Element #${elementId} not found`);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams]);
}

export default useUrlSection;
