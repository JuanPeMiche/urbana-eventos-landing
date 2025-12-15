import { useEffect } from 'react';
import { Building2, Users, MessageCircle, Baby, Shield, PartyPopper, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { SimpleContactForm } from '@/components/SimpleContactForm';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useServiceImage } from '@/hooks/useServiceImage';
import eventInfantiles from '@/assets/event-infantiles.jpg';
import heroBg from '@/assets/hero-bg.jpg';

const CumpleanosInfantiles = () => {
  const { get } = useSiteContent();
  const { imageUrl } = useServiceImage('infantiles');

  useEffect(() => {
    document.title = 'Salones para Cumpleaños Infantiles en Montevideo | Urbana Eventos';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Encontrá el salón perfecto para cumpleaños infantiles. Espacios seguros, divertidos y equipados para que los más chicos disfruten.');
    }
  }, []);

  const benefits = [
    { icon: Building2, text: get('hero_benefit_1', 'Más de 10 salones a disposición') },
    { icon: Users, text: get('hero_benefit_2', 'Eventos para cualquier capacidad') },
    { icon: MessageCircle, text: get('hero_benefit_3', 'Respuesta rápida por WhatsApp') },
  ];

  const features = [
    { icon: Shield, text: 'Espacios seguros y controlados para niños' },
    { icon: PartyPopper, text: 'Opciones de animación y entretenimiento' },
    { icon: Sparkles, text: 'Decoración temática disponible' },
    { icon: Users, text: 'Áreas cómodas para adultos acompañantes' },
  ];

  const scrollToForm = () => {
    const element = document.querySelector('#cotizar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
          >
            <div className="overlay-dark" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-24 text-center">
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-6 gold-gradient-text">
              URBANA EVENTOS
            </h2>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
              {get('page_infantiles_title', 'Salones para Cumpleaños Infantiles').split(' ').slice(0, 3).join(' ')}{' '}
              <span className="gold-gradient-text">{get('page_infantiles_title', 'Salones para Cumpleaños Infantiles').split(' ').slice(3).join(' ')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {get('page_infantiles_subtitle', 'Espacios mágicos donde los más chicos son los protagonistas. Seguros, divertidos y equipados para una fiesta inolvidable.')}
            </p>

            <button
              onClick={scrollToForm}
              className="btn-gold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              Cotizar cumpleaños infantil
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border">
            <div className="container mx-auto px-4 py-4 sm:py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-center gap-3">
                    <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium text-sm sm:text-base">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Baby className="w-10 h-10 text-primary" />
                  <h2 className="section-title mb-0">Cumpleaños Infantiles</h2>
                </div>
                
                <p className="text-muted-foreground text-lg mb-6">
                  {get('page_infantiles_text1', 'En Urbana Eventos sabemos que el cumpleaños de tu hijo es un día muy especial. Por eso ofrecemos salones pensados para que los más pequeños disfruten en un ambiente seguro, amplio y divertido.')}
                </p>

                <p className="text-muted-foreground mb-8">
                  {get('page_infantiles_text2', 'Contamos con opciones de catering infantil, animación profesional, decoración temática y todo lo que necesitás para que sea una fiesta inolvidable. Los adultos también tienen su espacio para disfrutar mientras los niños se divierten.')}
                </p>

                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl overflow-hidden h-[400px]">
                <img 
                  src={imageUrl || eventInfantiles} 
                  alt="Cumpleaños infantil en salón"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="cotizar" className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="section-title">Cotizá el cumpleaños infantil</h2>
                <p className="text-muted-foreground">
                  Completá el formulario y te contactamos con las mejores opciones de salones.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 md:p-8 border border-border">
                <SimpleContactForm preselectedEventType="Cumpleaños infantil" showEventTypeSelector={false} />
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

export default CumpleanosInfantiles;
