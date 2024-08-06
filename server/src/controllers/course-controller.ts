import { Request, Response } from "express";
import Course from "../models/course";
import User from "../models/user";
import ShortUniqueId from "short-unique-id";
import Post from "../models/post";
import supabase from "../supabaseClient";

function getRandomImageUrl() {
  const imageUrls = [
    "https://xwoquihsuegkchtzpfdp.supabase.co/storage/v1/object/sign/Courses%20Image/Background%20Image/bg_1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDb3Vyc2VzIEltYWdlL0JhY2tncm91bmQgSW1hZ2UvYmdfMS5qcGciLCJpYXQiOjE3MjExNDA4NjQsImV4cCI6MTc1MjY3Njg2NH0.ogeMX3_EywyW6zWyhGON1U7n461EsnIvqcwxzeigsWg&t=2024-07-16T14%3A41%3A04.190Z",
    "https://xwoquihsuegkchtzpfdp.supabase.co/storage/v1/object/sign/Courses%20Image/Background%20Image/bg_2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDb3Vyc2VzIEltYWdlL0JhY2tncm91bmQgSW1hZ2UvYmdfMi5qcGciLCJpYXQiOjE3MjExNDEwOTEsImV4cCI6MTc1MjY3NzA5MX0.wf4kMI39PUM6sgtUp9bKjh7L2Xszr3M2FGYUZJ2u1-Y&t=2024-07-16T14%3A44%3A51.274Z",
    "https://xwoquihsuegkchtzpfdp.supabase.co/storage/v1/object/sign/Courses%20Image/Background%20Image/bg_3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDb3Vyc2VzIEltYWdlL0JhY2tncm91bmQgSW1hZ2UvYmdfMy5qcGciLCJpYXQiOjE3MjExNDA4NDksImV4cCI6MTc1MjY3Njg0OX0.QuEUyRMicKG2IBkm-wgzmKQ_5_MB1ED71O4pCxSREaA&t=2024-07-16T14%3A40%3A49.985Z",
  ];

  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

export default {
  getCourses: async (req: Request, res: Response) => {
    try {
      const email = req.user?.email;

      if (email) {
        const user = await User.findOne({ email });
        if (user) {
          const courses = await Course.find({
            _id: { $in: user.courses.map((course) => course.code) },
          });
          return res.status(200).json(courses);
        }
        return res.status(400).json({ message: "User not found" });
      }
      return res.status(400).json({ message: "Email not found" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCourse: async (req: Request, res: Response) => {
    try {
      const course = await Course.findOne({ _id: req.params.id });
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  createCourse: async (req: Request, res: Response) => {
    try {
      const { title, description, instructor } = req.body;
      const { randomUUID } = new ShortUniqueId();
      const imageUrl = getRandomImageUrl();
      const isTeacher = req.user?.role === "Teacher";
      const isAdmin = req.user?.role === "Admin";

      if (!isTeacher && !isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const course = new Course({
        _id: randomUUID(),
        title,
        description,
        image: imageUrl,
        createdUserEmail: instructor.email,
      });
      await course.save().then(async (data) => {
        const user = await User.findOne({ email: { $eq: instructor.email } });
        if (user) {
          user.courses.push({ code: data._id, role: "Teacher" });
          await user.save();
          res.status(201).json({ message: "Course created" });
        } else {
          return res.status(400).json({ message: "Instructor not found" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  joinCourse: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (email) {
        const course = await Course.findOne({ _id: id });

        if (course) {
          const user = await User.findOneAndUpdate(
            { email: { $eq: email }, "courses.code": { $ne: id } },
            {
              $push: { courses: { code: id, role: "Student" } },
            }
          );
          if (!user) {
            return res.status(400).json({ message: "User already joined" });
          }
          user.save();
          return res.status(200).json({ message: "Course joined" });
        }
        return res.status(400).json({ message: "Course not found" });
      }

      return res.status(400).json({ message: "Email not found" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCoursePeople: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const instructors = await User.find({
        courses: {
          $elemMatch: { code: id, role: { $in: ["Teacher", "Assistant"] } },
        },
      }).select("email firstName lastName avatarUrl");

      const students = await User.find({
        courses: { $elemMatch: { code: id, role: "Student" } },
      }).select("email firstName lastName avatarUrl");

      if (instructors && students) {
        return res
          .status(200)
          .json({ instructors: instructors, students: students });
      }

      if (instructors) {
        return res.status(200).json({ instructors: instructors, students: [] });
      }

      if (students) {
        return res.status(200).json({ instructors: [], students: students });
      }

      return res.status(400).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  addPeople: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { users, type } = req.body;
      const isAdmin = req.user?.role === "Admin";
      const isTeacher =
        req.user?.courses?.find((c) => c.code === id)?.role === "Teacher";
      const emails = users.map((user: any) => user.email);

      if (!isTeacher && !isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const checkExist = await User.find({
        email: { $in: emails },
        "courses.code": id,
      });

      if (checkExist.length > 0) {
        return res.status(409).json({
          message: "These emails have already been added to this course.",
        });
      }

      const updateUsers = await User.updateMany(
        { email: { $in: emails }, "courses.code": { $ne: id } },
        {
          $push: {
            courses: {
              code: id,
              role: type === "stu" ? "Student" : "Assistant",
            },
          },
        }
      );

      if (updateUsers) {
        return res.status(200).json({ message: "Added successfully" });
      }

      return res.status(400).json({ message: "Can not add these email" });
    } catch (error: any) {
      if (error.name === "MongoServerError" && error.code === 11000) {
        return res.status(409).json({
          message: "These emails have already been added to this course.",
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  removePeople: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { emails } = req.body;
      const isAdmin = req.user?.role === "Admin";
      const isTeacher =
        req.user?.courses?.find((c) => c.code === id)?.role === "Teacher";

      if (!isTeacher && !isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updateUsers = await User.updateMany(
        { email: { $in: emails }, "courses.code": id },
        {
          $pull: { courses: { code: id } },
        }
      );

      if (updateUsers) {
        return res.status(200).json({ message: "Removed successfully" });
      }

      return res.status(400).json({ message: "Can not remove these email" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteCourse: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = req.user;
      const course = await Course.findOneAndDelete({ _id: id });
      const isCourseOwner = course?.createdUserEmail === user?.email;
      const isAdmin = user?.role === "Admin";

      if (!isCourseOwner && !isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (
        isCourseOwner &&
        course &&
        course.createdUserEmail === req.user?.email
      ) {
        await User.updateMany(
          { "courses.code": id },
          {
            $pull: { courses: { code: id } },
          }
        );
        await Post.deleteMany({ courseId: id });

        return res.status(200).json({ message: "Course deleted" });
      }
      return res.status(400).json({ message: "Course not found" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  leaveCourse: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user =
        req.user &&
        (await User.findOneAndUpdate(
          {
            email: { $eq: req.user.email },
            "courses.code": { $eq: id },
            "courses.role": "Student",
          },
          {
            $pull: { courses: { code: id } },
          }
        ));

      if (user) {
        return res.status(200).json({ message: "Course left" });
      }
      return res.status(400).json({ message: "Course not found" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateCourse: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      if (typeof title !== "string" || typeof description !== "string") {
        return res.status(400).json({ message: "Invalid input" });
      }

      const updatedCourse = await Course.findOneAndUpdate(
        { _id: { $eq: id } },
        {
          title: title,
          description: description,
        },
        {
          new: true,
        }
      );

      if (updatedCourse) {
        return res.status(200).json({ message: "Course updated" });
      }
      return res.status(400).json({ message: "Course not found" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteAllFilesInCourse: async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { data: list, error } = await supabase.storage
        .from("uploads")
        .list(courseId);

      if (error) {
        return res.status(400).json({ message: "Failed to delete files" });
      }

      if (list) {
        const filesToDelete = list.map((file) => courseId + "/" + file.name);
        const { data, error } = await supabase.storage
          .from("uploads")
          .remove(filesToDelete);

        if (error) {
          return res.status(400).json({ message: "Failed to delete files" });
        }

        return res.status(200).json({ message: "Files deleted" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
