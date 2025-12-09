import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Salón Elegante',
    description: 'Espacio ideal para casamientos y eventos formales con capacidad para 150 personas.',
    image: gallery1,
    category: 'Casamientos',
  },
  {
    id: '2',
    title: 'Salón Corporativo',
    description: 'Perfecto para conferencias, presentaciones y eventos empresariales.',
    image: gallery2,
    category: 'Empresarial',
  },
  {
    id: '3',
    title: 'Jardín con Vista',
    description: 'Hermoso jardín al atardecer para celebraciones íntimas al aire libre.',
    image: gallery3,
    category: 'Cumpleaños',
  },
  {
    id: '4',
    title: 'Gran Salón de Fiestas',
    description: 'Amplio salón con pista de baile para eventos de hasta 200 personas.',
    image: gallery4,
    category: 'Fiestas',
  },
  {
    id: '5',
    title: 'Espacio Rústico',
    description: 'Ambiente cálido con estilo industrial para celebraciones únicas.',
    image: gallery5,
    category: 'Privado',
  },
  {
    id: '6',
    title: 'Terraza Rooftop',
    description: 'Exclusiva terraza con vistas a la ciudad para eventos VIP.',
    image: gallery6,
    category: 'Exclusivo',
  },
];

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <section id="galeria" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Nuestros Salones</h2>
          <p className="section-subtitle">
            Conocé algunos de los espacios exclusivos con los que trabajamos en Montevideo.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer card-hover"
              onClick={() => openLightbox(image, index)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                  {image.category}
                </span>
                <h3 className="font-playfair text-lg font-semibold text-foreground">
                  {image.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-foreground hover:text-primary transition-colors p-2"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation - Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 text-foreground hover:text-primary transition-colors p-2 bg-card/50 rounded-full"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image Container */}
          <div
            className="max-w-5xl max-h-[85vh] mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <span className="text-xs text-primary font-medium uppercase tracking-wider">
                {selectedImage.category}
              </span>
              <h3 className="font-playfair text-2xl font-semibold text-foreground mt-1">
                {selectedImage.title}
              </h3>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                {selectedImage.description}
              </p>
              <div className="text-sm text-muted-foreground mt-4">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>

          {/* Navigation - Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 text-foreground hover:text-primary transition-colors p-2 bg-card/50 rounded-full"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </section>
  );
};
