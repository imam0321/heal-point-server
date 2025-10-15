import { Request } from "express";
import { prisma } from "../../config/db";
import bcrypt from "bcryptjs"
import { fileUploader } from "../../helpers/fileUploader";
import { envVars } from "../../config/env";
import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import { paginationHelper, TOptions } from "../../utils/paginationHelper";
import { userSearchableFields } from "./user.constants";
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError";


const createPatient = async (req: Request): Promise<Patient> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: req.body.patient.email }
  })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist!")
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

const createDoctor = async (req: Request): Promise<Doctor> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: req.body.doctor.email }
  })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Doctor already exist!")
  }

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor
    });

    return createdDoctorData;
  });

  return result;
};

const createAdmin = async (req: Request): Promise<Admin> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: req.body.admin.email }
  })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Doctor already exist!")
  }

  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin
    });

    return createdAdminData;
  });

  return result;
};

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
  createDoctor,
  createAdmin,
  getAllUsers
}