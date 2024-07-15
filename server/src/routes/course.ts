import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import courseController from "../controllers/course-controller";

const router = Router();

router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourse);
router.post("/", authenticateToken, courseController.createCourse);

export default router;
