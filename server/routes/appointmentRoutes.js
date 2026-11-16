import express from "express";
import{
    createAppointment,
    getMyAppointments,
    cancelAppointment,
    getAllAppointments,
    completeAppointment,
} from "../controllers/appointmentController.js";
import { protect,adminOnly } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/",protect,createAppointment);
router.get("/my",protect,getMyAppointments);
router.patch("/:id/cancel",protect,cancelAppointment);
router.get("/",protect,adminOnly,getAllAppointments);
router.patch("/:id/complete",protect,adminOnly,completeAppointment);

export default router;