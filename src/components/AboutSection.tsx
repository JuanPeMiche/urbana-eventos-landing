import { CheckCircle } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import aboutTeam from '@/assets/about-team.jpg';

const features = [
  'Analizamos tu tipo de evento y preferencias',
  'Propuesta personalizada del salón ideal',
  'Acuerdos directos con los mejores salones',
  'Acompañamiento en todo el proceso',
];

export const AboutSection = () => {
  const { get, loading } = useSiteContent();

  return (
    <section id="nosotros" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 md:order-1">
            <img
              src={aboutTeam}
              alt="Equipo de Urbana Eventos planificando"
              className="rounded-lg shadow-lg w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-lg -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <h2 className="section-title text-left">
              {get('about_title', '¿Quiénes Somos?')}
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              {get('about_text_1', 'Somos una central especializada en conectar personas con salones de eventos de forma fácil, rápida y segura. Te escuchamos, analizamos tu evento y te guiamos hacia la mejor opción disponible.')}
            </p>
            <p className="text-muted-foreground mb-8">
              {get('about_text_2', 'Trabajamos con salones exclusivos en Montevideo con los que tenemos acuerdos directos. Cada evento es único, por eso evaluamos cantidad de personas, preferencia (parrillero, formal, empresarial) y presupuesto para proponerte el salón ideal.')}
            </p>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
