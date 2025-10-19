import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppointmentService } from "./appointment.service";
import { JwtPayload } from "jsonwebtoken";


const createAppointment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.user as JwtPayload;
  const result = await AppointmentService.createAppointment(userInfo.email, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Create appointment Successfully",
    data: result
  })
})


export const AppointmentController = {
  createAppointment
}