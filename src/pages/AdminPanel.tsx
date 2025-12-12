import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Upload, Trash2, Image as ImageIcon, Users, RefreshCw, FileText, LogOut, Lock, Loader2, Layers, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/lib/imageCompression';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableImageCard } from '@/components/admin/SortableImageCard';

// Credenciales hardcodeadas del administrador
const ADMIN_USERNAME = 'adminUrbana';
const ADMIN_PASSWORD = '#UrbanaEventos2025';
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
  // Páginas de servicios
  page_cumpleanos_title: 'Página Cumpleaños - Título',
  page_cumpleanos_subtitle: 'Página Cumpleaños - Subtítulo',
  page_cumpleanos_text1: 'Página Cumpleaños - Texto 1',
  page_cumpleanos_text2: 'Página Cumpleaños - Texto 2',
  page_casamientos_title: 'Página Casamientos - Título',
  page_casamientos_subtitle: 'Página Casamientos - Subtítulo',
  page_casamientos_text1: 'Página Casamientos - Texto 1',
  page_casamientos_text2: 'Página Casamientos - Texto 2',
  page_empresariales_title: 'Página Empresariales - Título',
  page_empresariales_subtitle: 'Página Empresariales - Subtítulo',
  page_empresariales_text1: 'Página Empresariales - Texto 1',
  page_empresariales_text2: 'Página Empresariales - Texto 2',
  page_despedidas_title: 'Página Despedidas - Título',
  page_despedidas_subtitle: 'Página Despedidas - Subtítulo',
  page_despedidas_text1: 'Página Despedidas - Texto 1',
  page_despedidas_text2: 'Página Despedidas - Texto 2',
};

