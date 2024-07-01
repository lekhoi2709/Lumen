import { Router } from "express";
import userController from "../controllers/user-controller";
import otpController from "../controllers/otp-controller";
import oauthController from "../controllers/oauth-controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

router.post("/google", oauthController.googleAuth);
router.get("/google/callback", oauthController.googleCallback);

router.put("/reset-password", auth, userController.resetPassword);

export default router;
