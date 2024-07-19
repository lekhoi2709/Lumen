import { Request, Response } from "express";
import Course from "../models/course";
import User from "../models/user";
import ShortUniqueId from "short-unique-id";

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
            _id: { $in: user.coursesCode },
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
    // try {
    const { title, description, instructor } = req.body;
    const { randomUUID } = new ShortUniqueId();
    const imageUrl = getRandomImageUrl();

    const course = new Course({
      _id: randomUUID(),
      title,
      description,
      image: imageUrl,
    });
    course.instructors.push(instructor);
    await course.save().then(async (data) => {
      const user = await User.findOne({ email: instructor.email });
      if (user) {
        user.coursesCode.push(data._id);
        await user.save();
        console.log(user);
        res.status(201).json({ message: "Course created" });
      } else {
        return res.status(400).json({ message: "Instructor not found" });
      }
    });
    // } catch (error) {
    //   res.status(500).json({ message: error });
    // }
  },
};
