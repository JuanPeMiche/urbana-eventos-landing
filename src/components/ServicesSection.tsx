import { Heart, Briefcase, PartyPopper, Package, GraduationCap, Cake, Award, MoreHorizontal } from 'lucide-react';
import eventWedding from '@/assets/event-wedding.jpg';
import eventCorporate from '@/assets/event-corporate.jpg';
import eventBirthday from '@/assets/event-birthday.jpg';

export type EventType = 
  | 'Casamiento'
  | 'Fiesta empresarial'
  | 'Despedida de año'
  | 'Presentación de producto'
  | 'Capacitación'
  | 'Cumpleaños privado'
  | 'Aniversario empresarial'
  | 'Otro';

interface EventTypeData {
  type: EventType;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  image?: string;
}

export const eventTypes: EventTypeData[] = [
  {
    type: 'Casamiento',
    icon: Heart,
    description: 'Salones preparados para tu boda, con toda la elegancia que merecés.',
    image: eventWedding,
  },
  {
    type: 'Fiesta empresarial',
    icon: Briefcase,
    description: 'Celebrá logros y fortalecé a tu equipo en el espacio perfecto.',
    image: eventCorporate,
  },
  {
    type: 'Despedida de año',
    icon: PartyPopper,
    description: 'Cerrá el año con estilo y alegría junto a tus seres queridos.',
  },
  {
    type: 'Presentación de producto',
    icon: Package,
    description: 'Espacios profesionales para lanzar tu producto con impacto.',
  },
  {
    type: 'Capacitación',
    icon: GraduationCap,
    description: 'Potenciá tu equipo en un lugar organizado y preparado.',
  },
  {
    type: 'Cumpleaños privado',
    icon: Cake,
    description: 'Festejá a lo grande con tus invitados en un ambiente exclusivo.',
    image: eventBirthday,
  },
  {
    type: 'Aniversario empresarial',
    icon: Award,
    description: 'Brindá por más años juntos y más logros alcanzados.',
  },
  {
    type: 'Otro',
    icon: MoreHorizontal,
    description: 'Contanos tu idea y encontramos el espacio ideal.',
  },
];

interface ServicesSectionProps {
  onSelectEventType: (type: EventType) => void;
}

export const ServicesSection = ({ onSelectEventType }: ServicesSectionProps) => {
  const scrollToContactAndSelect = (type: EventType) => {
    onSelectEventType(type);
    setTimeout(() => {
      const element = document.querySelector('#contacto');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section id="servicios" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Organizamos</h2>
          <p className="section-subtitle">
            Cada evento es único. Elegí el tipo de celebración y te guiamos al salón perfecto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((event) => (
            <div
              key={event.type}
              className="bg-card border border-border rounded-lg overflow-hidden card-hover group"
            >
              {event.image ? (
                <div className="h-40 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.type}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-40 bg-secondary flex items-center justify-center">
                  <event.icon className="w-16 h-16 text-primary/50" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <event.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-playfair text-lg font-semibold text-foreground">
                    {event.type}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                <button
                  onClick={() => scrollToContactAndSelect(event.type)}
                  className="btn-gold-outline w-full text-sm py-2"
                  /* GOOGLE TAG - Event Type Button */
                  data-event-type={event.type}
                  data-google-conversion-id=""
                  data-google-conversion-label=""
                >
                  Quiero este evento
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
