import { Router } from "express";
import AuthRoute from "./auth";
import CourseRoute from "./course";
import UploadRoute from "./uploads";
import Admin from "./admin"
const router = Router();

router.use("/admin", Admin)
router.use("/auth", AuthRoute);
router.use("/courses", CourseRoute);
router.use("/uploads", UploadRoute)

export default router;
