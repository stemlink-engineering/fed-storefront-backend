import express from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategory,
} from "../application/category";
import { isAuthenticated } from "./middleware/authentication-middleware";

export const categoryRouter = express.Router();

categoryRouter.route("/").get(getCategories).post(isAuthenticated, createCategory);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .patch(updateCategory);
