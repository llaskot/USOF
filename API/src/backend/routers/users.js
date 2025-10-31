import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const router = Router();

router.get("/", UserController.get_all_users);
router.get("/:user_id", UserController.user_by_id);
router.post("/", UserController.create_user); //Admin only
router.patch("/avatar", UserController.set_avatar)
router.patch("/:user_id", UserController.update_user);
router.delete("/:user_id", UserController.delete_user);



export default router;