import { Request } from "express";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs"
import { fileUploader } from "../../helpers/fileUploader";
import { envVars } from "../../config/env";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { paginationHelper, TOptions } from "../../utils/paginationHelper";
import { userSearchableFields } from "./user.constens";


const createPatient = async (req: Request) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: req.body.patient.email }
  })

  if (isUserExist) {
    throw new Error("User already exist!")
  }

  if (req.file && !isUserExist) {
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

const getAllUsers = async (params: any, options: TOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }))
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key]
        }
      }))
    })
  }

  const whereCondition: Prisma.UserWhereInput = andConditions.length > 0 ? {
    AND: andConditions
  } : {}

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  const total = await prisma.user.count({
    where: whereCondition
  });

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
}


export const UserService = {
  createPatient,
  getAllUsers
}