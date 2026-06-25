import { expect } from "chai";
import app from "../../app.js";
import { describe } from "mocha";
import  request  from "supertest";
import userService from "../../services/userService.js";



describe('Auth routes - Integration', () => {

    it('POST api/auth/register  - Registra un usuario', async () =>  {

        const payload = {
    first_name: "juan",
    last_name: "pereyra",
    email: `juanPereyra${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
    }

    const res = await request(app)
    .post('/api/auth/register')
    .send(payload)

    expect(res.status).to.equal(201)
    expect(res.body).to.have.property('status')
    expect(res.body.status).to.equal('success')
    expect(res.body.payload.first_name).to.equal('juan')
    expect(res.body.payload.last_name).to.equal('pereyra')


    });



    it('POST api/auth/login  - Loguea un usuario', async () =>  {

        const email = `pablo${Date.now()}@gmail.com`;
        const contraseña = 'user123'
        
          const data = {
          
          first_name: 'pablo',
          last_name: 'diaz',
          email,
          password: contraseña
        
        
        }
        
        
        const crear = await userService.create(data);

        const payload = {
      
          email: data.email,
          password: contraseña

           }



         

    const res = await request(app)
    .post('/api/auth/login')
    .send(payload)

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('status')
    expect(res.body.status).to.equal('success')
    expect(res.body.payload.email).to.equal(data.email)


    });
 

  
    it('POST api/auth/login  - No loguea el usuario por falta de dato', async () =>  {

        const email = `pablo${Date.now()}@gmail.com`;
        const contraseña = 'user123'
        
          const data = {
          
          first_name: 'pablo',
          last_name: 'diaz',
          email,
          password: contraseña
        
        
        }
        
        
        const crear = await userService.create(data);

        const payload = {
      
          
          password: contraseña

           }



         

    const res = await request(app)
    .post('/api/auth/login')
    .send(payload)

    expect(res.status).to.equal(401)
    expect(res.body).to.have.property('status')
    expect(res.body.status).to.equal('error')


    });



    it('POST api/auth/logout  - Hace el logout', async () =>  {

          const email = `pablo${Date.now()}@gmail.com`;
        const contraseña = 'user123'
        
          const data = {
          
          first_name: 'pablo',
          last_name: 'diaz',
          email,
          password: contraseña
        
        
        }
        
        
        const crear = await userService.create(data);

        const payload = {
      
          email: data.email,
          password: contraseña

           }



         

    const logueo = await request(app)
    .post('/api/auth/login')
    .send(payload)

         
     const res = await request(app)
    .post('/api/auth/logout')

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('status')
    expect(res.body.status).to.equal('success')


    });

 



});