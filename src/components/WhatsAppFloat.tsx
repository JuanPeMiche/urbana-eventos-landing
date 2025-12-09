import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=%2B598096303705&text&type=phone_number&app_absent=0';

export const WhatsAppFloat = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float animate-pulse-gold"
      aria-label="Contactar por WhatsApp"
      /* GOOGLE TAG WHATSAPP FLOAT BUTTON */
      data-google-conversion-id=""
      data-google-conversion-label=""
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
