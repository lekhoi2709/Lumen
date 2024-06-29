import { Router } from "express";
import userController from "../controllers/user-controller";
import otpController from "../controllers/otp-controller";

const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/logout", (req, res) => {});

export default router;
