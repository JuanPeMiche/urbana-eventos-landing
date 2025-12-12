import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
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
        
        {/* Admin Access Button */}
        <div className="fixed bottom-24 right-6 z-40">
          <Link
            to="/admin"
            className="flex items-center justify-center w-12 h-12 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-card transition-colors"
            title="Panel de Administración"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
