import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound,errorHandler } from "./middleware/errorHandler.js";

const app=express();

//middleware

app.use(cors({origi: process.env.CLIENT_URL}));
app.use(express.json());

//Health Check route    
app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"ok"});

});

//Error handling  
app.use(notFound);
app.use(errorHandler);

const PORT= process.env.PORT || 5000;

const startServer=async()=>{
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);

    });
};

startServer();
