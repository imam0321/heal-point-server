import httpStatus from 'http-status-codes';
import { Prisma } from "@prisma/client";
import { paginationHelper, TOptions } from "../../utils/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import { prisma } from "../../config/db";
import { IDoctorUpdateInput } from './doctor.interface';
import AppError from "../../errorHelpers/AppError";
import { extractJsonFromMessage } from '../../utils/extractJsonFromMessage';
import { openai } from '../../config/openRouter';


const getAllDoctors = async (params: any, options: TOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = params;

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

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive"
            }
          }
        }
      }
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
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true
        }
      },
      reviews: true
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

const updateDoctor = async (doctorId: string, payload: Partial<IDoctorUpdateInput>) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { id: doctorId }
  })

  const { specialties, ...doctorData } = payload;

  const result = await prisma.$transaction(async (tx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter(specialty => specialty.isDeleted === true);

      for (let specialty of deleteSpecialtyIds) {
        await tx.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctor.id,
            specialtiesId: specialty.specialtyId
          }
        })
      }

      const addSpecialtyIds = specialties.filter(specialty => !specialty.isDeleted)

      for (let specialty of addSpecialtyIds) {
        await tx.doctorSpecialties.create({
          data: {
            doctorId: doctor.id,
            specialtiesId: specialty.specialtyId
          }
        })
      }
    }

    return await tx.doctor.update({
      where: {
        id: doctor.id
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true
          }
        }
      }
    })

  })

  return result

}

const getDoctorById = async (id: string) => {
  return await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    },
    include: {
      doctorSchedules: {
        include: {
          schedule: true
        }
      },
      doctorSpecialties: {
        include: {
          specialties: true
        }
      },
      reviews: true
    }
  })
}

const getAISuggestions = async (symptoms: string) => {
  if (!symptoms) {
    throw new AppError(httpStatus.BAD_REQUEST, "Symptoms is required")
  }

  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true
        }
      }
    }
  });

  const prompt = `You are a smart AI medical assistant. A user describes their symptoms. You must suggest which doctors (from the given list) are most suitable.

  Symptoms: ${symptoms}

  Doctors List:
  ${JSON.stringify(doctors, null, 3)}

  Return your response in JSON format with full individual doctor data
  `;

  const completion = await openai.chat.completions.create({
    model: 'tngtech/deepseek-r1t2-chimera:free',
    messages: [
      {
        role: "system",
        content: "You are an AI assistant for a doctor recommendation system.",
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const result = await extractJsonFromMessage(completion.choices[0].message)
  return result;
}


export const DoctorService = {
  getAllDoctors,
  updateDoctor,
  getDoctorById,
  getAISuggestions
}