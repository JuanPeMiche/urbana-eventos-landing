import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { ContactForm } from '@/components/ContactForm';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Heart, Briefcase, PartyPopper, Package, GraduationCap, Cake, Award, MoreHorizontal, ArrowLeft } from 'lucide-react';
import eventWedding from '@/assets/event-wedding.jpg';
import eventCorporate from '@/assets/event-corporate.jpg';
import eventBirthday from '@/assets/event-birthday.jpg';

type ServiceSlug = 'casamientos' | 'empresariales' | 'despedidas' | 'presentaciones' | 'capacitaciones' | 'cumpleanos' | 'aniversarios' | 'otros';

interface ServiceData {
  title: string;
  eventType: string;
  contentKey: string;
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
  metaTitle: string;
  metaDescription: string;
}

const servicesData: Record<ServiceSlug, ServiceData> = {
  casamientos: {
    title: 'Salones para Casamientos',
    eventType: 'Casamiento',
    contentKey: 'event_casamiento',
    icon: Heart,
    image: eventWedding,
    metaTitle: 'Salones para Casamientos en Montevideo | Urbana Eventos',
    metaDescription: 'Encontrá el salón perfecto para tu casamiento. Salones elegantes preparados para el día más especial de tu vida.',
  },
  empresariales: {
    title: 'Eventos Empresariales',
    eventType: 'Fiesta empresarial',
    contentKey: 'event_fiesta_empresarial',
    icon: Briefcase,
    image: eventCorporate,
    metaTitle: 'Salones para Eventos Empresariales | Urbana Eventos',
    metaDescription: 'Espacios profesionales para fiestas corporativas, presentaciones y team buildings.',
  },
  despedidas: {
    title: 'Despedidas de Año',
    eventType: 'Despedida de año',
    contentKey: 'event_despedida',
    icon: PartyPopper,
    metaTitle: 'Salones para Despedidas de Año | Urbana Eventos',
    metaDescription: 'Cerrá el año con estilo en el salón perfecto para tu despedida.',
  },
  presentaciones: {
    title: 'Presentaciones de Producto',
    eventType: 'Presentación de producto',
    contentKey: 'event_presentacion',
    icon: Package,
    metaTitle: 'Salones para Presentaciones de Producto | Urbana Eventos',
    metaDescription: 'Espacios profesionales para lanzar tu producto con impacto.',
  },
  capacitaciones: {
    title: 'Capacitaciones',
    eventType: 'Capacitación',
    contentKey: 'event_capacitacion',
    icon: GraduationCap,
    metaTitle: 'Salones para Capacitaciones | Urbana Eventos',
    metaDescription: 'Potenciá tu equipo en un lugar organizado y preparado.',
  },
  cumpleanos: {
    title: 'Cumpleaños Privados',
    eventType: 'Cumpleaños privado',
    contentKey: 'event_cumpleanos',
    icon: Cake,
    image: eventBirthday,
    metaTitle: 'Salones para Cumpleaños | Urbana Eventos',
    metaDescription: 'Festejá a lo grande con tus invitados en un ambiente exclusivo.',
  },
  aniversarios: {
    title: 'Aniversarios Empresariales',
    eventType: 'Aniversario empresarial',
    contentKey: 'event_aniversario',
    icon: Award,
    metaTitle: 'Salones para Aniversarios Empresariales | Urbana Eventos',
    metaDescription: 'Brindá por más años juntos y más logros alcanzados.',
  },
  otros: {
    title: 'Otros Eventos',
    eventType: 'Otro',
    contentKey: 'event_otro',
    icon: MoreHorizontal,
    metaTitle: 'Salones para Eventos | Urbana Eventos',
    metaDescription: 'Contanos tu idea y encontramos el espacio ideal para tu evento.',
  },
};

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { get, loading } = useSiteContent();
  const service = servicesData[slug as ServiceSlug];

  useEffect(() => {
    if (service) {
      document.title = service.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', service.metaDescription);
      }
    }
  }, [service]);

  if (!service) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Servicio no encontrado</h1>
            <Link to="/" className="btn-gold">Volver al inicio</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = service.icon;
  const description = get(service.contentKey, '');

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center">
          {service.image ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${service.image})` }}
            >
              <div className="overlay-dark" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-secondary">
              <div className="overlay-dark opacity-50" />
            </div>
          )}

          <div className="relative z-10 container mx-auto px-4 py-32 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <Icon className="w-12 h-12 text-primary" />
            </div>
            
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              {service.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {loading ? '...' : description}
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="section-title">Pedí tu cotización</h2>
                <p className="text-muted-foreground">
                  Completá el formulario y te contactamos con las mejores opciones para tu {service.eventType.toLowerCase()}.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 md:p-8 border border-border">
                <ContactForm selectedEventType={service.eventType as any} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default ServicePage;
