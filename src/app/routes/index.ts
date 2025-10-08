import { Router } from "express";
import { UserRouters } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRouters,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});