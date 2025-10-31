import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { ReviewService } from "./review.service";
import pick from "../../utils/pick";


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

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['patientEmail', 'doctorEmail']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ReviewService.getAllReviews(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieval successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews
}