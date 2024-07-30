import mongoose from "mongoose";

enum PostType {
  Text,
  Image,
  Video,
  Document,
  Mixed,
}

const postSchema = new mongoose.Schema({
  user: {
    email: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    avatarUrl: String,
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
  text: {
    type: String,
    default: "",
  },
  images: [
    {
      src: String,
      name: String,
    },
  ],
  videos: [
    {
      src: String,
      name: String,
    },
  ],
  documents: [
    {
      src: String,
      name: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      user: {
        email: {
          type: String,
          required: true,
        },
        firstName: String,
        lastName: String,
        avatarUrl: String,
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
