import { useState, useEffect } from 'react';
import { Heart, Briefcase, PartyPopper, Package, GraduationCap, Cake, Award, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/imageResolver';
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
  contentKey: string;
  fallbackDescription: string;
  fallbackImage?: string;
  slug: string;
}

interface ServiceImage {
  image_url: string;
  category: string;
}

const eventTypes: EventTypeData[] = [
  {
    type: 'Casamiento',
    icon: Heart,
    contentKey: 'event_casamiento',
    fallbackDescription: 'Salones preparados para tu boda, con toda la elegancia que merecés.',
    fallbackImage: eventWedding,
    slug: 'casamientos',
  },
  {
    type: 'Fiesta empresarial',
    icon: Briefcase,
    contentKey: 'event_fiesta_empresarial',
    fallbackDescription: 'Celebrá logros y fortalecé a tu equipo en el espacio perfecto.',
    fallbackImage: eventCorporate,
    slug: 'empresariales',
  },
  {
    type: 'Despedida de año',
    icon: PartyPopper,
    contentKey: 'event_despedida',
    fallbackDescription: 'Cerrá el año con estilo y alegría junto a tus seres queridos.',
    slug: 'despedidas',
  },
  {
    type: 'Presentación de producto',
    icon: Package,
    contentKey: 'event_presentacion',
    fallbackDescription: 'Espacios profesionales para lanzar tu producto con impacto.',
    slug: 'presentaciones',
  },
  {
    type: 'Capacitación',
    icon: GraduationCap,
    contentKey: 'event_capacitacion',
    fallbackDescription: 'Potenciá tu equipo en un lugar organizado y preparado.',
    slug: 'capacitaciones',
  },
  {
    type: 'Cumpleaños privado',
    icon: Cake,
    contentKey: 'event_cumpleanos',
    fallbackDescription: 'Festejá a lo grande con tus invitados en un ambiente exclusivo.',
    fallbackImage: eventBirthday,
    slug: 'cumpleanos',
  },
  {
    type: 'Aniversario empresarial',
    icon: Award,
    contentKey: 'event_aniversario',
    fallbackDescription: 'Brindá por más años juntos y más logros alcanzados.',
    slug: 'aniversarios',
  },
  {
    type: 'Otro',
    icon: MoreHorizontal,
    contentKey: 'event_otro',
    fallbackDescription: 'Contanos tu idea y encontramos el espacio ideal.',
    slug: 'otros',
  },
];

interface ServicesSectionProps {
  onSelectEventType: (type: EventType) => void;
}

export const ServicesSection = ({ onSelectEventType }: ServicesSectionProps) => {
  const { get } = useSiteContent();
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([]);

  useEffect(() => {
    const fetchServiceImages = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('image_url, category')
        .neq('category', 'salon')
        .not('category', 'is', null)
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (data) {
        setServiceImages(data);
      }
    };

    fetchServiceImages();
  }, []);

  const getImageForEvent = (event: EventTypeData): string | undefined => {
    const dbImage = serviceImages.find(img => img.category === event.slug);
    if (dbImage) {
      return resolveImageUrl(dbImage.image_url);
    }
    return event.fallbackImage;
  };

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
          {eventTypes.map((event) => {
            const image = getImageForEvent(event);
            return (
              <div
                key={event.type}
                className="bg-card border border-border rounded-lg overflow-hidden card-hover group"
              >
                {image ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={image}
                      alt={event.type}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
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
                  <p className="text-muted-foreground text-sm mb-4">
                    {get(event.contentKey, event.fallbackDescription)}
                  </p>
                  <Link
                    to={`/servicios/${event.slug}`}
                    className="btn-gold w-full text-sm py-3 text-center block group-hover:shadow-lg transition-all duration-300"
                  >
                    Cotizar {event.type}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
