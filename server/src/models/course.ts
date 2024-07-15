import mongoose from "mongoose";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId();

const courseSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: uid.rnd(),
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
  instructor: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
  },
  image: String,
  students: [{ name: String, email: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
