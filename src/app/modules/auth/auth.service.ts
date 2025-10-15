import { UserStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"

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
  const userTokens = createUserTokens(jwtPayload)

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
  }
}




export const AuthService = {
  credentialLogin
}