import appointmentManager from "../dao/managers/appointmentManager.js";
import AppointmentDto from "../dtos/appointmentDto.js";


class AppointmentRepository{
 constructor(manager){
    this.manager = manager
 }



 create = async (appointmentData) => {

  const doc = await this.manager.create(appointmentData)
  return new AppointmentDto(doc);
 }


 getAll = async () => {

  const docs = await this.manager.getAll();
  return  docs.map(doc => new AppointmentDto(doc));

 }



 getById = async (id) => {

  const doc = await this.manager.getById(id);
  return doc ? new AppointmentDto(doc) : null ;

 }


 update = async (id, appointmentData) => {

  const doc = await this.manager.update(id, appointmentData);
  return doc ? new AppointmentDto(doc) : null;

 }


 delete = async (id) => {

  
    const doc = await this.manager.delete(id);
    return doc ? new AppointmentDto(doc) : null;

 }







findByDate = async (date) => {
  const docs = await this.manager.findByDate( date ); 
  return docs.map(doc => new AppointmentDto(doc));
};



getMyAppointmentByUserId = async (userId) => {

const docs = await this.manager.getMyAppointmentByUserId( userId );
return docs.map(doc => new AppointmentDto(doc));

}


}


const appointmentRepository = new AppointmentRepository(appointmentManager);
export default appointmentRepository;