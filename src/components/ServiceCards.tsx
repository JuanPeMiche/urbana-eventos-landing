import { Cake, Heart, Briefcase, PartyPopper, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/imageResolver';

// Import local fallbacks
import eventWedding from '@/assets/event-wedding.jpg';
import eventCorporate from '@/assets/event-corporate.jpg';
import eventBirthday from '@/assets/event-birthday.jpg';
import heroBg from '@/assets/hero-bg.jpg';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fallbackImage: string;
  category: string;
  href: string;
}

const services: ServiceCard[] = [
  {
    title: 'Cumpleaños',
    description: 'Festejá cumpleaños de 15 o privados en un ambiente exclusivo y personalizado.',
    icon: Cake,
    fallbackImage: eventBirthday,
    category: 'cumpleanos',
    href: '/cumpleanos',
  },
  {
    title: 'Cumpleaños Infantiles',
    description: 'Espacios seguros y divertidos para que los más chicos disfruten su día especial.',
    icon: Baby,
    fallbackImage: eventBirthday,
    category: 'infantiles',
    href: '/cumpleanos-infantiles',
  },
  {
    title: 'Casamientos',
    description: 'Salones elegantes preparados para el día más especial de tu vida.',
    icon: Heart,
    fallbackImage: eventWedding,
    category: 'casamientos',
    href: '/casamientos',
  },
  {
    title: 'Eventos Empresariales',
    description: 'Espacios profesionales para fiestas corporativas y team buildings.',
    icon: Briefcase,
    fallbackImage: eventCorporate,
    category: 'empresariales',
    href: '/eventos-empresariales',
  },
  {
    title: 'Despedidas de Año',
    description: 'Cerrá el año con estilo junto a tu equipo o seres queridos.',
    icon: PartyPopper,
    fallbackImage: heroBg,
    category: 'despedidas',
    href: '/despedidas-de-ano',
  },
];

export const ServiceCards = () => {
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('category, image_url')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        const imageMap: Record<string, string> = {};
        data.forEach((img) => {
          if (img.category && !imageMap[img.category]) {
            // Resolve asset paths to actual URLs
            imageMap[img.category] = resolveImageUrl(img.image_url);
          }
        });
        setServiceImages(imageMap);
      }
    };

    fetchImages();
  }, []);

  return (
    <section id="servicios" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">
            Elegí el tipo de evento y te conectamos con el salón perfecto.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              className="group bg-card border border-border rounded-xl overflow-hidden card-hover"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={serviceImages[service.category] || service.fallbackImage}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = service.fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <span className="btn-gold-outline text-sm py-2 px-4 inline-block group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Ver más
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
