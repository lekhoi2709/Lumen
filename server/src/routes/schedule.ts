import express from "express";
import scheduleController from "../controllers/schedule-controller";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.get("/", authenticateToken, scheduleController.getSchedules);
router.post("/", authenticateToken, scheduleController.createSchedule);
router.put("/:id", authenticateToken, scheduleController.updateSchedule);
router.delete("/:id", authenticateToken, scheduleController.deleteSchedule);

export default router;
