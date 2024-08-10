import { Request, Response } from "express";
import Post from "../models/post";

export default {
  createPost: async (req: Request, res: Response) => {
    try {
      const { courseId, postData } = req.body;
      const post = new Post({
        user: {
          email: postData.user.email,
          firstName: postData.user.firstName,
          lastName: postData.user.lastName,
          avatarUrl: postData.user.avatarUrl,
        },
        courseId,
        type: postData.type,
        title: postData.title,
        text: postData.text,
        files: postData.files,
        dueDate: postData.dueDate,
      });
      await post.save();
      res.status(201).json({ message: "Post created" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPosts: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const posts = await Post.aggregate([
        { $match: { courseId: id } },
        { $sort: { createdAt: -1 } },
        {
          $addFields: {
            comments: {
              $sortArray: {
                input: "$comments",
                sortBy: { createdAt: -1 },
              },
            },
          },
        },
      ]).exec();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAssignment: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const post = await Post.findOne({ _id: { $eq: postId } });

      if (post) {
        res.status(200).json(post);
      } else {
        res.status(400).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updatePost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { postData } = req.body;
      await Post.updateOne(
        { _id: { $eq: postId } },
        {
          title: postData.title,
          type: postData.type,
          text: postData.text,
          updatedAt: Date.now(),
          dueDate: postData.dueDate,
        }
      );
      res.status(200).json({ message: "Post updated" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  commentPost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { user, text } = req.body;
      const post = await Post.findOne({ _id: postId });

      if (post) {
        post.comments.push({
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
          },
          text,
        });
        await post.save();
        res.status(201).json({ message: "Comment added" });
      } else {
        res.status(400).json({ message: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deletePost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      await Post.deleteOne({ _id: postId });
      res.status(200).json({ message: "Post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteComment: async (req: Request, res: Response) => {
    try {
      const { postId, commentId } = req.params;
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { comments: { _id: commentId } } }
      );
      return res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
