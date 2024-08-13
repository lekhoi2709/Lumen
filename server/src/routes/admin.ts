import { Router } from "express";
import adminController from "../controllers/admin-controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Dashboard stats
router.get("/dashboard-stats", authenticateToken, adminController.getDashboardStats);

// User CRUD
router.get("/users", authenticateToken, adminController.getUsersList);
router.put("/users/:id", authenticateToken, adminController.updateUser);
router.delete("/users/:id", authenticateToken, adminController.deleteUser);
router.put("/users/:id/edit-role", authenticateToken, adminController.editRole);

// Course CRUD
router.get("/courses", authenticateToken, adminController.getCoursesList);
router.put("/courses/:id", authenticateToken, adminController.updateCourse);
router.delete("/courses/:id", authenticateToken, adminController.deleteCourse);

export default router;
