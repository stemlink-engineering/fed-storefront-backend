import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validation-error";
import Order from "../infrastructure/schemas/Order";
import { getAuth } from "@clerk/express";

const orderSchema = z.object({
  items: z
    .object({
      product: z.object({
        _id: z.string(),
        name: z.string(),
        price: z.string(),
        image: z.string(),
        description: z.string(),
      }),
      quantity: z.number(),
    })
    .array(),
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = req.body;
    // console.log(order);
    const result = orderSchema.safeParse(order);
    if (!result.success) {
      console.log(result.error);
      throw new ValidationError("Invalid order data");
    }

    const userId = getAuth(req).userId;

    await Order.create({
      userId: "123",
      items: result.data.items,
    });

    res.status(201).send();
  } catch (error) {
    next(error);
  }
};
