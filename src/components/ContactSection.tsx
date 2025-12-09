import { EventType } from './ServicesSection';
import { ContactForm, QuickContactBlock } from './ContactForm';

interface ContactSectionProps {
  selectedEventType: EventType | null;
}

export const ContactSection = ({ selectedEventType }: ContactSectionProps) => {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Pedí tu propuesta para el salón ideal</h2>
          <p className="section-subtitle">
            Completá el formulario con los detalles de tu evento y nuestro equipo te contactará 
            con la mejor propuesta de salón y costos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-background rounded-xl p-6 md:p-8 border border-border">
            <h3 className="font-playfair text-2xl font-semibold text-foreground mb-6">
              Contanos sobre tu evento
            </h3>
            <ContactForm selectedEventType={selectedEventType} />
          </div>

          {/* Quick Contact Blocks */}
          <div className="space-y-6">
            <h3 className="font-playfair text-xl font-semibold text-foreground mb-4">
              Contacto rápido por tipo de evento
            </h3>
            
            {/* <!-- GOOGLE TAG CASAMIENTO --> */}
            <QuickContactBlock
              eventType="Casamiento"
              title="Casamientos"
              description="Salones elegantes preparados para el día más especial de tu vida."
              googleTagId=""
            />

            {/* <!-- GOOGLE TAG EMPRESARIAL --> */}
            <QuickContactBlock
              eventType="Fiesta empresarial"
              title="Eventos Empresariales"
              description="Espacios profesionales para fiestas corporativas, presentaciones y capacitaciones."
              googleTagId=""
            />

            {/* <!-- GOOGLE TAG CUMPLEAÑOS --> */}
            <QuickContactBlock
              eventType="Cumpleaños privado"
              title="Cumpleaños Privados"
              description="Celebrá a lo grande en un ambiente exclusivo y personalizado."
              googleTagId=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};
