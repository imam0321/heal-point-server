import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../utils/sendResponse";


const createPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient Created Successfully",
    data: result
  })
})

export const UserController = {
  createPatient,
}