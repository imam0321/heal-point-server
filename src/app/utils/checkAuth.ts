import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/db";
import { UserStatus } from "@prisma/client";
import httpStatus from "http-status-codes"
import AppError from "../errorHelpers/AppError";

export const checkAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;

        if (!accessToken) {
          throw new AppError(httpStatus.NOT_FOUND, "No Token found");
        }

        const verifiedToken = verifyToken(
          accessToken,
          envVars.JWT.JWT_ACCESS_SECRET
        ) as JwtPayload;

        const isUserExist = await prisma.user.findFirst({ where: { email: verifiedToken.email } });

        if (!isUserExist) {
          throw new AppError(httpStatus.NOT_FOUND, "User Not Exist!");
        }

        if (isUserExist.status === UserStatus.INACTIVE) {
          throw new AppError(httpStatus.FORBIDDEN,
            `User ${UserStatus.INACTIVE}!`
          );
        }

        if (isUserExist.status === UserStatus.DELETED) {
          throw new AppError(httpStatus.NOT_FOUND, "User is deleted!");
        }

        if (!authRoles.includes(verifiedToken.role)) {
          throw new AppError(httpStatus.NOT_ACCEPTABLE,
            "You are not permitted to view this route!!"
          );
        }

        req.user = verifiedToken;
        next();
      } catch (error) {
        next(error);
      }
    };