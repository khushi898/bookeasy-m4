import jwt from "jsonwebtoken";
import User from "../models/User.js";

//only logged-in users can pass 

export const protect=async(req , res , next)=>{
    const authHeader=req.headers.authorization;

//1. Check the header looks line Bearer<token>

if(!authHeader || !authHeader.startsWith("Bearer ")){
    res.status(401);
    throw new Error("Not authorized, No token");
}

const token= authHeader.split(" ")[1];

//2.  verfiy token  
let decoded;

try{
    decoded=jwt.verify(token, process.env.JWT_SECRET);

}catch(error){
   
    res.status(401);
    throw new Error("Not authorized, invalid token");

}
//3. find the user if exists?  
const user=await User.findById(decoded.id);
if(!user){
    res.status(401);
    throw new Error("Not authorized, user not found");
}
//4 Attach user to the request  
req.user=user;
next();
};
//only admin can go 
export const adminOnly=(req , res , next)=>{
    if(req.user && req.user.role==="admin"){
        return next();
    }
    res.status(403);
    throw new Error("Access denied, admin only");
};