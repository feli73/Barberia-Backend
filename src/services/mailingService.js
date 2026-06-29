import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function enviar({ to, subject, text, html }) {
  if (!to || !subject || (!text && !html)) {
    throw new Error("Faltan parámetros al enviar el correo");
  }

  try {
    const email = new Brevo.SendSmtpEmail();

    email.sender = {
      email: process.env.EMAIL_FROM,
      name: "Barbería",
    };

    email.to = [
      {
        email: to,
      },
    ];

    email.subject = subject;
    email.textContent = text;
    email.htmlContent = html;

    const info = await apiInstance.sendTransacEmail(email);

    console.log("Message sent:", info);

    return info;
  } catch (err) {
    console.error(
      "BREVO ERROR:",
      err.response?.body || err.message || err
    );
    throw err;
  }
}