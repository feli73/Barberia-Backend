import { Resend } from "resend";
import dotenv from 'dotenv';

dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);


export async function enviar({ to, subject, text, html }) {

  if (!to || !subject || (!text && !html)) {
    throw new Error("Faltan parámetros al enviar el correo");
  }

  try {

    const info = await resend.emails.send({
      from: "Mi App <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    });

    console.log(info);

    return info;

  } catch (err) {

    console.error(err);

    throw err;

  }

}



