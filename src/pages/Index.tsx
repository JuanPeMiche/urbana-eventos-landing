import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { GallerySection } from '@/components/GallerySection';
import { ServicesSection, EventType } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

const Index = () => {
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);

  return (
    <>
      {/* SEO Meta Tags are in index.html */}
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <ServicesSection onSelectEventType={setSelectedEventType} />
        <ContactSection selectedEventType={selectedEventType} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
