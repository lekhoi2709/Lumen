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
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdUserEmail: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
