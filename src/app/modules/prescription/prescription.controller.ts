import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import { PrescriptionService } from "./prescription.service";


const createPrescription = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.user as JwtPayload;
  const result = PrescriptionService.createPrescription(userInfo, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Prescription created successfully!",
    data: result,
  })
})


export const PrescriptionController = {
  createPrescription
}