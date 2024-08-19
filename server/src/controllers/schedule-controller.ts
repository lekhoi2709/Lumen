import { Request, Response } from "express";
import Schedule from "../models/schedule";
import Post from "../models/post";

export default {
  getSchedules: async (req: Request, res: Response) => {
    try {
      const courseIds =
        req.user?.courses?.map((course: any) => course.code) ?? [];
      const schedules = await Schedule.find().populate("courseId", "title");
      const assignments = await Post.find({
        type: "Assignment",
        courseId: { $in: courseIds },
      }).populate("courseId", "title");
      res.status(200).json({ schedules, assignments });
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedules", error });
    }
  },

  createSchedule: async (req: Request, res: Response) => {
    try {
      const { courseId, instructorEmail, day, startTime, endTime, location } =
        req.body;
      const newSchedule = new Schedule({
        courseId,
        instructorEmail,
        day,
        startTime,
        endTime,
        location,
      });
      await newSchedule.save();
      res.status(201).json(newSchedule);
    } catch (error) {
      res.status(500).json({ message: "Error creating schedule", error });
    }
  },

  updateSchedule: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(updatedSchedule);
    } catch (error) {
      res.status(500).json({ message: "Error updating schedule", error });
    }
  },

  deleteSchedule: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Schedule.findByIdAndDelete(id);
      res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting schedule", error });
    }
  },
};
