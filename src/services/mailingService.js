import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();



const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  },
});



export async function enviar ({to, subject, text, html }) {

  if(!to || !subject || (!text && !html)){
    throw new Error('Faltan parámetros al enviar el correo');
  }

  try {
         const info = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text, 
    html 
  });

   console.log("Message sent:", info);
     return info;

  } catch(err) {

    console.error('Error al enviar correo')
    throw new Error('No se pudo enviar el correo');
  }

 



};