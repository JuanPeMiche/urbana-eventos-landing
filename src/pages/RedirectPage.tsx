import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Mapeo de rutas cortas (usadas en campañas) a rutas completas
 */
const ROUTE_ALIASES: Record<string, string> = {
  'empresariales': '/eventos-empresariales',
  'infantiles': '/cumpleanos-infantiles',
  'corporativos': '/eventos-empresariales',
  'bodas': '/casamientos',
  'cumples': '/cumpleanos',
  'fin-de-ano': '/despedidas-de-ano',
  'despedidas': '/despedidas-de-ano',
};

/**
 * Componente que redirige rutas cortas a sus rutas completas
 * Ejemplo: /empresariales -> /eventos-empresariales
 */
const RedirectPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (slug && ROUTE_ALIASES[slug]) {
      // Redirigir a la ruta completa manteniendo el historial limpio
      navigate(ROUTE_ALIASES[slug], { replace: true });
    } else {
      // Si no existe el alias, ir al home
      navigate('/', { replace: true });
    }
  }, [slug, navigate]);

  // Mostrar loading mientras redirige
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  );
};

export default RedirectPage;
