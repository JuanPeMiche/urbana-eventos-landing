import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ServiceCards } from '@/components/ServiceCards';
import { TrustSection } from '@/components/TrustSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

const Index = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServiceCards />
        <TrustSection />
        <ContactSection selectedEventType={null} />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
