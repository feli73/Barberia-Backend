import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema( {

 
first_name: {

  type: String,
  required: true

},

first_name_normalized: {
  type: String
},


last_name: {

 type: String,
 required: true
},


last_name_normalized: {
  type: String
},

email: {

 type: String,
 required: true,
 unique: true

},



password: {

 type: String,
 required: true

},

role: {

type: String,
default: 'user'

}





});


const userModel = mongoose.model('user', UserSchema);
export default userModel;