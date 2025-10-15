import { Router } from "express";
import { UserRouters } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { ScheduleRouters } from "../modules/schedule/schedule.route";
import { DoctorScheduleRouters } from "../modules/doctorSchedule/doctorSchedule.route";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.routes";

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
        path: '/specialties',
        route: SpecialtiesRoutes
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});