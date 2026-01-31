import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrackingConfig {
  id: string;
  enabled: boolean;
  ads_id: string;
  event_label: string;
  conversion_label: string | null;
  track_form_submit: boolean;
  track_whatsapp_click: boolean;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Hook para cargar Google Ads tracking dinámicamente solo cuando está habilitado
 * para una sección específica.
 * 
 * @param sectionId - ID de la sección (ej: 'cumpleanos-infantiles')
 */
export function useGoogleAdsTracking(sectionId: string) {
  const [config, setConfig] = useState<TrackingConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scriptLoadedRef = useRef(false);

  // Fetch tracking config from database
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('tracking_config')
          .select('*')
          .eq('id', sectionId)
          .single();

        if (error) {
          console.log(`[Google Ads] No config found for section "${sectionId}"`);
          setConfig(null);
        } else {
          setConfig(data as TrackingConfig);
        }
      } catch (err) {
        console.error('[Google Ads] Error fetching config:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [sectionId]);

  // Load Google Ads script when enabled
  useEffect(() => {
    if (!config?.enabled || !config.ads_id || scriptLoadedRef.current) {
      return;
    }

    // Check if gtag already exists (loaded globally)
    if (window.gtag) {
      console.log(`[Google Ads] gtag already loaded, configuring for ${config.ads_id}`);
      window.gtag('config', config.ads_id);
      setIsLoaded(true);
      scriptLoadedRef.current = true;
      return;
    }

    // Load gtag script dynamically
    const loadScript = () => {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', config.ads_id);

      // Create and append script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.ads_id}`;
      script.onload = () => {
        console.log(`[Google Ads] ✓ Script loaded for section "${sectionId}" with ID: ${config.ads_id}`);
        setIsLoaded(true);
        scriptLoadedRef.current = true;
      };
      script.onerror = () => {
        console.error(`[Google Ads] ✗ Failed to load script for ${config.ads_id}`);
      };

      document.head.appendChild(script);
    };

    loadScript();

    // Cleanup: Note - we don't remove the script as gtag is global
    return () => {
      // Script remains loaded for the session
    };
  }, [config, sectionId]);

  /**
   * Fire a conversion event
   */
  const trackConversion = useCallback((customLabel?: string) => {
    if (!config?.enabled || !window.gtag) {
      console.log(`[Google Ads] Tracking disabled or gtag not available for "${sectionId}"`);
      return;
    }

    const eventLabel = customLabel || config.event_label;
    
    // Build conversion params
    const conversionParams: Record<string, any> = {
      send_to: config.ads_id,
      event_category: 'form',
      event_label: eventLabel,
    };

    // Add conversion_label if configured (for specific conversion actions)
    if (config.conversion_label) {
      conversionParams.send_to = `${config.ads_id}/${config.conversion_label}`;
    }

    window.gtag('event', 'conversion', conversionParams);
    console.log(`[Google Ads] ✓ Conversion fired: section="${sectionId}", label="${eventLabel}"`, conversionParams);
  }, [config, sectionId]);

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback(() => {
    if (config?.track_form_submit) {
      trackConversion(`${config.event_label}_form`);
    }
  }, [config, trackConversion]);

  /**
   * Track WhatsApp click
   */
  const trackWhatsAppClick = useCallback(() => {
    if (config?.track_whatsapp_click) {
      trackConversion(`${config.event_label}_whatsapp`);
    }
  }, [config, trackConversion]);

  return {
    config,
    isLoaded,
    isLoading,
    isEnabled: config?.enabled ?? false,
    trackConversion,
    trackFormSubmit,
    trackWhatsAppClick,
  };
}

/**
 * Hook simplificado para usar en la página de Infantiles
 */
export function useInfantilesTracking() {
  return useGoogleAdsTracking('cumpleanos-infantiles');
}
