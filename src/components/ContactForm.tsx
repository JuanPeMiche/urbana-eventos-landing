import { useState, useEffect, useMemo } from 'react';
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

interface FieldErrors {
  email?: string;
  telefono?: string;
  invitados?: string;
  fecha?: string;
}

// Funciones de validación
const validateEmail = (email: string): string | undefined => {
  if (!email) return undefined;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Ingresá un email válido (ej: tu@email.com)';
  }
  return undefined;
};

const validatePhone = (phone: string): string | undefined => {
  if (!phone) return undefined;
  const phoneDigits = phone.replace(/[^0-9]/g, '');
  if (phoneDigits.length < 8 || !/^[+\d\s()-]+$/.test(phone)) {
    return 'Ingresá un teléfono válido (ej: +598 99 123 456)';
  }
  return undefined;
};

const validateInvitados = (invitados: string): string | undefined => {
  if (!invitados) return undefined;
  if (/[a-zA-Z]/.test(invitados)) {
    return 'Solo se permiten números';
  }
  const num = parseInt(invitados.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num) || num <= 0) {
    return 'Ingresá un número positivo';
  }
  return undefined;
};

const validateFecha = (fecha: string): string | undefined => {
  if (!fecha) return undefined;
  const selectedDate = new Date(fecha);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate <= today) {
    return 'La fecha debe ser posterior a hoy';
  }
  return undefined;
};

// Obtener fecha mínima (mañana)
const getMinDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const ContactForm = ({ selectedEventType, trackingSection = 'general', serviceTag = 'Home' }: ContactFormProps) => {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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

  const minDate = useMemo(() => getMinDate(), []);

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

    // Validación en tiempo real
    let error: string | undefined;
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'telefono':
        error = validatePhone(value);
        break;
      case 'invitados':
        error = validateInvitados(value);
        break;
      case 'fecha':
        error = validateFecha(value);
        break;
    }
    
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent, contactMethod: 'whatsapp' | 'email') => {
    e.preventDefault();

    // Validation - campos requeridos
    if (!formData.nombre || !formData.email || !formData.telefono || !formData.tipoEvento) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completá todos los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    // Validar todos los campos
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.telefono);
    const invitadosError = validateInvitados(formData.invitados);
    const fechaError = validateFecha(formData.fecha);

    const errors: FieldErrors = {
      email: emailError,
      telefono: phoneError,
      invitados: invitadosError,
      fecha: fechaError,
    };

    setFieldErrors(errors);

    // Si hay errores, mostrar toast y no enviar
    if (emailError || phoneError || invitadosError || fechaError) {
      toast({
        title: 'Corregí los errores',
        description: 'Hay campos con errores. Revisá los mensajes en rojo.',
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

  const resetForm = () => {
    setFormStatus('idle');
    setFieldErrors({});
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
        
        <button
          onClick={resetForm}
          className="w-full btn-gold py-3"
        >
          Enviar otra consulta
        </button>
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
            className={`w-full px-4 py-3 rounded-lg input-dark border ${fieldErrors.email ? 'border-red-500' : ''}`}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
          )}
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
            className={`w-full px-4 py-3 rounded-lg input-dark border ${fieldErrors.telefono ? 'border-red-500' : ''}`}
            placeholder="+598 99 123 456"
            required
            disabled={isLoading}
          />
          {fieldErrors.telefono && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.telefono}</p>
          )}
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
            type="number"
            id="invitados"
            name="invitados"
            value={formData.invitados}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-3 rounded-lg input-dark border ${fieldErrors.invitados ? 'border-red-500' : ''}`}
            placeholder="Ej: 50"
            disabled={isLoading}
          />
          {fieldErrors.invitados && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.invitados}</p>
          )}
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
          min={minDate}
          className={`w-full px-4 py-3 rounded-lg input-dark border ${fieldErrors.fecha ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {fieldErrors.fecha && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.fecha}</p>
        )}
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