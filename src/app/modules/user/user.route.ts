import { NextFunction, Request, Response, Router } from "express"
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helpers/fileUploader";

const router = Router();

router.get("/", UserController.getAllUsers)
router.post("/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))

    return UserController.createPatient(req, res, next)
  },);


export const UserRouters = router