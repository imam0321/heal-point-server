import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AuthService.credentialLogin(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Login Successfully",
    data: result
  })
})


export const AuthController = {
  credentialLogin
}