import mongoose from "mongoose";
import Slot from "../models/Slots.js";

//todays date  
const today=()=>new Date().toISOString().slice(0,10);

//post /api/slots  
export const createSlot=async(req ,res)=>{
    const{date,startTime,endTime}=req.body;

    if(!date || !startTime || !endTime ){
        res.status(400);
        throw new Error("Please provide date, startTime, endTime");
    }
    //check format before comparing  
    const dateFormat=/^\d{4}-\d{2}-\d{2}$/;
    const timeFormat=  /^([01]\d|2[0-3]):[0-5]\d$/;

    if(!dateFormat.test(date)){
        res.status(400);
        throw new Error("Date must be in YYYY-MM-DD");
    }
    if(!timeFormat.test(startTime) || !timeFormat.test(endTime)){
        res.status(400);
        throw new Error("Times must be in HH:MM");
    } 
    if(date<today()){
        res.status(400);
        throw new Error("Cannot create a slot in a past");
    }
    if(endTime<=startTime){
        res.status(400);
        throw new Error("End time must be after start time");
    }

    const slot=await Slot.create({date,startTime,endTime});
    res.status(201).json(slot);
};

//get /api/slots?date  
export const getAvailableSlots=async(req , res)=>{
    const {date}=req.query;

    if(!date){
        res.status(400);
        throw new Error("Please provide a date, e.g. ?date=2026-11-20");

    }
    const slots=await Slot.find({date,isBooked:false}).sort({startTime:1});
    res.status(200).json(slots);
};

//delete /api/slots/:id  
export const deleteSlot=async(req ,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400);
        throw new Error("Invalid slot id");
    }

    const slot=await Slot.findById(req.params.id);
    if(!slot){
        res.status(404);
        throw new Error("Slot not found!");
    }
    if(slot.isBooked){
        res.status(400);
        throw new Error("Cannot delete a booked slot");
    }
    await slot.deleteOne();
    res.status(200).json({message:"Slot deleted"});

};