import { enviar } from "../services/mailingService.js";
import AppointmentModel from "../dao/models/appointmentModel.js";
import AppointmentDto from "../dtos/appointmentDto.js";

class MailController{
  constructor() {

  }


  sendMail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await enviar({ to, subject, text });
    res.status(200).send("Correo enviado correctamente ✅");
  }catch(error) {

    console.error(error);
    res.status(500).send("Error al enviar el correo ❌")

  }


  }





 confirmarTurno = async (req, res) => {

  try {
      const appointment = await AppointmentModel.findById(req.params.id).populate('userId');
      if (!appointment) return res.status(404).send("Turno no encontrado");


      const dto = new AppointmentDto(appointment);


     appointment.status = "confirmed";
     await appointment.save();

     await enviar({ 
      
       to: appointment.userId.email, 
       subject: "Confirmación de turno en Barbería",
       text: `Tu turno para el día ${appointment.date.toLocaleDateString()} a las ${appointment.date.toLocaleTimeString()} ha sido confirmado.`,
       html: `<p>Hola</p>
              <p>Tu turno para el <strong>${appointment.date.toLocaleDateString()}</strong> a las <strong>${appointment.date.toLocaleTimeString()} a sido confirmado</strong>  </p>
              <a href="${process.env.BACKEND_URL}api/mail/appointments/${appointment._id}/cancel"
                style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
                Cancelar turno
              </a>

              <a href="${process.env.BACKEND_URL}api/mail/appointments/${appointment._id}/confirm"
                style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">
                Confirmar turno
              </a>

              <p>¡Gracias por elegirnos!</p>
              `
      });

      res.status(200).send("Turno confirmado y correo enviado");

    } catch (error) {



    }

 }




cancelarElTurno = async (req, res) => {

 try {

  const appointment = await AppointmentModel.findByIdAndDelete(req.params.id);
  if(!appointment) return res.status(404).send("Turno no encontrado");

  res.status(200).send("Turno eliminado y horario liberado");
 } catch(error) {
  console.error(error);
  res.status(500).send("Error al eliminar turno X")

 }

} 




}


const mailController = new MailController();

export default mailController;