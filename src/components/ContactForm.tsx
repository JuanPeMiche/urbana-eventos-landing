import { useState, useEffect } from 'react';
import { Send, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { EventType } from './ServicesSection';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackConversion, TrackingSection } from '@/lib/googleAdsTracking';
import { WHATSAPP_BASE_URL } from '@/lib/contactConstants';

const EVENT_TYPE_OPTIONS: EventType[] = [
  'Casamiento',
  'Fiesta empresarial',
  'Despedida de año',
  'Presentación de producto',
  'Capacitación',
  'Cumpleaños privado',
  'Aniversario empresarial',
  'Otro',
];

interface ContactFormProps {
  selectedEventType: EventType | null;
  trackingSection?: TrackingSection;
  serviceTag?: string;
}

const DEPARTAMENTOS = [
  'Montevideo',
  'Canelones',
  'Maldonado',
  'Colonia',
  'San José',
  'Rocha',
  'Paysandú',
  'Salto',
  'Rivera',
  'Tacuarembó',
  'Cerro Largo',
  'Artigas',
  'Durazno',
  'Flores',
  'Florida',
  'Lavalleja',
  'Río Negro',
  'Soriano',
  'Treinta y Tres',
];

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export const ContactForm = ({ selectedEventType, trackingSection = 'general', serviceTag = 'Home' }: ContactFormProps) => {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipoEvento: '' as EventType | '',
    departamento: '',
    invitados: '',
    fecha: '',
    mensaje: '',
  });

  useEffect(() => {
    if (selectedEventType) {
      setFormData((prev) => ({ ...prev, tipoEvento: selectedEventType }));
    }
  }, [selectedEventType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, contactMethod: 'whatsapp' | 'email') => {
    e.preventDefault();

    // Validation
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.tipoEvento) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completá todos los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor ingresá un email válido.',
        variant: 'destructive',
      });
      return;
    }

    setFormStatus('loading');

    try {
      // Save lead to database
      const { error } = await supabase.from('leads').insert({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        tipo_evento: formData.tipoEvento,
        departamento: formData.departamento || null,
        invitados: formData.invitados || null,
        fecha_evento: formData.fecha || null,
        mensaje: formData.mensaje || null,
      });

      if (error) {
        console.error('Error saving lead:', error);
      }

      // Send confirmation email via edge function
      try {
        const emailResult = await supabase.functions.invoke('send-confirmation', {
          body: {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            tipoEvento: formData.tipoEvento,
            departamento: formData.departamento,
            invitados: formData.invitados,
            fecha: formData.fecha,
            mensaje: formData.mensaje,
            serviceTag: serviceTag,
            paginaOrigen: window.location.pathname,
          },
        });
        console.log('Email sent result:', emailResult);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }

      // Track conversion
      const channel = contactMethod === 'whatsapp' ? 'wpp' : 'mail';
      trackConversion(trackingSection, channel);

      if (contactMethod === 'whatsapp') {
        // Abrir WhatsApp con mensaje prellenado
        const message = `Hola, soy ${formData.nombre}. Servicio: ${serviceTag}. Quiero organizar un *${formData.tipoEvento}* ${formData.departamento ? `en ${formData.departamento}` : ''} para ${formData.invitados || 'cantidad a definir'} personas, el ${formData.fecha || 'fecha a definir'}. Mis datos: ${formData.telefono} / ${formData.email}. ${formData.mensaje ? `Mensaje: ${formData.mensaje}` : ''}`;
        const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }

      // Mostrar estado de éxito
      setFormStatus('success');
      
      toast({
        title: '¡Consulta enviada!',
        description: 'Ya recibimos tu consulta. En breve nos comunicamos.',
      });

    } catch (err) {
      console.error('Error:', err);
      setFormStatus('error');
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu consulta. Intentá nuevamente.',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsAppAfterSubmit = () => {
    const message = `Hola, soy ${formData.nombre}. Servicio: ${serviceTag}. Acabo de enviar un formulario y quisiera información sobre salones.`;
    const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetForm = () => {
    setFormStatus('idle');
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      tipoEvento: '',
      departamento: '',
      invitados: '',
      fecha: '',
      mensaje: '',
    });
  };

  // Estado de éxito - Mostrar mensaje y opción de WhatsApp
  if (formStatus === 'success') {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            ¡Gracias! Ya recibimos tu consulta.
          </h3>
          <p className="text-muted-foreground">
            En breve nos comunicamos contigo.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppAfterSubmit}
            className="w-full bg-[#25D366] text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Enviar también por WhatsApp
          </button>
          
          <button
            onClick={resetForm}
            className="w-full btn-gold py-3"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  const isLoading = formStatus === 'loading';

  return (
    <form className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-1">
            Nombre y apellido *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg input-dark border"
            placeholder="Tu nombre completo"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg input-dark border"
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-foreground mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg input-dark border"
            placeholder="+598 99 123 456"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="tipoEvento" className="block text-sm font-medium text-foreground mb-1">
            Tipo de evento *
          </label>
          <select
            id="tipoEvento"
            name="tipoEvento"
            value={formData.tipoEvento}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg input-dark border"
            required
            disabled={isLoading}
          >
            <option value="">Seleccioná una opción</option>
            {EVENT_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="departamento" className="block text-sm font-medium text-foreground mb-1">
            Departamento del evento
          </label>
          <select
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg input-dark border"
            disabled={isLoading}
          >
            <option value="">Seleccioná un departamento</option>
            {DEPARTAMENTOS.map((depto) => (
              <option key={depto} value={depto}>
                {depto}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="invitados" className="block text-sm font-medium text-foreground mb-1">
            Cantidad estimada de invitados
          </label>
          <input
            type="text"
            id="invitados"
            name="invitados"
            value={formData.invitados}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg input-dark border"
            placeholder="Ej: 50-80 personas"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="fecha" className="block text-sm font-medium text-foreground mb-1">
          Fecha tentativa del evento
        </label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg input-dark border"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-1">
          Mensaje / detalles adicionales
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 rounded-lg input-dark border resize-none"
          placeholder="Contanos más detalles sobre tu evento..."
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          id={`wpp-${trackingSection}`}
          onClick={(e) => handleSubmit(e, 'whatsapp')}
          disabled={isLoading}
          className="bg-[#25D366] text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          data-conversion-name={`${trackingSection}_wpp`}
          data-section={trackingSection}
          data-channel="whatsapp"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isLoading ? 'Enviando...' : 'Contactar por WhatsApp'}
        </button>
        <button
          type="button"
          id={`mail-${trackingSection}`}
          onClick={(e) => handleSubmit(e, 'email')}
          disabled={isLoading}
          className="btn-gold flex items-center justify-center gap-2 py-4 disabled:opacity-50"
          data-conversion-name={`${trackingSection}_mail`}
          data-section={trackingSection}
          data-channel="email"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Mail className="w-5 h-5" />
          )}
          {isLoading ? 'Enviando...' : 'Contactar por Email'}
        </button>
      </div>
    </form>
  );
};

// Quick contact blocks for specific event types
interface QuickContactBlockProps {
  eventType: EventType;
  title: string;
  description: string;
  trackingSection?: TrackingSection;
  serviceTag?: string;
}

export const QuickContactBlock = ({
  eventType,
  title,
  description,
  trackingSection = 'general',
  serviceTag = 'Home',
}: QuickContactBlockProps) => {
  const handleWhatsAppClick = () => {
    const message = `Hola, vengo desde Urbana Eventos. Servicio: ${serviceTag}. Me interesa organizar un ${eventType}. ¿Podrían asesorarme?`;
    const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;

    // Track specific conversion
    trackConversion(trackingSection, 'wpp');

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-6 border border-border">
      <h4 className="font-playfair text-xl font-semibold text-primary mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <button
        onClick={handleWhatsAppClick}
        id={`quick-wpp-${trackingSection}`}
        className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-[#20bd5a]"
        data-event-type={eventType}
        data-conversion-name={`${trackingSection}_wpp_quick`}
        data-section={trackingSection}
        data-channel="whatsapp"
      >
        <Send className="w-5 h-5" />
        WhatsApp {eventType}
      </button>
    </div>
  );
};
