import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../utils/pick";
import { JwtPayload } from "jsonwebtoken";

const createSchedule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ScheduleService.createSchedule(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Create schedule Successfully",
    data: result
  })
})

const getAllScheduleForDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, ["startDateTime", "endDateTime"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const decodedToken = req.user as JwtPayload;

  const result = await ScheduleService.getAllScheduleForDoctor(filters, options, decodedToken.email);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule retrieve Successfully",
    data: result.data,
    meta: result.meta
  })
})

const deleteSchedule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ScheduleService.deleteSchedule(req.params.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule deleted Successfully",
    data: result
  })
})


export const ScheduleController = {
  createSchedule,
  getAllScheduleForDoctor,
  deleteSchedule
}