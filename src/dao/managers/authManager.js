import userModel from '../models/userModel.js'


 class AuthManager {
    constructor(model) {
        
     this.model = model;

    }


  createUser = async (userData) => {

    return await this.model.create(userData);


  }



  getUserByEmail = async (email) => {

    return await this.model.findOne({ email });

  }


  getUserById = async (id) => {

  return await this.model.findById(id)

  }

 }


 const authModel = new AuthManager(userModel);
 export default authModel;

