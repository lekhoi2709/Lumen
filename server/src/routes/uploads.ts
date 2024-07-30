import { Router } from "express";
import uploadController from "../controllers/upload-controller";
import { authenticateToken } from "../middlewares/auth";
import upload from "../config/multer-config";

const router = Router();

router.post(
  "/upload-file/:courseId",
  authenticateToken,
  upload.array("files", 10),
  uploadController.uploadFiles
);

router.post("/files/delete", authenticateToken, uploadController.deleteFiles);

export default router;
