import mongoose from "mongoose";

const slotSchema=new mongoose.Schema({
    date:{
        type:String,
        required:[true,"Date is required"],
        match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"],
    },
     startTime:{
        type:String,
        required:[true,"Start time is required"],
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be HH:MM"],
    },
      endTime:{
        type:String,
        required:[true,"End time is required"],
        match: [/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be HH:MM"],
    },
    isBooked:{
        type:Boolean,
        default:false,
    },
},
    {timestamps:true}
);
//no two slots can start at the same date+time  
  slotSchema.index({date:1,startTime:1}, {unique:true});
  const Slot=mongoose.model("Slot",slotSchema);
  export default Slot;
    
