import { Appointment } from "@prisma/client";
import httpStatus from "http-status-codes"
import { prisma } from "../../config/db";
import { v4 as uuidv4 } from "uuid";
import AppError from "../../errorHelpers/AppError";

const createAppointment = async (patientEmail: string, payload: Partial<Appointment>) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      email: patientEmail
    }
  })

  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false
    }
  })

  if (doctor.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "Doctor is deleted or unavailable.");
  }

  const schedule = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false
    }
  })

  if (!schedule) {
    throw new AppError(httpStatus.BAD_REQUEST, "Selected schedule is already booked.");
  }

  const videoCallingId = uuidv4()

  const result = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        scheduleId: schedule.scheduleId,
        videoCallingId
      }
    })

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctor.id,
          scheduleId: schedule.scheduleId
        }
      },
      data: {
        isBooked: true
      }

    })
    return appointment
  })



  return result;
}


export const AppointmentService = {
  createAppointment
}