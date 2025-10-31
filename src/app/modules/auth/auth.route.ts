import { Router } from "express"
import { AuthController } from "./auth.controller";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../utils/checkAuth";

const router = Router();

router.post("/login", AuthController.credentialLogin);
router.post('/refresh-token', AuthController.getNewAccessToken)
router.post('/change-password', checkAuth(
  UserRole.ADMIN,
  UserRole.DOCTOR,
  UserRole.PATIENT
), AuthController.changePassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/me', AuthController.getMe)


export const AuthRouters = router