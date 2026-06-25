import { expect } from "chai";
import app from '../../app.js';
import { describe } from "mocha";
import  request  from "supertest";


describe('User routes - Integration', () => {

  it('POST api/user/  crea un usuario', async () => {


  const payload = {
  first_name: "juan",
  last_name: "pereyra",
  email: `juanPereyra${Date.now()}@mail.com`,
  password: "123456",
  role: "user"
}



  const res = await request(app)
  .post('/api/user/')
  .send(payload)

 expect(res.status).to.equal(201);
 expect(res.body).to.have.property('status');
 expect(res.body.status).to.equal('success');
 expect(res.body.payload).to.have.property('id');
 expect(res.body.payload.first_name).to.equal('juan');
 expect(res.body.payload.last_name).to.equal('pereyra');
  });


it('POST api/user/  -  falla si no envío datos', async () => {



  const res = await request(app)
  .post('/api/user/')
  .send({})

 expect(res.status).to.equal(400);
 expect(res.body).to.have.property('status');
 expect(res.body.status).to.equal('Error');
 expect(res.body).to.have.property('message');
  });




  it('POST api/user/  -  falla si faltan name', async () => {



  const res = await request(app)
  .post('/api/user/')
  .send({

  last_name: "pereyra",
  email: `juanPereyra${Date.now()}@mail.com`,
  password: "123456",
  role: "user"
  })

 expect(res.status).to.equal(400);
 expect(res.body).to.have.property('status');
 expect(res.body.status).to.equal('Error');
 expect(res.body).to.have.property('message');
  });






 it('GET /api/user/  trae todos los usuarios ', async () => {

 const res = await request(app)
  .get('/api/user/')
  
 expect(res.status).to.equal(200);
 expect(res.body).to.have.property('status');
 expect(res.body.status).to.equal('success');



 });



 it('GET /api/user/email  - trae un usuario por email', async () => {

  const payload = {
    first_name: "pedro",
    last_name: "Gonzales",
    email: `juan${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };


    await request(app)
    .post('/api/user/')
    .send(payload);


  const res = await request(app)
  .get('/api/user/email')
  .query({
 
   email: payload.email     

  });


 expect(res.status).to.equal(200);
 expect(res.body.status).to.equal('success');
 expect(res.body.payload.email).to.equal(payload.email)

});

 it('GET /api/user/email  - muestra error si no pasa el email', async () => {

  const payload = {
    first_name: "pedro",
    last_name: "Gonzaled",
    email: `juan${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };


    await request(app)
    .post('/api/user/')
    .send(payload);


  const res = await request(app)
  .get('/api/user/email')
  .query({
 
   password: '12345'     

  });


 expect(res.status).to.equal(404);
 expect(res.body.status).to.equal('error');
 expect(res.body).to.have.property('message')

});


it('GET /api/user/search  - Busca usuario por nombre', async () => {

  const payload = {
    first_name: "pedro",
    last_name: "Gonzales",
    email: `pedro${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };


    await request(app)
    .post('/api/user/')
    .send(payload);


  const res = await request(app)
  .get('/api/user/search')
  .query({
 
    name: "pedro",
    lastName: "Gonzales"     

  });



 expect(res.status).to.equal(200);
expect(res.body.status).to.equal('success');

expect(res.body.payload).to.be.an('array');
expect(res.body.payload.length).to.be.greaterThan(0);

expect(res.body.payload[0].first_name).to.equal('pedro');
expect(res.body.payload[0].last_name).to.equal('Gonzales');

});



it('GET /api/user/:id  - Busca usuario por id', async () => {

  const payload = {
    first_name: "pedro",
    last_name: "Gonzales",
    email: `pedro${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  const createRes = await request(app)
  .post('/api/user/')
  .send(payload);




  const res = await request(app)
  .get(`/api/user/${createRes.body.payload.id}`)
 



 expect(res.status).to.equal(200);
expect(res.body.status).to.equal('success');
expect(res.body.payload).to.be.an('object');
expect(res.body.payload.first_name).to.equal('pedro')
expect(res.body.payload.last_name).to.equal('Gonzales')

});


it('GET /api/user/:id  - Busca ususario por id pero no se pasan datos', async () => {



  const res = await request(app)
  .get('/api/user/9994154678971231564849810')
 



expect(res.status).to.equal(400);
expect(res.body.status).to.equal('Error');
expect(res.body).to.have.property('message');


});




it('PUT /api/user/:id  - Modifica usuario por id', async () => {

  const payload = {
    first_name: "pedro",
    last_name: "Gonzales",
    email: `pedro${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  const createRes = await request(app)
  .post('/api/user/')
  .send(payload);



  const login = await request(app)
  .post('/api/auth/login')
  .send({
    email: createRes.body.payload.email,
    password: "123456"
  });

  const cookie = login.headers['set-cookie'];



  const res = await request(app)
  .put(`/api/user/${createRes.body.payload.id}`)
  .set('Cookie', cookie)
  .send({
    first_name: "carlos",
    last_name: "perez"

  })
 



 expect(res.status).to.equal(200);
expect(res.body.status).to.equal('success');
expect(res.body.payload).to.be.an('object');
expect(res.body.payload.first_name).to.equal('carlos')
expect(res.body.payload.last_name).to.equal('perez')

});


it('PUT /api/user/:id  - No Modifica usuario porque no esta logueado', async () => {

  const payload = {
    first_name: "pedro",
    last_name: "Gonzales",
    email: `pedro${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  const createRes = await request(app)
  .post('/api/user/')
  .send(payload);







  const res = await request(app)
  .put(`/api/user/${createRes.body.payload.id}`)
  .send({
    first_name: "carlos",
    last_name: "perez"

  })
 



 expect(res.status).to.equal(401);
expect(res.body).to.be.an('object');

});





it('DELETE /api/user/:id - Elimina usuario por id', async () => {

  const adminPayload = {
    first_name: "admin",
    last_name: "user",
    email: `admin${Date.now()}@mail.com`,
    password: "123456",
    role: "admin"
  };

  await request(app)
    .post('/api/user/')
    .send(adminPayload);

  const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: adminPayload.email,
      password: "123456"
    });

  const cookie = login.headers['set-cookie'];

  const userPayload = {
    first_name: "martin",
    last_name: "perez",
    email: `martin${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  const newRes = await request(app)
    .post('/api/user/')
    .send(userPayload);

  const userId = newRes.body.payload.id;

  const res = await request(app)
    .delete(`/api/user/${userId}`)
    .set('Cookie', cookie);

  expect(res.status).to.equal(200);
  expect(res.body.status).to.equal('success');

  // 4. Verificar que ya no existe
  const check = await request(app)
    .get(`/api/user/${userId}`);

  expect(check.status).to.equal(404);
});



it('DELETE /api/user/:id - Error al eliminar por falta de cookie', async () => {

  const adminPayload = {
    first_name: "admin",
    last_name: "user",
    email: `admin${Date.now()}@mail.com`,
    password: "123456",
    role: "admin"
  };

  await request(app)
    .post('/api/user/')
    .send(adminPayload);

  const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: adminPayload.email,
      password: "123456"
    });


  const userPayload = {
    first_name: "martin",
    last_name: "perez",
    email: `martin${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  const newRes = await request(app)
    .post('/api/user/')
    .send(userPayload);

  const userId = newRes.body.payload.id;

  const res = await request(app)
    .delete(`/api/user/${userId}`)


    console.log(res.body)

  expect(res.status).to.equal(401);

});



it('PUT /api/user/:id/promote - Promueve el role de user a admin', async () => {

  const adminPayload = {
    first_name: "admin",
    last_name: "user",
    email: `admin${Date.now()}@mail.com`,
    password: "123456",
    role: "admin"
  };

  await request(app)
    .post('/api/user/')
    .send(adminPayload);

  const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: adminPayload.email,
      password: "123456"
    });

  const cookie = login.headers['set-cookie'];

  const userPayload = {
    first_name: "martin",
    last_name: "perez",
    email: `martin${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  const newRes = await request(app)
    .post('/api/user/')
    .send(userPayload);

  const userId = newRes.body.payload.id;

  const res = await request(app)
    .put(`/api/user/${userId}/promote`)
    .set('Cookie', cookie);

  expect(res.status).to.equal(200);
  expect(res.body.status).to.equal('success');
  expect(res.body.payload.role).to.equal('admin')


});




it('PUT /api/user/:id/promote - No Promueve el role de user a admin por ser rol user el login', async () => {

  const adminPayload = {
    first_name: "admin",
    last_name: "user",
    email: `admin${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  await request(app)
    .post('/api/user/')
    .send(adminPayload);

  const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: adminPayload.email,
      password: "123456"
    });

  const cookie = login.headers['set-cookie'];

  const userPayload = {
    first_name: "martin",
    last_name: "perez",
    email: `martin${Date.now()}@mail.com`,
    password: "123456",
    role: "user"
  };

  const newRes = await request(app)
    .post('/api/user/')
    .send(userPayload);

  const userId = newRes.body.payload.id;

  const res = await request(app)
    .put(`/api/user/${userId}/promote`)
    .set('Cookie', cookie);

  expect(res.status).to.equal(403);
  expect(res.body.message).to.equal('Acceso denegado');


});



})