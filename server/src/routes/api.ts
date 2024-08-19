import { Router } from "express";
import AuthRoute from "./auth";
import CourseRoute from "./course";
import UploadRoute from "./uploads";
import AdminRoute from "./admin";
import ScheduleRoute from "./schedule";
const router = Router();

router.use("/admin", AdminRoute);
router.use("/auth", AuthRoute);
router.use("/courses", CourseRoute);
router.use("/uploads", UploadRoute);
router.use("/schedules", ScheduleRoute);

export default router;
