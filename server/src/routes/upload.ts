import { Router } from "express";
import { uploadFiles } from "../controllers/upload-controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/", authenticateToken, uploadFiles);

export default router;
