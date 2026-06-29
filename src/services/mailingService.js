import dotenv from "dotenv";
import { BrevoClient } from "@getbrevo/brevo";

dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export async function enviar({ to, subject, text, html }) {
  if (!to || !subject || (!text && !html)) {
    throw new Error("Faltan parámetros al enviar el correo");
  }

  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Barbería",
        email: process.env.EMAIL_FROM,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      textContent: text,
      htmlContent: html,
    });

    console.log("Email enviado:", response);
    return response;
  } catch (err) {
    console.error("BREVO ERROR:", err);
    throw err;
  }
}