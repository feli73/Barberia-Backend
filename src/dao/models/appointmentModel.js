import mongoose from "mongoose";
const { Schema } = mongoose;

 const AppointmentSchema = new Schema ({


    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true

    },

    date: {

      type: Date,
      required: true,
      unique: true

    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: 'pending'

    }



 })



 const AppointmentModel = mongoose.model('appointment', AppointmentSchema);
 export default AppointmentModel;