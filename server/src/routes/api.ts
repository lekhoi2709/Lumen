import { Router } from "express";
import AuthRoute from "./auth";
import CourseRoute from "./course";
import UploadRoute from "./uploads";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/courses", CourseRoute);
router.use("/uploads", UploadRoute)

export default router;
