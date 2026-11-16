import express from "express";
import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from "../controllers/serviceController.js";
import {protect, adminOnly} from "../middleware/authMiddleware.js";

const router=express.Router();

//public  
router.get("/", getServices);
router.get("/:id",getServiceById);

//admin only   
router.post("/", protect,adminOnly,createService);
router.put("/:id",protect,adminOnly,updateService);
router.delete("/:id",protect,adminOnly,deleteService);

export default router;