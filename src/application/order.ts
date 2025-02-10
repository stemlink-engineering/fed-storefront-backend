import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validation-error";
import Order from "../infrastructure/schemas/Order";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import Address from "../infrastructure/schemas/Address";

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
  shippingAddress: z.object({
    line_1: z.string(),
    line_2: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
    phone: z.string(),
  }),
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = req.body;
    console.log(order);
    const result = orderSchema.safeParse(order);
    if (!result.success) {
      console.log(result.error);
      throw new ValidationError("Invalid order data");
    }

    const userId = req.auth.userId;

    const address = await Address.create({
      ...result.data.shippingAddress,
    });

    await Order.create({
      userId,
      items: result.data.items,
      addressId: address._id,
    });

    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate({
      path: "addressId",
      model: "Address",
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
