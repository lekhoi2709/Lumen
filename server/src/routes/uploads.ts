import { Router } from "express";
import uploadController from "../controllers/upload-controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post(
  "/upload-file/:courseId",
  authenticateToken,
  uploadController.uploadFiles
);

router.post(
  "/:courseId/files/delete",
  authenticateToken,
  uploadController.deleteFiles
);

router.put(
  "/upload/change-user-avatar",
  authenticateToken,
  uploadController.changeUserAvatar
);

export default router;
