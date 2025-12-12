import { useEffect } from 'react';
import { Building2, Users, MessageCircle, PartyPopper, Sparkles, Wine, Music } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { SimpleContactForm } from '@/components/SimpleContactForm';
import { useSiteContent } from '@/hooks/useSiteContent';
import heroBg from '@/assets/hero-bg.jpg';

const DespedidasDeAno = () => {
  const { get } = useSiteContent();

  useEffect(() => {
    document.title = 'Salones para Despedidas de Año Empresariales en Montevideo | Urbana Eventos';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Cerrá el año con estilo. Salones ideales para despedidas de año empresariales y fiestas de fin de año en Montevideo.');
    }
  }, []);

  const benefits = [
    { icon: Building2, text: get('hero_benefit_1', 'Más de 10 salones a disposición') },
    { icon: Users, text: get('hero_benefit_2', 'Eventos para cualquier capacidad') },
    { icon: MessageCircle, text: get('hero_benefit_3', 'Respuesta rápida por WhatsApp') },
  ];

  const features = [
    { icon: PartyPopper, text: 'Espacios festivos y elegantes' },
    { icon: Sparkles, text: 'Ambientes decorados para celebrar' },
    { icon: Wine, text: 'Opciones de catering y bebidas' },
    { icon: Music, text: 'Pistas de baile y música en vivo' },
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
              {get('page_despedidas_title', 'Salones para Despedidas de Año').split(' ').slice(0, 2).join(' ')}{' '}
              <span className="gold-gradient-text">{get('page_despedidas_title', 'Salones para Despedidas de Año').split(' ').slice(2).join(' ')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {get('page_despedidas_subtitle', 'Cerrá el año con estilo junto a tu equipo. Te conectamos con los mejores salones para tu fiesta de fin de año.')}
            </p>

            <button
              onClick={scrollToForm}
              className="btn-gold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              Cotizar despedida de año
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
                  <PartyPopper className="w-10 h-10 text-primary" />
                  <h2 className="section-title mb-0">Fin de Año Inolvidable</h2>
                </div>
                
                <p className="text-muted-foreground text-lg mb-6">
                  {get('page_despedidas_text1', 'Las despedidas de año son el momento perfecto para agradecer a tu equipo y celebrar los logros del año. Te ayudamos a encontrar el salón ideal para que sea una noche memorable.')}
                </p>

                <p className="text-muted-foreground mb-8">
                  {get('page_despedidas_text2', 'Desde fiestas íntimas hasta grandes celebraciones empresariales, contamos con opciones para todos los presupuestos y estilos. Nuestros salones aliados ofrecen todo lo necesario para cerrar el año a lo grande.')}
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

              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center h-[400px]">
                <div className="text-center p-8">
                  <PartyPopper className="w-24 h-24 text-primary mx-auto mb-4" />
                  <p className="text-foreground text-xl font-playfair">
                    ¡Reservá tu salón para fin de año!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="cotizar" className="py-16 md:py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="section-title">Cotizá tu despedida de año</h2>
                <p className="text-muted-foreground">
                  Completá el formulario y te contactamos con las mejores opciones para tu fiesta.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 md:p-8 border border-border">
                <SimpleContactForm preselectedEventType="Despedida de año" showEventTypeSelector={false} />
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

export default DespedidasDeAno;
