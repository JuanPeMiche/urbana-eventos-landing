import { Phone, Mail, MapPin, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=%2B59897979905&text&type=phone_number&app_absent=0';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-semibold text-primary mb-4">
              Urbana Eventos
            </h3>
            <p className="text-muted-foreground text-sm">
              Gestión de salones y eventos en Montevideo. Conectamos personas con el espacio 
              perfecto para cada celebración.
            </p>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cumpleanos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Cumpleaños
                </Link>
              </li>
              <li>
                <Link to="/casamientos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Casamientos
                </Link>
              </li>
              <li>
                <Link to="/eventos-empresariales" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Eventos Empresariales
                </Link>
              </li>
              <li>
                <Link to="/despedidas-de-ano" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Despedidas de Año
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +598 97 979 905
                </a>
              </li>
              <li>
                <a
                  href="mailto:afrutos.seguridad@gmail.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  afrutos.seguridad@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                Montevideo, Uruguay
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {currentYear} Urbana Eventos – Gestión de salones y eventos
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs"
            >
              <Settings className="w-3 h-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
