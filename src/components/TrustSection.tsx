import { Building2, Clock, Users, Shield } from 'lucide-react';

const trustItems = [
  {
    icon: Building2,
    title: '+10 Salones',
    description: 'Aliados exclusivos en Montevideo',
  },
  {
    icon: Clock,
    title: 'Años de Experiencia',
    description: 'Conectando eventos perfectos',
  },
  {
    icon: Users,
    title: 'Atención Personalizada',
    description: 'Te guiamos en todo el proceso',
  },
  {
    icon: Shield,
    title: 'Acuerdos Directos',
    description: 'Mejores precios garantizados',
  },
];

export const TrustSection = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-primary mb-2">
            ¿Por qué elegirnos?
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
