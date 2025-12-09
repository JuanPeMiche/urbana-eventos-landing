import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Eye, Upload, Trash2, Image as ImageIcon, Users, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'gallery' | 'leads'>('gallery');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchGalleryImages();
      fetchLeads();
    }
  }, [isAdmin]);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching gallery:', error);
    } else {
      setGalleryImages(data || []);
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
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

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({ title: 'Sesión cerrada' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-playfair text-2xl font-semibold text-primary mb-4">Acceso Restringido</h1>
          <p className="text-muted-foreground mb-6">
            Tu cuenta no tiene permisos de administrador.
          </p>
          <button onClick={handleLogout} className="btn-gold-outline">
            Cerrar Sesión
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
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Galería
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
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
