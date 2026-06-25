import { expect } from "chai";
import  request  from "supertest";
import { describe } from "mocha";
import app from "../../app.js";
import userService from "../../services/userService.js";
import jwt from "jsonwebtoken";
import AppointmentModel from "../../dao/models/appointmentModel.js";



describe('Appointment routes - integrations', () => {


beforeEach(async () => {
    await AppointmentModel.deleteMany({});
  });


it('POST api/appointment/  - Crea un turno nuevo', async function ()  {


    this.timeout(15000);
  


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

            const cookie = logueo.headers['set-cookie']

            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


 expect(res.status).to.equal(201);
 expect(res.body.status).to.equal('success');
 expect(res.body.payload).to.exist;


})


it('POST api/appointment/  - Falla al intentar crear un turno en un horario reservado', async function ()  {


 function normalizeDate(date) {
    const d = new Date(date);
    d.setSeconds(0, 0);
    return d;
  }


    this.timeout(5000);
  


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

            const cookie = logueo.headers['set-cookie'][0]



            

              function getValidAppointmentDate() {
              const date = new Date();

              // próximo martes
              while (date.getDay() !== 2) {
                date.setDate(date.getDate() + 1);
              }

              // dos semanas más adelante
              date.setDate(date.getDate() + 14);

              const validHours = [
                9, 10, 11, 12,
                16, 17, 18, 19
              ];

              const validMinutes = [0, 30];

              const hour =
                validHours[Math.floor(Math.random() * validHours.length)];

              const minute =
                validMinutes[Math.floor(Math.random() * validMinutes.length)];

              date.setHours(hour, minute, 0, 0);

              return date;
            }

            const baseDate =   normalizeDate(getValidAppointmentDate()).toISOString();

           console.log('Fecha enviada:', baseDate);

       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send({ date: baseDate })


            console.log('Status:', res.status);
            console.log('Body:', res.body);


         


           expect(res.status).to.equal(201);
           expect(res.body.status).to.equal('success');
           expect(res.body.payload).to.exist;


            const resTwo = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send({ date: baseDate })


              expect(resTwo.status).to.equal(409);
              expect(resTwo.body.status).to.equal('error');


})


it('POST /api/appointment - falla con fecha invalida', async function () {
  
 this.timeout(5000);
  


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

            const cookie = logueo.headers['set-cookie'][0]



            const res = await request(app)
            .post('/api/appointment/')
            .set('Cookie', cookie)
            .send({ date: 'no es una fecha' })


            expect(res.status).to.equal(400);
            expect(res.body.status).to.equal('error');

            })




it('GET /api/appointment/:id/confirm - confirma la creación del turno', async function () {


this.timeout(5000);

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

            const cookie = logueo.headers['set-cookie'][0];

            const newPayload = {
            date: new Date(
              Date.now() +
              1000 * 60 * 60 * 24 * 2 + Math.floor(Math.random() * 100000000)
            )
          }

            console.log(newPayload.date);

       
           const ingreso = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload);
           
           const appointmentId = ingreso.body.payload.id;
            
           

            const token = jwt.sign(
            { appointmentId, action: "confirm" },
            process.env.JWT_SECRET
             );



       


            const res = await request(app)
           .get(`/api/appointment/${appointmentId}/confirm?token=${token}`)
           

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            

})


it('GET /api/appointment/:id/confirm - FALLA confirmacion la creación del turno', async function () {


this.timeout(5000);

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

            const cookie = [logueo.headers['set-cookie'][0]];

            const newPayload = {
            date: new Date(
              Date.now() +
              1000 * 60 * 60 * 24 * 2 + Math.floor(Math.random() * 100000000)
            )
          }


       
           const ingreso = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload);
           
           const appointmentId = ingreso.body.payload.id;
            
           

            const token = jwt.sign(
            { appointmentId, action: "confirm" },
            process.env.JWT_SECRET
             );





            const res = await request(app)
           .get(`/api/appointment/${appointmentId}/confirm?token=INVALIDO`)
           

            expect(res.status).to.equal(500);
            expect(res.body.status).to.equal('error');
            

})




