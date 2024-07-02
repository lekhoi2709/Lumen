import { Router } from "express";
import userController from "../controllers/user-controller";
import otpController from "../controllers/otp-controller";
import oauthController from "../controllers/oauth-controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/login", userController.login);
router.post("/logout", authenticateToken, userController.logout);
router.post("/register", userController.register);

router.get("/refresh", userController.refresh);

router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);

router.post("/google", oauthController.googleAuth);
router.get("/google/callback", oauthController.googleCallback);
router.get("/google/success", oauthController.googleSuccess);

router.put("/reset-password", authenticateToken, userController.resetPassword);

export default router;
