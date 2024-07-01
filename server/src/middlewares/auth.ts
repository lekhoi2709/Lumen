import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = payload;

    next();
  } catch (error) {
    jwt.verify(token, process.env.JWT_SECRET || "", (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      req.user = user;
      next();
    });
  }
};
