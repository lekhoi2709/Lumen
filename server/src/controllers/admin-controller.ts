import { Request, Response } from "express";
import User from "../models/user";
import Course from "../models/course";

export default {
  // User CRUD Operations
  getUsersList: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    try {
      const users = await User.find().select("firstName lastName avatarUrl email role");

      return res.status(200).json({
        message: "Users list fetched successfully",
        data: {
          totalUsers: users.length,
          users: users,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { firstName, lastName, email, role },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    const { id } = req.params;

    try {
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  editRole: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    const { id } = req.params;
    const { newRole } = req.body;

    if (!newRole || !["Student", "Teacher"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = newRole;
      await user.save();

      return res
        .status(200)
        .json({ message: "User role updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Course CRUD Operations
  getCoursesList: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    try {
      const courses = await Course.find().select("title description");

      return res.status(200).json({
        message: "Courses list fetched successfully",
        data: {
          totalCourses: courses.length,
          courses: courses,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateCourse: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const course = await Course.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      return res.status(200).json({
        message: "Course updated successfully",
        data: course,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteCourse: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    const { id } = req.params;

    try {
      const course = await Course.findByIdAndDelete(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Dashboard stats
  getDashboardStats: async (req: Request, res: Response) => {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }

    try {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();

      // Fetch users and courses for detailed lists
      const usersList = await User.find().select("firstName lastName email");
      const coursesList = await Course.find().select("title description");

      return res.status(200).json({
        message: "Dashboard stats fetched successfully",
        data: {
          totalUsers,
          users: usersList,
          totalCourses,
          courses: coursesList,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
