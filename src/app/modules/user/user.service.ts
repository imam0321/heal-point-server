import { prisma } from "../../config/db";
import { ICreatePatientInput } from "./user.interface";
import bcrypt from "bcryptjs"


const createPatient = async (payload: ICreatePatientInput) => {
  const hashPassword = await bcrypt.hash(payload.password, 10)

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: payload.email,
        password: hashPassword
      }
    })

    return await tx.patient.create({
      data: {
        name: payload.name,
        email: payload.email
      }
    })
  })


  return result;
}

export const UserService = {
  createPatient
}