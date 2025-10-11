import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookies";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await AuthService.credentialLogin(req.body);

  setAuthCookie(res, result)

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