it('GET /api/appointment/:id/cancel - cancela turno', async function () {


   this.timeout(5000);


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

            const cookie = logueo.headers['set-cookie'][0];

            const newPayload = {


          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + Math.floor(Math.random() * 100000))
            }


       
           const ingreso = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload);

           
           
           const appointmentId = ingreso.body.payload.id;
            
           
            const token = jwt.sign(
            { appointmentId, action: "cancel" },
            process.env.JWT_SECRET
             );


            const res = await request(app)
           .get(`/api/appointment/${appointmentId}/cancel?token=${token}`)
           

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('success');
            

})




   it('GET api/appointment/ - Trae todos los turnos creados', async function () {

  

  const res = await request(app)
           .get('/api/appointment/')
           


           expect(res.status).to.equal(200)
           expect(res.body.status).to.equal('success')



   })



    it('GET api/appointment/admin - muestra los datos de turnos en rol admin', async function () {

   
  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         }
         
         
          await userService.create(data);
 

         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
 
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie'][0];

        

            const res = await request(app)
            .get('/api/appointment/admin')
            .set('Cookie', cookie);


            expect(res.status).to.equal(200)
            expect(res.body.status).to.equal('success')
            expect(res.body.payload).to.be.an('array');



    });



    
    it('GET api/appointment/admin - Error al mostrar los datos de turnos en rol user', async function () {

   
  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'user'
         
         }
         
         
          await userService.create(data);
 

         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
 
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie'][0];

        

            const res = await request(app)
            .get('/api/appointment/admin')
            .set('Cookie', cookie);


            expect(res.status).to.equal(403)
            expect(res.body.status).to.equal('error')
           



    });

    it('GET /api/appointment/my/appointment - Muestra los turnos del usuario', async function () {
     
      this.timeout(15000);
  


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

            const cookie = logueo.headers['set-cookie']

            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)

            const newRes = await request(app)
            .get('/api/appointment/my/appointment')
            .set('Cookie', cookie);


            expect(newRes.status).to.equal(200)
            expect(newRes.body.status).to.equal('success')



    });

  it('GET /api/appointment/my/appointment - Muestra los turnos del usuario', async function () {
     
      this.timeout(15000);
  


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

            const cookie = logueo.headers['set-cookie']

           

            const newRes = await request(app)
            .get('/api/appointment/my/appointment')
            .set('Cookie', cookie);



            expect(newRes.status).to.equal(404)
            expect(newRes.body.status).to.equal('error')



    });

    


    it('GET api/appointment/admin/:id -  Trae los turnos con los datos de cada uno' , async function(){

    this.timeout(15000);
  


  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const appointmentId = res.body.payload.id;

           const newRes = await request(app)
            .get(`/api/appointment/admin/${appointmentId}`)
            .set('Cookie', cookie);



          expect(newRes.status).to.equal(200);
          expect(newRes.body.status).to.equal('success');
          expect(newRes.body.payload).to.exist;
          expect(newRes.body.payload._id).to.equal(appointmentId);




    });



   it('GET api/appointment/admin/:id -  Falla por turno no encontrado' , async function(){

    this.timeout(15000);
  


  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const fakeId = "60f1c2a3b4d5e6f7a8b9c0d1";;

           const newRes = await request(app)
            .get(`/api/appointment/admin/${fakeId}`)
            .set('Cookie', cookie);



          expect(newRes.status).to.equal(404);
          expect(newRes.body.status).to.equal('error');
 

    });



    it('GET /api/appointment/:id  -  Trae los turnos por id  ', async function () {
      
    
    
    this.timeout(15000);
  


  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const appointmentId = res.body.payload.id;

           const newRes = await request(app)
            .get(`/api/appointment/${appointmentId}`)
            .set('Cookie', cookie);



          expect(newRes.status).to.equal(200);
          expect(newRes.body.status).to.equal('success');
          expect(newRes.body.payload).to.exist;
          expect(newRes.body.payload.id).to.equal(appointmentId);




    });




     it('GET /api/appointment/:id  -  Error por un turno no encontrado  ', async function () {
      
    
    
    this.timeout(15000);
  


  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const fakeId = "60f1c2a3b4d5e6f7a8b9c0d1";;

           const newRes = await request(app)
            .get(`/api/appointment/${fakeId}`)
            .set('Cookie', cookie);



          expect(newRes.status).to.equal(404);
          expect(newRes.body.status).to.equal('error');
         


    });

    


   it('PUT /api/appointment/:id - Modifica un turno', async function () {

  
   this.timeout(15000);
  


  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const appointmentId = res.body.payload.id;


            const updatedDate = new Date(
            Date.now() + Math.random() * 10000000 ).toISOString();

           const newRes = await request(app)
            .put(`/api/appointment/${appointmentId}`)
            .set('Cookie', cookie)
            .send({ date: updatedDate });



          expect(newRes.status).to.equal(200);
          expect(newRes.body.status).to.equal('success');
          expect(newRes.body.payload).to.exist;
          expect(newRes.body.payload.id).to.equal(appointmentId);


   })



   it('PUT /api/appointment/:id - Error al crear un turno', async function () {

  
   this.timeout(15000);
  


  const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const appointmentId = res.body.payload.id;


            const updatedDate = new Date(
            Date.now() + Math.random() * 10000000 ).toISOString();

           const newRes = await request(app)
            .put(`/api/appointment/${appointmentId}`)
            .set('Cookie', cookie)
            .send({ fake: '1234' });



          expect(newRes.status).to.equal(500);
          expect(newRes.body.status).to.equal('error');
          

   })



   it('DELETE /api/appointment/:id - Elimina el turno', async function() {

   this.timeout(15000)


   const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const appointmentId = res.body.payload.id;


         

           const newRes = await request(app)
            .delete(`/api/appointment/${appointmentId}`)
            .set('Cookie', cookie)
            



          expect(newRes.status).to.equal(200);
          expect(newRes.body.status).to.equal('success');

   })


   


    it('DELETE /api/appointment/:id - Error al eliminar el turno porque no lo encuentra', async function() {

   this.timeout(15000)


   const email = `pablo${Date.now()}@gmail.com`;
         const contraseña = 'user123'
         
           const data = {
           
           first_name: 'pablo',
           last_name: 'diaz',
           email,
           password: contraseña,
           role: 'admin'
         
         
         }
         
         
         const crear = await userService.create(data);
 
         const payload = {
       
           email: data.email,
           password: contraseña
 
            }
 
 
           
          
        
            const logueo = await request(app)
            .post('/api/auth/login')
            .send(payload)

            const cookie = logueo.headers['set-cookie']


              
            const newPayload = {

                 date: new Date(Date.now() + Math.random() * 10000000)
            }
       
           const res = await request(app)
           .post('/api/appointment/')
           .set('Cookie', cookie)
           .send(newPayload)


            const fakeAppointmentId = '507f1f77bcf86cd799439011';


         

           const newRes = await request(app)
            .delete(`/api/appointment/${fakeAppointmentId}`)
            .set('Cookie', cookie)
            



          expect(newRes.status).to.equal(404);
          expect(newRes.body.status).to.equal('error');

   })



    })



  
