import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

//post/api/auth/register    
export const registerUser=async (req,res)=>{
    const {name,email,password}=req.body;

    //1. check all fields are sent   

    if(!name || !email  || !password){
        res.status(400);
        throw new Error("Please provide name, email and password");
    }

    //2. Check email is not already in use
    const existingUser=await User.findOne({email:email.toLowerCase()});
    if(existingUser){
        res.status(400);
        throw new Error("Email is already registered");
    }

    //3. Hash password

    const hashedPassword=await bcrypt.hash(password,10);
    
    //4. Save the user(role is always user by default)
    const user=await User.create({
        name,
        email,
        password:hashedPassword,
    });

    //5. Send back to the user,without password    
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    });
};

//post /api/auth/login

export const loginUser=async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Please provide email and password");
    }
    //pwd has select:false, ask here
    const user=await User.findOne({email:email.toLowerCase()}).select("+password");
    if(!user || !(await bcrypt.compare(password, user.password))){
        res.status(401);
        throw new Error("Invalid email or password");
    }
    res.status(200).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        token:generateToken(user._id,user.role),
    });

};

//get /api/auth/me 

export const getMe=async(req , res)=>{
    res.status(200).json({
        _id:req.user._id,
        name:req.user.name,
        email:req.user.email,
        role:req.user.role,
    });
};
