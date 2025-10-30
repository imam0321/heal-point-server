import { Router } from "express";
import { checkAuth } from "../../utils/checkAuth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";


const router = Router();

router.post("/", checkAuth(UserRole.PATIENT), ReviewController.createReview)


export const ReviewRouters = router