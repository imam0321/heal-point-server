import { Router } from "express";
import { UserRouters } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { ScheduleRouters } from "../modules/schedule/schedule.route";
import { DoctorScheduleRouters } from "../modules/doctorSchedule/doctorSchedule.route";
import { SpecialtiesRouters } from "../modules/specialties/specialties.routes";
import { DoctorRouters } from "../modules/doctor/doctor.route";
import { AppointmentRoutes } from "../modules/appointment/appointment.route";

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
        path: '/specialties',
        route: SpecialtiesRouters
    },
    {
        path: "/appointment",
        route: AppointmentRoutes
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});