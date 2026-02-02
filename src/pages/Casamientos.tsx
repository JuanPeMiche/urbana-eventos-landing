import { useEffect } from 'react';
import { Building2, Users, MessageCircle, Heart, Sparkles, Camera, Music } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloatWithTracking } from '@/components/WhatsAppFloatWithTracking';
import { SimpleContactFormWithTracking } from '@/components/SimpleContactFormWithTracking';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useServiceImage } from '@/hooks/useServiceImage';
import { useGoogleAdsTracking } from '@/hooks/useGoogleAdsTracking';
import eventWedding from '@/assets/event-wedding.jpg';
import heroBg from '@/assets/hero-bg.jpg';

const Casamientos = () => {
  const { get } = useSiteContent();
  const { imageUrl } = useServiceImage('casamientos');
  
  // Initialize Google Ads tracking for this section
  useGoogleAdsTracking('casamientos');

  useEffect(() => {
    document.title = 'Salones para Casamientos y Bodas en Montevideo | Urbana Eventos';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Encontrá el salón perfecto para tu casamiento. Salones elegantes y exclusivos para el día más especial de tu vida en Montevideo.');
    }
  }, []);

  const benefits = [
    { icon: Building2, text: get('hero_benefit_1', 'Más de 10 salones a disposición') },
    { icon: Users, text: get('hero_benefit_2', 'Eventos para cualquier capacidad') },
    { icon: MessageCircle, text: get('hero_benefit_3', 'Respuesta rápida por WhatsApp') },
  ];

  const features = [
    { icon: Heart, text: 'Salones elegantes para bodas' },
    { icon: Sparkles, text: 'Espacios con toda la magia' },
    { icon: Camera, text: 'Locaciones perfectas para fotos' },
    { icon: Music, text: 'Equipamiento completo para fiesta' },
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
              {get('page_casamientos_title', 'Salones para Casamientos y Bodas').split(' ').slice(0, 3).join(' ')}{' '}
              <span className="gold-gradient-text">{get('page_casamientos_title', 'Salones para Casamientos y Bodas').split(' ').slice(3).join(' ')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {get('page_casamientos_subtitle', 'El día más especial de tu vida merece el salón perfecto. Te conectamos con los mejores espacios para tu boda.')}
            </p>

            <button
              onClick={scrollToForm}
              className="btn-gold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              Cotizar mi casamiento
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
                  <Heart className="w-10 h-10 text-primary" />
                  <h2 className="section-title mb-0">Tu Boda Perfecta</h2>
                </div>
                
                <p className="text-muted-foreground text-lg mb-6">
                  {get('page_casamientos_text1', 'Sabemos que tu casamiento es un día único e irrepetible. Por eso trabajamos con los mejores salones de Montevideo para ofrecerte opciones que se adapten a tu estilo, presupuesto y cantidad de invitados.')}
                </p>

                <p className="text-muted-foreground mb-8">
                  {get('page_casamientos_text2', 'Desde salones clásicos con jardines hasta espacios modernos con vistas panorámicas, te asesoramos para encontrar el lugar donde celebrar el amor. Dejanos conocer tu visión y hacemos el resto.')}
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
                  src={imageUrl || eventWedding} 
                  alt="Casamiento en salón elegante"
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
                <h2 className="section-title">Cotizá tu casamiento</h2>
                <p className="text-muted-foreground">
                  Completá el formulario y te contactamos con las mejores opciones de salones para tu boda.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 md:p-8 border border-border">
                <SimpleContactFormWithTracking 
                  preselectedEventType="Casamiento" 
                  showEventTypeSelector={false} 
                  trackingSection="casamientos"
                  enableDynamicTracking={true}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloatWithTracking 
        trackingSection="casamientos" 
        enableDynamicTracking={true}
      />
    </>
  );
};

export default Casamientos;
