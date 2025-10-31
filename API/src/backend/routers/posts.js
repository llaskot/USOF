import { Router } from "express";
import { PostsController } from "../controllers/postsController.js";

const router = Router();

router.get("/", PostsController.get_all);
router.post("/", PostsController.create);
router.get("/:post_id", PostsController.get_by_id);
router.get("/:post_id/categories", PostsController.get_post_categories);
router.patch("/:post_id", PostsController.update);
router.delete("/:post_id", PostsController.delete);
router.post("/:post_id/like", PostsController.add_like);
router.get("/:post_id/like", PostsController.get_likes);
router.post("/:post_id/comments", PostsController.add_comment);
router.get("/:post_id/comments", PostsController.get_comment);





// router.delete("/:category_id", CategoriesController.delete);



export default router;