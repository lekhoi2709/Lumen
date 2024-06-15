import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";

interface CustomSessionData extends Session {
  user: string | jwt.JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")!.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req.session as CustomSessionData).user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
