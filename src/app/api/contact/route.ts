import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, budget, timeline, description } = body;

    await resend.emails.send({
      from: 'Tommy Studio <onboarding@resend.dev>',
      to: 'thomaslefevre1197@gmail.com',
      replyTo: email,
      subject: `Nouveau devis — ${service} · ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f0f17; color: #e2e2f0; border-radius: 12px;">
          <h2 style="color: #6366f1; margin-top: 0;">Nouvelle demande de devis</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #2a2a3e;">
              <td style="padding: 12px 0; color: #9090b0; width: 140px;">Nom</td>
              <td style="padding: 12px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #2a2a3e;">
              <td style="padding: 12px 0; color: #9090b0;">Email</td>
              <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #2a2a3e;">
              <td style="padding: 12px 0; color: #9090b0;">Service</td>
              <td style="padding: 12px 0;">${service}</td>
            </tr>
            ${budget ? `
            <tr style="border-bottom: 1px solid #2a2a3e;">
              <td style="padding: 12px 0; color: #9090b0;">Budget</td>
              <td style="padding: 12px 0;">${budget}</td>
            </tr>` : ''}
            ${timeline ? `
            <tr style="border-bottom: 1px solid #2a2a3e;">
              <td style="padding: 12px 0; color: #9090b0;">Délai souhaité</td>
              <td style="padding: 12px 0;">${timeline}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 24px;">
            <p style="color: #9090b0; margin-bottom: 8px;">Description du projet</p>
            <p style="background: #1a1a2e; padding: 16px; border-radius: 8px; line-height: 1.6; margin: 0;">${description.replace(/\n/g, '<br/>')}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a2a3e; text-align: center;">
            <a href="mailto:${email}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Répondre à ${name}
            </a>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 });
  }
}
