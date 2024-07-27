import { Router } from "express";
import {
  uploadFiles,
  listFiles,
  getFile,
  deleteFile,
} from "../controllers/upload-controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/upload-file", authenticateToken, uploadFiles);
router.get("/files/:userId", authenticateToken, listFiles);
router.get("/file/:userId/:fileName", authenticateToken, getFile);
router.delete("/file/:userId/:fileName", authenticateToken, deleteFile);
export default router;
