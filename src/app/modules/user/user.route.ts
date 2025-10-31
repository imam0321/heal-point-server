import { NextFunction, Request, Response, Router } from "express"
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helpers/fileUploader";
import { UserRole } from "@prisma/client";
import { checkAuth } from "../../utils/checkAuth";

const router = Router();

router.get("/", UserController.getAllUsers)
router.get(
  '/me',
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile
)

router.post("/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))

    return UserController.createPatient(req, res, next)
  },);
router.post(
  "/create-doctor",
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createDoctor(req, res, next)
  }
);
router.post(
  "/create-admin",
  checkAuth(UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
    return UserController.createAdmin(req, res, next)
  }
);
router.patch(
  "/update-my-profile",
  checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    return UserController.updateMyProfile(req, res, next)
  }
);

export const UserRouters = router