import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get("/", DoctorController.getAllDoctors);
router.post("/suggestions", DoctorController.getAISuggestions);
router.patch("/:id", checkAuth(UserRole.ADMIN, UserRole.DOCTOR), DoctorController.updateDoctor);
router.get("/:id", checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), DoctorController.getDoctorById)

export const DoctorRouters = router;