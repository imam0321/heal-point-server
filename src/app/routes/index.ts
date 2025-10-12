import { Router } from "express";
import { UserRouters } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { ScheduleRouters } from "../modules/schedule/schedule.route";

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
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});