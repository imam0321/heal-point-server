import { Review } from "@prisma/client"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/db"
import AppError from "../../errorHelpers/AppError"
import httpStatus from "http-status-codes";

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

export const ReviewService = {
  createReview
}