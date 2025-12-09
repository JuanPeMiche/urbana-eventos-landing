import { useState, useEffect } from 'react';
import { Send, Mail } from 'lucide-react';
import { EventType } from './ServicesSection';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
}

const WHATSAPP_NUMBER = '+598096303705';
const WHATSAPP_BASE_URL = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(WHATSAPP_NUMBER)}&type=phone_number&app_absent=0`;
const GMAIL_ADDRESS = 'facudasilvaa@gmail.com';

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

export const ContactForm = ({ selectedEventType }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent, contactMethod: 'whatsapp' | 'gmail') => {
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

    setIsSubmitting(true);

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
        await supabase.functions.invoke('send-confirmation', {
          body: {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            tipoEvento: formData.tipoEvento,
            departamento: formData.departamento,
            invitados: formData.invitados,
            fecha: formData.fecha,
            mensaje: formData.mensaje,
          },
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }

      // Track conversion - Google Ads placeholder
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          event_category: 'lead',
          event_label: formData.tipoEvento,
        });
      }

      if (contactMethod === 'whatsapp') {
        const message = `Hola, soy ${formData.nombre}. Quiero organizar un *${formData.tipoEvento}* ${formData.departamento ? `en ${formData.departamento}` : ''} para ${formData.invitados || 'cantidad a definir'} personas, el ${formData.fecha || 'fecha a definir'}. Mis datos de contacto son ${formData.telefono} / ${formData.email}. ${formData.mensaje ? `Mensaje adicional: ${formData.mensaje}` : ''}`;
        const whatsappUrl = `${WHATSAPP_BASE_URL}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast({
          title: '¡Mensaje enviado!',
          description: 'Te redirigimos a WhatsApp para completar tu consulta.',
        });
      } else {
        const subject = encodeURIComponent(`Consulta: ${formData.tipoEvento} - ${formData.nombre}`);
        const body = encodeURIComponent(
          `Hola,\n\nSoy ${formData.nombre} y quiero organizar un ${formData.tipoEvento}.\n\n` +
          `Departamento: ${formData.departamento || 'A definir'}\n` +
          `Cantidad de invitados: ${formData.invitados || 'A definir'}\n` +
          `Fecha tentativa: ${formData.fecha || 'A definir'}\n\n` +
          `${formData.mensaje ? `Mensaje adicional: ${formData.mensaje}\n\n` : ''}` +
          `Mis datos de contacto:\n` +
          `Teléfono: ${formData.telefono}\n` +
          `Email: ${formData.email}\n\n` +
          `Quedo a la espera de su respuesta.\n` +
          `Saludos.`
        );
        const gmailUrl = `mailto:${GMAIL_ADDRESS}?subject=${subject}&body=${body}`;
        window.location.href = gmailUrl;
        toast({
          title: '¡Abriendo correo!',
          description: 'Se abrirá tu aplicación de correo para enviar el mensaje.',
        });
      }

      // Reset form
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
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu consulta. Intentá nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'whatsapp')}
          disabled={isSubmitting}
          className="bg-[#25D366] text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? 'Enviando...' : 'Contactar por WhatsApp'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'gmail')}
          disabled={isSubmitting}
          className="btn-gold flex items-center justify-center gap-2 py-4 disabled:opacity-50"
        >
          <Mail className="w-5 h-5" />
          {isSubmitting ? 'Enviando...' : 'Contactar por Email'}
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
  googleTagId?: string;
}

export const QuickContactBlock = ({
  eventType,
  title,
  description,
  googleTagId,
}: QuickContactBlockProps) => {
  const handleWhatsAppClick = () => {
    const message = `Hola, me interesa organizar un ${eventType}. ¿Podrían asesorarme?`;
    const whatsappUrl = `${WHATSAPP_BASE_URL}&text=${encodeURIComponent(message)}`;

    // Track specific conversion
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        event_category: 'lead',
        event_label: eventType,
      });
    }

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-6 border border-border">
      <h4 className="font-playfair text-xl font-semibold text-primary mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <button
        onClick={handleWhatsAppClick}
        className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-[#20bd5a]"
        data-event-type={eventType}
        data-google-conversion-id={googleTagId || ''}
        data-google-conversion-label=""
      >
        <Send className="w-5 h-5" />
        WhatsApp {eventType}
      </button>
    </div>
  );
};
