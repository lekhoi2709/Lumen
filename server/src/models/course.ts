import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: Number,
  instructors: [{ name: String, email: String, avatarUrl: String }],
  image: {
    type: String,
  },
  students: [{ name: String, email: String, avatarUrl: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
