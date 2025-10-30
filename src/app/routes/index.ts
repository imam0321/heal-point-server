import { Router } from "express";
import { UserRouters } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { ScheduleRouters } from "../modules/schedule/schedule.route";
import { DoctorScheduleRouters } from "../modules/doctorSchedule/doctorSchedule.route";
import { SpecialtiesRouters } from "../modules/specialties/specialties.routes";
import { DoctorRouters } from "../modules/doctor/doctor.route";
import { AppointmentRouters } from "../modules/appointment/appointment.route";
import { PrescriptionRouters } from "../modules/prescription/prescription.route";
import { ReviewRouters } from "../modules/review/review.route";
import { PatientRoutes } from "../modules/patient/patient.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRouters,
    },
    {
        path: "/auth",
        route: AuthRouters,
    },
    {
        path: "/schedule",
        route: ScheduleRouters,
    },
    {
        path: "/doctor-schedule",
        route: DoctorScheduleRouters,
    },
    {
        path: "/doctor",
        route: DoctorRouters
    },
    {
        path: "/patient",
        route: PatientRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRouters
    },
    {
        path: "/appointment",
        route: AppointmentRouters
    },
    {
        path: "/prescription",
        route: PrescriptionRouters
    },
    {
        path: "/review",
        route: ReviewRouters
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});