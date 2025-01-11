import express from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategory,
} from "../application/category";
import { requireAuth } from "@clerk/express";

export const categoryRouter = express.Router();

categoryRouter.route("/").get(getCategories).post(createCategory);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(deleteCategory)
  .patch(updateCategory);
