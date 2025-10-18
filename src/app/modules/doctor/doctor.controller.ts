import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import pick from "../../utils/pick";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constants";


const getAllDoctors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await DoctorService.getAllDoctors(filters, options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctors retrieve Successfully",
    data: result.data,
    meta: result.meta
  })
})

const updateDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await DoctorService.updateDoctor(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Updated Doctor Successfully",
    data: result
  })
})

export const DoctorController = {
  getAllDoctors,
  updateDoctor
}