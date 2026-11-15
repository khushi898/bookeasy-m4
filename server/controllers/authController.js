import bcrypt from "bcryptjs";
import User from "../models/User.js";

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
