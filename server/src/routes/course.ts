import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import courseController from "../controllers/course-controller";
import userController from "../controllers/user-controller";

const router = Router();

router.get("/", authenticateToken, courseController.getCourses);
router.get("/c/:id", authenticateToken, courseController.getCourse);
router.get(
  "/c/:id/people",
  authenticateToken,
  courseController.getCoursePeople
);
router.get(
  "/c/:id/people/search/:data",
  authenticateToken,
  userController.getSearchedUser
);

router.post("/", authenticateToken, courseController.createCourse);

router.put("/c/:id/people/add", authenticateToken, courseController.addPeople);

export default router;
