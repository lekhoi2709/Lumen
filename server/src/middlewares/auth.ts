import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")!.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({
      email: (decoded as jwt.JwtPayload).email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    (req as any).user = user.email;
    (req as any).token = token;
    next();
  } catch (error: any) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
