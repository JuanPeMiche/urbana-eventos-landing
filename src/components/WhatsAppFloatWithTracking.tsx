import { trackConversion, TrackingSection } from '@/lib/googleAdsTracking';
import { getWhatsAppUrl } from '@/lib/contactConstants';
import { useGoogleAdsTracking } from '@/hooks/useGoogleAdsTracking';

interface WhatsAppFloatWithTrackingProps {
  trackingSection?: TrackingSection;
  serviceTag?: string;
  /** Enable dynamic Google Ads tracking for this section */
  enableDynamicTracking?: boolean;
}

// Mapeo de trackingSection a serviceTag
const trackingToServiceTag: Record<TrackingSection, string> = {
  'casamientos': 'Casamientos',
  'cumpleanos-privados': 'Cumpleaños',
  'cumpleanos-infantiles': 'Cumpleaños infantiles',
  'eventos-empresariales': 'Eventos empresariales',
  'despedidas-de-ano': 'Despedidas de año',
  'general': 'Home',
};

export const WhatsAppFloatWithTracking = ({ 
  trackingSection = 'general',
  serviceTag,
  enableDynamicTracking = false,
}: WhatsAppFloatWithTrackingProps) => {
  const effectiveServiceTag = serviceTag || trackingToServiceTag[trackingSection] || 'Home';
  const whatsappUrl = getWhatsAppUrl(effectiveServiceTag);

  // Dynamic Google Ads tracking hook
  const { 
    isEnabled: dynamicTrackingEnabled, 
    trackWhatsAppClick: dynamicTrackWhatsAppClick 
  } = useGoogleAdsTracking(trackingSection);

  const handleClick = () => {
    // Disparar conversión legacy de Google Ads
    trackConversion(trackingSection, 'wpp');

    // Fire dynamic Google Ads tracking if enabled
    if (enableDynamicTracking && dynamicTrackingEnabled) {
      dynamicTrackWhatsAppClick();
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-110"
      aria-label="Contactar por WhatsApp"
      id={`wpp-float-${trackingSection}`}
      data-track="google-ads"
      data-track-label={`${trackingSection}_whatsapp_float`}
      data-conversion-name={`${trackingSection}_wpp_float`}
      data-section={trackingSection}
      data-channel="whatsapp"
      data-element="float-button"
    >
      {/* Official WhatsApp Logo */}
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 60 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Green circle background */}
        <circle cx="30" cy="30" r="30" fill="#25D366"/>
        {/* WhatsApp icon */}
        <path 
          d="M30 14C21.163 14 14 21.163 14 30C14 33.326 15.079 36.416 16.924 38.95L15.155 45.418L21.801 43.685C24.242 45.351 27.093 46.25 30 46.25C38.837 46.25 46 39.087 46 30.25C46 21.413 38.837 14 30 14ZM30 43.5C27.447 43.5 24.955 42.712 22.843 41.235L22.393 40.955L18.155 42.068L19.288 37.941L18.975 37.473C17.336 35.249 16.457 32.567 16.457 29.75C16.457 22.584 22.584 16.707 30.25 16.707C37.666 16.707 43.543 22.584 43.543 30C43.543 37.416 37.416 43.5 30 43.5ZM37.318 33.76C36.951 33.576 35.006 32.618 34.671 32.501C34.336 32.384 34.099 32.326 33.861 32.693C33.624 33.06 32.862 33.951 32.657 34.188C32.452 34.426 32.247 34.459 31.88 34.275C31.513 34.091 30.228 33.689 28.714 32.336C27.536 31.282 26.73 29.984 26.525 29.617C26.32 29.25 26.503 29.05 26.687 28.867C26.854 28.7 27.054 28.434 27.238 28.229C27.422 28.024 27.48 27.878 27.597 27.64C27.714 27.403 27.656 27.198 27.564 27.014C27.472 26.83 26.738 24.882 26.436 24.148C26.142 23.434 25.843 23.534 25.622 23.522C25.417 23.51 25.179 23.507 24.942 23.507C24.705 23.507 24.305 23.599 23.97 23.966C23.635 24.333 22.611 25.291 22.611 27.239C22.611 29.187 24.003 31.069 24.187 31.306C24.371 31.544 26.725 35.202 30.314 36.916C31.267 37.336 32.007 37.59 32.589 37.782C33.546 38.092 34.42 38.048 35.109 37.953C35.876 37.848 37.453 37.002 37.755 36.077C38.057 35.152 38.057 34.359 37.965 34.209C37.873 34.059 37.636 33.967 37.318 33.76Z" 
          fill="white"
        />
      </svg>
    </a>
  );
};
