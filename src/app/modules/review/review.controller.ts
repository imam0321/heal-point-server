import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { ReviewService } from "./review.service";


const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.user as JwtPayload;
  const result = await ReviewService.createReview(userInfo.email, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Add review Successfully",
    data: result
  })
})



export const ReviewController = {
  createReview
}