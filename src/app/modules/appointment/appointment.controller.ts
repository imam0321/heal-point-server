import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppointmentService } from "./appointment.service";
import { JwtPayload } from "jsonwebtoken";
import pick from "../../utils/pick";


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

const getMyAppointment = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filters = pick(req.query, ["status", "paymentStatus"])
  const user = req.user as JwtPayload;
  const result = await AppointmentService.getMyAppointment(user, filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment fetched successfully!",
    data: result.data,
    meta: result.meta
  })
})

export const AppointmentController = {
  createAppointment,
  getMyAppointment
}