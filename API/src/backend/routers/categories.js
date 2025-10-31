import { Router } from "express";
import { CategoriesController } from "../controllers/categoriesController.js";

const router = Router();

router.get("/", CategoriesController.get_all);
router.post("/", CategoriesController.create);
router.get("/:category_id", CategoriesController.get_by_id);
router.patch("/:category_id", CategoriesController.update);
router.delete("/:category_id", CategoriesController.delete);
router.get("/:category_id/posts", CategoriesController.get_category_posts);



export default router;