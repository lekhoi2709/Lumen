import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import courseController from "../controllers/course-controller";

const router = Router();

router.get("/", authenticateToken, courseController.getCourses);
router.get("/c/:id", authenticateToken, courseController.getCourse);
router.post("/", authenticateToken, courseController.createCourse);

export default router;
