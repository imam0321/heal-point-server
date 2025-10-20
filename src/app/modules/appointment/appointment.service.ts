import { Appointment } from "@prisma/client";
import httpStatus from "http-status-codes"
import { prisma } from "../../config/db";
import { v4 as uuidv4 } from "uuid";
import AppError from "../../errorHelpers/AppError";
import { stripe } from "../../config/stripe";
import { envVars } from "../../config/env";

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

    });

    const transactionId = uuidv4();

    const payment = await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: doctor.appointmentFee,
        transactionId
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patient.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with ${doctor.name}`
            },
            unit_amount: doctor.appointmentFee * 100
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment.id,
        paymentId: payment.id
      },
      success_url: `${envVars.FRONTEND_URL}/success`,
      cancel_url: `${envVars.FRONTEND_URL}/cancel`,
    });

    return { appointment, paymentUrl: session.url }
  })



  return result;
}


export const AppointmentService = {
  createAppointment
}