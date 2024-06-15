import { Router } from "express";
import userController from "../controllers/user-controller";

const router = Router();

router.get("/login", userController.login);
router.get("/register", userController.register);
router.get("/logout", (req, res) => {});

export default router;
