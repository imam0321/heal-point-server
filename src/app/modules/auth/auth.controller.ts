import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookies";
import AppError from '../../errorHelpers/AppError';
import { JwtPayload } from 'jsonwebtoken';

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

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "Refresh Token Not Found");
  }

  const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Access Token Retried Successfully",
    data: tokenInfo,
  });
});

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    const result = await AuthService.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Check your email!",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { id, newPassword } = req.body;

  await AuthService.resetPassword(decodedToken, id, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;
  const result = await AuthService.getMe(accessToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});


export const AuthController = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe
}