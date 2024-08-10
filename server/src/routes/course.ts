import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import courseController from "../controllers/course-controller";
import userController from "../controllers/user-controller";
import postController from "../controllers/post-controller";

const router = Router();

// Courses
router.get("/", authenticateToken, courseController.getCourses);
router.get("/c/:id", authenticateToken, courseController.getCourse);
router.post("/", authenticateToken, courseController.createCourse);
router.put("/join/:id", authenticateToken, courseController.joinCourse);
router.put("/c/:id/update", authenticateToken, courseController.updateCourse);
router.put("/c/:id/leave", authenticateToken, courseController.leaveCourse);
router.delete(
  "/c/:id/delete",
  authenticateToken,
  courseController.deleteCourse
);
router.post(
  "/c/:courseId/files/delete",
  authenticateToken,
  courseController.deleteAllFilesInCourse
);

// People
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
router.put("/c/:id/people/add", authenticateToken, courseController.addPeople);
router.put(
  "/c/:id/people/remove",
  authenticateToken,
  courseController.removePeople
);

// Posts
router.get("/c/:id/post", authenticateToken, postController.getPosts);
router.get("/c/p/:postId", authenticateToken, postController.getAssignment);
router.post("/c/:id/post", authenticateToken, postController.createPost);
router.delete(
  "/c/p/:postId/delete",
  authenticateToken,
  postController.deletePost
);
router.delete(
  "/c/p/:postId/comment/:commentId/delete",
  authenticateToken,
  postController.deleteComment
);
router.put(
  "/c/p/:postId/comment",
  authenticateToken,
  postController.commentPost
);
router.put("/c/p/:postId/update", authenticateToken, postController.updatePost);

export default router;