const serviceCategories = [
  { id: 'casamientos', label: 'Casamientos' },
  { id: 'empresariales', label: 'Fiesta Empresarial' },
  { id: 'despedidas', label: 'Despedida de Año' },
  { id: 'presentaciones', label: 'Presentación de Producto' },
  { id: 'capacitaciones', label: 'Capacitación' },
  { id: 'cumpleanos', label: 'Cumpleaños Privado' },
  { id: 'aniversarios', label: 'Aniversario Empresarial' },
  { id: 'otros', label: 'Otro' },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'content' | 'gallery' | 'services' | 'leads'>('content');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [serviceImages, setServiceImages] = useState<GalleryImage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingService, setIsUploadingService] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newServiceImageTitle, setNewServiceImageTitle] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('casamientos');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Check session storage for login state and auto-login to Supabase
  useEffect(() => {
    const checkAuth = async () => {
      const adminSession = sessionStorage.getItem('admin_logged_in');
      if (adminSession === 'true') {
        setIsLoggedIn(true);
        // Auto sign-in to Supabase with the admin account for storage operations
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Sign in as admin for RLS
          await supabase.auth.signInWithPassword({
            email: 'admin@urbanaeventos.com',
            password: ADMIN_PASSWORD,
          });
        }
      }
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchGalleryImages();
      fetchServiceImages();
      fetchLeads();
      fetchSiteContent();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    // Check hardcoded credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Sign in to Supabase with admin account for RLS operations
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'admin@urbanaeventos.com',
          password: ADMIN_PASSWORD,
        });
        
        // If admin account doesn't exist, create it
        if (error?.message?.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'admin@urbanaeventos.com',
            password: ADMIN_PASSWORD,
          });
          
          if (signUpError) throw signUpError;
          
          // Add admin role
          if (signUpData.user) {
            await supabase
              .from('user_roles')
              .insert({ user_id: signUpData.user.id, role: 'admin' });
          }
        }
      } catch (err) {
        console.error('Supabase auth error:', err);
        // Continue anyway - hardcoded login is valid
      }

      setIsLoggedIn(true);
      sessionStorage.setItem('admin_logged_in', 'true');
      toast({ title: 'Bienvenido', description: 'Sesión iniciada correctamente' });
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_logged_in');
    setUsername('');
    setPassword('');
    toast({ title: 'Sesión cerrada' });
  };

  const fetchGalleryImages = async () => {
    setIsLoadingGallery(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('category', 'salon')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setGalleryImages(data || []);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      toast({ title: 'Error', description: 'No se pudieron cargar las imágenes de galería.', variant: 'destructive' });
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const fetchServiceImages = async () => {
    setIsLoadingServices(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .neq('category', 'salon')
        .not('category', 'is', null)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setServiceImages(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast({ title: 'Error', description: 'No se pudieron cargar las imágenes de servicios.', variant: 'destructive' });
    } finally {
      setIsLoadingServices(false);
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
      // Compress the image
      toast({ title: 'Comprimiendo imagen...', description: 'Optimizando para web.' });
      const compressedFile = await compressImage(file);
      
      const fileName = `${Date.now()}.webp`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          title: newImageTitle,
          image_url: publicUrl,
          category: 'salon',
          display_order: galleryImages.length,
        });

      if (insertError) throw insertError;

      toast({ title: 'Imagen subida', description: 'La imagen se comprimió y agregó a la galería.' });
      setNewImageTitle('');
      fetchGalleryImages();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({ title: 'Error', description: err.message || 'No se pudo subir la imagen.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newServiceImageTitle.trim()) {
      toast({ title: 'Error', description: 'Ingresá un título para la imagen.', variant: 'destructive' });
      return;
    }

    setIsUploadingService(true);
    try {
      // Compress the image
      toast({ title: 'Comprimiendo imagen...', description: 'Optimizando para web.' });
      const compressedFile = await compressImage(file);
      
      const fileName = `${Date.now()}.webp`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const existingForCategory = serviceImages.filter(img => img.category === selectedServiceCategory);

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          title: newServiceImageTitle,
          image_url: publicUrl,
          category: selectedServiceCategory,
          display_order: existingForCategory.length,
        });

      if (insertError) throw insertError;

      toast({ title: 'Imagen subida', description: `La imagen se comprimió y agregó a ${serviceCategories.find(c => c.id === selectedServiceCategory)?.label}.` });
      setNewServiceImageTitle('');
      fetchServiceImages();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({ title: 'Error', description: err.message || 'No se pudo subir la imagen.', variant: 'destructive' });
    } finally {
      setIsUploadingService(false);
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
      fetchServiceImages();
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
      fetchServiceImages();
    }
  };

  const handleGalleryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = galleryImages.findIndex((img) => img.id === active.id);
      const newIndex = galleryImages.findIndex((img) => img.id === over.id);
      
      const newOrder = arrayMove(galleryImages, oldIndex, newIndex);
      setGalleryImages(newOrder);

      // Update display_order in database
      try {
        for (let i = 0; i < newOrder.length; i++) {
          await supabase
            .from('gallery_images')
            .update({ display_order: i })
            .eq('id', newOrder[i].id);
        }
        toast({ title: 'Orden actualizado' });
      } catch (err) {
        console.error('Error updating order:', err);
        fetchGalleryImages(); // Revert on error
      }
    }
  };

  const handleServiceDragEnd = async (event: DragEndEvent, category: string) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const categoryImages = serviceImages.filter(img => img.category === category);
      const oldIndex = categoryImages.findIndex((img) => img.id === active.id);
      const newIndex = categoryImages.findIndex((img) => img.id === over.id);
      
      const newCategoryOrder = arrayMove(categoryImages, oldIndex, newIndex);
      
      // Update the full service images array
      const otherImages = serviceImages.filter(img => img.category !== category);
      setServiceImages([...otherImages, ...newCategoryOrder]);

      // Update display_order in database
      try {
        for (let i = 0; i < newCategoryOrder.length; i++) {
          await supabase
            .from('gallery_images')
            .update({ display_order: i })
            .eq('id', newCategoryOrder[i].id);
        }
        toast({ title: 'Orden actualizado' });
      } catch (err) {
        console.error('Error updating order:', err);
        fetchServiceImages(); // Revert on error
      }
    }
  };

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              <button type="submit" disabled={isLoggingIn} className="btn-gold w-full py-3 flex items-center justify-center gap-2">
                {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoggingIn ? 'Ingresando...' : 'Ingresar'}
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
              <ImageIcon className="w-4 h-4" /> Galería ({galleryImages.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'services'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-4 h-4" /> Servicios ({serviceImages.length})
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

              {/* Páginas de Servicios Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Páginas de Servicios
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Editá los textos de las páginas individuales de cada servicio (/cumpleanos, /casamientos, etc.)
                </p>
                
                {/* Cumpleaños */}
                <div className="border-b border-border pb-4 mb-4">
                  <h4 className="text-sm font-medium text-primary mb-3">🎂 Página Cumpleaños</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {siteContent.filter(c => c.id.startsWith('page_cumpleanos_')).map(item => (
                      <div key={item.id}>
                        <label className="block text-sm text-muted-foreground mb-1">
                          {contentLabels[item.id] || item.id}
                        </label>
                        <textarea
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                          rows={item.id.includes('title') ? 1 : 3}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Casamientos */}
                <div className="border-b border-border pb-4 mb-4">
                  <h4 className="text-sm font-medium text-primary mb-3">💒 Página Casamientos</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {siteContent.filter(c => c.id.startsWith('page_casamientos_')).map(item => (
                      <div key={item.id}>
                        <label className="block text-sm text-muted-foreground mb-1">
                          {contentLabels[item.id] || item.id}
                        </label>
                        <textarea
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                          rows={item.id.includes('title') ? 1 : 3}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empresariales */}
                <div className="border-b border-border pb-4 mb-4">
                  <h4 className="text-sm font-medium text-primary mb-3">🏢 Página Eventos Empresariales</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {siteContent.filter(c => c.id.startsWith('page_empresariales_')).map(item => (
                      <div key={item.id}>
                        <label className="block text-sm text-muted-foreground mb-1">
                          {contentLabels[item.id] || item.id}
                        </label>
                        <textarea
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                          rows={item.id.includes('title') ? 1 : 3}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Despedidas */}
                <div>
                  <h4 className="text-sm font-medium text-primary mb-3">🎉 Página Despedidas de Año</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {siteContent.filter(c => c.id.startsWith('page_despedidas_')).map(item => (
                      <div key={item.id}>
                        <label className="block text-sm text-muted-foreground mb-1">
                          {contentLabels[item.id] || item.id}
                        </label>
                        <textarea
                          value={item.content}
                          onChange={(e) => handleContentChange(item.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
                          rows={item.id.includes('title') ? 1 : 3}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-playfair text-xl font-semibold text-primary">Galería del Salón</h2>
                <p className="text-muted-foreground text-sm mt-1">Arrastrá las imágenes para reordenarlas</p>
              </div>
              <button
                onClick={fetchGalleryImages}
                disabled={isLoadingGallery}
                className="btn-gold-outline text-sm flex items-center gap-2"
              >
                {isLoadingGallery ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Actualizar
              </button>
            </div>

            {/* Upload Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-2">Subir Nueva Imagen de Salón</h3>
              <div className="bg-muted/30 rounded-lg p-4 mb-4 text-sm">
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">Instrucciones:</strong>
                </p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>Título:</strong> Nombre descriptivo del salón (ej: "Gran Salón Principal", "Terraza Rooftop")</li>
                  <li><strong>Formatos aceptados:</strong> JPG, PNG, WEBP (máx. 10MB)</li>
                  <li>Las imágenes se comprimen automáticamente a formato WebP</li>
                </ul>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  placeholder="Ej: Salón Elegante, Terraza con Vista..."
                  className="flex-1 px-4 py-3 rounded-lg input-dark border"
                />
                <label className="btn-gold cursor-pointer flex items-center gap-2 justify-center">
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Comprimiendo...' : 'Subir Imagen'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingGallery && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando imágenes...</span>
              </div>
            )}

            {/* Gallery Grid with Drag and Drop */}
            {!isLoadingGallery && galleryImages.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleGalleryDragEnd}
              >
                <SortableContext
                  items={galleryImages.map(img => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image) => (
                      <SortableImageCard
                        key={image.id}
                        image={image}
                        onToggleActive={toggleImageActive}
                        onDelete={handleDeleteImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {!isLoadingGallery && galleryImages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay imágenes en la galería. Subí una para empezar.
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-playfair text-xl font-semibold text-primary">Imágenes de Servicios (Organizamos)</h2>
                <p className="text-muted-foreground text-sm mt-1">Arrastrá las imágenes para reordenarlas dentro de cada categoría</p>
              </div>
              <button
                onClick={fetchServiceImages}
                disabled={isLoadingServices}
                className="btn-gold-outline text-sm flex items-center gap-2"
              >
                {isLoadingServices ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Actualizar
              </button>
            </div>

            {/* Upload Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-2">Subir Imagen para un Servicio</h3>
              <div className="bg-muted/30 rounded-lg p-4 mb-4 text-sm">
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">Instrucciones:</strong>
                </p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>Categoría:</strong> Seleccioná el tipo de evento al que corresponde la imagen</li>
                  <li><strong>Título:</strong> Descripción breve (ej: "Boda elegante", "Cumpleaños con amigos")</li>
                  <li><strong>Formatos:</strong> JPG, PNG, WEBP (máx. 10MB) - se comprimen automáticamente</li>
                </ul>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={selectedServiceCategory}
                  onChange={(e) => setSelectedServiceCategory(e.target.value)}
                  className="px-4 py-3 rounded-lg input-dark border"
                >
                  {serviceCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newServiceImageTitle}
                  onChange={(e) => setNewServiceImageTitle(e.target.value)}
                  placeholder="Ej: Evento de gala, Fiesta corporativa..."
                  className="px-4 py-3 rounded-lg input-dark border"
                />
                <label className="btn-gold cursor-pointer flex items-center gap-2 justify-center">
                  <Upload className="w-4 h-4" />
                  {isUploadingService ? 'Comprimiendo...' : 'Subir Imagen'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleServiceImageUpload}
                    disabled={isUploadingService}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingServices && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Cargando imágenes...</span>
              </div>
            )}

            {/* Services Images by Category with Drag and Drop */}
            {!isLoadingServices && serviceCategories.map(category => {
              const categoryImages = serviceImages.filter(img => img.category === category.id);
              if (categoryImages.length === 0) return null;
              
              return (
                <div key={category.id} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {category.label} ({categoryImages.length})
                  </h3>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleServiceDragEnd(event, category.id)}
                  >
                    <SortableContext
                      items={categoryImages.map(img => img.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryImages.map((image) => (
                          <SortableImageCard
                            key={image.id}
                            image={image}
                            onToggleActive={toggleImageActive}
                            onDelete={handleDeleteImage}
                            compact
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              );
            })}

            {!isLoadingServices && serviceImages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-2">No hay imágenes de servicios.</p>
                <p className="text-sm">Subí imágenes para cada tipo de evento que ofrecés.</p>
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
