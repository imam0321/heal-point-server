import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", checkAuth(UserRole.PATIENT), AppointmentController.createAppointment);
router.get(
  "/my-appointments",
  checkAuth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentController.getMyAppointment
)
router.patch("/:id", checkAuth(UserRole.DOCTOR, UserRole.ADMIN), AppointmentController.updateAppointment)


export const AppointmentRoutes = router;