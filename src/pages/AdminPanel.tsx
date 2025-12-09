import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Upload, Trash2, Image as ImageIcon, Users, RefreshCw, FileText, LogOut, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Credenciales hardcodeadas - el cliente puede cambiarlas después
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'urbana2024';

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo_evento: string;
  departamento: string | null;
  invitados: string | null;
  fecha_evento: string | null;
  mensaje: string | null;
  status: string | null;
  created_at: string;
}

interface SiteContent {
  id: string;
  content: string;
}

const contentLabels: Record<string, string> = {
  hero_title: 'Título Principal (Inicio)',
  hero_subtitle: 'Subtítulo (Inicio)',
  hero_benefit_1: 'Beneficio 1',
  hero_benefit_2: 'Beneficio 2',
  hero_benefit_3: 'Beneficio 3',
  about_title: 'Título Nosotros',
  about_text_1: 'Texto Nosotros 1',
  about_text_2: 'Texto Nosotros 2',
  contact_title: 'Título Contacto',
  contact_subtitle: 'Subtítulo Contacto',
  event_casamiento: 'Descripción: Casamiento',
  event_fiesta_empresarial: 'Descripción: Fiesta Empresarial',
  event_despedida: 'Descripción: Despedida de Año',
  event_presentacion: 'Descripción: Presentación de Producto',
  event_capacitacion: 'Descripción: Capacitación',
  event_cumpleanos: 'Descripción: Cumpleaños',
  event_aniversario: 'Descripción: Aniversario Empresarial',
  event_otro: 'Descripción: Otro Evento',
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'content' | 'gallery' | 'leads'>('content');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Check session storage for login state
  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_logged_in');
    if (adminSession === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchGalleryImages();
      fetchLeads();
      fetchSiteContent();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_logged_in', 'true');
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_logged_in');
    setUsername('');
    setPassword('');
  };

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!error && data) {
      setGalleryImages(data);
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setLeads(data);
    }
  };

  const fetchSiteContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('id');
    
    if (!error && data) {
      setSiteContent(data);
    }
  };

  const handleContentChange = (id: string, newContent: string) => {
    setSiteContent(prev => 
      prev.map(item => item.id === id ? { ...item, content: newContent } : item)
    );
  };

  const saveAllContent = async () => {
    setIsSaving(true);
    try {
      for (const item of siteContent) {
        const { error } = await supabase
          .from('site_content')
          .upsert({ id: item.id, content: item.content, updated_at: new Date().toISOString() });
        
        if (error) throw error;
      }
      toast({ title: 'Cambios guardados', description: 'Los textos se actualizaron correctamente.' });
    } catch (err: any) {
      toast({ title: 'Error', description: 'No se pudieron guardar los cambios.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newImageTitle.trim()) {
      toast({ title: 'Error', description: 'Ingresá un título para la imagen.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          title: newImageTitle,
          image_url: publicUrl,
          display_order: galleryImages.length,
        });

      if (insertError) throw insertError;

      toast({ title: 'Imagen subida', description: 'La imagen se agregó a la galería.' });
      setNewImageTitle('');
      fetchGalleryImages();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({ title: 'Error', description: err.message || 'No se pudo subir la imagen.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    try {
      const urlParts = image.image_url.split('/');
      const filePath = urlParts.slice(-2).join('/');

      await supabase.storage.from('gallery').remove([filePath]);

      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      toast({ title: 'Imagen eliminada' });
      fetchGalleryImages();
    } catch (err: any) {
      console.error('Delete error:', err);
      toast({ title: 'Error', description: 'No se pudo eliminar la imagen.', variant: 'destructive' });
    }
  };

  const toggleImageActive = async (image: GalleryImage) => {
    const { error } = await supabase
      .from('gallery_images')
      .update({ is_active: !image.is_active })
      .eq('id', image.id);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar la imagen.', variant: 'destructive' });
    } else {
      fetchGalleryImages();
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-foreground text-background px-6 py-3 rounded-lg mb-4">
                <span className="font-playfair text-lg font-bold tracking-wide">URBANA EVENTOS</span>
              </div>
              <h1 className="font-playfair text-2xl font-semibold text-foreground mb-2">Panel de Administración</h1>
              <p className="text-muted-foreground text-sm">Ingresá tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Usuario</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg input-dark border pl-10"
                    placeholder="Usuario"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg input-dark border"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <p className="text-destructive text-sm text-center">{loginError}</p>
              )}

              <button type="submit" className="btn-gold w-full py-3">
                Ingresar
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-primary hover:underline text-sm">
                ← Volver al sitio
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-foreground text-background px-4 py-2 rounded-lg">
              <span className="font-playfair text-sm font-bold tracking-wide">URBANA EVENTOS</span>
            </div>
            <span className="text-muted-foreground text-sm hidden md:inline">Admin</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="btn-gold-outline text-sm flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Ver sitio
            </button>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors p-2"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'content'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4" /> Textos
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Galería
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" /> Leads ({leads.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-playfair text-xl font-semibold text-primary">Editar Textos del Sitio</h2>
              <button
                onClick={saveAllContent}
                disabled={isSaving}
                className="btn-gold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

            <div className="grid gap-6">
              {/* Inicio Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Sección Inicio
                </h3>
                <div className="space-y-4">
                  {siteContent.filter(c => c.id.startsWith('hero_')).map(item => (
                    <div key={item.id}>
                      <label className="block text-sm text-muted-foreground mb-1">
                        {contentLabels[item.id] || item.id}
                      </label>
                      {item.id === 'hero_subtitle' ? (
                        <textarea
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-lg input-dark border"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nosotros Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Sección Nosotros
                </h3>
                <div className="space-y-4">
                  {siteContent.filter(c => c.id.startsWith('about_')).map(item => (
                    <div key={item.id}>
                      <label className="block text-sm text-muted-foreground mb-1">
                        {contentLabels[item.id] || item.id}
                      </label>
                      <textarea
                        value={item.content}
                        onChange={(e) => handleContentChange(item.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                        rows={item.id === 'about_title' ? 1 : 3}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Eventos Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Descripciones de Eventos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {siteContent.filter(c => c.id.startsWith('event_')).map(item => (
                    <div key={item.id}>
                      <label className="block text-sm text-muted-foreground mb-1">
                        {contentLabels[item.id] || item.id}
                      </label>
                      <textarea
                        value={item.content}
                        onChange={(e) => handleContentChange(item.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contacto Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Sección Contacto
                </h3>
                <div className="space-y-4">
                  {siteContent.filter(c => c.id.startsWith('contact_')).map(item => (
                    <div key={item.id}>
                      <label className="block text-sm text-muted-foreground mb-1">
                        {contentLabels[item.id] || item.id}
                      </label>
                      <textarea
                        value={item.content}
                        onChange={(e) => handleContentChange(item.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                        rows={item.id === 'contact_title' ? 1 : 2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-playfair text-xl font-semibold text-primary mb-4">Subir Nueva Imagen</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  placeholder="Título de la imagen"
                  className="flex-1 px-4 py-3 rounded-lg input-dark border"
                />
                <label className="btn-gold cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className={`bg-card border rounded-xl overflow-hidden ${
                    image.is_active ? 'border-border' : 'border-destructive/50 opacity-60'
                  }`}
                >
                  <div className="aspect-video relative">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    {!image.is_active && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <span className="text-destructive font-medium">Inactiva</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{image.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleImageActive(image)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                          image.is_active
                            ? 'bg-secondary text-foreground hover:bg-secondary/80'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {image.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay imágenes en la galería. Subí una para empezar.
              </div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-playfair text-xl font-semibold text-primary">Consultas Recibidas</h2>
              <button
                onClick={fetchLeads}
                className="btn-gold-outline text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Actualizar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-card border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nombre</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contacto</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Evento</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Depto.</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border hover:bg-card/50">
                      <td className="p-4 text-sm">
                        {new Date(lead.created_at).toLocaleDateString('es-UY', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">{lead.nombre}</div>
                      </td>
                      <td className="p-4 text-sm">
                        <a href={`mailto:${lead.email}`} className="text-primary hover:underline block">
                          {lead.email}
                        </a>
                        <a href={`tel:${lead.telefono}`} className="text-muted-foreground hover:text-foreground">
                          {lead.telefono}
                        </a>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="font-medium">{lead.tipo_evento}</div>
                        {lead.invitados && <div className="text-muted-foreground">{lead.invitados} personas</div>}
                        {lead.fecha_evento && <div className="text-muted-foreground">{lead.fecha_evento}</div>}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {lead.departamento || '-'}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                        {lead.mensaje || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay consultas registradas aún.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
