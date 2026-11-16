import express from "express";

import{
    createSlot,
    getAvailableSlots,
    deleteSlot,
} from "../controllers/slotController.js";
import {protect,adminOnly} from "../middleware/authMiddleware.js";

const router=express.Router();
router.get("/",getAvailableSlots);
router.post("/",protect,adminOnly,createSlot);
router.delete("/:id",protect,adminOnly,deleteSlot);
export default router;