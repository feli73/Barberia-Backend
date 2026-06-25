

class AppointmentDto{
 constructor(appointment){

  this.id = appointment._id,
  this.date = appointment.date,
  this.status = appointment.status,
  this.userId = appointment.userId
  this.email = appointment.userId?.email; // solo funciona si está poblado

  this.first_name = appointment.userId?.first_name || "";
    this.last_name = appointment.userId?.last_name || "";
    this.email = appointment.userId?.email || "";

 }

}



export default AppointmentDto;