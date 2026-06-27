import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();



const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: Number(process.env.BREVO_PORT),
  secure: false, // puerto 587
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});



export async function enviar ({to, subject, text, html }) {

  if(!to || !subject || (!text && !html)){
    throw new Error('Faltan parámetros al enviar el correo');
  }

  try {
         const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text, 
    html 
  });

   console.log("Message sent:", info);
     return info;

  } catch(err) {

    console.error('SMTP ERROR:', err.response || err.message || err)
    throw err;
  }

 



};