import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import courseController from "../controllers/course-controller";
import userController from "../controllers/user-controller";
import postController from "../controllers/post-controller";

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
router.get("/c/:id/post", authenticateToken, postController.getPosts);

router.post("/", authenticateToken, courseController.createCourse);
router.post("/c/:id/post", authenticateToken, postController.createPost);
router.post(
  "/c/p/:postId/delete",
  authenticateToken,
  postController.deletePost
);

router.put("/join/:id", authenticateToken, courseController.joinCourse);
router.put("/c/:id/people/add", authenticateToken, courseController.addPeople);
router.put(
  "/c/p/:postId/comment",
  authenticateToken,
  postController.commentPost
);
router.put("/c/p/:postId/update", authenticateToken, postController.updatePost);

export default router;
