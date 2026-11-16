import mongoose from "mongoose";
const servicesSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Service name is required"],
            trim:true,
            unique:true,
        },
        description:{
            type:String,
            trim:true,
            maxlength:[500,"Description can not be more than 500 characters"],
        },
        duration:{
            type:Number,
            required:[true, "Duration is required"],
            min:[5,"Duration must be atleast 5 minutes"],
            max:[480,"Duration can not be more than 8 hours"],
        },
        price:{
            type:Number,
            required:[true, "Price is required"],
            min:[0,"Price can not be negative"],
        },
    },
    {
        timestamps:true
    }
);
const Service=mongoose.model("Service", servicesSchema);
export default Service;