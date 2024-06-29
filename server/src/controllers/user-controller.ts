import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user";
import { log } from "console";

export default {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
            },
            process.env.JWT_SECRET || "",
            {
              expiresIn: "2h",
            }
          );

          return res.status(200).json({
            message: "Login successful",
            user: user.email,
            token,
          });
        }

        return res.status(401).json({
          message: "Password does not match",
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  register: async (req: Request, res: Response) => {
    const { lastName, firstName, email, password, avatarUrl } = req.body;

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }

      try {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hash,
          avatarUrl,
        });

        const newUser = await user.save();

        return res.status(201).json({
          message: "User created successfully",
          data: newUser,
        });
      } catch (error: any) {
        if (error.name === "MongoServerError" && error.code === 11000) {
          return res.status(409).json({
            message: "Email already exists",
          });
        }
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
    });
  },

  resetPassword: async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      bcrypt.hash(newPassword, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }

        user.password = hash;
        await user.save();

        return res.status(200).json({
          message: "Password updated successfully",
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
