import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Service from "../models/Services.js";
import Slot from "../models/Slots.js";

const today=()=> new Date().toISOString().slice(0,10);
//post /api/appointmnets  
export const createAppointment=async(req ,res)=>{
    const {serviceId,slotId,notes}=req.body;

    //1. check ids  
    if(!mongoose.isValidObjectId(serviceId) || !mongoose.isValidObjectId(slotId)){
        res.status(400);
        throw new Error("Please provide a valid serviceId and slotId");
    }

    //2. services must exist  
    const service=await Service.findById(serviceId);
    if(!service){
        res.status(404);
        throw new Error("Service not found!");
    }

    //3. slot musr exist and not br in the past  
    const slotCheck=await Slot.findById(slotId);
    if(!slotCheck){
        res.status(404);
        throw new Error("Cannot book a slot in the past");
    }

    //4. only succed if slot is free to book  
    const slot=await Slot.findOneAndUpdate(
        {_id:slotId,isBooked:false},
        {isBooked:true},
        {new:true}
    );

    if(!slot){
        res.status(409);
        throw new Error("Sorry, this slot has already been booked");
    }

    //5. create an appointment 

    try{
        const appointment=await Appointment.create({
            user:req.user._id,
            service:serviceId,
            slot:slotId,
            notes,
        });

        const populated=await appointment.populate([
            {path:"service", select:"name duration price"},
            {path:"slot",select:"date startTime endTime"},
        ]);

        res.status(201).json(populated);

    }catch(error){
        await Slot.findByIdAndUpdate(slotId,{isBooked:false});
        throw error;
    }
};

export const getMyAppointments=async(req ,res)=>{
    const appointments=await Appointment.find({user:req.user._id})
    .populate("service","name duration price")
    .populate("slot","date startTime endTime")
    .sort({createdAt:-1});

    res.status(200).json(appointments);
};

//patch /PI/APPOINTMENTS/:id/cancel  
export const cancelAppointment=async (req ,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400);
        throw new Error("Invalid appointment id");
    }
    const appointment=await Appointment.findById(req.params.id);
    if(!appointment){
        res.status(404);
        throw new Error("Appointment not found!");
    }
    //only admin can cancel  
    const isOwner=appointment.user.toString()===req.user._id.toString();
    const isAdmin=req.user.role==="admin";
    if(!isOwner && !isAdmin){
        res.status(403);
        throw new Error("You can only cancel your appointments");
    }
    if(appointment.status!=="booked"){
        res.status(400);
        throw new Error(`Appointment is already ${appointment.status}`);

    }
    appointment.status="cancelled";
    await appointment.save();

    //free the slot so someone can book  
    await Slot.findByIdAndUpdate(appointment.slot, {isBooked:false});
    res.status(200).json({message:"Appointment cancelled",appointment});
};

    //get /api/appointments
    export const getAllAppointments=async(req ,res)=>{
        const page=Math.max(parseInt(req.query.page) || 1,1);
        const limit=Math.min(Math.max(parseInt(req.query.limit)||10,1),50);
        const {status,date} =req.query;
        const filter={};
        if(status){
            const allowed=["booked", "cancelled", "completed"];
            if(!allowed.includes(status)){
                res.status(400);
                throw new Error("Status must be booked, cancelled or completed");
            }
            filter.status=status;
        }
        //date is stored on the slot, find the slot first  
        if(date){
            const slots=await Slot.find({date}).select("_id");
            filter.slot={$in:slots.map((s)=>s._id)};
        }

        const total=await Appointment.countDocuments(filter);
        const appointments=await Appointment.find(filter)
        .populate("user","name email")
        .populate("service", "name duration price")
        .populate("slot", "date startTime endTime")
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit);

        res.status(200).json({
            appointments,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        });
    

    };

    //patch /api/appointments/:id/complete   
    export const completeAppointment=async(req ,res)=>{
        if(!mongoose.isValidObjectId(req.params.id)){
            res.status(400);
            throw new Error("Invalid appointment id");
        }
        const appointment=await Appointment.findById(req.params.id);
        if(!appointment){
            res.status(404);
            throw new Error("Appointment not found!");
        }
        if(appointment.status !=="booked"){
            res.status(400);
            throw new Error(`Only booked appointments can be completed (this one is ${appointment.status})`);

        }

        appointment.status="completed";
        await appointment.save();

        res.status(200).json(appointment);
    };