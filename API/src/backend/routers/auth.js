import { Router } from "express";
import { AuthController } from "../controllers/authController.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/register/confirm", AuthController.reg_confirm);
router.post("/login", AuthController.login);
router.get("/refresh", AuthController.refresh)
router.post("/logout", AuthController.logout);
router.post("/password-reset", AuthController.password_reset);
router.post("/password-reset/confirm", AuthController.confirmReset);
router.get("/check-login", AuthController.check_login);
router.get("/check-email", AuthController.check_email);

export default router;