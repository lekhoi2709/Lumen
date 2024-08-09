import mongoose from "mongoose";

enum PostType {
  Post,
  Assignment,
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
    default: "Post",
  },
  title: String,
  text: {
    type: String,
    default: "",
  },
  files: [
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
  dueDate: {
    type: String,
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
