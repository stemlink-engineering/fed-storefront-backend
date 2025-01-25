import express from "express";
import { startPayment } from "../application/payment";

export const paymentRouter = express.Router();

paymentRouter.route("/create").post(startPayment);