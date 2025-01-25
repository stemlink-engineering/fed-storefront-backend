import express from "express";

import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import { categoryRouter } from "./api/category";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { paymentRouter } from "./api/payment";
import { productRouter } from "./api/product";
import { connectDB } from "./infrastructure/db";
import { handleStripePaymentWebhook } from "./application/webhooks/payment";

const app = express();
app.use(clerkMiddleware());
app.use(cors({ origin: "http://localhost:5173" }));

app.post("/api/stripe/webhook", handleStripePaymentWebhook);

app.use(express.json()); // For parsing JSON requests

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/payments", paymentRouter);

app.use(globalErrorHandlingMiddleware);

connectDB();
app.listen(8000, () => console.log(`Server running on port ${8000}`));
