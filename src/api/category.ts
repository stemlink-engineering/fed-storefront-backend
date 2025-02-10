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
import { createProduct } from "../application/product";

export const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(isAuthenticated, isAdmin, createProduct); //Remove isAuthenticated and isAdmin for using with Postman
categoryRouter
  .route("/:id")
  .get(getCategory)
  .delete(isAuthenticated, isAdmin, deleteCategory)
  .patch(isAuthenticated, isAdmin, updateCategory);
