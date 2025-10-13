import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/db";
import { UserStatus } from "@prisma/client";

export const checkAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const accessToken = req.cookies.accessToken || req.headers.authorization;

        if (!accessToken) {
          throw new Error("No Token found");
        }

        const verifiedToken = verifyToken(
          accessToken,
          envVars.JWT.JWT_ACCESS_SECRET
        ) as JwtPayload;

        const isUserExist = await prisma.user.findFirst({ where: { email: verifiedToken.email } });

        if (!isUserExist) {
          throw new Error("User Not Exist!");
        }

        if (isUserExist.status === UserStatus.INACTIVE) {
          throw new Error(
            `User ${UserStatus.INACTIVE}!`
          );
        }

        if (isUserExist.status === UserStatus.DELETED) {
          throw new Error("User is deleted!");
        }

        if (!authRoles.includes(verifiedToken.role)) {
          throw new Error(
            "You are not permitted to view this route!!"
          );
        }

        req.user = verifiedToken;
        next();
      } catch (error) {
        next(error);
      }
    };