import appointmentRepository from "../repository/appointmentRepository.js";

class AppointmentService{
  constructor(repository) {
   this.repository = repository;

  }


 create = async (appointmentData, userId) => {

  const existing = await this.repository.findByDate(appointmentData.date);

  if(existing.length > 0) {
      throw new Error('Ya existe un turno en ese horario');

  }

 

   // 👇 Acá es donde convertís la fecha
  const dateLocal = new Date(appointmentData.date);
  const dateUTC = new Date(dateLocal.getTime() - (dateLocal.getTimezoneOffset() * 60000));
  appointmentData.date = dateUTC;

  const newAppointment = {
   
   userId,
   date: appointmentData.date,
   status: 'pending'

  }



 return await  this.repository.create(newAppointment);


 }



 getAll = async () => {

    return await this.repository.getAll();


 } 



 getById = async (id) => {

   return await this.repository.getById(id);

 }


update = async (id, appointmentData) => {

  const dateLocal = new Date(appointmentData.date);
  const dateUTC = new Date(dateLocal.getTime() - (dateLocal.getTimezoneOffset() * 60000));
  appointmentData.date = dateUTC;

    return await this.repository.update(id, appointmentData);


}


delete = async (id) => {

  return await this.repository.delete(id);

}


findByDate = async (date) => {
   
  return await this.repository.findByDate( date )

}


getMyAppointmentByUserId = async (userId) => {

 return await this.repository.getMyAppointmentByUserId( userId );

}


}


const appointmentService = new AppointmentService(appointmentRepository);
export default appointmentService;