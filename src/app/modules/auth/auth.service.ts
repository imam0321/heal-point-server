import { UserStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";
import { verifyToken } from "../../utils/jwt";

const credentialLogin = async (payload: { email: string, password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE
    }
  })

  const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect")
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  }
  const tokens = createUserTokens(jwtPayload)

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken
  }
}

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (user: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE
    }
  });

  const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password incorrect!")
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  await prisma.user.update({
    where: {
      email: userData.email
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false
    }
  })

  return {
    message: "Password changed successfully!"
  }
};

const forgotPassword = async (payload: { email: string }) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE
    }
  });

  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist.id}&token=${resetToken}`;

  await sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.email,
      resetUILink,
    },
  });

};

const resetPassword = async (decodedToken: JwtPayload, id: string, newPassword: string) => {
  if (id != decodedToken.userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not reset your password!"
    );
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: id,
      status: UserStatus.ACTIVE
    }
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }

  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await prisma.user.update({
    where: {
      id: id
    },
    data: {
      password: hashPassword
    }
  })
};

const getMe = async (accessToken: string) => {
  const decodedData = verifyToken(accessToken, envVars.JWT.JWT_ACCESS_SECRET);

  if (typeof decodedData === "string") {
    throw new Error("Invalid token");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE
    }
  });

  const { email, role } = userData;

  return { email, role };
}

export const AuthService = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe
}