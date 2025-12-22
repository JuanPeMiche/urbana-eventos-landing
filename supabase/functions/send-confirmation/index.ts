import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadEmailRequest {
  nombre: string;
  email: string;
  telefono: string;
  tipoEvento: string;
  departamento?: string;
  invitados?: string;
  fecha?: string;
  mensaje?: string;
  serviceTag?: string;
  paginaOrigen?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: LeadEmailRequest = await req.json();
    console.log("Received lead data:", data);

    const serviceTag = data.serviceTag || data.tipoEvento || 'General';
    const paginaOrigen = data.paginaOrigen || 'No especificada';
    const timestamp = new Date().toLocaleString('es-UY', { 
      timeZone: 'America/Montevideo',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // WhatsApp link para responder al cliente
    const whatsappLink = `https://wa.me/${data.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${data.nombre}, soy de Urbana Eventos. Recibimos tu consulta sobre ${serviceTag}. `)}`;

    // Send confirmation email to the lead
    const confirmationEmail = await resend.emails.send({
      from: "Urbana Eventos <no-reply@urbanaeventos.uy>",
      to: [data.email],
      subject: `¡Recibimos tu consulta! - ${serviceTag} - Urbana Eventos`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #141414;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #c9a553, #d4b366); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: #141414; font-size: 28px; font-weight: 600;">URBANA EVENTOS</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #c9a553; margin-top: 0; font-size: 24px;">¡Hola ${data.nombre}!</h2>
                
                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                  Recibimos tu consulta y estamos muy emocionados de ayudarte a organizar tu evento.
                </p>
                
                <div style="background-color: #242424; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #c9a553;">
                  <h3 style="color: #c9a553; margin-top: 0; font-size: 18px;">Resumen de tu consulta:</h3>
                  <p style="color: #b0b0b0; margin: 8px 0;"><strong style="color: #e0e0e0;">Servicio:</strong> ${serviceTag}</p>
                  <p style="color: #b0b0b0; margin: 8px 0;"><strong style="color: #e0e0e0;">Tipo de evento:</strong> ${data.tipoEvento}</p>
                  ${data.departamento ? `<p style="color: #b0b0b0; margin: 8px 0;"><strong style="color: #e0e0e0;">Departamento:</strong> ${data.departamento}</p>` : ''}
                  ${data.invitados ? `<p style="color: #b0b0b0; margin: 8px 0;"><strong style="color: #e0e0e0;">Cantidad de invitados:</strong> ${data.invitados}</p>` : ''}
                  ${data.fecha ? `<p style="color: #b0b0b0; margin: 8px 0;"><strong style="color: #e0e0e0;">Fecha tentativa:</strong> ${data.fecha}</p>` : ''}
                  ${data.mensaje ? `<p style="color: #b0b0b0; margin: 8px 0;"><strong style="color: #e0e0e0;">Mensaje:</strong> ${data.mensaje}</p>` : ''}
                </div>
                
                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                  Nuestro equipo se pondrá en contacto contigo a la brevedad para brindarte las mejores opciones de salones para tu evento.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://wa.me/59897979905?text=Hola,%20hice%20una%20consulta%20por%20el%20formulario%20sobre%20${encodeURIComponent(serviceTag)}" 
                     style="display: inline-block; background: linear-gradient(135deg, #c9a553, #d4b366); color: #141414; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #141414; padding: 25px; text-align: center; border-top: 1px solid #333;">
                <p style="color: #888; font-size: 14px; margin: 0;">
                  Urbana Eventos - Gestión de salones y eventos
                </p>
                <p style="color: #666; font-size: 12px; margin: 10px 0 0;">
                  Montevideo, Uruguay | +598 97 979 905
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    // Send notification email to the business with serviceTag in subject
    const notificationEmail = await resend.emails.send({
      from: "Urbana Eventos <no-reply@urbanaeventos.uy>",
      to: ["afrutos.seguridad@gmail.com"],
      subject: `[Urbana Eventos] Lead - ${serviceTag}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: #c9a553; color: #141414; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 20px;">Nueva consulta - ${serviceTag}</h1>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Servicio:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; color: #c9a553; font-weight: bold;">${serviceTag}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Página origen:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${paginaOrigen}</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Nombre:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.nombre}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="tel:${data.telefono}" style="color: #333;">${data.telefono}</a></td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}" style="color: #333;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Tipo de evento:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.tipoEvento}</td>
              </tr>
              ${data.departamento ? `
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Departamento:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.departamento}</td>
              </tr>
              ` : ''}
              ${data.invitados ? `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Invitados:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.invitados}</td>
              </tr>
              ` : ''}
              ${data.fecha ? `
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Fecha:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.fecha}</td>
              </tr>
              ` : ''}
              ${data.mensaje ? `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Mensaje:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${data.mensaje}</td>
              </tr>
              ` : ''}
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Fecha/hora:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${timestamp}</td>
              </tr>
            </table>
            
            <div style="margin-top: 25px; text-align: center;">
              <a href="${whatsappLink}" 
                 style="display: inline-block; background-color: #25D366; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                📱 Responder por WhatsApp
              </a>
            </div>
            
            <div style="margin-top: 15px; text-align: center;">
              <a href="mailto:${data.email}?subject=Re: Consulta sobre ${serviceTag} - Urbana Eventos" 
                 style="display: inline-block; background-color: #c9a553; color: #141414; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
                ✉️ Responder por Email
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    return new Response(
      JSON.stringify({ success: true, confirmationEmail, notificationEmail }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
