import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import stripe from "../infrastructure/stripe";

const CartItemSchema = z.object({
  product: z.object({
    _id: z.string(),
    name: z.string(),
    price: z.string(),
    image: z.string(),
    description: z.string(),
  }),
  quantity: z.number(),
});

const calculateOrderAmount = (items: z.infer<typeof CartItemSchema>[]) => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total = 0;
  // console.log(items);
  items.forEach((item) => {
    total += parseFloat(item.product.price) * item.quantity;
  });
  return total;
};

export const startPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items } = req.body;
    // console.log(util.inspect(items, false, null, true /* enable colors */));

    // const result = z.safeParse(items);
    // if (!result.success) {
    //   throw new ValidationError("Invalid cart items");
    // }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    return;
  } catch (error) {
    next(error);
  }
};
