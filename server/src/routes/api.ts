import { Router } from "express";
import AuthRoute from "./auth";
import CourseRoute from "./course";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/courses", CourseRoute);

export default router;
