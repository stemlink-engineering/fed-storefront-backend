import express from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../application/product";
import { isAuthenticated } from "./middleware/authentication-middleware";

export const checkoutRouter = express.Router();

checkoutRouter.route("/sessions/create").post()
