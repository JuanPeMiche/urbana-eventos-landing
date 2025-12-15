import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { Baby, PartyPopper, Shield, Users } from 'lucide-react';
import { useServiceImage } from '@/hooks/useServiceImage';
import { useSiteContent } from '@/hooks/useSiteContent';
import eventBirthday from '@/assets/event-birthday.jpg';

const CumpleanosInfantiles = () => {
  const { imageUrl, isLoading } = useServiceImage('infantiles');
  const { get } = useSiteContent();
  
  const whatsappNumber = "59899123456";
  const whatsappMessage = encodeURIComponent("Hola! Me interesa consultar por un cumpleaños infantil");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const features = [
    {
      icon: Shield,
      title: 'Espacios Seguros',
      description: 'Ambientes controlados y seguros para que los niños jueguen libremente.',
    },
    {
      icon: PartyPopper,
      title: 'Animación Incluida',
      description: 'Opciones de animadores, juegos y entretenimiento para todas las edades.',
    },
    {
      icon: Users,
      title: 'Para Toda la Familia',
      description: 'Salones cómodos donde los adultos también disfrutan del evento.',
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src={imageUrl || eventBirthday}
              alt="Cumpleaños Infantiles"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = eventBirthday;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center pt-20">
            <Baby className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {get('page_infantiles_title', 'Cumpleaños Infantiles')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {get('page_infantiles_subtitle', 'Espacios mágicos donde los más chicos son los protagonistas')}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg prose-invert mx-auto mb-12">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {get('page_infantiles_text1', 'En Urbana Eventos sabemos que el cumpleaños de tu hijo es un día muy especial. Por eso ofrecemos salones pensados para que los más pequeños disfruten en un ambiente seguro, amplio y divertido.')}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mt-4">
                  {get('page_infantiles_text2', 'Contamos con opciones de catering infantil, animación profesional, decoración temática y todo lo que necesitás para que sea una fiesta inolvidable. Los adultos también tienen su espacio para disfrutar mientras los niños se divierten.')}
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="bg-card border border-border rounded-xl p-6 text-center">
                    <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center gap-3 text-lg px-8 py-4"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
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
