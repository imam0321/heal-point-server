import { Router } from "express"
import { AuthController } from "./auth.controller";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../utils/checkAuth";

const router = Router();

router.post("/login", AuthController.credentialLogin);
router.post('/refresh-token', AuthController.getNewAccessToken)


export const AuthRouters = router