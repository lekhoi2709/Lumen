import mongoose from "mongoose";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });
function getRandomImageUrl() {
  const imageUrls = [
    "https://xwoquihsuegkchtzpfdp.supabase.co/storage/v1/object/sign/Courses%20Image/Background%20Image/bg_1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDb3Vyc2VzIEltYWdlL0JhY2tncm91bmQgSW1hZ2UvYmdfMS5qcGciLCJpYXQiOjE3MjExNDA4NjQsImV4cCI6MTc1MjY3Njg2NH0.ogeMX3_EywyW6zWyhGON1U7n461EsnIvqcwxzeigsWg&t=2024-07-16T14%3A41%3A04.190Z",
    "https://xwoquihsuegkchtzpfdp.supabase.co/storage/v1/object/sign/Courses%20Image/Background%20Image/bg_2.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDb3Vyc2VzIEltYWdlL0JhY2tncm91bmQgSW1hZ2UvYmdfMi5qcGciLCJpYXQiOjE3MjExNDEwOTEsImV4cCI6MTc1MjY3NzA5MX0.wf4kMI39PUM6sgtUp9bKjh7L2Xszr3M2FGYUZJ2u1-Y&t=2024-07-16T14%3A44%3A51.274Z",
    "https://xwoquihsuegkchtzpfdp.supabase.co/storage/v1/object/sign/Courses%20Image/Background%20Image/bg_3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDb3Vyc2VzIEltYWdlL0JhY2tncm91bmQgSW1hZ2UvYmdfMy5qcGciLCJpYXQiOjE3MjExNDA4NDksImV4cCI6MTc1MjY3Njg0OX0.QuEUyRMicKG2IBkm-wgzmKQ_5_MB1ED71O4pCxSREaA&t=2024-07-16T14%3A40%3A49.985Z",
  ];

  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

const courseSchema = new mongoose.Schema({
  classCode: {
    type: String,
    unique: true,
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
    name: { type: String },
    email: { type: String },
  },
  image: String,
  students: [{ name: String, email: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.pre("save", function (next) {
  if (!this.classCode) {
    this.classCode = uid.rnd();
  }

  if (!this.image) {
    this.image = getRandomImageUrl();
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
