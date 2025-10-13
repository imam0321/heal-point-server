import { prisma } from "../../config/db";

const createDoctorSchedule = async (email: string, payload: {
  scheduleIds: string[]
}) => {
  const doctor = await prisma.doctor.findFirst({
    where: {
      email: email
    }
  })

  if (!doctor) {
    throw new Error("Doctor not found")
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