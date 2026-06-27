import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from "dns";

dotenv.config();


dns.lookup("smtp.gmail.com", { all: true }, (err, addresses) => {
  console.log("SMTP DNS:", err, addresses);
});


// 🔥 FIX IMPORTANTE para IPv6 en Render
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
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

    console.error('SMTP ERROR:', err.response || err.message || err)
    throw err;
  }

 



};