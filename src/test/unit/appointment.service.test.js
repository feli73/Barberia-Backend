import appointmentService from "../../services/appointmentServices.js";
import mongoose, { connect } from "mongoose";
import { expect } from "chai";
import connectionDB from "../../conexion.js";
import userService from "../../services/userService.js";


describe('appointmentService - Unit', () => {

before(async () => {


   await connectionDB();

});

after(async () => {

await mongoose.connection.close();

})



it('Crea un turno', async () => {

const user = await userService.create({
  first_name: "pablo",
  last_name: "diaz",
  email: `test${Date.now()}@mail.com`,
  password: "user123"
});

const appointmentData = {
  date: new Date(Date.now() + Math.random() * 1000000)
};


const result = await appointmentService.create(appointmentData, user.id)

expect(result).to.be.an('object');
expect(result.id).to.exist;
expect(result.userId.toString()).to.equal(user.id.toString());
expect(result.status).to.equal('pending');
expect(result.date).to.exist;

})



it('Trae todos los turnos', async () => {

 const user = await userService.create({
    first_name: "test",
    last_name: "user",
    email: `test${Date.now()}@mail.com`,
    password: "user123"
  });

  await appointmentService.create({
    date: new Date(Date.now() + 1000000)
  }, user.id);



const result = await appointmentService.getAll();

expect(result).to.be.an('array');
expect(result[0].id).to.exist;
expect(result.length).to.be.greaterThan(0);



})



it('Trae un turno', async () => {

 const data = await userService.create({
    first_name: "test",
    last_name: "user",
    email: `test${Date.now()}@mail.com`,
    password: "user123"
  });

 
  const appointmentData = {
    date: new Date(Date.now() + 1000000)
  };


const create = await appointmentService.create(appointmentData, data.id);

const result = await appointmentService.getById(create.id);



expect(result).to.be.an('object');
expect(result.id.toString()).to.equal(create.id.toString());



});


it('Modifica un turno',async () => {

 const data = await userService.create({
    first_name: "test",
    last_name: "user",
    email: `test${Date.now()}@mail.com`,
    password: "user123"
  });

 
  const appointmentData = {
    date: new Date(Date.now() + 1000000)
  };

  const create = await appointmentService.create(appointmentData, data.id);

  const newData = {

 date: new Date(Date.now() + 1000000)

  }

  const result = await appointmentService.update(create.id, newData);

  expect(result).to.be.an('object');
  expect(result.id.toString()).to.equal(create.id.toString());



})


it('Elimina un turno', async () => {

  const data = await userService.create({
    first_name: "test",
    last_name: "user",
    email: `test${Date.now()}@mail.com`,
    password: "user123"
  });

 
  const appointmentData = {
    date: new Date(Date.now() + 1000000)
  };

  const create = await appointmentService.create(appointmentData, data.id);

  const result = await appointmentService.delete(create.id)

  expect(result).to.be.an('object');
  expect(result.id.toString()).to.equal(create.id.toString()); 


});


it('Encuentra turno por fecha' , async () => {


   const data = await userService.create({
    first_name: "test",
    last_name: "user",
    email: `test${Date.now()}@mail.com`,
    password: "user123"
  });

 
  const appointmentData = {
    date: new Date(Date.now() + 1000000)
  };

  const create = await appointmentService.create(appointmentData, data.id);

  const result = await appointmentService.findByDate(create.date);

 expect(result).to.be.an('array');
 expect(result.length).to.be.greaterThan(0);
 expect(result[0].id.toString()).to.equal(create.id.toString());

})



it('obtiene los turnos de un usuario', async () => {

  const data = await userService.create({
    first_name: "test",
    last_name: "user",
    email: `test${Date.now()}@mail.com`,
    password: "user123"
  });

 
  const appointmentData = {
    date: new Date(Date.now() + 1000000)
  };

  const create = await appointmentService.create(appointmentData, data.id);

  const result = await appointmentService.getMyAppointmentByUserId(data.id)


  expect(result).to.be.an('array');
  expect(result.length).to.be.greaterThan(0);
  expect(result[0].id.toString()).to.equal(create.id.toString());
})








})