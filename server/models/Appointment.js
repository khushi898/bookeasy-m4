import mongoose, { mongo } from "mongoose";

const appointmentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required:[true, "Service is required"],
    },
     slot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Slot",
        required:[true, "Slot is required"],
    },
    status:{
        type:String,
        enum:["booked","cancelled","completed"],
        default:"booked",
    },
    notes:{
        type:String,
        trim:true,
        maxLength:[300,"Notes cannot be more than 300 characters"],
    },

},
{timestamps:true}
);

//safety net:only one activwe book 
appointmentSchema.index(
    {slot:1},
    {unique:true,partialFilterExpression:{status:"booked"}}

);
const Appointment=mongoose.model("Appointment",appointmentSchema);
export default Appointment;