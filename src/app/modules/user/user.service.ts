import { Request } from "express";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs"
import { fileUploader } from "../../helpers/fileUploader";
import { envVars } from "../../config/env";


const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadResult?.secure_url
  }

  const hashPassword = await bcrypt.hash(req.body.password, Number(envVars.BCRYPT_SALT_ROUND))

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword
      }
    })

    return await tx.patient.create({
      data: req.body.patient
    })
  })


  return result;
}

export const UserService = {
  createPatient
}