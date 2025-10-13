import { Router } from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post("/", checkAuth(UserRole.DOCTOR), DoctorScheduleController.createDoctorSchedule)




export const DoctorScheduleRouters = router