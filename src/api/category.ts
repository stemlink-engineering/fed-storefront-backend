import express from "express";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategory,
} from "../application/category";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

export const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(isAuthenticated, isAdmin, createCategory);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(isAuthenticated, isAdmin, deleteCategory)
  .patch(isAuthenticated, isAdmin, updateCategory);
