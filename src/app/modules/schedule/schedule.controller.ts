import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { scheduleService } from "./schedule.service";
import pick from "../../utils/pick";

const createSchedule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await scheduleService.createSchedule(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Create schedule Successfully",
    data: result
  })
})

const getAllScheduleForDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, ["startDateTime", "endDateTime"])
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

  const result = await scheduleService.getAllScheduleForDoctor(filters, options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule retrieve Successfully",
    data: result.data,
    meta: result.meta
  })
})


export const ScheduleController = {
  createSchedule,
  getAllScheduleForDoctor
}