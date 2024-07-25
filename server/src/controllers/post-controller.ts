import { Request, Response } from "express";
import Post from "../models/post";

export default {
  createPost: async (req: Request, res: Response) => {
    try {
      const { userEmail, courseId, type, content, images, videos } = req.body;
      const post = new Post({
        userEmail,
        courseId,
        type,
        content,
        images,
        videos,
      });
      await post.save();
      res.status(201).json({ message: "Post created" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPosts: async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const posts = await Post.find({ courseId });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updatePost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { type, content, images, videos } = req.body;
      await Post.updateOne(
        { _id: postId },
        { type, content, images, videos, updateAt: Date.now() }
      );
      res.status(200).json({ message: "Post updated" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  commentPost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { userEmail, content } = req.body;
      const post = await Post.findOne({ _id: postId });

      if (post) {
        post.comments.push({ userEmail, content });
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
};
