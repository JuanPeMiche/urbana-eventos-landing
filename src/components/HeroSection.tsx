import { Building2, Users, MessageCircle } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const benefits = [
  { icon: Building2, text: 'Más de 10 salones aliados' },
  { icon: Users, text: 'Eventos para cualquier capacidad' },
  { icon: MessageCircle, text: 'Respuesta rápida por WhatsApp' },
];

export const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        {/* Logo Badge */}
        <div className="inline-block bg-foreground text-background px-8 py-4 rounded-lg mb-8 animate-fade-in">
          <span className="font-playfair text-2xl md:text-3xl font-bold tracking-wide">URBANA EVENTOS</span>
        </div>

        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Organizamos tu evento ideal,{' '}
          <span className="gold-gradient-text">vos solo disfrutá</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Contanos qué evento querés hacer y nosotros te asignamos el salón perfecto: 
          cumpleaños, casamientos, eventos empresariales y más.
        </p>

        <button
          onClick={scrollToContact}
          className="btn-gold text-lg px-8 py-4 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Quiero cotizar mi evento
        </button>
      </div>

      {/* Benefits Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center gap-3">
                <benefit.icon className="w-6 h-6 text-primary" />
                <span className="text-foreground font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
