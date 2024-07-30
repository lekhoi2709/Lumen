import mime from "mime-types";
import { Request, Response } from "express";
import supabase from "../supabaseClient";
import ShortUniqueId from "short-unique-id";

interface UserType {
  _id: string;
  role: string;
  email: string;
}

const checkUserRole = (user: UserType) =>
  user.role === "Teacher" || user.role === "Admin";

const handleErrorResponse = (res: Response, error: Error, statusCode = 500) => {
  res.status(statusCode).json({ message: error.message });
};

export default {
  uploadFiles: async (req: Request, res: Response) => {
    try {
      if (!req.user || typeof req.user === "string") {
        return res
          .status(403)
          .json({ message: "User information is missing or invalid" });
      }

      const user = req.user as UserType;
      if (!checkUserRole(user)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { courseId } = req.params;
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const urls = [];

      for (const file of files) {
        const mimeType = mime.lookup(file.originalname);
        if (!mimeType) {
          return res.status(400).json({ message: "Invalid file type" });
        }
        const { randomUUID } = new ShortUniqueId();
        const sanitizedFileName = file.originalname.replace(
          /[^a-zA-Z0-9.]/g,
          "_"
        );
        const filePath = `${courseId}/${randomUUID()}-${sanitizedFileName}`;
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(filePath, file.buffer, { contentType: mimeType.toString() });
        if (error) return handleErrorResponse(res, error);

        const publicUrlResponse = supabase.storage
          .from("uploads")
          .getPublicUrl(data.path);
        urls.push(publicUrlResponse.data.publicUrl);
      }

      res.status(200).json({ urls });
    } catch (error) {
      handleErrorResponse(res, error as Error);
    }
  },

  deleteFiles: async (req: Request, res: Response) => {
    try {
      if (!req.user || typeof req.user === "string") {
        return res
          .status(403)
          .json({ message: "User information is missing or invalid" });
      }

      const user = req.user as UserType;
      if (!checkUserRole(user)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const fileNames = req.body as string[];
      if (!fileNames || fileNames.length === 0) {
        return res.status(400).json({ message: "No files to delete" });
      }

      const { data, error } = await supabase.storage
        .from("uploads")
        .remove(fileNames);
      if (error) return handleErrorResponse(res, error);

      res.status(200).json({ message: "Files deleted successfully" });
    } catch (error) {
      handleErrorResponse(res, error as Error);
    }
  },
};
