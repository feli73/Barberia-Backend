import AppointmentModel from "../models/appointmentModel.js";

class AppointmentManager{
  constructor(model){
  this.model = model;

  }


 create = async (appointmentData) => {

  return await this.model.create(appointmentData)

 } 

getAll = async () => {

  return await this.model.find().sort({ date: 1 });

}


getById = async (id) => {

 return await this.model.findById(id);

}


update = async (id, appointmentData) => {

   return await this.model.findByIdAndUpdate(id, appointmentData, { new: true });

}


delete = async (id) => {

 return await this.model.findByIdAndDelete(id);

} 






findByDate = async (date) => {
  return await this.model.find({ date: new Date(date) });
};


getMyAppointmentByUserId = async (userId) => { 
  
  return await this.model.find({ userId });

 }



}

const appointmentManager = new AppointmentManager(AppointmentModel);

export default appointmentManager;
