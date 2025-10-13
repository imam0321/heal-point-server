import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleService } from './doctorSchedule.service';
import { JwtPayload } from "jsonwebtoken";


const createDoctorSchedule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
  const result = await DoctorScheduleService.createDoctorSchedule(decodedToken.email, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor schedule created Successfully",
    data: result
  })
})


export const DoctorScheduleController = {
  createDoctorSchedule
}