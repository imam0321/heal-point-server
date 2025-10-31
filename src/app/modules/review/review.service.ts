import { Prisma, Review } from "@prisma/client"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/db"
import AppError from "../../errorHelpers/AppError"
import httpStatus from "http-status-codes";
import { paginationHelper, TOptions } from "../../utils/paginationHelper";

const createReview = async (userInfo: JwtPayload, payload: Partial<Review>) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: {
      email: userInfo.email
    }
  })

  const appointmentData = await prisma.appointment.findFirstOrThrow({
    where: {
      id: payload.appointmentId
    }
  })

  if (patientData.id !== appointmentData.patientId) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment")
  }

  return await prisma.$transaction(async (tx) => {
    const result = await tx.review.create({
      data: {
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        appointmentId: appointmentData.id,
        rating: payload.rating || 0,
        comment: payload.comment
      }
    })

    const avgRating = await tx.review.aggregate({
      _avg: {
        rating: true
      },
      where: {
        doctorId: appointmentData.doctorId,
      }
    })

    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId
      },
      data: {
        averageRating: avgRating._avg.rating as number
      }
    })

    return result
  })
}

const getAllReviews = async (
  filters: any,
  options: TOptions,
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;
  const andConditions = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail
      }
    })
  }

  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail
      }
    })
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
          createdAt: 'desc',
        },
    include: {
      doctor: true,
      patient: true,
    },
  });
  const total = await prisma.review.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const ReviewService = {
  createReview,
  getAllReviews
}