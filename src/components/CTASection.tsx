import { Link } from 'react-router-dom';

export const CTASection = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-playfair text-2xl md:text-4xl font-semibold text-foreground mb-4">
            ¿Listo para organizar tu evento?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Contanos sobre tu evento y te contactamos con las mejores opciones de salones disponibles.
          </p>
          <button
            onClick={scrollToContact}
            className="btn-gold text-lg px-8 py-4"
          >
            Contactar ahora
          </button>
        </div>
      </div>
    </section>
  );
};
