import { Router } from "express";
import { ScheduleController } from "./schedule.controller";


const router = Router();

router.get("/", ScheduleController.getAllScheduleForDoctor)
router.post("/", ScheduleController.createSchedule)
router.delete("/:id", ScheduleController.deleteSchedule)




export const ScheduleRouters = router