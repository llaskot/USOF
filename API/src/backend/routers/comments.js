import { Router } from "express";
import { CommentsController } from "../controllers/commentsController.js";

const router = Router();

router.get("/:comment_id", CommentsController.get_by_id);
router.post("/:comment_id/like", CommentsController.addLike);
router.get("/:comment_id/like", CommentsController.get_likes);
router.patch("/:comment_id", CommentsController.update);
router.delete("/:comment_id", CommentsController.delete);

export default router;