import { envVars } from './../../config/env';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { stripe } from "../../config/stripe";

const stripeWebhookEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    await PaymentService.stripeWebhookEvent(event);

    res.status(200).json({ received: true });
  }
);


export const PaymentController = {
  stripeWebhookEvent
}