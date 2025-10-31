import {Router} from "express";
import {PostsController} from "../controllers/postsController.js";

const router = Router();

router.get("/", PostsController.get_search);

export default router;