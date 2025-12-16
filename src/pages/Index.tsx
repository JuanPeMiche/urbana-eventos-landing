import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ServiceCards } from '@/components/ServiceCards';
import { TrustSection } from '@/components/TrustSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { useUrlSection } from '@/hooks/useUrlSection';

const Index = () => {
  // Permite scroll automático desde URL: /?section=contacto
  useUrlSection();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        {/* Sección de servicios con ID para landing desde Google Ads */}
        <section id="servicios">
          <ServiceCards />
        </section>
        <TrustSection />
        <ContactSection selectedEventType={null} />
      </main>
      <Footer />
      <WhatsAppFloat trackingSection="general" />
    </>
  );
};

export default Index;
