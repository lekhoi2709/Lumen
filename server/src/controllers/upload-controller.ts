import mime from "mime-types";
import { Request, Response } from "express";
import upload from "../config/multer-config";
import supabase from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

interface UserType {
  _id: string;
  role: string;
  email: string;
}

const checkUserRole = (user: UserType) =>
  user.role === "Teacher" || user.role === "Admin";

const handleErrorResponse = (res: Response, error: Error, statusCode = 500) => {
  res.status(statusCode).json({ error: error.message });
};

export const uploadFiles = [
  upload.array("files", 10),
  async (req: Request, res: Response) => {
    try {
      if (!req.user || typeof req.user === "string") {
        return res
          .status(403)
          .json({ error: "User information is missing or invalid" });
      }

      const user = req.user as UserType;
      if (!checkUserRole(user)) {
        return res.status(403).json({ error: "Access denied" });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const userId = user._id;
      const urls = [];

      for (const file of files) {
        const sanitizedFileName = file.originalname.replace(
          /[^a-zA-Z0-9.-]/g,
          "_"
        );
        const filePath = `${userId}/${uuidv4()}_${sanitizedFileName}`;

        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(filePath, file.buffer);
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
];

export const listFiles = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string") {
      return res
        .status(403)
        .json({ error: "User information is missing or invalid" });
    }

    const user = req.user as UserType;
    if (!checkUserRole(user)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const { data, error } = await supabase.storage
      .from("uploads")
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) return handleErrorResponse(res, error);

    res.status(200).json(data);
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
};

export const getFile = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string") {
      return res
        .status(403)
        .json({ error: "User information is missing or invalid" });
    }

    const user = req.user as UserType;
    if (!checkUserRole(user)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { userId, fileName } = req.params;
    if (!userId || !fileName) {
      return res.status(400).json({ error: "User ID or File Name is missing" });
    }

    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .download(filePath);
    if (error) return handleErrorResponse(res, error);

    if (!data) return res.status(404).json({ error: "File not found" });

    const contentType = mime.lookup(filePath) || "application/octet-stream";
    const buffer = await data.arrayBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filePath.split("/").pop()}"`
    );
    res.setHeader("Content-Type", contentType);
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string") {
      return res
        .status(403)
        .json({ error: "User information is missing or invalid" });
    }

    const user = req.user as UserType;
    if (!checkUserRole(user)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { userId, fileName } = req.params;
    if (!userId || !fileName) {
      return res.status(400).json({ error: "User ID or File Name is missing" });
    }

    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .remove([filePath]);
    if (error) return handleErrorResponse(res, error);

    res.status(200).json({ message: "File deleted successfully", data });
  } catch (error) {
    handleErrorResponse(res, error as Error);
  }
};
