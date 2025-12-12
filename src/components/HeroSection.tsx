import { Building2, Users, MessageCircle } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import heroBg from '@/assets/hero-bg.jpg';

export const HeroSection = () => {
  const { get, loading } = useSiteContent();

  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    { icon: Building2, text: get('hero_benefit_1', 'Más de 10 salones a disposición') },
    { icon: Users, text: get('hero_benefit_2', 'Eventos para cualquier capacidad') },
    { icon: MessageCircle, text: get('hero_benefit_3', 'Respuesta rápida por WhatsApp') },
  ];

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="overlay-dark" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        {/* Logo Badge - Gold text, no white background */}
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-8 animate-fade-in gold-gradient-text">
          URBANA EVENTOS
        </h2>

        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.1s' }}>
          {loading ? (
            'Organizamos tu evento ideal, vos solo disfrutá'
          ) : (
            <>
              {get('hero_title', 'Organizamos tu evento ideal, vos solo disfrutá').split(',')[0]},{' '}
              <span className="gold-gradient-text">
                {get('hero_title', 'Organizamos tu evento ideal, vos solo disfrutá').split(',')[1] || 'vos solo disfrutá'}
              </span>
            </>
          )}
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {get('hero_subtitle', 'Contanos qué evento querés hacer y nosotros te asignamos el salón perfecto: cumpleaños, casamientos, eventos empresariales y más.')}
        </p>

        <button
          onClick={scrollToContact}
          className="btn-gold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Quiero cotizar mi evento
        </button>
      </div>

      {/* Benefits Strip */}
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
  );
};
