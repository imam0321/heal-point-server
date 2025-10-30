import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../../config/db"
import AppError from "../../errorHelpers/AppError"
import httpStatus from "http-status-codes"

const createPrescription = async (userInfo: JwtPayload, payload: Partial<Prescription>) => {
  const appointmentData = await prisma.appointment.findFirstOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID
    },
    include: {
      doctor: true
    }
  })

  if (userInfo.role === UserRole.DOCTOR) {
    if (!(userInfo.email === appointmentData.doctor.email)) {
      throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment")
    }
  }

  return await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || ""
    },
    include: {
      patient: true
    }
  })
}

export const PrescriptionService = {
  createPrescription
}