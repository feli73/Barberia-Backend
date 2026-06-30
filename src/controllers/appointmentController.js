import appointmentService from "../services/appointmentServices.js";
import AppointmentModel from "../dao/models/appointmentModel.js";
import { enviar } from "../services/mailingService.js";
import jwt from "jsonwebtoken";

class AppointmentController{
  constructor(service){

    this.service = service;
  }



  create = async (req, res) => {

   try {

     const { date } = req.body;


     const dateObj = new Date(req.body.date);



     if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          status: "error",
          message: "Fecha inválida"
        });
      }


     dateObj.setSeconds(0, 0);
     req.body.date = dateObj;

      const existing = await AppointmentModel.findOne({
        date: dateObj
      });

      if (existing) {
        return res.status(400).json({
          status: "error",
          message: "Ese horario está ocupado, por favor elegí otro."
        });
      }

      const result = await this.service.create(req.body, req.user._id); // usar _id del dto
      const appointment = await AppointmentModel.findById(result.id).populate("userId");

      
      const all = await AppointmentModel.find({});
      all.forEach(a => console.log(a.date.toISOString()));

      const confirmToken = jwt.sign(
        { appointmentId: appointment._id, action: "confirm" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const cancelToken = jwt.sign(
        { appointmentId: appointment._id, action: "cancel" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      await appointment.save();

      const to = appointment.userId.email;
      const subject = "Reserva de turno en Barbería";
      const html = `
        <p>Hola ${req.user.name || ""}</p>
        <p>Has reservado un turno para el <strong>${new Date(result.date).toLocaleDateString("es-AR", {timeZone: "America/Argentina/Buenos_Aires",})}</strong> a las <strong>${new Date(result.date).toLocaleTimeString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires", hour: "2-digit", minute: "2-digit",})}</strong>.</p>
        <p>Por favor confirmá o cancelá tu turno en los siguientes enlaces:</p>
        <a href="${process.env.BACKEND_URL}/api/appointment/${result.id}/confirm?token=${confirmToken}"
           style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">
           Confirmar turno
        </a>
        <a href="${process.env.BACKEND_URL}/api/appointment/${result.id}/cancel?token=${cancelToken}"
           style="display:inline-block;padding:10px 20px;background:#dc3545;color:#fff;text-decoration:none;border-radius:5px;">
           Cancelar turno
        </a>
      `;

      await enviar({ to, subject, html });

      res.status(201).json({ status: "success", payload: result, message: "Tu turno fue registrado correctamente", });
    } catch (err) {
      console.log(err);


     if (err.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "Ese horario ya está reservado"
    });
    }

      res.status(500).json({ status: "error", message: "Error al crear el turno" });
    }
  };

  
 getAll = async (req, res) => {

  try {
     const result = await this.service.getAll();
     res.json({ status: 'success', payload: result });


  } catch(err) {

    res.status(500).json({ status: 'error', message: 'Error al acceder a los turnos' });

  }


 }




 getAllAdmin = async (req, res) => {
  try {
    const result = await AppointmentModel.find({})
      .populate("userId", "first_name last_name email");
    res.json({ status: 'success', payload: result });
  } catch(err) {
    res.status(500).json({ status: 'error', message: 'Error al acceder a los turnos' });
  }
}


  getById = async (req, res) => {

    try { 
       const result = await this.service.getById(req.params.id);
      
       if(!result) {
       return res.status(404).json({ status: 'error', message: 'Turno no encontrado' })

      }
      
      
       res.json({ status: 'success', payload: result });
    
    } catch(err) {
     res.status(500).json({ status: 'error', message: 'Error al acceder al turno' });

    } 

  }




  getByIdAdmin = async(req, res) => {

  try {

    const result = await AppointmentModel.findById(req.params.id).populate("userId", "first_name last_name email")
    
    if(!result) {
      return res.status(404).json({ status: 'error', message: 'Turno no encontrado' })
    }
    
    res.json({ status: 'success', payload: result })

  } catch(err) {
   res.status(500).json({ status:'error', message:'Error al acceder al turno' })


  }


  }






 


  update = async (req, res) => {

    try {
     const result = await this.service.update(req.params.id, req.body);
     res.json({ status: 'success', payload: result });

    } catch(err){

     res.status(500).json({ status: 'error', message: 'Error al actualizar el turno' });

    }

  }


  delete = async (req, res) => {

   try {
     const result = await this.service.delete(req.params.id);
     
    
    
     if(!result) {
        return res.status(404).json({ status: 'error', message: 'turno no encontrado'})
     }


     res.json({ status: 'success', payload: result });

   } catch(err) {

      res.status(500).json({ status: 'error', message: 'Error al eliminar el turno' })
   }

  }


 getMyAppointmentByUserId = async (req, res) => {

  try {
    const result = await this.service.getMyAppointmentByUserId(req.user._id); //  viene del token JWT, representa el id del usuario autenticado.

    if(!result || result.length === 0){
        return res.status(404).json({ status: 'error', message: 'No tenes turno reservado' })
    }

    res.json({ status: 'success', payload: result });


  } catch(err) {
   console.error(err);
   res.status(500).json({ status: 'error', message: 'Error al acceder al turno' })

  }

 }

 


confirmarTurno = async (req, res) => {

  try {

    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.action !== "confirm") return res.status(403).send("Token inválido")

      const appointment = await AppointmentModel.findById(decoded.appointmentId).populate('userId');
      if (!appointment) return res.status(404).send("Turno no encontrado");



     appointment.status = "confirmed";
     await appointment.save();





     

      res.status(200).json({ status: "success",message: 'Tu turno ya fue confirmado, gracias' ,  payload: appointment,  });

    } catch (error) {

    console.error(error);
    res.status(500).send({ status: 'error', message: "Error al confirmar turno"});

    }

 };




cancelarElTurno = async (req, res) => {

 try {


  const { token } = req.query;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);


      if(decoded.action !== "cancel") return res.status(403).send("Token inválido");

  const appointment = await AppointmentModel.findByIdAndDelete(decoded.appointmentId);
  if(!appointment) return res.status(404).send("Turno no encontrado");


    

  res.status(200).json({ status: 'success', message: 'Turno cancelado y eliminado correctamente' ,payload: appointment  });
 } catch(error) {
  console.error(error);
  res.status(500).send("Error al eliminar turno X")

 }

} 




 

}


const appointmentController = new AppointmentController(appointmentService);
export default appointmentController;
