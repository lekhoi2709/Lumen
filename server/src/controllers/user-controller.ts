import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user";
import { generateRefreshToken, verifyJWT } from "../utils/jwt";

export default {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: { $eq: email } }).exec();

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      bcrypt.compare(password, user.password!, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
          });
        }

        if (result) {
          const accessToken = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              role: user.role,
              avatarUrl: user.avatarUrl,
              firstName: user.firstName,
              lastName: user.lastName,
              courses: user.courses,
            },
            process.env.JWT_SECRET || "",
            {
              expiresIn: "2h",
            }
          );
          user.accessToken = accessToken;
          user.save();

          const refreshToken = generateRefreshToken(user.email);

          return res.status(200).json({
            message: "Login successful",
            token: accessToken,
            refreshToken,
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

  refresh: async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    try {
      const decoded: any = await verifyJWT(refreshToken);

      if (!decoded) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          firstName: user.firstName,
          lastName: user.lastName,
          courses: user.courses,
        },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "2h",
        }
      );
      user.accessToken = token;
      user.save();

      return res.status(200).json({
        message: "Token refreshed",
        user: {
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          firstName: user.firstName,
          lastName: user.lastName,
          courses: user.courses,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    (req.session as any).userData = null;
    req.user = null;

    return res.status(200).json({
      message: "Logout successful",
    });
  },

  register: async (req: Request, res: Response) => {
    const { lastName, firstName, email, password, avatarUrl, role } = req.body;

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
          role,
        });

        const newUser = await user.save();

        return res.status(201).json({
          message: "Account created successfully",
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
      const user = await User.findOne({ email: { $eq: email } });

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

        if (hash === user.password) {
          return res.status(400).json({
            message: "New password must be different from the current password",
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

  getSearchedUser: async (req: Request, res: Response) => {
    const { data } = req.params;

    try {
      const user = await User.find({
        email: { $regex: data, $options: "i" },
      })
        .select("email firstName lastName avatarUrl")
        .limit(5);
      if (user.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.status(200).json({
        message: "User found",
        users: user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};
