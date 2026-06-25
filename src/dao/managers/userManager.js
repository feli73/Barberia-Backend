import userModel from "../models/userModel.js";

class UserManager{

 constructor(model){
    this.model = model;
 }


 create = async (userData) => {

 try {
    return    await this.model.create(userData);

 } catch(err){
 
    throw new Error(err)

 }

 }

 getAll = async () => {

try { return await this.model.find();


} catch(err) {

  throw new Error(err)

}

 }

 getById = async (id) => {

   try {
     return await this.model.findById(id)

   } catch(err){

    throw new Error(err)
   }

 }


 searchByName = async ({ name, lastName }) => {

  try {

     const query = {}

     if (name) {

      
query.first_name_normalized =  name;

}

if (lastName) {
  
  
  
   query.last_name_normalized =  lastName;


}

    return await this.model.find( query )



  } catch(err) {

   throw new Error(err);

  }


 }





 update = async (id, updateData) => {

  try{
     return  await this.model.findByIdAndUpdate(id, updateData, { new: true})

  } catch(err) {

     throw new Error(err)
  }

 }



 delete = async (id) => {

  try {

   return await this.model.findByIdAndDelete(id)

  } catch(err) {

    throw new Error(err)
  }

 }


 getByEmail = async (email) => {

  try  {

    return await this.model.findOne({ email });

  } catch(err) {

    throw new Error(err);

  }
  


 }



}


const userManager = new UserManager(userModel);

export default userManager;





 



