import { Router } from "express";
import userController from "../controllers/user-controller";

const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/logout", (req, res) => {});

export default router;
