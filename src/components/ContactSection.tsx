import { EventType } from './ServicesSection';
import { ContactForm } from './ContactForm';
import { useSiteContent } from '@/hooks/useSiteContent';

interface ContactSectionProps {
  selectedEventType: EventType | null;
}

export const ContactSection = ({ selectedEventType }: ContactSectionProps) => {
  const { get } = useSiteContent();

  return (
    <section id="contacto" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">
            {get('contact_title', 'Pedí tu propuesta para el salón ideal')}
          </h2>
          <p className="section-subtitle">
            {get('contact_subtitle', 'Completá el formulario con los detalles de tu evento y nuestro equipo te contactará con la mejor propuesta de salón y costos.')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-background rounded-xl p-6 md:p-8 border border-border">
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-6">
              Contanos sobre tu evento
            </h3>
            <ContactForm selectedEventType={selectedEventType} />
          </div>
        </div>
      </div>
    </section>
  );
};
