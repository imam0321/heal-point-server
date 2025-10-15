import { Prisma } from "@prisma/client";
import { paginationHelper, TOptions } from "../../utils/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import { prisma } from "../../config/db";


const getAllDoctors = async (params: any, options: TOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }))
    })
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map(key => ({
      [key]: {
        equals: (filterData as any)[key]
      }
    }))
    andConditions.push(...filterConditions)
  }

  const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  })

  return {
    data: result,
    meta: {
      page,
      limit,
      total
    }
  }


}


export const DoctorService = {
  getAllDoctors
}