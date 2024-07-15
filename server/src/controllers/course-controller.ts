import { Request, Response } from "express";
import Course from "../models/course";

export default {
  getCourses: async (req: Request, res: Response) => {
    try {
      const courses = await Course.find();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCourse: async (req: Request, res: Response) => {
    try {
      const course = await Course.findById(req.params.id);
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  createCourse: async (req: Request, res: Response) => {
    try {
      const { title, description, instructor, image, students } = req.body;
      const course = new Course({
        title,
        description,
        instructor,
        image,
        students,
      });
      await course.save();
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
