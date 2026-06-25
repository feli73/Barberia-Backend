import userRepository from "../repository/userRepository.js";
import bcrypt from 'bcrypt';
import normalizeText from "../utils/normalizedText.js";

class UserService{
 constructor(repository){

    this.repository = repository
}

 create = async (userData) => {



  if(userData.first_name) {
   userData.first_name_normalized = normalizeText(userData.first_name);
 


  }

  if(userData.last_name) {
 
   userData.last_name_normalized = normalizeText(userData.last_name);


  }
  



   if(userData.password){
   userData.password = await bcrypt.hash(userData.password, 10)

 }




    return await this.repository.create(userData);  


}







async registerUser(userData) {

 if(!userData.email) { 
    throw new Error ('El email es obligatorio')
 }

 const existingUser = await this.repository.getByEmail(userData.email);
 if(existingUser) throw new Error("El usuario ya existe");

 userData.role = "user";

 if(userData.password){
   userData.password = await bcrypt.hash(userData.password, 10)

 }


 return await this.repository.create(userData);


}


getAll = async () => {
 return await this.repository.getAll();

}


getById = async (id) => {

 return await this.repository.getById(id);

}


getByEmail = async (email) => {

  return await this.repository.getByEmail(email);

}


searchByName = async ({ name, lastName }) => {



  if(name){

   name  = normalizeText(name);

   
  }

  if(lastName){

   lastName = normalizeText(lastName);

   
  }

 return await this.repository.searchByName({ name, lastName })

}



update = async (id, userData, currentUser) => {
if(currentUser.id !== id) {

  throw new Error("No tienes permiso para modificar ese usuario");

}

if (userData.password) {

  userData.password = await bcrypt.hash(userData.password, 10);

}



return await this.repository.update(id, userData);
  

}


async delete(id, currentUser) {

 if(currentUser.role !== 'admin' && currentUser._id.toString() !== id.toString()) {
  throw new Error("No tienes permiso para eliminar otro usuario");

 }

  const userToDeleted = await this.repository.getById(id);
  if(!userToDeleted) {

    throw new Error("Usuario no encontrado");

  }

 



  return await this.repository.delete(id);

}






async promoteToAdmin(userId, currentUser) {

if(currentUser.role !== 'admin'){

 throw new Error('Solo un administrador puede promover Usuarios')

}


const user = await this.repository.getById(userId);
if(!user) throw new Error("Usuario no encontrado");

if(user.role === "admin") throw new Error('Ya es administrador');


return await this.repository.update(userId, {role:'admin'});


}





}


const userService = new UserService(userRepository);
export default userService;
