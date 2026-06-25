import userService from "../../services/userService.js";
import { expect } from "chai";
import connectionDB from "../../conexion.js";
import mongoose from "mongoose";

describe('UserService - Unit', () => {

  before( async function () {

   await connectionDB();

  } )



  after(async function () {

   await mongoose.connection.close();

  })


it('Crear un usuario', async function ()  {


const email = `pablo${Date.now()}@gmail.com`;


const data = {

  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'


}



const result = await userService.create(data);



expect(result).to.be.an('object');
expect(result.id).to.exist;
expect(result.first_name).to.equal('pablo');
expect(result.last_name).to.equal('diaz');
expect(result.email).to.equal(email);


});



it('Registrar un usuario - Unit', async function () {



 
const email = `pablo${Date.now()}@gmail.com`;


const data = {

  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'


}


const result = await userService.registerUser(data);

expect(result).to.be.an('object');
expect(result.id).to.exist;
expect(result.first_name).to.equal('pablo');
expect(result.last_name).to.equal('diaz');
expect(result.email).to.equal(email);

})


it('Trae todos los usuarios - Unit', async function () {

 const result = await userService.getAll();

expect(result).to.be.an('array');
expect(result.length).to.be.greaterThan(0);

expect(result[0].id).to.exist;


})



it('Trae un usuario por id', async function () {

const email = `pablo${Date.now()}@gmail.com`;


  const data = {
  
  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'


}


const crear = await userService.create(data);



 const result = await userService.getById(crear.id)


expect(result).to.be.an('object');
expect(result.id).to.exist;
expect(result.first_name).to.equal('pablo');
expect(result.last_name).to.equal('diaz');
expect(result.email).to.equal(email);



})


it('trae un usuario por su email', async function () {

const email = `pablo${Date.now()}@gmail.com`;


  const data = {
  
  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'


}


const crear = await userService.create(data);


const result = await userService.getByEmail(crear.email)


expect(result).to.be.an('object');
expect(result.id).to.exist;
expect(result.first_name).to.equal('pablo');
expect(result.last_name).to.equal('diaz');
expect(result.email).to.equal(email);



})


it('Trae un usuario por su nombre', async function() {


  const email = `pablo${Date.now()}@gmail.com`;


  const data = {
  
  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'


}


const crear = await userService.create(data);


const result = await userService.searchByName({
  name: crear.first_name,
  lastName: crear.last_name
});



expect(result).to.be.an('array');
expect(result.length).to.be.greaterThan(0);
expect(result[0].first_name).to.equal('pablo');
expect(result[0].last_name).to.equal('diaz');

})


it('Modifica los datos de un usuario', async function () {


  const email = `pablo${Date.now()}@gmail.com`;

  const data = {
  
  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'
}


const crear = await userService.create(data);

  const currentUser = {
    id: crear.id,
    role: "user"
  };



   const updateData = {
    first_name: "juan"
  };



const result = await userService.update(crear.id, updateData, currentUser);


expect(result).to.be.an("object");
expect(result.first_name).to.equal("juan");

});


it('Elimina un usuario', async function () {


  const email = `pablo${Date.now()}@gmail.com`;

  const data = {
  
  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'
}


const crear = await userService.create(data);

  const currentUser = {
    _id: crear.id,
    role: "user"
  };



   const updateData = {
    first_name: "juan"
  };



const result = await userService.delete(crear.id, currentUser);


expect(result).to.be.an("object");
expect(result.id.toString()).to.equal(crear.id.toString());
});



it('Promueve un usuario a administrador', async function () {


  const email = `pablo${Date.now()}@gmail.com`;

  const data = {
  
  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'
}


const crear = await userService.create(data);

  const currentUser = {
    _id: crear.id,
    role: "admin"
  };


const result = await userService.promoteToAdmin(crear.id, currentUser);


expect(result).to.be.an("object");
expect(result.id.toString()).to.equal(crear.id.toString());
});





});