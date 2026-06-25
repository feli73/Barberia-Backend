import connectionDB from "../src/conexion.js";
import userService from "../src/services/userService.js";


const users = [
  // 👑 ADMIN
  {
    first_name: "Luciano",
    last_name: "Ferrari",
    email: "luciano.ferrari@barberpro.com",
    password: "Admin123!",
    role: "admin"
  },
  {
    first_name: "Camila",
    last_name: "Rossi",
    email: "camila.rossi@barberpro.com",
    password: "Admin123!",
    role: "admin"
  },
  {
    first_name: "Matías",
    last_name: "Benítez",
    email: "matias.benitez@barberpro.com",
    password: "Admin123!",
    role: "admin"
  },

  // 👤 USERS
  {
    first_name: "Juan",
    last_name: "Pérez",
    email: "juan.perez@gmail.com",
    password: "User123!"
  },
  {
    first_name: "María",
    last_name: "Gómez",
    email: "maria.gomez@gmail.com",
    password: "User123!"
  },
  {
    first_name: "Sofía",
    last_name: "López",
    email: "sofia.lopez@gmail.com",
    password: "User123!"
  },
  {
    first_name: "Carlos",
    last_name: "Fernández",
    email: "carlos.fernandez@gmail.com",
    password: "User123!"
  }
];



// Funcion para agregar muchos usuarios usando la capa userService y conectando a mongodb usando la conexion de la app.

const runSeed = async () => {

 await connectionDB();

 for(let i = 0; i <= users.length - 1; i++) {

  await userService.create(users[i]);

 }

 
 console.log("✔ Seed ejecutado correctamente");

process.exit();

}



runSeed();

