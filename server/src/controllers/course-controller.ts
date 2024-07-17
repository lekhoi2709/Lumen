import { Request, Response } from "express";
import Course from "../models/course";

export default {
  getCourses: async (req: Request, res: Response) => {
    try {
      const role = req.params.role;
      const email = req.user?.email;

      if (role === "student") {
        const courses = await Course.find({
          students: {
            $elemMatch: { email: email },
          },
        });
        return res.status(200).json(courses);
      }

      if (role === "teacher") {
        const courses = await Course.find({ "instructor.email": email });
        return res.status(200).json(courses);
      }

      return res.status(400).json({ message: "Invalid role" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCourse: async (req: Request, res: Response) => {
    try {
      const course = await Course.findOne({ courseCode: req.params.id });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  createCourse: async (req: Request, res: Response) => {
    try {
      const { title, description, instructor } = req.body;
      const course = new Course({
        title,
        description,
        instructor,
      });
      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
