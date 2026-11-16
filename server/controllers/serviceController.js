import mongoose from "mongoose";
import Service from "../models/Services.js";

export const getServices=async (req , res)=>{
    const page=Math.max(parseInt(req.query.page) || 1, 1);
    const limit=Math.min(Math.max(parseInt(req.query.limit) ||  10 ,1),50);
    const search=req.query.search || "";

    //search by name  
    const filter=search
    ? {name:{$regex:search, $options:"i"}}
    :{};

    const total=await Service.countDocuments(filter);
    const services=await Service.find(filter)
    .sort({name:1})
    .skip((page-1)*limit)
    .limit(limit);

    res.status(200).json({
        services,
        page,
        totalPages:Math.ceil(total / limit),
        total,
    });

};

//get /api/services/:id  
export const getServiceById = async (req , res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400);
        throw new Error("Invalid service id");
    }
    const service=await Service.findById(req.params.id);
    if(!service){
        res.status(404);
        throw new Error("Service not found");
    }
    res.status(200).json(service);
};

//post / api/services  

export const createService=async (req , res)=>{
    const{name , description ,duration ,price}=req.body;
    if(!name || duration===undefined || price===undefined){
        res.status(400);
        throw new Error("Please provide name, duration and price");
    }

    const exists=await Service.findOne({name:name.trim()});
    if(exists){
        res.status(400);
        throw new Error("A service with this name already exists");
    }

    const service=await Service.create({name, description ,duration , price});
    res.status(201).json(service);
};

//put / api/services/:id    (admin)

export const updateService=async(req ,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400);
        throw new Error("Invalid service id");
    }

    const {name, description, duration ,price}=req.body;
    const service=await Service.findByIdAndUpdate(
        req.params.id,
        { name, description, duration ,price},
        {new:true, runValidators:true}
    );

    if(!service){
        res.status(404);
        throw new Error("Service not found!");
    }
    res.status(200).json(service);
};

//delete /api/services/:id   
export const deleteService=async(req ,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400);
        throw new Error("Invalid service id");
    }
    const service=await Service.findByIdAndDelete(req.params.id);
    if(!service){
        res.status(404);
        throw new Error("Service not found!");
    }
    res.status(200).json({message: "Service deleted"});
};