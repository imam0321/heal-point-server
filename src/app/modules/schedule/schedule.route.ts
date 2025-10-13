import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";


const router = Router();

router.get("/", checkAuth(UserRole.ADMIN, UserRole.DOCTOR), ScheduleController.getAllScheduleForDoctor)
router.post("/", checkAuth(UserRole.ADMIN), ScheduleController.createSchedule)
router.delete("/:id", checkAuth(UserRole.ADMIN), ScheduleController.deleteSchedule)


export const ScheduleRouters = router