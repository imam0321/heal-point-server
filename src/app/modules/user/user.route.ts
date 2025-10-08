import { Router } from "express"
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helpers/fileUploader";

const router = Router();

router.post("/create-patient",
  fileUploader.upload.single("file"),
  validateRequest(UserValidation.createPatientValidationSchema), UserController.createPatient);


export const UserRouters = router