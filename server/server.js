import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound,errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const app=express();

//middleware

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

//Health Check route   
app.use("/api/auth",authRoutes); 
app.use("/api/services",serviceRoutes);
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
