import Stripe from "stripe"
import { prisma } from "../../config/db"
import { PaymentStatus } from "@prisma/client"


const stripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any

      const appointmentId = session.metadata?.appointmentId
      const paymentId = session.metadata?.paymentId

      await prisma.appointment.update({
        where: {
          id: appointmentId
        },
        data: {
          paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
        }
      })

      await prisma.payment.update({
        where: {
          id: paymentId
        },
        data: {
          status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
          paymentGatewayData: session
        }
      })

      break;
    }
  }
}


export const PaymentService = {
  stripeWebhookEvent
}