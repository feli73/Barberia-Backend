import UserDto from "../dtos/userDto.js";
import usermanager from '../dao/managers/userManager.js';


class UserRepository{
 
    constructor(manager){
     this.manager = manager;

    }

 create = async (userData) => {

   const doc = await this.manager.create(userData);
   return new UserDto(doc);

 }



 getAll = async () => {
  const docs = await this.manager.getAll();
  return docs.map(doc => new UserDto(doc));

 }


 getById = async (id) => {

  const doc = await this.manager.getById(id)
  return doc ? new UserDto(doc) : null;

 }


 getByEmail = async (email) => {

  const doc = await this.manager.getByEmail(email);
  return doc ? new UserDto(doc) : null;


 }


 async searchByName ({ name, lastName }) {

  return await this.manager.searchByName({ name: name, lastName: lastName });

}




 getByEmailRaw = async (email) => {

  return await this.manager.getByEmail(email) 
 

 }


update = async (id, userData) => {

 const doc = await this.manager.update(id, userData);
 return doc ? new UserDto(doc) : null;

}


delete = async (id) => {

  const doc = await this.manager.delete(id);
  return doc ? new UserDto(doc) : null;

}




}


const userRepository = new UserRepository(usermanager);
export default userRepository;