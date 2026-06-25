import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectionDB = async () =>{

    try {


        await mongoose.connect(process.env.MONGO_ATLAS);

      

          console.log('conectado a la base de datos');

    } catch(err) {

     console.error('Error al conectar a la base de datos')

    }
   


}

export default connectionDB;
