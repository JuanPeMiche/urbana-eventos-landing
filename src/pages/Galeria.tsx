import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/imageResolver';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
}

const Galeria = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.title = 'Galería de Salones | Urbana Eventos';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explorá nuestra galería de salones para eventos en Montevideo. Espacios para cumpleaños, casamientos, eventos empresariales y más.');
    }

    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .eq('category', 'salon')
      .order('display_order', { ascending: true });

    if (!error && data) {
      // Resolve asset paths to actual URLs
      const resolvedImages = data.map(img => ({
        ...img,
        image_url: resolveImageUrl(img.image_url)
      }));
      setImages(resolvedImages);
    }
  };

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
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-semibold mb-4">
              Nuestra <span className="gold-gradient-text">Galería</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubrí los espacios que tenemos disponibles para hacer tu evento inolvidable.
            </p>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Cargando galería...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => openLightbox(image, index)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-foreground font-semibold">{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50"
              aria-label="Cerrar"
            >
              <X size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={40} />
            </button>

            <div
              className="max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                <p className="text-white/60 text-sm mt-1">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight size={40} />
            </button>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Galeria;
