import mongoose from "mongoose";

enum PostType {
  Text,
  Image,
  Video,
  Mixed,
}

const postSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: PostType,
    default: "Text",
  },
  content: {
    type: String,
    default: "",
  },
  images: [
    {
      src: String,
      alt: String,
    },
  ],
  videos: [
    {
      src: String,
      thumbnail: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      userEmail: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
