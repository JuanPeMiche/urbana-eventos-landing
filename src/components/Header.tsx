import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Galería', href: '/galeria' },
];

const serviceItems = [
  { label: 'Cumpleaños', href: '/cumpleanos' },
  { label: 'Infantiles', href: '/cumpleanos-infantiles' },
  { label: 'Casamientos', href: '/casamientos' },
  { label: 'Empresariales', href: '/eventos-empresariales' },
  { label: 'Despedidas', href: '/despedidas-de-ano' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isServiceActive = serviceItems.some(item => location.pathname === item.href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-playfair text-xl md:text-2xl font-semibold gold-gradient-text"
        >
          Urbana Eventos
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`nav-link text-sm font-medium tracking-wide ${
                  location.pathname === item.href ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Services Dropdown */}
          <li className="relative">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              onBlur={() => setTimeout(() => setIsServicesOpen(false), 150)}
              className={`nav-link text-sm font-medium tracking-wide flex items-center gap-1 ${
                isServiceActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
              }`}
            >
              Servicios
              <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isServicesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-xl py-2 min-w-[180px]">
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`block px-4 py-2 text-sm hover:bg-secondary/50 transition-colors ${
                      location.pathname === item.href ? 'text-primary' : 'text-foreground/80'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Contact Button - Desktop */}
        <div className="hidden lg:block">
          <Link
            to="/#contacto"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-gold text-sm px-6 py-2"
          >
            Contacto
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-lg border-t border-border">
          <ul className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 text-base font-medium ${
                    location.pathname === item.href ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            
            {/* Services in mobile */}
            <li className="border-t border-border pt-2 mt-2">
              <span className="block py-2 text-xs uppercase tracking-wider text-muted-foreground">Servicios</span>
              {serviceItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 pl-4 text-base ${
                    location.pathname === item.href ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </li>
            
            <li className="pt-4 border-t border-border mt-2">
              <Link
                to="/#contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-gold block text-center"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
