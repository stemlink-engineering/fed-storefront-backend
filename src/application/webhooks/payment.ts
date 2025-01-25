import { NextFunction, Request, Response } from "express";
import stripe from "../../infrastructure/stripe";

const endpointSecret =
  "whsec_a5f25910d6cb3b6e3b77d508fecae518350528fd13afd40971239f36c115cc95";

export const handleStripePaymentWebhook = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
        console.log(event);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        response.status(400).send();
        return;
      }
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  } catch (error) {
    next(error);
  }
};
