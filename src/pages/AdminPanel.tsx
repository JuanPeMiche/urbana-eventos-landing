import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Simple hardcoded auth - replace with real auth in production
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'urbana2024';

interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    benefits: string[];
  };
  about: {
    title: string;
    description: string;
    features: string[];
  };
  contact: {
    title: string;
    subtitle: string;
  };
}

const defaultContent: ContentData = {
  hero: {
    title: 'Organizamos tu evento ideal, vos solo disfrutá',
    subtitle: 'Contanos qué evento querés hacer y nosotros te asignamos el salón perfecto: cumpleaños, casamientos, eventos empresariales y más.',
    benefits: ['Más de 10 salones aliados', 'Eventos de 30 a 200+ personas', 'Respuesta rápida por WhatsApp'],
  },
  about: {
    title: '¿Quiénes Somos?',
    description: 'Somos una central especializada en conectar personas con salones de eventos de forma fácil, rápida y segura. Te escuchamos, analizamos tu evento y te guiamos hacia la mejor opción disponible.',
    features: ['Analizamos tu tipo de evento y preferencias', 'Propuesta personalizada del salón ideal', 'Acuerdos directos con los mejores salones', 'Acompañamiento en todo el proceso'],
  },
  contact: {
    title: 'Pedí tu propuesta para el salón ideal',
    subtitle: 'Completá el formulario con los detalles de tu evento y nuestro equipo te contactará con la mejor propuesta de salón y costos.',
  },
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<ContentData>(defaultContent);

  useEffect(() => {
    // Check if already logged in
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Load saved content
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      toast({ title: 'Bienvenido', description: 'Has iniciado sesión correctamente.' });
    } else {
      toast({ title: 'Error', description: 'Usuario o contraseña incorrectos.', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    toast({ title: 'Sesión cerrada' });
  };

  const handleSave = () => {
    localStorage.setItem('siteContent', JSON.stringify(content));
    toast({ title: 'Cambios guardados', description: 'Los cambios se reflejarán en la página.' });
  };

  const updateContent = (section: keyof ContentData, field: string, value: string | string[]) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
          <h1 className="font-playfair text-2xl font-semibold text-primary text-center mb-6">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground text-center mb-8">Urbana Eventos</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg input-dark border"
                placeholder="Usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg input-dark border"
                placeholder="Contraseña"
              />
            </div>
            <button type="submit" className="btn-gold w-full">
              Iniciar Sesión
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full text-muted-foreground hover:text-primary text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" /> Ver sitio público
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-playfair text-xl font-semibold text-primary">
            Admin - Urbana Eventos
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="btn-gold-outline text-sm flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Ver sitio
            </button>
            <button
              onClick={handleSave}
              className="btn-gold text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-playfair text-xl font-semibold text-primary mb-4">Sección Inicio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Título principal</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => updateContent('hero', 'title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg input-dark border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subtítulo</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Beneficios (uno por línea)
                </label>
                <textarea
                  value={content.hero.benefits.join('\n')}
                  onChange={(e) => updateContent('hero', 'benefits', e.target.value.split('\n'))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                />
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-playfair text-xl font-semibold text-primary mb-4">Sección Nosotros</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Título</label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) => updateContent('about', 'title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg input-dark border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
                <textarea
                  value={content.about.description}
                  onChange={(e) => updateContent('about', 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Características (una por línea)
                </label>
                <textarea
                  value={content.about.features.join('\n')}
                  onChange={(e) => updateContent('about', 'features', e.target.value.split('\n'))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                />
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-playfair text-xl font-semibold text-primary mb-4">Sección Contacto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Título</label>
                <input
                  type="text"
                  value={content.contact.title}
                  onChange={(e) => updateContent('contact', 'title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg input-dark border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subtítulo</label>
                <textarea
                  value={content.contact.subtitle}
                  onChange={(e) => updateContent('contact', 'subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                />
              </div>
            </div>
          </section>

          {/* Instructions */}
          <div className="bg-secondary/30 border border-border rounded-xl p-6">
            <h3 className="font-semibold text-foreground mb-2">Instrucciones</h3>
            <ul className="text-muted-foreground text-sm space-y-1">
              <li>• Los cambios se guardan en el navegador (localStorage).</li>
              <li>• Hacé clic en "Guardar" para aplicar los cambios.</li>
              <li>• Para agregar imágenes personalizadas, contactá al desarrollador.</li>
              <li>• Usuario: admin / Contraseña: urbana2024</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
