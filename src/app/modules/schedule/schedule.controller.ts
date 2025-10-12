import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { scheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await scheduleService.createSchedule(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Create schedule Successfully",
    data: result
  })
})


export const ScheduleController = {
  createSchedule
}