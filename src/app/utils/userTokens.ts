import { UserRole, UserStatus } from "@prisma/client";
import { envVars } from "../config/env";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from 'http-status-codes';
import { prisma } from "../config/db";

export const createUserTokens = (user: { id: string, email: string, role: UserRole }) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_REFRESH_SECRET,
    envVars.JWT.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await prisma.user.findFirst({
    where: {
      email: verifyRefreshToken.email
    }
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Not Exist!");
  }

  if (
    isUserExist.status === UserStatus.DELETED ||
    isUserExist.status === UserStatus.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User Not ${isUserExist.status}!`
    );
  }

  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES
  );

  return accessToken;
};