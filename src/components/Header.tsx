import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Galería', href: '/galeria' },
  { label: 'Cumpleaños', href: '/cumpleanos' },
  { label: 'Casamientos', href: '/casamientos' },
  { label: 'Empresariales', href: '/eventos-empresariales' },
  { label: 'Despedidas', href: '/despedidas-de-ano' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-playfair text-xl sm:text-2xl md:text-3xl font-semibold gold-gradient-text"
        >
          Urbana Eventos
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`nav-link text-sm uppercase tracking-wider ${
                  location.pathname === item.href ? 'text-primary' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact & Admin Buttons - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/#contacto"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-gold text-sm"
          >
            Contacto
          </Link>
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider"
          >
            Admin
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
          <ul className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-link block py-2 text-lg ${
                    location.pathname === item.href ? 'text-primary' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 flex flex-col gap-3">
              <Link
                to="/#contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-gold block text-center"
              >
                Contacto
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-primary transition-colors text-center py-2"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
