import authService from "../../services/authService.js";
import { expect } from "chai";
import connectionDB from "../../conexion.js";
import mongoose from "mongoose";
import userService from "../../services/userService.js";


describe('authservice - Unit', () => {

before(async function () {
    

  await connectionDB();

});


after(async function () {
    
 await mongoose.connection.close();

});



it('Registro de un usuario - Unit', async () => {


 const email = `pablo${Date.now()}@gmail.com`;


const data = {

  first_name: 'pablo',
  last_name: 'diaz',
  email,
  password: 'user123'

}


const result = await authService.register(data);

expect(result).to.be.an('object');
expect(result.id).to.exist;
expect(result.first_name).to.equal('pablo');
expect(result.last_name).to.equal('diaz');
expect(result.email).to.equal(email);

});



it('Login de un usuario - Unit', async () => {


  const email = `pablo${Date.now()}@gmail.com`;
  const password = "user123";

  await authService.register({
    first_name: "pablo",
    last_name: "diaz",
    email,
    password
  });


const result = await authService.login(email, password);

expect(result).to.be.an('object');
expect(result.id).to.exist;
expect(result.first_name).to.equal('pablo');
expect(result.last_name).to.equal('diaz');
expect(result.email).to.equal(email);

})



} )