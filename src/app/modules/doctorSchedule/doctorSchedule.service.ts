import { prisma } from "../../config/db";
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError";

const createDoctorSchedule = async (email: string, payload: {
  scheduleIds: string[]
}) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      email: email
    }
  })

  if (!doctor) {
    throw new AppError(httpStatus.BAD_REQUEST, "Doctor not found")
  }

  const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
    doctorId: doctor.id,
    scheduleId
  }))

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData
  })

  return result
}

export const DoctorScheduleService = {
  createDoctorSchedule
}