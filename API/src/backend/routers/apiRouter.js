import {Router} from "express";
import express from "express";
import path from "path";
import authRoutes from "./auth.js";
import usersRoutes from "./users.js";
import categoriesRoutes from "./categories.js";
import postsRoutes from "./posts.js";
import commentsRoutes from "./comments.js";
import searchRoutes from "./search.js";

const __dirname = path.resolve();

/**
 * root API router
 * @type {Router}
 */

const router = Router();
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/upload", express.static(path.join(__dirname, "src/backend/upload")));
router.use("/categories", categoriesRoutes);
router.use("/posts", postsRoutes);
router.use("/comments", commentsRoutes);
router.use("/search", searchRoutes);




export default router;